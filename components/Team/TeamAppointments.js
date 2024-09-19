import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { db } from '../../utils/firebase';
import { collection, getDocs, query, where, doc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { format as formatDateFn } from 'date-fns';
import axios from 'axios';
import EditAppointment from './EditAppointment';
import RescheduleAppointment from './RescheduleAppointment';
import { setBusinessId } from '../../redux/slices/userSlice';

const ViewAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isRescheduling, setIsRescheduling] = useState(false);

  const dispatch = useDispatch();
  const businessId = useSelector((state) => state.user.businessId);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('User ID:', user.uid);
        console.log('User displayName:', user.displayName); // Log the displayName
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (businessId && userId) {
      console.log('Fetching appointments for Business ID:', businessId, 'and User ID:', userId);
      fetchAppointments(businessId, userId);
    }
  }, [businessId, userId]);

  const fetchAppointments = async (businessId, userId) => {
    setIsLoading(true);
    try {
      const q = query(
        collection(db, 'appointments'),
        where('businessId', '==', businessId),
        where('status', '==', 'booked')
      );
      const querySnapshot = await getDocs(q);
      const appointmentsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log('Appointments Data before filtering:', appointmentsData);

      const filteredAppointments = appointmentsData.filter((appointment) =>
        appointment.teamMemberData.some((member) => member.id === userId)
      );

      console.log('Filtered Appointments Data:', filteredAppointments);

      if (filteredAppointments.length === 0) {
        setErrorMessage('No appointments found for the selected business and user.');
      } else {
        setErrorMessage('');
      }
      setAppointments(filteredAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error.message);
      setErrorMessage('Failed to fetch appointments. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      const appointmentToCancel = appointments.find((appointment) => appointment.id === appointmentId);
      await deleteDoc(doc(db, 'appointments', appointmentId));
      alert('Appointment canceled successfully!');

      // Determine who is making the change
      const auth = getAuth();
      const user = auth.currentUser;
      const actor = user?.displayName || 'A team member'; // Ensure displayName is used if available
      const actorRole = 'team';

      console.log('Actor (Team Member Name):', actor); // Log actor for debugging

      // Send email notification after cancellation
      await axios.post('/api/sendEmail', {
        customerEmail: appointmentToCancel.customerEmail,
        customerName: appointmentToCancel.customerName,
        appointment: appointmentToCancel,
        action: 'canceled',
        actor: actor,
        actorRole: actorRole,
      });

      fetchAppointments(businessId, userId);
    } catch (error) {
      console.error('Error canceling appointment:', error.message);
      alert('Failed to cancel appointment. Please try again.');
    }
  };

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleRescheduleAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setIsRescheduling(true);
  };

  const handleUpdate = async (updatedAppointment) => {
    console.log('Received updatedAppointment:', updatedAppointment);

    if (!updatedAppointment || !updatedAppointment.id) {
      console.error('Invalid appointment data:', updatedAppointment);
      alert('Failed to update appointment. Invalid data.');
      return;
    }

    try {
      // Determine who is making the change
      const auth = getAuth();
      const user = auth.currentUser;
      const actor = user?.displayName || 'A team member'; // Ensure displayName is used if available
      const actorRole = 'team';

      console.log('Actor (Team Member Name):', actor); // Log actor for debugging

      // Send an email notification after the update
      await axios.post('/api/sendEmail', {
        customerEmail: updatedAppointment.customerEmail,
        customerName: updatedAppointment.customerName,
        appointment: updatedAppointment,
        action: 'updated',
        actor: actor, // Pass the team member's name as actor
        actorRole: actorRole,
      });

      fetchAppointments(businessId, userId);
      setSelectedAppointment(null);
      setIsRescheduling(false);
    } catch (error) {
      console.error('Error updating appointment:', error.message);
      alert('Failed to update appointment. Please try again.');
    }
  };

  const handleCloseEdit = () => {
    setSelectedAppointment(null);
    setIsRescheduling(false);
  };

  const formatDate = (date) => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      console.error('Invalid date value:', date);
      return 'Invalid date'; // Fallback for invalid dates
    }
    return formatDateFn(parsedDate, 'dd/MM/yyyy');
  };

  const formatTime = (time) => {
    if (!time || !time.includes(':')) {
      console.error('Invalid time value:', time);
      return 'Invalid time'; // Fallback for invalid times
    }

    const [hours, minutes] = time.split(':');
    const formattedHours = parseInt(hours) % 12 || 12;
    const period = parseInt(hours) >= 12 ? 'PM' : 'AM';
    return `${formattedHours}:${minutes} ${period}`;
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-xl border-t-4 border-purple-500">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">View Appointments</h2>
  
        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <>
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 border border-red-300 rounded">
                {errorMessage}
              </div>
            )}
  
            <div className="mt-8">
              <ul className="space-y-6">
                {appointments.map((appointment, index) => (
                  <li
                    key={appointment.id}
                    className={`p-6 rounded-lg shadow-md border-2 ${
                      index % 2 === 0
                        ? 'border-purple-500'
                        : 'border-orange-500'
                    } bg-white`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center mb-4">
                      <div className="flex-1 mb-4 md:mb-0">
                        <h3 className="text-lg font-semibold text-gray-800">
                          Appointment ID: {appointment.id}
                        </h3>
                      </div>
                      <div className="flex-1 md:flex md:justify-end">
                        <div className="flex flex-wrap gap-2">
                          {appointment.teamMemberData &&
                            appointment.teamMemberData.map((member) => (
                              <span
                                key={member.id}
                                className="bg-purple-100 text-purple-700 py-1 px-3 rounded-full text-sm"
                              >
                                {member.displayName}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
  
                    <table className="min-w-full text-left text-gray-600 mb-4">
                      <tbody>
                        <tr className="border-b">
                          <th className="py-2 px-4 font-medium text-gray-800">Date:</th>
                          <td className="py-2 px-4">{formatDate(appointment.date)}</td>
                        </tr>
                        <tr className="border-b">
                          <th className="py-2 px-4 font-medium text-gray-800">Time:</th>
                          <td className="py-2 px-4">{formatTime(appointment.time)}</td>
                        </tr>
                        <tr className="border-b">
                          <th className="py-2 px-4 font-medium text-gray-800">Status:</th>
                          <td className={`py-2 px-4 font-semibold ${appointment.status === 'booked' ? 'text-green-600' : ''}`}>
                            {appointment.status}
                          </td>
                        </tr>
                        <tr className="border-b">
                          <th className="py-2 px-4 font-medium text-gray-800">Customer Name:</th>
                          <td className="py-2 px-4">{appointment.customerName}</td>
                        </tr>
                        <tr className="border-b">
                          <th className="py-2 px-4 font-medium text-gray-800">Customer Email:</th>
                          <td className="py-2 px-4">{appointment.customerEmail}</td>
                        </tr>
                        <tr className="border-b">
                          <th className="py-2 px-4 font-medium text-gray-800">Customer Phone:</th>
                          <td className="py-2 px-4">{appointment.customerPhone}</td>
                        </tr>
                        <tr className="border-b">
                          <th className="py-2 px-4 font-medium text-gray-800">Service Name:</th>
                          <td className="py-2 px-4">{appointment.name}</td>
                        </tr>
                        <tr className="border-b">
                          <th className="py-2 px-4 font-medium text-gray-800">Service Description:</th>
                          <td className="py-2 px-4">{appointment.description}</td>
                        </tr>
                        <tr>
                          <th className="py-2 px-4 font-medium text-gray-800">Service Duration:</th>
                          <td className="py-2 px-4">{appointment.duration}</td>
                        </tr>
                      </tbody>
                    </table>
  
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleEditAppointment(appointment)}
                        className="bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleRescheduleAppointment(appointment)}
                        className="bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={() => handleCancelAppointment(appointment.id)}
                        className="bg-white text-black py-2 px-3 rounded border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        Cancel Appointment
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
        {selectedAppointment && !isRescheduling && (
          <EditAppointment appointment={selectedAppointment} onClose={handleCloseEdit} onUpdate={handleUpdate} />
        )}
        {selectedAppointment && isRescheduling && (
          <RescheduleAppointment appointment={selectedAppointment} onClose={handleCloseEdit} onUpdate={handleUpdate} />
        )}
      </div>
    </div>
  );     
};

export default ViewAppointments;

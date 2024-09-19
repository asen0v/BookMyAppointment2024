import React, { useState, useEffect } from 'react';
import { db } from '../../utils/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { format as formatDateFn, parseISO, format } from 'date-fns'; // Import date-fns for date and time formatting

const ViewAppointments = () => {
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const businessesSnapshot = await getDocs(collection(db, 'businesses'));
        const businessesData = businessesSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setBusinesses(businessesData);
      } catch (error) {
        console.error('Error fetching businesses:', error.message);
      }
    };

    fetchBusinesses();
  }, []);

  const fetchAppointments = async (businessId, customerEmail) => {
    try {
      const q = query(
        collection(db, 'appointments'),
        where('businessId', '==', businessId),
        where('customerEmail', '==', customerEmail),
        where('status', '==', 'booked')
      );
      const querySnapshot = await getDocs(q);
      const appointmentsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        customerEmail: doc.data().customerEmail,
        customerName: doc.data().customerName,
        customerPhone: doc.data().customerPhone,
        teamMemberData: doc.data().teamMemberData || [],
        date: doc.data().date,
        time: doc.data().time,
        status: doc.data().status,
        description: doc.data().description,
        duration: doc.data().duration,
        ...doc.data(),
      }));

      if (appointmentsData.length === 0) {
        setErrorMessage('No appointments found for the given business and customer email.');
      } else {
        setErrorMessage('');
      }
      setAppointments(appointmentsData);
    } catch (error) {
      console.error('Error fetching appointments:', error.message);
      setErrorMessage(
        'Failed to fetch appointments. Please check the selected business and customer email, and try again.'
      );
    }
  };

  const handleFetchAppointments = () => {
    if (selectedBusinessId.trim() === '' || customerEmail.trim() === '') {
      setErrorMessage('Please select a business and enter a valid customer email.');
      return;
    }
    fetchAppointments(selectedBusinessId, customerEmail);
  };

  // Helper function to format date
  const formatDate = (date) => {
    try {
      return formatDateFn(parseISO(date), 'dd/MM/yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  // Helper function to format time as hh:mm AM/PM
  const formatTime = (time) => {
    try {
      const parsedTime = parseISO(`1970-01-01T${time}:00`); // Parse time as ISO
      return format(parsedTime, 'hh:mm aa'); // Format as hh:mm AM/PM
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Invalid time';
    }
  };

  // Helper function to format Team Member Names
  const formatTeamMemberNames = (teamMembers) => {
    if (!Array.isArray(teamMembers) || teamMembers.length === 0) {
      return <span className="text-red-600">No Team Members available</span>;
    }
    return (
      <div className="flex flex-wrap gap-2">
        {teamMembers.map((member, index) => (
          <span key={index} className="bg-blue-100 text-blue-700 py-1 px-3 rounded-full text-sm">
            {member.displayName}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-xl mb-10 border-t-4 border-blue-500">
        <h2 className="text-3xl font-semibold text-black mb-4">View Appointments</h2>

        <div className="mb-6">
          <label htmlFor="business-select" className="block text-black font-medium mb-2">
            Select Business:
          </label>
          <select
            id="business-select"
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedBusinessId}
            onChange={(e) => setSelectedBusinessId(e.target.value)}
          >
            <option value="">Select a business</option>
            {businesses.map((business) => (
              <option key={business.id} value={business.id}>
                {business.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="customer-email-input" className="block text-black font-medium mb-2">
            Enter Customer Email:
          </label>
          <input
            type="email"
            id="customer-email-input"
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            placeholder="Enter customer email"
          />
        </div>

        <button
          type="button"
          className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleFetchAppointments}
        >
          Load Appointments
        </button>

        {errorMessage && (
          <div className="mt-6 p-4 bg-red-100 text-red-700 border border-red-300 rounded">
            {errorMessage}
          </div>
        )}

        <div className="mt-8">
          <ul className="space-y-6">
            {appointments.map((appointment) => (
              <li key={appointment.id} className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
                  <div className="md:w-1/2">
                    <h3 className="text-lg font-semibold text-black">Appointment ID:</h3>
                    <p className="text-gray-600">{appointment.id}</p>
                  </div>
                  <div className="md:w-1/2">
                    <h3 className="text-lg font-semibold text-black">Team Members:</h3>
                    {formatTeamMemberNames(appointment.teamMemberData)}
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-black">Date:</h3>
                  <p className="text-gray-600">{formatDate(appointment.date)}</p>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-black">Time:</h3>
                  <p className="text-gray-600">{formatTime(appointment.time)}</p>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-black">Status:</h3>
                  <p className={`font-semibold ${appointment.status === 'booked' ? 'text-green-600' : 'text-red-600'}`}>
                    {appointment.status}
                  </p>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-black">Customer Name:</h3>
                  <p className="text-gray-600">{appointment.customerName}</p>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-black">Customer Email:</h3>
                  <p className="text-gray-600">{appointment.customerEmail}</p>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-black">Customer Phone:</h3>
                  <p className="text-gray-600">{appointment.customerPhone}</p>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-black">Service Name:</h3>
                  <p className="text-gray-600">{appointment.name}</p>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-black">Service Description:</h3>
                  <p className="text-gray-600">{appointment.description}</p>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-black">Service Duration:</h3>
                  <p className="text-gray-600">{appointment.duration}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ViewAppointments;

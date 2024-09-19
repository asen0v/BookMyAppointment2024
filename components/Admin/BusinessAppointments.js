import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { db } from '../../utils/firebase';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  query,
  where,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';

const BusinessAvailabilityManager = ({ selectedBusiness }) => {
  const [businessAvailability, setBusinessAvailability] = useState([]);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedBusinessAvailability, setSelectedBusinessAvailability] = useState('');
  const [workingHours, setWorkingHours] = useState({
    start: '09:00',
    end: '18:00',
  });
  const [breaks, setBreaks] = useState([]);
  const [newBreak, setNewBreak] = useState({ start: '', end: '' });
  const [appointments, setAppointments] = useState([]);

  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  useEffect(() => {
    if (selectedBusiness) {
      const businessRef = doc(db, 'businesses', selectedBusiness.id);
      const unsubscribe = onSnapshot(businessRef, (docSnapshot) => {
        const data = docSnapshot.data();
        if (data?.BusinessAvailability) {
          const availability = daysOfWeek.map(day => ({
            id: day,
            day,
            BusinessAvailability: data.BusinessAvailability[day]?.status || 'Not available',
            hours: data.BusinessAvailability[day]?.hours || { start: '09:00', end: '18:00' },
            breaks: data.BusinessAvailability[day]?.breaks || [],
          }));
          setBusinessAvailability(availability);
          if (selectedDay) {
            setBreaks(data.BusinessAvailability[selectedDay]?.breaks || []);
          }
        } else {
          setBusinessAvailability([]);
        }
      });

      return () => unsubscribe();
    }
  }, [selectedBusiness, selectedDay]);

  useEffect(() => {
    fetchAppointments(); // Fetch appointments for the calendar
  }, [selectedBusiness]);

  const fetchAppointments = async () => {
    try {
      const appointmentsQuery = query(collection(db, 'appointments'), where('businessId', '==', selectedBusiness.id));
      const appointmentsSnapshot = await getDocs(appointmentsQuery);

      const appointmentsData = appointmentsSnapshot.docs.map(doc => doc.data());
      setAppointments(appointmentsData);
    } catch (error) {
      console.error('Error fetching appointments:', error.message);
    }
  };

  const handleSetBusinessAvailability = async () => {
    if (!selectedBusiness || !selectedDay || !selectedBusinessAvailability) {
      alert('Please select a day and set business availability.');
      return;
    }

    try {
      const businessRef = doc(db, 'businesses', selectedBusiness.id);
      await updateDoc(businessRef, {
        [`BusinessAvailability.${selectedDay}`]: {
          status: selectedBusinessAvailability,
          hours: selectedBusinessAvailability === 'Available' ? workingHours : { start: '09:00', end: '18:00' },
          breaks: selectedBusinessAvailability === 'Available' ? breaks : [],
        },
      });

      alert('Business availability, working hours, and breaks set successfully!');
      setSelectedDay('');
      setSelectedBusinessAvailability('');
      setWorkingHours({ start: '09:00', end: '18:00' });
      setBreaks([]);
    } catch (error) {
      console.error('Error setting business availability:', error.message);
      alert('Failed to set business availability. Please try again.');
    }
  };

  const handleToggleBusinessAvailability = async (availabilityId, currentStatus) => {
    const newStatus = currentStatus === 'Available' ? 'Not available' : 'Available';
    try {
      const businessRef = doc(db, 'businesses', selectedBusiness.id);
      await updateDoc(businessRef, {
        [`BusinessAvailability.${availabilityId}`]: {
          status: newStatus,
          hours: newStatus === 'Available' ? workingHours : { start: '09:00', end: '18:00' },
          breaks: newStatus === 'Available' ? breaks : [],
        },
      });

      alert(`Business availability updated to ${newStatus} successfully!`);
    } catch (error) {
      console.error('Error updating business availability:', error.message);
      alert('Failed to update business availability. Please try again.');
    }
  };

  const handleWorkingHoursChange = (e) => {
    const { name, value } = e.target;
    setWorkingHours((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewBreakChange = (e) => {
    const { name, value } = e.target;
    setNewBreak((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addBreak = () => {
    if (newBreak.start && newBreak.end) {
      const start = new Date(`1970-01-01T${newBreak.start}:00`);
      const end = new Date(`1970-01-01T${newBreak.end}:00`);

      const hasOverlap = breaks.some(brk => {
        const brkStart = new Date(`1970-01-01T${brk.start}:00`);
        const brkEnd = new Date(`1970-01-01T${brk.end}:00`);
        return (start < brkEnd && end > brkStart);
      });

      if (hasOverlap) {
        alert('This break overlaps with an existing break. Please choose a different time.');
        return;
      }

      const updatedBreaks = [...breaks, newBreak];
      setBreaks(updatedBreaks);

      updateBreaksInFirestore(updatedBreaks);

      setNewBreak({ start: '', end: '' });
    } else {
      alert('Please enter both start and end times for the break.');
    }
  };

  const updateBreaksInFirestore = async (updatedBreaks) => {
    if (!selectedBusiness || !selectedDay) return;

    try {
      const businessRef = doc(db, 'businesses', selectedBusiness.id);
      await updateDoc(businessRef, {
        [`BusinessAvailability.${selectedDay}.breaks`]: updatedBreaks,
      });
    } catch (error) {
      console.error('Error updating breaks in Firestore:', error.message);
      alert('Failed to update breaks. Please try again.');
    }
  };

  const handleRemoveBreak = (breakIndex) => {
    const updatedBreaks = breaks.filter((_, index) => index !== breakIndex);
    setBreaks(updatedBreaks);

    updateBreaksInFirestore(updatedBreaks);
  };

  // Function to determine which dates are available
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
      const dayAvailability = businessAvailability.find(item => item.day === dayOfWeek);
      if (dayAvailability && dayAvailability.BusinessAvailability === 'Available') {
        return 'bg-green-200'; // CSS class to highlight available dates
      }
    }
    return null;
  };

  // Function to determine which dates have appointments
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const formattedDate = date.toISOString().split('T')[0];
      if (appointments.some(appointment => appointment.date === formattedDate)) {
        return <div className="dot"></div>;
      }
    }
    return null;
  };

  return (
    <div className="container mx-auto p-12 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-black">Business Availability</h1>
  
      {/* Set Business Availability Card */}
      <div className="max-w-4xl mx-auto bg-white p-4 rounded-lg shadow-lg mb-8 border-t-4 border-purple-500">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Set Business Availability</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="col-span-1">
            <label htmlFor="day" className="block text-gray-700 text-sm font-bold mb-1">Day</label>
            <select
              id="day"
              className="appearance-none block w-full bg-white text-gray-700 border border-black rounded py-2 px-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
            >
              <option value="">Select a day</option>
              {daysOfWeek.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
          <div className="col-span-1">
            <label htmlFor="BusinessAvailability" className="block text-gray-700 text-sm font-bold mb-1">Availability</label>
            <select
              id="BusinessAvailability"
              className="appearance-none block w-full bg-white text-gray-700 border border-black rounded py-2 px-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              value={selectedBusinessAvailability}
              onChange={(e) => {
                const newValue = e.target.value;
                setSelectedBusinessAvailability(newValue);
                if (newValue === 'Not available') {
                  setWorkingHours({ start: '09:00', end: '18:00' });
                  setBreaks([]);
                }
              }}
            >
              <option value="">Select Availability</option>
              <option value="Available">Available</option>
              <option value="Not available">Not Available</option>
            </select>
          </div>
        </div>
        {selectedBusinessAvailability === 'Available' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="col-span-1">
                <label htmlFor="start" className="block text-gray-700 text-sm font-bold mb-1">Start</label>
                <input
                  id="start"
                  name="start"
                  type="time"
                  className="appearance-none block w-full bg-white text-gray-700 border border-black rounded py-2 px-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  value={workingHours.start}
                  onChange={handleWorkingHoursChange}
                />
              </div>
              <div className="col-span-1">
                <label htmlFor="end" className="block text-gray-700 text-sm font-bold mb-1">End</label>
                <input
                  id="end"
                  name="end"
                  type="time"
                  className="appearance-none block w-full bg-white text-gray-700 border border-black rounded py-2 px-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  value={workingHours.end}
                  onChange={handleWorkingHoursChange}
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-1">Breaks</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <div className="col-span-1">
                  <label htmlFor="breakStart" className="block text-gray-700 text-sm font-bold mb-1">Start</label>
                  <input
                    id="breakStart"
                    name="start"
                    type="time"
                    className="appearance-none block w-full bg-white text-gray-700 border border-black rounded py-2 px-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    value={newBreak.start}
                    onChange={handleNewBreakChange}
                  />
                </div>
                <div className="col-span-1">
                  <label htmlFor="breakEnd" className="block text-gray-700 text-sm font-bold mb-1">End</label>
                  <input
                    id="breakEnd"
                    name="end"
                    type="time"
                    className="appearance-none block w-full bg-white text-gray-700 border border-black rounded py-2 px-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    value={newBreak.end}
                    onChange={handleNewBreakChange}
                  />
                </div>
              </div>
              <button
                type="button"
                className="bg-orange-600 text-white py-1.5 px-4 rounded text-sm hover:bg-orange-700 focus:outline-none focus:shadow-outline"
                onClick={addBreak}
              >
                Add Break
              </button>
            </div>
          </>
        )}
        <button
          type="button"
          className="bg-orange-600 text-white py-1.5 px-4 rounded text-sm hover:bg-orange-700 focus:outline-none focus:shadow-outline"
          onClick={handleSetBusinessAvailability}
        >
          Set Availability
        </button>
      </div>
  
      {/* Available Dates Card */}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg border-t-4 border-purple-500">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Available Dates</h2>
        <Calendar
          tileClassName={tileClassName}
          tileContent={tileContent}
        />
      </div>
    </div>
  );
};

export default BusinessAvailabilityManager;









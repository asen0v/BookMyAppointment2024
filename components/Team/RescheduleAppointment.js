import React, { useState } from 'react';
import { db } from '../../utils/firebase';
import { updateDoc, doc } from 'firebase/firestore';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const RescheduleAppointment = ({ appointment, onClose, onUpdate }) => {
  const [date, setDate] = useState(new Date(appointment.date));
  const [time, setTime] = useState(appointment.time);

  const handleUpdateAppointment = async () => {
    try {
      const updatedAppointment = {
        ...appointment,
        date: date.toISOString().split('T')[0], // format date as yyyy-mm-dd
        time,
      };

      const appointmentRef = doc(db, 'appointments', appointment.id);
      await updateDoc(appointmentRef, updatedAppointment);

      alert('Appointment rescheduled successfully!');
      onUpdate(updatedAppointment);  // Pass the updated appointment object
      onClose();
    } catch (error) {
      console.error('Error updating appointment:', error.message);
      alert('Failed to reschedule appointment. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Reschedule Appointment</h2>
        
        <div className="mb-2">
          <label htmlFor="date" className="block text-gray-700 font-bold mb-1 text-sm">Date</label>
          <DatePicker
            selected={date}
            onChange={(date) => setDate(date)}
            dateFormat="yyyy-MM-dd"
            className="border border-gray-300 p-1 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        <div className="mb-2">
          <label htmlFor="time" className="block text-gray-700 font-bold mb-1 text-sm">Time</label>
          <input
            id="time"
            type="time"
            className="border border-gray-300 p-1 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <div className="flex space-x-2 mt-4">
          <button
            onClick={handleUpdateAppointment}
            className="bg-orange-600 text-white py-1 px-2 rounded hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
          >
            Save Changes
          </button>
          <button
            onClick={onClose}
            className="bg-white text-black py-2 px-4 rounded border border-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RescheduleAppointment;


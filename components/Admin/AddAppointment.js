import React, { useState } from 'react';

const AddAppointment = ({ onAdd, onClose }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleAdd = async () => {
    const newAppointment = {
      customerName,
      customerEmail,
      contactNumber,
      serviceName,
      teamMembers,
      date,
      time,
    };

    try {
      const response = await fetch('https://your-api-endpoint.com/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAppointment),
      });

      if (!response.ok) {
        throw new Error('Failed to add appointment');
      }

      const result = await response.json();
      onAdd(result);  // Assuming onAdd is used to update the state in the parent component
      onClose();  // Close the modal after adding the appointment

    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add the appointment. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-3 text-center">Add New Appointment</h2>

        <div className="grid grid-cols-1 gap-2 mb-3">
          <div>
            <label className="block text-gray-700 font-bold text-sm mb-1">Client Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="border border-gray-300 p-1 text-sm w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold text-sm mb-1">Contact Number</label>
            <input
              type="text"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="border border-gray-300 p-1 text-sm w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold text-sm mb-1">Email</label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="border border-gray-300 p-1 text-sm w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold text-sm mb-1">Service Name</label>
            <input
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="border border-gray-300 p-1 text-sm w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold text-sm mb-1">Select Team Members</label>
            <select
              multiple
              value={teamMembers}
              onChange={(e) => setTeamMembers([...e.target.selectedOptions].map(o => o.value))}
              className="border border-gray-300 p-1 text-sm w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="William">William</option>
              <option value="Sophia">Sophia</option>
              {/* Add more team members as needed */}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-bold text-sm mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-gray-300 p-1 text-sm w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold text-sm mb-1">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="border border-gray-300 p-1 text-sm w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end mt-3">
          <button
            onClick={onClose}
            className="bg-gray-300 text-black py-1 px-3 rounded text-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="bg-orange-600 text-white py-1 px-3 rounded text-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            Add Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAppointment;






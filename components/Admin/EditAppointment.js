import React, { useState } from 'react';

const EditAppointment = ({ appointment, onClose, onUpdate }) => {
  const [name, setName] = useState(appointment.customerName);
  const [email, setEmail] = useState(appointment.customerEmail);
  const [phone, setPhone] = useState(appointment.customerPhone);
  const [serviceName, setServiceName] = useState(appointment.name);
  const [teamMembers, setTeamMembers] = useState(appointment.teamMembers || []);
  const [date, setDate] = useState(appointment.date);
  const [time, setTime] = useState(appointment.time);

  const handleSaveChanges = () => {
    onUpdate();
    onClose();
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-center mb-4">Edit Appointment</h2>
      <div className="space-y-2">
        <div>
          <label className="block text-gray-700 font-bold text-sm">Client Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-1 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-bold text-sm">Contact Number</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-1 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-bold text-sm">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-1 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-bold text-sm">Service Name</label>
          <input
            type="text"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            className="w-full p-1 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-bold text-sm">Select Team Members</label>
          <select
            value={teamMembers}
            onChange={(e) => setTeamMembers([...e.target.selectedOptions].map(option => option.value))}
            multiple
            className="w-full p-1 border border-gray-300 rounded"
          >
            <option value="all">Select all Team Members</option>
            {/* Map team members */}
            <option value="William">William</option>
          </select>
        </div>
        <div className="flex space-x-2">
          <div className="w-1/2">
            <label className="block text-gray-700 font-bold text-sm">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-1 border border-gray-300 rounded"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-gray-700 font-bold text-sm">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-1 border border-gray-300 rounded"
            />
          </div>
        </div>
        <div className="text-center mt-4">
          <button
            onClick={handleSaveChanges}
            className="bg-orange-600 text-white py-1 px-4 rounded hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAppointment;



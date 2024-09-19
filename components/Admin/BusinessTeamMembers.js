import React, { useState, useEffect } from 'react';
import { db } from '../../utils/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt, faTrash } from '@fortawesome/free-solid-svg-icons';

const BusinessTeamMembers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDay, setSelectedDay] = useState('');
  const [status, setStatus] = useState('Available');
  const [availability, setAvailability] = useState({});
  const [availableDays, setAvailableDays] = useState([]);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchAvailability(selectedUser.id);
    }
  }, [selectedUser]);

  const fetchUsers = async () => {
    try {
      const businessesQuery = query(collection(db, 'businesses'), where('uidTeamAvailability', '!=', {}));
      const businessesSnapshot = await getDocs(businessesQuery);

      if (!businessesSnapshot.empty) {
        const businessDoc = businessesSnapshot.docs[0];
        const businessData = businessDoc.data();
        const availabilityData = businessData.uidTeamAvailability;

        const userIds = Object.keys(availabilityData);
        const usersPromises = userIds.map(id => getDoc(doc(db, 'users', id)));
        const usersSnapshots = await Promise.all(usersPromises);

        const usersData = usersSnapshots.map(snapshot => ({
          id: snapshot.id,
          ...snapshot.data(),
        }));

        setUsers(usersData);
      } else {
        console.error('No business documents found!');
      }
    } catch (error) {
      console.error('Error fetching users:', error.message);
    }
  };

  const fetchAvailability = (userId) => {
    const businessesQuery = query(collection(db, 'businesses'), where(`uidTeamAvailability.${userId}`, '!=', null));
    const unsubscribe = onSnapshot(businessesQuery, (snapshot) => {
      if (!snapshot.empty) {
        const businessDoc = snapshot.docs[0];
        const businessData = businessDoc.data();
        const teamAvailability = businessData.uidTeamAvailability[userId];
        if (teamAvailability) {
          setAvailability(teamAvailability);
          setAvailableDays(Object.keys(teamAvailability));
        } else {
          setAvailability({});
          setAvailableDays([]);
        }
      } else {
        console.error('No such business document!');
      }
    });

    return () => unsubscribe();
  };

  const handleSetAvailability = async (e) => {
    e.preventDefault();

    if (!selectedUser || !selectedDay) {
      alert('Please select a user and a day.');
      return;
    }

    try {
      const businessesQuery = query(collection(db, 'businesses'), where(`uidTeamAvailability.${selectedUser.id}`, '!=', null));
      const businessesSnapshot = await getDocs(businessesQuery);
      if (!businessesSnapshot.empty) {
        const businessDoc = businessesSnapshot.docs[0];
        const businessRef = doc(db, 'businesses', businessDoc.id);
        await updateDoc(businessRef, {
          [`uidTeamAvailability.${selectedUser.id}.${selectedDay}`]: status,
        });

        alert('User availability set successfully!');
        setSelectedDay('');
      } else {
        console.error('No such business document!');
      }
    } catch (error) {
      console.error('Error setting user availability:', error.message);
      alert('Failed to set user availability. Please try again.');
    }
  };

  const handleChangeStatus = async (day) => {
    try {
      const businessesQuery = query(collection(db, 'businesses'), where(`uidTeamAvailability.${selectedUser.id}`, '!=', null));
      const businessesSnapshot = await getDocs(businessesQuery);
      if (!businessesSnapshot.empty) {
        const businessDoc = businessesSnapshot.docs[0];
        const businessRef = doc(db, 'businesses', businessDoc.id);
        const newStatus = availability[day] === 'Available' ? 'Not Available' : 'Available';
        await updateDoc(businessRef, {
          [`uidTeamAvailability.${selectedUser.id}.${day}`]: newStatus,
        });

        alert('Availability status updated successfully!');
      } else {
        console.error('No such business document!');
      }
    } catch (error) {
      console.error('Error updating availability status:', error.message);
      alert('Failed to update availability status. Please try again.');
    }
  };

  const handleDeleteAvailability = async (day) => {
    try {
      const businessesQuery = query(collection(db, 'businesses'), where(`uidTeamAvailability.${selectedUser.id}`, '!=', null));
      const businessesSnapshot = await getDocs(businessesQuery);

      if (!businessesSnapshot.empty) {
        const businessDoc = businessesSnapshot.docs[0];
        const businessRef = doc(db, 'businesses', businessDoc.id);

        // Update the document to remove the specific day's availability
        await updateDoc(businessRef, {
          [`uidTeamAvailability.${selectedUser.id}.${day}`]: null
        });

        alert('Availability deleted successfully!');
        fetchAvailability(selectedUser.id); // Refresh availability after deletion
      } else {
        console.error('No such business document!');
      }
    } catch (error) {
      console.error('Error deleting availability:', error.message);
      alert('Failed to delete availability. Please try again.');
    }
  };

  const daysOfWeekOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="container mx-auto p-12 min-h-screen bg-white">
      <h1 className="text-4xl font-bold text-center mb-10 text-black">Business (Team Members)</h1>
  
      {/* Set Team Members Availability Section */}
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-xl mb-10 border-t-4 border-orange-500">
        <h2 className="text-3xl font-semibold mb-6 text-black">Set Team Members Availability</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div>
            <label htmlFor="user-select" className="block text-black font-medium mb-2">Select User</label>
            <select
              id="user-select"
              className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={selectedUser ? selectedUser.id : ''}
              onChange={(e) => {
                const selected = users.find(user => user.id === e.target.value);
                setSelectedUser(selected);
              }}
            >
              <option value="">Select a user</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.displayName}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="day-select" className="block text-black font-medium mb-2">Select Day</label>
            <select
              id="day-select"
              className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
            >
              <option value="">Select a day</option>
              {daysOfWeekOrder.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="submit"
          onClick={handleSetAvailability}
          className="bg-orange-600 text-white py-2 px-6 rounded-lg hover:bg-orange-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          Set Availability
        </button>
      </div>
  
      {/* Overview User Availability Section */}
      {selectedUser && (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-xl border-t-4 border-purple-500">
          <h2 className="text-3xl font-semibold mb-6 text-black">Overview User Availability</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg">
              <thead>
                <tr className="bg-purple-600 text-white text-sm">
                  <th className="py-2 px-4 text-left rounded-tl-lg">Day</th>
                  <th className="py-2 px-4 text-left">Availability</th>
                  <th className="py-2 px-4 text-left rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {daysOfWeekOrder.map(day => (
                  <tr key={day} className="border-t border-gray-300 text-sm">
                    <td className="py-2 px-4">{day}</td>
                    <td className={`py-2 px-4 ${availability[day] === 'Available' ? 'text-green-500' : 'text-red-500'}`}>
                      {availability[day] === 'Available' ? 'Available' : 'Not Available'}
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleChangeStatus(day)}
                          className="bg-orange-600 text-white py-1 px-2 rounded text-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                          title="Change Status"
                        >
                          <FontAwesomeIcon icon={faSyncAlt} />
                        </button>
                        <button
                          onClick={() => handleDeleteAvailability(day)}
                          className="bg-white text-black py-1 px-2 rounded border text-sm border-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
                          title="Delete Availability"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessTeamMembers;


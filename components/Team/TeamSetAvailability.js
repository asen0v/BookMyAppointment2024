import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { db } from '../../utils/firebase';
import { doc, updateDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { setBusinessId } from '../../redux/slices/userSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const SetTeamAvailability = () => {
  const [currentUserAvailability, setCurrentUserAvailability] = useState({});
  const [workingHours, setWorkingHours] = useState({ start: '09:00', end: '18:00' });
  const [breaks, setBreaks] = useState([]);
  const [newBreak, setNewBreak] = useState({ start: '', end: '' });
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [businessName, setBusinessName] = useState('');
  const [teamMemberName, setTeamMemberName] = useState('');
  const [businessWorkingHours, setBusinessWorkingHours] = useState({ start: '09:00', end: '18:00' });
  const [isLoading, setIsLoading] = useState(true);

  const auth = getAuth();
  const user = auth.currentUser;

  const dispatch = useDispatch();
  const businessId = useSelector((state) => state.user.businessId);

  useEffect(() => {
    if (user) {
      setLoggedInUserId(user.uid);
    }
  }, [user]);

  useEffect(() => {
    if (loggedInUserId) {
      const fetchBusinessAndUserData = async () => {
        try {
          const userRef = doc(db, 'users', loggedInUserId);
          const userSnapshot = await getDoc(userRef);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            const userBusinessId = userData.businessId;

            if (userBusinessId) {
              dispatch(setBusinessId(userBusinessId));

              // Fetch and set the team member's name
              setTeamMemberName(userData.displayName || '');

              // Set up real-time listener for business data
              const businessRef = doc(db, 'businesses', userBusinessId);
              const unsubscribeBusiness = onSnapshot(businessRef, (snapshot) => {
                if (snapshot.exists()) {
                  const businessData = snapshot.data();
                  setBusinessName(businessData.name || '');

                  // Set the business working hours
                  const businessHours = businessData.workingHours || { start: '09:00', end: '18:00' };
                  setBusinessWorkingHours(businessHours);

                  // Set the user's availability working hours to match the business's working hours
                  setWorkingHours(businessHours);

                  const uidTeamAvailability = businessData.uidTeamAvailability || {};
                  setCurrentUserAvailability(uidTeamAvailability[loggedInUserId] || {});
                } else {
                  console.error('Business not found');
                }
              });

              // Cleanup on unmount
              return () => unsubscribeBusiness();
            } else {
              console.error('User does not have a business ID');
            }
          } else {
            console.error('User not found');
          }
        } catch (error) {
          console.error('Error fetching business ID or user data:', error.message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchBusinessAndUserData();
    }
  }, [loggedInUserId, dispatch]);

  const handleSetAvailability = async (e, day) => {
    e.preventDefault();

    if (!businessId || !loggedInUserId || !day) {
      alert('Please enter a business ID and a day.');
      return;
    }

    try {
      const businessRef = doc(db, 'businesses', businessId);
      const businessSnapshot = await getDoc(businessRef);
      if (businessSnapshot.exists()) {
        const businessData = businessSnapshot.data();
        const uidTeamAvailability = businessData.uidTeamAvailability || {};

        if (!uidTeamAvailability[loggedInUserId]) {
          uidTeamAvailability[loggedInUserId] = {};
        }

        uidTeamAvailability[loggedInUserId][day] = uidTeamAvailability[loggedInUserId][day] === 'Available' ? 'Not Available' : 'Available';

        await updateDoc(businessRef, {
          uidTeamAvailability: uidTeamAvailability
        });

        // The real-time listener will automatically update the state with new availability
      } else {
        console.error('Business not found');
      }
    } catch (error) {
      console.error('Error setting user availability:', error.message);
      alert('Failed to update user availability. Please try again.');
    }
  };

  const handleWorkingHoursChange = (e) => {
    const { name, value } = e.target;
    // Ensure the new working hours fall within the business's working hours
    if ((name === 'start' && value >= businessWorkingHours.start) || (name === 'end' && value <= businessWorkingHours.end)) {
      setWorkingHours((prev) => ({ ...prev, [name]: value }));
    } else {
      alert(`Please choose a time within the business working hours: ${businessWorkingHours.start} - ${businessWorkingHours.end}`);
    }
  };

  const handleNewBreakChange = (e) => {
    const { name, value } = e.target;
    setNewBreak((prev) => ({ ...prev, [name]: value }));
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
    if (!businessId || !loggedInUserId) return;
    try {
      const businessRef = doc(db, 'businesses', businessId);
      await updateDoc(businessRef, {
        [`uidTeamAvailability.${loggedInUserId}.breaks`]: updatedBreaks,
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

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-xl border-t-4 border-orange-500">
          <h2 className="text-4xl font-semibold mb-8 text-black text-center">Set Personal Availability</h2>

          {businessId ? (
            <div>
              <div className="mb-6">
                <p className="text-sm font-semibold">
                  <strong>Business ID:</strong> {businessId}
                </p>
                <p className="text-sm font-semibold">
                  <strong>Business Name:</strong> {businessName}
                </p>
                <p className="text-sm font-semibold">
                  <strong>Team Member:</strong> {teamMemberName}
                </p>
                <p className="text-sm font-semibold">
                  <strong>Business Working Hours:</strong> {businessWorkingHours.start} - {businessWorkingHours.end}
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                  <thead>
                    <tr className="bg-orange-500 text-white text-sm">
                      <th className="py-2 px-4 text-left rounded-tl-lg">Day</th>
                      <th className="py-2 px-4 text-left">Availability</th>
                      <th className="py-2 px-4 text-left">Working Hours</th>
                      <th className="py-2 px-4 text-left">Breaks</th>
                      <th className="py-2 px-4 text-left rounded-tr-lg">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                      <tr key={day} className="border-t border-gray-300 text-sm">
                        <td className="py-2 px-4">{day}</td>
                        <td className={`py-2 px-4 font-bold ${currentUserAvailability[day] === 'Available' ? 'text-green-500' : 'text-red-500'}`}>
                          {currentUserAvailability[day] || 'Not set'}
                        </td>
                        <td className="py-2 px-4">
                          <input
                            type="time"
                            name="start"
                            value={workingHours.start}
                            onChange={(e) => handleWorkingHoursChange(e, day, 'start')}
                            className="mr-2 border border-gray-300 rounded"
                          />
                          <input
                            type="time"
                            name="end"
                            value={workingHours.end}
                            onChange={(e) => handleWorkingHoursChange(e, day, 'end')}
                            className="border border-gray-300 rounded"
                          />
                        </td>
                        <td className="py-2 px-4">
                          {breaks.length > 0 ? (
                            breaks.map((brk, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <span className="mr-2">{`${brk.start} - ${brk.end}`}</span>
                                <button onClick={() => handleRemoveBreak(index)} className="text-red-500 ml-2">Remove</button>
                              </div>
                            ))
                          ) : (
                            <span className="text-gray-500">No breaks set</span>
                          )}
                          <div className="flex mt-2">
                            <input
                              type="time"
                              name="start"
                              value={newBreak.start}
                              onChange={handleNewBreakChange}
                              className="mr-2 border border-gray-300 rounded"
                            />
                            <input
                              type="time"
                              name="end"
                              value={newBreak.end}
                              onChange={handleNewBreakChange}
                              className="border border-gray-300 rounded"
                            />
                            <button onClick={addBreak} className="ml-2 text-blue-500">Add Break</button>
                          </div>
                        </td>
                        <td className="py-2 px-4">
                          <button
                            className="focus:outline-none"
                            onClick={(e) => handleSetAvailability(e, day)}
                            title={currentUserAvailability[day] === 'Available' ? 'Mark Not Available' : 'Mark Available'}
                          >
                            <FontAwesomeIcon
                              icon={currentUserAvailability[day] === 'Available' ? faTimesCircle : faCheckCircle}
                              className={`text-2xl ${currentUserAvailability[day] === 'Available' ? 'text-red-500' : 'text-green-500'}`}
                            />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center">Business ID not found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SetTeamAvailability;


/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { db } from '../../utils/firebase';
import { getDocs, getDoc, collection, doc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const TeamBusinessAvailability = () => {
    const [businesses, setBusinesses] = useState([]);
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [businessAvailability, setBusinessAvailability] = useState({});
    const [loggedInUserId, setLoggedInUserId] = useState(null);

    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                setLoggedInUserId(user.uid);
                const userRef = doc(db, 'users', user.uid);
                const userSnapshot = await getDoc(userRef);
                if (userSnapshot.exists()) {
                    const userData = userSnapshot.data();
                    if (userData.businessId) {
                        const businessRef = doc(db, 'businesses', userData.businessId);
                        const businessSnapshot = await getDoc(businessRef);
                        if (businessSnapshot.exists()) {
                            const businessData = businessSnapshot.data();
                            setSelectedBusiness({ id: businessSnapshot.id, name: businessData.name }); // Set business ID and name
                        }
                    }
                }
            }
        };
        fetchUserData();
    }, [user]);

    useEffect(() => {
        fetchBusinesses();
    }, [selectedBusiness]);

    useEffect(() => {
        if (selectedBusiness) {
            const unsubscribe = onSnapshot(doc(db, 'businesses', selectedBusiness.id), (snapshot) => {
                if (snapshot.exists()) {
                    const { BusinessAvailability } = snapshot.data();
                    setBusinessAvailability(BusinessAvailability || {});
                } else {
                    console.error('Business not found');
                }
            });

            return () => unsubscribe();
        }
    }, [selectedBusiness]);

    const fetchBusinesses = async () => {
        try {
            const businessesSnapshot = await getDocs(collection(db, 'businesses'));
            const businessesData = businessesSnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(business => business.id === selectedBusiness?.id); // Filter to show only the selected business
            setBusinesses(businessesData);
        } catch (error) {
            console.error('Error fetching businesses:', error.message);
        }
    };

    const daysOfWeekOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-xl border-t-4 border-orange-500">
                <h2 className="text-4xl font-semibold mb-8 text-black text-center">Overview Selected Business Availability</h2>
                
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Business:
                        </label>
                        <div className="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight">
                            {selectedBusiness?.name || 'Business name not available'}
                        </div>
                    </div>
                </div>
    
                {selectedBusiness && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                            <thead>
                                <tr className="bg-orange-500 text-white text-sm">
                                    <th className="py-2 px-4 text-left rounded-tl-lg">Day</th>
                                    <th className="py-2 px-4 text-left">Status</th>
                                    <th className="py-2 px-4 text-left">Working Hours</th>
                                    <th className="py-2 px-4 text-left rounded-tr-lg">Breaks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {daysOfWeekOrder.map(day => (
                                    <tr key={day} className="border-t border-gray-300 text-sm">
                                        <td className="py-2 px-4">{day}</td>
                                        <td className={`py-2 px-4 font-bold ${businessAvailability[day]?.status === 'Available' ? 'text-green-500' : 'text-red-500'}`}>
                                            {businessAvailability[day]?.status || 'Not set'}
                                        </td>
                                        <td className="py-2 px-4">
                                            {businessAvailability[day]?.status === 'Available' ? (
                                                `${businessAvailability[day]?.hours.start} - ${businessAvailability[day]?.hours.end}`
                                            ) : (
                                                'N/A'
                                            )}
                                        </td>
                                        <td className="py-2 px-4">
                                            {businessAvailability[day]?.status === 'Available' && businessAvailability[day]?.breaks.length > 0 ? (
                                                businessAvailability[day]?.breaks.map((brk, index) => (
                                                    <span key={index} className="inline-flex items-center gap-2">
                                                        {`${brk.start} - ${brk.end}`}
                                                    </span>
                                                )).reduce((prev, curr) => [prev, ', ', curr])
                                            ) : (
                                                'N/A'
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );          
};

export default TeamBusinessAvailability;



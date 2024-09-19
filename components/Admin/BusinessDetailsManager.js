import React, { useState, useEffect } from 'react';
import { db, storage } from '../../utils/firebase';
import { collection, doc, setDoc, getDocs, query, where, deleteDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import BusinessAvailabilityManager from './BusinessAvailabilityManager';
import BusinessServices from './BusinessServices';

const BusinessDetailsManager = () => {
  const [user, setUser] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [newBusinessName, setNewBusinessName] = useState('');
  const [newBusinessDetails, setNewBusinessDetails] = useState('');
  const [newBusinessPhone, setNewBusinessPhone] = useState('');
  const [newBusinessAddress, setNewBusinessAddress] = useState('');
  const [newBusinessCategory, setNewBusinessCategory] = useState('');
  const [newBusinessLogoUrl, setNewBusinessLogoUrl] = useState('');
  const [editBusinessName, setEditBusinessName] = useState('');
  const [editBusinessDetails, setEditBusinessDetails] = useState('');
  const [editBusinessPhone, setEditBusinessPhone] = useState('');
  const [editBusinessAddress, setEditBusinessAddress] = useState('');
  const [editBusinessCategory, setEditBusinessCategory] = useState('');
  const [editBusinessLogoUrl, setEditBusinessLogoUrl] = useState('');
  const [availableLogos, setAvailableLogos] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log('Auth state changed:', user);
      if (user) {
        setUser(user);
        fetchBusinesses(user.uid);
        fetchAvailableLogos();
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedBusiness && selectedBusiness.id) {
      fetchServices(selectedBusiness.id);
    }
  }, [selectedBusiness]);

  const fetchAvailableLogos = async () => {
    try {
      const logoRef = ref(storage, 'logos/');
      console.log('Fetching logos from Firebase Storage...');
      const logoList = await listAll(logoRef);
      console.log('Logo list:', logoList);
      const logoUrls = await Promise.all(logoList.items.map((itemRef) => getDownloadURL(itemRef)));
      console.log('Fetched logos URLs:', logoUrls);
      setAvailableLogos(logoUrls);
    } catch (error) {
      console.error('Error fetching logos:', error.message);
    }
  };

  const fetchBusinesses = async (userId) => {
    try {
      const businessesSnapshot = await getDocs(
        query(collection(db, 'businesses'), where('userId', '==', userId))
      );
      const businessesData = businessesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBusinesses(businessesData);

      if (businessesData.length > 0) {
        const business = businessesData[0];
        setSelectedBusiness(business);
        setEditBusinessName(business.name);
        setEditBusinessDetails(business.details);
        setEditBusinessPhone(business.phone);
        setEditBusinessAddress(business.address);
        setEditBusinessCategory(business.category);
        setEditBusinessLogoUrl(business.logoUrl || '');
      } else {
        setSelectedBusiness(null);
      }
    } catch (error) {
      console.error('Error fetching businesses:', error.message);
    }
  };

  const fetchServices = async (businessId) => {
    if (!businessId) {
      console.error('Invalid businessId provided for fetching services.');
      return;
    }

    try {
      const servicesSnapshot = await getDocs(
        query(collection(db, 'services'), where('businessId', '==', businessId))
      );
      const servicesData = servicesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setServices(servicesData);
    } catch (error) {
      console.error('Error fetching services:', error.message);
    }
  };

  const handleCreateBusiness = async () => {
    if (!newBusinessName || !newBusinessDetails || !newBusinessPhone || !newBusinessAddress || !newBusinessCategory || !newBusinessLogoUrl) {
      alert('Please fill out all fields.');
      return;
    }

    if (selectedBusiness) {
      alert('You already have a business. Please update it if necessary.');
      return;
    }

    try {
      const auth = getAuth();
      const userId = auth.currentUser.uid;

      const newBusiness = {
        name: newBusinessName,
        details: newBusinessDetails,
        phone: newBusinessPhone,
        address: newBusinessAddress,
        category: newBusinessCategory,
        userId,
        logoUrl: newBusinessLogoUrl,
      };

      const docRef = doc(collection(db, 'businesses'));
      await setDoc(docRef, newBusiness);

      alert('Business created successfully!');
      setNewBusinessName('');
      setNewBusinessDetails('');
      setNewBusinessPhone('');
      setNewBusinessAddress('');
      setNewBusinessCategory('');
      setNewBusinessLogoUrl('');
      fetchBusinesses(userId);
    } catch (error) {
      console.error('Error creating business:', error.message);
      alert('Failed to create business. Please try again.');
    }
  };

  const handleUpdateBusiness = async () => {
    if (!selectedBusiness || !editBusinessName || !editBusinessDetails || !editBusinessPhone || !editBusinessAddress || !editBusinessCategory || !editBusinessLogoUrl) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      const businessRef = doc(db, 'businesses', selectedBusiness.id);
      await updateDoc(businessRef, {
        name: editBusinessName,
        details: editBusinessDetails,
        phone: editBusinessPhone,
        address: editBusinessAddress,
        category: editBusinessCategory,
        logoUrl: editBusinessLogoUrl,
      });

      alert('Business updated successfully!');
      fetchBusinesses(user.uid);
    } catch (error) {
      console.error('Error updating business:', error.message);
      alert('Failed to update business. Please try again.');
    }
  };

  const handleDeleteBusiness = async () => {
    if (!selectedBusiness) {
      alert('Please select a business to delete.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this business?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'businesses', selectedBusiness.id));
      alert('Business deleted successfully!');
      setSelectedBusiness(null);
      fetchBusinesses(user.uid);
    } catch (error) {
      console.error('Error deleting business:', error.message);
      alert('Failed to delete business. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-5xl font-bold text-center mb-10 text-dark drop-shadow-lg">Business Details</h1>
  
      {/* Create Business Section */}
      {!selectedBusiness && (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-xl mb-10 border-t-4 border-blue-500">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold text-black">Create New Business</h2>
            {newBusinessLogoUrl && (
              <img
                src={newBusinessLogoUrl}
                alt="Selected Logo"
                className="h-24 w-24 object-cover rounded-lg shadow-lg border-2 border-blue-500"
              />
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            <div>
              <label htmlFor="newBusinessName" className="block text-black font-medium mb-2">Business Name</label>
              <input
                id="newBusinessName"
                type="text"
                className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newBusinessName}
                onChange={(e) => setNewBusinessName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="newBusinessPhone" className="block text-black font-medium mb-2">Business Phone</label>
              <input
                id="newBusinessPhone"
                type="text"
                className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newBusinessPhone}
                onChange={(e) => setNewBusinessPhone(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="newBusinessAddress" className="block text-black font-medium mb-2">Business Address</label>
              <input
                id="newBusinessAddress"
                type="text"
                className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newBusinessAddress}
                onChange={(e) => setNewBusinessAddress(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="newBusinessDetails" className="block text-black font-medium mb-2">Business Details</label>
              <textarea
                id="newBusinessDetails"
                className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newBusinessDetails}
                onChange={(e) => setNewBusinessDetails(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="newBusinessCategory" className="block text-black font-medium mb-2">Business Category</label>
              <select
                id="newBusinessCategory"
                className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newBusinessCategory}
                onChange={(e) => setNewBusinessCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                <option value="Beauty and Wellness">Beauty and Wellness</option>
                <option value="Sport">Sport</option>
                <option value="Personal Meetings and Services">Personal Meetings and Services</option>
                <option value="Medical">Medical</option>
                <option value="Events and Entertainment">Events and Entertainment</option>
                <option value="Education">Education</option>
                <option value="Retailers">Retailers</option>
                <option value="Other Category">Other Category</option>
              </select>
            </div>
            <div>
              <label htmlFor="newBusinessLogo" className="block text-black font-medium mb-2">Select Business Logo</label>
              <select
                id="newBusinessLogo"
                className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newBusinessLogoUrl}
                onChange={(e) => {
                  console.log('Selected logo URL:', e.target.value);
                  setNewBusinessLogoUrl(e.target.value);
                }}
              >
                <option value="">Select Logo</option>
                {availableLogos.map((logoUrl, index) => (
                  <option key={index} value={logoUrl}>{logoUrl.split('/').pop()}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-start items-center space-x-4">
            <button
              onClick={handleCreateBusiness}
              className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create Business
            </button>
          </div>
        </div>
      )}
  
      {/* Edit Business Section */}
      {selectedBusiness && (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-xl mb-10 border-t-4 border-orange-500">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold text-black">Edit Business</h2>
            {editBusinessLogoUrl && (
              <img
                src={editBusinessLogoUrl}
                alt="Selected Logo"
                className="h-24 w-24 object-cover rounded-lg shadow-lg border-2 border-orange-500"
              />
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            <div>
              <label htmlFor="editBusinessName" className="block text-black font-medium mb-2">Business Name</label>
              <input
                id="editBusinessName"
                type="text"
                className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={editBusinessName}
                onChange={(e) => setEditBusinessName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="editBusinessPhone" className="block text-black font-medium mb-2">Business Phone</label>
              <input
                id="editBusinessPhone"
                type="text"
                className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={editBusinessPhone}
                onChange={(e) => setEditBusinessPhone(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="editBusinessAddress" className="block text-black font-medium mb-2">Business Address</label>
              <input
                id="editBusinessAddress"
                type="text"
                className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={editBusinessAddress}
                onChange={(e) => setEditBusinessAddress(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="editBusinessDetails" className="block text-black font-medium mb-2">Business Details</label>
              <textarea
                id="editBusinessDetails"
                className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={editBusinessDetails}
                onChange={(e) => setEditBusinessDetails(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="editBusinessCategory" className="block text-black font-medium mb-2">Business Category</label>
              <select
                id="editBusinessCategory"
                className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={editBusinessCategory}
                onChange={(e) => setEditBusinessCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                <option value="Beauty and Wellness">Beauty and Wellness</option>
                <option value="Sport">Sport</option>
                <option value="Personal Meetings and Services">Personal Meetings and Services</option>
                <option value="Medical">Medical</option>
                <option value="Events and Entertainment">Events and Entertainment</option>
                <option value="Education">Education</option>
                <option value="Retailers">Retailers</option>
                <option value="Other Category">Other Category</option>
              </select>
            </div>
            <div>
              <label htmlFor="editBusinessLogo" className="block text-black font-medium mb-2">Select Business Logo</label>
              <select
                id="editBusinessLogo"
                className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={editBusinessLogoUrl}
                onChange={(e) => {
                  console.log('Selected logo URL:', e.target.value);
                  setEditBusinessLogoUrl(e.target.value);
                }}
              >
                <option value="">Select Logo</option>
                {availableLogos.map((logoUrl, index) => (
                  <option key={index} value={logoUrl}>{logoUrl.split('/').pop()}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-start items-center space-x-4">
            <button
              onClick={handleUpdateBusiness}
              className="bg-orange-600 text-white py-2 px-6 rounded-lg hover:bg-orange-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              Update Business
            </button>
            <button
              onClick={handleDeleteBusiness}
              className="bg-white text-gray-800 border border-gray-300 py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Delete Business
            </button>
            <span className="bg-gray-300 text-black py-2 px-6 rounded-lg focus:outline-none">
              Business ID: {selectedBusiness.id}
            </span>
          </div>
        </div>
      )}
  
      {/* Business Availability Manager */}
      {selectedBusiness && (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-xl mb-10 border-t-4 border-green-500">
          <BusinessAvailabilityManager selectedBusiness={selectedBusiness} />
        </div>
      )}
  
      {/* Business Services */}
      {selectedBusiness && selectedBusiness.id && (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-xl border-t-4 border-purple-500">
          <BusinessServices
            businessId={selectedBusiness.id}
            onServicesUpdated={() => fetchServices(selectedBusiness.id)}
          />
        </div>
      )}
    </div>
  );                                               
};

export default BusinessDetailsManager;

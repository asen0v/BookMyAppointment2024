/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
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

const BusinessServices = ({ businessId, onServicesUpdated }) => {
  const [serviceName, setServiceName] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');
  const [serviceTeamMembers, setServiceTeamMembers] = useState([]);
  const [serviceDurationHours, setServiceDurationHours] = useState('');
  const [serviceDurationMinutes, setServiceDurationMinutes] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [services, setServices] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (businessId) {
      fetchServices();
      fetchTeamMembers();
    }
  }, [businessId]);

  const fetchServices = async () => {
    if (!businessId) {
      console.error('Business ID is not available.');
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

  const fetchTeamMembers = async () => {
    try {
      const businessesQuery = query(collection(db, 'businesses'), where('uidTeamAvailability', '!=', {}));
      const businessesSnapshot = await getDocs(businessesQuery);

      if (!businessesSnapshot.empty) {
        const businessDoc = businessesSnapshot.docs.find(doc => doc.id === businessId);
        if (businessDoc) {
          const businessData = businessDoc.data();
          const availabilityData = businessData.uidTeamAvailability;
          const userIds = Object.keys(availabilityData);

          const usersPromises = userIds.map(id => getDoc(doc(db, 'users', id)));
          const usersSnapshots = await Promise.all(usersPromises);

          const teamMembersData = usersSnapshots.map(snapshot => ({
            id: snapshot.id,
            ...snapshot.data(),
          }));

          setTeamMembers(teamMembersData);
        } else {
          console.error('Business document not found!');
        }
      } else {
        console.error('No business documents found!');
      }
    } catch (error) {
      console.error('Error fetching team members:', error.message);
    }
  };

  const handleCreateService = async () => {
    if (!serviceName || !serviceDescription || !serviceCategory || !serviceDurationHours || !serviceDurationMinutes || !servicePrice) {
      alert('Please provide all required service details.');
      return;
    }

    if (!businessId) {
      alert('No business selected.');
      return;
    }

    try {
      const newService = {
        name: serviceName,
        description: serviceDescription,
        category: serviceCategory,
        teamMembers: selectAll ? teamMembers.map(member => member.id) : serviceTeamMembers,
        duration: {
          hours: serviceDurationHours,
          minutes: serviceDurationMinutes
        },
        price: servicePrice,
        businessId,
      };

      const docRef = doc(collection(db, 'services'));
      await setDoc(docRef, newService);

      alert('Service created successfully!');
      setServiceName('');
      setServiceDescription('');
      setServiceCategory('');
      setServiceTeamMembers([]);
      setServiceDurationHours('');
      setServiceDurationMinutes('');
      setServicePrice('');
      setSelectAll(false);
      fetchServices();
      if (onServicesUpdated) onServicesUpdated();
    } catch (error) {
      console.error('Error creating service:', error.message);
      alert('Failed to create service. Please try again.');
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'services', serviceId));
      alert('Service deleted successfully!');
      fetchServices();
      if (onServicesUpdated) onServicesUpdated();
    } catch (error) {
      console.error('Error deleting service:', error.message);
      alert('Failed to delete service. Please try again.');
    }
  };

  const handleEditService = (serviceId) => {
    const service = services.find((service) => service.id === serviceId);
    setServiceToEdit(service);
    setIsEditModalOpen(true);
  };

  const handleUpdateService = async () => {
    if (!serviceToEdit) return;

    try {
      const updatedService = {
        name: serviceToEdit.name,
        description: serviceToEdit.description,
        category: serviceToEdit.category,
        teamMembers: selectAll ? teamMembers.map(member => member.id) : serviceToEdit.teamMembers,
        duration: {
          hours: serviceToEdit.duration.hours,
          minutes: serviceToEdit.duration.minutes,
        },
        price: serviceToEdit.price,
      };

      const docRef = doc(db, 'services', serviceToEdit.id);
      await updateDoc(docRef, updatedService);

      alert('Service updated successfully!');
      setIsEditModalOpen(false);
      fetchServices();
      if (onServicesUpdated) onServicesUpdated();
    } catch (error) {
      console.error('Error updating service:', error.message);
      alert('Failed to update service. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setServiceToEdit(null);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleTeamMemberSelect = (id) => {
    if (serviceTeamMembers.includes(id)) {
      setServiceTeamMembers(serviceTeamMembers.filter(memberId => memberId !== id));
    } else {
      setServiceTeamMembers([...serviceTeamMembers, id]);
    }
  };

  const getTeamMemberNames = (memberIds) => {
    return teamMembers
      .filter(member => memberIds.includes(member.id))
      .map(member => member.displayName)
      .join(', ');
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">Manage Services</h1>
  
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Create Service</h2>
        
        {/* Create Service Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Input fields for creating service */}
          <div>
            <label htmlFor="serviceName" className="block text-gray-700 font-bold mb-1 text-sm">Service Name</label>
            <input
              id="serviceName"
              type="text"
              className="border border-gray-300 p-1 w-full rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="serviceDescription" className="block text-gray-700 font-bold mb-1 text-sm">Service Description</label>
            <textarea
              id="serviceDescription"
              className="border border-gray-300 p-1 w-full rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              value={serviceDescription}
              onChange={(e) => setServiceDescription(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="serviceCategory" className="block text-gray-700 font-bold mb-1 text-sm">Service Category</label>
            <select
              id="serviceCategory"
              className="border border-gray-300 p-1 w-full rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={serviceCategory}
              onChange={(e) => setServiceCategory(e.target.value)}
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
            <label htmlFor="serviceTeamMembers" className="block text-gray-700 font-bold mb-1 text-sm">Select Team Members</label>
            <div className="relative">
              <div
                id="serviceTeamMembers"
                className="border border-gray-300 p-1 w-full rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                onClick={toggleDropdown}
              >
                {serviceTeamMembers.length > 0
                  ? serviceTeamMembers.map(id => teamMembers.find(member => member.id === id)?.displayName).join(', ')
                  : 'Select Team Members'}
              </div>
              {isDropdownOpen && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 shadow-lg max-h-48 overflow-y-auto">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleTeamMemberSelect(member.id)}
                    >
                      <input
                        type="checkbox"
                        checked={serviceTeamMembers.includes(member.id)}
                        onChange={() => handleTeamMemberSelect(member.id)}
                        className="mr-2"
                      />
                      {member.displayName} ({member.role})
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
  
          <div>
            <label htmlFor="serviceDurationHours" className="block text-gray-700 font-bold mb-1 text-sm">Service Duration (Hours)</label>
            <input
              id="serviceDurationHours"
              type="number"
              className="border border-gray-300 p-1 w-full rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={serviceDurationHours}
              onChange={(e) => setServiceDurationHours(e.target.value)}
            />
          </div>
          <div className="flex justify-between items-end">
            <div className="w-2/3">
              <label htmlFor="serviceDurationMinutes" className="block text-gray-700 font-bold mb-1 text-sm">Service Duration (Minutes)</label>
              <input
                id="serviceDurationMinutes"
                type="number"
                className="border border-gray-300 p-1 w-full rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={serviceDurationMinutes}
                onChange={(e) => setServiceDurationMinutes(e.target.value)}
              />
            </div>
            <button
              onClick={handleCreateService}
              className="bg-orange-600 text-white py-3 px-3 rounded text-xs hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              Create Service
            </button>
  
          </div>
        </div>
        
        {/* List Services as a Table */}
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2 text-gray-700">Existing Services</h3>
          {services.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                <thead>
                  <tr className="bg-purple-600 text-white text-sm">
                    <th className="py-1 px-2 text-left rounded-tl-lg">Service Name</th>
                    <th className="py-1 px-2 text-left">Description</th>
                    <th className="py-1 px-2 text-left">Category</th>
                    <th className="py-1 px-2 text-left">Team Members</th>
                    <th className="py-1 px-2 text-left">Duration</th>
                    <th className="py-1 px-2 text-left">Price</th>
                    <th className="py-1 px-2 text-left rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service, index) => (
                    <tr key={service.id} className={`border-t border-gray-300 text-sm ${index === services.length - 1 ? 'rounded-bl-lg rounded-br-lg' : ''}`}>
                      <td className="py-1 px-2 font-semibold text-gray-800">{service.name}</td>
                      <td className="py-1 px-2">{service.description}</td>
                      <td className="py-1 px-2">{service.category}</td>
                      <td className="py-1 px-2">
                        {service.teamMembers && Array.isArray(service.teamMembers)
                          ? getTeamMemberNames(service.teamMembers)
                          : 'None'}
                      </td>
                      <td className="py-1 px-2">
                        {service.duration?.hours || 0}h {service.duration?.minutes || 0}m
                      </td>
                      <td className="py-1 px-2">£{service.price}</td>
                      <td className="py-1 px-2">
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleEditService(service.id)}
                            className="bg-orange-600 text-white py-1 px-2 rounded text-xs hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteService(service.id)}
                            className="bg-white text-black py-1 px-2 rounded border text-xs border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No services available.</p>
          )}
        </div>
      </div>
  
      {/* Edit Service Modal */}
      {isEditModalOpen && serviceToEdit && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-xs md:max-w-xs lg:max-w-sm">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Edit Service</h2>
  
            <div className="mb-2">
              <label htmlFor="editServiceName" className="block text-gray-700 font-bold mb-1 text-sm">Service Name</label>
              <input
                id="editServiceName"
                type="text"
                className="border border-gray-300 p-1 w-full rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={serviceToEdit.name}
                onChange={(e) => setServiceToEdit({ ...serviceToEdit, name: e.target.value })}
              />
            </div>
  
            <div className="mb-2">
              <label htmlFor="editServiceDescription" className="block text-gray-700 font-bold mb-1 text-sm">Service Description</label>
              <textarea
                id="editServiceDescription"
                className="border border-gray-300 p-1 w-full rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                value={serviceToEdit.description}
                onChange={(e) => setServiceToEdit({ ...serviceToEdit, description: e.target.value })}
              />
            </div>
  
            <div className="mb-2">
              <label htmlFor="editServiceCategory" className="block text-gray-700 font-bold mb-1 text-sm">Service Category</label>
              <select
                id="editServiceCategory"
                className="border border-gray-300 p-1 w-full rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={serviceToEdit.category}
                onChange={(e) => setServiceToEdit({ ...serviceToEdit, category: e.target.value })}
              >
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
  
            <div className="mb-2">
              <label htmlFor="editServiceTeamMembers" className="block text-gray-700 font-bold mb-1 text-sm">Select Team Members</label>
              <div className="relative">
                <div
                  id="editServiceTeamMembers"
                  className="border border-gray-300 p-1 w-full rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  onClick={toggleDropdown}
                >
                  {serviceToEdit.teamMembers.length > 0
                    ? serviceToEdit.teamMembers.map(id => teamMembers.find(member => member.id === id)?.displayName).join(', ')
                    : 'Select Team Members'}
                </div>
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 shadow-lg max-h-48 overflow-y-auto">
                    {teamMembers.map((member) => (
                      <div
                        key={member.id}
                        className="p-2 cursor-pointer hover:bg-gray-200"
                        onClick={() => handleTeamMemberSelect(member.id)}
                      >
                        <input
                          type="checkbox"
                          checked={serviceToEdit.teamMembers.includes(member.id)}
                          onChange={() => handleTeamMemberSelect(member.id)}
                          className="mr-2"
                        />
                        {member.displayName} ({member.role})
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
  
            <div className="mb-2">
              <label htmlFor="editServiceDurationHours" className="block text-gray-700 font-bold mb-1 text-sm">Service Duration (Hours)</label>
              <input
                id="editServiceDurationHours"
                type="number"
                className="border border-gray-300 p-1 w-full rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={serviceToEdit.duration.hours}
                onChange={(e) => setServiceToEdit({ ...serviceToEdit, duration: { ...serviceToEdit.duration, hours: e.target.value } })}
              />
            </div>
  
            <div className="mb-2">
              <label htmlFor="editServiceDurationMinutes" className="block text-gray-700 font-bold mb-1 text-sm">Service Duration (Minutes)</label>
              <input
                id="editServiceDurationMinutes"
                type="number"
                className="border border-gray-300 p-1 w-full rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={serviceToEdit.duration.minutes}
                onChange={(e) => setServiceToEdit({ ...serviceToEdit, duration: { ...serviceToEdit.duration, minutes: e.target.value } })}
              />
            </div>
  
            <div className="mb-2">
              <label htmlFor="editServicePrice" className="block text-gray-700 font-bold mb-1 text-sm">Price</label>
              <input
                id="editServicePrice"
                type="number"
                className="border border-gray-300 p-1 w-full rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={serviceToEdit.price}
                onChange={(e) => setServiceToEdit({ ...serviceToEdit, price: e.target.value })}
              />
            </div>
  
            <div className="flex space-x-2">
              <button
                onClick={handleUpdateService}
                className="bg-orange-600 text-white py-1 px-2 rounded text-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                Save
              </button>
              <button
                onClick={handleCloseModal}
                className="bg-white text-black py-1 px-2 rounded border border-black text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );          
};

export default BusinessServices;









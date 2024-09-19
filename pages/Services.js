import Link from 'next/link';

const ServicesPage = () => {
  return (
    <div className="min-h-screen">
      {/* Services Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-5xl font-bold mb-8">Services</h1>
        <p className="text-2xl text-gray-600 mb-12">
          Our platform provides a scalable and user-friendly app management.
        </p>

        {/* Services Cards */}
        <div className="grid grid-cols-1 gap-12 mt-[70px] mb-[-70px]">
          {/* For Businesses */}
          <div className="bg-white shadow-lg rounded-lg p-12 flex items-center space-x-8">
            <img
              src="/forbusi.svg" // Change to the actual image URL
              alt="For Businesses"
              className="w-48 h-48 object-cover rounded-lg"
            />
            <div className="flex-grow">
              <h3 className="text-4xl font-bold">For Businesses</h3>
              <p className="text-gray-600 mt-4 text-lg">
                Efficiently manage and customize schedules, automate notifications, and integrate with popular tools to streamline operations and enhance productivity.
              </p>
              <Link href="/register/business">
                <div className="inline-block mt-6 px-6 py-3 text-white font-bold rounded-lg" 
                    style={{ backgroundColor: '#6A3FF0', hover: { backgroundColor: '#5A2DCB' }}}>
                  Register your business
                </div>
              </Link>
            </div>
          </div>

          {/* For Customers */}
          <div className="bg-white shadow-lg rounded-lg p-12 flex items-center space-x-8">
            <img
              src="/forcust.svg" // Change to the actual image URL
              alt="For Customers"
              className="w-48 h-48 object-cover rounded-lg"
            />
            <div className="flex-grow">
              <h3 className="text-4xl font-bold">For Customers</h3>
              <p className="text-gray-600 mt-4 text-lg">
                Easily book appointments online, access real-time availability, and receive instant confirmations and timely reminders to stay organized.
              </p>
              <Link href="/register-customer">
                <div className="inline-block mt-6 px-6 py-3 text-white font-bold rounded-lg" 
                    style={{ backgroundColor: '#6A3FF0', hover: { backgroundColor: '#5A2DCB' }}}>
                  Register as customer and save time
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;

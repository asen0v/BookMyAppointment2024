import Link from 'next/link';
import PrivateRoute from '../../components/PrivateRoute';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { logoutUser, clearUser } from '../../redux/slices/userSlice';
import { auth } from '@/utils/firebase';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import Calendar from 'react-calendar'; // Import the calendar component
import 'react-calendar/dist/Calendar.css'; // Import default calendar styles
import BusinessDetailsManager from '@/components/Admin/BusinessDetailsManager';

const AdminPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const BookLink = "/customer/booking?business=";

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
        BusinessName(business.name);
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

  const handleLogout = async () => {
    try {
      dispatch(logoutUser());
      await auth.signOut();
      localStorage.clear();
      dispatch(clearUser());
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  const chartData = {
    labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    datasets: [
      {
        label: 'Last 6 months',
        data: [100, 150, 180, 130, 190, 240],
        fill: true,
        backgroundColor: 'rgba(106, 63, 240, 0.2)',
        borderColor: '#6A3FF0',
      },
      {
        label: 'Same period last year',
        data: [90, 130, 170, 120, 180, 220],
        fill: true,
        borderColor: '#E5E7EB',
        borderDash: [5, 5],
      },
    ],
  };

  return (
    <PrivateRoute role="admin">
      <div className="min-h-screen flex">
         {/* Sidebar */}
        <div className="bg-custom-purple text-white w-64 flex flex-col p-4 sticky top-0 h-screen">
          <Link href="/">
            <div className="flex items-center mb-8 cursor-pointer">
              <img src="/circle.svg" alt="Logo" className="w-15 h-15" />
              <div className="ml-2">
                <h1 className="text-2xl font-bold">Book</h1>
                <h1 className="text-2xl font-bold">My</h1>
                <h1 className="text-2xl font-bold">Appointment</h1>
              </div>
            </div>
          </Link>

          <nav className="flex flex-col flex-grow space-y-4">
            <Link href="/admin" className="flex items-center p-2 hover:bg-purple-700 rounded">
            <i class="fi fi-rr-home text-2xl"></i>
              <span className="ml-4 text-xl">Dashboard</span>
            </Link>

            <Link href="/admin/manage-business" className="flex items-center p-2 hover:bg-purple-700 rounded">
            <i class="fi fi-rr-edit text-2xl"></i>
              <span className="ml-4 text-xl">Manage Business Details</span>
            </Link>

            <Link href="/admin/manage-team-members" className="flex items-center p-2 hover:bg-purple-700 rounded">
            <i class="fi fi-rr-users text-2xl"></i>
              <span className="ml-4 text-xl">Manage Team Members</span>
            </Link>

            <Link href="/admin/manage-appointments" className="flex items-center p-2 hover:bg-purple-700 rounded">
            <i class="fi fi-rs-calendar text-2xl"></i>
              <span className="ml-4 text-xl">Manage Appointments</span>
            </Link>

            <Link href="/payments" className="flex items-center p-2 hover:bg-purple-700 rounded">
            <i class="fi fi-rr-credit-card text-2xl"></i>
              <span className="ml-4 text-xl">Payments & Invoices</span>
            </Link>

            <Link href="/settings" className="flex items-center p-2 hover:bg-purple-700 rounded">
            <i class="fi fi-rs-settings text-2xl"></i>
              <span className="ml-4 text-xl">Settings</span>
            </Link>

            <div className="mt-8"></div>
            </nav>
            <button
               onClick={handleLogout}
                className="flex items-center p-2 hover:bg-purple-700 rounded mt-4">
                <i class="fi fi-rs-sign-out-alt text-2xl"></i>
                <span className="ml-4 text-xl">Logout</span>
            </button>
          
        </div>

        {/* Main Content */}
        <div className="flex-grow p-4"> {/* Reduced padding */}
          <h1 className="text-4xl font-bold mb-6">Dashboard</h1> {/* Reduced margin */}

          {/* Updated Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6"> {/* Reduced gap */}
            {/* Total Bookings Card */}
            <div className="bg-white shadow-2xl rounded-lg p-4 relative flex items-center"> {/* Reduced padding */}
              <img src="/book.png" alt="Total Bookings" className="w-10 h-10 mr-4" /> {/* Left-aligned image */}
              <div className="flex-grow">
                <h3 className="text-gray-600">Total Bookings</h3>
                <h1 className="text-2xl font-bold absolute bottom-2 right-4">196</h1> {/* Moved number to bottom-right */}
              </div>
            </div>

            {/* Sales Card */}
            <div className="bg-white shadow-2xl rounded-lg p-4 relative flex items-center"> {/* Reduced padding */}
              <img src="/sales.png" alt="Sales" className="w-10 h-10 mr-4" /> {/* Left-aligned image */}
              <div className="flex-grow">
                <h3 className="text-gray-600">Sales</h3>
                <h1 className="text-2xl font-bold absolute bottom-2 right-4">74</h1> {/* Moved number to bottom-right */}
              </div>
            </div>
          </div>

          {/* Row Layout for Chart and Calendar */}
          <div className="grid grid-cols-2 gap-4"> {/* Reduced gap */}
            {/* Earning Summary Chart */}
            <div className="bg-white shadow-2xl rounded-lg p-4"> {/* Reduced padding */}
              <h3 className="text-xl font-bold mb-2">Earning Summary</h3> {/* Reduced margin */}
              <div className="h-72 w-full"> {/* Reduced height */}
                <Line data={chartData} />
              </div>
            </div>

            {/* Calendar */}
            <div className="bg-white shadow-2xl rounded-lg p-4"> {/* Reduced padding */}
              <h3 className="text-xl font-bold mb-2 text-center">Calendar</h3> {/* Reduced margin */}
              <div className="flex justify-center">
                <div className="w-128"> {/* Reduced width */}
                  <Calendar />
                </div>
              </div>
            </div>

            {/* Booking Link */}
            <div className="bg-white shadow-2xl rounded-lg p-4 mb-6"> {/* Reduced padding */}
              <h3 className="text-xl font-bold mb-2">Booking Link</h3> {/* Reduced margin */}
              <input
                type="text"
                id="link"
                value={BookLink}
                className="w-full px-2 py-1 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                readOnly
              />
            </div>
            <div className="bg-white shadow-2xl rounded-lg p-4 mb-6"> {/* Small reminders section */}
              <h3 className="text-lg font-bold mb-2">Reminders</h3>
              <p className="text-sm text-gray-500">No new reminders</p>
            </div>
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
};

export default AdminPage;

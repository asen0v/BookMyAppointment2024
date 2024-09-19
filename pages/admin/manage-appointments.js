import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { logoutUser, clearUser } from '@/redux/slices/userSlice';
import { auth } from '@/utils/firebase';
import BusinessAppointments from '@/components/Admin/BusinessAppointments';
import PrivateRoute from '../../components/PrivateRoute';

const AdminManageAppointmentsPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      dispatch(logoutUser());
      await auth.signOut(); // Ensure Firebase auth sign out is also called
      localStorage.clear(); // Clear localStorage upon logout
      dispatch(clearUser()); // Clear user info from Redux state
      router.replace('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  return (
    <PrivateRoute role="admin">
      {/* Page Layout */}
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
        <div className="flex-grow p-8">
          <div className="bg-white shadow-2xl rounded-lg p-8 w-full">
            <BusinessAppointments />
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
};

export default AdminManageAppointmentsPage;

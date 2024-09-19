import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { logoutUser, clearUser } from '@/redux/slices/userSlice';
import { auth } from '@/utils/firebase';

const CustomerPage = () => {
  const user = useSelector((state) => state.user.userInfo);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'team')) {
      router.replace('/'); // Redirect if not allowed
    }
  }, [user, router]);

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

  if (user && (user.role === 'admin' || user.role === 'team')) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="bg-custom-purple text-white w-64 flex flex-col p-4 sticky top-0 h-screen">
        {/* Logo and Title with Link */}
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

        {/* Menu Items */}
        <nav className="flex flex-col flex-grow space-y-4">
          <Link href="/customer" className="flex items-center p-2 hover:bg-purple-700 rounded">
          <i class="fi fi-rr-home text-2xl"></i>
            <span className="ml-4 text-xl">Customer Home</span>
          </Link>

          <Link href="/customer/booking" className="flex items-center p-2 hover:bg-purple-700 rounded">
          <i class="fi fi-rr-square-plus text-2xl"></i>
            <span className="ml-4 text-xl">Customer Booking</span>
          </Link>

          <Link href="/customer/appointments" className="flex items-center p-2 hover:bg-purple-700 rounded">
          <i class="fi fi-rs-calendar text-2xl"></i>
            <span className="ml-4 text-xl">Customer Appointments</span>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-8">
        <div className="bg-white shadow-2xl rounded-lg p-8 w-full">
          <h2 className="text-2xl font-bold mb-4">Welcome to the Customer Page</h2>
          <p>Please select an option from the sidebar to get started.</p>
        </div>
      </div>
    </div>
  );
};

// Indicate that this page should not use the default layout
CustomerPage.useDefaultLayout = false;

export default CustomerPage;

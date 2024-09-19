import CustomerDashboard from '@/components/Customer/CustomerDashboard';
import Link from 'next/link';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

const CustomerDashboardPage = () => {
  const user = useSelector((state) => state.user.userInfo);
  const router = useRouter();

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'team')) {
      router.replace('/'); // Redirect to the homepage or an appropriate page
    }
  }, [user, router]);

  if (user && (user.role === 'admin' || user.role === 'team')) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
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
      <div className="w-full lg:w-3/4 p-8 flex flex-col items-start justify-start">
        <div className="bg-white shadow-2xl rounded-lg p-8 w-full">
          <CustomerDashboard />
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboardPage;
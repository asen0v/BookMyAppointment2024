import { useSelector, useDispatch } from 'react-redux';
import { logoutUser, clearUser } from '../redux/slices/userSlice';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/utils/firebase';
import Link from 'next/link';

const Navbar = () => {
  const user = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      dispatch(logoutUser());
      await auth.signOut(); // Ensure Firebase auth sign out is also called
      localStorage.clear(); // Clear localStorage upon logout
      dispatch(clearUser()); // Clear user info from Redux state
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Handle authenticated user
      } else {
        // Handle unauthenticated state
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <nav className="bg-[#5b32c7] text-white py-3"> {/* Reduced padding for thinner navbar */}
      <div className="flex justify-between items-center px-8"> {/* Padding for left/right space */}

        {/* Logo and Brand Name */}
        <Link href="/" passHref>
          <div className="flex items-center cursor-pointer">
            <img src="/circle.svg" alt="Logo" className="w-[56px] h-[56px] mr-4" /> {/* Slightly reduced logo size */}
            <div className="text-left text-lg font-semibold"> {/* Increased font size */}
              <div>Book</div>
              <div>My</div>
              <div>Appointment</div>
            </div>
          </div>
        </Link>

        {/* Centered Navigation Links */}
        <div className="flex flex-1 justify-center space-x-20"> {/* Kept space between links balanced */}
          <Link href="/" passHref>
            <span className="cursor-pointer text-2xl">Home</span> {/* Increased font size */}
          </Link>
          <Link href="/AboutUs" passHref>
            <span className="cursor-pointer text-2xl">About us</span> {/* Increased font size */}
          </Link>
          <Link href="/Services" passHref>
            <span className="cursor-pointer text-2xl">Services</span> {/* Increased font size */}
          </Link>
          <Link href="/Testimonials" passHref>
            <span className="cursor-pointer text-2xl">Testimonials</span> {/* Increased font size */}
          </Link>
          <Link href="/FAQs" passHref>
            <span className="cursor-pointer text-2xl">FAQs</span> {/* Increased font size */}
          </Link>
          <Link href="/Contact" passHref>
            <span className="cursor-pointer text-2xl">Contact Us</span> {/* Increased font size */}
          </Link>
        </div>

        {/* Buttons on the Right */}
        <div className="flex space-x-6 pr-6">
          {user ? (
            <>
              <span className="mr-4 text-lg">Hello, {user.email}</span> {/* Same font size */}
              <button onClick={handleLogout} className="border border-white px-6 py-2 rounded text-white text-xl"> {/* Larger text size for buttons */}
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" passHref>
                <button className="border border-white px-6 py-2 rounded text-white text-xl"> {/* Larger text size for buttons */}
                  Log In
                </button>
              </Link>
              <Link href="/register/business" passHref>
                <button className="bg-orange-500 px-6 py-2 rounded text-white text-xl"> {/* Larger text size for buttons */}
                  Register Business
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

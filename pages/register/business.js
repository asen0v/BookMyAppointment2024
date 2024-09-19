import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, setError, clearError } from '../../redux/slices/userSlice';
import { useRouter } from 'next/router';
import BusinessDetailsManager from '../../components/Admin/BusinessDetailsManager'; // Ensure this path is correct
import Link from 'next/link';
import Image from 'next/image';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('admin');
  const [loading, setLoading] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const error = useSelector((state) => state.user.error);
  const user = useSelector((state) => state.user.userInfo);

  useEffect(() => {
    if (user) {
      router.replace('/admin');
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await dispatch(registerUser({ email, password, displayName, role }));
      setLoading(false);
      if (result.payload) {
        dispatch(clearError());
        setEmail('');
        setPassword('');
        setDisplayName('');
        setRole('admin');
        setRegistrationComplete(true);
      } else {
        console.error('Registration failed:', result.error.message);
        dispatch(setError(result.error.message));
      }
    } catch (error) {
      setLoading(false);
      console.error('Registration failed:', error.message);
      dispatch(setError(error.message));
    }
  };

  if (registrationComplete) {
    return <BusinessDetailsManager />;
  }

  if (user) {
    return null; // Prevent rendering if the user is already logged in and redirecting
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content Layout */}
      <div className="w-full p-8 flex items-center justify-between">
        {/* Logo/Image on the Left */}
        <div className="flex justify-center items-center w-1/2 mt-[100px] mb-[-750px]">
          <Image
            src="/logo.jpg" // Replace with the actual path of your logo or image
            alt="Register Illustration"
            width={700}
            height={600}
            className="object-contain"
          />
        </div>

        {/* Register Business Form on the Right */}
        <div className="w-1/2 bg-white shadow-2xl rounded-lg p-8 mt-[150px] mb-[-700px]">
          <h1 className="text-3xl font-bold text-[#6A3FF0] mb-8 text-center">
            Register Your Business
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6 p-8">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="displayName">
                Business Name
              </label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  if (error) dispatch(clearError());
                }}
                placeholder="Enter your business name"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#6A3FF0] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) dispatch(clearError());
                }}
                placeholder="Enter your email address"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#6A3FF0] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) dispatch(clearError());
                }}
                placeholder="Enter a password"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#6A3FF0] focus:border-transparent"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                id="acceptTerms"
              />
              <label htmlFor="acceptTerms" className="ml-2 text-gray-700 text-sm">
                I accept terms and conditions
              </label>
            </div>
            {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
            <div className="text-center mt-4">
              <button
                type="submit"
                className="w-full bg-[#6A3FF0] hover:bg-purple-800 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register Business'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

// pages/register.js

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, setError, clearError } from '../../redux/slices/userSlice';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [businessId, setBusinessId] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
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

    if (!acceptTerms) {
      setLoading(false);
      dispatch(setError('Please accept terms and conditions to continue.'));
      return;
    }

    try {
      const result = await dispatch(registerUser({ email, password, displayName, businessId }));
      setLoading(false);
      if (result.payload) {
        dispatch(clearError());
        setEmail('');
        setPassword('');
        setDisplayName('');
        setBusinessId('');
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
    return null; // Add redirection or business details management as needed
  }

  if (user) {
    return null; // Prevent rendering if the user is already logged in and redirecting
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-2xl rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-center">Create an Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="displayName">
              Username
            </label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
                if (error) dispatch(clearError());
              }}
              placeholder="Username"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="businessId">
              Business ID
            </label>
            <input
              type="text"
              id="businessId"
              value={businessId}
              onChange={(e) => {
                setBusinessId(e.target.value);
                if (error) dispatch(clearError());
              }}
              placeholder="BMA123456789"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
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
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              className="form-checkbox"
              id="acceptTerms"
              checked={acceptTerms}
              onChange={() => setAcceptTerms(!acceptTerms)}
            />
            <label htmlFor="acceptTerms" className="ml-2 text-gray-700 text-sm">
              I accept terms and conditions
            </label>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Sign Up'}
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          Already have an account? <Link href="/login" className="text-purple-700 hover:underline">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

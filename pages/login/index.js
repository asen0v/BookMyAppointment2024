import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, setError, clearError } from '../../redux/slices/userSlice';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const error = useSelector((state) => state.user.error);
  const user = useSelector((state) => state.user.userInfo);

  // Redirect to appropriate page based on user role
  useEffect(() => {
    if (user) {
      switch (user.role) {
        case 'admin':
          router.push('/admin');
          break;
        case 'team':
          router.push('/team');
          break;
        default:
          router.push('/');
      }
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await dispatch(loginUser({ email, password }));
      setLoading(false);
      if (result.payload) {
        setEmail('');
        setPassword('');
        dispatch(clearError());
      } else {
        dispatch(setError(result.error.message)); // Dispatch setError action
      }
    } catch (error) {
      setLoading(false);
      dispatch(setError(error.message)); // Dispatch setError action
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center mt-[-130px] mb-[-100px]">
      <div className="bg-white shadow-2xl rounded-lg p-8 w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-2 text-center">Login to Account</h1>
        <p className="text-center mb-6">Please enter your email and password to continue</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email address:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) dispatch(clearError());
              }}
              placeholder="admin_account@business.com"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <Link href="#" className="text-sm text-purple-700 hover:underline float-right mb-2">
              Forget Password?
            </Link>
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
            <input type="checkbox" className="form-checkbox" />
            <span className="ml-2 text-gray-700">Remember Password</span>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </div>
        </form>
        {error && <p className="text-red-500 text-xs italic mt-4 text-center">{error}</p>}
        <div className="text-center mt-4">
          Don't have an account?{' '}
          <Link href="/register/business" className="text-purple-700 hover:underline">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

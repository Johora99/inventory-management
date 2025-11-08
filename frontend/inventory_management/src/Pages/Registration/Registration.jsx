import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import GoogleLogin from '../../Components/SocialLogin/GoogleLogin';
import GithubLogin from '../../Components/SocialLogin/GithubLogin';
import useAuth from '../../Hooks/useAuth';
import useAxiosPublic from '../../Hooks/useAxiosPublic';

export default function Registration() {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [msg, setMsg] = useState(null);
  const password = watch('password');
  const {setLoading, setAuthUser} = useAuth()
  const axiosPublic = useAxiosPublic()
  const navigate = useNavigate();
const onSubmit = async (data) => {
  setLoading(true);
  try {
    const userInfo = {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    };

    const response = await axiosPublic.post("/api/auth/register", userInfo);

    if (response.status === 201 || response.status === 200) {
      const user = response.data.data?.user;

      // ✅ Check if user is blocked
      if (user?.isBlocked) {
        setMsg({ type: 'error', text: "Your account is blocked. Please contact admin." });
        localStorage.removeItem('token');
        return;
      }

      if (response.data.data.token) {
        const { token } = response.data.data;
        setAuthUser({ token, email: user.email });
        setMsg({ type: 'success', text: response.data.message });
        navigate("/");
      } else {
        localStorage.removeItem('token');
      }
    }
  } catch (err) {
    console.error(err);
    setMsg({ type: 'error', text: err.response?.data?.message });
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
          Create Account
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Sign up to get started
        </p>

        {/* Social Login Buttons */}
        <div className="space-y-3 mb-6">
          <GoogleLogin />
          <GithubLogin />
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with email</span>
          </div>
        </div>
         {/* Success/Error Message */}
          {msg && (
            <div className={`p-3 mb-4 rounded ${msg.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
              {msg.text}
            </div>
          )}
        {/* Registration Form */}
        <form action="" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                {...register('fullName', { 
                  required: 'Full name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Full Name"
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="info@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Password must contain uppercase, lowercase, and number'
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                {...register('confirmPassword', { 
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match'
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                {...register('terms', { required: 'You must accept the terms and conditions' })}
                className="mt-1 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <label className="ml-2 text-sm text-gray-600">
                I agree to the{' '}
                <a href="#" className="text-teal-600 hover:underline">
                  Terms and Conditions
                </a>
              </label>
            </div>
            {errors.terms && (
              <p className="text-red-500 text-xs">{errors.terms.message}</p>
            )}

            <button
              onClick={handleSubmit(onSubmit)}
              className="w-full bg-teal-600 text-white py-2.5 rounded-lg font-medium hover:bg-teal-700 transition-colors cursor-pointer"
            >
              Create Account
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <Link to={'/login'} className="text-teal-600 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

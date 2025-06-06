import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Code, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { z } from 'zod';
import AuthImagePattern from '../components/AuthImagePattern';
import { useAuthStore } from '../store/useAuthStore';
import { getGoogleRedirectUrl } from '../lib/apis';

const signUpSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be atleast 6 character'),
  name: z.string().min(2, 'Name must be atleast 2 character'),
});

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const { signup, isSigninUp } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async data => {
    try {
      await signup(data);
      console.log('Signup data: ', data);
    } catch (error) {
      console.log('SignUp failed', error);
    }
  };
	const authHandler = async () => {
    getGoogleRedirectUrl();
	};

  return (
    <div className="flex h-screen w-full">
      {/* Left Side: Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-base-100">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
              <Code className="text-primary h-6 w-6" />
            </div>
            <h1 className="mt-4 text-2xl font-bold">Welcome</h1>
            <p className="text-base-content/60">Sign Up to your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Name</span>
              </label>
              <div className="relative">
                <Code className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/40" />
                <input
                  type="text"
                  {...register('name')}
                  className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/40" />
                <input
                  type="email"
                  {...register('email')}
                  className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className={`input input-bordered w-full pr-10 ${errors.password ? 'input-error' : ''}`}
                  placeholder="********"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/40" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/40" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-full" disabled={isSigninUp}>
              {isSigninUp ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                'Sign up'
              )}
            </button>
          </form>

          <div className="mt-6">
            <button type="button" className="btn btn-outline w-full flex items-center justify-center gap-2" onClick={authHandler}>
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="h-5 w-5"
              />
              Sign in with Google
            </button>
          </div>

          <p className="mt-4 text-center text-base-content/60">
            Already have an account?{' '}
            <Link to="/login" className="link link-primary">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side: Illustration */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-base-200 p-12">
        <AuthImagePattern
          title="Welcome to our platform!"
          subtitle="Sign up to access our platform and start using our services."
        />
      </div>
    </div>
  );
};

export default SignUpPage;

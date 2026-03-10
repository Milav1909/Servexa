'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'provider';
}

export default function LandingPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        if (data.user.role === 'user') {
          router.push('/services');
        } else if (data.user.role === 'provider') {
          router.push('/provider/dashboard');
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-purple-50">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full opacity-30 blur-3xl"></div>
          <div className="absolute top-60 -left-20 w-60 h-60 bg-indigo-200 rounded-full opacity-40 blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-pink-200 rounded-full opacity-30 blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                Trusted by 10,000+ users
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Find Local Services
                <span className="block bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Made Simple
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Connect with verified professionals in your area. Book plumbers, electricians,
                cleaners, and more with just a few clicks!
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/login"
                  className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-purple-200 hover:shadow-2xl hover:shadow-purple-300 transition-all duration-300 hover:-translate-y-1"
                >
                  Get Started
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/provider/login"
                  className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-2xl font-bold text-lg border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300"
                >
                  Become a Provider
                </Link>
              </div>
            </div>

            {/* Right Content - Stats Cards */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple-200">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">500+</h3>
                  <p className="text-gray-500 font-medium">Active Providers</p>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 mt-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-green-200">
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">4.9/5</h3>
                  <p className="text-gray-500 font-medium">Average Rating</p>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-orange-200">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">10K+</h3>
                  <p className="text-gray-500 font-medium">Jobs Completed</p>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 mt-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-pink-200">
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">98%</h3>
                  <p className="text-gray-500 font-medium">Happy Customers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Our Services
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What We Offer
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find the right professional for any job
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: '🔧', name: 'Plumbing', color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50' },
              { icon: '⚡', name: 'Electrical', color: 'from-yellow-500 to-amber-500', bg: 'bg-yellow-50' },
              { icon: '🧹', name: 'Cleaning', color: 'from-green-500 to-emerald-500', bg: 'bg-green-50' },
              { icon: '🔨', name: 'Carpentry', color: 'from-orange-500 to-red-500', bg: 'bg-orange-50' },
              { icon: '🎨', name: 'Painting', color: 'from-pink-500 to-rose-500', bg: 'bg-pink-50' },
              { icon: '❄️', name: 'AC Repair', color: 'from-cyan-500 to-blue-500', bg: 'bg-cyan-50' },
              { icon: '🔑', name: 'Locksmith', color: 'from-gray-500 to-slate-500', bg: 'bg-gray-50' },
              { icon: '🌿', name: 'Gardening', color: 'from-lime-500 to-green-500', bg: 'bg-lime-50' },
            ].map((service, index) => (
              <div
                key={index}
                className={`${service.bg} p-6 rounded-2xl text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group border border-transparent hover:border-gray-200`}
              >
                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-3xl">{service.icon}</span>
                </div>
                <h4 className="font-bold text-gray-800 text-lg">{service.name}</h4>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-700 transition-colors"
            >
              Explore all services
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 text-white relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-60 h-60 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-indigo-500 rounded-full opacity-10 blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm font-semibold mb-4">
              How It Works
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Book Services in 3 Easy Steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-white/10 backdrop-blur rounded-3xl flex items-center justify-center group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-sm font-bold text-gray-900">01</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Search</h3>
              <p className="text-white leading-relaxed" style={{ color: 'white' }}>Browse our wide range of local services and find what you need</p>
            </div>

            <div className="text-center group">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-white/10 backdrop-blur rounded-3xl flex items-center justify-center group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-sm font-bold text-gray-900">02</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Book</h3>
              <p className="text-white leading-relaxed" style={{ color: 'white' }}>Select your preferred time slot and book with a verified provider</p>
            </div>

            <div className="text-center group">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-white/10 backdrop-blur rounded-3xl flex items-center justify-center group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-sm font-bold text-gray-900">03</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Relax</h3>
              <p className="text-white leading-relaxed" style={{ color: 'white' }}>Sit back and relax while the professional handles everything</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                About Us
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Your Trusted Local Service Marketplace
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                LocalServe is dedicated to connecting homeowners and businesses with reliable,
                skilled professionals in their community. We believe everyone deserves access
                to quality services at fair prices.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                Our platform ensures transparent pricing, verified professionals, and secure
                booking - making it easy for you to get the help you need, when you need it.
              </p>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">✓</span>
                  </div>
                  <span className="font-semibold text-gray-800">Verified Experts</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🛡️</span>
                  </div>
                  <span className="font-semibold text-gray-800">Secure Payments</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <span className="font-semibold text-gray-800">Quick Response</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all duration-300">
                <span className="text-4xl block mb-3">🛡️</span>
                <h4 className="font-bold text-gray-800">Verified Pros</h4>
                <p className="text-sm text-gray-600 mt-2">Background-checked professionals</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all duration-300">
                <span className="text-4xl block mb-3">💰</span>
                <h4 className="font-bold text-gray-800">Fair Pricing</h4>
                <p className="text-sm text-gray-600 mt-2">Transparent rates</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all duration-300">
                <span className="text-4xl block mb-3">⭐</span>
                <h4 className="font-bold text-gray-800">Rated Reviews</h4>
                <p className="text-sm text-gray-600 mt-2">Real customer feedback</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all duration-300">
                <span className="text-4xl block mb-3">🔒</span>
                <h4 className="font-bold text-gray-800">Secure Booking</h4>
                <p className="text-sm text-gray-600 mt-2">Safe transactions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Join thousands of happy customers and service providers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-purple-200 hover:shadow-2xl hover:shadow-purple-300 transition-all duration-300 hover:-translate-y-1"
            >
              Sign Up as Customer
            </Link>
            <Link
              href="/provider/register"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-green-200 hover:shadow-2xl hover:shadow-green-300 transition-all duration-300 hover:-translate-y-1"
            >
              Register as Provider
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">LocalServe</span>
              </div>
              <p className="text-sm leading-relaxed text-gray-400" style={{ color: '#9ca3af' }}>
                Your trusted marketplace for local services. Connecting customers with professionals since 2024.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4" style={{ color: 'white' }}>For Customers</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/login" className="text-gray-400 hover:text-white transition" style={{ color: '#9ca3af' }}>Login</Link></li>
                <li><Link href="/register" className="text-gray-400 hover:text-white transition" style={{ color: '#9ca3af' }}>Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4" style={{ color: 'white' }}>For Providers</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/provider/login" className="text-gray-400 hover:text-white transition" style={{ color: '#9ca3af' }}>Provider Login</Link></li>
                <li><Link href="/provider/register" className="text-gray-400 hover:text-white transition" style={{ color: '#9ca3af' }}>Become a Provider</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4" style={{ color: 'white' }}>Contact</h4>
              <ul className="space-y-3 text-sm text-gray-400" style={{ color: '#9ca3af' }}>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-400" style={{ color: '#a855f7' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span style={{ color: '#9ca3af' }}>support@localserve.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" style={{ color: '#4ade80' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span style={{ color: '#9ca3af' }}>+91 1800-123-4567</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-red-400" style={{ color: '#f87171' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span style={{ color: '#9ca3af' }}>India</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2024 LocalServe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

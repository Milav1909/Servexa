'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, Activity, Users, Star, Award, Search, CheckCircle, 
  MapPin, Shield, Check, Wrench, Zap, Sparkles, Hammer, Paintbrush, 
  Snowflake, Key, Leaf, MessageSquare, Mail
} from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-600 font-medium tracking-tight">Loading Servexa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Subtle background gradient shapes instead of harsh colors */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50/50 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-100/80 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left z-10">
              <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-8 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Trusted by 10,000+ users
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-8 tracking-tight">
                Find Local <br /> Services <span className="text-indigo-600">Made Simple.</span>
              </h1>

              <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Connect with highly verified professionals in your area. Book skilled plumbers, electricians,
                cleaners, and more with exceptional ease.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/login"
                  className="group inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-sm hover:bg-indigo-700 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/provider/login"
                  className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 px-8 py-4 rounded-full font-semibold text-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 shadow-sm"
                >
                  Become a Provider
                </Link>
              </div>
            </div>

            {/* Right Content - Stats Cards */}
            <div className="relative z-10">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">500+</h3>
                  <p className="text-slate-500 font-medium">Active Providers</p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 hover:-translate-y-1 transition-transform duration-300 mt-12">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                    <Star className="w-6 h-6" />
                  </div>
                  <h3 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">4.9/5</h3>
                  <p className="text-slate-500 font-medium">Average Rating</p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mb-6">
                    <Activity className="w-6 h-6" />
                  </div>
                  <h3 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">10K+</h3>
                  <p className="text-slate-500 font-medium">Jobs Completed</p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 hover:-translate-y-1 transition-transform duration-300 mt-12">
                  <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-6">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">98%</h3>
                  <p className="text-slate-500 font-medium">Happy Customers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              What We Offer
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Find the right professional for any job
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Wrench, name: 'Plumbing', color: 'text-blue-600', bg: 'bg-blue-50' },
              { icon: Zap, name: 'Electrical', color: 'text-amber-600', bg: 'bg-amber-50' },
              { icon: Sparkles, name: 'Cleaning', color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { icon: Hammer, name: 'Carpentry', color: 'text-orange-600', bg: 'bg-orange-50' },
              { icon: Paintbrush, name: 'Painting', color: 'text-rose-600', bg: 'bg-rose-50' },
              { icon: Snowflake, name: 'AC Repair', color: 'text-sky-600', bg: 'bg-sky-50' },
              { icon: Key, name: 'Locksmith', color: 'text-slate-600', bg: 'bg-slate-100' },
              { icon: Leaf, name: 'Gardening', color: 'text-lime-600', bg: 'bg-lime-50' },
            ].map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="p-8 rounded-3xl text-center hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 cursor-pointer group border border-slate-100 bg-white"
                >
                  <div className={`w-16 h-16 mx-auto mb-6 ${service.bg} ${service.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8" strokeWidth={1.5} />
                  </div>
                  <h4 className="font-semibold text-slate-800 text-lg tracking-tight">{service.name}</h4>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors bg-indigo-50 px-6 py-3 rounded-full hover:bg-indigo-100"
            >
              Explore all services
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight text-white">
              Book Services in 3 Easy Steps
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              A seamless experience from start to finish
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="relative inline-block mb-8">
                <div className="w-24 h-24 bg-slate-800 border border-slate-700 rounded-3xl flex items-center justify-center group-hover:bg-slate-700 transition-all duration-300 group-hover:scale-105 shadow-xl">
                  <Search className="w-10 h-10 text-indigo-400 shrink-0" strokeWidth={1.5} />
                </div>
                <span className="absolute -top-3 -right-3 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Search</h3>
              <p className="text-slate-400 leading-relaxed font-medium">Browse our wide range of local services and find what you need</p>
            </div>

            <div className="text-center group">
              <div className="relative inline-block mb-8">
                <div className="w-24 h-24 bg-slate-800 border border-slate-700 rounded-3xl flex items-center justify-center group-hover:bg-slate-700 transition-all duration-300 group-hover:scale-105 shadow-xl">
                  <CheckCircle className="w-10 h-10 text-emerald-400 shrink-0" strokeWidth={1.5} />
                </div>
                <span className="absolute -top-3 -right-3 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Book</h3>
              <p className="text-slate-400 leading-relaxed font-medium">Select your preferred time slot and book with a verified provider</p>
            </div>

            <div className="text-center group">
              <div className="relative inline-block mb-8">
                <div className="w-24 h-24 bg-slate-800 border border-slate-700 rounded-3xl flex items-center justify-center group-hover:bg-slate-700 transition-all duration-300 group-hover:scale-105 shadow-xl">
                  <Sparkles className="w-10 h-10 text-amber-400 shrink-0" strokeWidth={1.5} />
                </div>
                <span className="absolute -top-3 -right-3 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Relax</h3>
              <p className="text-slate-400 leading-relaxed font-medium">Sit back and relax while the professional handles everything</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">
                Your Trusted Local Service Marketplace
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6 text-lg font-medium">
                Servexa is dedicated to connecting homeowners and businesses with reliable,
                skilled professionals in their community. We believe everyone deserves access
                to quality services at fair prices.
              </p>
              <p className="text-slate-600 leading-relaxed mb-10 text-lg font-medium">
                Our platform ensures transparent pricing, verified professionals, and secure
                booking - making it easy for you to get the help you need, when you need it.
              </p>

              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                    <Check className="w-6 h-6" strokeWidth={2.5} />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block text-lg">Verified Experts</span>
                    <span className="text-slate-500 font-medium">Every provider goes through strict background checks.</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6" strokeWidth={2} />
                  </div>
                  <div>
                     <span className="font-bold text-slate-800 block text-lg">Secure Booking</span>
                     <span className="text-slate-500 font-medium">Transactions are encrypted and safe.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-md transition-shadow">
                <Shield className="w-10 h-10 text-indigo-600 mb-4" strokeWidth={1.5} />
                <h4 className="font-bold text-slate-900 text-lg tracking-tight">Verified Pros</h4>
                <p className="text-sm text-slate-500 mt-2 font-medium">Background-checked professionals</p>
              </div>
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-md transition-shadow">
                <Activity className="w-10 h-10 text-emerald-600 mb-4" strokeWidth={1.5} />
                <h4 className="font-bold text-slate-900 text-lg tracking-tight">Fair Pricing</h4>
                <p className="text-sm text-slate-500 mt-2 font-medium">Transparent upfront rates</p>
              </div>
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-md transition-shadow">
                <MessageSquare className="w-10 h-10 text-amber-600 mb-4" strokeWidth={1.5} />
                <h4 className="font-bold text-slate-900 text-lg tracking-tight">Real Reviews</h4>
                <p className="text-sm text-slate-500 mt-2 font-medium">Honest customer feedback</p>
              </div>
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-md transition-shadow">
                <CheckCircle className="w-10 h-10 text-sky-600 mb-4" strokeWidth={1.5} />
                <h4 className="font-bold text-slate-900 text-lg tracking-tight">Guaranteed</h4>
                <p className="text-sm text-slate-500 mt-2 font-medium">Quality service delivery</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-slate-500 mb-12 font-medium">
            Join thousands of happy customers and growing service providers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"
            >
              Sign Up as Customer
            </Link>
            <Link
              href="/provider/register"
              className="inline-flex items-center justify-center gap-2 bg-white text-slate-800 px-8 py-4 rounded-full font-semibold text-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
            >
              Register as Provider
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                   <MapPin className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-xl font-bold text-slate-900 tracking-tight">Servexa</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-500 font-medium">
                Your trusted marketplace for local services. Connecting customers with professionals since 2024.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">For Customers</h4>
              <ul className="space-y-3 text-sm font-medium">
                <li><Link href="/login" className="text-slate-500 hover:text-indigo-600 transition-colors">Login</Link></li>
                <li><Link href="/register" className="text-slate-500 hover:text-indigo-600 transition-colors">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">For Providers</h4>
              <ul className="space-y-3 text-sm font-medium">
                <li><Link href="/provider/login" className="text-slate-500 hover:text-indigo-600 transition-colors">Provider Login</Link></li>
                <li><Link href="/provider/register" className="text-slate-500 hover:text-indigo-600 transition-colors">Become a Provider</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Contact</h4>
              <ul className="space-y-3 text-sm text-slate-500 font-medium">
                <li className="flex items-center gap-3">
                   <Mail className="w-4 h-4 text-slate-400" />
                  <span>support@servexa.com</span>
                </li>
                <li className="flex items-center gap-3">
                   <Activity className="w-4 h-4 text-slate-400" />
                  <span>+91 1800-123-4567</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-8 text-center text-sm text-slate-500 font-medium">
            <p>© 2024 Servexa. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

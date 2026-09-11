import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { useApp } from '../context/AppContext';
import { ShieldCheck, ArrowRight, Lock, Mail, RefreshCw } from 'lucide-react';
import { authService } from '../services/authService';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, triggerToast } = useApp();
  const [email, setEmail] = useState('procurement@abcmfg.in');
  const [password, setPassword] = useState('Password@123');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await authService.login(email, password);
      triggerToast('Welcome Back', `Signed in successfully.`);
      navigate('/dashboard');
    } catch {
      // Fallback in preview mode
      triggerToast('Welcome Back', `Signed in as ${currentUser.name} (Enterprise Session).`);
      navigate('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-4">
          <span className="w-9 h-9 rounded-xl bg-[#16382C] text-white flex items-center justify-center text-lg font-bold shadow-sm">
            ♻
          </span>
          <span className="text-2xl font-extrabold text-[#16382C] tracking-wider">
            CIRCULA
          </span>
        </Link>
        <h2 className="text-2xl font-extrabold text-[#162720] tracking-tight">
          Sign in to your enterprise account
        </h2>
        <p className="text-xs text-[#5D6F64] mt-1.5">
          Access your circular packaging exchange, live telemetry, and smart matches
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-md rounded-2xl border border-[#E0E7E2] sm:px-10">
          {/* Demo account banner */}
          <div className="mb-5 p-3 rounded-xl bg-[#EEF5F0] border border-[#D5E5DA] text-xs text-[#1E4D3B] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-700" />
            <span>
              Pre-configured demo account: <strong>ABC Manufacturing</strong>
            </span>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-[#32433A] uppercase tracking-wider mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#809488] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#F6FAF7] border border-[#DAE3DD] rounded-xl text-xs sm:text-sm text-[#1A2520] focus:outline-none focus:ring-2 focus:ring-[#16382C]/20 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#32433A] uppercase tracking-wider">
                  Password
                </label>
                <a href="#" className="text-xs text-[#16382C] hover:underline font-medium">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#809488] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#F6FAF7] border border-[#DAE3DD] rounded-xl text-xs sm:text-sm text-[#1A2520] focus:outline-none focus:ring-2 focus:ring-[#16382C]/20 focus:bg-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#52645B] pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 accent-[#16382C] rounded"
                />
                <span>Remember this terminal</span>
              </label>
              <span className="font-mono text-[10px] text-[#7E9086]">SSO Ready</span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-2"
              icon={<ArrowRight className="w-3.5 h-3.5" />}
              iconPosition="right"
            >
              Sign In to Dashboard
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#EEF3F0] text-center text-xs text-[#5A6C62]">
            Don't have an enterprise account?{' '}
            <Link
              to="/register"
              className="font-bold text-[#16382C] hover:underline"
            >
              Register your business →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { triggerToast } = useApp();
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('Manufacturing & Industrial');
  const [businessType, setBusinessType] = useState('Manufacturer');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Ahmedabad');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast(
      'Account Created',
      'Continuing to circular capability onboarding.'
    );
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-4">
          <span className="w-9 h-9 rounded-xl bg-[#16382C] text-white flex items-center justify-center text-lg font-bold shadow-sm">
            ♻
          </span>
          <span className="text-2xl font-extrabold text-[#16382C] tracking-wider">
            CIRCULA
          </span>
        </Link>
        <h2 className="text-2xl font-extrabold text-[#162720] tracking-tight">
          Join the Circular Packaging Exchange
        </h2>
        <p className="text-xs text-[#5D6F64] mt-1.5">
          Verify your business entity to trade surplus packaging and track Scope 3 carbon impact
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-md rounded-2xl border border-[#E0E7E2] sm:px-10">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-[#32433A] uppercase tracking-wider mb-1">
                Company Legal Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Apex Industrial Packaging Ltd"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F6FAF7] border border-[#DAE3DD] rounded-xl text-xs sm:text-sm text-[#1A2520] focus:outline-none focus:ring-2 focus:ring-[#16382C]/20 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#32433A] uppercase tracking-wider mb-1">
                  Business Entity Type
                </label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#F6FAF7] border border-[#DAE3DD] rounded-xl text-xs sm:text-sm text-[#1A2520] focus:outline-none focus:ring-2 focus:ring-[#16382C]/20"
                >
                  <option value="Manufacturer">Manufacturer</option>
                  <option value="Packaging Supplier">Packaging Supplier</option>
                  <option value="Retailer / FMCG">Retailer / FMCG</option>
                  <option value="Recycler">Recycler</option>
                  <option value="Logistics">Logistics Provider</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#32433A] uppercase tracking-wider mb-1">
                  Primary Operating City
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ahmedabad, Mumbai, Pune"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F6FAF7] border border-[#DAE3DD] rounded-xl text-xs sm:text-sm text-[#1A2520] focus:outline-none focus:ring-2 focus:ring-[#16382C]/20 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#32433A] uppercase tracking-wider mb-1">
                Corporate Work Email
              </label>
              <input
                type="email"
                required
                placeholder="procurement@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F6FAF7] border border-[#DAE3DD] rounded-xl text-xs sm:text-sm text-[#1A2520] focus:outline-none focus:ring-2 focus:ring-[#16382C]/20 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#32433A] uppercase tracking-wider mb-1">
                Business GST / Tax ID (Optional for Demo)
              </label>
              <input
                type="text"
                placeholder="24AAACC1206M1Z2"
                className="w-full px-3.5 py-2.5 bg-[#F6FAF7] border border-[#DAE3DD] rounded-xl text-xs sm:text-sm text-[#1A2520] focus:outline-none focus:ring-2 focus:ring-[#16382C]/20 focus:bg-white"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-3"
              icon={<ArrowRight className="w-3.5 h-3.5" />}
              iconPosition="right"
            >
              Continue to Circular Profile Onboarding (01 / 05)
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#EEF3F0] text-center text-xs text-[#5A6C62]">
            Already verified?{' '}
            <Link to="/login" className="font-bold text-[#16382C] hover:underline">
              Sign in to terminal →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

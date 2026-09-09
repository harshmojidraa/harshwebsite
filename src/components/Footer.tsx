import React from 'react';
import { ShieldCheck, RefreshCw, Truck, HeartHandshake, Activity } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { PageId } from '../types';

export const Footer: React.FC = () => {
  const { navigateTo, setIsGaInspectorOpen, isGaInspectorOpen } = useShop();

  const handleNav = (page: PageId) => {
    navigateTo(page);
  };

  return (
    <footer className="bg-white border-t border-gray-200 mt-20 relative overflow-hidden">
      {/* Google signature 4-color hairline accent bar */}
      <div className="h-1 w-full grid grid-cols-4">
        <div className="bg-[#4285F4]" />
        <div className="bg-[#EA4335]" />
        <div className="bg-[#FBBC05]" />
        <div className="bg-[#34A853]" />
      </div>

      {/* Main Footer Links & Information */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold font-sans tracking-tight">
                <span className="text-[#4285F4]">G</span>
                <span className="text-[#EA4335]">o</span>
                <span className="text-[#FBBC05]">o</span>
                <span className="text-[#4285F4]">g</span>
                <span className="text-[#34A853]">l</span>
                <span className="text-[#EA4335]">e</span>
              </span>
              <span className="text-gray-900 font-semibold text-lg">Merchandise Store 2.0</span>
            </div>
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
              An original e-commerce redesign inspired by Google's clean design philosophy,
              combining minimal aesthetics, data-driven merchandising, and GA4 telemetry architecture.
            </p>

            <div className="pt-2 text-xs text-gray-500 space-y-1">
              <p className="font-semibold text-gray-700">🎓 Academic Project Context:</p>
              <p>KES Shroff College of Arts & Commerce</p>
              <p>Department of Information Technology & Computer Applications</p>
            </div>

            {/* Live GA4 Telemetry Inspector Button for Project Viva */}
            <div className="pt-3">
              <button
                type="button"
                onClick={() => setIsGaInspectorOpen(!isGaInspectorOpen)}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#1A73E8] border border-blue-200/80 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                title="Inspect real-time GA4 event payloads for academic evaluation"
              >
                <Activity className="w-3.5 h-3.5 text-[#1A73E8] animate-pulse" />
                <span>Live GA4 Event Inspector</span>
              </button>
            </div>
          </div>

          {/* Column 1: Shop */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Shop Gear</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <button onClick={() => handleNav('new')} className="hover:text-[#1A73E8] transition-colors cursor-pointer">
                  New Arrivals
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('apparel')} className="hover:text-[#1A73E8] transition-colors cursor-pointer">
                  Apparel & Hoodies
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('lifestyle')} className="hover:text-[#1A73E8] transition-colors cursor-pointer">
                  Lifestyle & Desk
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('stationery')} className="hover:text-[#1A73E8] transition-colors cursor-pointer">
                  Stationery & Journals
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('collections')} className="hover:text-[#1A73E8] transition-colors cursor-pointer">
                  Curated Collections
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('sale')} className="text-red-600 font-medium hover:text-red-700 transition-colors cursor-pointer">
                  Special Offers & Sale
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Help & Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Help & Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <button onClick={() => handleNav('account')} className="hover:text-[#1A73E8] transition-colors cursor-pointer">
                  Track Order Status
                </button>
              </li>
              <li>
                <span className="hover:text-gray-900 transition-colors">Shipping & Deliveries</span>
              </li>
              <li>
                <span className="hover:text-gray-900 transition-colors">Returns & Exchanges (30 Days)</span>
              </li>
              <li>
                <span className="hover:text-gray-900 transition-colors">Size Guide & Fit Charts</span>
              </li>
              <li>
                <span className="hover:text-gray-900 transition-colors">Sustainability Guarantee</span>
              </li>
            </ul>
          </div>

          {/* Column 3: About & Tech */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Project & Tech</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <span className="hover:text-gray-900 transition-colors">KES Shroff College Viva</span>
              </li>
              <li>
                <span className="hover:text-gray-900 transition-colors">Google Analytics 4 Schema</span>
              </li>
              <li>
                <span className="hover:text-gray-900 transition-colors">Client-side Storage Engine</span>
              </li>
              <li>
                <span className="hover:text-gray-900 transition-colors">Tailwind CSS & React</span>
              </li>
              <li>
                <button onClick={() => handleNav('brand')} className="hover:text-[#1A73E8] transition-colors cursor-pointer">
                  Shop by Brand
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} Google Merchandise Store 2.0. Academic project for KES Shroff College. Not affiliated with Google LLC.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-gray-700 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-700 cursor-pointer">Terms of Service</span>
            <span className="hover:text-gray-700 cursor-pointer">Cookie Preferences</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Currency } from '../types';
import {
  User,
  Package,
  MapPin,
  Settings,
  CreditCard,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Sparkles,
  BarChart3,
  Award
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const { orders, currency, setCurrency, formatPrice, navigateTo, setIsGaInspectorOpen } = useShop();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'preferences' | 'project-info'>('orders');

  const currencies: Currency[] = ['USD', 'INR', 'EUR', 'GBP'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Profile Banner */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-rose-500 text-white flex items-center justify-center font-bold text-2xl font-sans shadow-md">
            AC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 font-sans">
                Alex Chen
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1A73E8] text-[11px] font-bold">
                Google Prototype Member
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              alex.chen@kesshroff.edu.in • KES Shroff College
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsGaInspectorOpen(true)}
          className="px-4 py-2 bg-gray-900 hover:bg-[#1A73E8] text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
        >
          <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Inspect GA4 Telemetry Logs</span>
        </button>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200 mb-8 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-gray-900 text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Order History ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'addresses'
              ? 'bg-gray-900 text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Addresses</span>
        </button>

        <button
          onClick={() => setActiveTab('preferences')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'preferences'
              ? 'bg-gray-900 text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Preferences & Currency</span>
        </button>

        <button
          onClick={() => setActiveTab('project-info')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'project-info'
              ? 'bg-[#1A73E8] text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-blue-50'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Academic Project Context</span>
        </button>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-bold text-gray-800 text-base">No orders placed yet</h3>
              <p className="text-xs text-gray-500 mt-1">
                Browse our curated collection and test our simulated checkout experience!
              </p>
              <button
                onClick={() => navigateTo('home')}
                className="mt-4 px-5 py-2.5 bg-[#1A73E8] text-white rounded-xl text-xs font-semibold"
              >
                Shop Now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#1A73E8]">
                          {order.orderNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                          {order.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(order.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-xs text-gray-500">Total</div>
                      <div className="text-base font-extrabold text-gray-900">
                        {formatPrice(order.total)}
                      </div>
                    </div>
                  </div>

                  {/* Order items */}
                  <div className="divide-y divide-gray-50">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="py-2 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded-lg bg-gray-50 border border-gray-100"
                          />
                          <div>
                            <div className="font-semibold text-gray-900">{item.name}</div>
                            <div className="text-gray-500">
                              Qty: {item.quantity} {item.selectedSize && `• ${item.selectedSize}`}
                            </div>
                          </div>
                        </div>
                        <div className="font-bold text-gray-800">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping address summary */}
                  <div className="pt-2 text-[11px] text-gray-500 border-t border-gray-100 flex items-center justify-between">
                    <span>
                      Delivery: {order.shippingAddress.address}, {order.shippingAddress.city} ({order.shippingAddress.postalCode})
                    </span>
                    <span className="text-[#1A73E8] font-medium">Delivering via Eco Express</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Saved Addresses */}
      {activeTab === 'addresses' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border-2 border-[#1A73E8] p-6 shadow-xs relative">
            <div className="absolute top-4 right-4 text-[10px] font-bold bg-blue-100 text-[#1A73E8] px-2 py-0.5 rounded-full">
              Default Shipping
            </div>
            <h3 className="font-bold text-gray-900 text-sm mb-1">KES Shroff College Campus</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Alex Chen <br />
              Bhulabhai Desai Road, Kandivali West <br />
              Mumbai, Maharashtra 400067 <br />
              India
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
            <div className="text-[10px] font-bold text-gray-400 mb-2">Secondary</div>
            <h3 className="font-bold text-gray-900 text-sm mb-1">Developer Home Lab</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Alex Chen <br />
              42 Silicon Avenue, Tech Park Suite 404 <br />
              Mumbai, Maharashtra 400053 <br />
              India
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Preferences & Currency */}
      {activeTab === 'preferences' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs max-w-xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-gray-900">Currency & Localization</h3>
            <p className="text-xs text-gray-500 mt-1">
              Select your preferred display currency for all store prices.
            </p>

            <div className="grid grid-cols-3 gap-2.5 mt-4">
              {currencies.map(c => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`p-3 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                    currency.code === c
                      ? 'border-[#1A73E8] bg-blue-50/70 text-[#1A73E8] shadow-xs'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-3">
            <h3 className="text-base font-bold text-gray-900">Email Notifications</h3>
            <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-[#1A73E8]" />
              <span>Receive updates about new Google merchandise drops</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-[#1A73E8]" />
              <span>Real-time dispatch and delivery status tracking</span>
            </label>
          </div>
        </div>
      )}

      {/* Tab 4: Academic Project Info */}
      {activeTab === 'project-info' && (
        <div className="bg-white rounded-3xl border border-blue-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Evaluation Guide
            </span>
            <h2 className="text-2xl font-extrabold text-gray-900 font-sans">
              Google Merchandise Store 2.0 • KES Shroff College
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-600 leading-relaxed">
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2">
              <h3 className="font-bold text-gray-900 text-sm">GA4 Enhanced Ecommerce Scope</h3>
              <p>
                This web application models the Google Analytics 4 Ecommerce measurement specification with telemetry for:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li><code>page_view</code>: Every tab & product navigation</li>
                <li><code>view_item_list</code>: Listing impressions & list names</li>
                <li><code>select_item</code>: Clicking products from shelves</li>
                <li><code>view_item</code>: Individual PDP views</li>
                <li><code>search</code>: Real-time queries</li>
                <li><code>add_to_cart</code> & <code>remove_from_cart</code>: Quantity changes</li>
                <li><code>view_cart</code> & <code>begin_checkout</code>: Funnel transitions</li>
                <li><code>purchase</code>: Complete checkout with mock transaction ID</li>
                <li><code>add_to_wishlist</code>: User intent tracking</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
              <h3 className="font-bold text-gray-900 text-sm">UX Architecture & Clean Google Design</h3>
              <p>
                Engineered adhering to Google&apos;s minimalist aesthetic:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Strict neutral canvases (off-white, slate accents)</li>
                <li>Subtle Google four-color accents (#4285F4, #EA4335, #FBBC05, #34A853)</li>
                <li>Fully responsive across mobile drawer, tablet, and desktop</li>
                <li>Data-driven merchandising shelves (Trending, Best Sellers, Lookbooks, Cart Cross-sells)</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

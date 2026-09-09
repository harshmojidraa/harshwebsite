import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  Lock,
  ShieldCheck,
  ChevronRight,
  CreditCard,
  Truck,
  CheckCircle2,
  ArrowLeft,
  Smartphone,
  AlertCircle
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    shippingCost,
    taxCost,
    cartTotal,
    formatPrice,
    shippingMethod,
    setShippingMethod,
    createOrder,
    navigateTo,
  } = useShop();

  // Multi-step state: 1: Information -> 2: Shipping -> 3: Payment
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [formData, setFormData] = useState({
    email: 'alex.chen@kesshroff.edu.in',
    firstName: 'Alex',
    lastName: 'Chen',
    address: '42 Silicon Avenue, Tech Park',
    apartment: 'Suite 404',
    city: 'Mumbai',
    country: 'India',
    state: 'Maharashtra',
    postalCode: '400067',
    phone: '+91 98765 43210',
    paymentMethod: 'google_pay' as 'google_pay' | 'card',
    cardNumber: '•••• •••• •••• 4242',
    cardExpiry: '12/28',
    cardCvc: '888',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const validateStep1 = () => {
    const errors: Record<string, string> = {};
    if (!formData.email || !formData.email.includes('@')) errors.email = 'Valid email is required.';
    if (!formData.firstName) errors.firstName = 'First name is required.';
    if (!formData.lastName) errors.lastName = 'Last name is required.';
    if (!formData.address) errors.address = 'Street address is required.';
    if (!formData.city) errors.city = 'City is required.';
    if (!formData.postalCode) errors.postalCode = 'Postal code is required.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = (targetStep: 2 | 3) => {
    if (currentStep === 1 && !validateStep1()) return;
    setCurrentStep(targetStep);
  };

  const handlePlaceOrder = () => {
    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const placed = createOrder({
        address: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          address: `${formData.address} ${formData.apartment ? `, ${formData.apartment}` : ''}`,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postalCode: formData.postalCode,
        },
        paymentMethod: formData.paymentMethod,
      });

      setIsProcessing(false);
      navigateTo('order-success', { orderId: placed.id });
    }, 900);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-gray-900">No items in bag to checkout</h2>
        <button
          onClick={() => navigateTo('home')}
          className="mt-4 px-6 py-2 bg-[#1A73E8] text-white rounded-xl font-semibold text-sm"
        >
          Return to Store
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-16">
      {/* Distraction-Free Header */}
      <div className="bg-white border-b border-gray-200 py-4 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigateTo('cart')}
            className="flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Bag</span>
          </button>

          {/* Logo */}
          <div className="flex items-center font-bold text-xl font-sans">
            <span className="text-[#4285F4]">G</span>
            <span className="text-[#EA4335]">o</span>
            <span className="text-[#FBBC05]">o</span>
            <span className="text-[#4285F4]">g</span>
            <span className="text-[#34A853]">l</span>
            <span className="text-[#EA4335]">e</span>
            <span className="ml-1 text-gray-800 text-sm font-semibold">Checkout</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline font-medium">SSL Prototype Encrypted</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Step Progress Indicator: Cart → Information → Shipping → Payment */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-between text-xs font-semibold">
            <button
              onClick={() => navigateTo('cart')}
              className="text-[#1A73E8] hover:underline cursor-pointer"
            >
              1. Cart
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <button
              onClick={() => setCurrentStep(1)}
              className={`${currentStep >= 1 ? 'text-[#1A73E8] font-bold' : 'text-gray-400'} cursor-pointer`}
            >
              2. Information
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <button
              onClick={() => handleNextStep(2)}
              className={`${currentStep >= 2 ? 'text-[#1A73E8] font-bold' : 'text-gray-400'} cursor-pointer`}
            >
              3. Shipping
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <button
              onClick={() => handleNextStep(3)}
              className={`${currentStep >= 3 ? 'text-[#1A73E8] font-bold' : 'text-gray-400'} cursor-pointer`}
            >
              4. Payment
            </button>
          </div>
        </div>

        {/* Main Grid: Form Left, Order Summary Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column (7 cols): Checkout Step Forms */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-8 shadow-xs space-y-8">
            
            {/* STEP 1: Contact and Shipping Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 font-sans">
                    Contact & Shipping Address
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    We will send order tracking details and invoice to this email.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
                      placeholder="you@example.com"
                    />
                    {formErrors.email && <p className="text-red-500 mt-1">{formErrors.email}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
                        placeholder="Alex"
                      />
                      {formErrors.firstName && <p className="text-red-500 mt-1">{formErrors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
                        placeholder="Chen"
                      />
                      {formErrors.lastName && <p className="text-red-500 mt-1">{formErrors.lastName}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
                      placeholder="123 Innovation Way"
                    />
                    {formErrors.address && <p className="text-red-500 mt-1">{formErrors.address}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Apartment, Suite (optional)
                      </label>
                      <input
                        type="text"
                        value={formData.apartment}
                        onChange={e => setFormData({ ...formData, apartment: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
                        placeholder="Apt 4B"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
                        placeholder="City"
                      />
                      {formErrors.city && <p className="text-red-500 mt-1">{formErrors.city}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Country *
                      </label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={e => setFormData({ ...formData, country: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        State / Province
                      </label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={e => setFormData({ ...formData, state: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        value={formData.postalCode}
                        onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
                        placeholder="10001"
                      />
                      {formErrors.postalCode && <p className="text-red-500 mt-1">{formErrors.postalCode}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Phone Number (for courier updates)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleNextStep(2)}
                    className="px-6 py-3 rounded-xl bg-[#1A73E8] hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-sm cursor-pointer"
                  >
                    Continue to Shipping
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Shipping Options */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 font-sans">
                    Select Shipping Method
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Delivering to: {formData.address}, {formData.city}
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Standard Shipping */}
                  <label
                    onClick={() => setShippingMethod('standard')}
                    className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      shippingMethod === 'standard'
                        ? 'border-[#1A73E8] bg-blue-50/60 shadow-xs'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === 'standard'}
                        onChange={() => setShippingMethod('standard')}
                        className="text-[#1A73E8]"
                      />
                      <div>
                        <div className="font-bold text-sm text-gray-900">Standard Eco Shipping</div>
                        <div className="text-xs text-gray-500">Estimated 3-5 business days</div>
                      </div>
                    </div>
                    <div className="font-bold text-sm text-gray-900">
                      {cartSubtotal >= 50 ? 'FREE' : formatPrice(5.0)}
                    </div>
                  </label>

                  {/* Express Shipping */}
                  <label
                    onClick={() => setShippingMethod('express')}
                    className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      shippingMethod === 'express'
                        ? 'border-[#1A73E8] bg-blue-50/60 shadow-xs'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === 'express'}
                        onChange={() => setShippingMethod('express')}
                        className="text-[#1A73E8]"
                      />
                      <div>
                        <div className="font-bold text-sm text-gray-900">Express Priority Air</div>
                        <div className="text-xs text-gray-500">Estimated 1-2 business days with tracking</div>
                      </div>
                    </div>
                    <div className="font-bold text-sm text-gray-900">
                      {formatPrice(15.0)}
                    </div>
                  </label>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-xs font-semibold text-gray-600 hover:underline cursor-pointer"
                  >
                    ← Back to Information
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNextStep(3)}
                    className="px-6 py-3 rounded-xl bg-[#1A73E8] hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-sm cursor-pointer"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Payment (Frontend Prototype) */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 font-sans">
                    Payment Prototype
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    This is an educational prototype. No real money or credentials required.
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Google Pay Option */}
                  <div
                    onClick={() => setFormData({ ...formData, paymentMethod: 'google_pay' })}
                    className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      formData.paymentMethod === 'google_pay'
                        ? 'border-[#1A73E8] bg-blue-50/60 shadow-xs'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={formData.paymentMethod === 'google_pay'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'google_pay' })}
                        className="text-[#1A73E8]"
                      />
                      <div>
                        <div className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                          <span className="text-[#4285F4]">G</span>
                          <span className="text-gray-800">Pay Instant 1-Click</span>
                        </div>
                        <div className="text-xs text-gray-500">Fast, secure simulated checkout</div>
                      </div>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 font-semibold px-2 py-0.5 rounded">
                      Recommended
                    </span>
                  </div>

                  {/* Credit Card Prototype */}
                  <div
                    onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                    className={`p-4 rounded-xl border space-y-3 cursor-pointer transition-all ${
                      formData.paymentMethod === 'card'
                        ? 'border-[#1A73E8] bg-blue-50/60 shadow-xs'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={formData.paymentMethod === 'card'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'card' })}
                        className="text-[#1A73E8]"
                      />
                      <div className="font-bold text-sm text-gray-900 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-600" />
                        <span>Credit / Debit Card (Simulation)</span>
                      </div>
                    </div>

                    {formData.paymentMethod === 'card' && (
                      <div className="pt-2 grid grid-cols-2 gap-3 text-xs">
                        <div className="col-span-2">
                          <label className="block text-gray-600 mb-1">Card Number</label>
                          <input
                            type="text"
                            value={formData.cardNumber}
                            disabled
                            className="w-full bg-white border border-gray-300 rounded-lg p-2 font-mono text-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-600 mb-1">Expiry Date</label>
                          <input
                            type="text"
                            value={formData.cardExpiry}
                            disabled
                            className="w-full bg-white border border-gray-300 rounded-lg p-2 font-mono text-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-600 mb-1">Security Code</label>
                          <input
                            type="text"
                            value={formData.cardCvc}
                            disabled
                            className="w-full bg-white border border-gray-300 rounded-lg p-2 font-mono text-gray-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-3.5 bg-gray-50 rounded-xl text-xs text-gray-500 flex items-start gap-2 border border-gray-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    Ready to place order. Clicking <strong>Place Order</strong> will record the mock purchase in your local account history and dispatch the GA4 <code>purchase</code> event.
                  </span>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-xs font-semibold text-gray-600 hover:underline cursor-pointer"
                  >
                    ← Back to Shipping
                  </button>
                  <button
                    id="checkout-place-order-btn"
                    type="button"
                    disabled={isProcessing}
                    onClick={handlePlaceOrder}
                    className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <span>Confirming Order...</span>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Place Order • {formatPrice(cartTotal)}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column (5 cols): Order Summary & Items Preview */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200/90 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider border-b border-gray-100 pb-3">
                Items in Order ({cart.length})
              </h3>

              {/* Items List */}
              <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 pr-1 space-y-3">
                {cart.map(item => (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover bg-gray-50 border border-gray-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0 text-xs">
                      <div className="font-semibold text-gray-900 truncate">
                        {item.product.name}
                      </div>
                      <div className="text-gray-500">
                        Qty: {item.quantity} {item.selectedSize && `• ${item.selectedSize}`}
                      </div>
                    </div>
                    <div className="text-xs font-bold text-gray-900">
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div className="pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">{formatPrice(cartSubtotal)}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount</span>
                    <span>-{formatPrice(cartDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping ({shippingMethod})</span>
                  <span className="font-semibold text-gray-900">
                    {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span className="font-semibold text-gray-900">{formatPrice(taxCost)}</span>
                </div>
                <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline text-base font-bold text-gray-900">
                  <span>Order Total</span>
                  <span className="text-xl font-extrabold text-[#1A73E8]">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

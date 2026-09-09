import React, { useState } from 'react';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  Globe,
  Flame,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CurrencyCode, PageId, ProductBrand } from '../types';
import { BRANDS } from '../data/products';

export const Header: React.FC = () => {
  const {
    navigation,
    navigateTo,
    cartCount,
    wishlist,
    currency,
    setCurrencyCode,
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);

  const navLinks: { label: string; page: PageId; badge?: string }[] = [
    { label: 'New', page: 'new', badge: 'Fresh' },
    { label: 'Apparel', page: 'apparel' },
    { label: 'Lifestyle', page: 'lifestyle' },
    { label: 'Stationery', page: 'stationery' },
    { label: 'Collections', page: 'collections' },
    { label: 'Shop by Brand', page: 'brand' },
    { label: 'Sale', page: 'sale', badge: 'Offers' },
  ];

  const handleNavClick = (page: PageId, brand?: ProductBrand) => {
    if (page === 'brand' && brand) {
      navigateTo('brand', { brand });
    } else {
      navigateTo(page);
    }
    setMobileMenuOpen(false);
    setBrandDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all">
      {/* Top Academic Banner (subtle, clean Google style) */}
      <div className="bg-[#F8F9FA] text-[#5F6368] text-xs py-1.5 px-4 border-b border-gray-200/60 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-medium text-gray-700">Google Merchandise Store 2.0</span>
            <span className="text-gray-300">|</span>
            <span>KES Shroff College Project Showcase</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Free campus & standard delivery over $50</span>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => handleNavClick('sale')}
              className="text-[#1A73E8] hover:underline font-medium flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-500" /> Use code GOOGLE10 or KESSC20
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Left: Mobile hamburger + Google Wordmark Logo */}
          <div className="flex items-center gap-3">
            <button
              id="mobile-menu-toggle-btn"
              type="button"
              aria-label="Toggle Navigation Menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Brand Wordmark */}
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            >
              <div className="flex flex-col">
                <div className="flex items-center tracking-tight text-2xl font-bold font-sans select-none">
                  <span className="text-[#4285F4]">G</span>
                  <span className="text-[#EA4335]">o</span>
                  <span className="text-[#FBBC05]">o</span>
                  <span className="text-[#4285F4]">g</span>
                  <span className="text-[#34A853]">l</span>
                  <span className="text-[#EA4335]">e</span>
                  <span className="ml-1.5 font-semibold text-gray-800 text-lg sm:text-xl">Merch</span>
                  <span className="ml-1 px-1.5 py-0.5 text-[10px] font-extrabold uppercase bg-blue-50 text-[#1A73E8] border border-blue-200/60 rounded-md">
                    2.0
                  </span>
                </div>
                <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium -mt-1 group-hover:text-gray-600 transition-colors">
                  official merch shop
                </span>
              </div>
            </button>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map(link => {
              const isActive = navigation.page === link.page;
              const isBrand = link.page === 'brand';

              if (isBrand) {
                return (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setBrandDropdownOpen(true)}
                    onMouseLeave={() => setBrandDropdownOpen(false)}
                  >
                    <button
                      onClick={() => handleNavClick('brand')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                        isActive
                          ? 'text-[#1A73E8] bg-blue-50/80 font-semibold'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/70'
                      }`}
                    >
                      {link.label}
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                    </button>

                    {/* Brand Dropdown Menu */}
                    {brandDropdownOpen && (
                      <div className="absolute top-full left-0 w-64 pt-1 z-50">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-2">
                          <div className="px-3 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                            Explore by Brand
                          </div>
                          {BRANDS.map(brand => (
                            <button
                              key={brand.name}
                              onClick={() => handleNavClick('brand', brand.name)}
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#1A73E8] flex items-center justify-between transition-colors cursor-pointer"
                            >
                              <span className="font-medium">{brand.name}</span>
                              <span className="text-[11px] text-gray-400">View gear</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.page)}
                  className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[#1A73E8] bg-blue-50/80 font-semibold'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/70'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {link.label}
                    {link.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                          link.page === 'sale'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {link.badge}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Right: Actions (Currency, Wishlist, Search, Account, Cart) */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Currency / Region Selector */}
            <div className="relative hidden lg:block">
              <button
                type="button"
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100 cursor-pointer"
                title="Change currency and region"
              >
                <Globe className="w-3.5 h-3.5 text-gray-500" />
                <span>{currency.code} ({currency.symbol})</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {currencyDropdownOpen && (
                <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50">
                  <div className="px-3 py-1 text-[11px] text-gray-400 font-semibold uppercase">
                    Select Currency
                  </div>
                  {(['USD', 'INR', 'EUR', 'GBP'] as CurrencyCode[]).map(cCode => (
                    <button
                      key={cCode}
                      onClick={() => {
                        setCurrencyCode(cCode);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between cursor-pointer ${
                        currency.code === cCode
                          ? 'bg-blue-50 text-[#1A73E8] font-bold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{cCode}</span>
                      <span className="text-gray-400">
                        {cCode === 'USD' ? '$' : cCode === 'INR' ? '₹' : cCode === 'EUR' ? '€' : '£'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Icon */}
            <button
              id="header-search-btn"
              type="button"
              aria-label="Search Merchandise"
              onClick={() => handleNavClick('search')}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                navigation.page === 'search'
                  ? 'bg-blue-50 text-[#1A73E8]'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title="Search store"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Icon */}
            <button
              id="header-wishlist-btn"
              type="button"
              aria-label="Saved Wishlist"
              onClick={() => handleNavClick('wishlist')}
              className={`relative p-2 rounded-full transition-colors cursor-pointer ${
                navigation.page === 'wishlist'
                  ? 'bg-rose-50 text-rose-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title="Saved items"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#EA4335] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Account Icon */}
            <button
              id="header-account-btn"
              type="button"
              aria-label="User Account"
              onClick={() => handleNavClick('account')}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                navigation.page === 'account'
                  ? 'bg-blue-50 text-[#1A73E8]'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title="Account & orders"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Cart Icon with count badge */}
            <button
              id="header-cart-btn"
              type="button"
              aria-label="Shopping Cart"
              onClick={() => handleNavClick('cart')}
              className={`relative flex items-center gap-1 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                cartCount > 0
                  ? 'bg-[#1A73E8] text-white shadow-sm hover:bg-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              title="View bag"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="font-semibold text-xs sm:text-sm">{cartCount}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            {/* Top of drawer */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center tracking-tight text-xl font-bold font-sans">
                <span className="text-[#4285F4]">G</span>
                <span className="text-[#EA4335]">o</span>
                <span className="text-[#FBBC05]">o</span>
                <span className="text-[#4285F4]">g</span>
                <span className="text-[#34A853]">l</span>
                <span className="text-[#EA4335]">e</span>
                <span className="ml-1 text-gray-800 text-sm">Merch 2.0</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search shortcut */}
            <div className="p-4 border-b border-gray-100">
              <button
                onClick={() => handleNavClick('search')}
                className="w-full flex items-center gap-3 px-3 py-2.5 bg-gray-100 text-gray-500 rounded-xl text-sm"
              >
                <Search className="w-4 h-4 text-gray-400" />
                <span>Search hoodies, mugs, bags...</span>
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 py-3 px-2 space-y-1">
              {navLinks.map(link => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.page)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between ${
                    navigation.page === link.page
                      ? 'bg-blue-50 text-[#1A73E8] font-bold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        link.page === 'sale'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </button>
              ))}

              <div className="pt-3 pb-1 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Brands
              </div>
              {BRANDS.map(brand => (
                <button
                  key={brand.name}
                  onClick={() => handleNavClick('brand', brand.name)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 flex items-center justify-between"
                >
                  <span>{brand.name}</span>
                  <span className="text-xs text-gray-400">→</span>
                </button>
              ))}

              <div className="pt-3 pb-1 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Account & Lists
              </div>
              <button
                onClick={() => handleNavClick('wishlist')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 flex items-center gap-2 hover:bg-gray-50"
              >
                <Heart className="w-4 h-4 text-gray-400" />
                <span>Wishlist ({wishlist.length})</span>
              </button>
              <button
                onClick={() => handleNavClick('account')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 flex items-center gap-2 hover:bg-gray-50"
              >
                <User className="w-4 h-4 text-gray-400" />
                <span>My Account & Orders</span>
              </button>
            </div>

            {/* Mobile Currency Picker */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <div className="text-xs text-gray-500 font-medium mb-2">Currency & Region</div>
              <div className="grid grid-cols-2 gap-2">
                {(['USD', 'INR', 'EUR', 'GBP'] as CurrencyCode[]).map(cCode => (
                  <button
                    key={cCode}
                    onClick={() => {
                      setCurrencyCode(cCode);
                    }}
                    className={`py-1.5 px-3 text-xs rounded-lg border text-center font-medium ${
                      currency.code === cCode
                        ? 'border-[#1A73E8] bg-blue-50 text-[#1A73E8]'
                        : 'border-gray-200 bg-white text-gray-700'
                    }`}
                  >
                    {cCode} ({cCode === 'USD' ? '$' : cCode === 'INR' ? '₹' : cCode === 'EUR' ? '€' : '£'})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

import React, { useEffect } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { GaInspector } from './components/GaInspector';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { SearchPage } from './pages/SearchPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { WishlistPage } from './pages/WishlistPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { AccountPage } from './pages/AccountPage';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const { navigation, toast } = useShop();

  // Scroll to top on navigation change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigation.page, navigation.productId, navigation.brand]);

  const renderPage = () => {
    switch (navigation.page) {
      case 'home':
        return <HomePage />;
      case 'new':
        return <CategoryPage pageType="new" />;
      case 'apparel':
        return <CategoryPage pageType="apparel" />;
      case 'lifestyle':
        return <CategoryPage pageType="lifestyle" />;
      case 'stationery':
        return <CategoryPage pageType="stationery" />;
      case 'collections':
        return <CategoryPage pageType="collections" />;
      case 'brand':
        return <CategoryPage pageType="brand" />;
      case 'sale':
        return <CategoryPage pageType="sale" />;
      case 'search':
        return <SearchPage />;
      case 'product':
        return <ProductDetailsPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'order-success':
        return <OrderSuccessPage />;
      case 'account':
        return <AccountPage />;
      default:
        return <HomePage />;
    }
  };

  // Hide global Header and Footer on distraction-free checkout page
  const isCheckout = navigation.page === 'checkout';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-gray-900 font-sans selection:bg-[#1A73E8]/20 selection:text-[#1A73E8]">
      {!isCheckout && <Header />}

      <main className="flex-1">
        {renderPage()}
      </main>

      {!isCheckout && <Footer />}

      {/* Global Realtime GA4 Telemetry Inspector Drawer */}
      <GaInspector />

      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-emerald-950/95 text-emerald-100 border-emerald-800'
                : toast.type === 'error'
                ? 'bg-rose-950/95 text-rose-100 border-rose-800'
                : 'bg-gray-950/95 text-white border-gray-800'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}

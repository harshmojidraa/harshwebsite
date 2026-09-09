import React from 'react';
import { useShop } from '../context/ShopContext';
import { CheckCircle2, Package, ArrowRight, Truck, Calendar, MapPin, Download, Home } from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { navigation, getOrderById, orders, formatPrice, navigateTo } = useShop();

  // Find order from orderId or latest order
  const order = navigation.orderId
    ? getOrderById(navigation.orderId)
    : orders[0];

  const estimatedDeliveryDate = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString(
    'en-US',
    { weekday: 'short', month: 'short', day: 'numeric' }
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="bg-white rounded-3xl border border-gray-200/90 p-8 sm:p-12 shadow-sm text-center space-y-6">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        {/* Headlines */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Payment Verified & Dispatched
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-sans tracking-tight">
            Order Confirmed!
          </h1>
          <p className="text-base text-gray-600 max-w-md mx-auto">
            Thanks for shopping Google Merchandise. Your gear is being prepared with sustainable packaging.
          </p>
        </div>

        {/* Order Identifier & Delivery Badge */}
        {order && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto pt-2 text-left">
            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200">
              <span className="text-[11px] text-gray-500 font-semibold block">Order Reference</span>
              <span className="font-mono text-sm font-bold text-[#1A73E8]">{order.orderNumber}</span>
            </div>
            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200">
              <span className="text-[11px] text-gray-500 font-semibold block">Estimated Delivery</span>
              <span className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gray-500" />
                {estimatedDeliveryDate}
              </span>
            </div>
          </div>
        )}

        {/* Order Items Breakdown */}
        {order && (
          <div className="text-left pt-6 border-t border-gray-100 space-y-4">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Purchased Merchandise ({order.items.length})
            </h3>
            <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl p-4 max-h-56 overflow-y-auto">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
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
                  <div className="font-bold text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Total Paid */}
            <div className="flex justify-between items-center text-sm font-bold text-gray-900 px-1 pt-2">
              <span>Total Paid</span>
              <span className="text-lg font-extrabold text-[#1A73E8]">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            id="order-success-continue-shopping-btn"
            type="button"
            onClick={() => navigateTo('home')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gray-900 hover:bg-[#1A73E8] text-white font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('account')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 font-semibold text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Package className="w-4 h-4 text-blue-600" />
            <span>View in Account Orders</span>
          </button>
        </div>
      </div>
    </div>
  );
};

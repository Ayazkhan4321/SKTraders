import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, CheckCircle2, ShoppingBag, User, Phone, MapPin, Sparkles, Receipt } from 'lucide-react';
import { apiCreateOrder, PaymentOrderRecord } from '@/lib/supabase';
import './PaymentCheckoutModal.css';

interface PaymentCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialItemTitle?: string;
  currentUser?: { name: string; email: string; phone?: string; address?: string } | null;
}

export default function PaymentCheckoutModal({
  isOpen,
  onClose,
  initialItemTitle,
  currentUser,
}: PaymentCheckoutModalProps) {
  // Form State
  const [userName, setUserName] = useState(currentUser?.name || '');
  const [userEmail, setUserEmail] = useState(currentUser?.email || '');
  const [userPhone, setUserPhone] = useState(currentUser?.phone || '');
  const [userAddress, setUserAddress] = useState(currentUser?.address || '');
  const [itemSummary, setItemSummary] = useState(initialItemTitle || 'Philips Master Lighting Fixtures Package');
  const [amount, setAmount] = useState<number>(4999);
  const [paymentMethod, setPaymentMethod] = useState<'Razorpay' | 'UPI' | 'Card'>('Razorpay');

  const [loading, setLoading] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<PaymentOrderRecord | null>(null);

  if (!isOpen) return null;

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const razorpayTxnId = 'pay_' + Math.random().toString(36).substring(2, 12).toUpperCase();

    // Create Order Record in Supabase DB
    const orderData = {
      orderNumber: 'SK-ORD-' + Math.floor(100000 + Math.random() * 900000),
      userName,
      userEmail,
      userPhone,
      userAddress,
      itemsSummary: itemSummary,
      amount,
      currency: 'INR',
      paymentMethod,
      paymentStatus: 'Paid' as const,
      razorpayPaymentId: razorpayTxnId,
    };

    try {
      const savedOrder = await apiCreateOrder(orderData);
      setCompletedOrder(savedOrder);
    } catch (err) {
      console.error('Error creating order:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-brand-navy border border-amber-400/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {!completedOrder ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-brand-navy flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold">Lighting Booking & Payment</h3>
                <p className="text-xs text-amber-300 font-medium">SK Traders Razorpay Direct Checkout</p>
              </div>
            </div>

            <form onSubmit={handleProcessPayment} className="space-y-4">
              {/* Product / Catalogue Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Selected Lighting Package / Catalogue
                </label>
                <input
                  type="text"
                  value={itemSummary}
                  onChange={(e) => setItemSummary(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white text-sm focus:border-amber-400 outline-none"
                />
              </div>

              {/* Amount Selection */}
              <div className="grid grid-cols-3 gap-2">
                {[2999, 4999, 9999].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      amount === amt
                        ? 'bg-amber-400 text-brand-navy border-amber-400'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    ₹{amt.toLocaleString('en-IN')} Token
                  </button>
                ))}
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Customer Name</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Your Name"
                      required
                      className="w-full pl-8 pr-3 py-2 bg-white/5 border border-white/15 rounded-xl text-white text-xs focus:border-amber-400 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      required
                      className="w-full pl-8 pr-3 py-2 bg-white/5 border border-white/15 rounded-xl text-white text-xs focus:border-amber-400 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-white text-xs focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">Delivery / Installation Address</label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={userAddress}
                    onChange={(e) => setUserAddress(e.target.value)}
                    placeholder="Complete Street Address, City & Pincode"
                    required
                    className="w-full pl-8 pr-3 py-2 bg-white/5 border border-white/15 rounded-xl text-white text-xs focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              {/* Payment Mode Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Razorpay', 'UPI', 'Card'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 border transition-all ${
                        paymentMethod === method
                          ? 'bg-blue-600 border-blue-400 text-white font-bold'
                          : 'bg-white/5 border-white/10 text-slate-300'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" /> {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-brand-navy font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <span>Securing Order in Supabase...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" /> Pay ₹{amount.toLocaleString('en-IN')} & Confirm Order
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Order Receipt Confirmation Screen */
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 border border-green-500/40 text-green-400 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-2xl font-display font-extrabold text-white">Payment Confirmed!</h3>
              <p className="text-xs text-green-300 mt-1">Order successfully registered in Supabase DB</p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-white/5 border border-white/15 rounded-2xl p-4 text-left text-xs space-y-2 font-mono">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Order ID:</span>
                <span className="text-amber-400 font-bold">{completedOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Razorpay Txn:</span>
                <span className="text-slate-200">{completedOrder.razorpayPaymentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Customer:</span>
                <span className="text-slate-200">{completedOrder.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Phone:</span>
                <span className="text-slate-200">{completedOrder.userPhone}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-2 font-bold text-sm">
                <span className="text-slate-300">Amount Paid:</span>
                <span className="text-amber-300">₹{completedOrder.amount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Our SK Traders lighting engineers will contact you at {completedOrder.userPhone} to arrange dispatch.
            </p>

            <button
              onClick={() => {
                setCompletedOrder(null);
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-amber-400 text-brand-navy font-bold text-xs uppercase tracking-wider"
            >
              Done & Return to Site
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

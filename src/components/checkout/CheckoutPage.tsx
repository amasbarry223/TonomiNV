'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, CheckCircle, MapPin,
  CreditCard, ShoppingBag, Smartphone, Banknote,
  MessageCircle, Package, Copy, Check, Truck, Tag, Shield,
} from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { useCustomerStore, PAYMENT_INFO, COUNTRIES, MALI_CITIES, getShippingCost, type PaymentMethod, type DeliveryAddress } from '@/stores/customer-store';
import { useNavStore } from '@/stores/nav-store';
import { formatPrice } from '@/lib/product-display';
import { toast } from 'sonner';

type Step = 'address' | 'payment' | 'confirmation';

const STEPS: { id: Step; label: string; icon: typeof MapPin }[] = [
  { id: 'address', label: 'Livraison', icon: MapPin },
  { id: 'payment', label: 'Paiement', icon: CreditCard },
  { id: 'confirmation', label: 'Confirmation', icon: CheckCircle },
];

interface AddressForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  instructions: string;
}

const EMPTY_ADDRESS: AddressForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: 'Bamako',
  country: 'Mali',
  instructions: '',
};

function StepIndicator({ currentStep }: { currentStep: Step }) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((step, i) => {
        const done = i < currentIndex;
        const active = step.id === currentStep;
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  done
                    ? 'bg-[#D4AF6A] border-[#D4AF6A] text-white'
                    : active
                    ? 'border-[#D4AF6A] text-[#D4AF6A] bg-white'
                    : 'border-stone-200 text-stone-300 bg-white'
                }`}
              >
                {done ? <CheckCircle size={18} /> : <step.icon size={18} />}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${
                  active ? 'text-[#D4AF6A]' : done ? 'text-stone-600' : 'text-stone-400'
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-16 sm:w-24 h-0.5 mx-2 mb-4 transition-colors ${
                  done ? 'bg-[#D4AF6A]' : 'bg-stone-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrderSummary({ shipping }: { shipping: number }) {
  const { items, getSubtotal, coupon, couponDiscount } = useCartStore();
  const subtotal = getSubtotal();
  const total = subtotal - couponDiscount + shipping;
  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="sticky top-24 rounded-2xl overflow-hidden border border-[#D4AF6A]/20 bg-white shadow-lg shadow-[#D4AF6A]/8">

      {/* Header */}
      <div className="bg-gradient-to-r from-[#D4AF6A]/12 via-[#D4AF6A]/6 to-transparent px-5 pt-5 pb-4 border-b border-[#D4AF6A]/12">
        <div className="flex items-center justify-between">
          <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#1a1a1a]">
            Récapitulatif
          </h3>
          <span className="font-[family-name:var(--font-dm-sans)] text-xs font-semibold bg-[#D4AF6A]/15 text-[#D4AF6A] px-2.5 py-1 rounded-full">
            {itemCount} article{itemCount > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Items — no scroll */}
      <div className="px-5 py-4 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            {/* Quantity + icon */}
            <div className="relative shrink-0">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#D4AF6A]/10 to-[#C8956C]/10 border border-[#D4AF6A]/20 flex items-center justify-center">
                <ShoppingBag size={15} className="text-[#D4AF6A]" />
              </div>
              {item.quantity > 1 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#D4AF6A] text-white text-[9px] font-bold flex items-center justify-center font-[family-name:var(--font-dm-sans)]">
                  {item.quantity}
                </span>
              )}
            </div>

            {/* Name + variant */}
            <div className="flex-1 min-w-0">
              <p className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold text-[#1a1a1a] leading-tight line-clamp-2">
                {item.name}
              </p>
              {(item.color || item.size) && (
                <p className="font-[family-name:var(--font-dm-sans)] text-[11px] text-stone-400 mt-0.5">
                  {[item.color, item.size].filter(Boolean).join(' · ')}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="shrink-0 text-right">
              <p className="font-[family-name:var(--font-dm-sans)] text-sm font-bold text-[#1a1a1a]">
                {formatPrice(item.price * item.quantity)}
              </p>
              {item.quantity > 1 && (
                <p className="font-[family-name:var(--font-dm-sans)] text-[10px] text-stone-400">
                  {formatPrice(item.price)} / u.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="px-5 pb-5 space-y-0">
        <div className="border-t border-dashed border-stone-100 pt-3 space-y-2.5">

          <div className="flex items-center justify-between">
            <span className="font-[family-name:var(--font-dm-sans)] text-sm text-stone-500 flex items-center gap-1.5">
              <ShoppingBag size={13} className="text-stone-400" />
              Sous-total
            </span>
            <span className="font-[family-name:var(--font-dm-sans)] text-sm text-[#1a1a1a] font-medium">
              {formatPrice(subtotal)}
            </span>
          </div>

          {couponDiscount > 0 && (
            <div className="flex items-center justify-between">
              <span className="font-[family-name:var(--font-dm-sans)] text-sm text-emerald-600 flex items-center gap-1.5">
                <Tag size={13} />
                Code {coupon && <span className="font-mono font-bold">{coupon}</span>}
              </span>
              <span className="font-[family-name:var(--font-dm-sans)] text-sm text-emerald-600 font-semibold">
                −{formatPrice(couponDiscount)}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="font-[family-name:var(--font-dm-sans)] text-sm text-stone-500 flex items-center gap-1.5">
              <Truck size={13} className="text-stone-400" />
              Livraison
            </span>
            <span className={`font-[family-name:var(--font-dm-sans)] text-sm font-medium ${shipping === 0 ? 'text-emerald-600' : 'text-[#1a1a1a]'}`}>
              {shipping === 0 ? '🎉 Gratuite' : formatPrice(shipping)}
            </span>
          </div>
        </div>

        {/* Total row */}
        <div className="mt-3 bg-gradient-to-r from-[#D4AF6A]/10 to-[#C8956C]/5 rounded-xl px-4 py-3.5 flex items-center justify-between border border-[#D4AF6A]/20">
          <span className="font-[family-name:var(--font-playfair)] text-base font-bold text-[#1a1a1a]">
            Total TTC
          </span>
          <span className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#D4AF6A]">
            {formatPrice(total)}
          </span>
        </div>

        {/* Trust badge */}
        <div className="mt-3 flex items-center justify-center gap-1.5 text-stone-400">
          <Shield size={12} />
          <span className="font-[family-name:var(--font-dm-sans)] text-[10px]">
            Paiement 100% sécurisé
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const { items, getSubtotal, coupon, couponDiscount, clearCart } = useCartStore();
  const { placeOrder, current, savedAddresses } = useCustomerStore();
  const { goHome, goCatalog, goAccount } = useNavStore();

  const [step, setStep] = useState<Step>('address');
  const [form, setForm] = useState<AddressForm>({
    ...EMPTY_ADDRESS,
    firstName: current?.firstName ?? '',
    lastName: current?.lastName ?? '',
    email: current?.email ?? '',
    phone: current?.phone ?? '',
  });
  const [payment, setPayment] = useState<PaymentMethod>('orange_money');
  const [copied, setCopied] = useState<string | null>(null);
  const paymentRef = useMemo(() => `TN${Date.now().toString().slice(-6)}`, []);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  };
  const [placedOrder, setPlacedOrder] = useState<{ number: string; total: number } | null>(null);
  const [saveAddress, setSaveAddress] = useState(false);

  const subtotal = getSubtotal();
  const shipping = useMemo(
    () => getShippingCost(form.city, form.country, subtotal - couponDiscount),
    [form.city, form.country, subtotal, couponDiscount]
  );
  const total = subtotal - couponDiscount + shipping;

  const setField = (key: keyof AddressForm, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const validateAddress = () => {
    if (!form.firstName.trim() || !form.lastName.trim()) return 'Prénom et nom requis';
    if (!form.email.trim() || !form.email.includes('@')) return 'Email invalide';
    if (!form.phone.trim()) return 'Numéro de téléphone requis';
    if (!form.address.trim()) return 'Adresse requise';
    return null;
  };

  const handleNextStep = () => {
    if (step === 'address') {
      const error = validateAddress();
      if (error) { toast.error(error); return; }
      setStep('payment');
    } else if (step === 'payment') {
      handlePlaceOrder();
    }
  };

  const handlePlaceOrder = () => {
    if (items.length === 0) { toast.error('Votre panier est vide.'); return; }

    const deliveryAddress: DeliveryAddress = {
      id: `addr-${Date.now()}`,
      label: 'Livraison',
      isDefault: false,
      ...form,
    };

    const order = placeOrder({
      items,
      subtotal,
      discount: couponDiscount,
      shipping,
      total,
      payment,
      address: deliveryAddress,
      promoCode: coupon ?? undefined,
    });

    if (saveAddress && current) {
      useCustomerStore.getState().saveAddress({ ...deliveryAddress, isDefault: false });
    }

    clearCart();
    setPlacedOrder({ number: order.number, total });
    setStep('confirmation');
  };

  if (items.length === 0 && step !== 'confirmation') {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center pt-24 pb-16 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center mb-5">
          <ShoppingBag size={32} className="text-stone-300" />
        </div>
        <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#1a1a1a] mb-2">
          Votre panier est vide
        </h2>
        <p className="text-stone-500 text-sm mb-6 font-[family-name:var(--font-dm-sans)]">
          Ajoutez des articles avant de passer commande.
        </p>
        <button
          onClick={() => goCatalog()}
          className="btn-gold px-8 py-3 text-sm font-medium tracking-wide"
        >
          Explorer la boutique
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        {step !== 'confirmation' && (
          <div className="mb-6 flex items-center gap-3">
            <button
              onClick={() => (step === 'address' ? goCatalog() : setStep('address'))}
              className="flex items-center gap-1 text-stone-500 hover:text-[#1a1a1a] text-sm font-[family-name:var(--font-dm-sans)] transition-colors"
            >
              <ChevronLeft size={16} />
              {step === 'address' ? 'Retour au panier' : 'Retour à la livraison'}
            </button>
          </div>
        )}

        <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[#1a1a1a] mb-6">
          {step === 'confirmation' ? 'Commande confirmée' : 'Finaliser ma commande'}
        </h1>

        <StepIndicator currentStep={step} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === 'address' && (
                <motion.div
                  key="address"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="bg-white rounded-2xl border border-[#D4AF6A]/20 p-6 space-y-5">
                    <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#1a1a1a] flex items-center gap-2">
                      <MapPin size={20} className="text-[#D4AF6A]" />
                      Adresse de livraison
                    </h2>

                    {/* Saved addresses */}
                    {savedAddresses.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-stone-500 mb-2 font-[family-name:var(--font-dm-sans)]">
                          Adresses sauvegardées
                        </p>
                        <div className="space-y-2">
                          {savedAddresses.map((addr) => (
                            <button
                              key={addr.id}
                              onClick={() =>
                                setForm({
                                  firstName: addr.firstName,
                                  lastName: addr.lastName,
                                  email: addr.email,
                                  phone: addr.phone,
                                  address: addr.address,
                                  city: addr.city,
                                  country: addr.country,
                                  instructions: addr.instructions ?? '',
                                })
                              }
                              className="w-full text-left px-4 py-3 rounded-xl border border-[#D4AF6A]/30 hover:border-[#D4AF6A] hover:bg-[#D4AF6A]/5 transition-all text-sm font-[family-name:var(--font-dm-sans)]"
                            >
                              <span className="font-medium text-[#1a1a1a]">{addr.label} — </span>
                              <span className="text-stone-600">
                                {addr.firstName} {addr.lastName}, {addr.city}
                              </span>
                            </button>
                          ))}
                        </div>
                        <p className="text-xs text-stone-400 mt-2 font-[family-name:var(--font-dm-sans)]">
                          Ou remplissez un nouveau formulaire ci-dessous
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Prénom *" value={form.firstName} onChange={(v) => setField('firstName', v)} placeholder="Aminata" />
                      <Field label="Nom *" value={form.lastName} onChange={(v) => setField('lastName', v)} placeholder="Diallo" />
                      <Field label="Email *" type="email" value={form.email} onChange={(v) => setField('email', v)} placeholder="votre@email.com" />
                      <Field label="Téléphone *" type="tel" value={form.phone} onChange={(v) => setField('phone', v)} placeholder="+223 76 XX XX XX" />
                    </div>

                    <Field label="Adresse (rue, quartier) *" value={form.address} onChange={(v) => setField('address', v)} placeholder="ACI 2000, Rue Moussa Travélé" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5 font-[family-name:var(--font-dm-sans)]">
                          Ville *
                        </label>
                        {form.country === 'Mali' ? (
                          <select
                            value={form.city}
                            onChange={(e) => setField('city', e.target.value)}
                            className="w-full bg-stone-50 border border-[#D4AF6A]/20 text-[#1a1a1a] rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF6A]/30 focus:border-[#D4AF6A] font-[family-name:var(--font-dm-sans)]"
                          >
                            {MALI_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                        ) : (
                          <input
                            value={form.city}
                            onChange={(e) => setField('city', e.target.value)}
                            placeholder="Votre ville"
                            className="w-full bg-stone-50 border border-[#D4AF6A]/20 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF6A]/30 focus:border-[#D4AF6A] font-[family-name:var(--font-dm-sans)]"
                          />
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5 font-[family-name:var(--font-dm-sans)]">
                          Pays *
                        </label>
                        <select
                          value={form.country}
                          onChange={(e) => { setField('country', e.target.value); setField('city', ''); }}
                          className="w-full bg-stone-50 border border-[#D4AF6A]/20 text-[#1a1a1a] rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF6A]/30 focus:border-[#D4AF6A] font-[family-name:var(--font-dm-sans)]"
                        >
                          {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5 font-[family-name:var(--font-dm-sans)]">
                        Instructions de livraison (optionnel)
                      </label>
                      <textarea
                        value={form.instructions}
                        onChange={(e) => setField('instructions', e.target.value)}
                        rows={2}
                        placeholder="Appeler avant livraison, badge de résidence, horaire préféré..."
                        className="w-full bg-stone-50 border border-[#D4AF6A]/20 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF6A]/30 focus:border-[#D4AF6A] resize-none font-[family-name:var(--font-dm-sans)]"
                      />
                    </div>

                    {current && (
                      <label className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer font-[family-name:var(--font-dm-sans)]">
                        <input
                          type="checkbox"
                          checked={saveAddress}
                          onChange={(e) => setSaveAddress(e.target.checked)}
                          className="w-4 h-4 accent-[#D4AF6A]"
                        />
                        Sauvegarder cette adresse pour mes prochaines commandes
                      </label>
                    )}

                    {/* Shipping info */}
                    <div className="bg-[#D4AF6A]/8 rounded-xl px-4 py-3 border border-[#D4AF6A]/15">
                      <p className="text-sm font-[family-name:var(--font-dm-sans)] text-stone-600">
                        <span className="font-semibold text-[#1a1a1a]">Frais de livraison : </span>
                        {shipping === 0 ? (
                          <span className="text-emerald-600 font-semibold">Gratuite (commande ≥ 30 000 FCFA)</span>
                        ) : (
                          <span className="text-[#D4AF6A] font-semibold">{formatPrice(shipping)}</span>
                        )}
                        {form.country === 'Mali' && form.city !== 'Bamako' && (
                          <span className="text-stone-400"> — Livraison hors Bamako</span>
                        )}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 'payment' && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="bg-white rounded-2xl border border-[#D4AF6A]/20 p-6 space-y-5">
                    <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#1a1a1a] flex items-center gap-2">
                      <CreditCard size={20} className="text-[#D4AF6A]" />
                      Mode de paiement
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(Object.entries(PAYMENT_INFO) as [PaymentMethod, typeof PAYMENT_INFO[PaymentMethod]][]).map(([key, info]) => (
                        <button
                          key={key}
                          onClick={() => setPayment(key)}
                          className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                            payment === key
                              ? `${info.bg} border-current ${info.color}`
                              : 'border-stone-200 hover:border-[#D4AF6A]/40 bg-white'
                          }`}
                        >
                          <div className={`mt-0.5 p-2 rounded-lg ${payment === key ? 'bg-white/60' : 'bg-stone-100'}`}>
                            {key === 'especes' ? (
                              <Banknote size={18} className={payment === key ? info.color : 'text-stone-500'} />
                            ) : (
                              <Smartphone size={18} className={payment === key ? info.color : 'text-stone-500'} />
                            )}
                          </div>
                          <div>
                            <p className={`font-semibold text-sm font-[family-name:var(--font-dm-sans)] ${payment === key ? info.color : 'text-[#1a1a1a]'}`}>
                              {info.label}
                            </p>
                            <p className="text-xs text-stone-400 mt-0.5 font-[family-name:var(--font-dm-sans)]">
                              {info.description}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Payment instructions — rich UI */}
                    <AnimatePresence mode="wait">
                      {payment !== 'especes' ? (
                        <motion.div
                          key={payment}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.22 }}
                          className={`rounded-2xl border-2 overflow-hidden ${PAYMENT_INFO[payment].bg}`}
                        >
                          {/* Header band */}
                          <div className={`px-5 py-3 flex items-center gap-2 border-b border-current/10`}>
                            <Smartphone size={16} className={PAYMENT_INFO[payment].color} />
                            <p className={`font-bold text-sm font-[family-name:var(--font-dm-sans)] ${PAYMENT_INFO[payment].color}`}>
                              Payer via {PAYMENT_INFO[payment].label}
                            </p>
                          </div>

                          <div className="p-5 space-y-3">
                            {/* Amount row */}
                            <div className="flex items-center justify-between bg-white/70 rounded-xl px-4 py-3">
                              <div>
                                <p className="text-[10px] text-stone-400 uppercase tracking-wide font-[family-name:var(--font-dm-sans)]">Montant exact</p>
                                <p className={`text-xl font-bold font-[family-name:var(--font-playfair)] ${PAYMENT_INFO[payment].color}`}>
                                  {formatPrice(total)}
                                </p>
                              </div>
                              <button
                                onClick={() => copyToClipboard(String(total), 'amount')}
                                className="flex items-center gap-1.5 text-xs font-medium bg-white/80 hover:bg-white border border-current/20 px-3 py-1.5 rounded-lg transition-all font-[family-name:var(--font-dm-sans)]"
                              >
                                {copied === 'amount' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                                {copied === 'amount' ? 'Copié !' : 'Copier'}
                              </button>
                            </div>

                            {/* Number row */}
                            <div className="flex items-center justify-between bg-white/70 rounded-xl px-4 py-3">
                              <div>
                                <p className="text-[10px] text-stone-400 uppercase tracking-wide font-[family-name:var(--font-dm-sans)]">Numéro marchand</p>
                                <p className="text-base font-bold font-mono text-[#1a1a1a]">
                                  {PAYMENT_INFO[payment].number}
                                </p>
                              </div>
                              <button
                                onClick={() => copyToClipboard(PAYMENT_INFO[payment].number ?? '', 'number')}
                                className="flex items-center gap-1.5 text-xs font-medium bg-white/80 hover:bg-white border border-current/20 px-3 py-1.5 rounded-lg transition-all font-[family-name:var(--font-dm-sans)]"
                              >
                                {copied === 'number' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                                {copied === 'number' ? 'Copié !' : 'Copier'}
                              </button>
                            </div>

                            {/* Reference */}
                            <div className="bg-white/70 rounded-xl px-4 py-3 flex items-center justify-between">
                              <div>
                                <p className="text-[10px] text-stone-400 uppercase tracking-wide font-[family-name:var(--font-dm-sans)]">Référence paiement</p>
                                <p className="font-mono font-bold text-[#1a1a1a] text-sm tracking-widest">{paymentRef}</p>
                              </div>
                              <button
                                onClick={() => copyToClipboard(paymentRef, 'ref')}
                                className="flex items-center gap-1.5 text-xs font-medium bg-white/80 hover:bg-white border border-current/20 px-3 py-1.5 rounded-lg transition-all font-[family-name:var(--font-dm-sans)]"
                              >
                                {copied === 'ref' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                                {copied === 'ref' ? 'Copié !' : 'Copier'}
                              </button>
                            </div>

                            {/* Steps */}
                            <div className="bg-white/50 rounded-xl px-4 py-3 space-y-2">
                              <p className="text-[10px] text-stone-400 uppercase tracking-wide font-[family-name:var(--font-dm-sans)] font-semibold">Étapes</p>
                              {[
                                `Ouvrez l'app ${PAYMENT_INFO[payment].label} sur votre téléphone`,
                                `Envoyez ${formatPrice(total)} au ${PAYMENT_INFO[payment].number}`,
                                `Indiquez la référence ${paymentRef} dans le motif`,
                                'Envoyez la capture de confirmation sur WhatsApp',
                              ].map((step, i) => (
                                <div key={i} className="flex gap-2.5 items-start">
                                  <span className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white mt-0.5 ${PAYMENT_INFO[payment].color.replace('text-', 'bg-')}`}>
                                    {i + 1}
                                  </span>
                                  <p className="text-xs text-stone-600 font-[family-name:var(--font-dm-sans)] leading-relaxed">{step}</p>
                                </div>
                              ))}
                            </div>

                            {/* WhatsApp CTA */}
                            <a
                              href={`https://wa.me/22375666853?text=Bonjour TONOMI 👋 Je vous envoie ma confirmation de paiement ${PAYMENT_INFO[payment].label}. Référence : ${paymentRef}. Montant : ${total.toLocaleString('fr-FR')} FCFA`}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20bc5b] text-white font-semibold text-sm py-3 rounded-xl transition-colors font-[family-name:var(--font-dm-sans)]"
                            >
                              <MessageCircle size={16} />
                              Envoyer ma capture sur WhatsApp
                            </a>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="especes"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 overflow-hidden"
                        >
                          <div className="px-5 py-3 border-b border-emerald-100 flex items-center gap-2">
                            <Banknote size={16} className="text-emerald-600" />
                            <p className="font-bold text-sm text-emerald-700 font-[family-name:var(--font-dm-sans)]">
                              Paiement à la livraison
                            </p>
                          </div>
                          <div className="p-5 space-y-3">
                            <div className="bg-white/70 rounded-xl px-4 py-3">
                              <p className="text-[10px] text-stone-400 uppercase tracking-wide font-[family-name:var(--font-dm-sans)]">Préparez</p>
                              <p className="text-xl font-bold text-emerald-700 font-[family-name:var(--font-playfair)]">{formatPrice(total)}</p>
                            </div>
                            <div className="space-y-2 bg-white/50 rounded-xl px-4 py-3">
                              {['Notre livreur vous contactera sur votre numéro de téléphone', 'Préparez la somme exacte en billets', 'Délai de livraison : 2-5 jours ouvrés à Bamako'].map((s, i) => (
                                <div key={i} className="flex gap-2.5 items-start">
                                  <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-400 flex items-center justify-center text-[10px] font-bold text-white mt-0.5">{i + 1}</span>
                                  <p className="text-xs text-stone-600 font-[family-name:var(--font-dm-sans)] leading-relaxed">{s}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Delivery summary */}
                    <div className="bg-stone-50 rounded-xl p-4 border border-stone-100">
                      <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2 font-[family-name:var(--font-dm-sans)]">
                        Livraison à
                      </p>
                      <p className="text-sm font-medium text-[#1a1a1a] font-[family-name:var(--font-dm-sans)]">
                        {form.firstName} {form.lastName}
                      </p>
                      <p className="text-sm text-stone-500 font-[family-name:var(--font-dm-sans)]">
                        {form.address}, {form.city}, {form.country}
                      </p>
                      <p className="text-sm text-stone-500 font-[family-name:var(--font-dm-sans)]">{form.phone}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 'confirmation' && placedOrder && (
                <motion.div
                  key="confirmation"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-white rounded-2xl border border-[#D4AF6A]/20 p-8 text-center">
                    <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 flex items-center justify-center mb-5">
                      <CheckCircle size={40} className="text-emerald-500" />
                    </div>
                    <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#1a1a1a] mb-2">
                      Commande enregistrée !
                    </h2>
                    <p className="text-stone-500 text-sm font-[family-name:var(--font-dm-sans)] mb-4">
                      Merci pour votre confiance, {form.firstName} !
                    </p>

                    <div className="bg-stone-50 rounded-xl px-6 py-4 inline-block mb-5">
                      <p className="text-xs text-stone-400 font-[family-name:var(--font-dm-sans)] mb-1">
                        Numéro de commande
                      </p>
                      <p className="font-mono font-bold text-xl text-[#1a1a1a]">
                        {placedOrder.number}
                      </p>
                    </div>

                    <div className="text-sm text-stone-600 font-[family-name:var(--font-dm-sans)] space-y-2 mb-6 max-w-sm mx-auto">
                      {payment !== 'especes' ? (
                        <p>
                          Envoyez <strong className="text-[#1a1a1a]">{formatPrice(placedOrder.total)}</strong> via{' '}
                          {PAYMENT_INFO[payment].label} au{' '}
                          <strong className="text-[#1a1a1a]">{PAYMENT_INFO[payment].number}</strong>, puis envoyez
                          la capture sur WhatsApp.
                        </p>
                      ) : (
                        <p>
                          Notre livreur vous contactera sur <strong>{form.phone}</strong> pour organiser la livraison.
                          Préparez <strong>{formatPrice(placedOrder.total)}</strong> en espèces.
                        </p>
                      )}
                      <p className="text-stone-400 text-xs">
                        Un email de confirmation sera envoyé à {form.email}.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <a
                        href={`https://wa.me/22375666853?text=Bonjour, j'ai passé la commande ${placedOrder.number} d'un montant de ${formatPrice(placedOrder.total)} via ${PAYMENT_INFO[payment].label}.`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors font-[family-name:var(--font-dm-sans)]"
                      >
                        <MessageCircle size={16} />
                        Confirmer sur WhatsApp
                      </a>
                      {current && (
                        <button
                          onClick={goAccount}
                          className="flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-[#1a1a1a] font-semibold text-sm px-6 py-3 rounded-xl transition-colors font-[family-name:var(--font-dm-sans)]"
                        >
                          <Package size={16} />
                          Mes commandes
                        </button>
                      )}
                      <button
                        onClick={goHome}
                        className="flex items-center justify-center gap-2 border border-[#D4AF6A]/40 hover:bg-[#D4AF6A]/5 text-[#1a1a1a] font-semibold text-sm px-6 py-3 rounded-xl transition-colors font-[family-name:var(--font-dm-sans)]"
                      >
                        Continuer mes achats
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation buttons */}
            {step !== 'confirmation' && (
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => (step === 'address' ? goCatalog() : setStep('address'))}
                  className="flex items-center gap-2 border border-stone-200 text-stone-600 hover:bg-stone-50 font-semibold text-sm px-5 py-3 rounded-xl transition-colors font-[family-name:var(--font-dm-sans)]"
                >
                  <ChevronLeft size={16} /> Retour
                </button>
                <button
                  onClick={handleNextStep}
                  className="flex-1 flex items-center justify-center gap-2 btn-gold text-sm font-semibold py-3 px-6 rounded-xl border-0 transition-colors font-[family-name:var(--font-dm-sans)]"
                >
                  {step === 'address' ? 'Choisir le paiement' : 'Confirmer la commande'}
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Order summary - desktop sidebar */}
          {step !== 'confirmation' && (
            <div className="hidden lg:block">
              <OrderSummary shipping={shipping} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5 font-[family-name:var(--font-dm-sans)]">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-stone-50 border border-[#D4AF6A]/20 text-[#1a1a1a] rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF6A]/30 focus:border-[#D4AF6A] transition-colors font-[family-name:var(--font-dm-sans)]"
      />
    </div>
  );
}

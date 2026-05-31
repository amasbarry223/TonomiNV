'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Package, MapPin, LogOut, Eye, EyeOff,
  Plus, Trash2, CheckCircle, ShoppingBag,
} from 'lucide-react';
import {
  useCustomerStore,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  PAYMENT_INFO,
  type DeliveryAddress,
} from '@/stores/customer-store';
import { useNavStore } from '@/stores/nav-store';
import { formatPrice } from '@/lib/product-display';

type AccountTab = 'orders' | 'addresses' | 'profile';

// ── Auth forms ────────────────────────────────────────────────────────────────

function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const { login } = useCustomerStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const result = login(email, password);
    setLoading(false);
    if (!result.success) setError(result.error ?? 'Erreur inconnue');
  };

  return (
    <form onSubmit={handle} className="space-y-4 max-w-sm mx-auto">
      <div>
        <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5 font-[family-name:var(--font-dm-sans)]">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="votre@email.com"
          className="w-full bg-stone-50 border border-[#D4AF6A]/20 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF6A]/30 focus:border-[#D4AF6A] font-[family-name:var(--font-dm-sans)]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5 font-[family-name:var(--font-dm-sans)]">
          Mot de passe
        </label>
        <div className="relative">
          <input
            type={showPwd ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="w-full bg-stone-50 border border-[#D4AF6A]/20 rounded-xl px-3 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF6A]/30 focus:border-[#D4AF6A] font-[family-name:var(--font-dm-sans)]"
          />
          <button
            type="button"
            onClick={() => setShowPwd(!showPwd)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
          >
            {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2 font-[family-name:var(--font-dm-sans)]">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full btn-gold py-3 text-sm font-semibold rounded-xl border-0 disabled:opacity-60 font-[family-name:var(--font-dm-sans)]"
      >
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>
      <p className="text-center text-sm text-stone-500 font-[family-name:var(--font-dm-sans)]">
        Pas encore de compte ?{' '}
        <button type="button" onClick={onSwitch} className="text-[#D4AF6A] font-semibold hover:underline">
          Créer un compte
        </button>
      </p>
    </form>
  );
}

function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
  const { register } = useCustomerStore();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirm: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const setField = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Les mots de passe ne correspondent pas.'); return; }
    if (form.password.length < 6) { setError('Le mot de passe doit contenir au moins 6 caractères.'); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const result = register(form);
    setLoading(false);
    if (!result.success) setError(result.error ?? 'Erreur inconnue');
  };

  return (
    <form onSubmit={handle} className="space-y-4 max-w-sm mx-auto">
      <div className="grid grid-cols-2 gap-3">
        {[{ k: 'firstName', label: 'Prénom', ph: 'Aminata' }, { k: 'lastName', label: 'Nom', ph: 'Diallo' }].map(({ k, label, ph }) => (
          <div key={k}>
            <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5 font-[family-name:var(--font-dm-sans)]">{label}</label>
            <input
              required
              value={form[k as keyof typeof form]}
              onChange={(e) => setField(k as keyof typeof form, e.target.value)}
              placeholder={ph}
              className="w-full bg-stone-50 border border-[#D4AF6A]/20 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF6A]/30 focus:border-[#D4AF6A] font-[family-name:var(--font-dm-sans)]"
            />
          </div>
        ))}
      </div>
      {[
        { k: 'email', label: 'Email', type: 'email', ph: 'votre@email.com' },
        { k: 'phone', label: 'Téléphone', type: 'tel', ph: '+223 76 XX XX XX' },
      ].map(({ k, label, type, ph }) => (
        <div key={k}>
          <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5 font-[family-name:var(--font-dm-sans)]">{label}</label>
          <input
            required
            type={type}
            value={form[k as keyof typeof form]}
            onChange={(e) => setField(k as keyof typeof form, e.target.value)}
            placeholder={ph}
            className="w-full bg-stone-50 border border-[#D4AF6A]/20 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF6A]/30 focus:border-[#D4AF6A] font-[family-name:var(--font-dm-sans)]"
          />
        </div>
      ))}
      <div className="relative">
        <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5 font-[family-name:var(--font-dm-sans)]">Mot de passe</label>
        <input
          required
          type={showPwd ? 'text' : 'password'}
          value={form.password}
          onChange={(e) => setField('password', e.target.value)}
          placeholder="Minimum 6 caractères"
          className="w-full bg-stone-50 border border-[#D4AF6A]/20 rounded-xl px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF6A]/30 focus:border-[#D4AF6A] font-[family-name:var(--font-dm-sans)]"
        />
        <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-[34px] text-stone-400 hover:text-stone-600">
          {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
      <div>
        <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5 font-[family-name:var(--font-dm-sans)]">Confirmer le mot de passe</label>
        <input
          required
          type="password"
          value={form.confirm}
          onChange={(e) => setField('confirm', e.target.value)}
          placeholder="••••••••"
          className="w-full bg-stone-50 border border-[#D4AF6A]/20 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF6A]/30 focus:border-[#D4AF6A] font-[family-name:var(--font-dm-sans)]"
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2 font-[family-name:var(--font-dm-sans)]">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full btn-gold py-3 text-sm font-semibold rounded-xl border-0 disabled:opacity-60 font-[family-name:var(--font-dm-sans)]"
      >
        {loading ? 'Création...' : 'Créer mon compte'}
      </button>
      <p className="text-center text-sm text-stone-500 font-[family-name:var(--font-dm-sans)]">
        Déjà un compte ?{' '}
        <button type="button" onClick={onSwitch} className="text-[#D4AF6A] font-semibold hover:underline">
          Se connecter
        </button>
      </p>
    </form>
  );
}

// ── Tabs ──────────────────────────────────────────────────────────────────────

function OrdersTab() {
  const orders = useCustomerStore((s) => s.orders);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto rounded-full bg-stone-100 flex items-center justify-center mb-4">
          <ShoppingBag size={24} className="text-stone-300" />
        </div>
        <p className="font-[family-name:var(--font-playfair)] text-xl text-[#1a1a1a] mb-2">
          Aucune commande
        </p>
        <p className="text-stone-400 text-sm font-[family-name:var(--font-dm-sans)]">
          Vos commandes apparaîtront ici après votre premier achat.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <div key={order.id} className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm">
          <button
            onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
            className="w-full flex items-center justify-between p-5 text-left hover:bg-stone-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div>
                <p className="font-mono text-sm font-bold text-[#1a1a1a]">{order.number}</p>
                <p className="text-xs text-stone-400 font-[family-name:var(--font-dm-sans)] mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${ORDER_STATUS_COLORS[order.status]}`}>
                {ORDER_STATUS_LABELS[order.status]}
              </span>
            </div>
            <div className="text-right">
              <p className="font-[family-name:var(--font-playfair)] font-bold text-[#D4AF6A]">
                {formatPrice(order.total)}
              </p>
              <p className="text-xs text-stone-400 font-[family-name:var(--font-dm-sans)]">
                {order.items.length} article{order.items.length > 1 ? 's' : ''}
              </p>
            </div>
          </button>

          <AnimatePresence>
            {expandedId === order.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 pt-0 border-t border-stone-100 space-y-4">
                  <div className="space-y-2 pt-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm font-[family-name:var(--font-dm-sans)]">
                        <span className="text-stone-700">
                          {item.name} × {item.quantity}
                          {item.color && <span className="text-stone-400"> ({item.color}{item.size ? '/' + item.size : ''})</span>}
                        </span>
                        <span className="font-semibold text-[#1a1a1a] ml-4">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs font-[family-name:var(--font-dm-sans)] bg-stone-50 rounded-xl p-3">
                    <div>
                      <p className="text-stone-400">Paiement</p>
                      <p className="font-medium text-[#1a1a1a]">{PAYMENT_INFO[order.payment].label}</p>
                    </div>
                    <div>
                      <p className="text-stone-400">Livraison</p>
                      <p className="font-medium text-[#1a1a1a]">{order.address.city}, {order.address.country}</p>
                    </div>
                    {order.promoCode && (
                      <div>
                        <p className="text-stone-400">Code promo</p>
                        <p className="font-medium font-mono text-[#D4AF6A]">{order.promoCode}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-stone-400">Total</p>
                      <p className="font-bold text-[#D4AF6A]">{formatPrice(order.total)}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

function AddressesTab() {
  const { savedAddresses, saveAddress, deleteAddress, setDefaultAddress } = useCustomerStore();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    label: 'Domicile', firstName: '', lastName: '', email: '', phone: '',
    address: '', city: 'Bamako', country: 'Mali', instructions: '', isDefault: false,
  });

  const setField = (k: keyof typeof form, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleAdd = () => {
    if (!form.firstName || !form.address) return;
    saveAddress(form);
    setForm({ label: 'Domicile', firstName: '', lastName: '', email: '', phone: '', address: '', city: 'Bamako', country: 'Mali', instructions: '', isDefault: false });
    setShowAdd(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 btn-gold text-sm px-4 py-2 rounded-xl border-0 font-[family-name:var(--font-dm-sans)]"
        >
          <Plus size={15} /> Ajouter une adresse
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-2xl border border-[#D4AF6A]/20 p-5 space-y-4">
          <h3 className="font-[family-name:var(--font-playfair)] font-semibold text-[#1a1a1a]">Nouvelle adresse</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { k: 'label', label: 'Étiquette', ph: 'Domicile, Bureau...' },
              { k: 'firstName', label: 'Prénom *', ph: 'Aminata' },
              { k: 'lastName', label: 'Nom', ph: 'Diallo' },
              { k: 'phone', label: 'Téléphone *', ph: '+223 76 XX XX XX' },
            ].map(({ k, label, ph }) => (
              <div key={k}>
                <label className="block text-xs font-medium text-stone-500 mb-1 font-[family-name:var(--font-dm-sans)]">{label}</label>
                <input
                  value={form[k as keyof typeof form] as string}
                  onChange={(e) => setField(k as keyof typeof form, e.target.value)}
                  placeholder={ph}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#D4AF6A]/50 font-[family-name:var(--font-dm-sans)]"
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-stone-500 mb-1 font-[family-name:var(--font-dm-sans)]">Adresse *</label>
              <input
                value={form.address}
                onChange={(e) => setField('address', e.target.value)}
                placeholder="Rue, quartier..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#D4AF6A]/50 font-[family-name:var(--font-dm-sans)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1 font-[family-name:var(--font-dm-sans)]">Ville</label>
              <input value={form.city} onChange={(e) => setField('city', e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none font-[family-name:var(--font-dm-sans)]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1 font-[family-name:var(--font-dm-sans)]">Pays</label>
              <input value={form.country} onChange={(e) => setField('country', e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none font-[family-name:var(--font-dm-sans)]" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="btn-gold text-sm px-4 py-2 rounded-xl border-0 font-[family-name:var(--font-dm-sans)]">
              Ajouter
            </button>
            <button onClick={() => setShowAdd(false)} className="border border-stone-200 text-stone-600 text-sm px-4 py-2 rounded-xl hover:bg-stone-50 font-[family-name:var(--font-dm-sans)]">
              Annuler
            </button>
          </div>
        </div>
      )}

      {savedAddresses.length === 0 && !showAdd && (
        <div className="text-center py-12 text-stone-400 text-sm font-[family-name:var(--font-dm-sans)]">
          Aucune adresse sauvegardée.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {savedAddresses.map((addr) => (
          <div key={addr.id} className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-[#D4AF6A] shrink-0 mt-0.5" />
                <span className="font-semibold text-sm text-[#1a1a1a] font-[family-name:var(--font-dm-sans)]">
                  {addr.label}
                </span>
                {addr.isDefault && (
                  <span className="text-xs bg-[#D4AF6A]/15 text-[#D4AF6A] px-2 py-0.5 rounded-full font-medium">
                    Par défaut
                  </span>
                )}
              </div>
              <button onClick={() => deleteAddress(addr.id)} className="text-stone-300 hover:text-red-500 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
            <div className="text-sm text-stone-600 font-[family-name:var(--font-dm-sans)] space-y-0.5">
              <p className="font-medium text-[#1a1a1a]">{addr.firstName} {addr.lastName}</p>
              <p>{addr.address}</p>
              <p>{addr.city}, {addr.country}</p>
              <p className="text-stone-400">{addr.phone}</p>
            </div>
            {!addr.isDefault && (
              <button
                onClick={() => setDefaultAddress(addr.id)}
                className="mt-3 text-xs text-[#D4AF6A] hover:underline flex items-center gap-1 font-[family-name:var(--font-dm-sans)]"
              >
                <CheckCircle size={12} /> Définir par défaut
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileTab() {
  const { current, updateProfile, logout } = useCustomerStore();
  const { goHome } = useNavStore();
  const [form, setForm] = useState({
    firstName: current?.firstName ?? '',
    lastName: current?.lastName ?? '',
    phone: current?.phone ?? '',
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-sm space-y-4">
      {[
        { k: 'firstName', label: 'Prénom' },
        { k: 'lastName', label: 'Nom' },
        { k: 'phone', label: 'Téléphone' },
      ].map(({ k, label }) => (
        <div key={k}>
          <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5 font-[family-name:var(--font-dm-sans)]">{label}</label>
          <input
            value={form[k as keyof typeof form]}
            onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))}
            className="w-full bg-stone-50 border border-[#D4AF6A]/20 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF6A]/30 focus:border-[#D4AF6A] font-[family-name:var(--font-dm-sans)]"
          />
        </div>
      ))}
      <div>
        <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5 font-[family-name:var(--font-dm-sans)]">Email</label>
        <input
          value={current?.email}
          disabled
          className="w-full bg-stone-100 border border-stone-200 text-stone-400 rounded-xl px-3 py-3 text-sm cursor-not-allowed font-[family-name:var(--font-dm-sans)]"
        />
      </div>
      <button
        onClick={handleSave}
        className={`w-full btn-gold py-3 text-sm font-semibold rounded-xl border-0 transition-all font-[family-name:var(--font-dm-sans)] ${saved ? '!bg-emerald-500' : ''}`}
      >
        {saved ? '✓ Enregistré !' : 'Mettre à jour'}
      </button>
      <button
        onClick={() => { logout(); goHome(); }}
        className="w-full flex items-center justify-center gap-2 border border-stone-200 text-stone-500 hover:text-red-600 hover:border-red-300 py-3 text-sm font-semibold rounded-xl transition-colors font-[family-name:var(--font-dm-sans)]"
      >
        <LogOut size={15} /> Se déconnecter
      </button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AccountPage() {
  const current = useCustomerStore((s) => s.current);
  const orders = useCustomerStore((s) => s.orders);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [tab, setTab] = useState<AccountTab>('orders');

  const TABS: { id: AccountTab; label: string; icon: typeof Package; count?: number }[] = [
    { id: 'orders', label: 'Mes commandes', icon: Package, count: orders.length },
    { id: 'addresses', label: 'Adresses', icon: MapPin },
    { id: 'profile', label: 'Mon profil', icon: User },
  ];

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[#1a1a1a] mb-8">
          {current ? `Bonjour, ${current.firstName} !` : 'Mon compte'}
        </h1>

        {!current ? (
          /* Auth section */
          <div className="bg-white rounded-2xl border border-[#D4AF6A]/20 p-8 shadow-sm">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-[#D4AF6A]/10 flex items-center justify-center">
                <User size={28} className="text-[#D4AF6A]" />
              </div>
            </div>

            <div className="flex bg-stone-100 rounded-xl p-1 mb-6 max-w-xs mx-auto">
              <button
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all font-[family-name:var(--font-dm-sans)] ${
                  authMode === 'login' ? 'bg-white text-[#1a1a1a] shadow-sm' : 'text-stone-500'
                }`}
              >
                Connexion
              </button>
              <button
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all font-[family-name:var(--font-dm-sans)] ${
                  authMode === 'register' ? 'bg-white text-[#1a1a1a] shadow-sm' : 'text-stone-500'
                }`}
              >
                Inscription
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={authMode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {authMode === 'login' ? (
                  <LoginForm onSwitch={() => setAuthMode('register')} />
                ) : (
                  <RegisterForm onSwitch={() => setAuthMode('login')} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          /* Account section */
          <div>
            <div className="flex border-b border-stone-200 mb-6 overflow-x-auto">
              {TABS.map(({ id, label, icon: Icon, count }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap font-[family-name:var(--font-dm-sans)] ${
                    tab === id
                      ? 'border-[#D4AF6A] text-[#D4AF6A]'
                      : 'border-transparent text-stone-500 hover:text-[#1a1a1a]'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                  {count !== undefined && count > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === id ? 'bg-[#D4AF6A]/15 text-[#D4AF6A]' : 'bg-stone-100 text-stone-500'}`}>
                      {count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {tab === 'orders' && <OrdersTab />}
                {tab === 'addresses' && <AddressesTab />}
                {tab === 'profile' && <ProfileTab />}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

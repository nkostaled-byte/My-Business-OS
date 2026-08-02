import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { Product, CartItem, PaymentMethod, Order } from '../types';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';
import { MotionCard } from '../components/common/MotionCard';
import { ExportDropdown } from '../components/common/ExportDropdown';
import {
  Calculator,
  Search,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  Building2,
  CheckCircle2,
  Receipt,
  RotateCcw,
  History,
  Printer,
  Eye,
  ShoppingBag,
  TrendingUp,
  FileText,
  DollarSign,
} from 'lucide-react';

export const POSPage: React.FC = () => {
  const { products, services, orders, businessName, addOrder, updateResource } = useData();
  const { addToast } = useToast();

  const [viewMode, setViewMode] = useState<'register' | 'history'>('register');

  // Register State
  const [activeCategory, setActiveCategory] = useState<'all' | 'products' | 'services'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [taxPercent] = useState<number>(15); // 15% VAT

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [saleCompleted, setSaleCompleted] = useState<boolean>(false);
  const [completedOrderNum, setCompletedOrderNum] = useState<string>('');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // History State
  const [historySearch, setHistorySearch] = useState('');
  const [historyPaymentFilter, setHistoryPaymentFilter] = useState<'all' | PaymentMethod>('all');
  const [selectedReceipt, setSelectedReceipt] = useState<Order | null>(null);

  // Combine products and services for POS catalog
  const catalog = [
    ...products.map((p) => ({ ...p, isService: false })),
    ...services.map((s) => ({
      id: s.id,
      sku: `SRV-${s.id}`,
      name: s.name,
      category: s.category,
      price: s.price,
      stock: 999,
      soldCount: 0,
      status: 'in-stock' as const,
      isService: true,
      imageUrl: s.imageUrl || undefined,
    })),
  ];

  const filteredCatalog = catalog.filter((item) => {
    const matchesCat =
      activeCategory === 'all'
        ? true
        : activeCategory === 'products'
        ? !item.isService
        : item.isService;

    const matchesSearch =
      !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCat && matchesSearch;
  });

  const addToCart = (product: Product) => {
    const maxStock = product.stock ?? 999;
    const currentQty = cart.find((ci) => ci.product.id === product.id)?.quantity || 0;
    if (currentQty >= maxStock) {
      addToast({ title: 'Stock Limit', message: `Only ${maxStock} of "${product.name}" available.`, type: 'warning' });
      return;
    }
    setCart((prev) => {
      const existing = prev.find((ci) => ci.product.id === product.id);
      if (existing) {
        return prev.map((ci) =>
          ci.product.id === product.id ? { ...ci, quantity: Math.min(ci.quantity + 1, maxStock) } : ci
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((ci) => {
          if (ci.product.id === productId) {
            const maxStock = ci.product.stock ?? 999;
            const nextQty = ci.quantity + delta;
            if (nextQty <= 0) return null;
            return { ...ci, quantity: Math.min(nextQty, maxStock) };
          }
          return ci;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((ci) => ci.product.id !== productId));
  };

  // Cart Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxableSubtotal = subtotal - discountAmount;
  const taxAmount = (taxableSubtotal * taxPercent) / 100;
  const grandTotal = taxableSubtotal + taxAmount;

  const handleCompleteSale = async () => {
    const orderNum = `#POS-${Math.floor(1000 + Math.random() * 9000)}`;

    const orderItems = cart.map((ci) => ({
      name: ci.product.name,
      quantity: ci.quantity,
      price: ci.product.price,
    }));

    const created = await addOrder({
      orderNumber: orderNum,
      customerName: 'POS Counter Sale',
      totalAmount: grandTotal,
      status: 'completed',
      paymentMethod,
      itemsCount: cart.reduce((a, b) => a + b.quantity, 0),
      items: orderItems,
      isPos: true,
    });

    // Deduct stock for each product in the cart
    for (const ci of cart) {
      const isService = (ci.product as any).isService;
      if (!isService && ci.product.stock !== undefined) {
        const newStock = Math.max(0, ci.product.stock - ci.quantity);
        await updateResource('products', ci.product.id, { stock: newStock } as Partial<Product>);
      }
    }

    const savedOrder: Order = created ?? {
      id: '',
      orderNumber: orderNum,
      customerName: 'POS Counter Sale',
      status: 'completed',
      totalAmount: grandTotal,
      itemsCount: cart.reduce((a, b) => a + b.quantity, 0),
      items: orderItems,
      createdAt: new Date().toISOString(),
      paymentMethod,
      isPos: true,
    };

    setCompletedOrder(savedOrder);
    setCompletedOrderNum(savedOrder.orderNumber);

    addToast({
      title: 'POS Sale Completed',
      message: `Receipt ${savedOrder.orderNumber} generated. Total: R${grandTotal.toFixed(2)}`,
      type: 'success',
    });

    setSaleCompleted(true);
  };

  const resetPOS = () => {
    setCart([]);
    setDiscountPercent(0);
    setCompletedOrder(null);
    setIsCheckoutOpen(false);
    setSaleCompleted(false);
  };

  // Filter POS history orders
  const posOrders = orders.filter((o) => o.isPos || o.orderNumber.startsWith('#POS-'));

  const filteredHistoryOrders = posOrders.filter((o) => {
    const matchesSearch =
      !historySearch ||
      o.orderNumber.toLowerCase().includes(historySearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(historySearch.toLowerCase());

    const matchesPayment =
      historyPaymentFilter === 'all' || o.paymentMethod === historyPaymentFilter;

    return matchesSearch && matchesPayment;
  });

  // History Stats
  const totalPosRevenue = posOrders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalPosCount = posOrders.length;
  const cardRevenue = posOrders
    .filter((o) => o.paymentMethod === 'card')
    .reduce((acc, o) => acc + o.totalAmount, 0);
  const cashRevenue = posOrders
    .filter((o) => o.paymentMethod === 'cash')
    .reduce((acc, o) => acc + o.totalAmount, 0);

  const getPaymentBadge = (method?: PaymentMethod) => {
    switch (method) {
      case 'card':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 border border-violet-200/50 dark:border-violet-800/50">
            <CreditCard className="w-3 h-3" /> Card
          </span>
        );
      case 'cash':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50">
            <Banknote className="w-3 h-3" /> Cash
          </span>
        );
      case 'eft':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50">
            <Building2 className="w-3 h-3" /> EFT
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Point of Sale (POS)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Fast counter checkout, inventory deduction, and transaction history.
          </p>
        </div>

        {/* Navigation Switcher Tabs */}
        <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('register')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              viewMode === 'register'
                ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Terminal</span>
          </button>
          <button
            onClick={() => setViewMode('history')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              viewMode === 'history'
                ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>POS History</span>
            <span className="px-1.5 py-0.5 text-[10px] font-extrabold rounded-md bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300">
              {posOrders.length}
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'register' ? (
          /* ================= POS REGISTER VIEW ================= */
          <motion.div
            key="register"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          >
            {/* Left Column: Search, Category Filters, Item Grid (8 cols) */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-4">
              {/* Top Filter Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search catalog products & services..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="flex items-center gap-1.5 self-center">
                  {(['all', 'products', 'services'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                        activeCategory === cat
                          ? 'bg-violet-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Item Catalog Grid */}
              {filteredCatalog.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800">
                  <EmptyState
                    icon={Calculator}
                    title="POS Catalog is Empty"
                    description="No products or services found. Add inventory to start selling."
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5 max-h-[600px] overflow-y-auto pr-1">
                  {filteredCatalog.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.01, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => addToCart(item)}
                      className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-violet-400 dark:hover:border-violet-600 transition-all cursor-pointer flex flex-col justify-between group"
                    >
                      <div>
                        <div className="relative h-24 rounded-xl overflow-hidden mb-2 bg-slate-100 dark:bg-slate-800">
                          <img
                            src={
                              item.imageUrl ||
                              'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&auto=format&fit=crop&q=80'
                            }
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <span className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-md bg-slate-900/70 backdrop-blur-xs text-[10px] font-bold text-white uppercase tracking-wider">
                            {item.isService ? 'Service' : 'Product'}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-tight">
                          {item.name}
                        </h4>
                      </div>

                      <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-xs font-extrabold text-violet-600 dark:text-violet-400">
                          R{item.price.toLocaleString()}
                        </span>
                        <div className="w-6 h-6 rounded-lg bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-colors">
                          <Plus className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Cart Panel & Checkout (4-5 cols) */}
            <div className="lg:col-span-5 xl:col-span-4 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-violet-600" />
                  <span>Current Order</span>
                </h3>
                {cart.length > 0 && (
                  <button
                    onClick={() => setCart([])}
                    className="text-xs text-rose-500 hover:underline cursor-pointer font-medium"
                  >
                    Clear Cart
                  </button>
                )}
              </div>

              {/* Cart Line Items */}
              {cart.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <Calculator className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                  <p className="text-xs font-medium">Cart is empty</p>
                  <p className="text-[11px] text-slate-400 mt-1">Tap items on the left to add</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs"
                    >
                      <div className="flex-1 pr-2">
                        <span className="font-bold block text-slate-900 dark:text-slate-100">
                          {item.product.name}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          R{item.product.price} each
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-0.5">
                          <button
                            onClick={() => updateQuantity(item.product.id, -1)}
                            className="p-1 text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-md cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-1.5 font-bold text-slate-900 dark:text-slate-100">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="p-1 text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-md cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-extrabold w-16 text-right text-slate-900 dark:text-slate-100">
                          R{(item.product.price * item.quantity).toLocaleString()}
                        </span>

                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Cart Math Summary */}
              {cart.length > 0 && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Subtotal</span>
                    <span>R{subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                    <span>Discount</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={discountPercent}
                        onChange={(e) =>
                          setDiscountPercent(Math.max(0, Math.min(100, Number(e.target.value))))
                        }
                        className="w-12 px-1.5 py-0.5 text-right rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                      />
                      <span>% (-R{discountAmount.toFixed(0)})</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>VAT ({taxPercent}%)</span>
                    <span>R{taxAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-slate-100 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span>Total</span>
                    <span className="text-violet-600 dark:text-violet-400">
                      R{grandTotal.toFixed(2)}
                    </span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsCheckoutOpen(true)}
                    className="w-full py-3 mt-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-md shadow-violet-500/20 cursor-pointer"
                  >
                    Proceed to Payment
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          /* ================= POS HISTORY VIEW ================= */
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="space-y-6"
          >
            {/* POS Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MotionCard delay={0.05} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Total POS Revenue
                    </span>
                    <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                      R{totalPosRevenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </MotionCard>

              <MotionCard delay={0.1} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      POS Transactions
                    </span>
                    <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                      {totalPosCount} sales
                    </span>
                  </div>
                </div>
              </MotionCard>

              <MotionCard delay={0.15} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Card Payments
                    </span>
                    <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                      R{cardRevenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </MotionCard>

              <MotionCard delay={0.2} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Cash Collected
                    </span>
                    <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                      R{cashRevenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </MotionCard>
            </div>

            {/* Filter Controls & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  placeholder="Search receipt # or customer..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  {(['all', 'card', 'cash', 'eft'] as const).map((pm) => (
                    <button
                      key={pm}
                      onClick={() => setHistoryPaymentFilter(pm)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                        historyPaymentFilter === pm
                          ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-xs'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      {pm}
                    </button>
                  ))}
                </div>

                <ExportDropdown filename="pos-history-export.csv" />
              </div>
            </div>

            {/* Transactions List */}
            {filteredHistoryOrders.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800">
                <EmptyState
                  icon={History}
                  title="No POS Transactions Found"
                  description="Complete a sale in the Terminal tab or clear search filters to view receipt records."
                />
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="py-3.5 px-4 sm:px-6">Receipt #</th>
                        <th className="py-3.5 px-4">Date & Time</th>
                        <th className="py-3.5 px-4">Customer</th>
                        <th className="py-3.5 px-4">Items</th>
                        <th className="py-3.5 px-4">Payment Method</th>
                        <th className="py-3.5 px-4 text-right">Amount</th>
                        <th className="py-3.5 px-4 sm:px-6 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs sm:text-sm">
                      {filteredHistoryOrders.map((order, idx) => (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.15, delay: idx * 0.03 }}
                          className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                        >
                          <td className="py-4 px-4 sm:px-6 font-mono font-bold text-slate-900 dark:text-slate-100">
                            {order.orderNumber}
                          </td>
                          <td className="py-4 px-4 text-slate-500 dark:text-slate-400">
                            {order.createdAt}
                          </td>
                          <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-200">
                            {order.customerName}
                          </td>
                          <td className="py-4 px-4 text-slate-600 dark:text-slate-400">
                            {order.itemsCount} {order.itemsCount === 1 ? 'item' : 'items'}
                          </td>
                          <td className="py-4 px-4">{getPaymentBadge(order.paymentMethod)}</td>
                          <td className="py-4 px-4 font-extrabold text-right text-slate-900 dark:text-slate-100">
                            R{order.totalAmount.toLocaleString()}
                          </td>
                          <td className="py-4 px-4 sm:px-6 text-right">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedReceipt(order)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60 hover:bg-violet-100 dark:hover:bg-violet-900/60 transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Receipt</span>
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Payment Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in zoom-in-95">
            {!saleCompleted ? (
              <>
                <div className="text-center">
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                    Select Payment Method
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Total Due: R{grandTotal.toFixed(2)}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'card', label: 'Card', icon: CreditCard },
                    { id: 'cash', label: 'Cash', icon: Banknote },
                    { id: 'eft', label: 'EFT / Scan', icon: Building2 },
                  ].map((pm) => {
                    const Icon = pm.icon;
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setPaymentMethod(pm.id as PaymentMethod)}
                        className={`p-3 rounded-2xl border flex flex-col items-center gap-2 cursor-pointer transition-all ${
                          paymentMethod === pm.id
                            ? 'border-violet-600 bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 font-bold'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs">{pm.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => setIsCheckoutOpen(false)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCompleteSale}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-md shadow-violet-500/20 cursor-pointer"
                  >
                    Complete Sale
                  </motion.button>
                </div>
              </>
            ) : (
              /* Success State */
              <div className="text-center py-4 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Sale Completed!
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Receipt {completedOrderNum} generated.
                  </p>
                  <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold mt-2">
                    Paid R{grandTotal.toFixed(2)} via {paymentMethod.toUpperCase()}
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => completedOrder && setSelectedReceipt(completedOrder)}
                  className="w-full py-3 rounded-xl text-xs font-bold text-violet-600 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/60 hover:bg-violet-100 dark:hover:bg-violet-900/60 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Receipt className="w-4 h-4" />
                  <span>View Receipt</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={resetPOS}
                  className="w-full py-3 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Start New POS Sale</span>
                </motion.button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Itemized Receipt Modal */}
      {selectedReceipt && (
        <Modal
          isOpen={Boolean(selectedReceipt)}
          onClose={() => setSelectedReceipt(null)}
          title="POS Receipt Details"
          subtitle={`Receipt ${selectedReceipt.orderNumber}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            {/* Paper Receipt Simulation Card */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4 font-mono text-xs">
              <div className="text-center border-b border-slate-200 dark:border-slate-700 pb-3">
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 tracking-tight">
                  POS Receipt
                </h4>
                <p className="text-[10px] text-slate-400 mt-1">{selectedReceipt.createdAt}</p>
              </div>

              <div className="space-y-1 text-slate-700 dark:text-slate-300">
                <div className="flex justify-between">
                  <span>Receipt #:</span>
                  <span className="font-bold">{selectedReceipt.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span>{selectedReceipt.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="uppercase font-bold">{selectedReceipt.paymentMethod}</span>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="border-t border-b border-slate-200 dark:border-slate-700 py-3 space-y-2">
                <div className="flex justify-between font-bold text-[11px] text-slate-400 uppercase">
                  <span>Item</span>
                  <span>Qty / Price</span>
                </div>

                {selectedReceipt.items && selectedReceipt.items.length > 0 ? (
                  selectedReceipt.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-slate-800 dark:text-slate-200">
                      <div>
                        <span className="font-bold block">{item.name}</span>
                        <span className="text-[10px] text-slate-400">
                          {item.quantity}x @ R{item.price}
                        </span>
                      </div>
                      <span className="font-bold">R{(item.quantity * item.price).toFixed(2)}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-between text-slate-800 dark:text-slate-200">
                    <span>Counter Line Items ({selectedReceipt.itemsCount})</span>
                    <span className="font-bold">R{selectedReceipt.totalAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Math Breakdown */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span>R{(selectedReceipt.totalAmount / 1.15).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>VAT (15% included):</span>
                  <span>R{(selectedReceipt.totalAmount - selectedReceipt.totalAmount / 1.15).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 dark:text-slate-100 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span>TOTAL PAID:</span>
                  <span className="text-violet-600 dark:text-violet-400">
                    R{selectedReceipt.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedReceipt(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 cursor-pointer shadow-md shadow-violet-500/20"
              >
                Close
              </motion.button>
            </div>
          </div>
        </Modal>
      )}

      {/* Printable Receipt (only visible when printing) */}
      {selectedReceipt && (
        <div className="receipt-print-area">
          <h1>{businessName || 'My Business'}</h1>
          <div className="rc-row">
            <span>Receipt #:</span>
            <span>{selectedReceipt.orderNumber}</span>
          </div>
          <div className="rc-row">
            <span>Date:</span>
            <span>{selectedReceipt.createdAt}</span>
          </div>
          <div className="rc-row">
            <span>Customer:</span>
            <span>{selectedReceipt.customerName}</span>
          </div>
          <div className="rc-row">
            <span>Payment:</span>
            <span className="uppercase">{selectedReceipt.paymentMethod || '—'}</span>
          </div>

          <div className="rc-divider"></div>

          {selectedReceipt.items && selectedReceipt.items.length > 0 ? (
            selectedReceipt.items.map((item, idx) => (
              <div key={idx} className="rc-row">
                <span>
                  {item.name} ({item.quantity}x @ R{item.price.toFixed(2)})
                </span>
                <span>R{(item.quantity * item.price).toFixed(2)}</span>
              </div>
            ))
          ) : (
            <div className="rc-row">
              <span>Counter Line Items ({selectedReceipt.itemsCount})</span>
              <span>R{selectedReceipt.totalAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="rc-divider"></div>

          <div className="rc-row">
            <span>Subtotal:</span>
            <span>R{(selectedReceipt.totalAmount / 1.15).toFixed(2)}</span>
          </div>
          <div className="rc-row">
            <span>VAT (15%):</span>
            <span>R{(selectedReceipt.totalAmount - selectedReceipt.totalAmount / 1.15).toFixed(2)}</span>
          </div>
          <div className="rc-row rc-total">
            <span>TOTAL PAID:</span>
            <span>R{selectedReceipt.totalAmount.toFixed(2)}</span>
          </div>

          <div className="rc-divider"></div>
          <p style={{ textAlign: 'center', margin: 0 }}>Thank you for your business!</p>
        </div>
      )}
    </div>
  );
};

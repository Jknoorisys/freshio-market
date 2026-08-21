import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS } from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // --- MOCK LOCATION STATE ---
  const [selectedLocation, setSelectedLocation] = useState(() => {
    return localStorage.getItem('freshio_location') || 'Kigali';
  });

  const changeLocation = (loc) => {
    setSelectedLocation(loc);
    localStorage.setItem('freshio_location', loc);
    addToast(`Delivery location set to ${loc}`, 'success');
  };

  // --- MOCK AUTHENTICATION ---
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('freshio_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email, password) => {
    // Basic mock authentication: any email works!
    const username = email.split('@')[0];
    const newUser = {
      name: username.charAt(0).toUpperCase() + username.slice(1),
      email: email,
      phone: '+250 788 000 000',
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`,
      joinedDate: 'March 2026',
      membership: false, // Freshio+ membership status
    };
    setUser(newUser);
    localStorage.setItem('freshio_user', JSON.stringify(newUser));
    addToast(`Welcome back, ${newUser.name}! 👋`, 'success');
    return true;
  };

  const register = (name, email, phone, password) => {
    const newUser = {
      name: name,
      email: email,
      phone: phone || '+250 788 000 000',
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`,
      joinedDate: 'August 2026',
      membership: false,
    };
    setUser(newUser);
    localStorage.setItem('freshio_user', JSON.stringify(newUser));
    addToast(`Account created! Welcome ${name} 🎉`, 'success');
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('freshio_user');
    addToast('Signed out successfully.', 'info');
  };

  const toggleMembership = () => {
    if (!user) {
      addToast('Please sign in to join Freshio+', 'warning');
      return false;
    }
    const updatedUser = { ...user, membership: !user.membership };
    setUser(updatedUser);
    localStorage.setItem('freshio_user', JSON.stringify(updatedUser));
    if (updatedUser.membership) {
      addToast('Welcome to Freshio+! Free delivery activated ⚡', 'success');
    } else {
      addToast('Freshio+ membership cancelled.', 'info');
    }
    return true;
  };

  // --- WISHLIST STATE ---
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('freshio_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleWishlist = (productId) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    let updated;
    if (wishlist.includes(productId)) {
      updated = wishlist.filter((id) => id !== productId);
      addToast(`Removed ${product?.name} from Wishlist`, 'info');
    } else {
      updated = [...wishlist, productId];
      addToast(`Added ${product?.name} to Wishlist ❤️`, 'success');
    }
    setWishlist(updated);
    localStorage.setItem('freshio_wishlist', JSON.stringify(updated));
  };

  // --- CART STATE ---
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('freshio_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const addToCart = (product, quantity = 1) => {
    const existing = cart.find((item) => item.product.id === product.id);
    let updated;
    if (existing) {
      updated = cart.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updated = [...cart, { product, quantity }];
    }
    setCart(updated);
    localStorage.setItem('freshio_cart', JSON.stringify(updated));
    addToast(`Added ${product.name} to cart`, 'success');
  };

  const removeFromCart = (productId) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    const existing = cart.find((item) => item.product.id === productId);
    let updated;
    if (existing && existing.quantity > 1) {
      updated = cart.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      addToast(`Reduced quantity of ${product?.name}`, 'info');
    } else {
      updated = cart.filter((item) => item.product.id !== productId);
      addToast(`Removed ${product?.name} from cart`, 'info');
    }
    setCart(updated);
    localStorage.setItem('freshio_cart', JSON.stringify(updated));
  };

  const deleteFromCart = (productId) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    const updated = cart.filter((item) => item.product.id !== productId);
    setCart(updated);
    localStorage.setItem('freshio_cart', JSON.stringify(updated));
    addToast(`Removed ${product?.name} from cart`, 'info');
  };

  const updateCartQuantity = (productId, qty) => {
    if (qty <= 0) {
      deleteFromCart(productId);
      return;
    }
    const updated = cart.map((item) =>
      item.product.id === productId ? { ...item, quantity: qty } : item
    );
    setCart(updated);
    localStorage.setItem('freshio_cart', JSON.stringify(updated));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('freshio_cart');
  };

  // Cart Calculations
  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  };

  const getDiscount = () => {
    // Simulating discount: if checkout has code or member, or just mock 10% on orders > 10000 RWF
    const subtotal = getSubtotal();
    let disc = 0;
    if (user?.membership) {
      disc += subtotal * 0.05; // 5% flat member discount
    }
    if (subtotal > 10000) {
      disc += subtotal * 0.1; // 10% bulk discount
    }
    return Math.round(disc);
  };

  const getDeliveryFee = () => {
    const subtotal = getSubtotal();
    if (subtotal === 0) return 0;
    if (user?.membership) return 0; // Freshio+ free delivery
    if (subtotal > 15000) return 0; // Free delivery over 15,000 RWF
    return 1500; // Flat delivery fee (1500 RWF)
  };

  const getTax = () => {
    return Math.round(getSubtotal() * 0.05); // 5% GST
  };

  const getTotal = () => {
    return getSubtotal() - getDiscount() + getDeliveryFee() + getTax();
  };

  // --- ORDERS STATE ---
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('freshio_orders');
    return saved ? JSON.parse(saved) : [
      {
        id: 'FR-10248',
        date: 'March 14, 2026',
        items: [
          { product: PRODUCTS[0], quantity: 2 }, // Avocado
          { product: PRODUCTS[8], quantity: 1 }, // Milk
          { product: PRODUCTS[1], quantity: 1 }  // Bananas
        ],
        subtotal: 5000,
        discount: 500,
        delivery: 0,
        tax: 250,
        total: 4750,
        status: 'Delivered',
        address: 'Villa 14, KG 9 Ave, Nyarutarama, Kigali',
        paymentMethod: 'MTN Mobile Money',
        deliverySlot: 'Delivered on March 14, 4:15 PM'
      }
    ];
  });

  const placeOrder = (address, deliverySlot, paymentMethod) => {
    const orderId = `FR-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
      id: orderId,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      items: [...cart],
      subtotal: getSubtotal(),
      discount: getDiscount(),
      delivery: getDeliveryFee(),
      tax: getTax(),
      total: getTotal(),
      status: 'Confirmed',
      address,
      deliverySlot,
      paymentMethod,
    };
    const updated = [newOrder, ...orders];
    setOrders(updated);
    localStorage.setItem('freshio_orders', JSON.stringify(updated));
    clearCart();
    addToast('Order placed successfully! 🎉', 'success');
    return orderId;
  };

  const addOrder = (order) => {
    const updated = [order, ...orders];
    setOrders(updated);
    localStorage.setItem('freshio_orders', JSON.stringify(updated));
  };

  // --- TOAST NOTIFICATIONS STATE ---
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 3.5s
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- POPUP AND COOKIE DISMISSALS ---
  const [promoDismissed, setPromoDismissed] = useState(() => {
    return localStorage.getItem('freshio_promo_dismissed') === 'true';
  });

  const dismissPromo = () => {
    setPromoDismissed(true);
    localStorage.setItem('freshio_promo_dismissed', 'true');
  };

  const [cookieAccepted, setCookieAccepted] = useState(() => {
    return localStorage.getItem('freshio_cookie_accepted') === 'true';
  });

  const acceptCookies = () => {
    setCookieAccepted(true);
    localStorage.setItem('freshio_cookie_accepted', 'true');
    addToast('Cookie preferences saved.', 'info');
  };

  // --- NEWSLETTER SUBSCRIPTION ---
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(() => {
    return localStorage.getItem('freshio_newsletter') === 'true';
  });

  const subscribeNewsletter = (email) => {
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address.', 'error');
      return false;
    }
    setNewsletterSubscribed(true);
    localStorage.setItem('freshio_newsletter', 'true');
    addToast('Subscribed to Freshio newsletter! ✉️', 'success');
    return true;
  };

  // --- ACTIVE STORE ---
  const [activeStore, setActiveStore] = useState(() => {
    return localStorage.getItem('freshio_active_store') || 's1';
  });

  const selectStore = (storeId) => {
    setActiveStore(storeId);
    localStorage.setItem('freshio_active_store', storeId);
    addToast(`Shopping from store updated`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        selectedLocation,
        changeLocation,
        user,
        login,
        register,
        logout,
        toggleMembership,
        wishlist,
        toggleWishlist,
        cart,
        addToCart,
        removeFromCart,
        deleteFromCart,
        updateCartQuantity,
        clearCart,
        getSubtotal,
        getDiscount,
        getDeliveryFee,
        getTax,
        getTotal,
        orders,
        placeOrder,
        addOrder,
        toasts,
        addToast,
        removeToast,
        promoDismissed,
        dismissPromo,
        cookieAccepted,
        acceptCookies,
        newsletterSubscribed,
        subscribeNewsletter,
        activeStore,
        selectStore,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

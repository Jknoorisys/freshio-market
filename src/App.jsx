import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Toasts } from './components/Toasts';

// Import Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Category } from './pages/Category';
import { ProductDetail } from './pages/ProductDetail';
import { Deals } from './pages/Deals';
import { FreshPicks } from './pages/FreshPicks';
import { Stores } from './pages/Stores';
import { StoreDetail } from './pages/StoreDetail';
import { About } from './pages/About';
import { Sustainability } from './pages/Sustainability';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccess } from './pages/OrderSuccess';
import { AccountPage } from './pages/AccountPage';
import { Contact } from './pages/Contact';
import { FAQ } from './pages/FAQ';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetail } from './pages/OrderDetail';
import { WishlistPage } from './pages/WishlistPage';

// Import Mobile Pages & Components
import { MobileAppLayout } from './components/mobile/MobileAppLayout';
import { MobileHome } from './pages/mobile/MobileHome';
import { MobileShop } from './pages/mobile/MobileShop';
import { MobileCategory } from './pages/mobile/MobileCategory';
import { MobileProductDetail } from './pages/mobile/MobileProductDetail';
import { MobileCart } from './pages/mobile/MobileCart';
import { MobileCheckout } from './pages/mobile/MobileCheckout';
import { MobileOrderSuccess } from './pages/mobile/MobileOrderSuccess';
import { MobileAccount } from './pages/mobile/MobileAccount';
import { MobileOrders } from './pages/mobile/MobileOrders';
import { MobileOrderDetail } from './pages/mobile/MobileOrderDetail';
import { MobileWishlist } from './pages/mobile/MobileWishlist';
import { MobileStaticPage } from './pages/mobile/MobileStaticPage';

function AppContent() {
  const location = useLocation();
  const isMobileRoute = location.pathname.startsWith('/mobile');

  if (isMobileRoute) {
    return (
      <MobileAppLayout>
        <Routes>
          <Route path="/mobile" element={<MobileHome />} />
          <Route path="/mobile/shop" element={<MobileShop />} />
          <Route path="/mobile/category/:slug" element={<MobileCategory />} />
          <Route path="/mobile/product/:id" element={<MobileProductDetail />} />
          <Route path="/mobile/cart" element={<MobileCart />} />
          <Route path="/mobile/checkout" element={<MobileCheckout />} />
          <Route path="/mobile/order-success" element={<MobileOrderSuccess />} />
          <Route path="/mobile/account" element={<MobileAccount />} />
          <Route path="/mobile/orders" element={<MobileOrders />} />
          <Route path="/mobile/orders/:id" element={<MobileOrderDetail />} />
          <Route path="/mobile/wishlist" element={<MobileWishlist />} />
          <Route path="/mobile/page/:type" element={<MobileStaticPage />} />
          {/* Fallback sub-routes for /mobile */}
          <Route path="/mobile/*" element={<MobileHome />} />
        </Routes>
        <Toasts />
      </MobileAppLayout>
    );
  }

  return (
    <div style={styles.appWrapper}>
      {/* Global Sticky Header */}
      <Header />
      
      {/* Main Pages Routing Canvas */}
      <main style={styles.mainContent}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/category/:slug" element={<Category />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/fresh-picks" element={<FreshPicks />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/stores/:id" element={<StoreDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/sustainability" element={<Sustainability />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/account/orders" element={<OrdersPage />} />
          <Route path="/account/orders/:id" element={<OrderDetail />} />
          <Route path="/account/wishlist" element={<WishlistPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          {/* Fallback route */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      {/* Global Multi-Column Footer */}
      <Footer />

      {/* Mobile bottom navigation (visible on mobile only via CSS) */}
      <MobileBottomNav />

      {/* Toast Notification popups container */}
      <Toasts />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

const styles = {
  appWrapper: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    position: 'relative',
    backgroundColor: 'var(--color-bg)',
  },
  mainContent: {
    flexGrow: 1,
  },
};

export default App;

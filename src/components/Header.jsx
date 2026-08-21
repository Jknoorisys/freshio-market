import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import { 
  Search, 
  MapPin, 
  User, 
  Heart, 
  ShoppingBag, 
  Menu, 
  X, 
  ChevronDown, 
  ArrowRight, 
  Phone,
  Clock,
  ShoppingCart
} from 'lucide-react';
import { LocationSelector } from './LocationSelector';
import { SearchOverlay } from './SearchOverlay';
import { CartDrawer } from './CartDrawer';

export const Header = () => {
  const { selectedLocation, cart, wishlist, user } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const formattedCartTotal = cartTotal.toLocaleString() + ' RWF';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header style={{ ...styles.header, boxShadow: scrolled ? '0 4px 24px rgba(22,58,53,0.10)' : 'none' }}>

        {/* ── TOP UTILITY BAR (Aligned with Reference Image) ── */}
        <div style={styles.topBar}>
          <div className="container" style={styles.topBarInner}>
            <div style={styles.topBarLeft}>
              <div style={styles.topBarItem}>
                <MapPin size={14} color="#FFD700" />
                <span style={styles.topBarText}>Delivering in Kigali</span>
                <span style={styles.changeLink} onClick={() => setIsLocationModalOpen(true)}>Change</span>
              </div>
              <div style={styles.topBarItem}>
                <Clock size={14} color="#FFD700" />
                <span style={styles.topBarText}>Open today 08:00 - 22:00</span>
              </div>
            </div>
            
            <div style={styles.topBarRight}>
              <div style={styles.topBarItem}>
                <Phone size={14} color="#FFD700" />
                <span style={styles.topBarText}>+250 788 316 000</span>
              </div>
              <a 
                href="https://wa.me/250788316000" 
                target="_blank" 
                rel="noreferrer" 
                className="header-topbar-whatsapp-btn"
              >
                {/* Custom WhatsApp Icon Path */}
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style={{ marginRight: '4px' }}>
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.863-9.858.002-2.634-1.02-5.11-2.881-6.974-1.862-1.863-4.337-2.886-6.977-2.887-5.438 0-9.86 4.417-9.863 9.858-.001 1.76.475 3.479 1.38 5.025l-.963 3.518 3.619-.949zm9.857-7.25c-.29-.145-1.716-.848-1.982-.945-.267-.097-.461-.146-.656.145-.194.29-.752.946-.922 1.14-.17.193-.34.217-.63.072-.29-.145-1.224-.45-2.33-1.44-.86-.768-1.44-1.716-1.609-2.007-.17-.29-.018-.447.127-.591.13-.13.29-.34.435-.508.145-.169.194-.29.29-.483.097-.193.048-.361-.024-.507-.072-.145-.656-1.58-.9-2.17-.236-.575-.478-.497-.656-.506-.17-.008-.364-.01-.559-.01-.195 0-.511.072-.779.362-.267.29-1.02.999-1.02 2.437 0 1.438 1.047 2.827 1.192 3.023.146.195 2.062 3.149 4.993 4.414.697.301 1.24.481 1.662.615.701.223 1.34.191 1.844.116.562-.083 1.716-.701 1.96-1.378.243-.676.243-1.256.17-1.377-.072-.121-.267-.193-.559-.34z" />
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* ── MAIN NAVIGATION / LOGO ROW ── */}
        <div style={styles.mainBar}>
          <div className="container" style={styles.mainBarInner}>

            <button style={styles.mobileMenuToggle} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo — standard height matching reference bar */}
            <Link to="/" className="header-logo-link">
              <Logo variant="dark" height={42} />
            </Link>

            {/* Desktop Nav */}
            <nav style={styles.navDesktop}>
              {/* Shop Pill Button */}
              <div 
                style={styles.navLinkContainer} 
                onMouseEnter={() => setShowMegaMenu(true)} 
                onMouseLeave={() => setShowMegaMenu(false)}
              >
                <button className="header-shop-btn-pill" onClick={() => navigate('/shop')}>
                  Shop <ChevronDown size={14} style={{ transition: 'transform 0.2s', transform: showMegaMenu ? 'rotate(180deg)' : 'rotate(0)' }} />
                </button>

                {showMegaMenu && (
                  <div style={styles.megaMenu}>
                    <div style={styles.megaMenuGrid}>
                      <div style={styles.megaMenuCol}>
                        <Link to="/category/fruits-vegetables" onClick={() => setShowMegaMenu(false)} style={styles.megaMenuImgCard}>
                          <img src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80" alt="Fresh Produce" style={styles.megaMenuImg} />
                          <div style={styles.megaMenuImgOverlay}><span style={styles.megaMenuImgLabel}>Fresh Produce</span></div>
                        </Link>
                        <Link to="/category/fruits-vegetables?sub=Fruits" onClick={() => setShowMegaMenu(false)} style={styles.megaMenuLink}>🍎 Fruits</Link>
                        <Link to="/category/fruits-vegetables?sub=Vegetables" onClick={() => setShowMegaMenu(false)} style={styles.megaMenuLink}>🥦 Vegetables</Link>
                        <Link to="/category/fruits-vegetables" onClick={() => setShowMegaMenu(false)} style={styles.megaMenuLink}>🌿 Organic Greens</Link>
                      </div>
                      <div style={styles.megaMenuCol}>
                        <Link to="/category/dairy-eggs" onClick={() => setShowMegaMenu(false)} style={styles.megaMenuImgCard}>
                          <img src="https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=300&q=80" alt="Dairy" style={styles.megaMenuImg} />
                          <div style={styles.megaMenuImgOverlay}><span style={styles.megaMenuImgLabel}>Dairy &amp; Eggs</span></div>
                        </Link>
                        <Link to="/category/dairy-eggs?sub=Milk" onClick={() => setShowMegaMenu(false)} style={styles.megaMenuLink}>🥛 Fresh Milk</Link>
                        <Link to="/category/dairy-eggs?sub=Cheese" onClick={() => setShowMegaMenu(false)} style={styles.megaMenuLink}>🧀 Cheese</Link>
                        <Link to="/category/dairy-eggs?sub=Eggs" onClick={() => setShowMegaMenu(false)} style={styles.megaMenuLink}>🥚 Farm Eggs</Link>
                      </div>
                      <div style={styles.megaMenuCol}>
                        <Link to="/category/pantry" onClick={() => setShowMegaMenu(false)} style={styles.megaMenuImgCard}>
                          <img src="https://images.unsplash.com/photo-1505935428862-770b6f24f629?auto=format&fit=crop&w=300&q=80" alt="Pantry" style={styles.megaMenuImg} />
                          <div style={styles.megaMenuImgOverlay}><span style={styles.megaMenuImgLabel}>Pantry</span></div>
                        </Link>
                        <Link to="/category/pantry?sub=Grains" onClick={() => setShowMegaMenu(false)} style={styles.megaMenuLink}>🌾 Rice &amp; Grains</Link>
                        <Link to="/category/pantry?sub=Pasta" onClick={() => setShowMegaMenu(false)} style={styles.megaMenuLink}>🍝 Pasta</Link>
                        <Link to="/category/pantry?sub=Oils" onClick={() => setShowMegaMenu(false)} style={styles.megaMenuLink}>🫙 Cooking Oils</Link>
                      </div>
                      <div style={styles.megaMenuCol}>
                        <h4 style={styles.megaMenuMoreTitle}>More Categories</h4>
                        <Link to="/category/bakery" onClick={() => setShowMegaMenu(false)} style={styles.megaMenuLink}>🍞 Bakery</Link>
                        <Link to="/category/beverages" onClick={() => setShowMegaMenu(false)} style={styles.megaMenuLink}>🧃 Beverages</Link>
                        <Link to="/category/snacks" onClick={() => setShowMegaMenu(false)} style={styles.megaMenuLink}>🍿 Snacks</Link>
                        <Link to="/category/household" onClick={() => setShowMegaMenu(false)} style={styles.megaMenuLink}>🧹 Household</Link>
                        <Link to="/category/personal-care" onClick={() => setShowMegaMenu(false)} style={styles.megaMenuLink}>💆 Personal Care</Link>
                        <div style={styles.megaMenuPromo}>
                          <span>Get 20% Off on Freshio+</span>
                          <ArrowRight size={12} style={{ marginLeft: '4px' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Other links styled simply like reference */}
              <Link to="/" onClick={() => {
                setTimeout(() => document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
              }} className="header-nav-link">Categories</Link>
              
              <Link to="/deals" className={isActive('/deals') ? 'header-nav-link header-nav-link-active' : 'header-nav-link'}>Deals</Link>
              <Link to="/stores" className={isActive('/stores') ? 'header-nav-link header-nav-link-active' : 'header-nav-link'}>Branches</Link>
              <Link to="/account" className={isActive('/account') ? 'header-nav-link header-nav-link-active' : 'header-nav-link'}>Rewards</Link>
              
              <Link to="/about" className={isActive('/about') ? 'header-nav-link header-nav-link-active' : 'header-nav-link'} style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                More <ChevronDown size={13} style={{ opacity: 0.7 }} />
              </Link>
            </nav>

            {/* Right Actions */}
            <div style={styles.actionsRight}>
              {/* Wide Search Bar Capsule */}
              <div className="header-search-bar-wrap" onClick={() => setIsSearchOverlayOpen(true)}>
                <span className="header-search-placeholder">Search for products, brands...</span>
                <button className="header-search-icon-btn" aria-label="Search">
                  <Search size={15} />
                </button>
              </div>

              {/* User Account widget */}
              <div className="header-account-widget" onClick={() => navigate('/account')}>
                <User size={22} style={{ strokeWidth: 1.8 }} />
                <div className="header-account-info">
                  <span className="header-account-title">Account</span>
                  <span className="header-account-subtitle">{user ? user.name.split(' ')[0] : 'Sign in'}</span>
                </div>
              </div>

              {/* Shopping Cart widget */}
              <div className="header-cart-widget" onClick={() => setIsCartDrawerOpen(true)}>
                <div className="header-cart-icon-container">
                  <ShoppingCart size={22} style={{ strokeWidth: 1.8 }} />
                  {cartCount > 0 && <span className="header-cart-trolley-badge">{cartCount}</span>}
                </div>
                <span className="header-cart-total-text">{formattedCartTotal}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div style={styles.mobileNavMenu}>
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} style={styles.mobileLink}>Home</Link>
            <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} style={styles.mobileLink}>Shop All</Link>
            <Link to="/deals" onClick={() => setIsMobileMenuOpen(false)} style={styles.mobileLink}>Deals &amp; Offers</Link>
            <Link to="/fresh-picks" onClick={() => setIsMobileMenuOpen(false)} style={styles.mobileLink}>Fresh Picks</Link>
            <Link to="/stores" onClick={() => setIsMobileMenuOpen(false)} style={styles.mobileLink}>Stores</Link>
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} style={styles.mobileLink}>About Us</Link>
            <div style={styles.mobileNavDivider} />
            <button onClick={() => { setIsMobileMenuOpen(false); setIsLocationModalOpen(true); }} style={styles.mobileLocationBtn}>
              <MapPin size={16} style={{ marginRight: '6px' }} /> Deliver to: {selectedLocation}
            </button>
          </div>
        )}
      </header>

      <LocationSelector isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} />
      <SearchOverlay isOpen={isSearchOverlayOpen} onClose={() => setIsSearchOverlayOpen(false)} />
      <CartDrawer isOpen={isCartDrawerOpen} onClose={() => setIsCartDrawerOpen(false)} />
    </>
  );
};

const styles = {
  header: { position: 'sticky', top: 0, left: 0, right: 0, zIndex: 900, backgroundColor: '#FFFFFF', transition: 'box-shadow 0.3s ease' },
  topBar: { backgroundColor: '#163A35', padding: '10px 0' },
  topBarInner: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  topBarLeft: { display: 'flex', alignItems: 'center', gap: '24px' },
  topBarRight: { display: 'flex', alignItems: 'center', gap: '20px' },
  topBarItem: { display: 'flex', alignItems: 'center', gap: '6px' },
  topBarText: { fontSize: '12px', color: '#FFFFFF', fontWeight: '600' },
  changeLink: { fontSize: '12px', color: '#279E53', fontWeight: '700', textDecoration: 'underline', cursor: 'pointer', marginLeft: '2px' },
  mainBar: { borderBottom: '1px solid var(--color-border)', backgroundColor: '#FFFFFF' },
  mainBarInner: { height: '76px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' },
  logoLink: { display: 'flex', alignItems: 'center', flexShrink: 0 },
  navDesktop: { display: 'flex', alignItems: 'center', gap: '2px', flex: 1, paddingLeft: '16px' },
  navLinkContainer: { position: 'relative', cursor: 'pointer', display: 'inline-block' },
  hotBadge: { backgroundColor: '#FF5A5F', color: '#FFFFFF', fontSize: '9px', fontWeight: '900', padding: '1px 5px', borderRadius: '4px', letterSpacing: '0.5px', marginLeft: '2px' },
  megaMenu: { position: 'absolute', top: 'calc(100% + 14px)', left: '0', backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '24px', boxShadow: '0 24px 64px rgba(22,58,53,0.13)', width: '800px', padding: '28px', zIndex: 950, animation: 'fadeInUp 0.18s ease-out' },
  megaMenuGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' },
  megaMenuCol: { display: 'flex', flexDirection: 'column', gap: '6px' },
  megaMenuImgCard: { display: 'block', borderRadius: '14px', overflow: 'hidden', position: 'relative', height: '90px', marginBottom: '10px', textDecoration: 'none', flexShrink: 0 },
  megaMenuImg: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' },
  megaMenuImgOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(22,58,53,0.75) 0%, transparent 60%)', display: 'flex', alignItems: 'flex-end', padding: '8px 10px' },
  megaMenuImgLabel: { fontSize: '12px', fontWeight: '800', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.5px' },
  megaMenuMoreTitle: { fontSize: '11px', fontWeight: '800', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', paddingBottom: '6px', borderBottom: '1.5px solid var(--color-border)' },
  megaMenuLink: { fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', padding: '4px 0', transition: 'color 0.2s', textDecoration: 'none', display: 'block' },
  megaMenuPromo: { display: 'flex', alignItems: 'center', backgroundColor: 'var(--color-primary-light)', padding: '12px', borderRadius: '12px', marginTop: '8px', color: 'var(--color-primary-dark)', fontSize: '12px', fontWeight: '700', cursor: 'pointer' },
  actionsRight: { display: 'flex', alignItems: 'center', gap: '24px', flexShrink: 0 },
  mobileMenuToggle: { display: 'none', cursor: 'pointer', color: 'var(--color-text)', backgroundColor: '#F5F7F6', padding: '9px', borderRadius: '10px', alignItems: 'center', justifyContent: 'center', border: 'none' },
  mobileNavMenu: { position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#FFFFFF', boxShadow: '0 12px 32px rgba(0,0,0,0.08)', borderBottom: '1px solid var(--color-border)', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px', animation: 'fadeInDown 0.2s ease-out', zIndex: 890 },
  mobileLink: { fontSize: '15px', fontWeight: '700', color: 'var(--color-text)', padding: '4px 0', textDecoration: 'none' },
  mobileNavDivider: { height: '1px', backgroundColor: 'var(--color-border)' },
  mobileLocationBtn: { display: 'flex', alignItems: 'center', fontSize: '14px', fontWeight: '700', color: 'var(--color-primary-dark)', justifyContent: 'flex-start', background: 'none', border: 'none', cursor: 'pointer', padding: 0 },
};

export default Header;


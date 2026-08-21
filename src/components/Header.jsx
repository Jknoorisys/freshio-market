import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import { 
  Search, 
  MapPin, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  ArrowRight, 
  Phone,
  Clock,
  ShoppingCart
} from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { LocationSelector } from './LocationSelector';
import { SearchOverlay } from './SearchOverlay';
import { CartDrawer } from './CartDrawer';

export const Header = () => {
  const { selectedLocation, cart, user } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + ((item.product.price || 0) * item.quantity), 0);
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

        {/* ── TOP UTILITY BAR ── */}
        <div style={styles.topBar}>
          <div className="container" style={styles.topBarInner}>
            <div style={styles.topBarLeft}>
              <div style={styles.topBarItem}>
                <MapPin size={14} color="#FFD700" />
                <span style={styles.topBarText}>Delivering across Kigali</span>
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

            <button style={styles.mobileMenuToggle} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle Navigation">
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Bigger & Clearer Logo */}
            <Link to="/" className="header-logo-link" style={styles.logoWrapper}>
              <Logo variant="dark" height={48} showTagline={false} />
            </Link>

            {/* Desktop Nav - Strict Single Line */}
            <nav style={styles.navDesktop}>
              {/* Shop Pill Dropdown Button */}
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
                    <div style={styles.megaMenuHeader}>
                      <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--color-primary-dark)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Browse Sawa Citi Categories (4,600+ Products)
                      </span>
                      <Link to="/shop" onClick={() => setShowMegaMenu(false)} style={styles.viewAllCatalogLink}>
                        View All Products <ArrowRight size={13} />
                      </Link>
                    </div>
                    <div style={styles.megaMenuGrid}>
                      {CATEGORIES.map(cat => (
                        <Link 
                          key={cat.id} 
                          to={`/category/${cat.slug}`} 
                          onClick={() => setShowMegaMenu(false)} 
                          style={styles.megaMenuItem}
                        >
                          <span style={styles.megaMenuEmoji}>{cat.emoji}</span>
                          <div style={styles.megaMenuInfo}>
                            <span style={styles.megaMenuName}>{cat.name}</span>
                            <span style={styles.megaMenuSub}>{cat.totalCount || cat.itemCount}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div style={styles.megaMenuFooter}>
                      <div style={styles.megaMenuPromo}>
                        <span>🎉 Join Freshio+ for 2,999 RWF/mo &amp; get Unlimited Free Kigali Delivery!</span>
                        <Link to="/account" onClick={() => setShowMegaMenu(false)} style={styles.promoLink}>
                          Join Now <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Single Line Nav Links */}
              <Link to="/shop" className={isActive('/shop') ? 'header-nav-link header-nav-link-active' : 'header-nav-link'}>
                All Products
              </Link>
              <Link to="/deals" className={isActive('/deals') ? 'header-nav-link header-nav-link-active' : 'header-nav-link'}>
                Weekly Deals
              </Link>
              <Link to="/fresh-picks" className={isActive('/fresh-picks') ? 'header-nav-link header-nav-link-active' : 'header-nav-link'}>
                Fresh Picks
              </Link>
              <Link to="/stores" className={isActive('/stores') ? 'header-nav-link header-nav-link-active' : 'header-nav-link'}>
                Branches
              </Link>
              <Link to="/about" className={isActive('/about') ? 'header-nav-link header-nav-link-active' : 'header-nav-link'}>
                About Us
              </Link>
            </nav>

            {/* Right Actions: Sleek Search Icon + Account + Cart */}
            <div style={styles.actionsRight}>
              {/* Standalone Sleek Search Icon Button */}
              <button 
                className="header-search-icon-btn-standalone" 
                onClick={() => setIsSearchOverlayOpen(true)}
                aria-label="Open Product Search"
                title="Search 4,600+ products (Name, SKU, Brand...)"
              >
                <Search size={18} />
              </button>

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
            <div style={styles.mobileSearchRow} onClick={() => { setIsMobileMenuOpen(false); setIsSearchOverlayOpen(true); }}>
              <Search size={16} color="var(--color-primary)" />
              <span>Search 4,600+ items by Name, SKU...</span>
            </div>
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} style={styles.mobileLink}>Home</Link>
            <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} style={styles.mobileLink}>Shop All Products</Link>
            <Link to="/deals" onClick={() => setIsMobileMenuOpen(false)} style={styles.mobileLink}>Weekly Deals &amp; Offers</Link>
            <Link to="/fresh-picks" onClick={() => setIsMobileMenuOpen(false)} style={styles.mobileLink}>Fresh Picks</Link>
            <Link to="/stores" onClick={() => setIsMobileMenuOpen(false)} style={styles.mobileLink}>Sawa Citi Branches</Link>
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} style={styles.mobileLink}>About Us</Link>
            <div style={styles.mobileNavDivider} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Categories:</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {CATEGORIES.map(c => (
                  <Link 
                    key={c.id} 
                    to={`/category/${c.slug}`} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{ fontSize: '13px', color: 'var(--color-text)', textDecoration: 'none', padding: '4px 0' }}
                  >
                    {c.emoji} {c.name}
                  </Link>
                ))}
              </div>
            </div>
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
  topBar: { backgroundColor: '#163A35', padding: '9px 0' },
  topBarInner: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  topBarLeft: { display: 'flex', alignItems: 'center', gap: '24px' },
  topBarRight: { display: 'flex', alignItems: 'center', gap: '20px' },
  topBarItem: { display: 'flex', alignItems: 'center', gap: '6px' },
  topBarText: { fontSize: '12px', color: '#FFFFFF', fontWeight: '600' },
  changeLink: { fontSize: '12px', color: '#279E53', fontWeight: '700', textDecoration: 'underline', cursor: 'pointer', marginLeft: '2px' },
  mainBar: { borderBottom: '1px solid var(--color-border)', backgroundColor: '#FFFFFF' },
  mainBarInner: { height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '28px' },
  logoWrapper: { display: 'flex', alignItems: 'center', flexShrink: 0, textDecoration: 'none' },
  navDesktop: { display: 'flex', alignItems: 'center', gap: '24px', flex: 1, paddingLeft: '12px', flexWrap: 'nowrap' },
  navLinkContainer: { position: 'relative', cursor: 'pointer', display: 'inline-block', flexShrink: 0 },
  megaMenu: { position: 'absolute', top: 'calc(100% + 14px)', left: '-10px', backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '24px', boxShadow: '0 24px 64px rgba(22,58,53,0.13)', width: '760px', padding: '24px', zIndex: 950, animation: 'fadeInUp 0.18s ease-out' },
  megaMenuHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '14px', borderBottom: '1px solid var(--color-border)', marginBottom: '16px' },
  viewAllCatalogLink: { display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12.5px', fontWeight: '700', color: 'var(--color-primary-dark)', textDecoration: 'none' },
  megaMenuGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' },
  megaMenuItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '12px', textDecoration: 'none', backgroundColor: '#F9FAFB', border: '1px solid transparent', transition: 'all 0.15s' },
  megaMenuEmoji: { fontSize: '20px' },
  megaMenuInfo: { display: 'flex', flexDirection: 'column' },
  megaMenuName: { fontSize: '13px', fontWeight: '700', color: 'var(--color-text)' },
  megaMenuSub: { fontSize: '11px', color: 'var(--color-text-secondary)' },
  megaMenuFooter: { marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--color-border)' },
  megaMenuPromo: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--color-primary-light)', padding: '10px 16px', borderRadius: '12px', color: 'var(--color-primary-dark)', fontSize: '12px', fontWeight: '700' },
  promoLink: { display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--color-primary-dark)', textDecoration: 'underline' },
  actionsRight: { display: 'flex', alignItems: 'center', gap: '22px', flexShrink: 0 },
  mobileMenuToggle: { display: 'none', cursor: 'pointer', color: 'var(--color-text)', backgroundColor: '#F5F7F6', padding: '9px', borderRadius: '10px', alignItems: 'center', justifyContent: 'center', border: 'none' },
  mobileNavMenu: { position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#FFFFFF', boxShadow: '0 12px 32px rgba(0,0,0,0.08)', borderBottom: '1px solid var(--color-border)', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px', animation: 'fadeInDown 0.2s ease-out', zIndex: 890 },
  mobileSearchRow: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '12px', backgroundColor: '#F3F4F6', color: 'var(--color-text-secondary)', fontSize: '13px', cursor: 'pointer' },
  mobileLink: { fontSize: '15px', fontWeight: '700', color: 'var(--color-text)', padding: '4px 0', textDecoration: 'none' },
  mobileNavDivider: { height: '1px', backgroundColor: 'var(--color-border)' },
  mobileLocationBtn: { display: 'flex', alignItems: 'center', fontSize: '14px', fontWeight: '700', color: 'var(--color-primary-dark)', justifyContent: 'flex-start', background: 'none', border: 'none', cursor: 'pointer', padding: 0 },
};

export default Header;

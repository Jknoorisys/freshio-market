import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { CATEGORIES, PRODUCTS, STORES } from '../data/mockData';
import { PromoPopup } from '../components/PromoPopup';
import { CookieConsent } from '../components/CookieConsent';
import * as LucideIcons from 'lucide-react';
import { 
  ArrowRight, 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  ChevronRight, 
  Clock, 
  Percent, 
  Navigation,
  Award,
  Zap,
  ShoppingBag,
  HelpCircle,
  Users,
  Store
} from 'lucide-react';

// Images for each of the 12 Sawa Citi categories
const CATEGORY_IMAGES = {
  'groceries':     'https://images.unsplash.com/photo-1505935428862-770b6f24f629?auto=format&fit=crop&w=400&q=80',
  'fresh-produce': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80',
  'meat-fish':     'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=400&q=80',
  'beverages':     'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=400&q=80',
  'wines-spirits': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=400&q=80',
  'snacks':        'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=400&q=80',
  'dairy':         'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80',
  'household':     'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=400&q=80',
  'beauty':        'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=400&q=80',
  'baby':          'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=400&q=80',
  'kitchen':       'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80',
  'electronics':   'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=400&q=80',
};

export const Home = () => {
  const { addToCart, toggleWishlist, wishlist, user, toggleMembership, selectStore, activeStore } = useApp();
  const navigate = useNavigate();

  // --- STATS COUNT ANIMATION ---
  const [shoppersCount, setShoppersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [locationsCount, setLocationsCount] = useState(0);

  useEffect(() => {
    // Staggered counters
    const duration = 1500; // 1.5s
    const steps = 60;
    const stepTime = duration / steps;
    
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      setShoppersCount(Math.min(Math.round((10000 / steps) * currentStep), 10000));
      setProductsCount(Math.min(Math.round((4600 / steps) * currentStep), 4600));
      setLocationsCount(Math.min(Math.round((8 / steps) * currentStep), 8));

      if (currentStep >= steps) clearInterval(interval);
    }, stepTime);

    return () => clearInterval(interval);
  }, []);

  // --- COUNTDOWN TIMER (Deals Section) ---
  const [timeLeft, setTimeLeft] = useState(15512);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return {
      hours: hrs.toString().padStart(2, '0'),
      minutes: mins.toString().padStart(2, '0'),
      seconds: secs.toString().padStart(2, '0')
    };
  };

  const timer = formatTime(timeLeft);

  // --- FRESH PICKS TABS STATE ---
  const [activeTab, setActiveTab] = useState('popular');
  const [tabProducts, setTabProducts] = useState([]);

  useEffect(() => {
    let filtered = [];
    switch (activeTab) {
      case 'new':
        filtered = PRODUCTS.filter(p => Array.isArray(p.tags) && p.tags.includes('imported')).slice(0, 5);
        break;
      case 'rated':
        filtered = PRODUCTS.filter(p => (p.rating || 0) >= 4.7).slice(0, 5);
        break;
      case 'healthy':
        filtered = PRODUCTS.filter(p => p.categorySlug === 'fresh-produce' || (Array.isArray(p.tags) && p.tags.includes('fresh'))).slice(0, 5);
        break;
      case 'popular':
      default:
        filtered = PRODUCTS.filter(p => p.isFeatured || (Array.isArray(p.tags) && p.tags.includes('bestseller'))).slice(0, 5);
        break;
    }
    setTabProducts(filtered);
  }, [activeTab]);

  // --- INTERACTIVE MAP PREVIEW ---
  const [hoveredStore, setHoveredStore] = useState('s1');

  // Filter deal products from dataset
  const dealProducts = PRODUCTS.filter((p) => p.isDeal || p.discount > 0).slice(0, 4);

  // Category Icon Renderer
  const renderCategoryIcon = (iconName) => {
    const IconComponent = LucideIcons[iconName];
    return IconComponent ? <IconComponent size={24} color="var(--color-primary-dark)" /> : <HelpCircle size={24} />;
  };

  return (
    <div style={styles.page}>
      {/* SECTION 1 - HERO */}
      <section style={styles.heroSection}>
        <div className="container" style={styles.heroContainer}>
          <div style={styles.heroTextCol} className="animate-fade-in-up">
            <div style={styles.heroBadge}>
              <Sparkles size={14} color="var(--color-orange)" style={{ marginRight: '6px' }} />
              <span>KIGALI HEIGHTS • DOWNTOWN • NYARUTARAMA</span>
            </div>
            
            <h1 style={styles.heroTitle}>
              Kigali's Finest Produce.<br />
              Delivered <span style={{ color: 'var(--color-primary-dark)' }}>in 2 Hours.</span>
            </h1>
            
            <p style={styles.heroDesc}>
              Sourced from local Rwandan farms straight to Kigali homes. Taste the organic difference of fresh vegetables, grass-fed dairy, and artisanal breads harvested at dawn.
            </p>
            
            <div style={styles.heroActions}>
              <button onClick={() => navigate('/shop')} className="btn btn-primary" style={styles.heroPrimaryBtn}>
                Shop Fresh
                <ArrowRight size={18} style={{ marginLeft: '6px' }} />
              </button>
              <button 
                onClick={() => {
                  const element = document.getElementById('categories-section');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }} 
                className="btn btn-secondary" 
                style={styles.heroSecondaryBtn}
              >
                Explore Categories
              </button>
            </div>

            {/* Floating Value Cards */}
            <div style={styles.floatingCardsRow}>
              <div style={styles.floatingCard} className="floating-card-1">
                <div style={styles.floatingIconCircle}>
                  <Sparkles size={16} color="var(--color-primary-dark)" />
                </div>
                <div>
                  <span style={styles.floatingCardTitle}>Fresh Today</span>
                  <span style={styles.floatingCardDesc}>Picked at dawn</span>
                </div>
              </div>
              <div style={styles.floatingCard} className="floating-card-2">
                <div style={styles.floatingIconCircle}>
                  <Truck size={16} color="var(--color-primary-dark)" />
                </div>
                <div>
                  <span style={styles.floatingCardTitle}>Same-day Delivery</span>
                  <span style={styles.floatingCardDesc}>Under 2 hours</span>
                </div>
              </div>
              <div style={styles.floatingCard} className="floating-card-3">
                <div style={styles.floatingIconCircle}>
                  <ShieldCheck size={16} color="var(--color-primary-dark)" />
                </div>
                <div>
                  <span style={styles.floatingCardTitle}>100% Quality Checked</span>
                  <span style={styles.floatingCardDesc}>Double-inspected</span>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.heroImageCol} className="animate-fade-in">
            <div style={styles.heroImageBg} />
            <img 
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80" 
              alt="Kigali Fresh Market Crate" 
              style={{
                ...styles.heroImage,
                borderRadius: '24px',
                border: '4px solid #FFFFFF',
                boxShadow: 'var(--shadow-lg)',
                objectFit: 'cover',
                width: '100%',
                height: '340px'
              }} 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23EAF8F0"/><circle cx="50" cy="50" r="25" fill="%23FFFFFF"/><path d="M50 35 C42 45 42 55 50 65 C58 55 58 45 50 35 Z" fill="%2320B86B"/><text x="50" y="80" font-family="sans-serif" font-weight="bold" font-size="6" fill="%23087A4B" text-anchor="middle">Freshio Organics</text></svg>';
              }}
            />
          </div>
        </div>
      </section>

      {/* SECTION 2 - QUICK STATS */}
      <section style={styles.statsSection}>
        <div className="container" style={styles.statsContainer}>
          <div style={styles.statBox} className="stat-pop">
            <div style={styles.statIconCircle}>
              <Users size={20} color="var(--color-accent)" />
            </div>
            <div style={styles.statTextGroup}>
              <span style={styles.statNum}>
                {shoppersCount >= 10000 ? '10,000+' : shoppersCount.toLocaleString()}
              </span>
              <span style={styles.statLabel}>Happy Shoppers</span>
            </div>
          </div>

          <div style={styles.statDivider} />

          <div style={styles.statBox} className="stat-pop">
            <div style={styles.statIconCircle}>
              <ShoppingBag size={20} color="var(--color-accent)" />
            </div>
            <div style={styles.statTextGroup}>
              <span style={styles.statNum}>
                {productsCount >= 2000 ? '2,000+' : productsCount.toLocaleString()}
              </span>
              <span style={styles.statLabel}>Fresh Products</span>
            </div>
          </div>

          <div style={styles.statDivider} />

          <div style={styles.statBox} className="stat-pop">
            <div style={styles.statIconCircle}>
              <Truck size={20} color="var(--color-accent)" />
            </div>
            <div style={styles.statTextGroup}>
              <span style={styles.statNum}>Same Day</span>
              <span style={styles.statLabel}>Kigali Delivery</span>
            </div>
          </div>

          <div style={styles.statDivider} />

          <div style={styles.statBox} className="stat-pop">
            <div style={styles.statIconCircle}>
              <Store size={20} color="var(--color-accent)" />
            </div>
            <div style={styles.statTextGroup}>
              <span style={styles.statNum}>
                {locationsCount}+
              </span>
              <span style={styles.statLabel}>Active Outlets</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 - SHOP BY CATEGORY */}
      <section id="categories-section" style={styles.section}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <div>
              <span style={styles.sectionBadge}>EXPLORE RANGE</span>
              <h2 style={styles.sectionTitle}>What are you shopping for?</h2>
            </div>
            <button onClick={() => navigate('/shop')} style={styles.sectionLink}>
              View All Shop <ChevronRight size={16} />
            </button>
          </div>

          <div style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                onClick={() => navigate(`/category/${cat.slug}`)}
                style={styles.categoryCard}
                className="category-card-hover"
              >
                <div style={styles.categoryImgWrap}>
                  <img
                    src={CATEGORY_IMAGES[cat.id] || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80'}
                    alt={cat.name}
                    style={styles.categoryImg}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80'; }}
                  />
                  <div style={styles.categoryImgOverlay} />
                  <span style={styles.categoryCountBadge}>{cat.itemCount}</span>
                </div>
                <div style={styles.categoryInfo}>
                  <h3 style={styles.categoryTitle}>{cat.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 - FLASH DEALS */}
      <section style={styles.dealsSection}>
        <div className="container" style={styles.dealsContainer}>
          <div style={styles.dealsPromoBox}>
            <span style={styles.dealBadge}>⚡ FLASH SALE</span>
            <h2 style={styles.dealPromoTitle}>Today's Fresh Deals</h2>
            <p style={styles.dealPromoDesc}>Handpicked farm-fresh items discounted for today only. Grab them before they're gone!</p>
            
            {/* Timer Widget */}
            <div style={styles.timerContainer}>
              <div style={styles.timerBox}>
                <span style={styles.timerVal}>{timer.hours}</span>
                <span style={styles.timerUnit}>hrs</span>
              </div>
              <span style={styles.timerColon}>:</span>
              <div style={styles.timerBox}>
                <span style={styles.timerVal}>{timer.minutes}</span>
                <span style={styles.timerUnit}>min</span>
              </div>
              <span style={styles.timerColon}>:</span>
              <div style={styles.timerBox}>
                <span style={styles.timerVal}>{timer.seconds}</span>
                <span style={styles.timerUnit}>sec</span>
              </div>
            </div>

            <button onClick={() => navigate('/deals')} className="btn btn-orange" style={styles.viewDealsBtn}>
              View All Deals
            </button>
          </div>

          <div style={styles.dealsGrid}>
            {dealProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 - FRESH PICKS CAROUSEL */}
      <section style={styles.section}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <div>
              <span style={styles.sectionBadge}>WEEKLY SELECTION</span>
              <h2 style={styles.sectionTitle}>Picked fresh for you</h2>
            </div>
            {/* Carousel Tabs */}
            <div style={styles.tabsList}>
              <button 
                onClick={() => setActiveTab('popular')} 
                style={{
                  ...styles.tabBtn,
                  backgroundColor: activeTab === 'popular' ? 'var(--color-primary-dark)' : 'transparent',
                  color: activeTab === 'popular' ? '#FFFFFF' : 'var(--color-text-secondary)',
                }}
              >
                Popular
              </button>
              <button 
                onClick={() => setActiveTab('new')} 
                style={{
                  ...styles.tabBtn,
                  backgroundColor: activeTab === 'new' ? 'var(--color-primary-dark)' : 'transparent',
                  color: activeTab === 'new' ? '#FFFFFF' : 'var(--color-text-secondary)',
                }}
              >
                New Arrivals
              </button>
              <button 
                onClick={() => setActiveTab('rated')} 
                style={{
                  ...styles.tabBtn,
                  backgroundColor: activeTab === 'rated' ? 'var(--color-primary-dark)' : 'transparent',
                  color: activeTab === 'rated' ? '#FFFFFF' : 'var(--color-text-secondary)',
                }}
              >
                Best Rated
              </button>
              <button 
                onClick={() => setActiveTab('healthy')} 
                style={{
                  ...styles.tabBtn,
                  backgroundColor: activeTab === 'healthy' ? 'var(--color-primary-dark)' : 'transparent',
                  color: activeTab === 'healthy' ? '#FFFFFF' : 'var(--color-text-secondary)',
                }}
              >
                Healthy Picks
              </button>
            </div>
          </div>

          <div style={styles.carouselContainer} className="hide-scrollbar">
            {tabProducts.map((product) => (
              <div key={product.id} style={styles.carouselItem}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 - PROMOTIONAL BANNER */}
      <section style={{ margin: '40px 0' }}>
        <div className="container">
          <div style={styles.promoBanner}>
            <div style={styles.promoBannerTextCol}>
              <span style={styles.promoBannerBadge}>ORGANIC SPECIAL</span>
              <h2 style={styles.promoBannerTitle}>Eat better.<br />Feel fresher.</h2>
              <p style={styles.promoBannerDesc}>
                Discover our curated collection of organic whole foods, cold-pressed fruit juices, and raw honey. Free from chemical pesticides, full of natural nourishment.
              </p>
              <button onClick={() => navigate('/fresh-picks')} className="btn btn-primary" style={styles.promoBannerBtn}>
                Explore Fresh Picks
              </button>
            </div>
            <div style={styles.promoBannerImgCol}>
              <img 
                src="https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=700&q=80" 
                alt="Fresh Organic Vegetables" 
                style={styles.promoBannerImage} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23EAF8F0"/><circle cx="50" cy="50" r="20" fill="%23FFFFFF"/><path d="M50 40 C44 48 44 56 50 64 C56 56 56 48 50 40 Z" fill="%2320B86B"/></svg>';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 - TRUST STRIP */}
      <section style={styles.trustStrip}>
        <div className="container">
          <div style={styles.trustGrid}>
            {[
              { icon: '✅', color: '#E8F5EC', iconBg: '#279E53', title: 'Fresh & quality', desc: 'Handpicked daily for you and your family.' },
              { icon: '🚚', color: '#E8F0FF', iconBg: '#4A7AFF', title: 'Fast delivery', desc: 'Same-day delivery across Kigali.' },
              { icon: '💳', color: '#FFF3E8', iconBg: '#FF9F43', title: 'Easy payments', desc: 'MTN MoMo, Airtel Money or Card.' },
              { icon: '🛡️', color: '#F0EAFF', iconBg: '#7C3AED', title: 'Safe & trusted', desc: 'Your security and satisfaction matter.' },
            ].map((item) => (
              <div key={item.title} style={styles.trustItem}>
                <div style={{ ...styles.trustIconBox, backgroundColor: item.color }}>
                  <span style={{ fontSize: '22px' }}>{item.icon}</span>
                </div>
                <div>
                  <div style={styles.trustTitle}>{item.title}</div>
                  <div style={styles.trustDesc}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8 - 3 WIDGET CARDS */}
      <section style={{ margin: '24px 0' }}>
        <div className="container">
          <div style={styles.widgetRow}>

            {/* BUY AGAIN */}
            <div style={{ ...styles.widgetCard, backgroundColor: '#F0FDF4', borderColor: '#DCFCE7' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={styles.widgetTitle}>Buy again</h3>
                  <p style={styles.widgetDesc}>Reorder your last items in one click.</p>
                  <button onClick={() => navigate('/orders')} className="btn btn-primary" style={{ ...styles.widgetBtn, backgroundColor: '#163A35', color: '#FFFFFF', border: 'none', padding: '8px 18px', fontSize: '13px', fontWeight: '700', borderRadius: '10px' }}>Reorder All</button>
                </div>
                <div style={styles.miniProductRow}>
                  {[
                    'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=100&q=80',
                    'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=100&q=80',
                    'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=100&q=80',
                    'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&w=100&q=80'
                  ].map((url, i) => (
                    <div key={i} style={styles.miniProductChip}>
                      <img src={url} alt="product" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                    </div>
                  ))}
                </div>
              </div>
              <div style={styles.widgetImgRight}>
                <img
                  src="https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?auto=format&fit=crop&w=500&q=80"
                  alt="Grocery basket"
                  style={styles.widgetImg}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            </div>

            {/* FRESHIO REWARDS */}
            <div style={{ ...styles.widgetCard, backgroundColor: '#FEFCE8', border: '1.5px solid #FDE68A' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={styles.rewardsLabel}>freshio <span style={{ color: '#D97706' }}>rewards</span></div>
                  <p style={{ fontSize: '12.5px', color: '#78716C', margin: '4px 0 8px', lineHeight: '1.4' }}>Earn points with every order and enjoy exciting benefits.</p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#92400E', fontWeight: '700', margin: '0 0 2px' }}>You have</p>
                  <div style={styles.rewardsPts}>1,240 <span style={{ fontSize: '18px', fontWeight: '800' }}>pts</span></div>
                  <button onClick={() => navigate('/account')} style={styles.rewardsBtn}>View Rewards</button>
                </div>
              </div>
              <div style={styles.widgetImgRight}>
                <img
                  src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=300&q=80"
                  alt="Gift box rewards"
                  style={{ ...styles.widgetImg, objectPosition: 'center' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            </div>

            {/* NEED HELP */}
            <div style={{ ...styles.widgetCard, backgroundColor: '#F5F3FF', borderColor: '#DDD6FE' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={styles.widgetTitle}>Need help?</h3>
                  <p style={styles.widgetDesc}>Chat with us on WhatsApp we're here for you!</p>
                </div>
                <div>
                  <a
                    href="https://wa.me/250788000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="chat-now-btn-lavender"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #7C3AED',
                      borderRadius: '9999px',
                      padding: '8px 18px',
                      fontSize: '13px',
                      fontWeight: '700',
                      color: '#7C3AED',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 6px rgba(124, 58, 237, 0.08)'
                    }}
                  >
                    Chat now
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" style={{ color: 'inherit' }}>
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.863-9.858.002-2.634-1.02-5.11-2.881-6.974-1.862-1.863-4.337-2.886-6.977-2.887-5.438 0-9.86 4.417-9.863 9.858-.001 1.76.475 3.479 1.38 5.025l-.963 3.518 3.619-.949zm9.857-7.25c-.29-.145-1.716-.848-1.982-.945-.267-.097-.461-.146-.656.145-.194.29-.752.946-.922 1.14-.17.193-.34.217-.63.072-.29-.145-1.224-.45-2.33-1.44-.86-.768-1.44-1.716-1.609-2.007-.17-.29-.018-.447.127-.591.13-.13.29-.34.435-.508.145-.169.194-.29.29-.483.097-.193.048-.361-.024-.507-.072-.145-.656-1.58-.9-2.17-.236-.575-.478-.497-.656-.506-.17-.008-.364-.01-.559-.01-.195 0-.511.072-.779.362-.267.29-1.02.999-1.02 2.437 0 1.438 1.047 2.827 1.192 3.023.146.195 2.062 3.149 4.993 4.414.697.301 1.24.481 1.662.615.701.223 1.34.191 1.844.116.562-.083 1.716-.701 1.96-1.378.243-.676.243-1.256.17-1.377-.072-.121-.267-.193-.559-.34z" />
                    </svg>
                  </a>
                </div>
              </div>
              <div style={styles.widgetImgRight}>
                <img
                  src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=300&q=80"
                  alt="Freshio app"
                  style={{ ...styles.widgetImg, objectFit: 'contain', backgroundColor: 'transparent' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 9 - STORE LOCATOR PREVIEW */}
      <section style={styles.section}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <div>
              <span style={styles.sectionBadge}>VISIT US</span>
              <h2 style={styles.sectionTitle}>Freshio near you</h2>
            </div>
            <button onClick={() => navigate('/stores')} style={styles.sectionLink}>
              View All Stores <ChevronRight size={16} />
            </button>
          </div>

          <div style={styles.storesBlock}>
            {/* Store List */}
            <div style={styles.storesListCol}>
              {STORES.map((store) => {
                const isActive = activeStore === store.id;
                const isHovered = hoveredStore === store.id;
                return (
                  <div 
                    key={store.id}
                    onClick={() => { setHoveredStore(store.id); selectStore(store.id); }}
                    style={{
                      ...styles.storePreviewCard,
                      borderColor: isActive || isHovered ? 'var(--color-primary)' : 'var(--color-border)',
                      backgroundColor: isActive ? 'var(--color-primary-light)' : '#FFFFFF'
                    }}
                  >
                    <div style={styles.storeCardInfo}>
                      <h4 style={styles.storeName}>{store.name}</h4>
                      <p style={styles.storeAddress}>{store.address}</p>
                      
                      <div style={styles.storeTimingRow}>
                        <Clock size={14} style={{ marginRight: '6px', color: 'var(--color-primary-dark)' }} />
                        <span>Open until {store.hours.split('-')[1].trim()}</span>
                        <span style={styles.storeDistance}>({store.distance})</span>
                      </div>

                      <div style={styles.servicesGrid}>
                        {store.services.slice(0,3).map(service => (
                          <span key={service} style={styles.serviceBadge}>✓ {service}</span>
                        ))}
                      </div>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate(`/stores/${store.id}`); }} 
                      style={styles.storeViewBtn}
                    >
                      View Details
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Interactive Mock Map */}
            <div style={styles.mockMapCol}>
              <div style={styles.mapHeader}>
                <Navigation size={16} style={{ marginRight: '6px' }} />
                <span>Interactive Stores Plot Map</span>
              </div>
              <div style={styles.mapCanvas}>
                {/* SVG Mock Map Grid */}
                <svg width="100%" height="100%" style={{ backgroundColor: '#EDF5F1' }}>
                  {/* Grid Lines */}
                  <line x1="0" y1="100" x2="100%" y2="100" stroke="#DFEBE6" strokeWidth="1" />
                  <line x1="0" y1="200" x2="100%" y2="200" stroke="#DFEBE6" strokeWidth="1" />
                  <line x1="150" y1="0" x2="150" y2="100%" stroke="#DFEBE6" strokeWidth="1" />
                  <line x1="300" y1="0" x2="300" y2="100%" stroke="#DFEBE6" strokeWidth="1" />

                  {/* Rivers / Parks illustrations */}
                  <path d="M 50,0 Q 120,150 180,300 T 320,400" fill="none" stroke="#D1E8E2" strokeWidth="12" strokeLinecap="round" />
                  <rect x="20" y="40" width="100" height="60" rx="10" fill="#E2EEE8" />
                  <text x="35" y="75" fill="#9CB8AC" fontSize="11" fontWeight="700">CITY PARK</text>

                  {/* Store pins */}
                  {STORES.map((s, idx) => {
                    // Custom plot points
                    const coords = [
                      { x: 120, y: 140 }, // s1
                      { x: 260, y: 80 },  // s2
                      { x: 80, y: 270 },  // s3
                      { x: 380, y: 220 }  // s4
                    ];
                    const pt = coords[idx];
                    const isSelected = hoveredStore === s.id;
                    return (
                      <g 
                        key={s.id} 
                        cursor="pointer" 
                        onClick={() => { setHoveredStore(s.id); selectStore(s.id); }}
                      >
                        {/* Selected halo */}
                        {isSelected && (
                          <circle cx={pt.x} cy={pt.y} r="16" fill="rgba(32, 184, 107, 0.25)" />
                        )}
                        <circle 
                          cx={pt.x} 
                          cy={pt.y} 
                          r="8" 
                          fill={isSelected ? 'var(--color-primary-dark)' : 'var(--color-primary)'} 
                          stroke="#FFFFFF" 
                          strokeWidth="2" 
                        />
                        <text 
                          x={pt.x} 
                          y={pt.y - 14} 
                          textAnchor="middle" 
                          fill={isSelected ? 'var(--color-primary-dark)' : 'var(--color-text)'} 
                          fontSize="11" 
                          fontWeight="800"
                          style={{
                            backgroundColor: '#FFFFFF',
                            padding: '2px',
                            border: '1px solid #000'
                          }}
                        >
                          {s.name.replace('Freshio ', '')}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Floating Map Store Card Overlay */}
                {hoveredStore && (
                  <div style={styles.mapOverlayCard}>
                    {(() => {
                      const st = STORES.find(s => s.id === hoveredStore);
                      return (
                        <>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <img 
                              src={st.image} 
                              alt={st.name} 
                              style={styles.mapOverlayImg} 
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"><rect width="50" height="50" fill="%23EAF8F0"/></svg>';
                              }}
                            />
                            <div>
                              <h5 style={styles.mapOverlayTitle}>{st.name}</h5>
                              <p style={styles.mapOverlayDist}>📍 {st.distance} • Open Daily</p>
                              <span style={styles.mapOverlayAddr}>{st.address.slice(0,30)}...</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => { selectStore(st.id); navigate(`/stores/${st.id}`); }} 
                            style={styles.mapOverlayBtn}
                          >
                            Shop this Store
                          </button>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10 - APP DOWNLOAD BANNER */}
      <section style={styles.appBannerSection}>
        <div className="container">
          <div style={{ ...styles.appBannerInner, background: 'linear-gradient(135deg, #163A35 0%, #081B19 100%)', boxShadow: '0 12px 40px rgba(11,29,27,0.15)' }}>

            {/* Phone mockup left */}
            <div style={styles.appPhoneSide} className="app-phone-float">
              <img
                src="https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=400&q=80"
                alt="Freshio App"
                style={{ ...styles.appPhoneImg, border: '4px solid rgba(255,255,255,0.18)', boxShadow: '0 12px 32px rgba(0,0,0,0.25)' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>

            {/* Text */}
            <div style={styles.appBannerText}>
              <h2 style={{ ...styles.appBannerTitle, fontSize: '24px', letterSpacing: '-0.3px' }}>Groceries at your<br />fingertips.</h2>
              <p style={{ ...styles.appBannerDesc, color: 'rgba(216,234,226,0.85)', fontSize: '13px' }}>Download the Freshio app for exclusive offers, easy tracking and a better shopping experience.</p>
            </div>

            {/* QR + stores */}
            <div style={styles.appStoreBlock}>
              <div className="qr-code-hover" style={{ ...styles.qrCodeBox, border: '1.5px solid rgba(255,255,255,0.1)', cursor: 'pointer', padding: '12px' }}>
                <svg viewBox="0 0 29 29" width="56" height="56" fill="#163A35" style={{ display: 'block' }}>
                  <path d="M0 0h7v7H0zm1 1v5h5V1zm1 1h3v3H2z" />
                  <path d="M22 0h7v7h-7zm1 1v5h5V1zm1 1h3v3H24z" />
                  <path d="M0 22h7v7H0zm1 1v5h5v-5zm1 1h3v3H2z" />
                  <path d="M22 22h5v5h-5zm1 1v3h3v-3zm1 1h1v1h-1z" />
                  <path d="M8 1h1v1H8zm3 0h2v1h-2zm4 0h1v2h-1zm2 0h1v1h-1zm2 0h1v1h-1zm-10 2h1v1H8zm2 0h1v1h-1zm3 0h1v1h-1zm2 0h2v1h-2zm3 0h1v1h-1zm-9 2h1v1H9zm2 0h2v1h-2zm3 0h1v1h-1zm4 0h2v1h-2zm-11 2h2v1H8zm3 0h1v1h-1zm2 0h2v1h-2zm4 0h1v1h-1zm-9 2h1v1H9zm2 0h1v1h-1zm4 0h2v1h-2zm2 0h1v1h-1zm-9 2h2v1H8zm4 0h1v1h-1zm2 0h1v1h-1zm3 0h1v1h-1zm2 0h1v1h-1zm-11 2h1v1H9zm2 0h2v1h-2zm5 0h1v1h-1zm2 0h1v1h-1zm-9 2h1v1H8zm3 0h2v1h-2zm3 0h1v2h-1zm2 0h1v1h-1zm2 0h1v1h-1zm-10 2h1v1H8zm2 0h1v1h-1zm3 0h1v1h-1zm2 0h2v1h-2zm3 0h1v1h-1zm-9 2h1v1H9zm2 0h2v1h-2zm3 0h1v1h-1zm4 0h2v1h-2z" />
                  <path d="M12 8h1v1h-1zm2 0h2v1h-2zm3 0h1v1h-1zm2 0h1v1h-1zm-8 2h1v1h-1zm2 0h1v1h-1zm3 0h2v1h-2zm3 0h1v1h-1zm-9 2h1v1H9zm2 0h2v1h-2zm4 0h1v1h-1zm2 0h1v1h-1zm-9 2h2v1H8zm3 0h1v1h-1zm2 0h2v1h-2zm4 0h1v1h-1zm-9 2h1v1H9zm2 0h1v1h-1zm4 0h2v1h-2zm2 0h1v1h-1zm-9 2h2v1H8zm4 0h1v1h-1zm2 0h1v1h-1zm3 0h1v1h-1zm2 0h1v1h-1zm-11 2h1v1H9zm2 0h2v1h-2zm5 0h1v1h-1zm2 0h1v1h-1z" />
                </svg>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={styles.scanText}>Scan to download</div>
                
                {/* Google Play */}
                <a href="https://play.google.com" target="_blank" rel="noopener noreferrer" className="store-btn-hover" style={{ ...styles.storeBtn, border: '1px solid rgba(255,255,255,0.12)', padding: '6px 14px', borderRadius: '10px' }}>
                  <svg viewBox="0 0 24 24" width="20" height="20" style={{ marginRight: '2px', flexShrink: 0 }}>
                    <path d="M3.609 1.814L13.784 12 3.609 22.186A2.227 2.227 0 0 1 3 20.573V3.427c0-.665.222-1.258.609-1.613z" fill="#00e5ff"/>
                    <path d="M17.447 8.337l-3.663 3.663 3.663 3.663 4.148-2.355c1.196-.68 1.196-1.782 0-2.463l-4.148-2.508z" fill="#ffeb3b"/>
                    <path d="M13.784 12L3.609 1.814a2.03 2.03 0 0 1 .536-.07c.433 0 .857.11 1.25.334l12.052 6.852-3.66 3.07z" fill="#ff1744"/>
                    <path d="M3.609 22.186c-.324-.298-.536-.71-.536-1.18 0-.256.064-.5.176-.714L13.784 12l3.663 3.663-12.052 6.852c-.393.223-.817.334-1.25.334-.194 0-.38-.023-.536-.063z" fill="#00e676"/>
                  </svg>
                  <div>
                    <div style={{ fontSize: '8px', opacity: 0.75, fontWeight: '600', letterSpacing: '0.2px' }}>GET IT ON</div>
                    <div style={{ fontSize: '13px', fontWeight: '800', fontFamily: 'Inter, sans-serif' }}>Google Play</div>
                  </div>
                </a>

                {/* App Store */}
                <a href="https://apple.com/app-store" target="_blank" rel="noopener noreferrer" className="store-btn-hover" style={{ ...styles.storeBtn, border: '1px solid rgba(255,255,255,0.12)', padding: '6px 14px', borderRadius: '10px' }}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style={{ marginRight: '2px', flexShrink: 0, color: '#FFFFFF' }}>
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.5-.64.74-1.2 1.88-1.05 2.99 1.11.09 2.24-.55 3-1.43z"/>
                  </svg>
                  <div>
                    <div style={{ fontSize: '8px', opacity: 0.75, fontWeight: '600', letterSpacing: '0.2px' }}>Download on the</div>
                    <div style={{ fontSize: '13px', fontWeight: '800', fontFamily: 'Inter, sans-serif' }}>App Store</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Basket image center-right */}
            <div style={styles.appBasketSide}>
              <img
                src="https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?auto=format&fit=crop&w=500&q=80"
                alt="Grocery basket"
                style={{ ...styles.appBasketImg, opacity: 0.95, filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.15))' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>

            {/* Exclusive badge */}
            <div className="app-exclusive-glow" style={{ ...styles.appExclusiveBadge, background: 'linear-gradient(135deg, #FFB020 0%, #F59E0B 100%)', border: '1.5px solid rgba(255,255,255,0.1)' }}>
              <div style={styles.appExclusiveLabel}>APP EXCLUSIVE</div>
              <div style={styles.appExclusiveOff}>10%</div>
              <div style={styles.appExclusiveOff2}>OFF</div>
              <div style={{ fontSize: '10px', color: '#FFFFFF', textAlign: 'center', opacity: 0.9, fontWeight: '600' }}>on your first order</div>
            </div>

          </div>
        </div>
      </section>

      {/* POPUPS & GLOBAL OVERLAYS */}
      <PromoPopup />
      <CookieConsent />
    </div>
  );
};

// CSS animations for page
const homePageStyles = `
  .category-card-hover {
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .category-card-hover:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md) !important;
    border-color: var(--color-primary) !important;
  }
  .category-card-hover:hover img {
    transform: scale(1.08);
  }
  
  @keyframes float-y-1 {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  @keyframes float-y-2 {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-12px); }
  }
  
  .floating-card-1 {
    animation: float-y-1 4s ease-in-out infinite;
  }
  .floating-card-2 {
    animation: float-y-2 4.5s ease-in-out infinite;
    animation-delay: 0.5s;
  }
  .floating-card-3 {
    animation: float-y-1 5s ease-in-out infinite;
    animation-delay: 1s;
  }
  
  @keyframes bounce-scale {
    0% { transform: scale(0.85); opacity: 0; }
    70% { transform: scale(1.05); }
    100% { transform: scale(1); opacity: 1; }
  }
  .stat-pop {
    animation: bounce-scale 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.2) forwards;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = homePageStyles;
  document.head.appendChild(styleSheet);
}

const styles = {
  page: {
    paddingBottom: '40px',
  },
  section: {
    padding: '32px 0',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '18px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  centerSectionHeader: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  sectionBadge: {
    fontSize: '11px',
    fontWeight: '800',
    color: 'var(--color-primary-dark)',
    backgroundColor: 'var(--color-primary-light)',
    padding: '4px 10px',
    borderRadius: '6px',
    display: 'inline-block',
    letterSpacing: '1px',
    marginBottom: '8px',
  },
  sectionTitle: {
    fontSize: '28px',
    fontWeight: '800',
    color: 'var(--color-text)',
    letterSpacing: '-0.5px',
  },
  sectionLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--color-primary-dark)',
    cursor: 'pointer',
  },
  
  // HERO STYLING
  heroSection: {
    padding: '64px 0 40px 0',
    backgroundImage: `linear-gradient(90deg, #FAF7F0 0%, #FAF7F0 45%, rgba(250, 247, 240, 0.92) 65%, rgba(250, 247, 240, 0.2) 100%), url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80')`,
    backgroundSize: 'cover',
    backgroundPosition: 'right center',
    borderBottomLeftRadius: '48px',
    borderBottomRightRadius: '48px',
    overflow: 'hidden',
  },
  heroContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '40px',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  heroTextCol: {
    flex: '1 1 500px',
    display: 'flex',
    flexDirection: 'column',
  },
  heroBadge: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    border: '1.5px solid var(--color-border)',
    borderRadius: 'var(--radius-full)',
    padding: '6px 14px',
    fontSize: '11px',
    fontWeight: '800',
    color: 'var(--color-text)',
    width: 'fit-content',
    marginBottom: '24px',
    boxShadow: 'var(--shadow-sm)',
  },
  heroTitle: {
    fontSize: '56px',
    fontWeight: '800',
    lineHeight: '1.1',
    letterSpacing: '-2px',
    color: 'var(--color-text)',
    marginBottom: '20px',
  },
  heroDesc: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: 'var(--color-text-secondary)',
    marginBottom: '32px',
    maxWidth: '520px',
  },
  heroActions: {
    display: 'flex',
    gap: '16px',
    marginBottom: '48px',
    flexWrap: 'wrap',
  },
  heroPrimaryBtn: {
    padding: '16px 32px',
    fontSize: '15px',
    borderRadius: '16px',
    color: '#FFFFFF',
    fontWeight: '800',
  },
  heroSecondaryBtn: {
    padding: '16px 28px',
    fontSize: '15px',
    borderRadius: '16px',
  },
  floatingCardsRow: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  floatingCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#FFFFFF',
    padding: '10px 16px',
    borderRadius: '14px',
    border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-sm)',
    flexGrow: 1,
  },
  floatingIconCircle: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-primary-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  floatingCardTitle: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '800',
    color: 'var(--color-text)',
  },
  floatingCardDesc: {
    display: 'block',
    fontSize: '10px',
    color: 'var(--color-text-secondary)',
  },
  heroImageCol: {
    flex: '1 1 450px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImageBg: {
    position: 'absolute',
    width: '80%',
    height: '80%',
    borderRadius: '50%',
    backgroundColor: 'var(--color-primary-light)',
    filter: 'blur(20px)',
    zIndex: 1,
  },
  heroImage: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '100%',
    maxHeight: '420px',
    objectFit: 'contain',
  },

  // STATS STYLING
  statsSection: {
    backgroundImage: 'linear-gradient(135deg, #0A4D2E 0%, #157A4C 100%)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#FFFFFF',
    padding: '24px 20px',
    position: 'relative',
    zIndex: 10,
    width: '90%',
    margin: '-32px auto 0 auto',
    borderRadius: '24px',
    boxShadow: '0 20px 40px rgba(10, 77, 46, 0.35)',
  },
  statsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px',
  },
  statBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    flex: '1 1 200px',
    justifyContent: 'center',
    padding: '8px 12px',
  },
  statIconCircle: {
    width: '46px',
    height: '46px',
    borderRadius: '14px',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
  },
  statTextGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  statNum: {
    display: 'block',
    fontSize: '32px',
    fontWeight: '900',
    color: 'var(--color-accent)',
    lineHeight: '1.1',
    letterSpacing: '-0.5px',
    textShadow: '0 2px 10px rgba(184, 233, 78, 0.25)',
  },
  statLabel: {
    display: 'block',
    fontSize: '11px',
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.75)',
    textTransform: 'uppercase',
    marginTop: '4px',
    letterSpacing: '0.5px',
  },
  statDivider: {
    width: '1px',
    height: '36px',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignSelf: 'center',
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },

  // CATEGORY GRID
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '12px',
  },
  categoryCard: {
    borderRadius: '16px',
    cursor: 'pointer',
    overflow: 'hidden',
    border: '1.5px solid var(--color-border)',
    backgroundColor: '#FFFFFF',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  },
  categoryImgWrap: {
    position: 'relative',
    height: '100px',
    overflow: 'hidden',
  },
  categoryImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.4s ease',
  },
  categoryImgOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom, transparent 30%, rgba(22,58,53,0.45) 100%)',
  },
  categoryCountBadge: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    backgroundColor: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(4px)',
    color: 'var(--color-primary-dark)',
    fontSize: '10px',
    fontWeight: '800',
    padding: '2px 7px',
    borderRadius: '20px',
  },
  categoryInfo: {
    padding: '10px 12px 12px',
  },
  categoryTitle: {
    fontSize: '13px',
    fontWeight: '800',
    color: 'var(--color-text)',
    lineHeight: '1.2',
  },
  categoryCount: {
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--color-text-secondary)',
    marginTop: '4px',
    textAlign: 'center',
  },

  // FLASH DEALS
  dealsSection: {
    backgroundColor: '#FFF5EC', // Soft Warm Orange background
    padding: '32px 0',
    borderTop: '1px solid #FADFCF',
    borderBottom: '1px solid #FADFCF',
  },
  dealsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 2.5fr',
    gap: '24px',
    '@media (max-width: 1024px)': {
      gridTemplateColumns: '1fr',
    },
  },
  dealsPromoBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingRight: '16px',
  },
  dealBadge: {
    backgroundColor: 'var(--color-orange)',
    color: '#FFFFFF',
    fontSize: '10px',
    fontWeight: '800',
    padding: '4px 10px',
    borderRadius: '6px',
    width: 'fit-content',
    letterSpacing: '1px',
    marginBottom: '16px',
  },
  dealPromoTitle: {
    fontSize: '32px',
    fontWeight: '800',
    color: 'var(--color-text)',
    lineHeight: '1.1',
    marginBottom: '12px',
  },
  dealPromoDesc: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.5',
    marginBottom: '24px',
  },
  timerContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '20px',
  },
  timerBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    border: '1.5px solid #FADFCF',
    borderRadius: '12px',
    width: '56px',
    height: '56px',
    boxShadow: 'var(--shadow-sm)',
  },
  timerVal: {
    fontSize: '18px',
    fontWeight: '800',
    color: 'var(--color-orange)',
  },
  timerUnit: {
    fontSize: '10px',
    fontWeight: '700',
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase',
    marginTop: '-2px',
  },
  timerColon: {
    fontSize: '20px',
    fontWeight: '800',
    color: 'var(--color-orange)',
  },
  viewDealsBtn: {
    width: 'fit-content',
    padding: '12px 24px',
    borderRadius: '12px',
  },
  dealsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    '@media (max-width: 480px)': {
      gridTemplateColumns: '1fr',
    },
  },

  // CAROUSEL TABS
  tabsList: {
    display: 'flex',
    gap: '8px',
    backgroundColor: '#F3F6F4',
    padding: '4px',
    borderRadius: '12px',
    flexWrap: 'wrap',
  },
  tabBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  carouselContainer: {
    display: 'flex',
    gap: '16px',
    overflowX: 'auto',
    paddingBottom: '16px',
    scrollSnapType: 'x mandatory',
  },
  carouselItem: {
    flex: '0 0 calc(20% - 13px)',
    scrollSnapAlign: 'start',
    minWidth: '220px',
  },

  // EDITORIAL PROMOTIONAL BANNER
  promoBanner: {
    display: 'flex',
    backgroundColor: 'var(--color-primary-light)',
    border: '1.5px solid #CBEBD6',
    borderRadius: '32px',
    overflow: 'hidden',
    height: '280px',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      height: 'auto',
    },
  },
  promoBannerTextCol: {
    width: '55%',
    padding: '32px 40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    '@media (max-width: 768px)': {
      width: '100%',
      padding: '32px',
    },
  },
  promoBannerBadge: {
    fontSize: '10px',
    fontWeight: '800',
    color: 'var(--color-primary-dark)',
    letterSpacing: '1px',
    marginBottom: '12px',
  },
  promoBannerTitle: {
    fontSize: '36px',
    fontWeight: '800',
    lineHeight: '1.1',
    color: 'var(--color-text)',
    marginBottom: '16px',
  },
  promoBannerDesc: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.6',
    marginBottom: '18px',
    maxWidth: '460px',
  },
  promoBannerBtn: {
    width: 'fit-content',
    padding: '12px 28px',
    borderRadius: '12px',
  },
  promoBannerImgCol: {
    width: '45%',
    '@media (max-width: 768px)': {
      width: '100%',
      height: '200px',
    },
  },
  promoBannerImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  // WHY FRESHIO GRID
  whyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
    '@media (max-width: 1024px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    '@media (max-width: 600px)': {
      gridTemplateColumns: '1fr',
    },
  },
  whyCard: {
    backgroundColor: '#FFFFFF',
    border: '1.5px solid var(--color-border)',
    borderRadius: '24px',
    padding: '20px 16px',
    textAlign: 'center',
    boxShadow: 'var(--shadow-sm)',
  },
  whyIconWrapper: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    backgroundColor: 'var(--color-primary-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 12px auto',
  },
  whyTitle: {
    fontSize: '16px',
    fontWeight: '800',
    color: 'var(--color-text)',
    marginBottom: '12px',
  },
  whyDesc: {
    fontSize: '13px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.5',
  },

  // FRESHIO MEMBERSHIP CAROUSEL
  membershipCard: {
    display: 'flex',
    flexDirection: 'row-reverse',
    borderRadius: '28px',
    overflow: 'hidden',
    height: '320px',
    boxShadow: '0 20px 60px rgba(22,58,53,0.18)',
  },
  membershipImageSide: {
    width: '40%',
    position: 'relative',
    flexShrink: 0,
  },
  memberImgOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to right, rgba(22,58,53,0.5) 0%, transparent 60%)',
  },
  memberPricePill: {
    position: 'absolute',
    bottom: '20px',
    left: '20px',
    backgroundColor: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.3)',
    color: '#FFFFFF',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '800',
  },
  membershipImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  membershipContent: {
    flex: 1,
    padding: '32px 36px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: 'background-color 0.6s ease',
    color: '#FFFFFF',
  },
  membershipLogoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  memberLogoBadge: {
    backgroundColor: 'var(--color-accent)',
    color: '#FFFFFF',
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '800',
  },
  memberLogoText: {
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '1.5px',
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
  },
  memberCarouselBody: {
    animation: 'fadeInUp 0.4s ease-out forwards',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 0',
  },
  memberBenefitIcon: {
    fontSize: '36px',
    marginBottom: '4px',
  },
  membershipTitle: {
    fontSize: '24px',
    fontWeight: '800',
    lineHeight: '1.15',
    color: '#FFFFFF',
    margin: 0,
  },
  membershipDesc: {
    fontSize: '13.5px',
    color: 'rgba(255,255,255,0.8)',
    lineHeight: '1.5',
    margin: 0,
    maxWidth: '480px',
  },
  memberDots: {
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
    marginBottom: '4px',
  },
  memberDot: {
    height: '8px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    transition: 'all 0.3s ease',
  },
  membershipBtn: {
    padding: '11px 24px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '700',
    width: 'fit-content',
  },
  alreadyMemberBlock: {
    backgroundColor: 'rgba(32, 184, 107, 0.2)',
    border: '1.5px solid rgba(32,184,107,0.5)',
    color: '#7FFFC0',
    padding: '10px 20px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '8px',
    width: 'fit-content',
  },
  activeCheck: {
    marginRight: '8px',
  },
  leaveMemberBtn: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.5)',
    textDecoration: 'underline',
    cursor: 'pointer',
    marginLeft: '16px',
  },
  // Old list styles kept for safety
  memberBenefitsList: { display: 'none' },
  benefitItem: { display: 'none' },

  // TRUST STRIP
  trustStrip: {
    backgroundColor: '#FFFFFF',
    borderTop: '1px solid var(--color-border)',
    borderBottom: '1px solid var(--color-border)',
    padding: '20px 0',
    margin: '0 0 0 0',
  },
  trustGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    alignItems: 'center',
  },
  trustItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  trustIconBox: {
    width: '52px',
    height: '52px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  trustTitle: {
    fontSize: '14px',
    fontWeight: '800',
    color: 'var(--color-text)',
    marginBottom: '3px',
  },
  trustDesc: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.4',
  },

  // 3 WIDGET CARDS
  widgetRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    alignItems: 'stretch',
  },
  widgetCard: {
    backgroundColor: '#FFFFFF',
    border: '1.5px solid var(--color-border)',
    borderRadius: '20px',
    padding: '20px',
    display: 'flex',
    gap: '12px',
    alignItems: 'stretch',
    overflow: 'hidden',
    position: 'relative',
    minHeight: '170px',
  },
  widgetTitle: {
    fontSize: '16px',
    fontWeight: '800',
    color: 'var(--color-text)',
    marginBottom: '4px',
  },
  widgetDesc: {
    fontSize: '12.5px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.4',
    marginBottom: '14px',
  },
  widgetBtn: {
    fontSize: '13px',
    fontWeight: '700',
    padding: '8px 18px',
    borderRadius: '10px',
  },
  miniProductRow: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
  },
  miniProductChip: {
    width: '36px',
    height: '36px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
  },
  widgetImgRight: {
    width: '110px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  widgetImg: {
    width: '100%',
    height: 'auto',
    maxHeight: '120px',
    objectFit: 'contain',
  },
  rewardsLabel: {
    fontSize: '16px',
    fontWeight: '800',
    color: '#78350F',
    fontStyle: 'italic',
    marginBottom: '2px',
  },
  rewardsPts: {
    fontSize: '32px',
    fontWeight: '900',
    color: '#92400E',
    lineHeight: '1.1',
    marginBottom: '12px',
  },
  rewardsBtn: {
    backgroundColor: '#F59E0B',
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: '13px',
    padding: '9px 20px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
  },
  chatNowBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    border: '2px solid var(--color-border)',
    borderRadius: '12px',
    padding: '9px 18px',
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--color-text)',
    marginTop: '8px',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
  },

  // APP DOWNLOAD BANNER
  appBannerSection: {
    margin: '24px 0 0 0',
  },
  appBannerInner: {
    backgroundColor: '#163A35',
    borderRadius: '24px',
    padding: '32px 36px',
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
    overflow: 'hidden',
    position: 'relative',
    minHeight: '160px',
  },
  appPhoneSide: {
    width: '90px',
    flexShrink: 0,
  },
  appPhoneImg: {
    width: '90px',
    height: '130px',
    objectFit: 'cover',
    borderRadius: '16px',
    border: '3px solid rgba(255,255,255,0.15)',
  },
  appBannerText: {
    flex: 1,
    minWidth: 0,
  },
  appBannerTitle: {
    fontSize: '22px',
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: '1.2',
    marginBottom: '8px',
  },
  appBannerDesc: {
    fontSize: '12.5px',
    color: 'rgba(255,255,255,0.7)',
    lineHeight: '1.5',
    maxWidth: '260px',
  },
  appStoreBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    flexShrink: 0,
  },
  qrCodeBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrPattern: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  scanText: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: '4px',
  },
  storeBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#000000',
    color: '#FFFFFF',
    borderRadius: '8px',
    padding: '7px 14px',
    textDecoration: 'none',
    fontSize: '13px',
  },
  appBasketSide: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    maxWidth: '200px',
    overflow: 'hidden',
  },
  appBasketImg: {
    width: '100%',
    height: '160px',
    objectFit: 'cover',
    objectPosition: 'center top',
    borderRadius: '12px',
    opacity: 0.9,
  },
  appExclusiveBadge: {
    backgroundColor: '#F59E0B',
    borderRadius: '16px',
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    minWidth: '110px',
  },
  appExclusiveLabel: {
    fontSize: '9px',
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  appExclusiveOff: {
    fontSize: '36px',
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: '1',
  },
  appExclusiveOff2: {
    fontSize: '20px',
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: '1',
    marginBottom: '2px',
  },
  // STORES INTERACTIVE BLOCK
  storesBlock: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 1fr',
    gap: '32px',
    alignItems: 'stretch',
    '@media (max-width: 900px)': {
      gridTemplateColumns: '1fr',
    },
  },
  storesListCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxHeight: '440px',
    overflowY: 'auto',
    paddingRight: '8px',
  },
  storePreviewCard: {
    padding: '16px',
    border: '2px solid',
    borderRadius: '16px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.2s',
  },
  storeCardInfo: {
    flexGrow: 1,
    paddingRight: '12px',
  },
  storeName: {
    fontSize: '15px',
    fontWeight: '800',
    color: 'var(--color-text)',
  },
  storeAddress: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    marginTop: '4px',
    lineHeight: '1.4',
  },
  storeTimingRow: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
    fontWeight: '700',
    marginTop: '8px',
    color: 'var(--color-text)',
  },
  storeDistance: {
    marginLeft: '6px',
    color: 'var(--color-primary-dark)',
  },
  servicesGrid: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
    marginTop: '10px',
  },
  serviceBadge: {
    fontSize: '9px',
    fontWeight: '800',
    backgroundColor: '#F3F6F4',
    color: 'var(--color-text-secondary)',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  storeViewBtn: {
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--color-primary-dark)',
    backgroundColor: '#FFFFFF',
    border: '1.5px solid var(--color-primary)',
    borderRadius: '8px',
    padding: '8px 12px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  mockMapCol: {
    border: '1.5px solid var(--color-border)',
    borderRadius: '24px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    height: '440px',
    backgroundColor: '#EDF5F1',
    boxShadow: 'var(--shadow-sm)',
  },
  mapHeader: {
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid var(--color-border)',
    padding: '12px 18px',
    fontSize: '12px',
    fontWeight: '800',
    color: 'var(--color-text-secondary)',
    display: 'flex',
    alignItems: 'center',
  },
  mapCanvas: {
    flexGrow: 1,
    position: 'relative',
  },
  mapOverlayCard: {
    position: 'absolute',
    bottom: '16px',
    left: '16px',
    right: '16px',
    backgroundColor: '#FFFFFF',
    border: '1px solid var(--color-border)',
    borderRadius: '14px',
    padding: '12px',
    boxShadow: 'var(--shadow-md)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    animation: 'fadeInUp 0.3s ease-out',
  },
  mapOverlayImg: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    objectFit: 'cover',
  },
  mapOverlayTitle: {
    fontSize: '13px',
    fontWeight: '800',
    margin: 0,
  },
  mapOverlayDist: {
    fontSize: '10px',
    color: 'var(--color-primary-dark)',
    fontWeight: '700',
    margin: '2px 0 0 0',
  },
  mapOverlayAddr: {
    fontSize: '10px',
    color: 'var(--color-text-secondary)',
    display: 'block',
  },
  mapOverlayBtn: {
    width: '100%',
    backgroundColor: 'var(--color-primary)',
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: '11px',
    padding: '6px',
    borderRadius: '6px',
    cursor: 'pointer',
    textAlign: 'center',
  },

  // HOW IT WORKS
  howSection: {
    backgroundColor: '#FAFCFB',
    padding: '72px 0',
    borderTop: '1px solid var(--color-border)',
    borderBottom: '1px solid var(--color-border)',
  },
  howSubtitle: {
    fontSize: '15px',
    color: 'var(--color-text-secondary)',
    marginTop: '8px',
  },
  howGrid: {
    display: 'flex',
    gap: '0',
    alignItems: 'stretch',
    marginTop: '48px',
    '@media (max-width: 900px)': {
      flexDirection: 'column',
    },
  },
  howStepWrapper: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },
  howStep: {
    flex: 1,
    padding: '32px 28px',
    borderRadius: '20px',
    border: '2px solid transparent',
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
    position: 'relative',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  howStepNumBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    color: '#FFFFFF',
    fontSize: '13px',
    fontWeight: '800',
    marginBottom: '20px',
  },
  howStepTitle: {
    fontSize: '17px',
    fontWeight: '800',
    marginBottom: '10px',
  },
  howStepDesc: {
    fontSize: '13.5px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.6',
  },
  howConnector: {
    fontSize: '24px',
    color: 'var(--color-border)',
    flexShrink: 0,
    padding: '0 4px',
    fontWeight: '800',
    userSelect: 'none',
  },
};

export default Home;

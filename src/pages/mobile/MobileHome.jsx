import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PRODUCTS } from '../../data/mockData'; 
import { Logo } from '../../components/Logo';

export const MobileHome = () => {
  const navigate = useNavigate();
  const {
    addToCart,
    wishlist,
    toggleWishlist,
    cart,
    user
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);
  
  // Track adding state of product IDs for active click feedback
  const [addingIds, setAddingIds] = useState(new Set());

  // Auto carousel slideshow timer (4 seconds per slide)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/mobile/shop?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const isWishlisted = (id) => wishlist.includes(id);

  const handleAddToCartFeedback = (e, prod) => {
    e.stopPropagation();
    addToCart(prod, 1);
    
    // Add ID to adding list
    setAddingIds((prev) => {
      const next = new Set(prev);
      next.add(prod.id);
      return next;
    });

    // Remove ID from adding list after 1.2 seconds
    setTimeout(() => {
      setAddingIds((prev) => {
        const next = new Set(prev);
        next.delete(prod.id);
        return next;
      });
    }, 1200);
  };

  // Dynamically load the first 8 featured/best-rated organic or fresh produce products from the products database
  const dynamicFeaturedProducts = useMemo(() => {
    const db = PRODUCTS || [];
    // Sort so featured, discounted, or highly rated items appear first
    const list = [...db].sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      if (a.discount > b.discount) return -1;
      if (a.discount < b.discount) return 1;
      return b.rating - a.rating;
    });
    return list.slice(0, 10);
  }, []);

  // Curated category items with high-resolution Unsplash images and light HSL colors
  const mockupCategories = [
    {
      name: 'Fruits',
      slug: 'fresh-produce',
      img: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=150&h=150&q=80',
      bgColor: '#FFEAEB'
    },
    {
      name: 'Vegetables',
      slug: 'fresh-produce',
      img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=150&h=150&q=80',
      bgColor: '#EAF8F0'
    },
    {
      name: 'Meat',
      slug: 'meat-fish',
      img: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=150&h=150&q=80',
      bgColor: '#FFF3EC'
    },
    {
      name: 'Dairy',
      slug: 'dairy',
      img: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=150&h=150&q=80',
      bgColor: '#E6F4FF'
    },
    {
      name: 'Bakery',
      slug: 'groceries',
      img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=150&h=150&q=80',
      bgColor: '#FEF8EB'
    }
  ];

  // Slide structures
  const promoSlides = [
    {
      badge: 'Limited Offer',
      badgeColor: '#FF9F43',
      title: '20% Off\nFresh Veggies',
      sub: 'Grab them while they last!',
      bg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCY9wGF-IARtONByNd8uVzRT-XBNDvhc4MTXF9SkuuChAYXeTXYp-EM6lq6lWyQ5xqnk93hoek6-BZxGadZ8FjhHNZVA3W7WSXmGmPQZ8kbFc-AnZxC5NBrbl2_IBjnfxCjfFkYLeKw5Gg-BPNCebHNMsr_st9laECat5xJF0MCH21MG0N29JD9XWuLqW_UHCA_6TVIhMGfI7x-WX1E0qyrqGjKs9_FuXnFm2fJb9J93kQUvv_pDr-zLg',
      overlay: 'linear-gradient(to right, rgba(109, 221, 138, 0.95), rgba(109, 221, 138, 0.2))',
      textColor: '#00210b',
      subColor: 'rgba(0, 33, 11, 0.8)'
    },
    {
      badge: 'New Arrival',
      badgeColor: '#61B478',
      title: 'Seasonal\nFruits Box',
      sub: 'Delivered to your door',
      bg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHEO1SU33Id7i3Xn-gTlOy86wFTZeZ3fcigkUF-FEP0OztJUwN9TWTVMtkPPqII80baLTeEml7oJhOSrxVXGdw9tEz1q9vw4tQhpBt360AZuP85ES0Ext1AVk4SbhsZmKo-D64q2SCgkz0i2Ur1dY5v5Lm8Qj2jF9aTfMKOryvnbhrkM4ab4NXd4Z2dEocRIUY-CJ8aYLeo__64WcCLd1bg4HqgT5DoqRCjtr-pQ_p8hYMwydh-oYi-Q',
      overlay: 'linear-gradient(to right, rgba(193, 231, 224, 0.95), rgba(193, 231, 224, 0.2))',
      textColor: '#466963',
      subColor: 'rgba(70, 105, 99, 0.8)'
    },
    {
      badge: 'Local Farm',
      badgeColor: '#006b32',
      title: 'Artisan\nDairy',
      sub: 'Taste the difference',
      bg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTGvq2sCzXXW74OACCmGdnpPNSCxix3SCzjwtklIpjFz56Fs_DCUrDLo132sAgUJ6JOfm8FrLdGRA142CT29ndJw8QwJyWsj9_V0oPLYdFEvokYInx77p_4vwrm-CJbMNa9qvT9nY1quu66JWy0l41kV8-MzWwNhSLT_gy4flIUsG-Bjkk2dYUYrbi6MPZrJ2PDIN_KPHQhR-4gbIPmKC28NF9UBjJxVxOYngqnu7ykvqsig9exzeCnQ',
      overlay: 'linear-gradient(to right, rgba(186, 203, 190, 0.95), rgba(186, 203, 190, 0.2))',
      textColor: '#111e16',
      subColor: 'rgba(17, 30, 22, 0.8)'
    }
  ];

  return (
    <div style={styles.container} className="app-home-canvas animate-fade-in">
      {/* Sticky App Header */}
      <header style={styles.header}>
        <div style={styles.headerTopRow}>
          <div style={styles.headerLeft}>
            <Logo height={30} />
          </div>
          <div style={styles.headerRight}>
            <div style={styles.cartIconWrapper} onClick={() => navigate('/mobile/cart')}>
              <button style={styles.iconBtn} className="header-cart-icon-btn">
                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>shopping_cart</span>
              </button>
              {getCartCount() > 0 && (
                <span style={styles.cartBadge} className="animate-pop">{getCartCount()}</span>
              )}
            </div>
            <img
              alt="Profile"
              style={styles.profileAvatar}
              src={user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80'}
              onClick={() => navigate('/mobile/account')}
              className="header-avatar"
            />
          </div>
        </div>
        <form onSubmit={handleSearchSubmit} style={styles.searchContainer}>
          <span className="material-symbols-outlined" style={styles.searchIcon}>search</span>
          <input
            style={styles.searchInput}
            placeholder="Search organic produce..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </header>

      {/* Main Content Area */}
      <main style={styles.mainCanvas}>
        {/* Promotional Carousel Section */}
        <section style={styles.promoSection}>
          <div style={styles.promoCarouselContainer} className="promo-depth-shadow">
            <div
              style={{
                ...styles.promoFlexRow,
                transform: `translateX(-${activeSlide * 100}%)`,
              }}
            >
              {promoSlides.map((slide, index) => (
                <div key={index} style={styles.promoCard}>
                  <div
                    style={{
                      ...styles.promoBg,
                      backgroundImage: `url('${slide.bg}')`,
                    }}
                    className="promo-image-zoom"
                  />
                  <div style={{ ...styles.promoOverlay, background: slide.overlay }}>
                    <span style={{ ...styles.promoBadge, backgroundColor: slide.badgeColor }}>
                      {slide.badge}
                    </span>
                    <h2 style={{ ...styles.promoTitle, color: slide.textColor }}>
                      {slide.title.split('\n')[0]}<br />{slide.title.split('\n')[1]}
                    </h2>
                    <p style={{ ...styles.promoSubText, color: slide.subColor }}>
                      {slide.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Slide Dots Indicator */}
            <div style={styles.dotsRow}>
              {promoSlides.map((_, index) => (
                <div
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  style={{
                    ...styles.dot,
                    backgroundColor: activeSlide === index ? '#006b32' : 'rgba(0, 0, 0, 0.15)',
                    width: activeSlide === index ? '16px' : '6px',
                  }}
                  className="carousel-dot-indicator"
                />
              ))}
            </div>
          </div>
        </section>

        {/* Redesigned Premium Category Cards */}
        <section style={styles.section} className="section-categories">
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Categories</h3>
            <button style={styles.seeAllBtn} onClick={() => navigate('/mobile/shop')}>See All</button>
          </div>
          <div style={styles.categoryScroll}>
            {mockupCategories.map((cat, idx) => (
              <button
                key={idx}
                style={{
                  ...styles.categoryCard,
                  backgroundColor: cat.bgColor,
                  animationDelay: `${idx * 0.05}s`
                }}
                onClick={() => navigate(`/mobile/category/${cat.slug}`)}
                className="category-interactive-card"
              >
                <img src={cat.img} alt={cat.name} style={styles.categoryImg} />
                <span style={styles.categoryLabel}>{cat.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Featured Products Section */}
        <section style={{ ...styles.section, paddingBottom: '20px' }}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Featured Fresh</h3>
            <button style={styles.seeAllBtn} onClick={() => navigate('/mobile/shop')}>View All</button>
          </div>
          <div style={styles.grid}>
            {dynamicFeaturedProducts.map((prod, idx) => {
              const wishlisted = isWishlisted(prod.id);
              const isAdding = addingIds.has(prod.id);
              
              return (
                <div 
                  key={prod.id} 
                  style={{
                    ...styles.productCard,
                    animationDelay: `${idx * 0.08}s`
                  }}
                  className="product-card-staggered"
                >
                  {/* Heart Wishlist Trigger */}
                  <button
                    style={{
                      ...styles.heartBtn,
                      color: wishlisted ? '#FF5A5F' : '#3e4a3f',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(prod.id);
                    }}
                    className="card-heart-btn"
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontSize: '20px',
                        fontVariationSettings: wishlisted ? "'FILL' 1" : "'FILL' 0"
                      }}
                    >
                      favorite
                    </span>
                  </button>

                  {/* Top Left Badges */}
                  {prod.discount > 0 ? (
                    <span style={{ ...styles.cardBadge, backgroundColor: '#FF9F43' }} className="animate-pop">
                      -{prod.discount}%
                    </span>
                  ) : prod.isFeatured ? (
                    <span style={{ ...styles.cardBadge, backgroundColor: '#61B478' }} className="animate-pop">
                      Organic
                    </span>
                  ) : null}

                  {/* Image wrapper */}
                  <div
                    style={styles.cardImgWrapper}
                    onClick={() => navigate(`/mobile/product/${prod.id}`)}
                    className="card-image-glow-wrapper"
                  >
                    <img src={prod.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80'} alt={prod.name} style={styles.cardImg} className="card-product-img" />
                  </div>

                  {/* Card Info */}
                  <div style={styles.cardInfo}>
                    <h4
                      style={styles.prodName}
                      onClick={() => navigate(`/mobile/product/${prod.id}`)}
                    >
                      {prod.name}
                    </h4>
                    <p style={styles.prodUnit}>{prod.unit || '1 unit'}</p>

                    <div style={styles.priceRow}>
                      <div style={styles.priceCol}>
                        <span style={styles.priceVal}>{prod.price} RWF</span>
                        {prod.originalPrice > prod.price && (
                          <span style={styles.wasPriceVal}>{prod.originalPrice} RWF</span>
                        )}
                      </div>
                      
                      {/* Plus button with spring scale feedback */}
                      <button
                        style={{
                          ...styles.addBtn,
                          backgroundColor: isAdding ? '#20B86B' : '#006b32',
                          transform: isAdding ? 'scale(1.15) rotate(90deg)' : 'scale(1)',
                          boxShadow: isAdding ? '0 6px 16px rgba(32, 184, 107, 0.4)' : '0 4px 12px rgba(39, 158, 83, 0.2)'
                        }}
                        onClick={(e) => handleAddToCartFeedback(e, prod)}
                        aria-label="Add to cart"
                      >
                        {isAdding ? (
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check</span>
                        ) : (
                          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#fbf9f3',
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    width: '100%',
  },
  header: {
    position: 'sticky',
    top: 0,
    width: '100%',
    zIndex: 50,
    backgroundColor: 'rgba(251, 249, 243, 0.85)',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 1px 8px rgba(0,0,0,0.03)',
    paddingTop: 'env(safe-area-inset-top)',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    paddingBottom: '8px',
  },
  headerTopRow: {
    height: '52px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  iconBtn: {
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#3e4a3f',
    outline: 'none',
  },
  cartIconWrapper: {
    position: 'relative',
    cursor: 'pointer',
  },
  cartBadge: {
    position: 'absolute',
    top: '6px',
    right: '6px',
    width: '16px',
    height: '16px',
    backgroundColor: '#FF5A5F',
    color: '#FFFFFF',
    fontSize: '9px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    border: '1.5px solid #ffffff',
  },
  profileAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    objectFit: 'cover',
    cursor: 'pointer',
    border: '2px solid rgba(0, 107, 50, 0.1)',
  },
  searchContainer: {
    position: 'relative',
    margin: '4px 20px 8px 20px',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#3e4a3f',
  },
  searchInput: {
    width: '100%',
    height: '40px',
    paddingLeft: '40px',
    paddingRight: '16px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E8ECE9',
    borderRadius: '10px',
    fontSize: '14px',
    color: '#1b1c19',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)',
    transition: 'all 0.3s ease',
  },
  mainCanvas: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  promoSection: {
    padding: '0 20px',
    marginTop: '12px',
  },
  promoCarouselContainer: {
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
    borderRadius: '16px',
  },
  promoFlexRow: {
    display: 'flex',
    width: '100%',
    transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  promoCard: {
    width: '100%',
    height: '160px',
    position: 'relative',
    overflow: 'hidden',
    flexShrink: 0,
  },
  promoBg: {
    position: 'absolute',
    inset: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  promoOverlay: {
    position: 'absolute',
    inset: 0,
    padding: '18px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    boxSizing: 'border-box',
    zIndex: 2,
  },
  promoBadge: {
    alignSelf: 'flex-start',
    padding: '3px 8px',
    borderRadius: '5px',
    fontSize: '9px',
    fontWeight: '800',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '8px',
  },
  promoTitle: {
    fontSize: '18px',
    fontWeight: '800',
    lineHeight: '1.25',
    marginBottom: '4px',
    fontFamily: 'var(--font-sans)',
  },
  promoSubText: {
    fontSize: '11px',
    fontWeight: '600',
  },
  dotsRow: {
    position: 'absolute',
    bottom: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
    zIndex: 10,
  },
  dot: {
    height: '6px',
    borderRadius: '3px',
    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    cursor: 'pointer',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: '0 20px',
    marginBottom: '16px',
  },
  sectionTitle: {
    fontSize: '15px',
    fontWeight: '800',
    color: '#1b1c19',
  },
  seeAllBtn: {
    fontSize: '12px',
    fontWeight: '800',
    color: '#006b32',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    outline: 'none',
  },
  categoryScroll: {
    display: 'flex',
    overflowX: 'auto',
    gap: '14px',
    padding: '0 20px 12px 20px',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    }
  },
  categoryCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '84px',
    height: '110px',
    borderRadius: '16px',
    flexShrink: 0,
    border: '1.5px solid rgba(0, 0, 0, 0.02)',
    boxShadow: '0 4px 12px rgba(23,37,31,0.02)',
    cursor: 'pointer',
    outline: 'none',
    boxSizing: 'border-box',
    padding: '8px',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  categoryImg: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    objectFit: 'cover',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
    transition: 'transform 0.3s ease',
  },
  categoryLabel: {
    fontSize: '11px',
    fontWeight: '800',
    color: '#1b1c19',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
    padding: '0 20px',
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '12px',
    boxShadow: '0 4px 16px rgba(23,37,31,0.03)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    boxSizing: 'border-box',
    animation: 'fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
  },
  heartBtn: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none',
  },
  cardBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    color: '#FFFFFF',
    fontSize: '9px',
    fontWeight: 'bold',
    padding: '3px 7px',
    borderRadius: '5px',
    zIndex: 10,
    letterSpacing: '0.5px',
  },
  cardImgWrapper: {
    width: '100%',
    aspectRatio: '1/1',
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: '#f5f3ee',
    marginBottom: '12px',
    position: 'relative',
  },
  cardImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease',
  },
  cardInfo: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  prodName: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#1b1c19',
    marginBottom: '4px',
    cursor: 'pointer',
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  prodUnit: {
    fontSize: '11px',
    color: '#3e4a3f',
    marginBottom: '8px',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  priceCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  priceVal: {
    fontSize: '14px',
    fontWeight: '800',
    color: '#1b1c19',
  },
  wasPriceVal: {
    fontSize: '10px',
    color: '#3e4a3f',
    textDecoration: 'line-through',
    textDecorationColor: '#FF5A5F',
  },
  addBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer',
    outline: 'none',
  }
};

// Inject CSS style rules
if (typeof document !== 'undefined') {
  const styleId = 'mobile-premium-home-animations';
  if (!document.getElementById(styleId)) {
    const styleSheet = document.createElement('style');
    styleSheet.id = styleId;
    styleSheet.textContent = `
      @keyframes fadeInUp {
        0% { opacity: 0; transform: translateY(16px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      @keyframes popIn {
        0% { transform: scale(0.85); opacity: 0; }
        80% { transform: scale(1.1); }
        100% { transform: scale(1); opacity: 1; }
      }
      
      .animate-fade-in {
        animation: fadeInUp 0.5s ease-out both;
      }
      .animate-pop {
        animation: popIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
      }
      
      /* Card Hover/Tap Zoom effects */
      .product-card-staggered:active {
        transform: scale(0.97);
        box-shadow: 0 2px 8px rgba(23,37,31,0.02) !important;
      }
      .product-card-staggered:hover .card-product-img {
        transform: scale(1.06);
      }
      
      /* Category interactive cards */
      .category-interactive-card {
        animation: fadeInUp 0.5s ease-out both;
      }
      .category-interactive-card:active {
        transform: scale(0.95);
      }
      .category-interactive-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06) !important;
      }
      .category-interactive-card:hover .category-card-img {
        transform: scale(1.08) rotate(2deg);
      }
      
      /* Image Zoom details in slider */
      .promo-image-zoom {
        animation: slowBgZoom 20s infinite alternate ease-in-out;
      }
      @keyframes slowBgZoom {
        0% { transform: scale(1); }
        100% { transform: scale(1.12); }
      }
      
      /* Shadow depth enhancements */
      .promo-depth-shadow {
        box-shadow: 0 8px 24px rgba(23,37,31,0.12), inset 0 0 40px rgba(0,0,0,0.05);
      }
      
      /* Focused Search inputs */
      .searchInput:focus {
        border-color: var(--color-primary) !important;
        box-shadow: 0 4px 12px rgba(0,107,50,0.04), inset 0 1px 3px rgba(0,0,0,0.01) !important;
      }
    `;
    document.head.appendChild(styleSheet);
  }
}

export default MobileHome;

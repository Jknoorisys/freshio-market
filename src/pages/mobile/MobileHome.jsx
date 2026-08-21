import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PRODUCTS } from '../../data/mockData'; // Direct mockData import to fix missing products
import { Logo } from '../../components/Logo'; // Import custom Logo branding

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

  // Category circles data mapped directly from your design template
  const mockupCategories = [
    {
      name: 'Fruits',
      slug: 'fresh-produce',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFGRs4C_-UvrmyLKM4fxerphyp5mFbzK5J1IxNwSnBQ6ivHRpkzzzYOn5Y9Ct6rOX8-ETqRk65rafHHHZAxm7svKjQ2T5kQO55K7k8jC2jIj4cmkHvGYVxvHu7UsonwWAZyphMYd-J5yUS_vSJei0BE4dGM2lsjo_miFHoGJahwAHxv-fiTEZS7NW8b-A-iW12nfI44O10DkEnubcS_aiI94zvon7mqE7ZwKcNrnVHQlIyuMT4DTc-kw',
    },
    {
      name: 'Vegetables',
      slug: 'fresh-produce',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCz7OJ_oGZAdhXTNlKB3rbNs0T3WxlgosOVEle_quuSEPHSe-V1zbCa8B2d8icvYEZrw2KnpR1XigE1CVmJosWxYmVDmHz1Hd5msNOGE_PNbMUKk_ITTU6CjQfrHmzkVWqzegMb-HKCRbumpsNp3mgXKnOCMcmKZ4ZW1n3xuurwxjhDcHTgUJWNrDHj3Y17JPzd9wQA70mWhzybAot7W7DKvTeABYFDPG9zzZ4UHI1o4agD7bnTk75MvA',
    },
    {
      name: 'Meat',
      slug: 'meat-fish',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRGNBgnP9yiXxadkL9VKd_pFuwXA3zg33Sw3K3IFT8M33sP24B3AJ6Plk1D7hnbZuFbtkiNmmtRpNlJx-KMXVD1igWFOrvDB2zdYF59ZyR0DP_kGDKvBfjygJF5PjhrtNd7mOdbk6sjANExJfh_fKRdriMkVsVAKqibOgz7UZS3qUi4UPEC_DqouyyloidSnTd-bwj_zTQcSbxXsQYKQfW7tplHSuvUf_evoXcktlpjch1BqkzukyuBQ',
    },
    {
      name: 'Dairy',
      slug: 'dairy',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANiUahGVX8Y2NHXPKkoYff70AxoVSllfzm0NpERCuJ1oiGSlUh5wXKgSu2F_NtvSbhsA8rZrnrQfb9urBYLe-hnTp7D7wu-13PpJ1NqsMtYZwj0zmiIs2vY1Usz0VrbEUesAV7HAeUMb3ebecP3iQqBy-9Rdq75Q28AYLV17CQa9FHl9SqSJTnGWvgdwNXacpt5NEdQ5u5tPh4cTjxuv6kFT7hg1-BxRN5vXP_DgyZZrITHbXEgPr1Ng',
    },
    {
      name: 'Bakery',
      slug: 'groceries',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4vuTcJvVMJ_vGBUmuxqiiZhKe6nLMUC6knCaoqvNKzz57C7dxmAoB5R0SWU4Ezz2QuA8-JnapB2oLwymID2ykXvp8O6BkwYZkTeultuNmjEdgQYWjp7rEam5vgD5jh040PNrrBCr6F1tMA6_DzfnkAXG2EIbH0cnvt1hDLyUDbFo4OrNOinJtoYnfnweQFvZVUwDbhiKh255_CgLugIynxjWdCTVmKWL7TXTdH9GeJYgVaVWjnRNbOA',
    }
  ];

  // Static Slide structures
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
    <div style={styles.container}>
      {/* Sticky App Header */}
      <header style={styles.header}>
        <div style={styles.headerTopRow}>
          <div style={styles.headerLeft}>
            <Logo height={30} />
          </div>
          <div style={styles.headerRight}>
            <div style={styles.cartIconWrapper} onClick={() => navigate('/mobile/cart')}>
              <button style={styles.iconBtn}>
                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>shopping_cart</span>
              </button>
              {getCartCount() > 0 && (
                <span style={styles.cartBadge}>{getCartCount()}</span>
              )}
            </div>
            <img
              alt="Profile"
              style={styles.profileAvatar}
              src={user?.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=FreshioGuest'}
              onClick={() => navigate('/mobile/account')}
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
        {/* Promotional Carousel Section (Auto Slide Carousel) */}
        <section style={styles.promoSection}>
          <div style={styles.promoCarouselContainer}>
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
                />
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Categories</h3>
            <button style={styles.seeAllBtn} onClick={() => navigate('/mobile/shop')}>See All</button>
          </div>
          <div style={styles.categoryScroll}>
            {mockupCategories.map((cat, idx) => (
              <button
                key={idx}
                style={styles.categoryButton}
                onClick={() => navigate(`/mobile/category/${cat.slug}`)}
              >
                <div style={styles.categoryCircle}>
                  <img src={cat.img} alt={cat.name} style={styles.categoryImg} />
                </div>
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
            {dynamicFeaturedProducts.map((prod) => {
              const wishlisted = isWishlisted(prod.id);
              return (
                <div key={prod.id} style={styles.productCard}>
                  {/* Heart Wishlist Trigger */}
                  <button
                    style={{
                      ...styles.heartBtn,
                      color: wishlisted ? '#FF5A5F' : '#3e4a3f'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(prod.id);
                    }}
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
                    <span style={{ ...styles.cardBadge, backgroundColor: '#FF9F43' }}>
                      -{prod.discount}%
                    </span>
                  ) : prod.isFeatured ? (
                    <span style={{ ...styles.cardBadge, backgroundColor: '#61B478' }}>
                      Organic
                    </span>
                  ) : null}

                  {/* Image wrapper */}
                  <div
                    style={styles.cardImgWrapper}
                    onClick={() => navigate(`/mobile/product/${prod.id}`)}
                  >
                    <img src={prod.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80'} alt={prod.name} style={styles.cardImg} />
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
                      <button
                        style={styles.addBtn}
                        onClick={() => addToCart(prod, 1)}
                        aria-label="Add to cart"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
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
    backgroundColor: '#fbf9f3', // surface color variable matching bg
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
    backgroundColor: 'rgba(251, 249, 243, 0.8)',
    backdropFilter: 'blur(16px)',
    boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
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
  menuBtn: {
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '-8px',
    color: '#3e4a3f',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  logoText: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#006b32', // primary brand color
    fontFamily: 'var(--font-sans)',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
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
    backgroundColor: '#FF5A5F', // error-red
    color: '#FFFFFF',
    fontSize: '10px',
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
    borderRadius: '8px',
    fontSize: '14px',
    color: '#1b1c19',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
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
    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
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
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    boxSizing: 'border-box',
  },
  promoBadge: {
    alignSelf: 'flex-start',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
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
    bottom: '8px',
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
    transition: 'all 0.3s ease',
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
  },
  categoryScroll: {
    display: 'flex',
    overflowX: 'auto',
    gap: '16px',
    padding: '0 20px 8px 20px',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    }
  },
  categoryButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
  },
  categoryCircle: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    backgroundColor: '#FFFFFF',
    boxShadow: '0 4px 12px rgba(23,37,31,0.04)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.15s',
  },
  categoryImg: {
    width: '40px',
    height: '40px',
    objectFit: 'contain',
    mixBlendMode: 'multiply',
  },
  categoryLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#3e4a3f',
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
    boxShadow: '0 4px 16px rgba(23,37,31,0.04)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    boxSizing: 'border-box',
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
  },
  cardBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    color: '#FFFFFF',
    fontSize: '10px',
    fontWeight: 'bold',
    padding: '2px 6px',
    borderRadius: '4px',
    zIndex: 10,
  },
  cardImgWrapper: {
    width: '100%',
    aspectRatio: '1/1',
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: '#f5f3ee',
    marginBottom: '12px',
  },
  cardImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
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
    backgroundColor: '#006b32',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(39, 158, 83, 0.2)',
  }
};

export default MobileHome;

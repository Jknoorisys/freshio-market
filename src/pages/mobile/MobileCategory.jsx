import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, Plus, Percent, ArrowUpDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES, PRODUCTS } from '../../data/mockData';
import { MobileNavBar } from '../../components/mobile/MobileNavBar';

export const MobileCategory = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, wishlist, toggleWishlist } = useApp();

  const [sortOption, setSortOption] = useState('popular');
  const [showDealsOnly, setShowDealsOnly] = useState(false);

  // Find the category info
  const categoryInfo = useMemo(() => {
    return CATEGORIES.find((c) => c.slug === slug) || {
      name: 'Groceries',
      emoji: '🛒',
      color: '#FEF1C9',
      borderColor: '#FBEAD2',
    };
  }, [slug]);

  // Filter category products
  const categoryProducts = useMemo(() => {
    let result = (PRODUCTS || []).filter((p) => p.categorySlug === slug);

    if (showDealsOnly) {
      result = result.filter((p) => p.isDeal || p.discount > 0);
    }

    if (sortOption === 'low-high') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortOption === 'high-low') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortOption === 'rating') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else {
      result = [...result].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [PRODUCTS, slug, showDealsOnly, sortOption]);

  const isWishlisted = (id) => wishlist.includes(id);

  return (
    <div style={styles.container}>
      <MobileNavBar title={`${categoryInfo.emoji} ${categoryInfo.name}`} />

      {/* Hero Header */}
      <div style={{ ...styles.categoryHero, backgroundColor: categoryInfo.color, borderColor: categoryInfo.borderColor }}>
        <p style={styles.categoryDesc}>{categoryInfo.description || 'Fresh groceries selected with care.'}</p>
        <span style={styles.itemCountBadge}>{categoryProducts.length} Items Available</span>
      </div>

      {/* Sorting / Filter Bar */}
      <div style={styles.filterRow}>
        <div style={styles.sortWrapper}>
          <ArrowUpDown size={14} color="var(--color-text-secondary)" style={{ marginRight: 4 }} />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            style={styles.sortSelect}
          >
            <option value="popular">Popular</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
        <button
          onClick={() => setShowDealsOnly(!showDealsOnly)}
          style={{
            ...styles.dealToggle,
            backgroundColor: showDealsOnly ? 'var(--color-orange-light)' : '#FFF',
            borderColor: showDealsOnly ? 'var(--color-orange)' : 'var(--color-border)',
            color: showDealsOnly ? 'var(--color-orange)' : 'var(--color-text-secondary)',
          }}
        >
          <Percent size={12} style={{ marginRight: 4 }} />
          Deals Only
        </button>
      </div>

      {/* Products Grid */}
      {categoryProducts.length > 0 ? (
        <div style={styles.grid}>
          {categoryProducts.map((prod) => {
            const wishlisted = isWishlisted(prod.id);
            return (
              <div key={prod.id} style={styles.productCard}>
                {/* Card Header Row */}
                <div style={styles.cardTopRow}>
                  {prod.discount > 0 ? (
                    <span style={{ ...styles.tagBadge, backgroundColor: '#FFF5EC', color: 'var(--color-orange)' }}>
                      -{prod.discount}%
                    </span>
                  ) : prod.isFeatured ? (
                    <span style={{ ...styles.tagBadge, backgroundColor: '#EBFCEE', color: 'var(--color-primary)' }}>
                      Organic
                    </span>
                  ) : (
                    <div />
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(prod.id);
                    }}
                    style={styles.wishBtn}
                  >
                    <Heart
                      size={16}
                      fill={wishlisted ? 'var(--color-error)' : 'transparent'}
                      color={wishlisted ? 'var(--color-error)' : 'var(--color-text-secondary)'}
                    />
                  </button>
                </div>

                {/* Product Image */}
                <div style={styles.prodImgWrapper} onClick={() => navigate(`/mobile/product/${prod.id}`)}>
                  <img
                    src={prod.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80'}
                    alt={prod.name}
                    style={styles.prodImg}
                  />
                </div>

                {/* Info and price details */}
                <div style={styles.prodInfo}>
                  <h3 style={styles.prodName} onClick={() => navigate(`/mobile/product/${prod.id}`)}>
                    {prod.name}
                  </h3>
                  
                  <div style={styles.ratingRow}>
                    <Star size={10} fill="var(--color-orange)" color="var(--color-orange)" />
                    <span style={styles.ratingText}>{prod.rating}</span>
                    <span style={styles.unitText}>• {prod.unit}</span>
                  </div>

                  <div style={styles.priceRow}>
                    <div style={styles.priceCol}>
                      <span style={styles.price}>{prod.price} RWF</span>
                      {prod.originalPrice > prod.price && (
                        <span style={styles.wasPrice}>{prod.originalPrice} RWF</span>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(prod, 1)}
                      style={styles.plusBtn}
                    >
                      <Plus size={16} color="#FFFFFF" strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={styles.noResults}>
          <h3>No products in this category</h3>
          <p>Check back later or try applying different filters.</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#FAF9F5',
    minHeight: '100%',
    paddingBottom: '30px',
  },
  categoryHero: {
    padding: '16px',
    borderBottom: '1px solid var(--color-border)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '8px',
  },
  categoryDesc: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.5',
    fontWeight: '500',
  },
  itemCountBadge: {
    fontSize: '10px',
    fontWeight: '800',
    backgroundColor: 'rgba(255,255,255,0.7)',
    color: 'var(--color-text)',
    padding: '4px 8px',
    borderRadius: '100px',
    border: '1.5px solid rgba(0,0,0,0.05)',
  },
  filterRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid var(--color-border)',
  },
  sortWrapper: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    padding: '4px 8px',
    backgroundColor: '#FFF',
  },
  sortSelect: {
    border: 'none',
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--color-text)',
    backgroundColor: 'transparent',
    outline: 'none',
  },
  dealToggle: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '11px',
    fontWeight: '700',
    padding: '6px 12px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--color-border)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    padding: '16px',
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid var(--color-border)',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    boxShadow: 'var(--shadow-sm)',
  },
  cardTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '20px',
  },
  tagBadge: {
    fontSize: '8px',
    fontWeight: '800',
    padding: '3px 6px',
    borderRadius: '4px',
  },
  wishBtn: {
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    padding: '2px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prodImgWrapper: {
    height: '110px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    margin: '8px 0',
  },
  prodImg: {
    maxHeight: '100px',
    maxWidth: '100px',
    objectFit: 'contain',
  },
  prodInfo: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  prodName: {
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--color-text)',
    marginTop: '2px',
    cursor: 'pointer',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    height: '32px',
    lineHeight: '1.35',
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    marginTop: '4px',
  },
  ratingText: {
    fontSize: '10px',
    color: 'var(--color-text-secondary)',
    fontWeight: '600',
  },
  unitText: {
    fontSize: '10px',
    color: 'var(--color-text-secondary)',
    fontWeight: '500',
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '10px',
  },
  priceCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  price: {
    fontSize: '12px',
    fontWeight: '800',
    color: 'var(--color-primary-dark)',
  },
  wasPrice: {
    fontSize: '9px',
    textDecoration: 'line-through',
    color: 'var(--color-text-secondary)',
  },
  plusBtn: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer',
  },
  noResults: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    textAlign: 'center',
  },
};

export default MobileCategory;

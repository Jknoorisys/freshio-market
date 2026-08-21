import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, ArrowUpDown, ShoppingCart, Heart, Plus, Star, ChevronLeft, Percent } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES, PRODUCTS } from '../../data/mockData';

export const MobileShop = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, wishlist, toggleWishlist } = useApp();

  // Parse URL search parameters
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const initialSearch = queryParams.get('q') || '';
  const initialFilter = queryParams.get('filter') || 'all';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOption, setSortOption] = useState('popular'); // popular, low-high, high-low, rating
  const [showDealsOnly, setShowDealsOnly] = useState(initialFilter === 'deals');
  const [visibleCount, setVisibleCount] = useState(20);

  // Sync state if URL changes
  useEffect(() => {
    setSearchQuery(queryParams.get('q') || '');
    setShowDealsOnly(queryParams.get('filter') === 'deals');
    setVisibleCount(20);
  }, [queryParams]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setVisibleCount(20);
  };

  const isWishlisted = (id) => wishlist.includes(id);

  // Filter products based on category, search, and deals
  const filteredProducts = useMemo(() => {
    let result = PRODUCTS || [];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.categorySlug === selectedCategory);
    }

    // Filter by deals
    if (showDealsOnly) {
      result = result.filter((p) => p.isDeal || p.discount > 0);
    }

    // Apply sorting
    if (sortOption === 'low-high') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortOption === 'high-low') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortOption === 'rating') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else {
      // popular
      result = [...result].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [PRODUCTS, searchQuery, selectedCategory, showDealsOnly, sortOption]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div style={styles.container}>
      {/* Top Header */}
      <div style={styles.header}>
        <button onClick={() => navigate('/mobile')} style={styles.backBtn}>
          <ChevronLeft size={24} color="var(--color-text)" />
        </button>
        <h1 style={styles.headerTitle}>Shop Groceries</h1>
        <div style={{ width: 24 }} />
      </div>

      {/* Search Header */}
      <div style={styles.searchSection}>
        <div style={styles.searchBar}>
          <Search size={18} color="var(--color-text-secondary)" style={{ marginRight: 8 }} />
          <input
            type="text"
            placeholder="Search all produce..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* Horizontal categories selector */}
      <div style={styles.categoryScroll}>
        <button
          onClick={() => {
            setSelectedCategory('all');
            setVisibleCount(20);
          }}
          style={{
            ...styles.catPill,
            backgroundColor: selectedCategory === 'all' ? 'var(--color-primary)' : '#FFF',
            color: selectedCategory === 'all' ? '#FFF' : 'var(--color-text)',
            border: selectedCategory === 'all' ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
          }}
        >
          All Items
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.slug);
              setVisibleCount(20);
            }}
            style={{
              ...styles.catPill,
              backgroundColor: selectedCategory === cat.slug ? 'var(--color-primary)' : '#FFF',
              color: selectedCategory === cat.slug ? '#FFF' : 'var(--color-text)',
              border: selectedCategory === cat.slug ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
            }}
          >
            <span style={{ marginRight: 4 }}>{cat.emoji}</span> {cat.name}
          </button>
        ))}
      </div>

      {/* Sort and Filters Row */}
      <div style={styles.filterRow}>
        <div style={styles.sortWrapper}>
          <ArrowUpDown size={14} color="var(--color-text-secondary)" style={{ marginRight: 4 }} />
          <select
            value={sortOption}
            onChange={(e) => {
              setSortOption(e.target.value);
              setVisibleCount(20);
            }}
            style={styles.sortSelect}
          >
            <option value="popular">Popularity</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
        <button
          onClick={() => {
            setShowDealsOnly(!showDealsOnly);
            setVisibleCount(20);
          }}
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

      {/* Product count indicator */}
      <div style={styles.countText}>
        Showing {displayedProducts.length} of {filteredProducts.length} items
      </div>

      {/* Products Grid */}
      {displayedProducts.length > 0 ? (
        <div style={styles.grid}>
          {displayedProducts.map((prod) => {
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
                  <span style={styles.prodCat}>{prod.categoryName}</span>
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
          <span style={styles.noResultsEmoji}>🔍</span>
          <h3>No products found</h3>
          <p>Try refining your search terms or selecting another category.</p>
        </div>
      )}

      {/* Load More Button */}
      {filteredProducts.length > visibleCount && (
        <button
          onClick={() => setVisibleCount((prev) => prev + 20)}
          style={styles.loadMoreBtn}
        >
          Load More Items
        </button>
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
  header: {
    height: '52px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid var(--color-border)',
  },
  backBtn: {
    padding: '4px',
    marginLeft: '-4px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: '16px',
    fontWeight: '800',
    color: 'var(--color-text)',
  },
  searchSection: {
    padding: '12px 16px',
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid var(--color-border)',
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'var(--color-bg)',
    border: '1px solid var(--color-border)',
    borderRadius: '12px',
    padding: '8px 12px',
    height: '38px',
  },
  searchInput: {
    flexGrow: 1,
    border: 'none',
    fontSize: '13px',
    color: 'var(--color-text)',
    backgroundColor: 'transparent',
    fontWeight: '500',
    outline: 'none',
  },
  categoryScroll: {
    display: 'flex',
    overflowX: 'auto',
    padding: '12px 16px',
    gap: '8px',
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid var(--color-border)',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    }
  },
  catPill: {
    padding: '6px 14px',
    borderRadius: '100px',
    fontSize: '12px',
    fontWeight: '700',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  filterRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    backgroundColor: '#FFFFFF',
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
    cursor: 'pointer',
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
  countText: {
    fontSize: '11px',
    color: 'var(--color-text-secondary)',
    padding: '4px 16px',
    fontWeight: '600',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    padding: '12px 16px',
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
  prodCat: {
    fontSize: '8px',
    fontWeight: '800',
    color: 'var(--color-primary)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
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
    padding: '40px 20px',
    textAlign: 'center',
  },
  noResultsEmoji: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  loadMoreBtn: {
    display: 'block',
    width: 'calc(100% - 32px)',
    margin: '16px auto',
    padding: '12px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: '#FFFFFF',
    border: '1px solid var(--color-primary)',
    color: 'var(--color-primary)',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer',
    textAlign: 'center',
  }
};

export default MobileShop;

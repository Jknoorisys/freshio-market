import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, ArrowUpDown, ShoppingCart, Heart, Plus, Star, ChevronLeft, Percent, X } from 'lucide-react';
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

  // Core filter states (applied to product list)
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOption, setSortOption] = useState('popular'); 
  const [showDealsOnly, setShowDealsOnly] = useState(initialFilter === 'deals');
  
  // Advanced Filter state variables
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Drawer temporary filter states (held when editing in side sheet)
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tempMinPrice, setTempMinPrice] = useState('');
  const [tempMaxPrice, setTempMaxPrice] = useState('');
  const [tempSelectedRating, setTempSelectedRating] = useState(null);
  const [tempSelectedBrand, setTempSelectedBrand] = useState('all');
  const [tempInStockOnly, setTempInStockOnly] = useState(false);

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

  // Get unique brands dynamically from products database
  const uniqueBrands = useMemo(() => {
    const db = PRODUCTS || [];
    const set = new Set(db.map(p => p.brand).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, []);

  // Filter products based on search, category, deals, and advanced filters
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

    // Advanced Filter: Min Price
    if (minPrice !== '') {
      result = result.filter((p) => p.price >= Number(minPrice));
    }

    // Advanced Filter: Max Price
    if (maxPrice !== '') {
      result = result.filter((p) => p.price <= Number(maxPrice));
    }

    // Advanced Filter: Rating
    if (selectedRating !== null) {
      result = result.filter((p) => (p.rating || 0) >= selectedRating);
    }

    // Advanced Filter: Brand
    if (selectedBrand !== 'all') {
      result = result.filter((p) => p.brand === selectedBrand);
    }

    // Advanced Filter: Stock
    if (inStockOnly) {
      result = result.filter((p) => p.stock > 0);
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
  }, [searchQuery, selectedCategory, showDealsOnly, minPrice, maxPrice, selectedRating, selectedBrand, inStockOnly, sortOption]);

  // Compute number of matching results for temporary filter values inside side sheet
  const tempFilteredProductsCount = useMemo(() => {
    let result = PRODUCTS || [];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.categorySlug === selectedCategory);
    }

    if (showDealsOnly) {
      result = result.filter((p) => p.isDeal || p.discount > 0);
    }

    if (tempMinPrice !== '') {
      result = result.filter((p) => p.price >= Number(tempMinPrice));
    }

    if (tempMaxPrice !== '') {
      result = result.filter((p) => p.price <= Number(tempMaxPrice));
    }

    if (tempSelectedRating !== null) {
      result = result.filter((p) => (p.rating || 0) >= tempSelectedRating);
    }

    if (tempSelectedBrand !== 'all') {
      result = result.filter((p) => p.brand === tempSelectedBrand);
    }

    if (tempInStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    return result.length;
  }, [searchQuery, selectedCategory, showDealsOnly, tempMinPrice, tempMaxPrice, tempSelectedRating, tempSelectedBrand, tempInStockOnly]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (minPrice !== '') count++;
    if (maxPrice !== '') count++;
    if (selectedRating !== null) count++;
    if (selectedBrand !== 'all') count++;
    if (inStockOnly) count++;
    return count;
  }, [minPrice, maxPrice, selectedRating, selectedBrand, inStockOnly]);

  const hasActiveFilters = activeFilterCount > 0;

  const openFilters = () => {
    setTempMinPrice(minPrice);
    setTempMaxPrice(maxPrice);
    setTempSelectedRating(selectedRating);
    setTempSelectedBrand(selectedBrand);
    setTempInStockOnly(inStockOnly);
    setIsFilterOpen(true);
  };

  const applyFilters = () => {
    setMinPrice(tempMinPrice);
    setMaxPrice(tempMaxPrice);
    setSelectedRating(tempSelectedRating);
    setSelectedBrand(tempSelectedBrand);
    setInStockOnly(tempInStockOnly);
    setIsFilterOpen(false);
    setVisibleCount(20);
  };

  const resetTempFilters = () => {
    setTempMinPrice('');
    setTempMaxPrice('');
    setTempSelectedRating(null);
    setTempSelectedBrand('all');
    setTempInStockOnly(false);
  };

  const clearAllFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSelectedRating(null);
    setSelectedBrand('all');
    setInStockOnly(false);
    
    setTempMinPrice('');
    setTempMaxPrice('');
    setTempSelectedRating(null);
    setTempSelectedBrand('all');
    setTempInStockOnly(false);
    
    setIsFilterOpen(false);
    setVisibleCount(20);
  };

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div style={styles.container}>
      {/* Top Header App Bar with Filter Icon on Right */}
      <div style={styles.header}>
        <button onClick={() => navigate('/mobile')} style={styles.backBtn}>
          <ChevronLeft size={24} color="var(--color-text)" />
        </button>
        <h1 style={styles.headerTitle}>Shop Groceries</h1>
        
        <button onClick={openFilters} style={styles.filterHeaderBtn} className="header-filter-btn">
          <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'var(--color-text)' }}>tune</span>
          {activeFilterCount > 0 && (
            <span style={styles.headerFilterBadge}>{activeFilterCount}</span>
          )}
        </button>
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
      <div style={styles.categoryScroll} className="hide-scrollbar">
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

      {/* Sort and Deals row */}
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
              <div key={prod.id} style={styles.productCard} className="shop-product-card">
                {/* Card Header Row */}
                <div style={styles.cardTopRow}>
                  {prod.discount > 0 ? (
                    <span style={{ ...styles.tagBadge, backgroundColor: '#FFF5EC', color: 'var(--color-orange)' }}>
                      -{prod.discount}%
                    </span>
                  ) : prod.isFeatured ? (
                    <span style={{ ...styles.tagBadge, backgroundColor: '#EAF8F0', color: 'var(--color-primary)' }}>
                      Organic
                    </span>
                  ) : <span />}
                  <button
                    onClick={() => toggleWishlist(prod.id)}
                    style={styles.heartBtn}
                  >
                    <Heart
                      size={18}
                      fill={wishlisted ? '#FF5A5F' : 'none'}
                      color={wishlisted ? '#FF5A5F' : 'var(--color-text-secondary)'}
                    />
                  </button>
                </div>

                {/* Product Image */}
                <div onClick={() => navigate(`/mobile/product/${prod.id}`)} style={styles.cardImgWrapper}>
                  <img
                    src={prod.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80'}
                    alt={prod.name}
                    style={styles.cardImg}
                  />
                </div>

                {/* Info */}
                <div style={styles.cardInfo}>
                  <span style={styles.brandText}>{prod.brand}</span>
                  <h4 onClick={() => navigate(`/mobile/product/${prod.id}`)} style={styles.prodName}>
                    {prod.name}
                  </h4>
                  <div style={styles.ratingRow}>
                    <Star size={10} fill="var(--color-rating)" color="var(--color-rating)" />
                    <span style={styles.ratingText}>{prod.rating || 5.0}</span>
                    <span style={styles.unitText}>• {prod.unit || '1 unit'}</span>
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
                      <Plus size={16} color="#FFF" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={styles.noResults}>
          <div style={styles.noResultsEmoji}>🥗</div>
          <h3>No products match your criteria</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', marginTop: '6px' }}>
            Try widening your price filters, clearing search text, or selecting another category.
          </p>
          {hasActiveFilters && (
            <button onClick={clearAllFilters} style={styles.clearFiltersBtn}>
              Reset All Filters
            </button>
          )}
        </div>
      )}

      {/* Load More Button */}
      {filteredProducts.length > displayedProducts.length && (
        <button
          onClick={() => setVisibleCount((prev) => prev + 20)}
          style={styles.loadMoreBtn}
        >
          Load More Items
        </button>
      )}

      {/* FILTER DRAWER SIDE SHEET */}
      <div 
        style={{
          ...styles.drawerOverlay,
          opacity: isFilterOpen ? 1 : 0,
          pointerEvents: isFilterOpen ? 'auto' : 'none',
        }}
        onClick={() => setIsFilterOpen(false)}
      >
        <div 
          style={{
            ...styles.drawerContainer,
            transform: isFilterOpen ? 'translateX(0)' : 'translateX(100%)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Header */}
          <div style={styles.drawerHeader}>
            <h3 style={styles.drawerTitle}>Refine Products</h3>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button onClick={resetTempFilters} style={styles.resetBtn}>Reset</button>
              <button onClick={() => setIsFilterOpen(false)} style={styles.closeBtn}>
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Drawer Body Scroll Content */}
          <div style={styles.drawerContent}>
            {/* Price Range Section */}
            <div style={styles.filterSection}>
              <h4 style={styles.filterSectionTitle}>Price Range (RWF)</h4>
              <div style={styles.priceInputRow}>
                <div style={styles.priceInputWrapper}>
                  <label style={styles.inputLabel}>Min Price</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={tempMinPrice}
                    onChange={(e) => setTempMinPrice(e.target.value)}
                    style={styles.priceInput}
                  />
                </div>
                <div style={styles.priceInputWrapper}>
                  <label style={styles.inputLabel}>Max Price</label>
                  <input
                    type="number"
                    placeholder="50,000"
                    value={tempMaxPrice}
                    onChange={(e) => setTempMaxPrice(e.target.value)}
                    style={styles.priceInput}
                  />
                </div>
              </div>
              <div style={styles.priceQuickRow}>
                <button onClick={() => { setTempMinPrice(''); setTempMaxPrice('5000'); }} style={styles.quickPricePill}>
                  &lt; 5,000 RWF
                </button>
                <button onClick={() => { setTempMinPrice('5000'); setTempMaxPrice('15000'); }} style={styles.quickPricePill}>
                  5k - 15k RWF
                </button>
                <button onClick={() => { setTempMinPrice('15000'); setTempMaxPrice(''); }} style={styles.quickPricePill}>
                  &gt; 15,000 RWF
                </button>
              </div>
            </div>

            {/* Ratings Section */}
            <div style={styles.filterSection}>
              <h4 style={styles.filterSectionTitle}>Minimum Rating</h4>
              <div style={styles.ratingPillsRow}>
                {[4.5, 4.0, 3.5, 3.0].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setTempSelectedRating(tempSelectedRating === rate ? null : rate)}
                    style={{
                      ...styles.ratingPill,
                      backgroundColor: tempSelectedRating === rate ? 'var(--color-primary-light)' : '#F2F4F3',
                      borderColor: tempSelectedRating === rate ? 'var(--color-primary)' : 'transparent',
                      color: tempSelectedRating === rate ? 'var(--color-primary)' : 'var(--color-text)',
                    }}
                  >
                    <Star size={12} fill="var(--color-rating)" color="var(--color-rating)" style={{ marginRight: 4 }} />
                    <span>{rate}★ & Above</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Brands Section */}
            <div style={styles.filterSection}>
              <h4 style={styles.filterSectionTitle}>Select Brand</h4>
              <div style={styles.brandsGrid}>
                {uniqueBrands.map((br) => (
                  <button
                    key={br}
                    onClick={() => setTempSelectedBrand(br)}
                    style={{
                      ...styles.brandPill,
                      backgroundColor: tempSelectedBrand === br ? 'var(--color-primary)' : '#FFF',
                      borderColor: tempSelectedBrand === br ? 'var(--color-primary)' : 'var(--color-border)',
                      color: tempSelectedBrand === br ? '#FFF' : 'var(--color-text)',
                    }}
                  >
                    {br === 'all' ? 'All Brands' : br}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Section */}
            <div style={styles.filterSection}>
              <h4 style={styles.filterSectionTitle}>Availability</h4>
              <div style={styles.toggleRow}>
                <div style={styles.toggleTextCol}>
                  <span style={styles.toggleLabel}>In Stock Only</span>
                  <span style={styles.toggleSub}>Hide out-of-stock items</span>
                </div>
                <input
                  type="checkbox"
                  checked={tempInStockOnly}
                  onChange={(e) => setTempInStockOnly(e.target.checked)}
                  style={styles.checkboxToggle}
                />
              </div>
            </div>
          </div>

          {/* Drawer Sticky Footer */}
          <div style={styles.drawerFooter}>
            <button onClick={clearAllFilters} style={styles.footerClearBtn}>
              Clear All
            </button>
            <button onClick={applyFilters} style={styles.applyBtn}>
              Apply ({tempFilteredProductsCount} Items)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#fbf9f3', 
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  header: {
    height: '52px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid var(--color-border)',
    flexShrink: 0,
  },
  backBtn: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  headerTitle: {
    fontSize: '15px',
    fontWeight: '800',
    color: 'var(--color-text)',
  },
  filterHeaderBtn: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    outline: 'none',
  },
  headerFilterBadge: {
    position: 'absolute',
    top: '4px',
    right: '4px',
    backgroundColor: 'var(--color-primary)',
    color: '#FFF',
    fontSize: '8px',
    fontWeight: '800',
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1.5px solid #FFF',
  },
  searchSection: {
    padding: '12px 16px 8px 16px',
    backgroundColor: '#FFFFFF',
    flexShrink: 0,
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    height: '40px',
    padding: '0 12px',
    backgroundColor: '#F5F7F6',
    borderRadius: '8px',
    border: '1.5px solid #E8ECE9',
  },
  searchInput: {
    flexGrow: 1,
    border: 'none',
    background: 'transparent',
    outline: 'none',
    fontSize: '14px',
    fontFamily: 'inherit',
  },
  categoryScroll: {
    display: 'flex',
    overflowX: 'auto',
    overflowY: 'hidden',
    alignItems: 'center',
    gap: '10px',
    padding: '0 16px',
    height: '56px',
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid var(--color-border)',
    flexShrink: 0,
  },
  catPill: {
    padding: '6px 14px',
    borderRadius: '100px',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    flexShrink: 0,
    outline: 'none',
    display: 'flex',
    alignItems: 'center',
  },
  filterRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    flexShrink: 0,
  },
  sortWrapper: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#FFF',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    padding: '6px 10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.01)',
  },
  sortSelect: {
    border: 'none',
    outline: 'none',
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--color-text-secondary)',
    backgroundColor: 'transparent',
    cursor: 'pointer',
  },
  dealToggle: {
    display: 'flex',
    alignItems: 'center',
    padding: '6px 10px',
    borderRadius: '8px',
    border: '1px solid var(--color-border)',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    outline: 'none',
    boxShadow: '0 1px 3px rgba(0,0,0,0.01)',
  },
  countText: {
    padding: '0 16px 8px 16px',
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--color-text-secondary)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    padding: '0 16px 20px 16px',
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    border: '1px solid rgba(0,0,0,0.01)',
  },
  cardTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '20px',
  },
  tagBadge: {
    fontSize: '9px',
    fontWeight: '800',
    padding: '2px 5px',
    borderRadius: '4px',
  },
  heartBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    outline: 'none',
  },
  cardImgWrapper: {
    width: '100%',
    aspectRatio: '1/1',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#f5f3ee',
    margin: '8px 0',
    cursor: 'pointer',
  },
  cardImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  cardInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  brandText: {
    fontSize: '9px',
    color: 'var(--color-text-secondary)',
    fontWeight: '700',
    textTransform: 'uppercase',
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
    outline: 'none',
  },
  noResults: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    textAlign: 'center',
  },
  noResultsEmoji: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  clearFiltersBtn: {
    marginTop: '16px',
    padding: '10px 20px',
    backgroundColor: 'var(--color-primary)',
    color: '#FFF',
    fontWeight: '700',
    fontSize: '12px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
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
  },

  // FILTER DRAWER SIDE SHEET STYLES
  drawerOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(2px)',
    zIndex: 9999,
    display: 'flex',
    justifyContent: 'flex-end',
    transition: 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  drawerContainer: {
    width: '82%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  drawerHeader: {
    padding: '18px 16px',
    borderBottom: '1px solid var(--color-border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  drawerTitle: {
    fontSize: '15px',
    fontWeight: '800',
    color: 'var(--color-text)',
  },
  resetBtn: {
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--color-text-secondary)',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  closeBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F7F6',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--color-text-secondary)',
  },
  drawerContent: {
    flexGrow: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  filterSection: {
    display: 'flex',
    flexDirection: 'column',
  },
  filterSectionTitle: {
    fontSize: '13px',
    fontWeight: '800',
    color: 'var(--color-text)',
    marginBottom: '12px',
  },
  priceInputRow: {
    display: 'flex',
    gap: '12px',
  },
  priceInputWrapper: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  inputLabel: {
    fontSize: '10px',
    fontWeight: '700',
    color: 'var(--color-text-secondary)',
  },
  priceInput: {
    height: '38px',
    border: '1.5px solid var(--color-border)',
    borderRadius: '8px',
    padding: '0 12px',
    fontSize: '13px',
    outline: 'none',
    backgroundColor: '#F5F7F6',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    width: '100%',
  },
  priceQuickRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '10px',
  },
  quickPricePill: {
    padding: '6px 12px',
    borderRadius: '100px',
    border: '1px solid var(--color-border)',
    backgroundColor: '#FFF',
    color: 'var(--color-text-secondary)',
    fontSize: '11px',
    fontWeight: '600',
    cursor: 'pointer',
    outline: 'none',
  },
  ratingPillsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  ratingPill: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid transparent',
    fontSize: '11px',
    fontWeight: '700',
    cursor: 'pointer',
    outline: 'none',
    display: 'flex',
    alignItems: 'center',
  },
  brandsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  brandPill: {
    padding: '6px 12px',
    borderRadius: '8px',
    border: '1.5px solid var(--color-border)',
    fontSize: '11px',
    fontWeight: '700',
    cursor: 'pointer',
    outline: 'none',
  },
  toggleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F7F6',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid var(--color-border)',
  },
  toggleTextCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  toggleLabel: {
    fontSize: '12px',
    fontWeight: '800',
    color: 'var(--color-text)',
  },
  toggleSub: {
    fontSize: '10px',
    color: 'var(--color-text-secondary)',
  },
  checkboxToggle: {
    width: '18px',
    height: '18px',
    accentColor: 'var(--color-primary)',
    cursor: 'pointer',
  },
  drawerFooter: {
    padding: '16px',
    borderTop: '1px solid var(--color-border)',
    display: 'flex',
    gap: '12px',
    backgroundColor: '#FFFFFF',
  },
  footerClearBtn: {
    flexBasis: '35%',
    height: '44px',
    backgroundColor: '#F5F7F6',
    color: 'var(--color-text-secondary)',
    fontWeight: '700',
    fontSize: '13px',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    cursor: 'pointer',
    outline: 'none',
  },
  applyBtn: {
    flexGrow: 1,
    height: '44px',
    backgroundColor: 'var(--color-primary)',
    color: '#FFF',
    fontWeight: '800',
    fontSize: '13px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    outline: 'none',
  }
};

// Inject custom styles for scrollbars hiding
if (typeof document !== 'undefined') {
  const styleId = 'mobile-shop-hide-scrollbars';
  if (!document.getElementById(styleId)) {
    const styleSheet = document.createElement('style');
    styleSheet.id = styleId;
    styleSheet.textContent = `
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `;
    document.head.appendChild(styleSheet);
  }
}

export default MobileShop;

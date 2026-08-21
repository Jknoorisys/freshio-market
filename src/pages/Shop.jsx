import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { CATEGORIES, PRODUCTS } from '../data/mockData';
import { Filter, SlidersHorizontal, Search, RotateCcw } from 'lucide-react';

export const Shop = () => {
  const { addToast } = useApp();
  
  // --- STATE FOR FILTERS ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState(15000); // Max: 15,000 RWF
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortBy, setSortBy] = useState('popular');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Extract all unique brands dynamically
  const allBrands = useMemo(() => {
    const brands = PRODUCTS.map(p => p.brand).filter(Boolean);
    return [...new Set(brands)];
  }, []);

  const handleBrandChange = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(prev => prev.filter(b => b !== brand));
    } else {
      setSelectedBrands(prev => [...prev, brand]);
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange(15000);
    setSelectedBrands([]);
    setSortBy('popular');
    addToast('Filters reset successfully', 'info');
  };

  // --- FILTER & SORT LOGIC ---
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // 1. Category Filter
    if (selectedCategory !== 'all') {
      const catObj = CATEGORIES.find(c => c.slug === selectedCategory);
      if (catObj) {
        result = result.filter(p => p.category.toLowerCase() === catObj.name.toLowerCase());
      }
    }

    // 2. Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.brand.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q)
      );
    }

    // 3. Price Filter
    result = result.filter(p => p.price <= priceRange);

    // 4. Brand Filter
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }

    // 5. Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        result.sort((a, b) => b.discount - a.discount);
        break;
      case 'popular':
      default:
        result.sort((a, b) => b.reviews - a.reviews);
        break;
    }

    return result;
  }, [selectedCategory, searchQuery, priceRange, selectedBrands, sortBy]);

  return (
    <div style={styles.page}>
      <div className="container">
        {/* Banner header */}
        <div style={styles.shopBanner}>
          <div style={styles.shopBannerText}>
            <span style={styles.bannerBadge}>KIGALI MARKETPLACE</span>
            <h2 style={styles.bannerTitle}>Shop Fresh Organics</h2>
            <p style={styles.bannerDesc}>Premium farm produce, dairy, bakery and household goods delivered straight from local growers to your door.</p>
          </div>
        </div>

        {/* Toolbar */}
        <div style={styles.toolbar}>
          <div style={styles.toolbarLeft}>
            <button 
              onClick={() => setShowMobileFilters(!showMobileFilters)} 
              style={styles.filterToggleBtn}
              className="btn-outline"
            >
              <Filter size={18} />
              <span>Filters</span>
            </button>
            <span style={styles.productCount}>
              Showing <strong>{filteredProducts.length}</strong> products
            </span>
          </div>
          <div style={styles.toolbarRight}>
            <span style={styles.sortLabel}>Sort By:</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)} 
              style={styles.sortSelect}
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="discount">Biggest Savings</option>
            </select>
          </div>
        </div>

        <div style={styles.shopLayout}>
          {/* SIDEBAR FILTER PANEL */}
          <aside style={{
            ...styles.sidebar,
            display: showMobileFilters ? 'block' : undefined // responsive control handled in CSS/flex wrapper
          }} className="shop-sidebar-responsive">
            {/* Active filters heading */}
            <div style={styles.sidebarHeader}>
              <h3 style={styles.sidebarTitle}>Filters</h3>
              <button onClick={resetFilters} style={styles.resetBtn}>
                <RotateCcw size={14} /> Reset
              </button>
            </div>

            {/* Search filter */}
            <div style={styles.filterWidget}>
              <h4 style={styles.widgetTitle}>Search</h4>
              <div style={styles.searchBox}>
                <Search size={16} color="var(--color-text-secondary)" style={styles.searchIcon} />
                <input 
                  type="text" 
                  placeholder="What are you looking for?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={styles.searchInput}
                />
              </div>
            </div>

            {/* Categories filter */}
            <div style={styles.filterWidget}>
              <h4 style={styles.widgetTitle}>Categories</h4>
              <div style={styles.catList}>
                <button 
                  onClick={() => setSelectedCategory('all')} 
                  style={{
                    ...styles.catLink,
                    color: selectedCategory === 'all' ? 'var(--color-primary-dark)' : 'var(--color-text-secondary)',
                    fontWeight: selectedCategory === 'all' ? '700' : '500',
                  }}
                >
                  All Categories
                </button>
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat.id} 
                    onClick={() => setSelectedCategory(cat.slug)} 
                    style={{
                      ...styles.catLink,
                      color: selectedCategory === cat.slug ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                      fontWeight: selectedCategory === cat.slug ? '700' : '500',
                    }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price filter slider */}
            <div style={styles.filterWidget}>
              <h4 style={styles.widgetTitle}>Max Price</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={styles.priceLimit}>0 RWF</span>
                <span style={styles.priceRangeVal}>{priceRange.toLocaleString()} RWF</span>
              </div>
              <input 
                type="range" 
                min="500" 
                max="15000" 
                step="500" 
                value={priceRange} 
                onChange={(e) => setPriceRange(Number(e.target.value))} 
                style={styles.priceSlider}
              />
            </div>

            {/* Brands Filter checkboxes */}
            <div style={styles.filterWidget}>
              <h4 style={styles.widgetTitle}>Local Brands</h4>
              <div style={styles.brandList}>
                {allBrands.map(brand => (
                  <label key={brand} style={styles.brandLabel}>
                    <input 
                      type="checkbox" 
                      checked={selectedBrands.includes(brand)} 
                      onChange={() => handleBrandChange(brand)} 
                      style={styles.brandCheckbox}
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* MAIN PRODUCTS GRID LIST */}
          <main style={styles.mainGridWrapper}>
            {filteredProducts.length === 0 ? (
              <div style={styles.noResults}>
                <span style={{ fontSize: '48px' }}>🔍</span>
                <h4 style={styles.noResultsTitle}>No Products Found</h4>
                <p style={styles.noResultsDesc}>We couldn't find any products matching your active filters. Try adjusting your searches or resetting the panel.</p>
                <button onClick={resetFilters} className="btn btn-primary" style={{ borderRadius: '12px' }}>
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div style={styles.productsGrid}>
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    padding: '32px 0 64px 0',
  },
  shopBanner: {
    backgroundImage: 'linear-gradient(135deg, var(--color-primary-dark) 0%, #157A4C 100%)',
    borderRadius: '24px',
    padding: '40px 32px',
    color: '#FFFFFF',
    marginBottom: '32px',
    boxShadow: '0 8px 24px rgba(22, 58, 53, 0.08)',
  },
  shopBannerText: {
    maxWidth: '600px',
  },
  bannerBadge: {
    fontSize: '10px',
    fontWeight: '800',
    color: 'var(--color-accent)',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    display: 'inline-block',
    marginBottom: '8px',
  },
  bannerTitle: {
    fontSize: '32px',
    fontWeight: '800',
    marginBottom: '12px',
    color: '#FFFFFF',
  },
  bannerDesc: {
    fontSize: '14px',
    lineHeight: '1.5',
    color: 'rgba(255, 255, 255, 0.85)',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '16px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  toolbarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  filterToggleBtn: {
    display: 'none', // Shown on mobile responsive media query
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    backgroundColor: '#FFFFFF',
    border: '1.5px solid var(--color-border)',
  },
  productCount: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
  },
  toolbarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  sortLabel: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    fontWeight: '600',
  },
  sortSelect: {
    padding: '8px 16px',
    borderRadius: '10px',
    border: '1.5px solid var(--color-border)',
    fontSize: '14px',
    color: 'var(--color-text)',
    outline: 'none',
    fontWeight: '600',
    backgroundColor: '#FFFFFF',
  },
  shopLayout: {
    display: 'flex',
    gap: '32px',
  },
  sidebar: {
    width: '260px',
    flexShrink: 0,
  },
  sidebarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: '1.5px solid var(--color-border)',
    paddingBottom: '12px',
  },
  sidebarTitle: {
    fontSize: '18px',
    fontWeight: '800',
    color: 'var(--color-text)',
    margin: 0,
  },
  resetBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-text-secondary)',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: 0,
    transition: 'color 0.2s',
  },
  filterWidget: {
    marginBottom: '24px',
    borderBottom: '1px dashed var(--color-border)',
    paddingBottom: '20px',
  },
  widgetTitle: {
    fontSize: '14px',
    fontWeight: '800',
    color: 'var(--color-text)',
    marginBottom: '14px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  searchBox: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
  },
  searchInput: {
    width: '100%',
    padding: '10px 12px 10px 36px',
    borderRadius: '10px',
    border: '1.5px solid var(--color-border)',
    outline: 'none',
    fontSize: '14px',
    color: 'var(--color-text)',
    transition: 'border-color 0.2s',
  },
  catList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  catLink: {
    background: 'none',
    border: 'none',
    textAlign: 'left',
    fontSize: '14px',
    cursor: 'pointer',
    padding: 0,
    transition: 'color 0.2s',
  },
  priceLimit: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
  },
  priceRangeVal: {
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--color-primary-dark)',
  },
  priceSlider: {
    width: '100%',
    height: '6px',
    borderRadius: '3px',
    accentColor: 'var(--color-primary)',
    cursor: 'pointer',
  },
  brandList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  brandLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    color: 'var(--color-text)',
    cursor: 'pointer',
    userSelect: 'none',
  },
  brandCheckbox: {
    width: '16px',
    height: '16px',
    borderRadius: '4px',
    accentColor: 'var(--color-primary)',
    cursor: 'pointer',
  },
  mainGridWrapper: {
    flexGrow: 1,
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    '@media (max-width: 1024px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    '@media (max-width: 600px)': {
      gridTemplateColumns: '1fr',
    },
  },
  noResults: {
    textAlign: 'center',
    padding: '64px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    border: '1.5px solid var(--color-border)',
  },
  noResultsTitle: {
    fontSize: '20px',
    fontWeight: '800',
    color: 'var(--color-text)',
  },
  noResultsDesc: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    maxWidth: '400px',
    lineHeight: '1.5',
  },
};

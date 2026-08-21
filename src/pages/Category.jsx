import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { CATEGORIES, PRODUCTS } from '../data/mockData';
import { ArrowLeft, SlidersHorizontal, Search, RotateCcw, ShieldCheck } from 'lucide-react';

export const Category = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToast } = useApp();

  // --- STATE FOR FILTERS ---
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState(15000);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortBy, setSortBy] = useState('popular');

  // Find matching category object
  const categoryInfo = useMemo(() => {
    return CATEGORIES.find(c => c.slug === slug) || { name: 'Products', description: 'Fresh items locally sourced in Kigali.' };
  }, [slug]);

  // Extract category products
  const categoryProducts = useMemo(() => {
    return PRODUCTS.filter(p => p.category.toLowerCase() === categoryInfo.name.toLowerCase());
  }, [categoryInfo]);

  // Extract all unique brands inside this category
  const categoryBrands = useMemo(() => {
    const brands = categoryProducts.map(p => p.brand).filter(Boolean);
    return [...new Set(brands)];
  }, [categoryProducts]);

  const handleBrandChange = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(prev => prev.filter(b => b !== brand));
    } else {
      setSelectedBrands(prev => [...prev, brand]);
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setPriceRange(15000);
    setSelectedBrands([]);
    setSortBy('popular');
  };

  // Reset local filters whenever category changes
  useEffect(() => {
    resetFilters();
  }, [slug]);

  // --- FILTER & SORT LOGIC ---
  const filteredProducts = useMemo(() => {
    let result = [...categoryProducts];

    // 1. Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.brand.toLowerCase().includes(q)
      );
    }

    // 2. Price Filter
    result = result.filter(p => p.price <= priceRange);

    // 3. Brand Filter
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }

    // 4. Sorting
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
  }, [categoryProducts, searchQuery, priceRange, selectedBrands, sortBy]);

  return (
    <div style={styles.page}>
      <div className="container">
        {/* Navigation Breadcrumb */}
        <button onClick={() => navigate('/shop')} style={styles.backBtn}>
          <ArrowLeft size={16} /> Back to Shop
        </button>

        {/* Category Header */}
        <div style={{ ...styles.categoryHeader, backgroundColor: categoryInfo.color || '#EAF8F0' }}>
          <div style={styles.headerInfo}>
            <span style={styles.badge}>CATEGORY</span>
            <h1 style={styles.title}>{categoryInfo.name}</h1>
            <p style={styles.description}>{categoryInfo.description}</p>
          </div>
          <div style={styles.headerIndicator}>
            <ShieldCheck size={48} color="var(--color-primary)" style={{ opacity: 0.2 }} />
          </div>
        </div>

        {/* Catalog layout */}
        <div style={styles.layout}>
          {/* SIDEBAR PANEL */}
          <aside style={styles.sidebar}>
            <div style={styles.sidebarHeader}>
              <h3 style={styles.sidebarTitle}>Refine Results</h3>
              <button onClick={resetFilters} style={styles.resetBtn}>
                <RotateCcw size={12} /> Clear
              </button>
            </div>

            {/* Search within Category */}
            <div style={styles.widget}>
              <h4 style={styles.widgetTitle}>Search Category</h4>
              <div style={styles.searchBox}>
                <Search size={16} color="var(--color-text-secondary)" style={styles.searchIcon} />
                <input 
                  type="text" 
                  placeholder="Search in this category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={styles.searchInput}
                />
              </div>
            </div>

            {/* Price slider */}
            <div style={styles.widget}>
              <h4 style={styles.widgetTitle}>Max Price</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={styles.priceLimit}>500 RWF</span>
                <span style={styles.priceVal}>{priceRange.toLocaleString()} RWF</span>
              </div>
              <input 
                type="range" 
                min="500" 
                max="15000" 
                step="500" 
                value={priceRange} 
                onChange={(e) => setPriceRange(Number(e.target.value))} 
                style={styles.slider}
              />
            </div>

            {/* Category Brands */}
            {categoryBrands.length > 0 && (
              <div style={styles.widget}>
                <h4 style={styles.widgetTitle}>Brands</h4>
                <div style={styles.brandList}>
                  {categoryBrands.map(brand => (
                    <label key={brand} style={styles.brandLabel}>
                      <input 
                        type="checkbox" 
                        checked={selectedBrands.includes(brand)} 
                        onChange={() => handleBrandChange(brand)} 
                        style={styles.checkbox}
                      />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* CATALOG GRID */}
          <main style={styles.mainGrid}>
            <div style={styles.toolbar}>
              <span style={styles.countText}>
                Showing <strong>{filteredProducts.length}</strong> items in {categoryInfo.name}
              </span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)} 
                style={styles.sortSelect}
              >
                <option value="popular">Most Reviews</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="discount">Savings</option>
              </select>
            </div>

            {filteredProducts.length === 0 ? (
              <div style={styles.noResults}>
                <span style={{ fontSize: '48px' }}>🥬</span>
                <h4 style={styles.noResultsTitle}>No items fit your filters</h4>
                <p style={styles.noResultsDesc}>Try expanding your price range or clearing your keyword filter settings.</p>
                <button onClick={resetFilters} className="btn btn-primary" style={{ borderRadius: '10px' }}>
                  Reset Filters
                </button>
              </div>
            ) : (
              <div style={styles.grid}>
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
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'none',
    border: 'none',
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    fontWeight: '700',
    cursor: 'pointer',
    marginBottom: '20px',
    padding: 0,
  },
  categoryHeader: {
    borderRadius: '20px',
    padding: '36px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    border: '1.5px solid rgba(22, 58, 53, 0.05)',
  },
  headerInfo: {
    maxWidth: '700px',
  },
  badge: {
    fontSize: '9px',
    fontWeight: '800',
    color: 'var(--color-primary-dark)',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    display: 'inline-block',
    marginBottom: '6px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '800',
    color: 'var(--color-text)',
    marginBottom: '10px',
  },
  description: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.5',
  },
  headerIndicator: {
    paddingRight: '16px',
    '@media (max-width: 600px)': {
      display: 'none',
    },
  },
  layout: {
    display: 'flex',
    gap: '32px',
    '@media (max-width: 900px)': {
      flexDirection: 'column',
    },
  },
  sidebar: {
    width: '240px',
    flexShrink: 0,
    '@media (max-width: 900px)': {
      width: '100%',
    },
  },
  sidebarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1.5px solid var(--color-border)',
    paddingBottom: '10px',
    marginBottom: '16px',
  },
  sidebarTitle: {
    fontSize: '16px',
    fontWeight: '800',
    color: 'var(--color-text)',
    margin: 0,
  },
  resetBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-text-secondary)',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  widget: {
    marginBottom: '20px',
    borderBottom: '1px dashed var(--color-border)',
    paddingBottom: '16px',
  },
  widgetTitle: {
    fontSize: '13px',
    fontWeight: '800',
    color: 'var(--color-text)',
    marginBottom: '12px',
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
    left: '10px',
  },
  searchInput: {
    width: '100%',
    padding: '8px 10px 8px 32px',
    borderRadius: '8px',
    border: '1.5px solid var(--color-border)',
    fontSize: '13px',
    outline: 'none',
  },
  priceLimit: {
    fontSize: '11px',
    color: 'var(--color-text-secondary)',
  },
  priceVal: {
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--color-primary-dark)',
  },
  slider: {
    width: '100%',
    accentColor: 'var(--color-primary)',
    cursor: 'pointer',
  },
  brandList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  brandLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: 'var(--color-text)',
    cursor: 'pointer',
  },
  checkbox: {
    width: '15px',
    height: '15px',
    accentColor: 'var(--color-primary)',
    cursor: 'pointer',
  },
  mainGrid: {
    flexGrow: 1,
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '12px',
  },
  countText: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
  },
  sortSelect: {
    padding: '6px 12px',
    borderRadius: '8px',
    border: '1.5px solid var(--color-border)',
    fontSize: '13px',
    outline: 'none',
    backgroundColor: '#FFFFFF',
    fontWeight: '600',
  },
  grid: {
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
    padding: '48px 24px',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1.5px solid var(--color-border)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  noResultsTitle: {
    fontSize: '18px',
    fontWeight: '800',
    color: 'var(--color-text)',
  },
  noResultsDesc: {
    fontSize: '13px',
    color: 'var(--color-text-secondary)',
    maxWidth: '300px',
    lineHeight: '1.4',
    marginBottom: '8px',
  },
};
export default Category;

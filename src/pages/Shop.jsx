import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useResponsiveStyles } from '../hooks/useResponsiveStyles';
import { ProductCard } from '../components/ProductCard';
import { CATEGORIES, PRODUCTS } from '../data/mockData';
import { 
  Filter, 
  Search, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Tag, 
  SlidersHorizontal,
  X
} from 'lucide-react';

const ITEMS_PER_PAGE = 32;

export const Shop = () => {
  const { addToast } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const styles = useResponsiveStyles(rawStyles);
  
  // Read initial query params from URL
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';
  const initialTag = searchParams.get('tag') || 'all';

  // --- STATE FOR FILTERS ---
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedTag, setSelectedTag] = useState(initialTag);
  const [priceRange, setPriceRange] = useState(150000); // 150,000 RWF default max
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortBy, setSortBy] = useState('popular');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Sync state if URL query params change
  useEffect(() => {
    if (searchParams.get('search') !== null) {
      setSearchQuery(searchParams.get('search'));
    }
    if (searchParams.get('category')) {
      setSelectedCategory(searchParams.get('category'));
    }
    if (searchParams.get('tag')) {
      setSelectedTag(searchParams.get('tag'));
    }
  }, [searchParams]);

  // Extract top tags dynamically from products
  const popularTags = useMemo(() => {
    return [
      'bestseller', 
      'pantry', 
      'breakfast', 
      'imported', 
      'fresh', 
      'local', 
      'healthy', 
      'chilled', 
      'family-size', 
      'spicy', 
      'deal'
    ];
  }, []);

  // Extract top brands
  const allBrands = useMemo(() => {
    const counts = {};
    PRODUCTS.forEach(p => {
      if (p.brand && p.brand !== 'Sawa Citi') {
        counts[p.brand] = (counts[p.brand] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30)
      .map(([brand]) => brand);
  }, []);

  const handleBrandChange = (brand) => {
    setCurrentPage(1);
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(prev => prev.filter(b => b !== brand));
    } else {
      setSelectedBrands(prev => [...prev, brand]);
    }
  };

  const handleCategorySelect = (slug) => {
    setSelectedCategory(slug);
    setCurrentPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (slug === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', slug);
    }
    setSearchParams(newParams);
  };

  const handleTagSelect = (tag) => {
    setSelectedTag(tag);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedTag('all');
    setPriceRange(150000);
    setSelectedBrands([]);
    setSortBy('popular');
    setCurrentPage(1);
    setSearchParams({});
    addToast('Filters reset successfully', 'info');
  };

  // --- FILTER & SORT LOGIC ---
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // 1. Category Filter
    if (selectedCategory !== 'all') {
      result = result.filter(p => 
        p.categorySlug === selectedCategory || 
        (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase())
      );
    }

    // 2. Tag Filter
    if (selectedTag !== 'all') {
      result = result.filter(p => Array.isArray(p.tags) && p.tags.includes(selectedTag));
    }

    // 3. Search Filter (matches name, SKU, brand, category, tags)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.sku && p.sku.toLowerCase().includes(q)) || 
        (p.brand && p.brand.toLowerCase().includes(q)) || 
        (p.category && p.category.toLowerCase().includes(q)) ||
        (Array.isArray(p.tags) && p.tags.some(t => t.toLowerCase().includes(q))) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // 4. Price Filter
    if (priceRange < 150000) {
      result = result.filter(p => (p.price || 0) <= priceRange);
    }

    // 5. Brand Filter
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }

    // 6. Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'discount':
        result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'sku':
        result.sort((a, b) => (a.sku || '').localeCompare(b.sku || ''));
        break;
      case 'popular':
      default:
        result.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
        break;
    }

    return result;
  }, [selectedCategory, selectedTag, searchQuery, priceRange, selectedBrands, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  return (
    <div style={styles.page}>
      <div className="container">
        {/* Banner header */}
        <div style={styles.shopBanner}>
          <div style={styles.shopBannerText}>
            <span style={styles.bannerBadge}>SAWA CITI KIGALI CATALOG</span>
            <h1 style={styles.bannerTitle}>All Supermarket Products</h1>
            <p style={styles.bannerDesc}>
              Browse over 4,600+ authentic Sawa Citi supermarket products. From fresh volcanic produce and pantry grains to fine beverages and household goods, delivered in 2 hours across Kigali.
            </p>
          </div>
        </div>

        {/* Quick Tag Pills Bar */}
        <div style={styles.tagPillBar}>
          <button
            onClick={() => handleTagSelect('all')}
            style={{
              ...styles.tagPillBtn,
              backgroundColor: selectedTag === 'all' ? 'var(--color-primary-dark)' : '#FFFFFF',
              color: selectedTag === 'all' ? '#FFFFFF' : 'var(--color-text)',
              borderColor: selectedTag === 'all' ? 'var(--color-primary-dark)' : 'var(--color-border)',
            }}
          >
            All Tags
          </button>
          {popularTags.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagSelect(tag)}
              style={{
                ...styles.tagPillBtn,
                backgroundColor: selectedTag === tag ? 'var(--color-primary-dark)' : '#FFFFFF',
                color: selectedTag === tag ? '#FFFFFF' : 'var(--color-text)',
                borderColor: selectedTag === tag ? 'var(--color-primary-dark)' : 'var(--color-border)',
              }}
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div style={styles.toolbar}>
          <div style={styles.toolbarLeft}>
            <button 
              onClick={() => setShowMobileFilters(!showMobileFilters)} 
              style={styles.filterToggleBtn}
              className="btn-outline"
            >
              <Filter size={16} />
              <span>Filters {selectedBrands.length > 0 ? `(${selectedBrands.length})` : ''}</span>
            </button>
            <span style={styles.productCount}>
              Showing <strong>{filteredProducts.length.toLocaleString()}</strong> products
              {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
            </span>
          </div>

          <div style={styles.toolbarRight}>
            <span style={styles.sortLabel}>Sort:</span>
            <select 
              value={sortBy} 
              onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }} 
              style={styles.sortSelect}
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="discount">Biggest Savings</option>
              <option value="name-asc">Product Name (A-Z)</option>
              <option value="sku">SKU Code</option>
            </select>
          </div>
        </div>

        <div style={styles.shopLayout}>
          {/* SIDEBAR FILTER PANEL */}
          <aside style={{
            ...styles.sidebar,
            display: showMobileFilters ? 'block' : undefined
          }} className="shop-sidebar-responsive">
            {/* Header */}
            <div style={styles.sidebarHeader}>
              <h3 style={styles.sidebarTitle}>Refine Products</h3>
              <button onClick={resetFilters} style={styles.resetBtn}>
                <RotateCcw size={13} /> Reset
              </button>
            </div>

            {/* Search Filter */}
            <div style={styles.filterWidget}>
              <h4 style={styles.widgetTitle}>Search Catalog / SKU</h4>
              <div style={styles.searchBox}>
                <Search size={16} color="var(--color-text-secondary)" style={styles.searchIcon} />
                <input 
                  type="text" 
                  placeholder="Name, SKU (e.g. g001), brand..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  style={styles.searchInput}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} style={styles.clearSearchBtn}>
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Categories filter (12 Sawa Citi Categories) */}
            <div style={styles.filterWidget}>
              <h4 style={styles.widgetTitle}>Categories (12)</h4>
              <div style={styles.catList}>
                <button 
                  onClick={() => handleCategorySelect('all')} 
                  style={{
                    ...styles.catLink,
                    backgroundColor: selectedCategory === 'all' ? 'var(--color-primary-light)' : 'transparent',
                    color: selectedCategory === 'all' ? 'var(--color-primary-dark)' : 'var(--color-text)',
                    fontWeight: selectedCategory === 'all' ? '800' : '500',
                  }}
                >
                  <span>🌟 All Categories</span>
                  <span style={styles.catCountBadge}>{PRODUCTS.length}</span>
                </button>
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat.id} 
                    onClick={() => handleCategorySelect(cat.slug)} 
                    style={{
                      ...styles.catLink,
                      backgroundColor: selectedCategory === cat.slug ? 'var(--color-primary-light)' : 'transparent',
                      color: selectedCategory === cat.slug ? 'var(--color-primary-dark)' : 'var(--color-text)',
                      fontWeight: selectedCategory === cat.slug ? '800' : '500',
                    }}
                  >
                    <span>{cat.emoji} {cat.name}</span>
                    <span style={styles.catCountBadge}>{cat.totalCount || cat.itemCount}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price filter slider */}
            <div style={styles.filterWidget}>
              <h4 style={styles.widgetTitle}>Max Price</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={styles.priceLimit}>1,000 RWF</span>
                <span style={styles.priceVal}>
                  {priceRange >= 150000 ? 'Any Price' : `${priceRange.toLocaleString()} RWF`}
                </span>
              </div>
              <input 
                type="range" 
                min="2000" 
                max="150000" 
                step="2000"
                value={priceRange} 
                onChange={(e) => { setPriceRange(Number(e.target.value)); setCurrentPage(1); }}
                style={styles.rangeInput}
              />
            </div>

            {/* Brands Filter */}
            {allBrands.length > 0 && (
              <div style={styles.filterWidget}>
                <h4 style={styles.widgetTitle}>Popular Brands</h4>
                <div style={styles.brandList}>
                  {allBrands.map((brand) => (
                    <label key={brand} style={styles.checkboxLabel}>
                      <input 
                        type="checkbox" 
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandChange(brand)}
                        style={styles.checkbox}
                      />
                      <span style={styles.brandName}>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* MAIN PRODUCT CATALOG GRID */}
          <main style={styles.mainCatalog}>
            {filteredProducts.length === 0 ? (
              <div style={styles.noResults}>
                <span style={{ fontSize: '48px' }}>🔍</span>
                <h3 style={{ fontSize: '20px', fontWeight: '800', marginTop: '12px' }}>No products found</h3>
                <p style={{ color: 'var(--color-text-secondary)', margin: '8px 0 20px 0' }}>
                  No items matched your filters or search term "{searchQuery}". Try clearing filters or searching for another term.
                </p>
                <button onClick={resetFilters} className="btn btn-primary" style={{ borderRadius: '12px' }}>
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div style={styles.productsGrid}>
                  {paginatedProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div style={styles.paginationRow}>
                    <button 
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      style={{ ...styles.pageNavBtn, opacity: currentPage === 1 ? 0.4 : 1 }}
                      aria-label="Previous page"
                    >
                      <ChevronLeft size={18} /> Prev
                    </button>

                    <div style={styles.pageNumbers}>
                      {Array.from({ length: Math.min(totalPages, 7) }, (_, idx) => {
                        let pageNum;
                        if (totalPages <= 7) {
                          pageNum = idx + 1;
                        } else if (currentPage <= 4) {
                          pageNum = idx + 1;
                        } else if (currentPage >= totalPages - 3) {
                          pageNum = totalPages - 6 + idx;
                        } else {
                          pageNum = currentPage - 3 + idx;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            style={{
                              ...styles.pageNumBtn,
                              backgroundColor: currentPage === pageNum ? 'var(--color-primary)' : '#FFFFFF',
                              color: currentPage === pageNum ? '#FFFFFF' : 'var(--color-text)',
                              fontWeight: currentPage === pageNum ? '800' : '600',
                            }}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button 
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      style={{ ...styles.pageNavBtn, opacity: currentPage === totalPages ? 0.4 : 1 }}
                      aria-label="Next page"
                    >
                      Next <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

const rawStyles = {
  page: {
    padding: '24px 0 64px 0',
    '@media (max-width: 768px)': {
      padding: '12px 0 40px 0',
    }
  },
  shopBanner: {
    backgroundImage: 'linear-gradient(135deg, var(--color-primary-dark) 0%, #0E623B 100%)',
    borderRadius: '20px',
    padding: '32px',
    color: '#FFFFFF',
    marginBottom: '20px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
    '@media (max-width: 768px)': {
      padding: '20px',
      borderRadius: '16px',
    }
  },
  shopBannerText: {
    maxWidth: '680px',
  },
  bannerBadge: {
    fontSize: '10.5px',
    fontWeight: '800',
    color: 'var(--color-accent)',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    display: 'inline-block',
    marginBottom: '6px',
  },
  bannerTitle: {
    fontSize: '28px',
    fontWeight: '800',
    marginBottom: '8px',
    color: '#FFFFFF',
    '@media (max-width: 768px)': {
      fontSize: '22px',
    }
  },
  bannerDesc: {
    fontSize: '13.5px',
    lineHeight: '1.5',
    color: 'rgba(255, 255, 255, 0.88)',
    '@media (max-width: 768px)': {
      fontSize: '12px',
    }
  },
  tagPillBar: {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
    paddingBottom: '12px',
    marginBottom: '16px',
    scrollbarWidth: 'none',
  },
  tagPillBtn: {
    padding: '6px 14px',
    borderRadius: '20px',
    border: '1px solid var(--color-border)',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '14px',
    flexWrap: 'wrap',
    gap: '12px',
    '@media (max-width: 768px)': {
      gap: '8px',
    }
  },
  toolbarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  filterToggleBtn: {
    display: 'none',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '700',
    backgroundColor: '#FFFFFF',
    border: '1.5px solid var(--color-border)',
    '@media (max-width: 1024px)': {
      display: 'flex',
    }
  },
  productCount: {
    fontSize: '13.5px',
    color: 'var(--color-text-secondary)',
  },
  toolbarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    '@media (max-width: 600px)': {
      width: '100%',
      justifyContent: 'space-between',
    }
  },
  sortLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--color-text-secondary)',
  },
  sortSelect: {
    padding: '7px 12px',
    borderRadius: '10px',
    border: '1.5px solid var(--color-border)',
    backgroundColor: '#FFFFFF',
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--color-text)',
    outline: 'none',
    cursor: 'pointer',
  },
  shopLayout: {
    display: 'grid',
    gridTemplateColumns: '260px 1fr',
    gap: '28px',
    '@media (max-width: 1024px)': {
      gridTemplateColumns: '1fr',
      gap: '16px',
    }
  },
  sidebar: {
    backgroundColor: '#FFFFFF',
    borderRadius: '18px',
    border: '1px solid var(--color-border)',
    padding: '20px',
    height: 'fit-content',
    '@media (max-width: 1024px)': {
      display: 'none',
      position: 'fixed',
      top: '60px',
      left: 0,
      right: 0,
      bottom: '64px',
      zIndex: 850,
      overflowY: 'auto',
      borderRadius: 0,
      border: 'none',
      padding: '20px 24px',
    }
  },
  sidebarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid var(--color-border)',
  },
  sidebarTitle: {
    fontSize: '15px',
    fontWeight: '800',
    color: 'var(--color-text)',
  },
  resetBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--color-primary-dark)',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  filterWidget: {
    marginBottom: '20px',
  },
  widgetTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--color-text)',
    marginBottom: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
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
    padding: '8px 30px 8px 32px',
    borderRadius: '10px',
    border: '1.5px solid var(--color-border)',
    fontSize: '12.5px',
    outline: 'none',
  },
  clearSearchBtn: {
    position: 'absolute',
    right: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--color-text-secondary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  catList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    maxHeight: '320px',
    overflowY: 'auto',
    paddingRight: '4px',
  },
  catLink: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: '7px 10px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '12.5px',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  catCountBadge: {
    fontSize: '11px',
    color: 'var(--color-text-secondary)',
    fontWeight: '500',
  },
  priceLimit: {
    fontSize: '11.5px',
    color: 'var(--color-text-secondary)',
  },
  priceVal: {
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--color-primary-dark)',
  },
  rangeInput: {
    width: '100%',
    accentColor: 'var(--color-primary)',
    cursor: 'pointer',
  },
  brandList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    maxHeight: '180px',
    overflowY: 'auto',
    paddingRight: '4px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: 'var(--color-text)',
    cursor: 'pointer',
  },
  checkbox: {
    accentColor: 'var(--color-primary)',
  },
  brandName: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  mainCatalog: {
    minWidth: 0,
  },
  noResults: {
    backgroundColor: '#FFFFFF',
    borderRadius: '18px',
    border: '1px solid var(--color-border)',
    padding: '48px 24px',
    textAlign: 'center',
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '32px',
    '@media (max-width: 1024px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '12px',
    },
    '@media (max-width: 600px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '8px',
    }
  },
  paginationRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    padding: '16px 0',
  },
  pageNavBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '8px 14px',
    borderRadius: '10px',
    border: '1.5px solid var(--color-border)',
    backgroundColor: '#FFFFFF',
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--color-text)',
    cursor: 'pointer',
  },
  pageNumbers: {
    display: 'flex',
    gap: '6px',
  },
  pageNumBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    border: '1px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
};

export default Shop;

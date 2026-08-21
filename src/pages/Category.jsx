import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { CATEGORIES, PRODUCTS, CATEGORY_ALIASES } from '../data/mockData';
import { 
  ArrowLeft, 
  Search, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  X, 
  Filter 
} from 'lucide-react';

const ITEMS_PER_PAGE = 32;

export const Category = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToast } = useApp();

  // Resolve slug with aliases
  const resolvedSlug = CATEGORY_ALIASES[slug] || slug;

  // --- STATE FOR FILTERS ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [priceRange, setPriceRange] = useState(150000);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortBy, setSortBy] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Find matching category object
  const categoryInfo = useMemo(() => {
    return (
      CATEGORIES.find(c => c.slug === resolvedSlug || c.id === resolvedSlug) ||
      CATEGORIES.find(c => c.name.toLowerCase() === resolvedSlug.toLowerCase()) || {
        name: 'Supermarket Products',
        slug: resolvedSlug,
        emoji: '🛒',
        color: '#EAF8F0',
        borderColor: '#CDEEDD',
        description: 'Authentic supermarket products locally stocked across Sawa Citi Kigali stores.',
        itemCount: `${PRODUCTS.length}+ Items`
      }
    );
  }, [resolvedSlug]);

  // Extract category products
  const categoryProducts = useMemo(() => {
    return PRODUCTS.filter(p => 
      p.categorySlug === categoryInfo.slug || 
      (p.category && p.category.toLowerCase() === categoryInfo.name.toLowerCase())
    );
  }, [categoryInfo]);

  // Extract unique brands in this category
  const categoryBrands = useMemo(() => {
    const brands = categoryProducts.map(p => p.brand).filter(b => b && b !== 'Sawa Citi');
    return [...new Set(brands)].slice(0, 25);
  }, [categoryProducts]);

  // Extract tags in this category
  const categoryTags = useMemo(() => {
    const tags = new Set();
    categoryProducts.forEach(p => {
      if (Array.isArray(p.tags)) {
        p.tags.forEach(t => tags.add(t));
      }
    });
    return Array.from(tags);
  }, [categoryProducts]);

  const handleBrandChange = (brand) => {
    setCurrentPage(1);
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(prev => prev.filter(b => b !== brand));
    } else {
      setSelectedBrands(prev => [...prev, brand]);
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedTag('all');
    setPriceRange(150000);
    setSelectedBrands([]);
    setSortBy('popular');
    setCurrentPage(1);
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
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.sku && p.sku.toLowerCase().includes(q)) || 
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (Array.isArray(p.tags) && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    // 2. Tag Filter
    if (selectedTag !== 'all') {
      result = result.filter(p => Array.isArray(p.tags) && p.tags.includes(selectedTag));
    }

    // 3. Price Filter
    if (priceRange < 150000) {
      result = result.filter(p => (p.price || 0) <= priceRange);
    }

    // 4. Brand Filter
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }

    // 5. Sorting
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
      case 'popular':
      default:
        result.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
        break;
    }

    return result;
  }, [categoryProducts, searchQuery, selectedTag, priceRange, selectedBrands, sortBy]);

  // Pagination
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
        {/* Navigation Breadcrumb */}
        <div style={styles.breadcrumbRow}>
          <button onClick={() => navigate('/shop')} style={styles.backBtn}>
            <ArrowLeft size={16} /> Back to Shop
          </button>
          <div style={styles.bcList}>
            <Link to="/" style={styles.bcLink}>Home</Link>
            <span style={styles.bcSep}>/</span>
            <Link to="/shop" style={styles.bcLink}>Categories</Link>
            <span style={styles.bcSep}>/</span>
            <span style={styles.bcActive}>{categoryInfo.name}</span>
          </div>
        </div>

        {/* Category Header Banner */}
        <div style={{ ...styles.categoryHeader, backgroundColor: categoryInfo.color || '#EAF8F0' }}>
          <div style={styles.headerInfo}>
            <span style={styles.badge}>
              {categoryInfo.emoji || '🛒'} {categoryProducts.length} PRODUCTS
            </span>
            <h1 style={styles.title}>{categoryInfo.name}</h1>
            <p style={styles.description}>{categoryInfo.description}</p>
          </div>
          <div style={styles.headerIndicator}>
            <ShieldCheck size={56} color="var(--color-primary-dark)" style={{ opacity: 0.15 }} />
          </div>
        </div>

        {/* Tags Pills Row (if available for this category) */}
        {categoryTags.length > 0 && (
          <div style={styles.tagPillBar}>
            <button
              onClick={() => { setSelectedTag('all'); setCurrentPage(1); }}
              style={{
                ...styles.tagPillBtn,
                backgroundColor: selectedTag === 'all' ? 'var(--color-primary-dark)' : '#FFFFFF',
                color: selectedTag === 'all' ? '#FFFFFF' : 'var(--color-text)',
                borderColor: selectedTag === 'all' ? 'var(--color-primary-dark)' : 'var(--color-border)',
              }}
            >
              All {categoryInfo.name}
            </button>
            {categoryTags.map(tag => (
              <button
                key={tag}
                onClick={() => { setSelectedTag(tag); setCurrentPage(1); }}
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
        )}

        {/* Toolbar */}
        <div style={styles.toolbar}>
          <div style={styles.toolbarLeft}>
            <button 
              onClick={() => setShowMobileFilters(!showMobileFilters)} 
              style={styles.filterToggleBtn}
              className="btn-outline"
            >
              <Filter size={16} />
              <span>Filters</span>
            </button>
            <span style={styles.productCount}>
              Showing <strong>{filteredProducts.length.toLocaleString()}</strong> items
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
              <option value="name-asc">Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Catalog layout */}
        <div style={styles.layout}>
          {/* SIDEBAR PANEL */}
          <aside style={{
            ...styles.sidebar,
            display: showMobileFilters ? 'block' : undefined
          }} className="category-sidebar-responsive">
            <div style={styles.sidebarHeader}>
              <h3 style={styles.sidebarTitle}>Refine Results</h3>
              <button onClick={resetFilters} style={styles.resetBtn}>
                <RotateCcw size={13} /> Clear
              </button>
            </div>

            {/* Search within Category */}
            <div style={styles.widget}>
              <h4 style={styles.widgetTitle}>Search in {categoryInfo.name}</h4>
              <div style={styles.searchBox}>
                <Search size={15} color="var(--color-text-secondary)" style={styles.searchIcon} />
                <input 
                  type="text" 
                  placeholder="Filter by name or SKU..."
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

            {/* Price slider */}
            <div style={styles.widget}>
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

            {/* Brand Filter */}
            {categoryBrands.length > 0 && (
              <div style={styles.widget}>
                <h4 style={styles.widgetTitle}>Brands</h4>
                <div style={styles.brandList}>
                  {categoryBrands.map(brand => (
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

            {/* Other Categories Quick Switcher */}
            <div style={styles.widget}>
              <h4 style={styles.widgetTitle}>Other Categories</h4>
              <div style={styles.otherCatsList}>
                {CATEGORIES.filter(c => c.slug !== categoryInfo.slug).slice(0, 6).map(c => (
                  <Link key={c.id} to={`/category/${c.slug}`} style={styles.otherCatLink}>
                    <span>{c.emoji} {c.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* MAIN PRODUCT GRID */}
          <main style={styles.mainArea}>
            {filteredProducts.length === 0 ? (
              <div style={styles.noResults}>
                <span style={{ fontSize: '44px' }}>🔍</span>
                <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '12px 0 6px 0' }}>No products match your filters</h3>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '20px', fontSize: '13.5px' }}>
                  Try resetting the search query or adjusting the price slider.
                </p>
                <button onClick={resetFilters} className="btn btn-primary" style={{ borderRadius: '10px' }}>
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                <div style={styles.grid}>
                  {paginatedProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={styles.paginationRow}>
                    <button 
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      style={{ ...styles.pageNavBtn, opacity: currentPage === 1 ? 0.4 : 1 }}
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

const styles = {
  page: {
    padding: '24px 0 64px 0',
  },
  breadcrumbRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '10px',
    border: '1px solid var(--color-border)',
    backgroundColor: '#FFFFFF',
    color: 'var(--color-text)',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  bcList: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: 'var(--color-text-secondary)',
  },
  bcLink: {
    color: 'var(--color-text-secondary)',
    textDecoration: 'none',
  },
  bcSep: {
    color: '#D0D5DD',
  },
  bcActive: {
    color: 'var(--color-text)',
    fontWeight: '700',
  },
  categoryHeader: {
    borderRadius: '20px',
    padding: '32px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid rgba(0,0,0,0.05)',
  },
  headerInfo: {
    maxWidth: '640px',
  },
  badge: {
    fontSize: '11px',
    fontWeight: '800',
    color: 'var(--color-primary-dark)',
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
    display: 'inline-block',
    marginBottom: '8px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '800',
    color: 'var(--color-text)',
    marginBottom: '8px',
  },
  description: {
    fontSize: '14px',
    lineHeight: '1.5',
    color: 'var(--color-text-secondary)',
  },
  headerIndicator: {
    display: 'flex',
    alignItems: 'center',
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
    padding: '6px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    backgroundColor: '#FFFFFF',
    border: '1.5px solid var(--color-border)',
  },
  productCount: {
    fontSize: '13.5px',
    color: 'var(--color-text-secondary)',
  },
  toolbarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
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
  layout: {
    display: 'grid',
    gridTemplateColumns: '260px 1fr',
    gap: '28px',
  },
  sidebar: {
    backgroundColor: '#FFFFFF',
    borderRadius: '18px',
    border: '1px solid var(--color-border)',
    padding: '20px',
    height: 'fit-content',
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
  widget: {
    marginBottom: '20px',
  },
  widgetTitle: {
    fontSize: '12.5px',
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
    padding: '8px 28px 8px 30px',
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
  otherCatsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  otherCatLink: {
    padding: '6px 8px',
    borderRadius: '8px',
    fontSize: '12px',
    color: 'var(--color-text)',
    textDecoration: 'none',
    backgroundColor: '#F9FAFB',
    transition: 'background 0.15s',
  },
  mainArea: {
    minWidth: 0,
  },
  noResults: {
    backgroundColor: '#FFFFFF',
    borderRadius: '18px',
    border: '1px solid var(--color-border)',
    padding: '48px 24px',
    textAlign: 'center',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '32px',
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
  },
};

export default Category;

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, History, TrendingUp, ArrowRight, Tag } from 'lucide-react';
import { PRODUCTS, CATEGORIES, RECENT_SEARCHES, POPULAR_SEARCHES } from '../data/mockData';

export const SearchOverlay = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      setQuery('');
      setResults([]);
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Dynamic filtering of products across name, SKU, brand, category, tags, description
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase().trim();
    const filtered = PRODUCTS.filter(
      (product) =>
        product.name.toLowerCase().includes(q) ||
        (product.sku && product.sku.toLowerCase().includes(q)) ||
        (product.category && product.category.toLowerCase().includes(q)) ||
        (product.brand && product.brand.toLowerCase().includes(q)) ||
        (Array.isArray(product.tags) && product.tags.some(t => t.toLowerCase().includes(q)))
    ).slice(0, 8); // Top 8 matched results

    setResults(filtered);
  }, [query]);

  // Suggestions based on query
  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    const list = [];
    
    // 1. Check matching categories
    CATEGORIES.forEach(c => {
      if (c.name.toLowerCase().includes(q) && !list.includes(c.name)) {
        list.push(c.name);
      }
    });
    
    // 2. Check matching brands
    PRODUCTS.forEach(p => {
      if (p.brand && p.brand !== 'Sawa Citi' && p.brand.toLowerCase().includes(q) && !list.includes(p.brand)) {
        list.push(p.brand);
      }
    });

    // 3. Extract words from product titles
    PRODUCTS.slice(0, 500).forEach(p => {
      const words = p.name.split(' ');
      words.forEach(w => {
        const cleanWord = w.replace(/[^a-zA-Z0-9]/g, '');
        if (cleanWord.length > 3 && cleanWord.toLowerCase().startsWith(q) && !list.includes(cleanWord)) {
          list.push(cleanWord);
        }
      });
    });

    return list.slice(0, 6);
  }, [query]);

  if (!isOpen) return null;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleTagClick = (tag) => {
    setQuery(tag);
    inputRef.current?.focus();
  };

  const handleProductClick = (id) => {
    onClose();
    navigate(`/product/${id}`);
  };

  const handleCategoryClick = (slug) => {
    onClose();
    navigate(`/category/${slug}`);
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.content} onClick={(e) => e.stopPropagation()}>
        {/* Search Input Bar */}
        <div style={styles.searchBarWrapper}>
          <form 
            onSubmit={handleSearchSubmit} 
            style={{
              ...styles.searchForm,
              borderColor: isFocused ? 'var(--color-primary)' : 'transparent',
              backgroundColor: isFocused ? '#FFFFFF' : '#F3F6F4',
              boxShadow: isFocused ? '0 4px 12px rgba(39, 158, 83, 0.08)' : 'none',
            }}
          >
            <Search size={22} color="var(--color-primary)" style={{ marginRight: '12px' }} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search 4,600+ items by Name, SKU (e.g. g001), Brand, Category..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              style={styles.searchInput}
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} style={styles.clearBtn}>
                <X size={16} />
              </button>
            )}
          </form>
          <button style={styles.closeBtn} onClick={onClose}>
            ESC / Close <X size={16} style={{ marginLeft: '6px' }} />
          </button>
        </div>

        {/* Real-time suggestions pills row */}
        {query.trim() && suggestions.length > 0 && (
          <div style={styles.suggestionsRow}>
            <span style={styles.suggestionsLabel}>Suggested:</span>
            {suggestions.map((sug) => (
              <button
                key={sug}
                onClick={() => handleTagClick(sug)}
                style={styles.suggestionTag}
              >
                {sug}
              </button>
            ))}
          </div>
        )}

        {/* Results vs Categories Showcase */}
        <div style={styles.body}>
          {query.trim() ? (
            <div style={styles.resultsSection}>
              <div style={styles.resultsHeader}>
                <h4 style={styles.sectionTitle}>
                  Matched Products ({results.length})
                </h4>
                {results.length > 0 && (
                  <button 
                    onClick={handleSearchSubmit}
                    style={styles.viewAllResultsBtn}
                  >
                    View all in Shop <ArrowRight size={14} />
                  </button>
                )}
              </div>

              {results.length > 0 ? (
                <div style={styles.resultsList}>
                  {results.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleProductClick(product.id)}
                      style={styles.productRow}
                    >
                      <img 
                        src={product.image || product.imageUrl} 
                        alt={product.name} 
                        style={styles.productImg} 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23EAF8F0"/><text x="50" y="55" font-size="24" text-anchor="middle">🛒</text></svg>';
                        }}
                      />
                      <div style={styles.productInfo}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                          <span style={styles.productCategory}>{product.categoryName || product.category}</span>
                          {product.sku && <span style={styles.productSku}>{product.sku}</span>}
                        </div>
                        <h4 style={styles.productName}>{product.name}</h4>
                        {product.unit && <span style={styles.productUnit}>{product.unit}</span>}
                      </div>
                      <div style={styles.priceCol}>
                        <span style={styles.productPrice}>{(product.price || 0).toLocaleString()} RWF</span>
                        {product.originalPrice > product.price && (
                          <span style={styles.origPrice}>{(product.originalPrice).toLocaleString()} RWF</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={styles.emptyResults}>
                  <p>No matching Sawa Citi products found for "{query}".</p>
                  <button 
                    onClick={() => { onClose(); navigate('/shop'); }}
                    className="btn btn-primary"
                    style={{ marginTop: '12px', padding: '8px 18px', borderRadius: '10px' }}
                  >
                    Browse All 4,600+ Products
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={styles.defaultContent}>
              {/* Popular Searches */}
              <div style={styles.section}>
                <div style={styles.sectionHeading}>
                  <TrendingUp size={16} color="var(--color-primary)" />
                  <h4>Trending in Kigali</h4>
                </div>
                <div style={styles.tagsGrid}>
                  {POPULAR_SEARCHES.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleTagClick(item)}
                      style={styles.popularTag}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Browse 12 Categories */}
              <div style={styles.section}>
                <div style={styles.sectionHeading}>
                  <History size={16} color="var(--color-primary)" />
                  <h4>Supermarket Categories</h4>
                </div>
                <div style={styles.categoriesGrid}>
                  {CATEGORIES.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.slug)}
                      style={styles.catCard}
                    >
                      <span style={{ fontSize: '20px' }}>{cat.emoji}</span>
                      <div style={styles.catCardInfo}>
                        <h5 style={styles.catName}>{cat.name}</h5>
                        <span style={styles.catCount}>{cat.itemCount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(22, 58, 53, 0.45)',
    backdropFilter: 'blur(8px)',
    zIndex: 9999,
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '60px',
  },
  content: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    maxWidth: '740px',
    height: 'fit-content',
    maxHeight: '85vh',
    borderRadius: '24px',
    boxShadow: '0 20px 48px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    border: '1px solid var(--color-border)',
  },
  searchBarWrapper: {
    padding: '20px 24px',
    borderBottom: '1px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  searchForm: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
    padding: '10px 16px',
    borderRadius: '16px',
    border: '1.5px solid transparent',
    transition: 'all 0.2s',
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    width: '100%',
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--color-text)',
  },
  clearBtn: {
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--color-text-secondary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  closeBtn: {
    border: 'none',
    backgroundColor: '#F3F4F6',
    color: 'var(--color-text)',
    padding: '8px 14px',
    borderRadius: '10px',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
  },
  suggestionsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 24px',
    backgroundColor: '#F9FAFB',
    borderBottom: '1px solid var(--color-border)',
    overflowX: 'auto',
  },
  suggestionsLabel: {
    fontSize: '11.5px',
    fontWeight: '700',
    color: 'var(--color-text-secondary)',
  },
  suggestionTag: {
    padding: '4px 10px',
    borderRadius: '8px',
    border: '1px solid var(--color-border)',
    backgroundColor: '#FFFFFF',
    fontSize: '12px',
    color: 'var(--color-text)',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  body: {
    padding: '24px',
    overflowY: 'auto',
  },
  resultsSection: {
    display: 'flex',
    flexDirection: 'column',
  },
  resultsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px',
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: '800',
    color: 'var(--color-text)',
  },
  viewAllResultsBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--color-primary-dark)',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  resultsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  productRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '10px 14px',
    borderRadius: '14px',
    backgroundColor: '#F9FAFB',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  productImg: {
    width: '46px',
    height: '46px',
    borderRadius: '10px',
    objectFit: 'contain',
    backgroundColor: '#FFFFFF',
    border: '1px solid var(--color-border)',
    padding: '2px',
  },
  productInfo: {
    flexGrow: 1,
  },
  productCategory: {
    fontSize: '10.5px',
    fontWeight: '700',
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase',
  },
  productSku: {
    fontSize: '10px',
    fontWeight: '700',
    color: 'var(--color-primary)',
    backgroundColor: 'var(--color-primary-light)',
    padding: '1px 4px',
    borderRadius: '4px',
    fontFamily: 'monospace',
  },
  productName: {
    fontSize: '13.5px',
    fontWeight: '700',
    color: 'var(--color-text)',
    marginBottom: '2px',
  },
  productUnit: {
    fontSize: '11px',
    color: 'var(--color-text-secondary)',
  },
  priceCol: {
    textAlign: 'right',
  },
  productPrice: {
    fontSize: '14px',
    fontWeight: '800',
    color: 'var(--color-text)',
    display: 'block',
  },
  origPrice: {
    fontSize: '11px',
    color: 'var(--color-text-secondary)',
    textDecoration: 'line-through',
  },
  emptyResults: {
    textAlign: 'center',
    padding: '32px 0',
    color: 'var(--color-text-secondary)',
  },
  defaultContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sectionHeading: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  tagsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  popularTag: {
    padding: '8px 14px',
    borderRadius: '12px',
    border: '1px solid var(--color-border)',
    backgroundColor: '#F9FAFB',
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--color-text)',
    cursor: 'pointer',
  },
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
  },
  catCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    borderRadius: '12px',
    backgroundColor: '#F9FAFB',
    cursor: 'pointer',
    border: '1px solid var(--color-border)',
  },
  catCardInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  catName: {
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--color-text)',
  },
  catCount: {
    fontSize: '10.5px',
    color: 'var(--color-text-secondary)',
  },
};

export default SearchOverlay;

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, History, TrendingUp, ArrowRight, CornerDownLeft } from 'lucide-react';
import { PRODUCTS, CATEGORIES, RECENT_SEARCHES, POPULAR_SEARCHES } from '../data/mockData';

export const SearchOverlay = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef();

  useEffect(() => {
    if (isOpen) {
      // Focus the search input when overlay opens
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

  // Dynamic filtering of products
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const searchTerm = query.toLowerCase();
    const filtered = PRODUCTS.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm)
    ).slice(0, 5); // Limit to top 5 results for sleek look
    setResults(filtered);
  }, [query]);

  // Real-time suggestions based on current query typing
  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const list = [];
    
    // 1. Check matching categories
    CATEGORIES.forEach(c => {
      if (c.name.toLowerCase().includes(q) && !list.includes(c.name)) {
        list.push(c.name);
      }
    });
    
    // 2. Check matching brands
    PRODUCTS.forEach(p => {
      if (p.brand.toLowerCase().includes(q) && !list.includes(p.brand)) {
        list.push(p.brand);
      }
    });

    // 3. Extract matching terms from product titles
    PRODUCTS.forEach(p => {
      const words = p.name.split(' ');
      words.forEach(w => {
        const cleanWord = w.replace(/[^a-zA-Z]/g, '');
        if (cleanWord.length > 3 && cleanWord.toLowerCase().startsWith(q) && !list.includes(cleanWord)) {
          list.push(cleanWord);
        }
      });
    });

    return list.slice(0, 5); // Return top 5 matched terms
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
    setQuery(tag); // Pre-fill searchbar instead of immediate redirect
    inputRef.current?.focus();
  };

  const handleProductClick = (id) => {
    onClose();
    navigate(`/product/${id}`);
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
              placeholder="Search fresh fruits, dairy, bakery, snacks..."
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
                className="suggestion-tag-hover"
              >
                {sug}
              </button>
            ))}
          </div>
        )}

        {/* Dynamic Results vs Recommendations */}
        <div style={styles.body}>
          {query.trim() ? (
            <div style={styles.resultsSection}>
              <h4 style={styles.sectionTitle}>
                Search Results ({results.length})
              </h4>
              {results.length > 0 ? (
                <div style={styles.resultsList}>
                  {results.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleProductClick(product.id)}
                      style={styles.productRow}
                    >
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        style={styles.productImg} 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23EAF8F0"/><circle cx="50" cy="50" r="20" fill="%23FFFFFF"/><path d="M50 40 C44 48 44 56 50 64 C56 56 56 48 50 40 Z" fill="%2320B86B"/></svg>';
                        }}
                      />
                      <div style={styles.productInfo}>
                        <h4 style={styles.productName}>{product.name}</h4>
                        <span style={styles.productCategory}>{product.category} • {product.unit}</span>
                      </div>
                      <div style={styles.priceCol}>
                        <span style={styles.productPrice}>{product.price.toLocaleString()} RWF</span>
                        {product.discount > 0 && <span style={styles.discountBadge}>{product.discount}% OFF</span>}
                      </div>
                      <div style={styles.actionPrompt}>
                        <span style={{ fontSize: '11px', marginRight: '6px' }}>View</span>
                        <CornerDownLeft size={12} />
                      </div>
                    </div>
                  ))}
                  
                  {/* View All Results CTA */}
                  <button
                    onClick={handleSearchSubmit}
                    style={styles.viewAllBtn}
                  >
                    View all matching products <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                  </button>
                </div>
              ) : (
                <div style={styles.noResults}>
                  <p style={styles.noResultsText}>Hmm... we couldn't find matches for "{query}".</p>
                  <p style={styles.noResultsSub}>Try checking spelling or exploring popular categories below.</p>
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/shop');
                    }}
                    className="btn btn-outline"
                    style={{ marginTop: '12px' }}
                  >
                    Browse Entire Shop
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={styles.recommendationsGrid}>
              {/* Recent Searches */}
              <div>
                <h4 style={styles.sectionTitle}>
                  <History size={16} style={{ marginRight: '8px' }} />
                  Recent Searches
                </h4>
                <div style={styles.tagsContainer}>
                  {RECENT_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleTagClick(term)}
                      style={styles.tagBtn}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Searches */}
              <div style={{ marginTop: '32px' }}>
                <h4 style={styles.sectionTitle}>
                  <TrendingUp size={16} style={{ marginRight: '8px' }} />
                  Popular Searches
                </h4>
                <div style={styles.tagsContainer}>
                  {POPULAR_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleTagClick(term)}
                      style={styles.tagBtnPopular}
                    >
                      {term}
                    </button>
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
    backgroundColor: 'rgba(23, 37, 31, 0.6)',
    backdropFilter: 'blur(8px)',
    zIndex: 1060,
    animation: 'fadeIn 0.2s ease-out',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  content: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxHeight: '80vh',
    overflowY: 'auto',
    borderBottomLeftRadius: '32px',
    borderBottomRightRadius: '32px',
    boxShadow: '0 20px 60px rgba(8, 122, 75, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    animation: 'fadeInDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
  },
  searchBarWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '24px 40px',
    borderBottom: '1px solid var(--color-border)',
    maxWidth: 'var(--max-width)',
    margin: '0 auto',
    width: '100%',
    gap: '24px',
  },
  searchForm: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
    backgroundColor: '#F3F6F4',
    padding: '0 20px',
    borderRadius: '16px',
    border: '2px solid transparent',
    transition: 'all 0.2s',
  },
  searchInput: {
    width: '100%',
    height: '52px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--color-text)',
    border: 'none',
    outline: 'none',
    background: 'transparent',
  },
  clearBtn: {
    padding: '4px',
    borderRadius: '50%',
    backgroundColor: '#CBD5E1',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  closeBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--color-text-secondary)',
    cursor: 'pointer',
    backgroundColor: '#F3F6F4',
    padding: '12px 18px',
    borderRadius: '12px',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: '#EAEBE8',
      color: 'var(--color-text)',
    },
  },
  body: {
    maxWidth: 'var(--max-width)',
    margin: '0 auto',
    width: '100%',
    padding: '40px',
  },
  resultsSection: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: '800',
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
  },
  resultsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  productRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 20px',
    backgroundColor: '#FFFDF7',
    border: '1px solid var(--color-border)',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:hover': {
      borderColor: 'var(--color-primary)',
      backgroundColor: '#FFFFFF',
      transform: 'translateY(-2px)',
      boxShadow: 'var(--shadow-sm)',
    },
  },
  productImg: {
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    objectFit: 'cover',
    marginRight: '16px',
    border: '1px solid var(--color-border)',
  },
  productInfo: {
    flexGrow: 1,
  },
  productName: {
    fontSize: '15px',
    fontWeight: '700',
    color: 'var(--color-text)',
    margin: 0,
  },
  productCategory: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    marginTop: '2px',
  },
  priceCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginRight: '24px',
  },
  productPrice: {
    fontSize: '16px',
    fontWeight: '800',
    color: 'var(--color-text)',
  },
  discountBadge: {
    fontSize: '10px',
    fontWeight: '800',
    color: '#FF5A5F',
    backgroundColor: '#FFEBEB',
    padding: '2px 6px',
    borderRadius: '4px',
    marginTop: '2px',
  },
  actionPrompt: {
    display: 'flex',
    alignItems: 'center',
    color: 'var(--color-primary-dark)',
    fontWeight: '700',
  },
  viewAllBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '16px',
    borderRadius: '16px',
    backgroundColor: 'var(--color-primary-light)',
    color: 'var(--color-primary-dark)',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '12px',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: 'var(--color-primary)',
      color: '#FFFFFF',
    },
  },
  noResults: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  noResultsText: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--color-text)',
    marginBottom: '4px',
  },
  noResultsSub: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
  },
  recommendationsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  tagBtn: {
    padding: '10px 20px',
    borderRadius: '30px',
    border: '1.5px solid var(--color-border)',
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--color-text-secondary)',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:hover': {
      borderColor: 'var(--color-text)',
      color: 'var(--color-text)',
      backgroundColor: '#F3F6F4',
    },
  },
  tagBtnPopular: {
    padding: '10px 20px',
    borderRadius: '30px',
    border: '1.5px solid transparent',
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--color-primary-dark)',
    backgroundColor: 'var(--color-primary-light)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: 'var(--color-primary)',
      color: '#FFFFFF',
    },
  },
  suggestionsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    padding: '12px 40px 0 40px',
    maxWidth: 'var(--max-width)',
    margin: '0 auto',
    width: '100%',
  },
  suggestionsLabel: {
    fontSize: '12px',
    fontWeight: '800',
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginRight: '4px',
  },
  suggestionTag: {
    padding: '6px 14px',
    borderRadius: '20px',
    border: '1.5px solid var(--color-primary)',
    backgroundColor: 'var(--color-primary-light)',
    color: 'var(--color-primary-dark)',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};

export default SearchOverlay;

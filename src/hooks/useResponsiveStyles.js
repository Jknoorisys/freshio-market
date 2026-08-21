import { useState, useEffect } from 'react';

// Custom hook to listen to window width with slight debouncing to avoid layout thrashing
export function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    let timeoutId = null;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWidth(window.innerWidth);
      }, 50);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return width;
}

/**
 * Custom hook to dynamically resolve styles containing media queries.
 * @param {Object} stylesObject - The raw style definitions.
 * @returns {Object} The styles matching current window width.
 */
export function useResponsiveStyles(stylesObject) {
  const width = useWindowWidth();
  
  const resolved = {};
  for (const [componentKey, styleObj] of Object.entries(stylesObject)) {
    if (typeof styleObj === 'object' && styleObj !== null) {
      const baseStyle = {};
      const mediaRules = [];

      for (const [propKey, propVal] of Object.entries(styleObj)) {
        if (propKey.startsWith('@media')) {
          // Parse min-width and max-width from the media query
          const minMatch = propKey.match(/min-width:\s*(\d+)px/);
          const maxMatch = propKey.match(/max-width:\s*(\d+)px/);
          
          mediaRules.push({
            minWidth: minMatch ? parseInt(minMatch[1], 10) : 0,
            maxWidth: maxMatch ? parseInt(maxMatch[1], 10) : Infinity,
            styles: propVal
          });
        } else {
          baseStyle[propKey] = propVal;
        }
      }

      // Merge base styles with matching media query styles in correct order
      let finalStyle = { ...baseStyle };
      
      // Sort rules: min-width rules applied in ascending order; max-width rules in descending order
      mediaRules.sort((a, b) => {
        if (a.minWidth !== b.minWidth) return a.minWidth - b.minWidth;
        return b.maxWidth - a.maxWidth;
      });

      for (const rule of mediaRules) {
        if (width >= rule.minWidth && width <= rule.maxWidth) {
          finalStyle = { ...finalStyle, ...rule.styles };
        }
      }
      resolved[componentKey] = finalStyle;
    } else {
      resolved[componentKey] = styleObj;
    }
  }
  return resolved;
}

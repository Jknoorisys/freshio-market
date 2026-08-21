import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const excelPath = path.resolve(__dirname, '../../sawa_citi_products 2.xlsx');
console.log('Reading Excel file from:', excelPath);

const wb = xlsx.readFile(excelPath);
const sheet = wb.Sheets[wb.SheetNames[0]];
const raw = xlsx.utils.sheet_to_json(sheet);

console.log(`Loaded ${raw.length} raw products from Excel sheet.`);

const categoryMap = new Map();
const allTags = new Set();
const allBrands = new Set();

const products = raw.map((p, index) => {
  let tags = [];
  try {
    if (typeof p.tags === 'string' && p.tags.trim().startsWith('[')) {
      tags = JSON.parse(p.tags);
    } else if (Array.isArray(p.tags)) {
      tags = p.tags;
    } else if (p.tags) {
      tags = [String(p.tags).trim()];
    }
  } catch {
    tags = p.tags ? [String(p.tags).trim()] : [];
  }

  tags.forEach(t => allTags.add(t));
  if (p.brand) allBrands.add(String(p.brand).trim());

  let imageUrls = [];
  try {
    if (typeof p.image_urls === 'string' && p.image_urls.trim().startsWith('[')) {
      imageUrls = JSON.parse(p.image_urls);
    } else if (Array.isArray(p.image_urls)) {
      imageUrls = p.image_urls;
    }
  } catch {
    imageUrls = [];
  }

  const price = Number(p.price_rwf) || 0;
  const wasPrice = (p.was_price_rwf !== '' && p.was_price_rwf !== undefined && p.was_price_rwf !== null && Number(p.was_price_rwf) > 0) 
    ? Number(p.was_price_rwf) 
    : null;
  const originalPrice = (wasPrice && wasPrice > price) ? wasPrice : price;
  const discount = (originalPrice > price) ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const sku = String(p.sku || 'SKU' + p.id).trim();
  const name = String(p.name || '').trim();
  const catSlug = String(p.category_slug || 'groceries').trim();
  const catName = String(p.category_name || 'Groceries').trim();
  const catEmoji = String(p.category_emoji || '🛒').trim();
  const catId = Number(p.category_id) || 1;

  if (!categoryMap.has(catSlug)) {
    categoryMap.set(catSlug, {
      id: catSlug,
      categoryId: catId,
      name: catName,
      slug: catSlug,
      emoji: catEmoji,
      count: 0
    });
  }
  categoryMap.get(catSlug).count++;

  // Clean URL slug
  const slug = (sku ? sku.toLowerCase() + '-' : '') + name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  // Extract unit if sizeLabel is empty
  const unitMatch = name.match(/(\d+(?:\.\d+)?\s*(?:kg|g|mg|l|ml|cl|pack|pk|pcs|sheets|caps|tabs|tb|cm|mm|m))\b/i);
  const sizeLabel = String(p.size_label || '').trim();
  const unit = sizeLabel || (unitMatch ? unitMatch[0] : '1 unit');

  const isFeatured = tags.includes('bestseller') || tags.includes('featured') || (index % 30 === 0);
  const isDeal = discount > 0 || tags.includes('deal') || tags.includes('sale');

  const imageUrl = String(p.image_url || '').trim();

  return {
    id: String(p.id),
    sku: sku,
    name: name,
    slug: slug,
    brand: String(p.brand || 'Sawa Citi').trim(),
    description: String(p.description || `${name}. Available at all 8 Sawa Citi branches across Kigali.`).trim(),
    categoryId: catId,
    categoryName: catName,
    categorySlug: catSlug,
    categoryEmoji: catEmoji,
    category: catName,
    subcategory: tags.length > 0 ? tags[0] : catName,
    price: price,
    priceRwf: price,
    originalPrice: originalPrice,
    wasPriceRwf: wasPrice,
    discount: discount,
    sizeLabel: sizeLabel,
    unit: unit,
    image: imageUrl,
    imageUrl: imageUrl,
    imageUrls: imageUrls.length > 0 ? imageUrls : [imageUrl].filter(Boolean),
    stock: typeof p.stock_count === 'number' ? p.stock_count : (parseInt(p.stock_count, 10) || 50),
    stockCount: typeof p.stock_count === 'number' ? p.stock_count : (parseInt(p.stock_count, 10) || 50),
    isActive: p.is_active === true || p.is_active === 'true' || p.is_active === 1 || p.is_active === '1',
    tags: tags,
    emoji: String(p.emoji || '🛍️').trim(),
    isokkoId: String(p.isokko_id || '').trim(),
    createdAt: String(p.created_at || ''),
    updatedAt: String(p.updated_at || ''),
    searchVector: String(p.search_vector || ''),
    rating: Number((4.3 + ((index % 7) * 0.1)).toFixed(1)),
    reviews: 12 + (index % 68),
    isFeatured: isFeatured,
    isDeal: isDeal
  };
});

const colorMap = {
  'groceries': { color: '#FEF1C9', borderColor: '#FBEAD2', desc: 'Pantry staples, grains, breakfast cereals, spices and daily food items.' },
  'fresh-produce': { color: '#EAF8F0', borderColor: '#CDEEDD', desc: 'Fresh vegetables and local fruits harvested from Musanze and Rulindo hills.' },
  'meat-fish': { color: '#FFEAF2', borderColor: '#FCDAD7', desc: 'Fresh local beef cuts, poultry, sausages, and Lake Kivu catches.' },
  'beverages': { color: '#EBFCEE', borderColor: '#DFE7FB', desc: 'Inyange juices, teas, coffees, carbonated sodas, and mineral water.' },
  'wines-spirits': { color: '#F7EEF8', borderColor: '#EAD7EC', desc: 'Fine wines, whiskies, gins, champagnes, beers, and imported spirits.' },
  'snacks': { color: '#FFF4EA', borderColor: '#FADFCF', desc: 'Crisps, chips, sweets, chocolates, biscuits, and roasted nuts.' },
  'dairy': { color: '#E1F7F5', borderColor: '#CBEBE8', desc: 'Inyange fresh milk, Masaka yogurts, cheeses, and frozen delights.' },
  'household': { color: '#EBF5FB', borderColor: '#D2EDE9', desc: 'Sulfo cleaning detergents, dishwashers, laundry supplies, and paper towels.' },
  'beauty': { color: '#FDEDEC', borderColor: '#FCD7DF', desc: 'Body soaps, shampoos, skincare lotions, deodorants, and cosmetics.' },
  'baby': { color: '#FEF9E7', borderColor: '#FBEAD2', desc: 'Baby formulas, diapers, wipes, and gentle baby nutrition care.' },
  'kitchen': { color: '#F4F6F8', borderColor: '#DFE3E8', desc: 'Cookware, dining utensils, storage containers, and kitchen accessories.' },
  'electronics': { color: '#EEF2FF', borderColor: '#D9E2FC', desc: 'Batteries, charging cables, adapters, and home electronic essentials.' }
};

const categories = Array.from(categoryMap.values()).map(c => {
  const meta = colorMap[c.slug] || { color: '#F0F9FF', borderColor: '#BAE6FD', desc: 'Quality supermarket essentials delivered across Kigali.' };
  return {
    id: c.slug,
    categoryId: c.categoryId,
    name: c.name,
    slug: c.slug,
    emoji: c.emoji,
    itemCount: `${c.count}+ Items`,
    totalCount: c.count,
    color: meta.color,
    borderColor: meta.borderColor,
    description: meta.desc
  };
});

// Output products.json
const jsonPath = path.resolve(__dirname, 'products.json');
fs.writeFileSync(jsonPath, JSON.stringify(products));
console.log(`Saved ${products.length} products to:`, jsonPath);

// Output summary
console.log('Categories generated:', categories.length);
console.log('Total Brands:', allBrands.size);
console.log('Total Tags:', allTags.size);

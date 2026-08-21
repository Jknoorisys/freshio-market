// Freshio Kigali Mock Database - Localized Rwanda Sawa Citi Products Dataset
import PRODUCTS_DATA from './products.json';

export const CATEGORIES = [
  {
    id: 'groceries',
    categoryId: 1,
    name: 'Groceries',
    slug: 'groceries',
    emoji: '🛒',
    itemCount: '1,834 Items',
    totalCount: 1834,
    color: '#FEF1C9',
    borderColor: '#FBEAD2',
    description: 'Pantry staples, grains, breakfast cereals, spices, pasta, sauces and daily food essentials.'
  },
  {
    id: 'fresh-produce',
    categoryId: 2,
    name: 'Fresh Produce',
    slug: 'fresh-produce',
    emoji: '🥬',
    itemCount: '209 Items',
    totalCount: 209,
    color: '#EAF8F0',
    borderColor: '#CDEEDD',
    description: 'Fresh vegetables, herbs, and local fruits harvested from Musanze, Rulindo, and Rwamagana groves.'
  },
  {
    id: 'meat-fish',
    categoryId: 3,
    name: 'Meat & Fish',
    slug: 'meat-fish',
    emoji: '🍗',
    itemCount: '113 Items',
    totalCount: 113,
    color: '#FFEAF2',
    borderColor: '#FCDAD7',
    description: 'Fresh local beef cuts, sausages, poultry, and fresh Lake Kivu Tilapia fish.'
  },
  {
    id: 'beverages',
    categoryId: 4,
    name: 'Beverages',
    slug: 'beverages',
    emoji: '🥤',
    itemCount: '537 Items',
    totalCount: 537,
    color: '#EBFCEE',
    borderColor: '#DFE7FB',
    description: 'Inyange fruit juices, local Rwandan teas, Huye Mountain coffee, carbonated drinks, and mineral water.'
  },
  {
    id: 'wines-spirits',
    categoryId: 5,
    name: 'Wines & Spirits',
    slug: 'wines-spirits',
    emoji: '🍷',
    itemCount: '418 Items',
    totalCount: 418,
    color: '#F7EEF8',
    borderColor: '#EAD7EC',
    description: 'Fine red & white wines, whiskies, cognacs, gins, champagnes, local beers, and imported spirits.'
  },
  {
    id: 'snacks',
    categoryId: 6,
    name: 'Snacks & Sweets',
    slug: 'snacks',
    emoji: '🍫',
    itemCount: '230 Items',
    totalCount: 230,
    color: '#FFF4EA',
    borderColor: '#FADFCF',
    description: 'Potato crisps, savory chips, gourmet chocolates, sweet biscuits, wafers, and roasted nuts.'
  },
  {
    id: 'dairy',
    categoryId: 7,
    name: 'Dairy & Frozen',
    slug: 'dairy',
    emoji: '🧀',
    itemCount: '273 Items',
    totalCount: 273,
    color: '#E1F7F5',
    borderColor: '#CBEBE8',
    description: 'Inyange fresh milk, Masaka yogurts, artisanal cheeses, butter, and quick frozen foods.'
  },
  {
    id: 'household',
    categoryId: 8,
    name: 'Household',
    slug: 'household',
    emoji: '🧺',
    itemCount: '474 Items',
    totalCount: 474,
    color: '#EBF5FB',
    borderColor: '#D2EDE9',
    description: 'Sulfo detergents, cleaning soaps, dishwashers, laundry supplies, insect repellents, and paper rolls.'
  },
  {
    id: 'beauty',
    categoryId: 9,
    name: 'Beauty & Care',
    slug: 'beauty',
    emoji: '💄',
    itemCount: '401 Items',
    totalCount: 401,
    color: '#FDEDEC',
    borderColor: '#FCD7DF',
    description: 'Personal hygiene soaps, shampoos, skincare lotions, deodorants, perfumes, and grooming items.'
  },
  {
    id: 'baby',
    categoryId: 10,
    name: 'Baby & Kids',
    slug: 'baby',
    emoji: '🍼',
    itemCount: '100 Items',
    totalCount: 100,
    color: '#FEF9E7',
    borderColor: '#FBEAD2',
    description: 'Nutritional baby formulas, gentle cereals, diapers, wet wipes, and infant care essentials.'
  },
  {
    id: 'kitchen',
    categoryId: 11,
    name: 'Home & Kitchen',
    slug: 'kitchen',
    emoji: '🍽️',
    itemCount: '96 Items',
    totalCount: 96,
    color: '#F4F6F8',
    borderColor: '#DFE3E8',
    description: 'Cookware, food containers, kitchen utensils, tableware, napkins, and dining accessories.'
  },
  {
    id: 'electronics',
    categoryId: 12,
    name: 'Electronics',
    slug: 'electronics',
    emoji: '🔌',
    itemCount: '9 Items',
    totalCount: 9,
    color: '#EEF2FF',
    borderColor: '#D9E2FC',
    description: 'Batteries, chargers, cables, extension sockets, and portable home electronic essentials.'
  }
];

// Slugs compatibility alias map for legacy URLs
export const CATEGORY_ALIASES = {
  'fruits-vegetables': 'fresh-produce',
  'dairy-eggs': 'dairy',
  'bakery': 'groceries',
  'meat-seafood': 'meat-fish',
  'pantry': 'groceries',
  'personal-care': 'beauty',
  'baby-care': 'baby'
};

// All 4,694 products from sawa_citi_products 2.xlsx
export const PRODUCTS = PRODUCTS_DATA;

// Helper to look up a product by ID, SKU, or Slug
export const findProduct = (identifier) => {
  if (!identifier) return null;
  const strId = String(identifier).trim().toLowerCase();
  return (
    PRODUCTS.find(p => p.id === strId) ||
    PRODUCTS.find(p => p.sku && p.sku.toLowerCase() === strId) ||
    PRODUCTS.find(p => p.slug && p.slug.toLowerCase() === strId) ||
    null
  );
};

// Store locations in Kigali
export const STORES = [
  {
    id: 's1',
    name: 'Sawa Citi Kigali Heights',
    address: 'Kigali Heights Building, Ground Floor, KG 7 Ave, Kimihurura, Kigali',
    hours: '08:00 AM - 10:00 PM',
    phone: '+250 788 310 120',
    lat: -1.9542,
    lng: 30.0934,
    distance: '2.4 km away',
    services: ['Delivery', 'Pickup', 'Parking', 'Bakery & Deli'],
    description: 'Our flagship store inside Kigali Heights. Features fresh deli, local organic produce stands, and imported delicacies.',
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 's2',
    name: 'Sawa Citi Downtown Kiyovu',
    address: 'Kigali Downtown Mall, Block A, KN 3 Rd, Kiyovu, Kigali',
    hours: '07:30 AM - 11:00 PM',
    phone: '+250 789 440 220',
    lat: -1.9448,
    lng: 30.0618,
    distance: '4.1 km away',
    services: ['Delivery', 'Pickup', 'Parking'],
    description: 'Central shopping location in the heart of CBD, carrying fresh butchery cuts and everyday pantry supplies.',
    image: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 's3',
    name: 'Sawa Citi Nyarutarama',
    address: 'MTN Center Mall area, KG 9 Ave, Nyarutarama, Kigali',
    hours: '08:00 AM - 10:00 PM',
    phone: '+250 788 600 500',
    lat: -1.9362,
    lng: 30.0998,
    distance: '6.8 km away',
    services: ['Delivery', 'Parking', 'EV Charging'],
    description: 'Premium supermarket stocking fine wines & spirits, organic imports, and gourmet bakery goods.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 's4',
    name: 'Sawa Citi Gishushu Express',
    address: 'Gishushu Junction, Near Parliament Road, KG 12 Ave, Kigali',
    hours: '06:00 AM - Midnight',
    phone: '+250 788 120 440',
    lat: -1.9568,
    lng: 30.0881,
    distance: '10.5 km away',
    services: ['Delivery', 'Pickup', 'Drive-Thru'],
    description: 'Compact express store specializing in swift click-and-collect orders and instant grocery delivery runs.',
    image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=600&q=80'
  }
];

export const FAQS = [
  {
    id: 'faq1',
    question: 'How does Kigali delivery work?',
    answer: 'Once you place your order, our professional shoppers select products directly from our shelves across Sawa Citi branches. Items are packed in temperature-controlled bags and delivered to your doorstep in under 2 hours via our Kigali courier fleet.'
  },
  {
    id: 'faq2',
    question: 'What areas of Kigali do you deliver to?',
    answer: 'We deliver to all sectors of Kigali, including Kiyovu, Nyarutarama, Kimihurura, Gacuriro, Remera, Kacyiru, Kibagabaga, Kanombe, and Nyamirambo. Enter your location at the top of the page to check service times.'
  },
  {
    id: 'faq3',
    question: 'Can I pay via Mobile Money?',
    answer: 'Yes! We fully support MTN MoMo and Airtel Money checkouts directly inside the app, as well as Cash or MoMo on Delivery.'
  },
  {
    id: 'faq4',
    question: 'What is the Freshio+ Kigali program?',
    answer: 'Freshio+ Kigali is our loyalty subscription. For 2,999 RWF/month, members receive unlimited free delivery on all orders above 15,000 RWF, early access to new rollouts, and double reward points.'
  }
];

export const RECENT_SEARCHES = ['Everyday Cornflakes', 'Azam Wheat Flour', 'Inyange Milk', 'Sulfo Soap', 'Passion Fruits'];
export const POPULAR_SEARCHES = ['Cornflakes', 'Flour', 'Juice', 'Wine', 'Fresh Fruits', 'Snacks'];

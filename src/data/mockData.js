// Freshio Kigali Mock Database - Fully Localized Rwanda Dataset

export const CATEGORIES = [
  {
    id: 'fruits-vegetables',
    name: 'Fresh Produce',
    slug: 'fruits-vegetables',
    itemCount: '300+ Items',
    color: '#FEF1C9', // Yellowish circle theme matching image
    borderColor: '#FBEAD2',
    description: 'Fresh vegetables and local fruits harvested from Musanze and Rulindo hills.'
  },
  {
    id: 'dairy-eggs',
    name: 'Dairy & Eggs',
    slug: 'dairy-eggs',
    itemCount: '150+ Items',
    color: '#E1F7F5', // Light blue/cyan circle theme
    borderColor: '#CBEBE8',
    description: 'Inyange fresh milk, Masaka yogurts, and local farm-fresh eggs.'
  },
  {
    id: 'bakery',
    name: 'Bakery',
    slug: 'bakery',
    itemCount: '120+ Items',
    color: '#FFF0D4', // Warm gold/orange circle theme
    borderColor: '#F9E2D2',
    description: 'Artisanal breads, baguettes, and sweet pastries baked fresh in Kigali.'
  },
  {
    id: 'meat-seafood',
    name: 'Meat & Fish',
    slug: 'meat-fish',
    itemCount: '180+ Items',
    color: '#FFEAF2', // Pink/red circle theme
    borderColor: '#FCDAD7',
    description: 'Nyamata premium beef cuts and fresh Lake Kivu Tilapia.'
  },
  {
    id: 'beverages',
    name: 'Beverages',
    slug: 'beverages',
    itemCount: '200+ Items',
    color: '#EBFCEE', // Green circle theme
    borderColor: '#DFE7FB',
    description: 'Inyange juices, local ginger tea, Huye Mountain coffee, and water.'
  },
  {
    id: 'snacks',
    name: 'Snacks',
    slug: 'snacks',
    itemCount: '250+ Items',
    color: '#FFF4EA', // Light orange/yellow circle theme
    borderColor: '#FADFCF',
    description: 'Sina Gerard biscuits, roasted macadamia nuts, and local dark chocolates.'
  },
  {
    id: 'pantry',
    name: 'Pantry',
    slug: 'pantry',
    itemCount: '400+ Items',
    color: '#EDF8F5', // Mint green circle theme
    borderColor: '#EAE2D5',
    description: 'Bugarama local rice, Nyungwe forest honey, and Akabanga chili oil.'
  },
  {
    id: 'household',
    name: 'Household',
    slug: 'household',
    itemCount: '300+ Items',
    color: '#EBF5FB', // Cool blue circle theme
    borderColor: '#D2EDE9',
    description: 'Sulfo cleaning detergents, bamboo paper rolls, and matches.'
  },
  {
    id: 'personal-care',
    name: 'Personal Care',
    slug: 'personal-care',
    itemCount: '250+ Items',
    color: '#FDEDEC', // Soft red/pink circle theme
    borderColor: '#FCD7DF',
    description: 'Sulfo body soaps, natural glycerine, and organic shea butter tubs.'
  },
  {
    id: 'baby-care',
    name: 'Baby Care',
    slug: 'baby-care',
    itemCount: '180+ Items',
    color: '#FEF9E7', // Cream yellow circle theme
    borderColor: '#FBEAD2',
    description: 'Hypoallergenic baby formula, diapers, and baby powder from Inyange.'
  }
];

export const PRODUCTS = [
  // FRESH PRODUCE
  {
    id: 'p1',
    name: 'Organic Hass Avocados',
    category: 'Fresh Produce',
    subcategory: 'Fruits',
    description: 'Rich and buttery organic avocados harvested from orchards in Musanze. Perfect for breakfast toast or local salads.',
    price: 1200,
    originalPrice: 1600,
    discount: 25,
    rating: 4.8,
    reviews: 124,
    unit: 'pack of 2',
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80',
    brand: 'Musanze Organic',
    stock: 25,
    isFeatured: true,
    isDeal: true
  },
  {
    id: 'p2',
    name: 'Sweet Organic Bananas (Kamaramasenge)',
    category: 'Fresh Produce',
    subcategory: 'Fruits',
    description: 'Sun-ripened, highly aromatic sweet local bananas sourced from Rwamagana groves. Plump and naturally sweet.',
    price: 800,
    originalPrice: 1000,
    discount: 20,
    rating: 4.7,
    reviews: 86,
    unit: 'bunch (approx 1kg)',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
    brand: 'Rwamagana Groves',
    stock: 45,
    isFeatured: true,
    isDeal: true
  },
  {
    id: 'p3',
    name: 'Cherry Tomatoes on the Vine',
    category: 'Fresh Produce',
    subcategory: 'Vegetables',
    description: 'Juicy, vine-ripened local cherry tomatoes grown in Rulindo greenhouses. Crisp skin and sweet flesh.',
    price: 1500,
    originalPrice: 1800,
    discount: 16,
    rating: 4.6,
    reviews: 48,
    unit: '250g pack',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    brand: 'Rulindo Greenhouse',
    stock: 18,
    isFeatured: true,
    isDeal: false
  },
  {
    id: 'p4',
    name: 'Musanze Irish Potatoes (Kinigi)',
    category: 'Fresh Produce',
    subcategory: 'Vegetables',
    description: 'Authentic Kinigi Irish potatoes from the rich volcanic soil of Musanze. Perfect texture for boiling, mashing, or chips.',
    price: 1400,
    originalPrice: 1800,
    discount: 22,
    rating: 4.9,
    reviews: 142,
    unit: '2kg bag',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
    brand: 'Musanze Harvest',
    stock: 50,
    isFeatured: true,
    isDeal: true
  },
  {
    id: 'p5',
    name: 'Igitoki (Green Cooking Bananas)',
    category: 'Fresh Produce',
    subcategory: 'Vegetables',
    description: 'Freshly harvested green cooking bananas from Gakenke. The staple ingredient for traditional Rwandan plantain stews.',
    price: 900,
    originalPrice: 1200,
    discount: 25,
    rating: 4.8,
    reviews: 67,
    unit: '1kg bunch',
    image: 'https://images.unsplash.com/photo-1566393028639-d108a42c46a7?auto=format&fit=crop&w=600&q=80',
    brand: 'Gakenke Farms',
    stock: 35,
    isFeatured: false,
    isDeal: false
  },
  {
    id: 'p6',
    name: 'Local Tree Tomatoes (Tamarillo)',
    category: 'Fresh Produce',
    subcategory: 'Fruits',
    description: 'Fresh, tangy, and red local tree tomatoes (Ibinyomoro) grown in Northern Province. Excellent for fresh juices.',
    price: 1800,
    originalPrice: 2200,
    discount: 18,
    rating: 4.7,
    reviews: 53,
    unit: '1kg pack',
    image: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=600&q=80',
    brand: 'Rulindo Farms',
    stock: 22,
    isFeatured: true,
    isDeal: false
  },

  // DAIRY & EGGS
  {
    id: 'p9',
    name: 'Inyange Fresh Whole Milk 1L',
    category: 'Dairy & Eggs',
    subcategory: 'Milk',
    description: '100% pure pasteurized fresh milk from Inyange Industries. Rich in calcium and vitamins, Kigali\'s favorite brand.',
    price: 1100,
    originalPrice: 1300,
    discount: 15,
    rating: 4.9,
    reviews: 218,
    unit: '1L bottle',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80',
    brand: 'Inyange Industries',
    stock: 40,
    isFeatured: true,
    isDeal: false
  },
  {
    id: 'p10',
    name: 'Masaka Strawberry Yogurt 250ml',
    category: 'Dairy & Eggs',
    subcategory: 'Yogurt',
    description: 'Thick, creamy strawberry drinking yogurt produced locally by Masaka Creamery. High-quality standards.',
    price: 900,
    originalPrice: 1100,
    discount: 18,
    rating: 4.8,
    reviews: 95,
    unit: '250ml cup',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
    brand: 'Masaka Creamery',
    stock: 30,
    isFeatured: false,
    isDeal: true
  },
  {
    id: 'p11',
    name: 'Gishwati Salted Butter',
    category: 'Dairy & Eggs',
    subcategory: 'Butter',
    description: 'Rich and creamy salted butter churned from milk sourced from Gishwati forest pastures. Deep golden color.',
    price: 3500,
    originalPrice: 4000,
    discount: 12,
    rating: 4.7,
    reviews: 79,
    unit: '250g block',
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80',
    brand: 'Gishwati Dairy',
    stock: 20,
    isFeatured: false,
    isDeal: false
  },
  {
    id: 'p12',
    name: 'Local Free-Range Farm Eggs',
    category: 'Dairy & Eggs',
    subcategory: 'Eggs',
    description: 'Fresh local farm eggs from free-roaming chickens raised in Bugesera. Large size, yellow yolks.',
    price: 2200,
    originalPrice: 2600,
    discount: 15,
    rating: 4.8,
    reviews: 114,
    unit: 'carton of 12',
    image: 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=600&q=80',
    brand: 'Bugesera Farm',
    stock: 25,
    isFeatured: true,
    isDeal: true
  },

  // MEAT & FISH
  {
    id: 'p14',
    name: 'Nyamata Premium Ground Beef',
    category: 'Meat & Fish',
    subcategory: 'Meat',
    description: 'Freshly minced grass-fed lean beef sourced from cattle farms in Nyamata. Tender, juicy, and hormone-free.',
    price: 4500,
    originalPrice: 5000,
    discount: 10,
    rating: 4.8,
    reviews: 132,
    unit: '500g pack',
    image: 'https://images.unsplash.com/photo-1551028150-64b9f398f678?auto=format&fit=crop&w=600&q=80',
    brand: 'Nyamata Beef',
    stock: 15,
    isFeatured: false,
    isDeal: false
  },
  {
    id: 'p15',
    name: 'Fresh Lake Kivu Tilapia Fillet',
    category: 'Meat & Fish',
    subcategory: 'Seafood',
    description: 'Fresh Tilapia fillets sourced directly from Lake Kivu fishermen. Cleaned, scaled, skinless, ready for cooking.',
    price: 6500,
    originalPrice: 7500,
    discount: 13,
    rating: 4.9,
    reviews: 90,
    unit: '500g pack',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80',
    brand: 'Lake Kivu Catch',
    stock: 12,
    isFeatured: true,
    isDeal: false
  },

  // BAKERY
  {
    id: 'p17',
    name: 'Artisanal French Crusty Baguette',
    category: 'Bakery',
    subcategory: 'Bread',
    description: 'Freshly baked using traditional methods, featuring a crunchy golden crust and light, airy interior. Kigali\'s breakfast favorite.',
    price: 1000,
    originalPrice: 1200,
    discount: 16,
    rating: 4.8,
    reviews: 84,
    unit: '1 unit',
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=600&q=80',
    brand: 'Kigali French Bakery',
    stock: 20,
    isFeatured: true,
    isDeal: false
  },
  {
    id: 'p18',
    name: 'Masaka Butter Croissants',
    category: 'Bakery',
    subcategory: 'Pastries',
    description: 'Crispy flaky French puff pastries baked with premium Masaka creamery butter. Buttery, soft layers.',
    price: 3600,
    originalPrice: 4500,
    discount: 20,
    rating: 4.8,
    reviews: 73,
    unit: 'pack of 3',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
    brand: 'Kigali French Bakery',
    stock: 10,
    isFeatured: true,
    isDeal: true
  },

  // BEVERAGES
  {
    id: 'p20',
    name: 'Inyange Passion Fruit Juice 1L',
    category: 'Beverages',
    subcategory: 'Juices',
    description: '100% fresh passion fruit juice manufactured by Inyange. Refreshing local taste, packed with vitamin C.',
    price: 2200,
    originalPrice: 2600,
    discount: 15,
    rating: 4.7,
    reviews: 62,
    unit: '1L carton',
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=600&q=80',
    brand: 'Inyange Industries',
    stock: 15,
    isFeatured: true,
    isDeal: false
  },
  {
    id: 'p21',
    name: 'Huye Mountain Bourbon Coffee Ground',
    category: 'Beverages',
    subcategory: 'Coffee',
    description: 'Award-winning Bourbon Arabica coffee grown on Huye Mountain slopes. Rich medium roast, hints of chocolate and sweet berries.',
    price: 7500,
    originalPrice: 9000,
    discount: 16,
    rating: 4.9,
    reviews: 154,
    unit: '250g pack',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=600&q=80',
    brand: 'Huye Mountain Coffee',
    stock: 20,
    isFeatured: true,
    isDeal: true
  },

  // PANTRY & SNACKS
  {
    id: 'p26',
    name: 'Akabanga Chili Oil 100ml',
    category: 'Pantry',
    subcategory: 'Condiments',
    description: 'The famous Rwandan hot chili oil dropper from Sina Gerard. Extremely spicy, adds a unique aromatic heat to any meal.',
    price: 2000,
    originalPrice: 2500,
    discount: 20,
    rating: 4.9,
    reviews: 320,
    unit: '100ml dropper bottle',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
    brand: 'Sina Gerard (Urwibutso)',
    stock: 60,
    isFeatured: true,
    isDeal: true
  },
  {
    id: 'p27',
    name: 'Nyungwe Wild Forest Honey',
    category: 'Pantry',
    subcategory: 'Sweeteners',
    description: '100% raw, organic wildflower honey harvested sustainably from the boundaries of Nyungwe Forest national park.',
    price: 3800,
    originalPrice: 4500,
    discount: 15,
    rating: 4.8,
    reviews: 148,
    unit: '500g jar',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
    brand: 'Nyungwe Beekeepers',
    stock: 25,
    isFeatured: true,
    isDeal: false
  },
  {
    id: 'p28',
    name: 'Sina Gerard Urwibutso Ginger Biscuits',
    category: 'Snacks',
    subcategory: 'Biscuits',
    description: 'Crisp, spicy ginger biscuits made from local wheat and ginger. Kigali\'s absolute favorite tea time companion.',
    price: 1500,
    originalPrice: 1800,
    discount: 16,
    rating: 4.6,
    reviews: 82,
    unit: '300g family pack',
    image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bb087?auto=format&fit=crop&w=600&q=80',
    brand: 'Sina Gerard (Urwibutso)',
    stock: 40,
    isFeatured: false,
    isDeal: false
  },

  // HOUSEHOLD & PERSONAL CARE
  {
    id: 'p31',
    name: 'Sulfo Tembo Bar Soap 1kg',
    category: 'Personal Care',
    subcategory: 'Hygiene',
    description: 'Traditional multi-purpose cleaning and bathing soap manufactured in Kigali by Sulfo Rwanda. Gentle and long-lasting.',
    price: 1500,
    originalPrice: 1800,
    discount: 16,
    rating: 4.5,
    reviews: 104,
    unit: '1kg bar block',
    image: 'https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&w=600&q=80',
    brand: 'Sulfo Rwanda',
    stock: 50,
    isFeatured: false,
    isDeal: false
  },

  // BABY CARE
  {
    id: 'p33',
    name: 'Inyange Premium Baby Formula',
    category: 'Baby Care',
    subcategory: 'Nutrition',
    description: 'Gentle baby formula milk powder fortified with vitamins and minerals, produced locally by Inyange Dairy division.',
    price: 9500,
    originalPrice: 11000,
    discount: 13,
    rating: 4.8,
    reviews: 42,
    unit: '400g can',
    image: 'https://images.unsplash.com/photo-1522850959074-b78b5f31ffc6?auto=format&fit=crop&w=600&q=80',
    brand: 'Inyange Industries',
    stock: 15,
    isFeatured: true,
    isDeal: false
  }
];

export const STORES = [
  {
    id: 's1',
    name: 'Freshio Kigali Heights',
    address: 'Kigali Heights Building, Ground Floor, KG 7 Ave, Kimihurura, Kigali',
    hours: '08:00 AM - 10:00 PM',
    phone: '+250 788 310 120',
    lat: -1.9542,
    lng: 30.0934,
    distance: '2.4 km away',
    services: ['Delivery', 'Pickup', 'Parking', 'Organic Cafe'],
    description: 'Our flagship store inside Kigali Heights. Features an Inyange fresh juice bar, local organic produce stands, and Gishwati cheese corner.',
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 's2',
    name: 'Freshio Downtown Kiyovu',
    address: 'Kigali Downtown Mall, Block A, KN 3 Rd, Kiyovu, Kigali',
    hours: '07:30 AM - 11:00 PM',
    phone: '+250 789 440 220',
    lat: -1.9448,
    lng: 30.0618,
    distance: '4.1 km away',
    services: ['Delivery', 'Pickup', 'Parking'],
    description: 'Perfect shopping location in the heart of CBD, carrying fresh Lake Kivu catches and premium Nyamata beef blocks.',
    image: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 's3',
    name: 'Freshio Nyarutarama Heights',
    address: 'MTN Center Mall area, KG 9 Ave, Nyarutarama, Kigali',
    hours: '08:00 AM - 10:00 PM',
    phone: '+250 788 600 500',
    lat: -1.9362,
    lng: 30.0998,
    distance: '6.8 km away',
    services: ['Delivery', 'Parking', 'EV Charging'],
    description: 'Premium boutique supermarket stocking organic imports, local gourmet Gishwati butter, and organic wellness lines.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 's4',
    name: 'Freshio Gishushu Express',
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
    answer: 'Once you place your order, our professional shoppers select products directly from our shelves. Items are packed in temperature-controlled bags and delivered to your doorstep in under 2 hours via our Kigali courier fleet.'
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
    answer: 'Freshio+ Kigali is our loyalty subscription. For 2,999 RWF/month, members receive unlimited free delivery on all orders above 15,000 RWF, early access to new Gishwati cheese rollouts, and double reward points.'
  }
];

export const RECENT_SEARCHES = ['Inyange Milk', 'Akabanga', 'Musanze Potatoes'];
export const POPULAR_SEARCHES = ['Fresh vegetables', 'Yogurt', 'Snacks', 'Lake Tilapia'];

/**
 * seed.js – Seeds the database with categories, products, and a default user.
 * Run: node server/seed.js
 */
import db from './db.js';
import bcrypt from 'bcryptjs';

// ─── Default User ──────────────────────────────────────────
function seedUser() {
  const existing = db.prepare('SELECT id FROM users WHERE id = 1').get();
  if (!existing) {
    db.prepare(
      'INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)'
    ).run(1, 'John Doe', 'john@example.com', bcrypt.hashSync('password123', 10));
    console.log('✅ Default user created (id:1, John Doe)');
  } else {
    console.log('↩️  Default user already exists.');
  }
}

// ─── Categories ────────────────────────────────────────────
const CATEGORIES = [
  { name: 'Electronics', image_url: 'https://picsum.photos/seed/electronics/400/300' },
  { name: 'Books', image_url: 'https://picsum.photos/seed/books/400/300' },
  { name: 'Clothing', image_url: 'https://picsum.photos/seed/clothing/400/300' },
  { name: 'Home & Kitchen', image_url: 'https://picsum.photos/seed/homekitchen/400/300' },
  { name: 'Sports', image_url: 'https://picsum.photos/seed/sports/400/300' },
  { name: 'Beauty', image_url: 'https://picsum.photos/seed/beauty/400/300' },
];

function seedCategories() {
  const count = db.prepare('SELECT COUNT(*) as c FROM categories').get().c;
  if (count > 0) {
    console.log(`↩️  Categories already seeded (${count}).`);
    return;
  }
  const insert = db.prepare('INSERT INTO categories (name, image_url) VALUES (?, ?)');
  const tx = db.transaction(() => {
    for (const cat of CATEGORIES) {
      insert.run(cat.name, cat.image_url);
    }
  });
  tx();
  console.log(`✅ Seeded ${CATEGORIES.length} categories.`);
}

// ─── Products ──────────────────────────────────────────────
// 30+ realistic products across 6 categories
const PRODUCTS = [
  // ── Electronics (category_id: 1) ──
  { name: 'Apple MacBook Air M2 Laptop', description: '13.6-inch Liquid Retina display, 8GB unified memory, 256GB SSD storage, 1080p FaceTime HD camera, MagSafe charging. All-day battery life up to 18 hours.', price: 82999, stock: 45, category_id: 1, rating: 4.8, review_count: 2340, seed: 'macbook' },
  { name: 'Sony WH-1000XM5 Wireless Headphones', description: 'Industry-leading noise cancellation with Auto NC Optimizer, crystal clear hands-free calling, 30-hour battery life, ultra-comfortable design, multipoint connection.', price: 28990, stock: 120, category_id: 1, rating: 4.7, review_count: 1856, seed: 'headphones' },
  { name: 'Samsung Galaxy S24 Ultra', description: '6.8-inch Dynamic AMOLED 2X display, 200MP camera, Galaxy AI built-in, Snapdragon 8 Gen 3, 5000mAh battery, S Pen included, titanium frame.', price: 109999, stock: 67, category_id: 1, rating: 4.6, review_count: 3102, seed: 'phone' },
  { name: 'iPad Pro 12.9-inch M2 Chip', description: 'Liquid Retina XDR display, M2 chip, 12MP Wide and 10MP Ultra Wide cameras, LiDAR Scanner, Face ID, Thunderbolt/USB 4 support.', price: 89999, stock: 38, category_id: 1, rating: 4.9, review_count: 1547, seed: 'ipad' },
  { name: 'JBL Charge 5 Bluetooth Speaker', description: 'Portable Bluetooth speaker with deep bass, IP67 waterproof and dustproof, 20 hours of playtime, built-in powerbank, PartyBoost compatible.', price: 14999, stock: 200, category_id: 1, rating: 4.7, review_count: 4521, seed: 'speaker' },
  { name: 'Logitech MX Master 3S Mouse', description: 'Wireless performance mouse with 8K DPI optical sensor, quiet clicks, ultra-fast MagSpeed scroll wheel, USB-C, works on any surface including glass.', price: 8295, stock: 150, category_id: 1, rating: 4.8, review_count: 892, seed: 'mouse' },

  // ── Books (category_id: 2) ──
  { name: 'Atomic Habits by James Clear', description: 'An easy & proven way to build good habits & break bad ones. Over 15 million copies sold worldwide. Tiny changes, remarkable results.', price: 399, stock: 500, category_id: 2, rating: 4.8, review_count: 98453, seed: 'atomichabits' },
  { name: 'The Psychology of Money by Morgan Housel', description: 'Timeless lessons on wealth, greed, and happiness. 19 short stories exploring the strange ways people think about money.', price: 299, stock: 350, category_id: 2, rating: 4.7, review_count: 45230, seed: 'psychmoney' },
  { name: 'Clean Code by Robert C. Martin', description: 'A handbook of agile software craftsmanship. Learn to write code that is clean, readable, and maintainable. A must-read for every developer.', price: 2499, stock: 180, category_id: 2, rating: 4.6, review_count: 8932, seed: 'cleancode' },
  { name: 'Sapiens: A Brief History of Humankind', description: 'By Yuval Noah Harari. A groundbreaking narrative of humanity\'s creation and evolution, exploring how biology and history have defined us.', price: 499, stock: 420, category_id: 2, rating: 4.7, review_count: 67843, seed: 'sapiens' },
  { name: 'The Alchemist by Paulo Coelho', description: 'A magical fable about following your dream. An Andalusian shepherd boy journeys to the Egyptian pyramids in search of treasure.', price: 199, stock: 600, category_id: 2, rating: 4.7, review_count: 120543, seed: 'alchemist' },

  // ── Clothing (category_id: 3) ──
  { name: 'Levi\'s 501 Original Fit Jeans', description: 'The original jean. Straight leg, button fly, sits at waist. 100% cotton for comfortable all-day wear. Iconic since 1873.', price: 3999, stock: 230, category_id: 3, rating: 4.5, review_count: 15678, seed: 'jeans' },
  { name: 'Nike Dri-FIT Running T-Shirt', description: 'Lightweight, breathable Dri-FIT fabric keeps you dry and comfortable. Standard fit for a relaxed feel. Reflective elements for low-light visibility.', price: 1995, stock: 300, category_id: 3, rating: 4.4, review_count: 8932, seed: 'niketshirt' },
  { name: 'Columbia Fleece Jacket', description: 'Full-zip fleece jacket with zippered hand pockets. Perfect for layering. Soft 100% polyester MTR fleece for lightweight warmth.', price: 3495, stock: 175, category_id: 3, rating: 4.6, review_count: 12340, seed: 'fleece' },
  { name: 'Adidas Ultraboost Running Shoes', description: 'Responsive Boost midsole returns energy with every stride. Primeknit upper adapts to your foot. Continental rubber outsole for extraordinary grip.', price: 15999, stock: 95, category_id: 3, rating: 4.7, review_count: 7654, seed: 'ultraboost' },
  { name: 'Ray-Ban Aviator Classic Sunglasses', description: 'Original aviator silhouette with iconic teardrop shape. Crystal green G-15 lenses, gold-tone metal frame. 100% UV protection.', price: 13490, stock: 85, category_id: 3, rating: 4.6, review_count: 5432, seed: 'rayban' },

  // ── Home & Kitchen (category_id: 4) ──
  { name: 'Instant Pot Duo 7-in-1 Pressure Cooker', description: '7 appliances in 1: pressure cooker, slow cooker, rice cooker, steamer, sauté pan, food warmer, and yogurt maker. 6-quart capacity.', price: 7499, stock: 160, category_id: 4, rating: 4.7, review_count: 34567, seed: 'instantpot' },
  { name: 'Dyson V15 Detect Cordless Vacuum', description: 'Reveals invisible dust with a laser. Piezo sensor counts and categorizes particles. Up to 60 minutes run time. HEPA filtration.', price: 62990, stock: 42, category_id: 4, rating: 4.5, review_count: 8765, seed: 'dyson' },
  { name: 'KitchenAid Stand Mixer - 5 Quart', description: 'Tilt-head design for easy access to bowl. 10 speeds for thorough mixing. Includes flat beater, dough hook, and wire whip.', price: 37999, stock: 55, category_id: 4, rating: 4.8, review_count: 23456, seed: 'mixer' },
  { name: 'Philips Smart LED Bulbs (4-Pack)', description: 'Smart Wi-Fi LED bulbs, 16 million colors, dimmable, works with Alexa and Google Home. No hub required. 800 lumens, 60W equivalent.', price: 3999, stock: 320, category_id: 4, rating: 4.4, review_count: 6543, seed: 'smartbulb' },
  { name: 'Cuisinart 14-Cup Coffee Maker', description: 'Fully automatic, brew-and-serve with adjustable carafe temperature, 24-hour programmability, self-clean function, charcoal water filter.', price: 8295, stock: 140, category_id: 4, rating: 4.5, review_count: 9876, seed: 'coffeemaker' },

  // ── Sports (category_id: 5) ──
  { name: 'Fitbit Charge 6 Fitness Tracker', description: 'Advanced health and fitness tracker with built-in GPS, 24/7 heart rate, stress management tools, sleep tracking, 7-day battery life.', price: 12999, stock: 210, category_id: 5, rating: 4.4, review_count: 11234, seed: 'fitbit' },
  { name: 'Manduka PRO Yoga Mat', description: 'Premium 6mm thick yoga mat with closed-cell surface to prevent sweat from seeping in. Lifetime guarantee. 71-inch length.', price: 9990, stock: 180, category_id: 5, rating: 4.8, review_count: 5678, seed: 'yogamat' },
  { name: 'Bowflex SelectTech 552 Adjustable Dumbbells', description: 'Replace 15 sets of weights with one compact set. Adjusts from 5 to 52.5 lbs. Patented dial system for quick weight changes.', price: 35490, stock: 35, category_id: 5, rating: 4.6, review_count: 7890, seed: 'dumbbells' },
  { name: 'The North Face Borealis Backpack', description: '28-liter capacity, FlexVent suspension system, padded 15-inch laptop sleeve, multiple external pockets, water-resistant design.', price: 8199, stock: 250, category_id: 5, rating: 4.7, review_count: 13456, seed: 'backpack' },
  { name: 'Hydro Flask 32oz Water Bottle', description: 'TempShield double-wall vacuum insulation, keeps beverages cold 24 hours or hot 12 hours. BPA-free, dishwasher safe. Color Last powder coat.', price: 3495, stock: 400, category_id: 5, rating: 4.7, review_count: 21345, seed: 'hydroflask' },

  // ── Beauty (category_id: 6) ──
  { name: 'CeraVe Moisturizing Cream', description: 'Daily face and body moisturizer with 3 essential ceramides, hyaluronic acid, and MVE delivery technology. Fragrance-free. 19 oz.', price: 1299, stock: 500, category_id: 6, rating: 4.7, review_count: 87654, seed: 'cerave' },
  { name: 'Dyson Airwrap Multi-Styler Complete', description: 'Engineered for multiple hair types. Curl, wave, smooth, and dry with no extreme heat. Coanda airflow technology. 6 attachments included.', price: 49990, stock: 28, category_id: 6, rating: 4.3, review_count: 4567, seed: 'airwrap' },
  { name: 'Maybelline Lash Sensational Mascara', description: 'Exclusive fanning brush with ten layers of bristles captures every lash for a full fan effect. Buildable formula, no clumps.', price: 599, stock: 650, category_id: 6, rating: 4.5, review_count: 45678, seed: 'mascara' },
  { name: 'Neutrogena Hydro Boost Gel-Cream', description: 'Oil-free face moisturizer with hyaluronic acid. Absorbs quickly like a gel but hydrates like a cream. For extra-dry skin.', price: 1499, stock: 380, category_id: 6, rating: 4.6, review_count: 34567, seed: 'neutrogena' },
  { name: 'Olaplex No. 3 Hair Perfector', description: 'At-home hair treatment that reduces breakage and visibly strengthens hair. Restores compromised hair structure. Suitable for all hair types.', price: 2490, stock: 220, category_id: 6, rating: 4.4, review_count: 23456, seed: 'olaplex' },
];

function seedProducts() {
  const count = db.prepare('SELECT COUNT(*) as c FROM products').get().c;
  if (count > 0) {
    console.log(`↩️  Products already seeded (${count}).`);
    return;
  }

  const insertProduct = db.prepare(`
    INSERT INTO products (name, description, price, stock, category_id, rating, review_count, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertImage = db.prepare(`
    INSERT INTO product_images (product_id, image_url) VALUES (?, ?)
  `);

  const tx = db.transaction(() => {
    for (const p of PRODUCTS) {
      const mainImage = `https://picsum.photos/seed/${p.seed}/640/480`;
      const result = insertProduct.run(
        p.name, p.description, p.price, p.stock,
        p.category_id, p.rating, p.review_count, mainImage
      );
      const productId = result.lastInsertRowid;

      // Insert 4 gallery images per product with different seeds
      for (let i = 1; i <= 4; i++) {
        const galleryImage = `https://picsum.photos/seed/${p.seed}${i}/640/480`;
        insertImage.run(productId, galleryImage);
      }
    }
  });
  tx();
  console.log(`✅ Seeded ${PRODUCTS.length} products with gallery images.`);
}

// ─── Run Seed ──────────────────────────────────────────────
function seed() {
  console.log('\n🌱 Starting database seed...\n');
  seedUser();
  seedCategories();
  seedProducts();
  console.log('\n✅ Seed complete!\n');
}

seed();

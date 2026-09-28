-- =============================================================================
-- K'S ENTERPRISES FISH-FEED PLATFORM - SEED DATA
-- Database: ks_enterprises_db
-- =============================================================================

USE ks_enterprises_db;

-- -----------------------------------------------------------------------------
-- 1. SEED USERS (Default Admin & Sample Customer)
-- Password for admin: Admin@123 (BCrypt: $2a$10$wT8BfZWcKqJ7gQ1yqB.9c.v/qPskG6w0K1yQ7P7Q0cKqJ7gQ1yqB.)
-- -----------------------------------------------------------------------------
INSERT INTO users (id, name, email, phone, password_hash, role, auth_provider, is_active)
VALUES 
(1, 'Admin User', 'admin@ksenterprises.com', '+91 9876543210', '$2a$10$e8Z4a0h4F1qN4qC8QG8jTeLdE1p9W7xL6vO2zK4pS6rU8vT0wY1q2', 'ADMIN', 'LOCAL', TRUE),
(2, 'Test Customer', 'customer@example.com', '+91 9876543211', '$2a$10$e8Z4a0h4F1qN4qC8QG8jTeLdE1p9W7xL6vO2zK4pS6rU8vT0wY1q2', 'CUSTOMER', 'LOCAL', TRUE)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- -----------------------------------------------------------------------------
-- 2. SEED COMPANY PROFILE (Marked with placeholders for user customization)
-- -----------------------------------------------------------------------------
INSERT INTO company (id, company_name, logo_url, gst_number, address, phone, email, whatsapp_number, description)
VALUES (
    1,
    'K\'s Enterprises',
    '/assets/logos/ks-enterprises-logo.svg',
    '[GST_NUMBER_PLACEHOLDER]',
    '[COMPANY_ADDRESS_PLACEHOLDER]',
    '[PHONE_NUMBER_PLACEHOLDER]',
    '[EMAIL_ADDRESS_PLACEHOLDER]',
    '[WHATSAPP_NUMBER_PLACEHOLDER]',
    'K\'s Enterprises is dedicated to providing premium quality fish feed formulated for optimal aquaculture nutrition, high growth rates, and clean water retention.'
) ON DUPLICATE KEY UPDATE company_name=VALUES(company_name);

-- -----------------------------------------------------------------------------
-- 3. SEED CEO INFORMATION (No founders, strictly CEO details)
-- -----------------------------------------------------------------------------
INSERT INTO ceo (id, company_id, ceo_name, ceo_image, phone, email, bio)
VALUES (
    1,
    1,
    '[CEO_NAME_PLACEHOLDER]',
    '/assets/images/ceo-placeholder.svg',
    '[CEO_PHONE_PLACEHOLDER]',
    '[CEO_EMAIL_PLACEHOLDER]',
    'Leading K\'s Enterprises with a vision to deliver scientifically balanced, high-protein fish feed formulations to empower aquaculture farmers.'
) ON DUPLICATE KEY UPDATE ceo_name=VALUES(ceo_name);

-- -----------------------------------------------------------------------------
-- 4. SEED CATEGORIES
-- -----------------------------------------------------------------------------
INSERT INTO categories (id, name, slug, description, icon_name, is_active)
VALUES 
(1, 'Floating Pellets', 'floating-pellets', 'Extruded high-protein floating feed suitable for surface-feeding fish species.', 'bubble-up', TRUE),
(2, 'Sinking Pellets', 'sinking-pellets', 'Dense, slow-disintegrating sinking feed formulated for bottom feeders.', 'anchor', TRUE),
(3, 'Starter Crumbles', 'starter-crumbles', 'Micro-sized nutrient-dense crumbles designed for fry, fingerlings, and nursery ponds.', 'sparkles', TRUE),
(4, 'Broodstock Special', 'broodstock-special', 'Enhanced formulation rich in fatty acids and vitamins for breeding fish.', 'award', TRUE)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- -----------------------------------------------------------------------------
-- 5. SEED PRODUCTS
-- -----------------------------------------------------------------------------
INSERT INTO products (
    id, category_id, name, slug, price, description, specifications, 
    suitable_fish, feed_type, package_size, nutritional_info, 
    availability, primary_image, additional_images, is_featured, is_active
) VALUES 
(
    1, 1, 
    'AquaGrow Floating Feed 28%', 
    'aquagrow-floating-feed-28', 
    1650.00,
    'Premium extruded floating pellets engineered for rapid growth and minimal water pollution. Perfect for commercial aquaculture farms.',
    'Pellet Size: 3.0mm - 4.0mm | Water Stability: 3+ Hours | Digestibility: High',
    'Tilapia, Pangasius, Rohu, Catla',
    'Floating Pellets',
    '40 kg Bag',
    '{"crude_protein": "28%", "crude_fat": "5.0%", "crude_fiber": "5.5%", "moisture": "10.0%", "calcium": "1.2%", "phosphorus": "0.8%"}',
    'AVAILABLE',
    '/assets/images/product-floating-feed-28.svg',
    '["/assets/images/product-floating-feed-28.svg", "/assets/images/feed-spec-1.svg"]',
    TRUE, TRUE
),
(
    2, 1, 
    'AquaGrow Floating Feed 32% High-Protein', 
    'aquagrow-floating-feed-32', 
    1950.00,
    'High-protein floating feed formulated with marine fish meal and fortified amino acids for maximum weight gain in fingerlings and grow-out stages.',
    'Pellet Size: 4.0mm - 5.0mm | Water Stability: 4+ Hours | Digestibility: Superior',
    'Tilapia, Seabass, Murrel, Pangasius',
    'Floating Pellets',
    '40 kg Bag',
    '{"crude_protein": "32%", "crude_fat": "6.0%", "crude_fiber": "4.5%", "moisture": "9.5%", "calcium": "1.5%", "phosphorus": "1.0%"}',
    'AVAILABLE',
    '/assets/images/product-floating-feed-32.svg',
    '["/assets/images/product-floating-feed-32.svg"]',
    TRUE, TRUE
),
(
    3, 2, 
    'BottomPro Sinking Feed 30%', 
    'bottompro-sinking-feed-30', 
    1800.00,
    'Specially formulated sinking pellets that remain intact underwater, preventing nutrient leaching for bottom foraging species.',
    'Pellet Size: 3.5mm | Sinking Speed: Moderate | Water Stability: 2+ Hours',
    'Catla, Mrigal, Carp, Catfish',
    'Sinking Pellets',
    '50 kg Bag',
    '{"crude_protein": "30%", "crude_fat": "4.5%", "crude_fiber": "6.0%", "moisture": "11.0%", "calcium": "1.4%", "phosphorus": "0.9%"}',
    'AVAILABLE',
    '/assets/images/product-sinking-feed-30.svg',
    '["/assets/images/product-sinking-feed-30.svg"]',
    TRUE, TRUE
),
(
    4, 3, 
    'Nursery Starter Micro-Crumbles 40%', 
    'nursery-starter-micro-crumbles-40', 
    2400.00,
    'Ultra-fine micro-crumbles for hatcheries and nursery ponds. Packed with digestible proteins and immunity boosters.',
    'Granule Size: 0.5mm - 1.0mm | Water Stability: High | Immune Fortification: Vitamin C & E',
    'Fry, Fingerlings, All Species Nursery',
    'Starter Crumbles',
    '20 kg Bag',
    '{"crude_protein": "40%", "crude_fat": "8.0%", "crude_fiber": "3.0%", "moisture": "8.5%", "calcium": "1.8%", "phosphorus": "1.2%"}',
    'AVAILABLE',
    '/assets/images/product-starter-crumbles.svg',
    '["/assets/images/product-starter-crumbles.svg"]',
    FALSE, TRUE
),
(
    5, 4, 
    'Breeder Gold Broodstock Booster 38%', 
    'breeder-gold-broodstock-booster-38', 
    3100.00,
    'Specialized reproductive nutritional feed fortified with Omega-3, Astaxanthin, and minerals for superior egg viability and high spawning rates.',
    'Pellet Size: 6.0mm | Fortified with HUFA & Astaxanthin',
    'Broodstock Fish, Carp, Tilapia, Seabass',
    'Broodstock Special',
    '25 kg Bag',
    '{"crude_protein": "38%", "crude_fat": "9.0%", "crude_fiber": "3.5%", "moisture": "9.0%", "calcium": "2.0%", "phosphorus": "1.4%"}',
    'OUT_OF_STOCK',
    '/assets/images/product-broodstock.svg',
    '["/assets/images/product-broodstock.svg"]',
    FALSE, TRUE
)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- -----------------------------------------------------------------------------
-- 6. SEED PRODUCT COMPARISONS (Factual comparison with competitor products)
-- -----------------------------------------------------------------------------
INSERT INTO product_comparisons (
    id, base_product_id, competitor_name, price, protein_content, 
    package_size, fish_type, feed_type, availability, nutritional_details, additional_factors
) VALUES 
(
    1, 1, 'Company B Commercial Feed', 1720.00, '26%', 
    '40 kg', 'Tilapia, Pangasius', 'Floating Pellets', 'Available',
    'Crude Protein: 26%, Fat: 4.0%, Fiber: 6.5%',
    '{"water_stability": "1.5 Hours", "fcr_benchmark": "1.6"}'
),
(
    2, 1, 'Company C AgroFeed', 1690.00, '25%', 
    '40 kg', 'General Aquaculture', 'Floating Pellets', 'Out of Stock',
    'Crude Protein: 25%, Fat: 3.8%, Fiber: 7.0%',
    '{"water_stability": "1.0 Hour", "fcr_benchmark": "1.7"}'
),
(
    3, 2, 'Competitor X High-Gain 32', 2100.00, '31%', 
    '40 kg', 'Carnivorous / Omnivorous', 'Floating Pellets', 'Available',
    'Crude Protein: 31%, Fat: 5.2%, Fiber: 5.0%',
    '{"water_stability": "2.5 Hours", "fcr_benchmark": "1.4"}'
)
ON DUPLICATE KEY UPDATE competitor_name=VALUES(competitor_name);

-- -----------------------------------------------------------------------------
-- 7. SEED PRODUCT RECOMMENDATIONS
-- -----------------------------------------------------------------------------
INSERT INTO product_recommendations (id, source_product_id, recommended_product_id, display_order)
VALUES 
(1, 1, 2, 1),
(2, 1, 3, 2),
(3, 2, 1, 1),
(4, 2, 4, 2),
(5, 3, 1, 1),
(6, 4, 1, 1)
ON DUPLICATE KEY UPDATE display_order=VALUES(display_order);

-- -----------------------------------------------------------------------------
-- 8. SEED REVIEWS (Approved and Moderated)
-- -----------------------------------------------------------------------------
INSERT INTO reviews (id, product_id, user_id, customer_name, rating, review_text, is_approved)
VALUES 
(1, 1, 2, 'Ramesh Farm Tech', 5, 'Excellent feed quality. Water clarity in my tilapia pond remained great throughout the cycle.', TRUE),
(2, 1, NULL, 'Aquaculture Farmer', 4, 'Good pellet consistency and uniform size. Fish acceptance was fast.', TRUE),
(3, 2, 2, 'Sri Krishna Fisheries', 5, 'High protein ratio provided noticeable weight gain within 4 weeks.', TRUE),
(4, 3, NULL, 'Kishan V.', 4, 'Very good sinking stability for our carp pond.', TRUE)
ON DUPLICATE KEY UPDATE customer_name=VALUES(customer_name);

-- -----------------------------------------------------------------------------
-- 9. SEED WEBSITE CONTENT (Editable CMS sections: Hero, Why Choose Us, FAQs)
-- -----------------------------------------------------------------------------
INSERT INTO website_content (id, section_key, content_json)
VALUES 
(
    1, 
    'hero', 
    '{"heading": "Quality Fish Feed for Better Growth", "subheading": "Scientifically formulated floating and sinking feeds engineered for optimal feed conversion ratio (FCR), enhanced immunity, and cleaner pond ecosystems.", "ctaText": "Explore Products", "ctaLink": "/pages/products/index.html"}'
),
(
    2, 
    'why_choose_us', 
    '{"title": "Why Choose K\'s Enterprises?", "items": [{"title": "Quality Products", "description": "Formulated with tested ingredients and verified protein concentrations."}, {"title": "Reliable Service", "description": "Prompt order coordination and dedicated farmer assistance via WhatsApp."}, {"title": "Product Variety", "description": "Complete nutritional solutions spanning fry starter crumbles to grow-out feeds."}, {"title": "Competitive Pricing", "description": "Direct pricing structured to maximize aquaculture farmer profitability."}, {"title": "Customer Support", "description": "Responsive communication and technical guidance tailored to fish species."}, {"title": "Trusted Service", "description": "Consistent batch testing and strict hygiene standards across all feeds."}]}'
),
(
    3, 
    'faqs', 
    '{"items": [{"question": "How do I place an order for K\'s Enterprises fish feed?", "answer": "Click the \\"Order Through WhatsApp\\" button on any product page. This will automatically open WhatsApp with your product details filled in, and our team will coordinate the order directly with you."}, {"question": "What is the minimum order quantity?", "answer": "Order quantities can be discussed directly with our sales team via WhatsApp or phone based on your pond requirements and location."}, {"question": "How do I select the right pellet size for my fish?", "answer": "For nursery fry, use our Starter Crumbles (0.5mm - 1mm). For juvenile fish up to 100g, use 2mm - 3mm pellets. For adult grow-out fish above 200g, use 4mm - 5mm floating or sinking pellets."}, {"question": "Do you deliver to farm locations?", "answer": "Delivery arrangements and logistics are coordinated based on your farm location when you connect with us via WhatsApp or phone."}]}'
)
ON DUPLICATE KEY UPDATE section_key=VALUES(section_key);

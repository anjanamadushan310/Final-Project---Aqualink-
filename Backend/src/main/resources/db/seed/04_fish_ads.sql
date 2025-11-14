-- Seed Fish Ads (Products from Farm Owners)

INSERT INTO fish_ads (id, name, description, nic_number, stock, price, minimum_quantity, create_date_and_time, active_status, user_id)
VALUES 
-- Fish from Sunil (user_id 4)
(1, 'Tilapia', 'Fresh Tilapia fish, farm-raised with organic feed. Perfect for grilling and curries.', '199812345678', 500, 450.00, 5, NOW(), 'APPROVED', 4),
(2, 'Catfish', 'Premium quality Catfish, locally bred. Ideal for traditional Sri Lankan recipes.', '199812345678', 300, 550.00, 3, NOW(), 'APPROVED', 4),
(3, 'Carp', 'Large Carp fish, freshwater species. Great source of protein.', '199812345678', 200, 650.00, 2, NOW(), 'APPROVED', 4),

-- Fish from Kamal (user_id 5)
(4, 'Gourami', 'Colorful Gourami fish, perfect for aquariums and home ponds.', '199912345678', 1000, 150.00, 10, NOW(), 'APPROVED', 5),
(5, 'Koi Fish', 'Beautiful ornamental Koi fish in various colors. Premium quality.', '199912345678', 150, 2500.00, 1, NOW(), 'APPROVED', 5),
(6, 'Goldfish', 'Classic Goldfish varieties, healthy and vibrant. Perfect for beginners.', '199912345678', 800, 200.00, 5, NOW(), 'APPROVED', 5),
(7, 'Barb Fish', 'Active and hardy Barb fish species. Great for community tanks.', '199912345678', 600, 180.00, 10, NOW(), 'APPROVED', 5),

-- More varieties from Sunil
(8, 'Giant Gourami', 'Large Giant Gourami, suitable for big ponds and aquaculture.', '199812345678', 100, 1200.00, 2, NOW(), 'APPROVED', 4),
(9, 'Fingerlings - Tilapia', 'Tilapia fingerlings for pond stocking. Healthy and fast-growing.', '199812345678', 5000, 15.00, 100, NOW(), 'APPROVED', 4),
(10, 'Freshwater Prawns', 'Giant freshwater prawns, excellent for aquaculture.', '199812345678', 250, 850.00, 5, NOW(), 'APPROVED', 4);

-- Reset sequence
ALTER SEQUENCE fish_ads_id_seq RESTART WITH 11;

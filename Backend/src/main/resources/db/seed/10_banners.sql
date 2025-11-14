-- Seed Banners for the home page

INSERT INTO banner (id, image_url, link, active)
VALUES 
(1, '/banners/welcome-to-aqualink.jpg', '/', true),
(2, '/banners/fresh-fish-delivery.jpg', '/cart', true),
(3, '/banners/aquaculture-equipment.jpg', '/', true),
(4, '/banners/expert-consultation.jpg', '/blog', true),
(5, '/banners/sustainable-farming.jpg', '/about', true);

-- Reset sequence
ALTER SEQUENCE banner_id_seq RESTART WITH 6;

-- Seed User Profiles

INSERT INTO user_profile (user_id, business_name, business_address, address_place, address_street, logo_url, description)
VALUES 
-- Shop Owners
(2, 'Lakshitha Fish Market', '123 Galle Road, Colombo 03', 'Colombo', '123 Galle Road', NULL, 'Premium fresh fish and seafood supplier in Colombo'),
(3, 'Nimal Seafood Center', '456 Main Street, Negombo', 'Negombo', '456 Main Street', NULL, 'Quality seafood products at competitive prices'),

-- Farm Owners
(4, 'Sunil Aqua Farm', 'Aqua Farm Road, Chilaw', 'Chilaw', 'Aqua Farm Road', NULL, 'Organic fish farming with sustainable practices'),
(5, 'Kamal Fish Hatchery', 'Lake View, Kurunegala', 'Kurunegala', 'Lake View', NULL, 'Premium fish breeding and fingerling supply'),

-- Exporters
(6, 'Pradeep Export Traders', '789 Export Zone, Katunayake', 'Katunayake', '789 Export Zone', NULL, 'International seafood export specialists'),
(7, 'Chandana Global Exports', 'Free Trade Zone, Biyagama', 'Biyagama', 'Free Trade Zone', NULL, 'Quality assured frozen fish exports worldwide'),

-- Service Providers
(8, 'Ravi Aquarium Services', '101 Service Lane, Kandy', 'Kandy', '101 Service Lane', NULL, 'Professional aquarium setup and maintenance'),
(9, 'Anjana Pond Consulting', '202 Consultant Street, Matara', 'Matara', '202 Consultant Street', NULL, 'Expert fish farming consultation and training'),

-- Industrial Stuff Sellers
(10, 'Mahesh Equipment Supplies', '303 Industrial Park, Horana', 'Horana', '303 Industrial Park', NULL, 'Complete range of aquaculture equipment and supplies'),
(11, 'Tharaka Aqua Tech', '404 Tech Zone, Moratuwa', 'Moratuwa', '404 Tech Zone', NULL, 'Advanced fish farming technology and accessories'),

-- Delivery Persons
(12, 'Kasun Quick Delivery', NULL, 'Colombo', NULL, NULL, 'Fast and reliable delivery service across Colombo'),
(13, 'Dinesh Express Transport', NULL, 'Gampaha', NULL, NULL, 'Express delivery for fresh seafood products'),
(14, 'Ruwan Island Delivery', NULL, 'Kalutara', NULL, NULL, 'Specialized in live fish transportation'),

-- Regular Customers
(15, NULL, '505 Residential Area, Dehiwala', 'Dehiwala', '505 Residential Area', NULL, NULL),
(16, NULL, '606 Housing Scheme, Mount Lavinia', 'Mount Lavinia', '606 Housing Scheme', NULL, NULL);

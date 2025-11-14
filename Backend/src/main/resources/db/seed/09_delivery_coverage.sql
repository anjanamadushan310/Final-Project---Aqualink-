-- Seed Delivery Person Coverage Areas

INSERT INTO delivery_person_coverage (id, user_id, district, city, delivery_charge_per_km, created_at)
VALUES 
-- Kasun's coverage (user_id 12)
(1, 12, 'Colombo', 'Colombo 01-15', 50.00, NOW()),
(2, 12, 'Colombo', 'Dehiwala', 50.00, NOW()),
(3, 12, 'Colombo', 'Mount Lavinia', 50.00, NOW()),
(4, 12, 'Colombo', 'Nugegoda', 50.00, NOW()),

-- Dinesh's coverage (user_id 13)
(5, 13, 'Gampaha', 'Gampaha', 45.00, NOW()),
(6, 13, 'Gampaha', 'Negombo', 45.00, NOW()),
(7, 13, 'Gampaha', 'Wattala', 45.00, NOW()),
(8, 13, 'Gampaha', 'Kadawatha', 45.00, NOW()),

-- Ruwan's coverage (user_id 14)
(9, 14, 'Kalutara', 'Kalutara', 40.00, NOW()),
(10, 14, 'Kalutara', 'Panadura', 40.00, NOW()),
(11, 14, 'Kalutara', 'Horana', 40.00, NOW());

-- Reset sequence
ALTER SEQUENCE delivery_person_coverage_id_seq RESTART WITH 12;

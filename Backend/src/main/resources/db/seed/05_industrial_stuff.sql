-- Seed Industrial Stuff (Aquaculture Equipment)

INSERT INTO industrial_stuff (id, name, description, nic_number, stock, price, minimum_quantity, create_date_and_time, active_status, user_id)
VALUES 
-- Equipment from Mahesh (user_id 10)
(1, 'Aquarium Filter System', 'High-efficiency filtration system for aquariums up to 500L. Includes biological and mechanical filtration.', '200412345678', 50, 8500.00, 1, NOW(), 'APPROVED', 10),
(2, 'Fish Food - Premium Mix', 'Nutritious fish food pellets suitable for all fish species. 5kg pack.', '200412345678', 200, 1200.00, 2, NOW(), 'APPROVED', 10),
(3, 'Pond Aerator', 'Electric pond aerator with air stone. Suitable for ponds up to 1000L.', '200412345678', 30, 12500.00, 1, NOW(), 'APPROVED', 10),
(4, 'Water Testing Kit', 'Complete water quality testing kit. Tests pH, ammonia, nitrite, and nitrate levels.', '200412345678', 100, 2500.00, 1, NOW(), 'APPROVED', 10),
(5, 'Fish Net - Professional', 'Durable nylon fish net with extendable handle. Large size.', '200412345678', 150, 850.00, 1, NOW(), 'APPROVED', 10),

-- Equipment from Tharaka (user_id 11)
(6, 'Automatic Fish Feeder', 'Programmable automatic fish feeder. Perfect for busy fish farmers.', '200512345678', 40, 6500.00, 1, NOW(), 'APPROVED', 11),
(7, 'UV Sterilizer', 'UV water sterilizer for disease prevention. 25W capacity.', '200512345678', 25, 15000.00, 1, NOW(), 'APPROVED', 11),
(8, 'Breeding Tank Kit', 'Complete breeding tank setup with dividers and accessories.', '200512345678', 20, 18500.00, 1, NOW(), 'APPROVED', 11),
(9, 'Water Heater - Aquarium', 'Adjustable water heater for tropical fish. 300W.', '200512345678', 80, 3500.00, 1, NOW(), 'APPROVED', 11),
(10, 'Fish Transport Bags', 'Oxygen-filled transport bags for live fish. Pack of 100.', '200512345678', 500, 2000.00, 5, NOW(), 'APPROVED', 11),

-- More equipment from Mahesh
(11, 'Pond Liner Sheet', 'Heavy-duty HDPE pond liner. 4m x 6m sheet.', '200412345678', 60, 9500.00, 1, NOW(), 'APPROVED', 10),
(12, 'Aquarium LED Light', 'Energy-efficient LED lighting for aquariums. Adjustable brightness.', '200412345678', 100, 4500.00, 1, NOW(), 'APPROVED', 10);

-- Reset sequence
ALTER SEQUENCE industrial_stuff_id_seq RESTART WITH 13;

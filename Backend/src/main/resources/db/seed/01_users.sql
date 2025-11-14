-- Seed Users with different roles
-- Password for all users is 'password123' (hashed with BCrypt)
-- Hash generated using BCrypt with strength 10

-- Admin User
INSERT INTO users (id, nic_number, name, email, phone_number, password, active, verification_status, created_at)
VALUES 
(1, '199512345678', 'Admin User', 'admin@aqualink.com', '+94771234567', '$2a$10$N9qo8uLOickgx2ZMRZoMye1VrIqe2hLquU0qOlcj3gKxGn1sQXRXi', true, 'APPROVED', NOW());

-- Shop Owners
INSERT INTO users (id, nic_number, name, email, phone_number, password, active, verification_status, created_at)
VALUES 
(2, '199612345678', 'Lakshitha Perera', 'lakshitha@shop.com', '+94771234568', '$2a$10$N9qo8uLOickgx2ZMRZoMye1VrIqe2hLquU0qOlcj3gKxGn1sQXRXi', true, 'APPROVED', NOW()),
(3, '199712345678', 'Nimal Silva', 'nimal@shop.com', '+94771234569', '$2a$10$N9qo8uLOickgx2ZMRZoMye1VrIqe2hLquU0qOlcj3gKxGn1sQXRXi', true, 'APPROVED', NOW());

-- Farm Owners
INSERT INTO users (id, nic_number, name, email, phone_number, password, active, verification_status, created_at)
VALUES 
(4, '199812345678', 'Sunil Fernando', 'sunil@farm.com', '+94771234570', '$2a$10$N9qo8uLOickgx2ZMRZoMye1VrIqe2hLquU0qOlcj3gKxGn1sQXRXi', true, 'APPROVED', NOW()),
(5, '199912345678', 'Kamal Jayasinghe', 'kamal@farm.com', '+94771234571', '$2a$10$N9qo8uLOickgx2ZMRZoMye1VrIqe2hLquU0qOlcj3gKxGn1sQXRXi', true, 'APPROVED', NOW());

-- Exporters
INSERT INTO users (id, nic_number, name, email, phone_number, password, active, verification_status, created_at)
VALUES 
(6, '200012345678', 'Pradeep Wijesinghe', 'pradeep@export.com', '+94771234572', '$2a$10$N9qo8uLOickgx2ZMRZoMye1VrIqe2hLquU0qOlcj3gKxGn1sQXRXi', true, 'APPROVED', NOW()),
(7, '200112345678', 'Chandana Rathnayake', 'chandana@export.com', '+94771234573', '$2a$10$N9qo8uLOickgx2ZMRZoMye1VrIqe2hLquU0qOlcj3gKxGn1sQXRXi', true, 'APPROVED', NOW());

-- Service Providers
INSERT INTO users (id, nic_number, name, email, phone_number, password, active, verification_status, created_at)
VALUES 
(8, '200212345678', 'Ravi Dissanayake', 'ravi@service.com', '+94771234574', '$2a$10$N9qo8uLOickgx2ZMRZoMye1VrIqe2hLquU0qOlcj3gKxGn1sQXRXi', true, 'APPROVED', NOW()),
(9, '200312345678', 'Anjana Madushan', 'anjana@service.com', '+94771234575', '$2a$10$N9qo8uLOickgx2ZMRZoMye1VrIqe2hLquU0qOlcj3gKxGn1sQXRXi', true, 'APPROVED', NOW());

-- Industrial Stuff Sellers
INSERT INTO users (id, nic_number, name, email, phone_number, password, active, verification_status, created_at)
VALUES 
(10, '200412345678', 'Mahesh Gunasekara', 'mahesh@industrial.com', '+94771234576', '$2a$10$N9qo8uLOickgx2ZMRZoMye1VrIqe2hLquU0qOlcj3gKxGn1sQXRXi', true, 'APPROVED', NOW()),
(11, '200512345678', 'Tharaka Bandara', 'tharaka@industrial.com', '+94771234577', '$2a$10$N9qo8uLOickgx2ZMRZoMye1VrIqe2hLquU0qOlcj3gKxGn1sQXRXi', true, 'APPROVED', NOW());

-- Delivery Persons
INSERT INTO users (id, nic_number, name, email, phone_number, password, active, verification_status, created_at)
VALUES 
(12, '200612345678', 'Kasun Perera', 'kasun@delivery.com', '+94771234578', '$2a$10$N9qo8uLOickgx2ZMRZoMye1VrIqe2hLquU0qOlcj3gKxGn1sQXRXi', true, 'APPROVED', NOW()),
(13, '200712345678', 'Dinesh Silva', 'dinesh@delivery.com', '+94771234579', '$2a$10$N9qo8uLOickgx2ZMRZoMye1VrIqe2hLquU0qOlcj3gKxGn1sQXRXi', true, 'APPROVED', NOW()),
(14, '200812345678', 'Ruwan Fernando', 'ruwan@delivery.com', '+94771234580', '$2a$10$N9qo8uLOickgx2ZMRZoMye1VrIqe2hLquU0qOlcj3gKxGn1sQXRXi', true, 'APPROVED', NOW());

-- Regular Customers
INSERT INTO users (id, nic_number, name, email, phone_number, password, active, verification_status, created_at)
VALUES 
(15, '200912345678', 'Nuwan Kumara', 'nuwan@customer.com', '+94771234581', '$2a$10$N9qo8uLOickgx2ZMRZoMye1VrIqe2hLquU0qOlcj3gKxGn1sQXRXi', true, 'APPROVED', NOW()),
(16, '201012345678', 'Samantha De Silva', 'samantha@customer.com', '+94771234582', '$2a$10$N9qo8uLOickgx2ZMRZoMye1VrIqe2hLquU0qOlcj3gKxGn1sQXRXi', true, 'APPROVED', NOW());

-- Reset sequence
ALTER SEQUENCE users_id_seq RESTART WITH 17;

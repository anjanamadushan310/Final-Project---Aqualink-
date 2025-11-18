-- DEBUGGING QUERIES FOR DELIVERY QUOTE SYSTEM
-- Run these queries to check if data exists and relationships are correct

-- 1. Check all orders
SELECT 
    id AS order_id,
    buyer_user_id,
    seller_user_id,
    order_date,
    status,
    total_amount
FROM orders
ORDER BY id DESC
LIMIT 10;

-- 2. Check all delivery quote requests
SELECT 
    id AS request_id,
    order_id,
    create_time,
    last_responding_date_time
FROM delivery_quote_requests
ORDER BY id DESC
LIMIT 10;

-- 3. Check all delivery quotes
SELECT 
    dq.id AS quote_id,
    dq.quote_request_id,
    dq.delivery_person_id,
    dq.delivery_fee,
    dq.status,
    dq.expires_at,
    dp.first_name AS delivery_person_name
FROM delivery_quotes dq
LEFT JOIN users dp ON dq.delivery_person_id = dp.id
ORDER BY dq.id DESC
LIMIT 10;

-- 4. Check the relationship: Order -> DeliveryQuoteRequest -> DeliveryQuote
SELECT 
    o.id AS order_id,
    o.buyer_user_id,
    bu.email AS buyer_email,
    dqr.id AS request_id,
    dqr.create_time AS request_created,
    dq.id AS quote_id,
    dq.delivery_fee,
    dq.status AS quote_status,
    dp.email AS delivery_person_email
FROM orders o
LEFT JOIN users bu ON o.buyer_user_id = bu.id
LEFT JOIN delivery_quote_requests dqr ON dqr.order_id = o.id
LEFT JOIN delivery_quotes dq ON dq.quote_request_id = dqr.id
LEFT JOIN users dp ON dq.delivery_person_id = dp.id
ORDER BY o.id DESC
LIMIT 20;

-- 5. Find orphaned delivery quote requests (requests without orders)
SELECT 
    dqr.id AS request_id,
    dqr.order_id,
    dqr.create_time
FROM delivery_quote_requests dqr
LEFT JOIN orders o ON dqr.order_id = o.id
WHERE o.id IS NULL;

-- 6. Find orders without delivery quote requests
SELECT 
    o.id AS order_id,
    o.order_date,
    o.status,
    bu.email AS buyer_email
FROM orders o
LEFT JOIN users bu ON o.buyer_user_id = bu.id
LEFT JOIN delivery_quote_requests dqr ON dqr.order_id = o.id
WHERE dqr.id IS NULL
ORDER BY o.id DESC
LIMIT 10;

-- 7. Check specific user's orders (replace with your shop owner email)
SELECT 
    o.id AS order_id,
    o.order_date,
    o.status,
    o.total_amount,
    dqr.id AS request_id,
    COUNT(dq.id) AS num_quotes
FROM orders o
LEFT JOIN users bu ON o.buyer_user_id = bu.id
LEFT JOIN delivery_quote_requests dqr ON dqr.order_id = o.id
LEFT JOIN delivery_quotes dq ON dq.quote_request_id = dqr.id
WHERE bu.email = 'lakshitha@shop.com'  -- Change this to your test user
GROUP BY o.id, o.order_date, o.status, o.total_amount, dqr.id
ORDER BY o.id DESC;

-- 8. Check if orderId field exists in delivery_quote_requests table
SHOW COLUMNS FROM delivery_quote_requests LIKE 'order_id';

-- 9. Detailed view of most recent quote flow
SELECT 
    'ORDER' AS entity_type,
    o.id AS entity_id,
    bu.email AS related_email,
    o.order_date AS created_at,
    o.status,
    NULL AS additional_info
FROM orders o
LEFT JOIN users bu ON o.buyer_user_id = bu.id
ORDER BY o.id DESC
LIMIT 1

UNION ALL

SELECT 
    'QUOTE_REQUEST' AS entity_type,
    dqr.id AS entity_id,
    NULL AS related_email,
    dqr.create_time AS created_at,
    NULL AS status,
    CONCAT('order_id: ', dqr.order_id) AS additional_info
FROM delivery_quote_requests dqr
ORDER BY dqr.id DESC
LIMIT 1

UNION ALL

SELECT 
    'QUOTE' AS entity_type,
    dq.id AS entity_id,
    dp.email AS related_email,
    dq.created_at,
    dq.status,
    CONCAT('fee: ', dq.delivery_fee, ', request_id: ', dq.quote_request_id) AS additional_info
FROM delivery_quotes dq
LEFT JOIN users dp ON dq.delivery_person_id = dp.id
ORDER BY dq.id DESC
LIMIT 1;

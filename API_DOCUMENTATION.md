# Aqualink Backend - Delivery Person & Shop Owner API Documentation

## Overview
This backend implementation provides comprehensive APIs for delivery persons and shop owners to manage orders, deliveries, and track business operations.

## Configuration
- **Project**: Spring Boot 3.4.8 with Java 17
- **Database**: MySQL (aqualinkfinel5)
- **Security**: JWT-based authentication with role-based access control
- **Port**: 8080

## Authentication
All endpoints require JWT token authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Roles
- `DELIVERY_PERSON`: Can manage assigned deliveries and update delivery status
- `SHOP_OWNER`: Can manage orders containing their products
- `ADMIN`: Can assign deliveries and manage all operations

---

## Delivery Person APIs

### Base URL: `/api/delivery`

### 1. Get My Orders
- **GET** `/api/delivery/my-orders`
- **Role**: DELIVERY_PERSON
- **Description**: Get all orders assigned to the authenticated delivery person
- **Response**: List of `OrderDeliveryDTO`

### 2. Get Pending Deliveries
- **GET** `/api/delivery/pending`
- **Role**: DELIVERY_PERSON
- **Description**: Get orders that are shipped or in transit
- **Response**: List of `OrderDeliveryDTO`

### 3. Get Orders by Status
- **GET** `/api/delivery/orders/status/{status}`
- **Role**: DELIVERY_PERSON
- **Parameters**: 
  - `status` (path): Order status (pending, shipped, in_transit, delivered, etc.)
- **Response**: List of `OrderDeliveryDTO`

### 4. Update Order Status
- **PUT** `/api/delivery/update-status`
- **Role**: DELIVERY_PERSON
- **Body**: `OrderStatusUpdateDTO`
```json
{
  "orderId": 123,
  "newStatus": "in_transit",
  "notes": "Package picked up and on the way"
}
```
- **Response**: `OrderDeliveryDTO`

### 5. Complete Delivery
- **PUT** `/api/delivery/complete/{orderId}`
- **Role**: DELIVERY_PERSON
- **Parameters**: 
  - `orderId` (path): Order ID to mark as delivered
- **Response**: `OrderDeliveryDTO`

### 6. Start Delivery
- **PUT** `/api/delivery/start/{orderId}`
- **Role**: DELIVERY_PERSON
- **Description**: Mark order as in transit
- **Response**: `OrderDeliveryDTO`

### 7. Pickup Order
- **PUT** `/api/delivery/pickup/{orderId}`
- **Role**: DELIVERY_PERSON
- **Description**: Mark order as picked up from seller
- **Response**: `OrderDeliveryDTO`

### 8. Get My Statistics
- **GET** `/api/delivery/stats`
- **Role**: DELIVERY_PERSON
- **Response**: `DeliveryPersonDTO`
```json
{
  "nicNumber": "123456789V",
  "name": "John Doe",
  "phoneNumber": "+94771234567",
  "email": "john@example.com",
  "active": true,
  "totalDeliveries": 50,
  "pendingDeliveries": 3,
  "completedDeliveries": 47
}
```

### Admin Endpoints for Delivery Management

### 9. Assign Delivery Person (Admin)
- **POST** `/api/delivery/assign`
- **Role**: ADMIN
- **Body**: `DeliveryAssignmentDTO`
```json
{
  "orderId": 123,
  "deliveryPersonNic": "123456789V",
  "assignedDate": "2025-09-21",
  "assignedBy": "admin"
}
```

### 10. Get Available Orders (Admin)
- **GET** `/api/delivery/available-orders`
- **Role**: ADMIN
- **Description**: Get orders pending delivery assignment

---

## Shop Owner APIs

### Base URL: `/api/shop`

### 1. Get My Orders
- **GET** `/api/shop/my-orders`
- **Role**: SHOP_OWNER
- **Description**: Get all orders containing products from this shop owner
- **Response**: List of `ShopOrderDTO`

### 2. Get Pending Orders
- **GET** `/api/shop/pending-orders`
- **Role**: SHOP_OWNER
- **Description**: Get orders that need confirmation or processing
- **Response**: List of `ShopOrderDTO`

### 3. Get Completed Orders
- **GET** `/api/shop/completed-orders`
- **Role**: SHOP_OWNER
- **Description**: Get delivered/completed orders
- **Response**: List of `ShopOrderDTO`

### 4. Get In-Transit Orders
- **GET** `/api/shop/in-transit-orders`
- **Role**: SHOP_OWNER
- **Description**: Get orders currently being delivered
- **Response**: List of `ShopOrderDTO`

### 5. Get Orders by Status
- **POST** `/api/shop/orders/status`
- **Role**: SHOP_OWNER
- **Body**: List of status strings
```json
["pending", "confirmed", "processing"]
```
- **Response**: List of `ShopOrderDTO`

### 6. Update Order Status
- **PUT** `/api/shop/update-status`
- **Role**: SHOP_OWNER
- **Body**: `OrderStatusUpdateDTO`
```json
{
  "orderId": 123,
  "newStatus": "confirmed",
  "notes": "Order confirmed and will be processed"
}
```

### 7. Confirm Order
- **PUT** `/api/shop/confirm/{orderId}`
- **Role**: SHOP_OWNER
- **Description**: Quick endpoint to confirm an order
- **Response**: `ShopOrderDTO`

### 8. Process Order
- **PUT** `/api/shop/process/{orderId}`
- **Role**: SHOP_OWNER
- **Description**: Mark order as being processed
- **Response**: `ShopOrderDTO`

### 9. Prepare for Shipping
- **PUT** `/api/shop/prepare-shipping/{orderId}`
- **Role**: SHOP_OWNER
- **Description**: Mark order as ready for pickup by delivery person
- **Response**: `ShopOrderDTO`

### 10. Cancel Order
- **PUT** `/api/shop/cancel/{orderId}`
- **Role**: SHOP_OWNER
- **Parameters**: 
  - `reason` (query, optional): Cancellation reason
- **Response**: `ShopOrderDTO`

### 11. Get Statistics
- **GET** `/api/shop/stats`
- **Role**: SHOP_OWNER
- **Response**: `ShopOrderStatsDTO`
```json
{
  "totalOrders": 100,
  "pendingOrders": 5,
  "shippedOrders": 3,
  "completedOrders": 90,
  "cancelledOrders": 2,
  "totalRevenue": 15000.50
}
```

### Date-Based Queries

### 12. Get Orders by Date Range
- **GET** `/api/shop/orders/date-range`
- **Role**: SHOP_OWNER
- **Parameters**: 
  - `startDate` (query): Start date (YYYY-MM-DD)
  - `endDate` (query): End date (YYYY-MM-DD)
- **Response**: List of `ShopOrderDTO`

### 13. Get Today's Orders
- **GET** `/api/shop/orders/today`
- **Role**: SHOP_OWNER
- **Response**: List of `ShopOrderDTO`

### 14. Get This Week's Orders
- **GET** `/api/shop/orders/this-week`
- **Role**: SHOP_OWNER
- **Response**: List of `ShopOrderDTO`

### 15. Get This Month's Orders
- **GET** `/api/shop/orders/this-month`
- **Role**: SHOP_OWNER
- **Response**: List of `ShopOrderDTO`

---

## Data Models

### OrderDeliveryDTO
```json
{
  "orderId": 123,
  "customerNicNumber": "987654321V",
  "customerName": "Jane Smith",
  "customerPhone": "+94771234567",
  "orderDate": "2025-09-21",
  "shippingAddress": "123 Main St, Colombo",
  "orderStatus": "in_transit",
  "totalAmount": 2500.00,
  "deliveryFee": 300.00,
  "deliveryRequiredStatus": "verified",
  "deliveryStartDate": "2025-09-22",
  "orderItems": [
    {
      "orderItemId": 456,
      "productName": "Fresh Tuna",
      "productType": "fish",
      "quantity": 2,
      "price": 1200.00,
      "productImage": "tuna.jpg",
      "sellerName": "Fish Market Owner",
      "sellerPhone": "+94771234568"
    }
  ]
}
```

### ShopOrderDTO
```json
{
  "orderId": 123,
  "customerNicNumber": "987654321V",
  "customerName": "Jane Smith",
  "customerPhone": "+94771234567",
  "customerEmail": "jane@example.com",
  "orderDate": "2025-09-21",
  "shippingAddress": "123 Main St, Colombo",
  "orderStatus": "confirmed",
  "totalAmount": 2500.00,
  "deliveryFee": 300.00,
  "deliveryGuyNicNumber": "123456789V",
  "deliveryPersonName": "John Delivery",
  "deliveryPersonPhone": "+94771234569",
  "deliveryRequiredStatus": "assigned",
  "deliveryStartDate": null,
  "orderItems": [
    {
      "orderItemId": 456,
      "productName": "Fresh Tuna",
      "productType": "fish",
      "quantity": 2,
      "price": 1200.00,
      "productImage": "tuna.jpg",
      "isMyProduct": true
    }
  ]
}
```

## Order Status Flow

### For Shop Owners:
1. **pending** → **confirmed** (Shop owner confirms the order)
2. **confirmed** → **processing** (Shop owner starts processing)
3. **processing** → **ready_for_shipping** (Items ready for pickup)
4. **ready_for_shipping** → **shipped** (Delivery person picks up)

### For Delivery Persons:
1. **assigned** → **picked_up** (Items collected from seller)
2. **picked_up** → **in_transit** (On the way to customer)
3. **in_transit** → **delivered** (Successfully delivered)

## Error Handling
All endpoints return appropriate HTTP status codes:
- **200**: Success
- **400**: Bad Request (invalid data)
- **401**: Unauthorized (invalid/missing token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found (resource doesn't exist)
- **500**: Internal Server Error

Error responses include descriptive messages:
```json
{
  "error": "Order not found with ID: 123",
  "timestamp": "2025-09-21T10:30:00Z"
}
```

## CORS Configuration
The backend is configured to accept requests from `http://localhost:5173` for frontend development.
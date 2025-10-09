# Test Data Information

## Test Users Created

### Delivery Person 1
- **Email**: test1@gmail.com
- **Password**: ASd236asd@
- **Role**: DELIVERY_PERSON
- **Name**: Test Delivery Person
- **Phone**: +94771234567
- **NIC**: 123456789V
- **Business**: Test Delivery Services
- **Coverage Areas**: 
  - Colombo 01-15
  - Gampaha, Negombo, Kelaniya, Wattala, Ja-Ela, Kandana

### Delivery Person 2
- **Email**: test2@gmail.com
- **Password**: ASd236asd@
- **Role**: DELIVERY_PERSON
- **Name**: Test Delivery Person 2
- **Phone**: +94712345678
- **NIC**: 111222333V
- **Business**: Express Delivery Co
- **Coverage Areas**: 
  - Kandy, Peradeniya, Gampola, Nawalapitiya, Kadugannawa
  - Matale, Dambulla, Sigiriya, Galewela

### Shop Owner 1
- **Email**: testshop@gmail.com
- **Password**: ASd236asd@
- **Role**: SHOP_OWNER
- **Name**: Test Shop Owner
- **Phone**: +94777654321
- **NIC**: 987654321V
- **Business**: Test Fish Market
- **Location**: Colombo 02

### Shop Owner 2
- **Email**: testshop2@gmail.com
- **Password**: ASd236asd@
- **Role**: SHOP_OWNER
- **Name**: Test Shop Owner 2
- **Phone**: +94756789012
- **NIC**: 159357486V
- **Business**: Sea Fresh Market
- **Location**: Galle

### Farm Owner
- **Email**: testfarm@gmail.com
- **Password**: ASd236asd@
- **Role**: FARM_OWNER
- **Name**: Test Farm Owner
- **Phone**: +94723456789
- **NIC**: 444555666V
- **Business**: Aqua Fish Farm
- **Location**: Kurunegala

### Industrial Stuff Seller
- **Email**: testindustrial@gmail.com
- **Password**: ASd236asd@
- **Role**: INDUSTRIAL_STUFF_SELLER
- **Name**: Test Industrial Seller
- **Phone**: +94734567890
- **NIC**: 777888999V
- **Business**: AquaTech Equipment
- **Location**: Wattala (Gampaha district)

### Service Provider
- **Email**: testservice@gmail.com
- **Password**: ASd236asd@
- **Role**: SERVICE_PROVIDER
- **Name**: Test Service Provider
- **Phone**: +94745678901
- **NIC**: 321654987V
- **Business**: AquaCare Services
- **Location**: Colombo 05

### Exporter
- **Email**: testexporter@gmail.com
- **Password**: ASd236asd@
- **Role**: EXPORTER
- **Name**: Test Exporter
- **Phone**: +94756123456
- **NIC**: 654321987V
- **Business**: Global Fish Exports
- **Location**: Colombo 15

## Test Fish Advertisements

### Fish Ad 1
- **Name**: Fresh Tuna Fish
- **Description**: Premium quality fresh tuna fish caught daily. Perfect for sashimi and grilling. Rich in omega-3 fatty acids and protein.
- **Price**: Rs. 2,500.00
- **Stock**: 50 units
- **Status**: VERIFIED (Active)

### Fish Ad 2
- **Name**: Golden Pomfret
- **Description**: High-quality golden pomfret fish, ideal for curry and frying. Fresh catch from deep sea waters with excellent taste and texture.
- **Price**: Rs. 1,800.00
- **Stock**: 30 units
- **Status**: VERIFIED (Active)

## Testing the Delivery Quote System

### Coverage Area Testing
1. **Login as Shop Owner 1** (testshop@gmail.com) - Colombo location
   - Create orders with delivery to Colombo/Gampaha → Visible to Delivery Person 1
2. **Login as Shop Owner 2** (testshop2@gmail.com) - Galle location  
   - Create orders with delivery to Galle → Not visible to either delivery person
3. **Login as Farm Owner** (testfarm@gmail.com) - Kurunegala location
   - Create orders with delivery to Kurunegala → Not visible to either delivery person

### Delivery Person Testing
1. **Login as Delivery Person 1** (test1@gmail.com)
   - Should see requests for Colombo/Gampaha areas only
2. **Login as Delivery Person 2** (test2@gmail.com)  
   - Should see requests for Kandy/Matale areas only
3. Create test orders with delivery addresses in different districts to verify filtering

### Multi-Role Testing
- Test with different user roles: Shop Owner, Farm Owner, Industrial Seller
- Each can create orders and request delivery quotes
- Verify proper role-based access and functionality

## Quick Reference Table

| Email | Password | Role | Coverage/Location |
|-------|----------|------|-------------------|
| test1@gmail.com | ASd236asd@ | DELIVERY_PERSON | Colombo, Gampaha |
| test2@gmail.com | ASd236asd@ | DELIVERY_PERSON | Kandy, Matale |
| testshop@gmail.com | ASd236asd@ | SHOP_OWNER | Colombo 02 |
| testshop2@gmail.com | ASd236asd@ | SHOP_OWNER | Galle |
| testfarm@gmail.com | ASd236asd@ | FARM_OWNER | Kurunegala |
| testindustrial@gmail.com | ASd236asd@ | INDUSTRIAL_STUFF_SELLER | Wattala |
| testservice@gmail.com | ASd236asd@ | SERVICE_PROVIDER | Colombo 05 |
| testexporter@gmail.com | ASd236asd@ | EXPORTER | Colombo 15 |

## Note

**This test data is temporary and should be deleted after testing is complete.**

The test data initializer class is located at:
`src/main/java/com/example/aqualink/config/TestDataInitializer.java`

To disable the test data initialization, either:
1. Delete the TestDataInitializer.java file, or
2. Comment out the `@Component` annotation in the class
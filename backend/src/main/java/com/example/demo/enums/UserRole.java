package com.example.demo.enums;

public enum UserRole {
    SHOP_OWNER("Shop Owner"),
    FARM_OWNER("Farm Owner"),
    COLLECTOR("Collector"),
    SERVICE_PROVIDER("Service Provider"),
    INDUSTRIAL_STUFF_SELLER("Industrial Stuff Seller"),
    DELIVERY_PERSON("Delivery Person");

    private final String displayName;

    UserRole(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static UserRole fromDisplayName(String displayName) {
        for (UserRole role : UserRole.values()) {
            if (role.getDisplayName().equals(displayName)) {
                return role;
            }
        }
        throw new IllegalArgumentException("No enum constant with display name: " + displayName);
    }
}

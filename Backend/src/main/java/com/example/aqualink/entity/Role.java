
package com.example.aqualink.entity;

public enum Role {
    SHOP_OWNER("Shop Owner"),
    FARM_OWNER("Farm Owner"),
    EXPORTER("Exporter"),
    SERVICE_PROVIDER("Service Provider"),
    INDUSTRIAL_STUFF_SELLER("Industrial Stuff Seller"),
    DELIVERY_PERSON("Delivery Person"),
    ADMIN("Admin");

    private final String displayName;

    Role(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static Role fromDisplayName(String displayName) {
        for (Role role : Role.values()) {
            if (role.getDisplayName().equals(displayName)) {
                return role;
            }
        }
        throw new IllegalArgumentException("No enum constant with display name: " + displayName);
    }
}

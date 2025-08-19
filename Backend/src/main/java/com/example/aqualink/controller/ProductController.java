package com.example.aqualink.controller;

import com.example.aqualink.entity.Product;
import com.example.aqualink.entity.ActiveStatus;
import com.example.aqualink.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    @Autowired
    private ProductService productService;

    @PostMapping
    public ResponseEntity<Product> createProduct(
            @RequestParam("name") String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("role") String role,
            @RequestParam("userId") String userId,
            @RequestParam("town") String town,
            @RequestParam("stock") Integer stock,
            @RequestParam("price") Double price,
            @RequestParam(value = "howManyYearsOld", required = false) Integer howManyYearsOld,
            @RequestParam(value = "verified", defaultValue = "false") Boolean verified,
            @RequestParam(value = "image1", required = false) MultipartFile image1,
            @RequestParam(value = "image2", required = false) MultipartFile image2,
            @RequestParam(value = "image3", required = false) MultipartFile image3,
            @RequestParam(value = "image4", required = false) MultipartFile image4,
            @RequestParam(value = "image5", required = false) MultipartFile image5) {

        try {
            Product product = productService.createProduct(
                    name, description, role, userId, town, stock, price,
                    howManyYearsOld, verified, image1, image2, image3, image4, image5
            );
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        try {
            List<Product> products = productService.getAllProducts();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/active")
    public ResponseEntity<List<Product>> getActiveProducts() {
        try {
            List<Product> activeProducts = productService.getProductsByStatus(ActiveStatus.ACTIVE);
            return ResponseEntity.ok(activeProducts);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/inactive")
    public ResponseEntity<List<Product>> getInactiveProducts() {
        try {
            List<Product> inactiveProducts = productService.getProductsByStatus(ActiveStatus.INACTIVE);
            return ResponseEntity.ok(inactiveProducts);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        try {
            Product product = productService.getProductById(id);
            if (product != null) {
                return ResponseEntity.ok(product);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Product> updateProductStatus(
            @PathVariable Long id,
            @RequestParam ActiveStatus status) {
        try {
            Product updatedProduct = productService.updateProductStatus(id, status);
            if (updatedProduct != null) {
                return ResponseEntity.ok(updatedProduct);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        try {
            boolean deleted = productService.deleteProduct(id);
            if (deleted) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/by-role/{role}")
    public ResponseEntity<List<Product>> getProductsByRole(@PathVariable String role) {
        try {
            List<Product> products = productService.getProductsByRole(role);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/by-user/{userId}")
    public ResponseEntity<List<Product>> getProductsByUserId(@PathVariable String userId) {
        try {
            List<Product> products = productService.getProductsByUserId(userId);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "role", required = false) String role,
            @RequestParam(value = "town", required = false) String town,
            @RequestParam(value = "stock", required = false) Integer stock,
            @RequestParam(value = "price", required = false) Double price,
            @RequestParam(value = "howManyYearsOld", required = false) Integer howManyYearsOld,
            @RequestParam(value = "verified", required = false) Boolean verified) {
        try {
            Product updatedProduct = productService.updateProduct(
                    id, name, description, role, town, stock, price, howManyYearsOld, verified
            );
            if (updatedProduct != null) {
                return ResponseEntity.ok(updatedProduct);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
}

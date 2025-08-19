package com.example.aqualink.service;

import com.example.aqualink.entity.Product;
import com.example.aqualink.entity.ActiveStatus;
import com.example.aqualink.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Value("${file.upload.path:uploads/}")
    private String uploadPath;

    public Product createProduct(String name, String description, String role,
                                 String userId, String town, Integer stock, Double price,
                                 Integer howManyYearsOld, Boolean verified,
                                 MultipartFile image1, MultipartFile image2,
                                 MultipartFile image3, MultipartFile image4,
                                 MultipartFile image5) throws IOException {

        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setRole(role);
        product.setUserId(userId);
        product.setTown(town);
        product.setStock(stock);
        product.setPrice(price);
        product.setHowManyYearsOld(howManyYearsOld);
        product.setVerified(verified != null ? verified : false);
        product.setActiveStatus(ActiveStatus.INACTIVE); // Default to inactive
        product.setCreateDateAndTime(LocalDateTime.now());

        // Save images
        MultipartFile[] images = {image1, image2, image3, image4, image5};
        for (int i = 0; i < images.length; i++) {
            if (images[i] != null && !images[i].isEmpty()) {
                String fileName = saveImage(images[i]);
                switch (i) {
                    case 0: product.setImage1(fileName); break;
                    case 1: product.setImage2(fileName); break;
                    case 2: product.setImage3(fileName); break;
                    case 3: product.setImage4(fileName); break;
                    case 4: product.setImage5(fileName); break;
                }
            }
        }

        return productRepository.save(product);
    }

    private String saveImage(MultipartFile file) throws IOException {
        // Create unique filename
        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
        String fileName = UUID.randomUUID().toString() + fileExtension;

        // Create upload directory if it doesn't exist
        Path uploadDir = Paths.get(uploadPath);
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        // Save file
        Path filePath = uploadDir.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);

        return fileName;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getProductsByStatus(ActiveStatus status) {
        return productRepository.findByActiveStatus(status);
    }

    public Product getProductById(Long id) {
        Optional<Product> product = productRepository.findById(id);
        return product.orElse(null);
    }

    public Product updateProductStatus(Long id, ActiveStatus status) {
        Optional<Product> productOptional = productRepository.findById(id);
        if (productOptional.isPresent()) {
            Product product = productOptional.get();
            product.setActiveStatus(status);
            return productRepository.save(product);
        }
        return null;
    }

    public boolean deleteProduct(Long id) {
        Optional<Product> productOptional = productRepository.findById(id);
        if (productOptional.isPresent()) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Product> getProductsByRole(String role) {
        return productRepository.findByRole(role);
    }

    public List<Product> getProductsByUserId(String userId) {
        return productRepository.findByUserId(userId);
    }

    public Product updateProduct(Long id, String name, String description, String role,
                                 String town, Integer stock, Double price,
                                 Integer howManyYearsOld, Boolean verified) {
        Optional<Product> productOptional = productRepository.findById(id);
        if (productOptional.isPresent()) {
            Product product = productOptional.get();

            // Update only non-null values
            if (name != null) product.setName(name);
            if (description != null) product.setDescription(description);
            if (role != null) product.setRole(role);
            if (town != null) product.setTown(town);
            if (stock != null) product.setStock(stock);
            if (price != null) product.setPrice(price);
            if (howManyYearsOld != null) product.setHowManyYearsOld(howManyYearsOld);
            if (verified != null) product.setVerified(verified);

            return productRepository.save(product);
        }
        return null;
    }

    public List<Product> getActiveProductsByRole(String role) {
        return productRepository.findByActiveStatusAndRole(ActiveStatus.ACTIVE, role);
    }

    public List<Product> searchProducts(String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword);
    }

    public List<Product> getProductsByTown(String town) {
        return productRepository.findByTown(town);
    }

    public long getProductCount() {
        return productRepository.count();
    }

    public long getActiveProductCount() {
        return productRepository.countByActiveStatus(ActiveStatus.ACTIVE);
    }
}


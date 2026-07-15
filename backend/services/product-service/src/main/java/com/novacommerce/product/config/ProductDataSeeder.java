package com.novacommerce.product.config;

import java.math.BigDecimal;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.novacommerce.product.entity.Brand;
import com.novacommerce.product.entity.Category;
import com.novacommerce.product.entity.Product;
import com.novacommerce.product.enums.ProductStatus;
import com.novacommerce.product.repository.BrandRepository;
import com.novacommerce.product.repository.CategoryRepository;
import com.novacommerce.product.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ProductDataSeeder implements CommandLineRunner {

    private static final Pattern NON_SLUG_CHARS = Pattern.compile("[^a-z0-9]+");

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;

    @Value("${app.seed.products.enabled:true}")
    private boolean seedEnabled;

    @Override
    public void run(String... args) {
        if (!seedEnabled) {
            return;
        }

        seedCategories();
        seedBrands();
        seedProducts();
    }

    private void seedCategories() {
        for (var category : categories()) {
            categoryRepository.findByNameIgnoreCase(category.name())
                    .orElseGet(() -> categoryRepository.save(Category.builder()
                            .name(category.name())
                            .slug(slugify(category.name()))
                            .description(category.description())
                            .icon(category.icon())
                            .active(true)
                            .build()));
        }
    }

    private void seedBrands() {
        for (var brand : brands()) {
            brandRepository.findByNameIgnoreCase(brand.name())
                    .orElseGet(() -> brandRepository.save(Brand.builder()
                            .name(brand.name())
                            .slug(slugify(brand.name()))
                            .description(brand.description())
                            .active(true)
                            .build()));
        }
    }

    private void seedProducts() {
        var products = List.of(
                product("NC-ELE-1001", "Apple AirPods Pro 2", "Electronics", "Apple", "Adaptive audio wireless earbuds", "Premium earbuds with active noise cancellation.", "24900.00", "21900.00", 36, true, true),
                product("NC-ELE-1002", "Samsung Galaxy Buds 3", "Electronics", "Samsung", "Compact wireless earbuds", "Everyday earbuds with clear calls and rich sound.", "14999.00", "12999.00", 42, true, false),
                product("NC-ELE-1003", "Sony WH-1000XM5 Headphones", "Electronics", "Sony", "Noise cancelling over-ear headphones", "Flagship headphones for work, travel, and music.", "34990.00", "29990.00", 18, true, true),
                product("NC-ELE-1004", "LG UltraGear 27 Gaming Monitor", "Electronics", "LG", "Fast refresh gaming display", "27-inch monitor tuned for smooth gameplay.", "28999.00", "25999.00", 14, true, false),
                product("NC-ELE-1005", "Dell Inspiron 14 Laptop", "Electronics", "Dell", "Portable everyday laptop", "A reliable laptop for office, study, and browsing.", "57990.00", "52990.00", 12, true, true),
                product("NC-ELE-1006", "HP Pavilion x360", "Electronics", "HP", "Convertible touchscreen laptop", "Flexible 2-in-1 laptop for work and creativity.", "66990.00", "61990.00", 10, true, false),
                product("NC-ELE-1007", "Lenovo IdeaPad Slim 5", "Electronics", "Lenovo", "Slim productivity laptop", "Lightweight laptop with balanced performance.", "62990.00", "58990.00", 15, true, false),
                product("NC-ELE-1008", "Philips Smart LED Bulb Pack", "Electronics", "Philips", "Connected smart lighting", "Energy-saving bulbs with app control.", "2499.00", "1999.00", 80, true, true),
                product("NC-FAS-2001", "Nike Dri-FIT Training Tee", "Fashion", "Nike", "Breathable training t-shirt", "A lightweight tee for gym and outdoor workouts.", "1995.00", "1695.00", 75, true, true),
                product("NC-FAS-2002", "Adidas Essentials Hoodie", "Fashion", "Adidas", "Everyday fleece hoodie", "Soft hoodie for casual layering.", "4599.00", "3999.00", 44, true, false),
                product("NC-FAS-2003", "Puma Run Favorite Shorts", "Fashion", "Puma", "Lightweight running shorts", "Quick-dry shorts for daily runs.", "2499.00", "1999.00", 52, true, false),
                product("NC-FAS-2004", "Generic Cotton Crew Socks", "Fashion", "Generic", "Six-pack cotton socks", "Soft crew socks for daily wear.", "699.00", "499.00", 140, true, true),
                product("NC-FAS-2005", "Nike Air Max Casual Shoes", "Fashion", "Nike", "Lifestyle sneakers", "Comfort-focused sneakers for daily use.", "11895.00", "9995.00", 23, true, true),
                product("NC-FAS-2006", "Adidas Classic Backpack", "Fashion", "Adidas", "Durable daily backpack", "Roomy backpack for commute, school, and gym.", "3299.00", "2799.00", 38, true, false),
                product("NC-FAS-2007", "Puma Training Joggers", "Fashion", "Puma", "Stretch training joggers", "Comfortable joggers for workouts and travel.", "3999.00", "3499.00", 31, true, false),
                product("NC-FAS-2008", "Generic Denim Jacket", "Fashion", "Generic", "Classic denim outerwear", "A versatile jacket for casual styling.", "2999.00", "2499.00", 27, true, false),
                product("NC-HOM-3001", "Philips Air Fryer 4.1L", "Home & Kitchen", "Philips", "Compact digital air fryer", "Cook crisp snacks with less oil.", "10995.00", "8995.00", 22, true, true),
                product("NC-HOM-3002", "LG 260L Double Door Refrigerator", "Home & Kitchen", "LG", "Energy efficient refrigerator", "Spacious fridge for family kitchens.", "32990.00", "29990.00", 8, true, true),
                product("NC-HOM-3003", "Samsung 7kg Front Load Washer", "Home & Kitchen", "Samsung", "Efficient washing machine", "Gentle wash cycles for daily laundry.", "36990.00", "32990.00", 7, true, false),
                product("NC-HOM-3004", "Sony Bluetooth Soundbar", "Home & Kitchen", "Sony", "Slim home entertainment soundbar", "Upgrade movie nights with clear, powerful audio.", "18990.00", "15990.00", 16, true, false),
                product("NC-HOM-3005", "Generic Non-Stick Cookware Set", "Home & Kitchen", "Generic", "Five-piece cookware set", "Durable pans and kadai for everyday cooking.", "3499.00", "2999.00", 45, true, true),
                product("NC-HOM-3006", "Philips Mixer Grinder 750W", "Home & Kitchen", "Philips", "Powerful kitchen mixer", "Three jars for grinding, blending, and chutneys.", "5495.00", "4495.00", 28, true, false),
                product("NC-HOM-3007", "Generic Bamboo Storage Rack", "Home & Kitchen", "Generic", "Multi-tier storage rack", "Clean up kitchen counters and utility spaces.", "1999.00", "1599.00", 55, true, false),
                product("NC-HOM-3008", "LG Microwave Oven 28L", "Home & Kitchen", "LG", "Convection microwave oven", "Bake, grill, and reheat with smart presets.", "15990.00", "13990.00", 12, true, false),
                product("NC-BEA-4001", "Generic Vitamin C Face Serum", "Beauty & Personal Care", "Generic", "Daily glow serum", "Lightweight serum for brighter-looking skin.", "899.00", "699.00", 90, true, true),
                product("NC-BEA-4002", "Philips Hair Dryer 1600W", "Beauty & Personal Care", "Philips", "Compact hair dryer", "Fast drying with gentle heat settings.", "1495.00", "1195.00", 58, true, true),
                product("NC-BEA-4003", "Generic Aloe Vera Gel", "Beauty & Personal Care", "Generic", "Soothing skin gel", "Hydrating gel for face, body, and hair.", "399.00", "299.00", 120, true, false),
                product("NC-BEA-4004", "Philips Beard Trimmer", "Beauty & Personal Care", "Philips", "Cordless grooming trimmer", "Precision trimming with long battery life.", "1995.00", "1595.00", 64, true, true),
                product("NC-BEA-4005", "Generic Matte Lipstick Set", "Beauty & Personal Care", "Generic", "Five-shade lipstick set", "Comfortable matte shades for everyday wear.", "999.00", "799.00", 73, true, false),
                product("NC-BEA-4006", "Generic Sunscreen SPF 50", "Beauty & Personal Care", "Generic", "Lightweight daily sunscreen", "Non-greasy broad spectrum sun protection.", "649.00", "549.00", 86, true, false),
                product("NC-BEA-4007", "Generic Herbal Shampoo", "Beauty & Personal Care", "Generic", "Gentle daily shampoo", "Mild cleanser for soft, fresh hair.", "499.00", "399.00", 110, true, false),
                product("NC-BEA-4008", "Generic Body Lotion Twin Pack", "Beauty & Personal Care", "Generic", "Moisturizing lotion pack", "Daily hydration for dry skin.", "799.00", "649.00", 97, true, false),
                product("NC-SPT-5001", "Nike Yoga Mat 6mm", "Sports & Fitness", "Nike", "Cushioned workout mat", "Stable support for yoga and floor workouts.", "3495.00", "2995.00", 34, true, true),
                product("NC-SPT-5002", "Adidas Training Gloves", "Sports & Fitness", "Adidas", "Grip support gym gloves", "Protective gloves for strength training.", "1799.00", "1399.00", 49, true, false),
                product("NC-SPT-5003", "Puma Gym Duffel Bag", "Sports & Fitness", "Puma", "Spacious sports duffel", "Carry shoes, gear, and daily essentials.", "2999.00", "2499.00", 29, true, false),
                product("NC-SPT-5004", "Generic Resistance Bands Set", "Sports & Fitness", "Generic", "Five-level band kit", "Portable strength training for home workouts.", "999.00", "749.00", 88, true, true),
                product("NC-SPT-5005", "Nike Running Cap", "Sports & Fitness", "Nike", "Lightweight running cap", "Breathable cap for sunny runs.", "1695.00", "1395.00", 40, true, false),
                product("NC-SPT-5006", "Adidas Football Size 5", "Sports & Fitness", "Adidas", "Durable training football", "Reliable ball for practice and weekend games.", "2499.00", "1999.00", 37, true, true),
                product("NC-SPT-5007", "Puma Water Bottle 750ml", "Sports & Fitness", "Puma", "Leak-proof sports bottle", "Hydration bottle for gym and travel.", "899.00", "699.00", 92, true, false),
                product("NC-SPT-5008", "Generic Adjustable Dumbbell Pair", "Sports & Fitness", "Generic", "Home strength dumbbells", "Adjustable weights for full-body workouts.", "4999.00", "4299.00", 18, true, false),
                product("NC-BOK-6001", "Atomic Habits Paperback", "Books", "Generic", "Productivity bestseller", "A practical guide to building better habits.", "799.00", "499.00", 100, true, true),
                product("NC-BOK-6002", "Clean Code Developer Guide", "Books", "Generic", "Software engineering classic", "A readable guide to writing maintainable code.", "1299.00", "999.00", 35, true, false),
                product("NC-BOK-6003", "The Psychology of Money", "Books", "Generic", "Personal finance book", "Timeless lessons on wealth and behavior.", "599.00", "399.00", 115, true, true),
                product("NC-BOK-6004", "Ikigai Hardcover", "Books", "Generic", "Lifestyle and purpose book", "A gentle read about meaning and longevity.", "699.00", "499.00", 84, true, false),
                product("NC-BOK-6005", "Children's Story Collection", "Books", "Generic", "Illustrated kids stories", "A colorful collection for bedtime reading.", "499.00", "349.00", 126, true, false),
                product("NC-BOK-6006", "Exam Prep Notebook Pack", "Books", "Generic", "Five ruled notebooks", "Durable notebooks for school and coaching.", "399.00", "299.00", 160, true, false),
                product("NC-BOK-6007", "Business Strategy Handbook", "Books", "Generic", "Management reference book", "Clear frameworks for teams and founders.", "999.00", "799.00", 42, true, false),
                product("NC-BOK-6008", "Indian Cooking Recipe Book", "Books", "Generic", "Home cooking cookbook", "Regional recipes for daily meals and occasions.", "699.00", "549.00", 70, true, false),
                product("NC-TOY-7001", "Generic Building Blocks 500pc", "Toys & Games", "Generic", "Creative block set", "Colorful blocks for imaginative construction.", "1499.00", "1199.00", 64, true, true),
                product("NC-TOY-7002", "Generic Remote Control Car", "Toys & Games", "Generic", "Rechargeable RC car", "Fast toy car for indoor and outdoor play.", "1999.00", "1599.00", 38, true, true),
                product("NC-TOY-7003", "Generic Strategy Board Game", "Toys & Games", "Generic", "Family board game", "A fun strategy game for game nights.", "999.00", "799.00", 57, true, false),
                product("NC-TOY-7004", "Sony Kids Karaoke Mic", "Toys & Games", "Sony", "Bluetooth singing microphone", "Portable mic with speaker for young performers.", "2499.00", "1999.00", 26, true, false),
                product("NC-TOY-7005", "Generic Puzzle Set 1000pc", "Toys & Games", "Generic", "Challenging jigsaw puzzle", "A relaxing puzzle for teens and adults.", "799.00", "599.00", 76, true, false),
                product("NC-TOY-7006", "Generic Plush Teddy Bear", "Toys & Games", "Generic", "Soft plush toy", "A cuddly gift for kids and collectors.", "899.00", "699.00", 82, true, false),
                product("NC-TOY-7007", "Generic STEM Robot Kit", "Toys & Games", "Generic", "Beginner robotics kit", "Hands-on kit for learning electronics basics.", "2999.00", "2499.00", 20, true, true),
                product("NC-TOY-7008", "Generic Art & Craft Box", "Toys & Games", "Generic", "Creative craft supplies", "A complete craft kit for weekend projects.", "1299.00", "999.00", 61, true, false),
                product("NC-GRO-8001", "Generic Basmati Rice 5kg", "Grocery", "Generic", "Long grain basmati rice", "Aromatic rice for biryani and daily meals.", "899.00", "749.00", 130, true, true),
                product("NC-GRO-8002", "Generic Cold Pressed Groundnut Oil", "Grocery", "Generic", "One-liter cooking oil", "Rich, nutty oil for Indian cooking.", "399.00", "349.00", 96, true, false),
                product("NC-GRO-8003", "Generic Premium Almonds 500g", "Grocery", "Generic", "Whole California almonds", "Crunchy almonds for snacks and desserts.", "699.00", "599.00", 75, true, true),
                product("NC-GRO-8004", "Generic Masala Tea Pack", "Grocery", "Generic", "Spiced tea blend", "Bold tea leaves with warming spices.", "299.00", "249.00", 145, true, false),
                product("NC-GRO-8005", "Generic Organic Honey", "Grocery", "Generic", "Pure honey jar", "Natural sweetener for breakfast and drinks.", "449.00", "379.00", 88, true, false),
                product("NC-GRO-8006", "Generic Whole Wheat Atta 10kg", "Grocery", "Generic", "Stone-ground wheat flour", "Soft rotis and everyday baking.", "599.00", "529.00", 102, true, true),
                product("NC-GRO-8007", "Generic Mixed Dry Fruits", "Grocery", "Generic", "Premium dry fruit mix", "A snack mix of nuts, raisins, and seeds.", "899.00", "749.00", 58, true, false),
                product("NC-GRO-8008", "Generic Breakfast Cereal", "Grocery", "Generic", "High-fiber cereal box", "Quick breakfast with milk or yogurt.", "399.00", "329.00", 79, true, false),
                product("NC-AUT-9001", "Generic Car Vacuum Cleaner", "Automotive", "Generic", "Portable 12V vacuum", "Compact cleaner for car interiors.", "1499.00", "1199.00", 41, true, true),
                product("NC-AUT-9002", "Sony Car Bluetooth Receiver", "Automotive", "Sony", "Wireless audio receiver", "Add Bluetooth streaming to your car stereo.", "2499.00", "1999.00", 27, true, false),
                product("NC-AUT-9003", "Generic Microfiber Cloth Pack", "Automotive", "Generic", "Six-piece cleaning cloth set", "Soft cloths for polishing and detailing.", "499.00", "349.00", 118, true, false),
                product("NC-AUT-9004", "Generic Tyre Inflator", "Automotive", "Generic", "Portable digital inflator", "Quick inflation for tyres and sports gear.", "2499.00", "1999.00", 33, true, true),
                product("NC-AUT-9005", "Generic Dashboard Phone Mount", "Automotive", "Generic", "Adjustable car phone holder", "Secure mount for navigation and calls.", "799.00", "599.00", 89, true, false),
                product("NC-AUT-9006", "Philips Car Air Purifier", "Automotive", "Philips", "Compact cabin air purifier", "Filters dust and odors inside your car.", "6999.00", "5999.00", 15, true, false),
                product("NC-AUT-9007", "Generic Bike Helmet", "Automotive", "Generic", "ISI-style full face helmet", "Comfortable helmet for city rides.", "1999.00", "1599.00", 46, true, false),
                product("NC-AUT-9008", "Generic Car Care Shampoo", "Automotive", "Generic", "Foaming car wash liquid", "Gentle shampoo for glossy paint finish.", "399.00", "299.00", 110, true, false),
                product("NC-HEA-10001", "Generic Digital Thermometer", "Health", "Generic", "Fast-read thermometer", "Simple thermometer for home health kits.", "349.00", "249.00", 95, true, true),
                product("NC-HEA-10002", "Philips Electric Toothbrush", "Health", "Philips", "Rechargeable toothbrush", "Gentle sonic cleaning for daily oral care.", "3499.00", "2999.00", 32, true, true),
                product("NC-HEA-10003", "Generic Blood Pressure Monitor", "Health", "Generic", "Digital BP monitor", "Easy home monitoring with large display.", "2499.00", "1999.00", 26, true, false),
                product("NC-HEA-10004", "Generic First Aid Kit", "Health", "Generic", "Compact emergency kit", "Essential supplies for home and travel.", "899.00", "699.00", 68, true, true),
                product("NC-HEA-10005", "Generic Multivitamin Tablets", "Health", "Generic", "Daily wellness supplement", "Balanced multivitamins for adults.", "599.00", "499.00", 104, true, false),
                product("NC-HEA-10006", "Generic Yoga Support Blocks", "Health", "Generic", "Pair of foam yoga blocks", "Support and alignment for yoga practice.", "799.00", "599.00", 72, true, false),
                product("NC-HEA-10007", "Generic Pulse Oximeter", "Health", "Generic", "Finger pulse monitor", "Quick oxygen saturation and pulse readings.", "1499.00", "999.00", 49, true, false),
                product("NC-HEA-10008", "Generic Hot Water Bag", "Health", "Generic", "Reusable heat therapy bag", "Comforting warmth for aches and cramps.", "399.00", "299.00", 121, true, false));

        for (var seed : products) {
            if (productRepository.existsBySkuIgnoreCase(seed.sku())) {
                continue;
            }

            productRepository.save(Product.builder()
                    .name(seed.name())
                    .slug(slugify(seed.name()))
                    .description(seed.description())
                    .shortDescription(seed.shortDescription())
                    .sku(seed.sku())
                    .price(new BigDecimal(seed.price()))
                    .salePrice(new BigDecimal(seed.salePrice()))
                    .stockQuantity(seed.stockQuantity())
                    .lowStockThreshold(10)
                    .status(seed.active() ? ProductStatus.ACTIVE : ProductStatus.DRAFT)
                    .category(seed.category())
                    .brand(seed.brand())
                    .featured(seed.featured())
                    .popular(seed.popular())
                    .metaTitle(seed.name())
                    .metaDescription(seed.shortDescription())
                    .build());
        }
    }

    private List<CategorySeed> categories() {
        return List.of(
                new CategorySeed("Electronics", "Phones, laptops, audio, and smart accessories.", "devices"),
                new CategorySeed("Fashion", "Apparel, footwear, bags, and daily style essentials.", "shirt"),
                new CategorySeed("Home & Kitchen", "Appliances, cookware, organization, and home upgrades.", "home"),
                new CategorySeed("Beauty & Personal Care", "Grooming, skincare, hair care, and personal essentials.", "sparkles"),
                new CategorySeed("Sports & Fitness", "Training, running, yoga, and outdoor fitness gear.", "dumbbell"),
                new CategorySeed("Books", "Books, notebooks, study material, and reading favorites.", "book-open"),
                new CategorySeed("Toys & Games", "Toys, puzzles, games, and creative kits.", "gamepad"),
                new CategorySeed("Grocery", "Pantry staples, snacks, oils, and household groceries.", "shopping-basket"),
                new CategorySeed("Automotive", "Car and bike accessories, care, and travel tools.", "car"),
                new CategorySeed("Health", "Wellness, home care, monitoring, and daily health products.", "heart-pulse"));
    }

    private List<BrandSeed> brands() {
        return List.of(
                new BrandSeed("Apple", "Premium consumer technology and accessories."),
                new BrandSeed("Samsung", "Consumer electronics, appliances, and mobile accessories."),
                new BrandSeed("Sony", "Audio, entertainment, and electronics products."),
                new BrandSeed("Nike", "Performance sportswear and fitness essentials."),
                new BrandSeed("Adidas", "Sportswear, footwear, and training gear."),
                new BrandSeed("Puma", "Sports lifestyle, footwear, and fitness products."),
                new BrandSeed("LG", "Home appliances and consumer electronics."),
                new BrandSeed("Dell", "Computers, monitors, and productivity devices."),
                new BrandSeed("HP", "Laptops, printers, and personal computing."),
                new BrandSeed("Lenovo", "Laptops, tablets, and productivity devices."),
                new BrandSeed("Philips", "Personal care, lighting, home, and health products."),
                new BrandSeed("Generic", "Reliable everyday essentials across categories."));
    }

    private ProductSeed product(String sku, String name, String category, String brand,
                                String shortDescription, String description, String price,
                                String salePrice, int stockQuantity, boolean featured,
                                boolean popular) {
        return new ProductSeed(sku, name, category, brand, shortDescription, description,
                price, salePrice, stockQuantity, true, featured, popular);
    }

    private String slugify(String value) {
        return NON_SLUG_CHARS.matcher(value.toLowerCase(Locale.ROOT).trim())
                .replaceAll("-")
                .replaceAll("(^-|-$)", "");
    }

    private record CategorySeed(String name, String description, String icon) {
    }

    private record BrandSeed(String name, String description) {
    }

    private record ProductSeed(String sku, String name, String category, String brand,
                               String shortDescription, String description, String price,
                               String salePrice, int stockQuantity, boolean active,
                               boolean featured, boolean popular) {
    }
}

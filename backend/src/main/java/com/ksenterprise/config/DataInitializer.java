package com.ksenterprise.config;

import com.ksenterprise.model.*;
import com.ksenterprise.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final CompanyRepository companyRepository;
    private final CeoRepository ceoRepository;
    private final WebsiteContentRepository websiteContentRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        initializeAdminUser();
        initializeCompanyAndCeo();
        initializeCategoriesAndProducts();
        initializeWebsiteContent();
    }

    private void initializeAdminUser() {
        if (!userRepository.existsByEmail("admin@ksenterprises.com")) {
            User admin = User.builder()
                    .name("Admin User")
                    .email("admin@ksenterprises.com")
                    .phone("+91 9876543210")
                    .passwordHash(passwordEncoder.encode("Admin@123"))
                    .role(Role.ADMIN)
                    .authProvider(AuthProvider.LOCAL)
                    .active(true)
                    .build();
            userRepository.save(admin);
            log.info("Default admin user created: admin@ksenterprises.com / Admin@123");
        }
    }

    private void initializeCompanyAndCeo() {
        if (companyRepository.count() == 0) {
            Company company = Company.builder()
                    .companyName("K's Enterprises")
                    .logoUrl("/assets/logos/ks-enterprises-logo.svg")
                    .gstNumber("[GST_NUMBER_PLACEHOLDER]")
                    .address("[COMPANY_ADDRESS_PLACEHOLDER]")
                    .phone("[PHONE_NUMBER_PLACEHOLDER]")
                    .email("[EMAIL_ADDRESS_PLACEHOLDER]")
                    .whatsappNumber("[WHATSAPP_NUMBER_PLACEHOLDER]")
                    .description("K's Enterprises is dedicated to providing premium quality fish feed formulated for optimal aquaculture nutrition, high growth rates, and clean water retention.")
                    .build();
            Company savedCompany = companyRepository.save(company);

            Ceo ceo = Ceo.builder()
                    .company(savedCompany)
                    .ceoName("[CEO_NAME_PLACEHOLDER]")
                    .ceoImage("/assets/images/ceo-placeholder.svg")
                    .phone("[CEO_PHONE_PLACEHOLDER]")
                    .email("[CEO_EMAIL_PLACEHOLDER]")
                    .bio("Leading K's Enterprises with a vision to deliver scientifically balanced, high-protein fish feed formulations to empower aquaculture farmers.")
                    .build();
            ceoRepository.save(ceo);
            log.info("Initialized default Company and CEO profile placeholders.");
        }
    }

    private void initializeCategoriesAndProducts() {
        if (categoryRepository.count() == 0) {
            Category floating = Category.builder()
                    .name("Floating Pellets")
                    .slug("floating-pellets")
                    .description("Extruded high-protein floating feed suitable for surface-feeding fish species.")
                    .iconName("bubble-up")
                    .active(true)
                    .build();

            Category sinking = Category.builder()
                    .name("Sinking Pellets")
                    .slug("sinking-pellets")
                    .description("Dense, slow-disintegrating sinking feed formulated for bottom feeders.")
                    .iconName("anchor")
                    .active(true)
                    .build();

            Category starter = Category.builder()
                    .name("Starter Crumbles")
                    .slug("starter-crumbles")
                    .description("Micro-sized nutrient-dense crumbles designed for fry, fingerlings, and nursery ponds.")
                    .iconName("sparkles")
                    .active(true)
                    .build();

            Category broodstock = Category.builder()
                    .name("Broodstock Special")
                    .slug("broodstock-special")
                    .description("Enhanced formulation rich in fatty acids and vitamins for breeding fish.")
                    .iconName("award")
                    .active(true)
                    .build();

            categoryRepository.saveAll(List.of(floating, sinking, starter, broodstock));

            // Add sample Products
            Product p1 = Product.builder()
                    .category(floating)
                    .name("AquaGrow Floating Feed 28%")
                    .slug("aquagrow-floating-feed-28")
                    .price(new BigDecimal("1650.00"))
                    .description("Premium extruded floating pellets engineered for rapid growth and minimal water pollution. Perfect for commercial aquaculture farms.")
                    .specifications("Pellet Size: 3.0mm - 4.0mm | Water Stability: 3+ Hours | Digestibility: High")
                    .suitableFish("Tilapia, Pangasius, Rohu, Catla")
                    .feedType("Floating Pellets")
                    .packageSize("40 kg Bag")
                    .nutritionalInfo("{\"crude_protein\": \"28%\", \"crude_fat\": \"5.0%\", \"crude_fiber\": \"5.5%\", \"moisture\": \"10.0%\", \"calcium\": \"1.2%\", \"phosphorus\": \"0.8%\"}")
                    .availability(Availability.AVAILABLE)
                    .primaryImage("/assets/images/product-floating-feed-28.svg")
                    .additionalImages("[\"/assets/images/product-floating-feed-28.svg\"]")
                    .featured(true)
                    .active(true)
                    .build();

            Product p2 = Product.builder()
                    .category(floating)
                    .name("AquaGrow Floating Feed 32% High-Protein")
                    .slug("aquagrow-floating-feed-32")
                    .price(new BigDecimal("1950.00"))
                    .description("High-protein floating feed formulated with marine fish meal and fortified amino acids for maximum weight gain in fingerlings and grow-out stages.")
                    .specifications("Pellet Size: 4.0mm - 5.0mm | Water Stability: 4+ Hours | Digestibility: Superior")
                    .suitableFish("Tilapia, Seabass, Murrel, Pangasius")
                    .feedType("Floating Pellets")
                    .packageSize("40 kg Bag")
                    .nutritionalInfo("{\"crude_protein\": \"32%\", \"crude_fat\": \"6.0%\", \"crude_fiber\": \"4.5%\", \"moisture\": \"9.5%\", \"calcium\": \"1.5%\", \"phosphorus\": \"1.0%\"}")
                    .availability(Availability.AVAILABLE)
                    .primaryImage("/assets/images/product-floating-feed-32.svg")
                    .additionalImages("[\"/assets/images/product-floating-feed-32.svg\"]")
                    .featured(true)
                    .active(true)
                    .build();

            Product p3 = Product.builder()
                    .category(sinking)
                    .name("BottomPro Sinking Feed 30%")
                    .slug("bottompro-sinking-feed-30")
                    .price(new BigDecimal("1800.00"))
                    .description("Specially formulated sinking pellets that remain intact underwater, preventing nutrient leaching for bottom foraging species.")
                    .specifications("Pellet Size: 3.5mm | Sinking Speed: Moderate | Water Stability: 2+ Hours")
                    .suitableFish("Catla, Mrigal, Carp, Catfish")
                    .feedType("Sinking Pellets")
                    .packageSize("50 kg Bag")
                    .nutritionalInfo("{\"crude_protein\": \"30%\", \"crude_fat\": \"4.5%\", \"crude_fiber\": \"6.0%\", \"moisture\": \"11.0%\", \"calcium\": \"1.4%\", \"phosphorus\": \"0.9%\"}")
                    .availability(Availability.AVAILABLE)
                    .primaryImage("/assets/images/product-sinking-feed-30.svg")
                    .additionalImages("[\"/assets/images/product-sinking-feed-30.svg\"]")
                    .featured(true)
                    .active(true)
                    .build();

            Product p4 = Product.builder()
                    .category(starter)
                    .name("Nursery Starter Micro-Crumbles 40%")
                    .slug("nursery-starter-micro-crumbles-40")
                    .price(new BigDecimal("2400.00"))
                    .description("Ultra-fine micro-crumbles for hatcheries and nursery ponds. Packed with digestible proteins and immunity boosters.")
                    .specifications("Granule Size: 0.5mm - 1.0mm | Water Stability: High | Immune Fortification: Vitamin C & E")
                    .suitableFish("Fry, Fingerlings, All Species Nursery")
                    .feedType("Starter Crumbles")
                    .packageSize("20 kg Bag")
                    .nutritionalInfo("{\"crude_protein\": \"40%\", \"crude_fat\": \"8.0%\", \"crude_fiber\": \"3.0%\", \"moisture\": \"8.5%\", \"calcium\": \"1.8%\", \"phosphorus\": \"1.2%\"}")
                    .availability(Availability.AVAILABLE)
                    .primaryImage("/assets/images/product-starter-crumbles.svg")
                    .additionalImages("[\"/assets/images/product-starter-crumbles.svg\"]")
                    .featured(false)
                    .active(true)
                    .build();

            Product p5 = Product.builder()
                    .category(broodstock)
                    .name("Breeder Gold Broodstock Booster 38%")
                    .slug("breeder-gold-broodstock-booster-38")
                    .price(new BigDecimal("3100.00"))
                    .description("Specialized reproductive nutritional feed fortified with Omega-3, Astaxanthin, and minerals for superior egg viability and high spawning rates.")
                    .specifications("Pellet Size: 6.0mm | Fortified with HUFA & Astaxanthin")
                    .suitableFish("Broodstock Fish, Carp, Tilapia, Seabass")
                    .feedType("Broodstock Special")
                    .packageSize("25 kg Bag")
                    .nutritionalInfo("{\"crude_protein\": \"38%\", \"crude_fat\": \"9.0%\", \"crude_fiber\": \"3.5%\", \"moisture\": \"9.0%\", \"calcium\": \"2.0%\", \"phosphorus\": \"1.4%\"}")
                    .availability(Availability.OUT_OF_STOCK)
                    .primaryImage("/assets/images/product-broodstock.svg")
                    .additionalImages("[\"/assets/images/product-broodstock.svg\"]")
                    .featured(false)
                    .active(true)
                    .build();

            productRepository.saveAll(List.of(p1, p2, p3, p4, p5));
            log.info("Initialized default Fish Feed Categories and Products.");
        }
    }

    private void initializeWebsiteContent() {
        if (websiteContentRepository.count() == 0) {
            WebsiteContent hero = WebsiteContent.builder()
                    .sectionKey("hero")
                    .contentJson("{\"heading\": \"Quality Fish Feed for Better Growth\", \"subheading\": \"Scientifically formulated floating and sinking feeds engineered for optimal feed conversion ratio (FCR), enhanced immunity, and cleaner pond ecosystems.\", \"ctaText\": \"Explore Products\", \"ctaLink\": \"/pages/products/index.html\"}")
                    .build();

            WebsiteContent whyChooseUs = WebsiteContent.builder()
                    .sectionKey("why_choose_us")
                    .contentJson("{\"title\": \"Why Choose K's Enterprises?\", \"items\": [{\"title\": \"Quality Products\", \"description\": \"Formulated with tested ingredients and verified protein concentrations.\"}, {\"title\": \"Reliable Service\", \"description\": \"Prompt order coordination and dedicated farmer assistance via WhatsApp.\"}, {\"title\": \"Product Variety\", \"description\": \"Complete nutritional solutions spanning fry starter crumbles to grow-out feeds.\"}, {\"title\": \"Competitive Pricing\", \"description\": \"Direct pricing structured to maximize aquaculture farmer profitability.\"}, {\"title\": \"Customer Support\", \"description\": \"Responsive communication and technical guidance tailored to fish species.\"}, {\"title\": \"Trusted Service\", \"description\": \"Consistent batch testing and strict hygiene standards across all feeds.\"}]}")
                    .build();

            WebsiteContent faqs = WebsiteContent.builder()
                    .sectionKey("faqs")
                    .contentJson("{\"items\": [{\"question\": \"How do I place an order for K's Enterprises fish feed?\", \"answer\": \"Click the \\\"Order Through WhatsApp\\\" button on any product page. This will automatically open WhatsApp with your product details filled in, and our team will coordinate the order directly with you.\"}, {\"question\": \"What is the minimum order quantity?\", \"answer\": \"Order quantities can be discussed directly with our sales team via WhatsApp or phone based on your pond requirements and location.\"}, {\"question\": \"How do I select the right pellet size for my fish?\", \"answer\": \"For nursery fry, use our Starter Crumbles (0.5mm - 1mm). For juvenile fish up to 100g, use 2mm - 3mm pellets. For adult grow-out fish above 200g, use 4mm - 5mm floating or sinking pellets.\"}, {\"question\": \"Do you deliver to farm locations?\", \"answer\": \"Delivery arrangements and logistics are coordinated based on your farm location when you connect with us via WhatsApp or phone.\"}]}")
                    .build();

            websiteContentRepository.saveAll(List.of(hero, whyChooseUs, faqs));
            log.info("Initialized default CMS website content.");
        }
    }
}

package com.punemumbai.cab.config;

import com.punemumbai.cab.entity.*;
import com.punemumbai.cab.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

    private final VehicleRepository vehicleRepository;
    private final RouteRepository routeRepository;
    private final FAQRepository faqRepository;
    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(VehicleRepository vehicleRepository,
                      RouteRepository routeRepository,
                      FAQRepository faqRepository,
                      AdminUserRepository adminUserRepository,
                      PasswordEncoder passwordEncoder) {
        this.vehicleRepository = vehicleRepository;
        this.routeRepository = routeRepository;
        this.faqRepository = faqRepository;
        this.adminUserRepository = adminUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedVehicles();
        seedRoutes();
        seedFAQs();
        seedAdminUser();
        logger.info("✅ Seed data loaded successfully");
    }

    private void seedVehicles() {
        if (vehicleRepository.count() > 0) return;

        List<Vehicle> vehicles = List.of(
            createVehicle("Sedan", "sedan", "/images/sedan.jpg", 5,
                "Comfortable sedan for up to 4 passengers + driver. Perfect for business trips and small families.",
                2999.0),
            createVehicle("SUV", "suv", "/images/suv.jpg", 7,
                "Spacious SUV with room for 6 passengers + driver. Ideal for family outings.",
                4499.0),
            createVehicle("Innova", "innova", "/images/innova.jpg", 7,
                "Toyota Innova with 6 passenger seats + driver. Known for comfort on long rides.",
                4999.0),
            createVehicle("Innova Crysta", "innova-crysta", "/images/innova-crysta.jpg", 7,
                "Premium Toyota Innova Crysta with 6 passenger seats + driver. Top-tier comfort and features.",
                5999.0)
        );

        vehicleRepository.saveAll(vehicles);
        logger.info("Seeded {} vehicles", vehicles.size());
    }

    private void seedRoutes() {
        if (routeRepository.count() > 0) return;

        List<Route> routes = List.of(
            createRoute("Pune to Mumbai", "pune-to-mumbai-cab",
                "Pune", "Mumbai", 150.0, "3.5 hrs",
                2999.0, 5499.0,
                "Travel from Pune to Mumbai in comfort. Our experienced drivers know the best routes via the Mumbai-Pune Expressway."),
            createRoute("Mumbai to Pune", "mumbai-to-pune-cab",
                "Mumbai", "Pune", 150.0, "3.5 hrs",
                2999.0, 5499.0,
                "Travel from Mumbai to Pune with ease. Enjoy a smooth ride via the expressway with our professional drivers.")
        );

        routeRepository.saveAll(routes);
        logger.info("Seeded {} routes", routes.size());
    }

    private void seedFAQs() {
        if (faqRepository.count() > 0) return;

        List<FAQ> faqs = List.of(
            createFAQ(null, "What is the fare from Pune to Mumbai?",
                "The one-way fare starts at ₹2,999 for a sedan. SUVs and premium vehicles are available at higher prices. Round-trip fare is ₹5,499."),
            createFAQ(null, "How long does the trip take?",
                "The Pune-Mumbai trip typically takes 3 to 4 hours depending on traffic and the route taken via the Mumbai-Pune Expressway."),
            createFAQ(null, "Is one-way travel available?",
                "Yes! We offer both one-way and round-trip options. You can book a one-way cab from Pune to Mumbai or vice versa."),
            createFAQ(null, "Do you offer airport pickup/drop?",
                "Yes, we offer airport pickup and drop services. You can specify your preferred pickup or drop-off location at Chhatrapati Shivaji Maharaj International Airport."),
            createFAQ(null, "Which vehicle should I choose?",
                "For 1-4 passengers, a Sedan is ideal. For 5-6 passengers or more luggage, choose an SUV or Innova. For premium comfort, go for the Innova Crysta."),
            createFAQ(null,"Are toll and taxes included in the fare?",
                "The quoted fare includes driver allowance and fuel. Toll charges and state taxes are additional and will be communicated before the trip."),
            createFAQ("pune-to-mumbai-cab", "What is the fare for Pune to Mumbai?",
                "Pune to Mumbai one-way fare starts at ₹2,999 (sedan). Round-trip is ₹5,499. Prices may vary by vehicle type."),
            createFAQ("mumbai-to-pune-cab", "What is the fare for Mumbai to Pune?",
                "Mumbai to Pune one-way fare starts at ₹2,999 (sedan). Round-trip is ₹5,499. Prices may vary by vehicle type.")
        );

        faqRepository.saveAll(faqs);
        logger.info("Seeded {} FAQs", faqs.size());
    }

    private void seedAdminUser() {
        if (adminUserRepository.count() > 0) return;

        AdminUser admin = new AdminUser();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(AdminUser.Role.ADMIN);

        adminUserRepository.save(admin);
        logger.info("Seeded admin user: admin");
    }

    // Helpers
    private Vehicle createVehicle(String name, String slug, String imageUrl,
                                   int seatingCapacity, String description, double price) {
        Vehicle v = new Vehicle();
        v.setName(name);
        v.setSlug(slug);
        v.setImageUrl(imageUrl);
        v.setSeatingCapacity(seatingCapacity);
        v.setDescription(description);
        v.setPrice(price);
        v.setStatus(Vehicle.Status.ACTIVE);
        return v;
    }

    private Route createRoute(String name, String slug, String origin, String destination,
                               double distanceKm, String travelTime, double oneWayPrice,
                               double roundTripPrice, String description) {
        Route r = new Route();
        r.setName(name);
        r.setSlug(slug);
        r.setOrigin(origin);
        r.setDestination(destination);
        r.setDistanceKm(distanceKm);
        r.setTravelTime(travelTime);
        r.setOneWayPrice(oneWayPrice);
        r.setRoundTripPrice(roundTripPrice);
        r.setDescription(description);
        r.setStatus(Route.Status.ACTIVE);
        return r;
    }

    private FAQ createFAQ(String routeSlug, String question, String answer) {
        FAQ faq = new FAQ();
        faq.setRouteSlug(routeSlug);
        faq.setQuestion(question);
        faq.setAnswer(answer);
        return faq;
    }
}

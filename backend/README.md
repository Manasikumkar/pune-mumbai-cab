# Pune Mumbai Cab - Backend

Spring Boot 3.2.5 backend for the "Pune Mumbai Cab" business website.  
Serves a React frontend with vehicle listings, route pricing, FAQs, and booking enquiries.

## Tech Stack

- **Java 17+**
- **Spring Boot 3.2.5** (Web, Data JPA, Security, Validation)
- **MySQL 8+**
- **JWT** (jjwt 0.12.5) for admin authentication
- **BCrypt** for password hashing

## Project Structure

```
backend/
├── src/main/java/com/punemumbai/cab/
│   ├── PuneMumbaiCabApplication.java        # Entry point
│   ├── config/
│   │   ├── SecurityConfig.java              # Spring Security + CORS + JWT filter
│   │   └── DataSeeder.java                  # Seeds sample data on first run
│   ├── controller/
│   │   ├── VehicleController.java           # /api/vehicles
│   │   ├── RouteController.java             # /api/routes
│   │   ├── EnquiryController.java           # /api/enquiries
│   │   ├── FAQController.java               # /api/faqs
│   │   └── AuthController.java              # /api/admin/login
│   ├── dto/
│   │   ├── VehicleRequest.java / VehicleResponse.java
│   │   ├── RouteRequest.java / RouteResponse.java
│   │   ├── EnquiryRequest.java / EnquiryResponse.java
│   │   ├── FAQResponse.java
│   │   ├── AuthRequest.java / AuthResponse.java
│   │   ├── StatusUpdateRequest.java
│   │   └── ApiResponse.java
│   ├── entity/
│   │   ├── Vehicle.java
│   │   ├── Route.java
│   │   ├── Enquiry.java
│   │   ├── FAQ.java
│   │   └── AdminUser.java
│   ├── exception/
│   │   ├── ResourceNotFoundException.java
│   │   └── GlobalExceptionHandler.java
│   ├── repository/
│   │   ├── VehicleRepository.java
│   │   ├── RouteRepository.java
│   │   ├── EnquiryRepository.java
│   │   ├── FAQRepository.java
│   │   └── AdminUserRepository.java
│   ├── security/
│   │   ├── JwtTokenProvider.java
│   │   └── JwtAuthenticationFilter.java
│   └── service/
│       ├── VehicleService.java
│       ├── RouteService.java
│       ├── EnquiryService.java
│       ├── FAQService.java
│       └── AuthService.java
├── src/main/resources/
│   ├── application.properties
│   └── schema.sql                           # Manual schema (optional)
├── .env.example
├── pom.xml
└── README.md
```

## Prerequisites

- **Java 17+** (JDK)
- **Maven 3.8+**
- **MySQL 8.0+** running locally or remote
- **An IDE** (IntelliJ, VS Code with Java extension, or terminal)

## Setup Instructions

### 1. Create MySQL Database

```sql
mysql -u root -p
```

```sql
CREATE DATABASE pune_mumbai_cab
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
```

Or run the schema file:

```bash
mysql -u root -p < src/main/resources/schema.sql
```

### 2. Set Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with your MySQL credentials and a secure JWT secret:

```env
DB_URL=jdbc:mysql://localhost:3306/pune_mumbai_cab?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
DB_USERNAME=root
DB_PASSWORD=your_actual_password
JWT_SECRET=a-very-long-random-string-at-least-32-chars
CORS_ORIGIN=http://localhost:5173
```

**Windows PowerShell:**

```powershell
$env:DB_URL="jdbc:mysql://localhost:3306/pune_mumbai_cab?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your_password"
$env:JWT_SECRET="your-32-char-secret"
$env:CORS_ORIGIN="http://localhost:5173"
```

**Linux/Mac:**

```bash
export DB_URL="jdbc:mysql://localhost:3306/pune_mumbai_cab?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true"
export DB_USERNAME="root"
export DB_PASSWORD="your_password"
export JWT_SECRET="your-32-char-secret"
export CORS_ORIGIN="http://localhost:5173"
```

### 3. Build and Run

**Using Maven Wrapper (no Maven install needed):**

```bash
cd backend

# Build
./mvnw clean package -DskipTests     # Linux/Mac
mvnw.cmd clean package -DskipTests    # Windows

# Run
java -jar target/cab-backend-1.0.0.jar

# Or use Maven directly
./mvnw spring-boot:run                # Linux/Mac
mvnw.cmd spring-boot:run              # Windows
```

**If you have Maven installed globally:**

```bash
mvn clean package -DskipTests
java -jar target/cab-backend-1.0.0.jar
```

The server starts on `http://localhost:8080`.

### 4. Seed Data

On first run, the `DataSeeder` CommandLineRunner automatically inserts:

| Data       | Details                                                                 |
|------------|-------------------------------------------------------------------------|
| Vehicles   | Sedan (₹2,999), SUV (₹4,499), Innova (₹4,999), Innova Crysta (₹5,999) |
| Routes     | Pune→Mumbai & Mumbai→Pune (150km, 3.5hrs, ₹2,999 one-way / ₹5,499 RT) |
| FAQs       | 6 general + 2 route-specific                                           |
| Admin User | username: `admin`, password: `admin123`                                |

## API Reference

### Public APIs (No Auth)

| Method | Endpoint                | Description                          |
|--------|-------------------------|--------------------------------------|
| GET    | `/api/vehicles`         | List active vehicles                 |
| GET    | `/api/vehicles/{slug}`  | Get vehicle by slug                  |
| GET    | `/api/routes`           | List active routes                   |
| GET    | `/api/routes/{slug}`    | Get route by slug                    |
| GET    | `/api/faqs`             | List general FAQs                    |
| GET    | `/api/faqs?routeSlug=x` | FAQs filtered by route slug          |
| POST   | `/api/enquiries`        | Submit booking enquiry (rate-limited) |

### Admin APIs (JWT Required)

All admin endpoints require: `Authorization: Bearer <token>`

| Method   | Endpoint                         | Description                    |
|----------|----------------------------------|--------------------------------|
| POST     | `/api/admin/login`               | Login, get JWT token           |
| GET      | `/api/admin/vehicles`            | List all vehicles (incl. inactive) |
| POST     | `/api/admin/vehicles`            | Create vehicle                 |
| PUT      | `/api/admin/vehicles/{id}`       | Update vehicle (incl. price)   |
| DELETE   | `/api/admin/vehicles/{id}`       | Soft-delete (set INACTIVE)     |
| GET      | `/api/admin/routes`              | List all routes                |
| POST     | `/api/admin/routes`              | Create route                   |
| PUT      | `/api/admin/routes/{id}`         | Update route pricing           |
| DELETE   | `/api/admin/routes/{id}`         | Soft-delete route              |
| GET      | `/api/admin/enquiries`           | List enquiries (filterable)    |
| PUT      | `/api/admin/enquiries/{id}/status` | Update enquiry status        |

## Testing with cURL

### Admin Login

```bash
TOKEN=$(curl -s -X POST http://localhost:8080/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | jq -r '.data.token')

echo $TOKEN
```

### Get All Vehicles (admin, includes inactive)

```bash
curl -s http://localhost:8080/api/admin/vehicles \
  -H "Authorization: Bearer $TOKEN" | jq
```

### Update Vehicle Price (critical: price change)

```bash
# Get vehicle ID first
VEHICLE_ID=$(curl -s http://localhost:8080/api/admin/vehicles \
  -H "Authorization: Bearer $TOKEN" | jq '.data[0].id')

# Update the price
curl -s -X PUT "http://localhost:8080/api/admin/vehicles/$VEHICLE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sedan",
    "slug": "sedan",
    "seatingCapacity": 5,
    "price": 3499,
    "description": "Updated sedan price",
    "imageUrl": "/images/sedan.jpg"
  }' | jq

# Verify the price change on public API
curl -s http://localhost:8080/api/vehicles/sedan | jq '.data.price'
```

### Submit Enquiry

```bash
curl -s -X POST http://localhost:8080/api/enquiries \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "phone": "+919876543210",
    "email": "test@example.com",
    "pickupLocation": "Pune Station",
    "dropLocation": "Mumbai Airport",
    "travelDate": "2026-09-15",
    "travelTime": "06:00",
    "tripType": "ONE_WAY",
    "vehicleId": 1,
    "passengers": 3,
    "message": "Need an early morning pickup"
  }' | jq
```

### Update Enquiry Status

```bash
curl -s -X PUT http://localhost:8080/api/admin/enquiries/1/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"CONTACTED"}' | jq
```

### Get FAQs for a Specific Route

```bash
curl -s "http://localhost:8080/api/faqs?routeSlug=pune-to-mumbai-cab" | jq
```

## Security Notes

- All passwords are BCrypt hashed — never stored or returned in plain text
- JWT tokens expire after 24 hours (configurable via `JWT_EXPIRATION_MS`)
- CORS is restricted to the frontend origin only (`http://localhost:5173`)
- SQL injection prevented via JPA parameterized queries
- Input validation on all DTOs via `@Valid` + Bean Validation
- Stack traces are logged server-side; clients receive generic error messages
- Enquiry endpoint has a simple in-memory rate limiter (30s cooldown per IP)
- Vehicles and routes use soft-delete (status=INACTIVE), never hard-deleted

## Environment Variables Reference

| Variable         | Required | Default                          | Description                |
|------------------|----------|----------------------------------|----------------------------|
| `SERVER_PORT`    | No       | `8080`                           | Server port                |
| `DB_URL`         | Yes      | `jdbc:mysql://localhost:3306/...`| MySQL JDBC URL             |
| `DB_USERNAME`    | Yes      | `root`                           | MySQL username             |
| `DB_PASSWORD`    | Yes      | (empty)                          | MySQL password             |
| `JWT_SECRET`     | Yes      | `change-me...`                   | Secret key for JWT signing |
| `JWT_EXPIRATION_MS` | No   | `86400000` (24h)                | Token lifetime in ms       |
| `CORS_ORIGIN`    | No       | `http://localhost:5173`          | Allowed frontend origin    |

## Troubleshooting

**"Access denied" on MySQL:**
Ensure your MySQL user has access and the password is correct.

**Port already in use:**
Change `SERVER_PORT` or kill the existing process on 8080.

**CORS errors from React:**
Ensure `CORS_ORIGIN` matches exactly (including protocol and port).

**Tables not created:**
Hibernate `ddl-auto=update` auto-creates tables on startup. If not, run `schema.sql` manually.

## License

Internal project — not for redistribution.

# Gym Management System TODO - Detailed Steps

## Backend Setup
- [x] Create backend/ directory
- [x] Create pom.xml with Spring Boot dependencies (Web, Security, Data JPA, MySQL, JWT)
- [x] Create src/main/java/com/gymmanagement/ directory structure
- [x] Create GymManagementApplication.java main class
- [x] Create application.properties for MySQL and JWT config
- [x] Create entity classes: Member.java, Booking.java, Payment.java, ClassEntity.java, Trainer.java
- [x] Create repository interfaces: MemberRepository.java, BookingRepository.java, PaymentRepository.java, ClassRepository.java, TrainerRepository.java
- [x] Create service classes: CustomUserDetailsService.java (JwtService and UserService can be added if needed)
- [x] Create REST controllers: AuthController.java, MemberController.java, TrainerController.java, ClassController.java, PaymentController.java, ReportController.java, AdminController.java
- [x] Implement JWT authentication filter and config
- [x] Add role-based access control (ADMIN, MEMBER)
- [ ] Create DataSeeder.java for sample data (optional)

## Database
- [ ] Create sql/ directory
- [ ] Write schema.sql with CREATE TABLE statements for users, members, trainers, classes

## Frontend Setup
- [ ] Create frontend/ subdirectories: css/, js/, pages/
- [ ] Create index.html (Home page with hero section)
- [ ] Create about.html
- [ ] Create membership.html
- [ ] Create trainers.html
- [ ] Create schedule.html
- [ ] Create contact.html
- [ ] Create login.html
- [ ] Create register.html
- [ ] Create member-dashboard.html
- [ ] Create admin-dashboard.html
- [ ] Create main.css with Bootstrap 5, Tailwind, responsive design, dark/light mode, animations
- [ ] Create auth.js for login/register logic and JWT handling
- [ ] Create api.js for API calls
- [ ] Create dashboard.js for member/admin dashboards
- [ ] Integrate hero background and logo from assets/images/
- [ ] Ensure accessibility, modern UI, animations

## Integration and Testing
- [ ] Test API endpoints with Postman (authentication, CRUD operations)
- [ ] Test frontend-backend integration (login, dashboards, CRUD)
- [ ] Verify responsiveness on phone/tablet/laptop
- [ ] Test dark/light mode toggle

## Documentation
- [ ] Create README.md with project overview
- [ ] Add setup instructions (Java, Maven, MySQL installation)
- [ ] Add API documentation
- [ ] Add instructions to run frontend (open in browser) and backend (mvn spring-boot:run)
- [ ] Add instructions to replace/copy images into /assets/images/

## Final Delivery
- [ ] Zip the project (frontend/, backend/, sql/, README.md, assets/)
- [ ] Verify all requirements met

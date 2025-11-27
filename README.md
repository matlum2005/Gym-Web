# Gym Web

A responsive and professional Gym Management Website built with HTML, CSS, JavaScript, Bootstrap, and Tailwind CSS.

## 📋 Description

Vector Gym is an elite fitness studio that combines cutting-edge technology with personalized training programs. Our platform offers a comprehensive gym management system with both frontend and backend components, featuring user authentication, member management, class booking, and payment processing.

## ✨ Features

- **Responsive Design**: Fully responsive website that works on all devices
- **User Authentication**: Secure login and registration system
- **Member Dashboard**: Personalized dashboard for members to manage their profiles
- **Class Booking**: Easy booking system for gym classes and sessions
- **Trainer Management**: Comprehensive trainer profiles and scheduling
- **Payment Integration**: Secure payment processing for memberships
- **AI-Powered Tools**: BMI calculator, workout recommendations, and fitness chatbot
- **Admin Panel**: Complete administrative control over gym operations
- **Modern UI/UX**: Beautiful design with glassmorphism effects and animations

## 🛠 Tech Stack

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)

## 🚀 Live Demo

[View Live Website](https://matlum2005.github.io/Gym-Web/)

## 📸 Screenshots

### Homepage
![Homepage](frontend/assets/screenshot-homepage.png)

### Dashboard
![Dashboard](frontend/assets/screenshot-dashboard.png)

### Admin Panel
![Admin Panel](frontend/assets/screenshot-admin.png)

## 🏗 Installation & Setup

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+
- Node.js (for frontend development)

### Backend Setup
1. Clone the repository:
```bash
git clone https://github.com/matlum2005/Gym-Web.git
cd Gym-Web
```

2. Navigate to backend directory:
```bash
cd backend
```

3. Configure database in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/gym_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

4. Run the application:
```bash
mvn spring-boot:run
```

### Frontend Setup
1. Open `index.html` in your browser or serve it with a local server
2. For development, you can use Live Server extension in VS Code

## 📁 Project Structure

```
Gym-Web/
├── index.html                 # Main landing page
├── frontend/                  # Frontend assets
│   ├── css/
│   │   └── styles.css        # Custom styles
│   ├── js/
│   │   ├── main.js          # Main JavaScript
│   │   ├── auth.js          # Authentication scripts
│   │   └── dashboard.js     # Dashboard functionality
│   ├── auth/                 # Authentication pages
│   │   ├── login.html
│   │   └── register.html
│   └── assets/               # Images and media
├── backend/                   # Spring Boot backend
│   ├── src/main/java/com/gymmanagement/
│   │   ├── controller/       # REST controllers
│   │   ├── entity/          # JPA entities
│   │   ├── repository/      # Data repositories
│   │   ├── service/         # Business logic
│   │   ├── security/        # Security configuration
│   │   └── config/          # Application configuration
│   ├── src/main/resources/
│   │   ├── static/          # Static web assets
│   │   └── application.properties
│   └── pom.xml
├── sql/                      # Database scripts
│   ├── schema.sql           # Database schema
│   └── data.sql             # Sample data
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Members
- `GET /api/members` - Get all members
- `POST /api/members` - Create new member
- `PUT /api/members/{id}` - Update member
- `DELETE /api/members/{id}` - Delete member

### Classes
- `GET /api/classes` - Get all classes
- `POST /api/classes` - Create new class
- `PUT /api/classes/{id}` - Update class

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create booking

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Matlum** - *Initial work* - [matlum2005](https://github.com/matlum2005)

## 🙏 Acknowledgments

- Icons by [Bootstrap Icons](https://icons.getbootstrap.com/)
- Fonts by [Google Fonts](https://fonts.google.com/)
- Images from [Unsplash](https://unsplash.com/)
- UI inspiration from modern web design trends

---

⭐ Star this repo if you found it helpful!

# Student Management System

A modern full stack Student Management System built using React, Spring Boot, and MySQL.

This application allows users to manage student records through a professional dashboard interface with authentication, analytics, export features, dark mode, and responsive UI.

---

# Features

## Authentication

* User Registration
* User Login
* Protected Dashboard Routes
* Persistent Login State

## Student Management

* Add Student
* Update Student
* Delete Student
* Search Students
* Responsive Student Table

## Dashboard Features

* Statistics Cards
* Course Analytics Chart
* Dark Mode
* Toast Notifications
* Responsive UI
* Framer Motion Animations

## Export Features

* Export Excel
* Export PDF

---

# Tech Stack

## Frontend

* React
* React Router DOM
* Tailwind CSS
* Axios
* React Hot Toast
* Recharts
* Framer Motion
* Lucide React

## Backend

* Spring Boot
* Spring Data JPA
* Spring Security
* Hibernate
* Maven

## Database

* MySQL

---

# Folder Structure

```bash
student-management/
│
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env
│
└── README.md
```

---

# Screenshots

## Login Page

Modern login interface with responsive design.

## Dashboard

Includes:

* Student statistics
* Course analytics
* CRUD operations
* Export features
* Dark mode support

---

# Installation Guide

## Clone Repository

```bash
git clone https://github.com/Vinay-Budde/student-management.git
```

---

# Backend Setup

## Open Backend Folder

```bash
cd backend
```

---

## Configure Database

Create MySQL database:

```sql
CREATE DATABASE studentmanagement;
```

---

## Configure application.properties

```properties
spring.application.name=studentmanagement

spring.datasource.url=jdbc:mysql://localhost:3306/studentmanagement
spring.datasource.username=root
spring.datasource.password=yourpassword

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
```

---

## Run Backend

```bash
mvn spring-boot:run
```

Backend runs on:

```bash
http://localhost:8080
```

---

# Frontend Setup

## Open Frontend Folder

```bash
cd frontend
```

---

## Install Dependencies

```bash
npm install
```

---

## Configure Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:8080
```

---

## Run Frontend

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# API Endpoints

## Authentication APIs

| Method | Endpoint       | Description   |
| ------ | -------------- | ------------- |
| POST   | /auth/register | Register User |
| POST   | /auth/login    | Login User    |

---

## Student APIs

| Method | Endpoint       | Description      |
| ------ | -------------- | ---------------- |
| GET    | /students      | Get All Students |
| POST   | /students      | Add Student      |
| PUT    | /students/{id} | Update Student   |
| DELETE | /students/{id} | Delete Student   |

---

# Export Features

## Export Excel

Downloads student data as `.xlsx` file.

## Export PDF

Downloads student report as PDF.

---

# Future Improvements

* JWT Authentication
* Role Based Authorization
* Pagination
* Docker Compose
* Cloud Deployment
* Backend Search APIs
* Real-time Notifications

---

# Deployment

## Recommended Platforms

### Frontend

* Vercel

### Backend

* Render

### Database

* Aiven / Railway / PlanetScale

---

# Author

Developed by Vinay

To run the Online Recipe Sharing Platform, follow these steps:

Prerequisites
Java 17 or higher
Node.js and npm
PostgreSQL database
Running the Backend (Spring Boot)
Navigate to the backend directory:


    cd backend
Ensure PostgreSQL is running and the database 'recipe_platform' exists.

Run the Spring Boot application:


    mvn spring-boot:run
The backend will start on http://localhost:8080

Running the Frontend (React)
Open a new terminal and navigate to the frontend directory:


    cd frontend/recipe-platform-frontend
Install dependencies (if not already done):


    npm install
Start the React development server:


    npm start
The frontend will start on http://localhost:3000

Accessing the Application
Frontend: Open http://localhost:3000 in your browser
Backend API: Available at http://localhost:8080/api
Database Setup
Make sure PostgreSQL is running with a database named 'recipe_platform'. The application will automatically create the necessary tables on startup.

Testing the Application
Register a new user account
Login with your credentials
Create a new recipe
Browse and view recipes
Rate and comment on recipes
The full-stack application is now running and ready for use!

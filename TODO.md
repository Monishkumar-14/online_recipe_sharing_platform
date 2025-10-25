# TODO List for Online Recipe Sharing Platform

## Project Setup
- [x] Create project directories (backend, frontend)
- [x] Initialize Spring Boot backend with Maven
- [x] Configure application.properties for PostgreSQL and other settings
- [ ] Set up basic project structure (entities, controllers, services, repositories)

## Backend Development
- [x] Create User entity with roles (User, Cook, Admin)
- [x] Create Recipe entity with categories (vegetarian, vegan, non-vegetarian)
- [x] Create Rating and Comment entities
- [x] Implement UserRepository, RecipeRepository, etc.
- [x] Create UserService, RecipeService for business logic
- [x] Implement controllers for user registration, login, recipe CRUD, search, ratings, comments
- [x] Configure Spring Security for authentication and authorization
- [ ] Add file upload for recipe images/videos
- [ ] Implement push notifications (email for now)
- [ ] Add search functionality

## Frontend Development
- [x] Initialize React.js app
- [x] Create components for login, register, recipe list, recipe detail, upload form
- [x] Implement API calls with Axios
- [x] Add UI for search, ratings, comments
- [x] Integrate video display and scrollable tabs

## Database
- [ ] Set up PostgreSQL database
- [ ] Run migrations or use JPA for schema creation

## Testing and Deployment
- [ ] Test backend APIs
- [ ] Test frontend integration
- [ ] Deploy locally or to cloud

## Additional Features
- [ ] Implement roles-based access
- [ ] Add short videos support
- [ ] Enhance UI/UX

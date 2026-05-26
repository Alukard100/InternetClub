# InternetClub

InternetClub is a completed Human-Computer Interaction (HCI) university project for managing an internet club environment. The application supports receptionist/admin workflows, gamer/user workflows, article publishing, time purchases, transaction tracking, and PayPal Sandbox payments.

The project focuses on usability, accessibility, role-based interaction, and practical application of user-centered design principles.

---

## Features

- Role-based authentication and authorization with JWT
- Admin/receptionist dashboard with statistics and charts
- User management with online/offline status tracking
- Time balance management for gamer accounts
- Transaction history and payment method tracking
- PayPal Sandbox payment flow for online purchases
- Article management with create, edit, publish, delete, and public view pages
- Rich text article editor built with TipTap
- Custom image upload inside the editor
- Custom image resizing, alignment, and cropping mechanism
- Article content stored as TipTap JSON from frontend to backend
- Article rendering from saved JSON into public article pages
- Local image storage through the backend API
- Pagination and filtering for table-based admin views

---

## Technologies

### Frontend

- Angular 21
- TypeScript
- Angular Material
- RxJS
- TipTap editor
- DOMPurify
- Chart.js / ng2-charts
- ngx-image-cropper

### Backend

- .NET 9
- C#
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server LocalDB
- JWT Bearer authentication
- Swagger / OpenAPI
- PayPal Sandbox API

---

## Architecture and Design Patterns

The project uses a layered backend structure inspired by Clean Architecture:

- `InternetClub.Domain` - domain entities, enums, and core business state
- `InternetClub.Application` - services, DTOs, interfaces, and application logic
- `InternetClub.Infrastructure` - Entity Framework persistence, repositories, image storage, and PayPal integration
- `InternetClub` - Web API controllers, authentication, CORS, Swagger, and application startup

Design patterns and architectural patterns used:

- Clean Architecture / layered architecture
- Repository pattern for data access abstraction
- Service layer pattern for business use cases
- Dependency Injection for loose coupling between controllers, services, repositories, and external integrations
- DTO pattern for request and response models
- Interface segregation through service and repository contracts
- External service wrapper/adapter pattern for PayPal integration
- Guard pattern on the Angular frontend for role-protected routes
- HTTP interceptor pattern for authenticated frontend requests
- Component-based UI architecture in Angular
- Custom TipTap extension pattern for editor image behavior

---

## Main User Roles

### Gamer/User

- Register and log in
- View public articles
- Purchase internet club time through PayPal Sandbox
- Use purchased time balance

### Receptionist/Admin

- Manage users
- Add time manually
- View dashboard statistics
- Review transactions
- Create, edit, publish, and delete articles
- Upload and crop article images through the custom editor workflow

---

## Rich Text Editor and Article Flow

The article editor is one of the main custom parts of the project.

- TipTap is used as the editor foundation.
- The editor stores article content as JSON instead of plain HTML.
- Custom image upload sends image files from the frontend to the backend.
- The backend stores images locally and returns public image URLs.
- A custom TipTap image extension stores image size, alignment, and crop values.
- Saved article JSON is later loaded into a temporary TipTap editor and rendered as sanitized HTML for public article pages.
- DOMPurify is used to sanitize rendered content before displaying it.

---

## PayPal Sandbox Integration

The application includes a PayPal Sandbox payment flow:

- The frontend creates a purchase request.
- The backend creates a PayPal order through the sandbox API.
- The payment is captured after approval.
- A transaction receipt is created after successful capture.
- User time balance and spending totals are updated through backend services.

---

## Running the Project

### Backend

```bash
cd backend
dotnet restore
dotnet ef database update --project InternetClub.Infrastructure --startup-project InternetClub
dotnet run --project InternetClub
```

The backend runs with Swagger enabled in development.

> Note: During development, migrations can also be applied through Visual Studio/Package Manager Console using `Update-Database`.
```

### Frontend

```bash
cd frontend
npm install
npm start
```

The Angular app runs at:

```text
http://localhost:4200
```

The frontend proxy is configured to call the backend at:

```text
https://localhost:7061
```

---

## Academic Context

This project was developed as part of a university course on Human-Computer Interaction (HCI). The implementation applies HCI principles through role-based workflows, clear navigation, form-based administration, feedback-driven interactions, and a custom article editing experience.

---

## Project Status

Completed for university project submission.

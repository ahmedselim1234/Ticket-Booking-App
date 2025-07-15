TICKET BOOKING API
===================

A modular and secure backend API built with Node.js, Express, and MongoDB.
This system manages event ticket bookings and supports two user roles: Admin and Client.

------------------------
FEATURES
------------------------

- JWT-based authentication using cookies.
- Role-based access control (Admin / Client).
- Admin can create, update, and delete events.
- Client can book and cancel tickets.
- Custom middleware for authentication and authorization.
- Clean, scalable project structure.
- Environment configuration via .env.
- Optional unit testing for components and endpoints.

------------------------
PROJECT STRUCTURE
------------------------
ذذذ
```
ذذذ
project-root/
├── controllers/             # Business logic
│   ├── admin.js
│   ├── client.js
│   └── auth.js
│
├── routes/                  # API route definitions
│   ├── admin.js
│   ├── client.js
│   └── authRoutes.js
│
├── middleware/              # Custom middleware (auth, roles, errors)
│   ├── isAuth.js
│   ├── role.js
│   └── errorHandler.js
│
├── models/                  # Mongoose models (event, ticket, user)
│
├── config/                  # DB and CORS config
│   ├── dbnonnect.js
│   └── corsOptions.js
│
├── util/                    # Utility functions (e.g., sendEmail.js)
│
├── .env                     # Environment variables
├── server.js                # Application entry point
├── package.json             # Project metadata and scripts
└── README.md                # Documentation
```
------------------------
API ENDPOINTS OVERVIEW
------------------------

AUTH ROUTES
-----------
POST    /auth/signup                →  Register new user  
POST    /auth/login                 →  Login and receive JWT  
POST    /auth/logout                →  Logout user  
GET     /auth/refresh               →  Refresh JWT token  
POST    /auth/forgetpassword        →  Request password reset  
POST    /auth/verifyResetCode       →  Verify password reset code  
PUT     /auth/addnewpassword        →  Set new password  


ADMIN ROUTES
------------
GET     /admin/gettickets           →  Get all tickets  
GET     /admin/getevents            →  Get all events  
GET     /admin/getticket/:id        →  Get specific ticket  
GET     /admin/getevent/:id         →  Get specific event  
GET     /admin/getclients/:id       →  Get tickets by client  
PUT     /admin/updateEvent/:id      →  Update event details  
DELETE  /admin/deleteevent/:id      →  Delete event  
POST    /admin/addevent             →  Create new event  


CLIENT ROUTES
-------------
GET     /                          →  Get all available events  
POST    /bookticket                →  Book a ticket  
DELETE  /deletebook/:id            →  Cancel a booking  
GET     /getclientTickets/:id      →  Get tickets for a client  


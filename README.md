# Library Management System

Web-based library system enabling book browsing and reservation.

## Data Models and Entities

The system manages two primary entities:

1. **Books**
   - Basic book information (title, author, category)
   - Reservation status
   - Loan information

2. **Reservations**
   - Reservation details
   - User information
   - Duration

## Database Schema

The application uses MongoDB with two collections:

### Books Collection
```
{
  _id: ObjectId,
  title: String,          // book title
  author: String,         // author
  category: String,       // category
  loanedUntil: Date,      // loan end date
  reservedBy: String      // reserver's name
}
```

### Reservations Collection
```
{
  _id: ObjectId,
  bookId: String,         // book identifier
  reservedBy: String,     // reserver's name
  reservedUntil: Date,    // reservation end date
  createdAt: Date,        // creation timestamp
  updatedAt: Date         // modification timestamp
}
```

### Relationships
- One-to-many relationship between Books and Reservations
- A book can have multiple historical reservations, but only one active
- Each reservation belongs to exactly one book

## Technologies Used

### Frontend
- Angular 15+
- TypeScript
- Bootstrap for UI
- Font Awesome icons

### Backend
- Node.js
- Express.js
- MongoDB database
- Mongoose ODM

### Development Tools
- npm package manager
- Git version control
- Cors for cross-origin resource sharing

## Business Logic

The application implements several business rules:

1. **Reservation System**
   - Only one active reservation per book
   - Reservations can only be made for future dates
   - Prevents double reservations
   - Automatic date validation

2. **Data Consistency**
   - Uses MongoDB transactions to ensure consistency between Books and Reservations
   - Preserves reservation history
   - Automatically updates book status during reservation

3. **Validation Rules**
   - Minimum name length for reservations
   - Date validation for reservations
   - Mandatory field checks for books and reservations

## API Endpoints

### Books
- `GET /api/books` - Retrieve all books
- `GET /api/books/:id` - Retrieve a single book
- `POST /api/books` - Create a new book
- `PATCH /api/books/:id` - Modify a book
- `DELETE /api/books/:id` - Delete a book

### Reservations
- `GET /api/books/:bookId/reservation` - Retrieve all reservations for a book
- `POST /api/books/:bookId/reservation` - Create a new reservation
- `GET /api/books/:bookId/reservation/:id` - Retrieve a single reservation
- `PATCH /api/books/:bookId/reservation/:id` - Modify a reservation
- `DELETE /api/books/:bookId/reservation/:id` - Delete a reservation

## Installation and Setup

1. Clone the project
2. Install dependencies:
   ```bash
   cd frontend
   npm install
   cd ../backend
   npm install
   ```
3. Set up MongoDB database
4. Start backend server:
   ```bash
   npm start
   ```
5. Launch Angular frontend:
   ```bash
   ng serve
   ```
6. Access the application at: `http://localhost:4200`

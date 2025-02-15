# E-commerce Admin Dashboard

An admin dashboard application for managing an E-commerce platform, providing tools for product management, order tracking, and user administration.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)


## Features

- **Product Management**: Add, update, and delete products.
- **Order Tracking**: Monitor and manage customer orders.
- **Store-front configurations**: Manage features of a store front from the admin site.
- **Analytics Dashboard**: View sales statistics and performance metrics.

## Technologies Used

- **Frontend**: [Next.js](https://nextjs.org/) (React framework)
- **Backend**: [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- **Database**: [Prisma](https://www.prisma.io/) ORM with your choice of database
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

## Getting Started

### Prerequisites

- **Node.js**: Ensure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).
- **Package Manager**: npm, yarn, or pnpm installed.
- **Database**: PostgreSQL, MySQL, or SQLite.

### Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/tommywa-a/ecommerce-admin.git
   cd ecommerce-admin
   ```

2. **Install Dependencies**:

   Depending on your package manager:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set Up Environment Variables**:

   Create a `.env` file in the root directory and add your environment variables as required by your application.

4. **Run Database Migrations** (if applicable):

   ```bash
   npx prisma migrate dev
   ```

### Running the Application

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Environment Variables

Create a `.env` file in the root directory and add the following:

```env
DATABASE_URL=your_database_connection_string
NEXTAUTH_SECRET=your_auth_secret
NEXTAUTH_URL=http://localhost:3000
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes with clear messages.
4. Submit a pull request.

## License

This project is licensed under the **MIT License**.

## Contact

For any inquiries, reach out via email: **[tomiwa.aderibigbe1@gmail.com](mailto:tomiwa.aderibigbe1@gmail.com)**

---

Happy Coding! 🚀

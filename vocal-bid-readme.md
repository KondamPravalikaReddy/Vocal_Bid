# 🎤 Vocal Bid - Voice-Enabled Auction Platform

A modern, real-time auction platform that integrates voice recognition technology to enable hands-free bidding. Built with TypeScript, React, Node.js, and PostgreSQL, Vocal Bid revolutionizes the online auction experience by allowing users to place bids using voice commands.

## 🌟 Features

### Core Auction Features
- **Real-Time Bidding**: Live bid updates using WebSocket technology for instant synchronization across all connected users
- **Voice-Enabled Bidding**: Place bids hands-free using voice commands via Web Speech API integration
- **Auction Management**: Create, manage, and monitor auctions with detailed product listings
- **Bid History Tracking**: Complete audit trail of all bids placed on each auction item
- **User Authentication**: Secure JWT-based authentication system with role-based access control
- **Countdown Timer**: Dynamic countdown for each auction with automatic extensions on last-minute bids

### Voice Recognition Features
- **Voice Commands**: Execute auction actions through natural language voice commands
- **Multi-Language Support**: Voice recognition compatible with multiple languages and accents
- **Voice Navigation**: Navigate through the platform using voice-activated controls
- **Speech Feedback**: Audio confirmations for successful bid placements

### User Features
- **User Profiles**: Personalized dashboards for buyers and sellers
- **Bid Notifications**: Real-time notifications for bid updates and auction status changes
- **Search & Filter**: Advanced search capabilities to find specific auctions or products
- **Responsive Design**: Fully responsive interface optimized for desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React.js**: Component-based UI library for building interactive user interfaces
- **TypeScript**: Type-safe development with enhanced code quality
- **Web Speech API**: Voice recognition and speech synthesis capabilities
- **Socket.io Client**: Real-time bidirectional event-based communication
- **React Router**: Client-side routing for seamless navigation
- **CSS3**: Modern styling with responsive design principles

### Backend
- **Node.js**: JavaScript runtime for server-side development
- **Express.js**: Fast, unopinionated web framework for Node.js
- **TypeScript**: Type-safe backend development
- **Socket.io**: Real-time WebSocket implementation for live updates
- **JWT**: JSON Web Tokens for secure authentication

### Database
- **PostgreSQL**: Robust relational database management system
- **PLpgSQL**: Procedural language for advanced database operations
- **Database Triggers**: Automated bid validation and auction state management

### Additional Tools
- **Git**: Version control system
- **npm**: Package manager for dependency management
- **ESLint**: Code linting for maintaining code quality

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16.0.0 or higher)
- **npm** (v8.0.0 or higher)
- **PostgreSQL** (v13.0 or higher)
- **Git** (for cloning the repository)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/KondamPravalikaReddy/Vocal_Bid.git
cd Vocal_Bid
```

### 2. Install Backend Dependencies
```bash
# Navigate to the backend directory
cd server
npm install
```

### 3. Install Frontend Dependencies
```bash
# Navigate to the frontend directory
cd client
npm install
```

### 4. Database Setup

#### Create PostgreSQL Database
```sql
CREATE DATABASE vocal_bid;
```

#### Configure Database Connection
Create a `.env` file in the server directory:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vocal_bid
DB_USER=your_username
DB_PASSWORD=your_password

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Session Configuration
SESSION_SECRET=your_session_secret

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password
```

#### Run Database Migrations
```bash
cd server
npm run migrate
```

### 5. Configure Frontend Environment
Create a `.env` file in the client directory:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 🎮 Running the Application

### Development Mode

#### Start Backend Server
```bash
cd server
npm run dev
```
The server will start on `http://localhost:5000`

#### Start Frontend Application
```bash
cd client
npm start
```
The application will open on `http://localhost:3000`

### Production Mode

#### Build Frontend
```bash
cd client
npm run build
```

#### Start Production Server
```bash
cd server
npm run start
```

## 📱 Usage Guide

### For Buyers

1. **Register/Login**: Create an account or login to access the platform
2. **Browse Auctions**: Navigate through available auctions using search or categories
3. **Enable Voice**: Allow microphone access to use voice bidding features
4. **Place Bids**: 
   - **Manual**: Click "Place Bid" button and enter amount
   - **Voice**: Say "Bid [amount]" to place a bid using voice commands
5. **Track Bids**: Monitor your active bids in your dashboard
6. **Win Auctions**: Receive notifications when you win an auction

### Voice Commands

- **"Bid [amount]"**: Place a bid with specified amount (e.g., "Bid 500 dollars")
- **"Show my bids"**: Navigate to your bid history
- **"Next auction"**: Move to the next auction item
- **"Previous auction"**: Go back to previous auction
- **"Search [product name]"**: Search for specific auction items

### For Sellers

1. **Create Auction**: 
   - Navigate to "Create Auction" page
   - Upload product images
   - Set starting price and auction duration
   - Define bid increment amount
2. **Manage Auctions**: View and manage your active auctions
3. **Monitor Bids**: Track real-time bids on your auction items
4. **Close Auctions**: Auctions close automatically at end time

## 🗂️ Project Structure

```
Vocal_Bid/
├── client/                 # Frontend React application
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service functions
│   │   ├── utils/         # Utility functions
│   │   ├── hooks/         # Custom React hooks
│   │   ├── contexts/      # React context providers
│   │   └── App.tsx        # Main App component
│   └── package.json
│
├── server/                # Backend Node.js application
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   ├── utils/         # Helper functions
│   │   ├── socket/        # Socket.io handlers
│   │   └── server.ts      # Server entry point
│   ├── migrations/        # Database migrations
│   └── package.json
│
└── README.md
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt encryption for user passwords
- **CORS Protection**: Cross-Origin Resource Sharing configuration
- **SQL Injection Prevention**: Parameterized queries and prepared statements
- **XSS Protection**: Input sanitization and validation
- **Rate Limiting**: API request throttling to prevent abuse
- **Secure Headers**: HTTP security headers using Helmet.js

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Auctions
- `GET /api/auctions` - Get all auctions
- `GET /api/auctions/:id` - Get auction by ID
- `POST /api/auctions` - Create new auction (authenticated)
- `PUT /api/auctions/:id` - Update auction (authenticated, owner only)
- `DELETE /api/auctions/:id` - Delete auction (authenticated, owner only)

### Bids
- `GET /api/bids/auction/:auctionId` - Get bids for specific auction
- `POST /api/bids` - Place new bid (authenticated)
- `GET /api/bids/user/:userId` - Get user's bid history

### WebSocket Events
- `connection` - Client connected
- `disconnect` - Client disconnected
- `newBid` - New bid placed
- `bidUpdate` - Bid updated
- `auctionEnd` - Auction ended

## 🧪 Testing

### Run Backend Tests
```bash
cd server
npm test
```

### Run Frontend Tests
```bash
cd client
npm test
```

### Run E2E Tests
```bash
npm run test:e2e
```

## 📈 Future Enhancements

- [ ] Mobile application (React Native)
- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Advanced voice commands and NLP integration
- [ ] Live video streaming for auctions
- [ ] Multi-currency support
- [ ] Automated bidding (proxy bidding)
- [ ] Social media integration
- [ ] Email notifications for bid updates
- [ ] Advanced analytics dashboard
- [ ] Multi-language interface support

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards
- Follow TypeScript best practices
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation as needed
- Write unit tests for new features


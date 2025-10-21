# MediNest - AI-Powered Health Insurance Advisor

**Team Code Commanders** | ENIGMA 4.0 | SIES Graduate School of Technology

## 🎯 Project Overview

MediNest is a Fintech + HealthTech AI platform that acts as an intelligent insurance advisor for Indian families. It helps users find the most suitable health insurance plans by analyzing personal health profiles, family medical history, location, and preferred hospitals — saving money while improving coverage clarity.

## 🚀 Features

### Frontend (Client-side)
- Modern, responsive UI with glassmorphism design
- Interactive animations and transitions
- User authentication (Login/Signup)
- Insurance recommendation dashboard
- Family profile management
- Real-time recommendation display

### Backend (Server-side)
- RESTful API built with Node.js and Express
- MongoDB database integration with Mongoose
- User authentication with JWT tokens
- Insurance plan management
- AI-powered recommendation engine

### AI Features
- Family health profile analysis
- Location-based hospital mapping
- Coverage gap detection
- Policy simplification
- Cost optimization algorithms

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3 (with animations and responsive design)
- Vanilla JavaScript (ES6+)

### Backend
- Node.js
- Express.js
- MongoDB (with Mongoose ODM)
- JSON Web Tokens (JWT) for authentication

### Tools & Libraries
- Nodemon (development)
- Bcrypt.js (password hashing)
- Cors (Cross-Origin Resource Sharing)
- Dotenv (environment variables)

## 📁 Project Structure

```
medinest/
├── config/
│   └── db.js              # Database configuration
├── models/
│   ├── User.js            # User schema and model
│   ├── InsurancePlan.js   # Insurance plan schema and model
│   └── Recommendation.js  # Recommendation schema and model
├── public/
│   ├── index.html         # Main HTML file
│   ├── styles.css         # Styling
│   └── script.js          # Client-side JavaScript
├── routes/
│   ├── users.js           # User authentication routes
│   ├── insurance.js       # Insurance plan routes
│   └── recommendations.js # Recommendation generation routes
├── .env.example           # Environment variables template
├── package.json           # Project dependencies and scripts
├── server.js              # Main server file
└── README.md              # Project documentation
```

## ▶️ Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd medinest
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Then edit the `.env` file with your configuration:
- MongoDB connection string
- JWT secret
- Port number

4. Start the development server:
```bash
npm run dev
```

5. For production:
```bash
npm start
```

### Database Setup

1. Install MongoDB locally or use a cloud service like MongoDB Atlas
2. Update the `MONGODB_URI` in your `.env` file
3. The application will automatically create the necessary collections

## 🌐 API Endpoints

### User Management
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Insurance Plans
- `GET /api/insurance` - Get all insurance plans
- `GET /api/insurance/:id` - Get specific insurance plan
- `GET /api/insurance/search?query=` - Search insurance plans
- `POST /api/insurance` - Add new insurance plan (admin)

### Recommendations
- `POST /api/recommendations/generate` - Generate insurance recommendations
- `GET /api/recommendations/history` - Get recommendation history
- `GET /api/recommendations/:id` - Get specific recommendation

## 🤖 AI Algorithm

The recommendation engine uses a weighted scoring system based on:

1. **Coverage Score (70% weight)**
   - Hospitalization coverage amount
   - Network hospitals in user's location
   - Pre-existing condition coverage
   - Maternity coverage

2. **Cost Score (30% weight)**
   - Annual premium relative to coverage
   - Family size adjustment
   - Age-based risk factors

The algorithm also calculates potential savings compared to average market plans.

## 👥 Team Code Commanders

- **Pritesh Mahajan** - Lead Developer
- **Jalmesh Mhatre** - AI Specialist
- **Siddhesh Murkute** - UI/UX Designer

## 🏆 Hackathon Submission

This project was developed for **MumbaiHacks**.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

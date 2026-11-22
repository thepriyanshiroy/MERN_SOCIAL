# 🚀 MERN Social

A full-stack, server-side rendered (SSR) social media web application built with the **MERN** stack (MongoDB, Express, React, Node.js) and Material-UI. 

It provides an interactive platform for users to connect, share posts with photos, engage through likes and comments, manage social connections with follower/following controls, customize their profiles, and discover new people.

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE.md)
[![Node.js Version](https://img.shields.io/badge/Node.js-16%2B%20%7C%2018%20%7C%2020%20%7C%2022%20%7C%2024-5e35b1.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-16.13.1-blue.svg)](https://reactjs.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-v4-0081CB.svg)](https://v4.mui.com/)

---

## 🌟 Key Features

### 👤 Profile & Authentication
* **Secure Authentication**: Sign up and sign in using JSON Web Tokens (JWT) and encrypted passwords (HMAC-SHA1 with salt).
* **Duplicate Email Prevention**: Instant alert and rejection on attempted duplicate email registrations (case-insensitive).
* **Dynamic Avatars**: Defaults to a colored avatar displaying the user's initial letter; automatically switches to the uploaded profile photo upon upload with instant preview.
* **Profile Customization**: Update bio, name, email, and upload/update profile picture.
* **Change Password**: Dedicated password update section with show/hide password visibility toggle (`Visibility` / `VisibilityOff`).
* **Slide-out Drawer Navigation**: Intuitive profile navigation drawer with a bottom-pinned "Delete Account" button.

### 👥 Social Network & Connections
* **Following & Followers Tab**: Tabbed profile interface showing real-time counts directly in the header (`posts X    following Y    followers Z`).
* **Connection Management**:
  * **Following tab**: Easily "View Profile" or "Unfollow" users.
  * **Followers tab**: "View Profile" or "Remove Follower" from your own follower list.
* **Smart User Suggestions (Find People)**: Displays recommended users to follow, filtering out yourself, your already followed users, and duplicate accounts. Displays clean profile names without exposing email addresses.

### 📰 Posts & Engagement
* **Rich Feed**: Share thoughts and upload image attachments to posts.
* **Likes**: Real-time post liking and unliking with live count updates.
* **Comments**: Comment on posts with user avatars and timestamping. Users can delete their own comments.
* **Delete Posts**: Post authors have full control to delete their own posts.

### ⚡ Architecture & Performance
* **Zero-Config Database**: Automatic fallback to an embedded MongoDB Memory Server with **persistent WiredTiger disk storage** (`./data/db`). You do not need to install MongoDB locally to get started!
* **Server-Side Rendering (SSR)**: Initial markup is rendered on the server for fast first-paint times and improved SEO.
* **Deep Purple / Violet Theme**: Cohesive design using Material-UI theme palette (`#5e35b1` primary, `#ba68c8` secondary).

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | React 16.13, React Router v5 | Component-based UI and client routing |
| **Styling** | Material-UI v4 (`@material-ui/core`, `@material-ui/icons`) | Custom responsive theme with purple styling |
| **Backend** | Node.js, Express 4.17 | REST API and Server-Side Rendering (SSR) |
| **Database** | MongoDB & Mongoose 5.9 | Embedded persistent WiredTiger or external MongoDB |
| **Auth** | JWT (`jsonwebtoken`), `express-jwt` | Stateless authentication and route protection |
| **File Uploads** | Formidable 1.2 | Multipart/form-data image handling |
| **Bundling** | Webpack 4, Babel 7, Nodemon | Asset bundling, hot reload, and transpilation |

---

## 📋 Prerequisites

Before running the application, ensure you have:
* **Node.js**: Recommended Node.js 16, 18, 20, 22, or 24.
* **npm** (comes with Node) or **Yarn**.
* *(Optional)* **MongoDB**: If you already have a MongoDB instance running on port `27017`, the app will automatically connect to it. Otherwise, the app **automatically launches an embedded MongoDB server with persistent storage**.

> [!NOTE]
> All build and start scripts in `package.json` already include `--openssl-legacy-provider` for seamless compatibility with Node.js 17+ and modern OpenSSL versions.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/thepriyanshiroy/MERN_SOCIAL.git
cd MERN_SOCIAL
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run in Development Mode

To start the server with development hot-reloading (Webpack dev middleware & Nodemon):

```bash
npm run development
```

### 4. Open in Browser

Once the terminal outputs:
```
Connected to embedded MongoDB with persistent disk storage in ./data/db
Listening on port 3000...
```
Open your browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 📦 Production Build & Run

To create an optimized production bundle and run the production server:

```bash
# 1. Build client and server bundles
npm run build

# 2. Start the production server
npm start
```

---

## ⚙️ Configuration & Environment Variables

You can optionally configure environment variables via command line or `.env` file:

| Variable | Default Value | Description |
|---|---|---|
| `PORT` | `3000` | Port on which the Express server listens |
| `NODE_ENV` | `development` | Running environment (`development` or `production`) |
| `JWT_SECRET` | `YOUR_secret_key` | Secret key used for signing JWT tokens |
| `MONGODB_URI` | `mongodb://localhost:27017/mernproject` | MongoDB connection URI (falls back to embedded if unavailable) |

---

## 📂 Project Structure

```
mern-social/
├── client/                     # Frontend React source code
│   ├── assets/                 # Static images and icons
│   ├── auth/                   # Auth helpers, Signin, PrivateRoute
│   ├── core/                   # Home, Navigation Menu & Drawer
│   ├── post/                   # Newsfeed, Posts, Likes, Comments
│   ├── user/                   # Profile, EditProfile, Signup, FindPeople, FollowGrid
│   ├── App.js                  # Main React App component & theme provider
│   ├── main.js                 # Client-side React hydration entry
│   └── theme.js                # Material-UI theme definition
├── config/
│   └── config.js               # Application configuration and environment defaults
├── data/
│   └── db/                     # Persistent disk storage for embedded MongoDB (git-ignored)
├── server/                     # Backend Express server source code
│   ├── controllers/            # Auth, User, and Post route controllers
│   ├── helpers/                # Error handling utilities
│   ├── models/                 # Mongoose schemas (User, Post)
│   ├── routes/                 # Express API routes
│   ├── devBundle.js            # Webpack hot-reloading setup for development
│   ├── express.js              # Express app setup, middleware, and SSR template
│   └── server.js               # Entry point, MongoDB connection & HTTP listener
├── template.js                 # HTML shell for Server-Side Rendering
├── nodemon.json                # Nodemon watcher configuration
├── webpack.config.client.js    # Webpack configuration for client development
├── webpack.config.server.js    # Webpack configuration for server compilation
├── context.md                  # Detailed architectural context document
└── package.json                # Project dependencies and npm scripts
```

---

## 🧪 Testing Account Credentials

For quick local testing, you can register a new account or use pre-configured test users:

| Email | Password | Role |
|---|---|---|
| `thepriyanshiroy@gmail.com` | `123456` | Verified User |
| `heyypriyanshi@gmail.com` | `123456` | Verified User |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE.md).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/thepriyanshiroy/MERN_SOCIAL/issues).

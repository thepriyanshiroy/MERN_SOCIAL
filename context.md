# MERN Social (Second Edition) - Project Context & Technical Reference

This document serves as the comprehensive architectural guide, technical reference, and context cheat-sheet for the **MERN Social** web application. It is designed to provide both developers and AI assistants with complete clarity on the project's tech stack, data flows, components, styling, and design decisions without needing to re-scan the entire codebase.

---

## 1. Project Overview

**MERN Social** is a full-stack, server-side rendered (SSR) social media web application built with the MERN stack (MongoDB, Express, React, Node.js) and Material-UI. It supports user authentication, profile management, avatar uploads, post publishing with image attachments, liking, commenting, follow/unfollow relationships, and dynamic user suggestions.

* **Target URL**: `http://localhost:3000`
* **Default Port**: `3000`
* **Primary Color Theme**: `#5e35b1` (Deep Purple)
* **Secondary Color Theme**: `#ba68c8` (Soft Violet)

---

## 2. Technology Stack

### Backend
* **Runtime**: Node.js (tested and adapted for Node 24 with `--openssl-legacy-provider`).
* **Web Framework**: Express 4.17.1.
* **Database & ODM**:
  * **Mongoose 5.9.7**: Schema design, model validation, and query operations.
  * **MongoDB Memory Server (v11.4.0)**: Embedded MongoDB server configured with **persistent WiredTiger disk storage** (`./data/db`). Data survives across server restarts.
* **Authentication & Authorization**:
  * **JSON Web Tokens (`jsonwebtoken` v8.5.1)**: Stateless authentication via JWT bearer tokens.
  * **`express-jwt` (v5.3.1)**: Middleware to protect sensitive API endpoints.
  * **Crypto (Node.js built-in)**: SHA-1 HMAC password encryption with salt.
* **File Uploads**: Formidable (v1.2.2) for processing multipart/form-data images.
* **Security & Performance**: Helmet 3.22.0, Compression 1.7.4, CORS 2.8.5, Cookie-Parser 1.4.5.

### Frontend
* **UI Library**: React 16.13.1 (with Hooks: `useState`, `useEffect`).
* **Routing**: React Router DOM v5.1.2 (`BrowserRouter`, `Route`, `Switch`, `Redirect`, `Link`, `withRouter`).
* **Component Framework**: Material-UI v4 (`@material-ui/core` v4.9.8, `@material-ui/icons` v4.9.1).
* **Theming**: Custom Material-UI theme (`client/theme.js`) with primary `#5e35b1` and secondary `#ba68c8`.
* **State Management**: React state hooks (`useState`) combined with `sessionStorage` and custom window event listeners (`authChange`) for cross-component reactive updates.

### Build & Bundling
* **Webpack 4.42.1 & Webpack CLI 3.3.11**:
  * `webpack.config.server.js`: Compiles the server bundle to `dist/server.generated.js`.
  * `webpack.config.client.production.js`: Production client build.
  * `webpack-dev-middleware` & `webpack-hot-middleware`: In-memory live hot reloading for development.
* **Babel 7.9.0**: Transpilation for modern JavaScript, JSX, and ES6+ modules.
* **Node 24 Compatibility**: Requires `--openssl-legacy-provider` flag to allow Webpack 4 legacy crypto algorithms to run on OpenSSL 3.0+ / Node 17+.

---

## 3. Directory Structure

```
mern-social-second-edition/
├── client/                              # Frontend React application
│   ├── assets/                          # Images and visual assets
│   │   └── images/
│   │       ├── landing-page.jpg         # Hero banner image for Home page
│   │       └── profile-pic.png          # Default avatar fallback
│   ├── auth/                            # Authentication module
│   │   ├── api-auth.js                  # Client auth API (signin, signout)
│   │   ├── auth-helper.js               # JWT management & user session storage
│   │   ├── PrivateRoute.js              # Route guard for authenticated views
│   │   └── Signin.js                    # Sign In page with back button
│   ├── core/                            # Core structural components
│   │   ├── Home.js                      # Landing page / authenticated feed layout
│   │   └── Menu.js                      # Top Navbar & right-side slide-out Drawer
│   ├── post/                            # Posts & Feed module
│   │   ├── api-post.js                  # Post API calls (feed, create, like, comment)
│   │   ├── Comments.js                  # Comments list and comment input
│   │   ├── NewPost.js                   # Post creation card with photo upload
│   │   ├── Newsfeed.js                  # "Share your thoughts !" container
│   │   ├── Post.js                      # Single Post card (likes, comments, delete)
│   │   └── PostList.js                  # List of posts
│   ├── user/                            # User profiles & social actions
│   │   ├── api-user.js                  # User API calls (read, update, follow, unfollow, removeFollower)
│   │   ├── DeleteUser.js                # Delete user modal dialog
│   │   ├── EditProfile.js               # Edit Profile (photo preview, change password)
│   │   ├── FindPeople.js                # Suggestions & Following boxes with search/filter
│   │   ├── FollowGrid.js                # Following & Followers lists with View, Unfollow, Remove
│   │   ├── FollowProfileButton.js       # Follow/Unfollow toggle button
│   │   ├── Profile.js                   # User profile view with back button & tabs
│   │   ├── ProfileTabs.js               # Switcher for posts X, following Y, followers Z
│   │   ├── Signup.js                    # Sign Up card with duplicate email alert
│   │   └── Users.js                     # All Users list with back button & avatar
│   ├── App.js                           # Root React component with ThemeProvider
│   ├── main.js                          # Client-side React hydration entry
│   ├── MainRouter.js                    # Route definitions
│   └── theme.js                         # Material-UI custom palette definition
├── config/
│   └── config.js                        # Environment settings (port, secret, mongoUri)
├── data/
│   └── db/                              # Persistent WiredTiger MongoDB database files
├── dist/                                # Compiled webpack output (server.generated.js)
├── server/                              # Backend Express application
│   ├── controllers/
│   │   ├── auth.controller.js           # Signin, signout, requireSignin, authorization
│   │   ├── post.controller.js           # Post CRUD, likes, comments, photo delivery
│   │   └── user.controller.js           # User CRUD, photo upload, follow/unfollow, suggestions
│   ├── helpers/
│   │   └── dbErrorHandler.js            # MongoDB / Mongoose error message parser
│   ├── models/
│   │   ├── post.model.js                # Post Mongoose schema (text, photo, likes, comments)
│   │   └── user.model.js                # User Mongoose schema (name, email, password, followers)
│   ├── routes/
│   │   ├── auth.routes.js               # /auth routes
│   │   ├── post.routes.js               # /api/posts routes
│   │   └── user.routes.js               # /api/users routes
│   ├── devBundle.js                     # Webpack dev/hot middleware setup
│   ├── express.js                       # Express app configuration & SSR HTML rendering
│   └── server.js                        # Server entry point & embedded MongoDB manager
├── context.md                           # This technical context reference
├── package.json                         # Dependencies & scripts
└── nodemon.json                         # Development nodemon config
```

---

## 4. Database Architecture & Storage

### Embedded Persistent Storage
Instead of requiring a standalone local MongoDB instance or external Atlas cluster, the application runs an embedded MongoDB binary via `mongodb-memory-server`:
* **Storage Engine**: `wiredTiger`
* **Data Directory**: `./data/db` (persisted on disk).
* **Behavior**: On server startup (`server/server.js`), the application checks for an existing MongoDB daemon. If none is found, it automatically starts an embedded MongoDB server configured with `dbPath: './data/db'`. All user accounts, posts, comments, and relationships persist across server reboots.

### User Schema (`server/models/user.model.js`)
* `name`: String, trimmed, required.
* `email`: String, trimmed, lowercased, unique, required.
* `hashed_password`: String (encrypted using SHA-1 HMAC with user salt).
* `salt`: String.
* `about`: String (optional bio).
* `photo`: `{ data: Buffer, contentType: String }` (stored directly in MongoDB).
* `following`: Array of `ObjectId` references to `User`.
* `followers`: Array of `ObjectId` references to `User`.
* `created`: Date (default: `Date.now`).
* `updated`: Date.

### Post Schema (`server/models/post.model.js`)
* `text`: String, required.
* `photo`: `{ data: Buffer, contentType: String }` (optional image upload).
* `likes`: Array of `ObjectId` references to `User`.
* `comments`: Array of subdocuments:
  * `text`: String.
  * `created`: Date.
  * `postedBy`: `ObjectId` reference to `User`.
* `postedBy`: `ObjectId` reference to `User`, required.
* `created`: Date (default: `Date.now`).

---

## 5. API Reference

### Authentication Routes (`/auth`)
| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/signin` | Sign in with email and password. Returns JWT token and user info. | No |
| `GET` | `/auth/signout` | Clears authentication cookie. | No |

### User Routes (`/api/users`)
| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users` | List all users (name, email, created, updated). | No |
| `POST` | `/api/users` | Register a new user account. Rejects duplicate emails with 400. | No |
| `GET` | `/api/users/:userId` | Read a user profile (excludes password, salt, and raw photo buffer). | Yes |
| `PUT` | `/api/users/:userId` | Update profile (name, email, password, about, photo). | Yes (Owner) |
| `DELETE`| `/api/users/:userId` | Permanently delete user account and profile photo. | Yes (Owner) |
| `GET` | `/api/users/photo/:userId` | Returns binary photo data. Returns 404 if no custom photo exists. | No |
| `PUT` | `/api/users/follow` | Current user follows target user (`userId`, `followId`). Uses `$addToSet`. | Yes |
| `PUT` | `/api/users/unfollow` | Current user unfollows target user (`userId`, `unfollowId`). Uses `$pull`. | Yes |
| `PUT` | `/api/users/removefollower`| Remove user from your followers (`userId`, `followerId`). | Yes |
| `GET` | `/api/users/findpeople/:userId`| Get suggested profiles to follow (excludes self, own name, own email, and existing following). | Yes |

### Post Routes (`/api/posts`)
| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/posts/new/:userId` | Create a new post (text, optional photo). | Yes |
| `GET` | `/api/posts/feed/:userId`| Retrieve personalized newsfeed (own posts + posts by followed users). | Yes |
| `GET` | `/api/posts/by/:userId` | Retrieve posts authored by a specific user. | Yes |
| `GET` | `/api/posts/photo/:postId`| Returns post image binary data. | No |
| `PUT` | `/api/posts/like` | Like a post (`userId`, `postId`). Uses `$addToSet`. | Yes |
| `PUT` | `/api/posts/unlike` | Unlike a post (`userId`, `postId`). Uses `$pull`. | Yes |
| `PUT` | `/api/posts/comment` | Add a comment (`userId`, `postId`, `comment: { text }`). | Yes |
| `PUT` | `/api/posts/uncomment` | Delete a comment (`userId`, `postId`, `comment: { _id }`). | Yes |
| `DELETE`| `/api/posts/:postId` | Delete a post. | Yes (Owner) |

---

## 6. Key Features & Implementation Details

### 1. Dynamic User Avatar Logic
* **Default State**: If a user has not uploaded a photo, all avatars across the application (Navbar, Profile Drawer, Profile Page, Edit Profile, Suggestions, Following, and Posts) display the initial letter of the user's name (e.g. `A` for Annanya) centered on the `#5e35b1` purple background.
* **Uploaded Photo State**: When a user uploads a photo, `/api/users/photo/:userId` delivers the image with HTTP 200. The `<Avatar>` component automatically renders the image and conceals the letter initial.
* **Instant Preview in Edit Profile**: When a user selects a file via the "Upload" button in [client/user/EditProfile.js](file:///C:/Users/thera/OneDrive/Documents/project/mern-social-second-edition/client/user/EditProfile.js), `URL.createObjectURL(file)` displays an immediate preview in the avatar before submission.
* **Session Sync (`authChange` Event)**: Updating user profile triggers `auth.updateUser` in [client/auth/auth-helper.js](file:///C:/Users/thera/OneDrive/Documents/project/mern-social-second-edition/client/auth/auth-helper.js), dispatching a window `authChange` event that instantly updates the avatar in the navbar and sidebar without page reloads.

### 2. Password Management in Profile Edit
* Located in [client/user/EditProfile.js](file:///C:/Users/thera/OneDrive/Documents/project/mern-social-second-edition/client/user/EditProfile.js).
* Features a dedicated **Change Password** header accompanied by a key icon (`VpnKeyIcon`).
* The password field is equipped with:
  * A leading key icon (`VpnKeyIcon`) in secondary violet `#ba68c8`.
  * An interactive **show/hide password toggle** button (`Visibility` / `VisibilityOff`) allowing users to inspect their input.
  * Form validation requiring at least 6 characters if a password is supplied, or leaving it blank to retain the current password.

### 3. Top Navbar & Profile Drawer
* Located in [client/core/Menu.js](file:///C:/Users/thera/OneDrive/Documents/project/mern-social-second-edition/client/core/Menu.js).
* Displays a circular initial/photo avatar button in the top right.
* Clicking the avatar opens a sleek right-side slide-out drawer containing:
  * Top: Close button, large user avatar, name, and email.
  * Center: **Profile** and **Sign Out** navigation list items.
  * Bottom: A separating divider and a red-accented **Delete Account** button (pinned to the bottom of the drawer using flexbox `justifyContent: space-between`). Clicking triggers a confirmation dialog.

### 4. Self-Follow & Suggestion Filtering
* **Suggestions (`FindPeople.js`)**:
  * Users can **never** see their own profile or duplicate accounts with matching names/emails in Suggestions.
  * Filtered both in backend `findPeople` (`User.find({ _id: { $nin: following } })` + name/email exclusion) and frontend `isSameOrOwnUser`.
  * Shows up to 5 profiles initially with a "Show All" toggle, search filter, and sorting options (All, A-Z, Z-A, Newest).
  * Displays only the profile name (no email).
* **Following Box**:
  * Located immediately below Suggestions with matching layout and search filter.
* **Profile View (`Profile.js`)**:
  * On a user's own profile, the "Follow" button is permanently hidden, even during the initial page loading state.
  * The backend (`addFollowing`) strictly forbids self-following (`userId === followId`), returning HTTP 400.

### 5. Profile Tab Counts & Actions
* Located in [client/user/ProfileTabs.js](file:///C:/Users/thera/OneDrive/Documents/project/mern-social-second-edition/client/user/ProfileTabs.js) and [client/user/FollowGrid.js](file:///C:/Users/thera/OneDrive/Documents/project/mern-social-second-edition/client/user/FollowGrid.js).
* **Tab Labels**:
  * `posts {count}`
  * `following {count}`
  * `followers {count}`
* **Actions on Own Profile**:
  * Under **Following**: Each entry displays a **View** icon button (`PersonIcon` in `#ba68c8`) linking to their profile, and an **Unfollow** button.
  * Under **Followers**: Each entry displays a **View** icon button and a **Remove** button (red border) to drop that person from your followers.

### 6. Universal Back Navigation
* Added small back buttons (`ArrowBackIcon`) in theme purple `#5e35b1` across all secondary views:
  * Profile page (`client/user/Profile.js`)
  * Edit Profile page (`client/user/EditProfile.js`)
  * All Users page (`client/user/Users.js`)
  * Sign In page (`client/auth/Signin.js`)
  * Sign Up page (`client/user/Signup.js`)

### 7. Duplicate Email Prevention
* **Backend**: Case-insensitive lookup (`User.findOne({ email })`) in `create` before user save. If taken, returns HTTP 400 with `{ error: "Email already exists" }`.
* **Frontend**: When an email is taken, triggers both a browser `alert("Email already exists")` and displays a red error banner on the card.

---

## 7. Developer & Operations Guide

### Starting the Application
```bash
# Production start (using compiled server bundle)
node --openssl-legacy-provider ./dist/server.generated.js

# Development with nodemon (auto-reloads on file changes)
npm run development
```

### Rebuilding Webpack Bundles
Because this project utilizes Webpack 4 on Node 24, all Webpack invocations **must** include `--openssl-legacy-provider`:
```bash
# Rebuild the server bundle
node --openssl-legacy-provider ./node_modules/webpack/bin/webpack.js --mode=development --config webpack.config.server.js

# Full production build (client + server)
npm run build
```

### Resetting or Backing Up Database Data
* The database files are stored in `./data/db`.
* To completely wipe the database, stop the server and remove `./data/db`. A fresh database will initialize automatically on the next startup.

---

## 8. Summary of Active Credentials & Test Accounts
* Active User Account: **Annanya** (`heyypriyanshi@gmail.com`)
* Active User Account: **Priyanshi** (`thepriyanshiroy@gmail.com`)

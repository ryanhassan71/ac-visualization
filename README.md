# Project Name: React Notification and Header Component

This project is a React-based implementation of a dynamic notification system and a header component. The header includes functionalities like notification bell navigation, full-screen toggle, and user profile management. Notifications are fetched dynamically and displayed in a responsive dropdown.

![Project Image](/project-image.png)

## Login

The project includes a login system that allows users to authenticate before accessing notifications and other protected features.

- The login page code is located in `src/auth/login.jsx`, with `auth.jsx` serving as the layout component.
- The login function is implemented in `acApi.js`.
- Upon successful login, the login data is stored in a dictionary called `appAuthData` in `localStorage`. It contains the authentication token and the user's name.
- In the `App` component, if `appAuthData` is detected in `localStorage`, the user remains on the app page; otherwise, they are redirected to the login page. Additionally, a `useEffect` with an empty dependency array checks for the presence of `appAuthData` in `localStorage`. If it is not found, the user is redirected to the login page.
- There is a logout button in `Header.jsx`. It redirects to the login page and clears `localStorage`, ensuring that the user cannot access the website again without logging in.
- In `acApi.js`, there is an interceptor that monitors responses. If a response has a status of `401`, `localStorage` is cleared, and the window is refreshed, causing the `App` component to reload. Additionally, a `useEffect` with an empty dependency array checks for the presence of `appAuthData` in `localStorage`. If it is not found, the user is redirected to the login page.

### Features

- **User Authentication:**
  - Users need to log in to access the dashboard.
  - Authentication is handled via JWT (JSON Web Token).
  - Login credentials are verified using the backend API.
- **Login Component:**
  - Located in `components/auth/Login.jsx`.
  - Uses a form to collect user email and password.
  - Stores the authentication token in `localStorage` upon successful login.
- **API Endpoint:**
  - The login request is sent to `/api/auth/login`.
- **Example Implementation:**

```javascript
const handleLogin = async (event) => {
  event.preventDefault();
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } else {
      setError(data.message);
    }
  } catch (error) {
    console.error("Login failed", error);
  }
};
```

- **Session Handling:**
  - Token is stored in `localStorage` and used for authentication in subsequent requests.
  - Users are redirected to the login page if the token is missing or expired.
- **Logout:**
  - Users can log out by clearing the stored token and redirecting to the login page.
  - Example logout function:

```javascript
const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/login");
};
```

---

## Features

### Notifications

- Displays notifications for the particular user token.
- The route for the notifications is defined in `main.jsx` under the layout of `App.jsx`:

```jsx
<Route path={`${import.meta.env.BASE_URL}`} element={<App />}>
  <Route path="notifications" element={<Notifications />} />
</Route>
```

- Redirects to a notifications page when the bell icon is clicked.
- In `Header.jsx` located in `components/common`, the function responsible for this redirection is:

```javascript
const handleNotificationsClick = () => {
  navigate("/notifications");
};
```

- This function is triggered when you click the notification bell button, and it is the only way to navigate to the notifications page.
- Dynamically fetches recent notifications using the `fetchRecentAcAlerts` function defined in `acApi.js`.
  - This function calls the endpoint `/temperature/alerts/recent/ac/` to retrieve the latest notifications.
  - The frequency of fetching is controlled by the `AC_NOTIF_INTERVAL` variable.

### Header

- Includes a navigation bar with a notification bell, profile dropdown, and application shortcuts.
- Full-screen toggle functionality.
- Dark/light mode toggle.
- Cart management functionality with dynamic item updates.

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd project-directory
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

## Running the Application

1. Start the development server:

   ```bash
   npm start
   ```

2. Open the application in your browser:

   ```
   http://localhost:5173
   ```

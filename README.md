# Project Name: React Notification and Header Component

This project is a React-based implementation of a dynamic notification system and a header component. The header includes functionalities like notification bell navigation, full-screen toggle, and user profile management. Notifications are fetched dynamically and displayed in a responsive dropdown.

## Features

### Notifications
- Dynamically fetches recent notifications.
- Displays unread notifications count.
- Redirects to a notifications page when the bell icon is clicked.
- Handles empty notifications gracefully.

### Header
- Includes a navigation bar with a notification bell, profile dropdown, and application shortcuts.
- Full-screen toggle functionality.
- Dark/light mode toggle.
- Cart management functionality with dynamic item updates.

## Project Structure

```
src/
|-- assets/             # Contains images and other static assets
|-- components/
|   |-- common/
|   |   |-- pageheader/ # Shared Page Header Component
|-- modalsearch/        # Search Modal Component
|-- redux/              # Redux store and actions
|-- acApi.js            # API for fetching recent notifications
|-- App.js              # Main application entry point
|-- index.js            # React application entry point
```

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
   http://localhost:3000
   ```

## Components

### Header
- The `Header` component includes:
  - A notification bell that navigates to the notifications page.
  - A profile section with dropdown options.
  - Cart management for displaying and removing items dynamically.
  - App shortcuts for quick navigation.

### Notifications Page
- The `Notifications` component dynamically fetches and displays notifications with:
  - Timestamp formatting.
  - Notification message styling based on status (e.g., red for alerts, green for success).

## API Integration

The application fetches notifications dynamically using the `fetchRecentAcAlerts` function from `acApi.js`.

### Environment Variables
- Ensure that the API base URL and other configuration variables are set in your environment file.

## Key Dependencies

- **React**: Frontend library for building user interfaces.
- **Redux**: State management for handling global state.
- **SimpleBar**: For smooth scrolling in notification lists.
- **Tailwind CSS**: For styling components.

## Customization

### Styling
- The project uses Tailwind CSS for styling. Modify styles in `src/styles` as needed.

### API Configuration
- Update the API URL and endpoints in `acApi.js` to match your backend.

## Contributing

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Create a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

## Contact

For any questions or support, please reach out to [your email/contact information].



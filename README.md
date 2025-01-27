# Project Name: React Notification and Header Component

This project is a React-based implementation of a dynamic notification system and a header component. The header includes functionalities like notification bell navigation, full-screen toggle, and user profile management. Notifications are fetched dynamically and displayed in a responsive dropdown.

## Login

The project includes a login system that allows users to authenticate before accessing notifications and other protected features.

## Features

### Notifications

- Displays  notifications for the particular user token. 

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
      navigate("/notifications"); // Pass notifications2
    };
    ```
  - This function is triggered when you click the notification bell button, and it is the only way to navigate to the notifications page.
- Dynamically fetches recent notifications using the `fetchRecentAcAlerts` function defined in `acApi.js`.
  - This function calls the endpoint `/temperature/alerts/recent/ac/` to retrieve the latest notifications.
  - The frequency of fetching is controlled by the `AC_NOTIF_INTERVAL` variable.

* Notifications are fetched dynamically using the `fetchRecentAcAlerts` function, with the fetching frequency determined by the `AC_NOTIF_INTERVAL` variable.
* In `Notifications.jsx`, the `notifications` state variable stores an array of notifications, each represented as a structured dictionary. 







### Header

- Includes a navigation bar with a notification bell, profile dropdown, and application shortcuts.
- Full-screen toggle functionality.
- Dark/light mode toggle.
- Cart management functionality with dynamic item updates.

## Main Section

### Carbon Emissions Integration

The `Crm` component calculates carbon emissions based on electricity consumption using the formula:

**Carbon Emissions (kg CO2) = Electricity Consumption (kWh) × Emission Factor (kg CO2/kWh)**

- The `Emission Factor` is set as `0.56719` kg CO2/kWh and is stored in `config.js`
- This calculation is displayed in the Power Consumption Summary section of the CRM dashboard.
- Implementation:

```javascript
<div className="flex items-center mb-[0.8rem]">
  <h4 className="font-bold mb-0 text-[1.5rem] p-2">
    {totalPowerConsumption
      ? (
          totalPowerConsumption * CARBON_EMISSION_CONSTANT
        ).toFixed(0)
      : 0} {" "}
  </h4>
  <div className="">
    <span className="py-[0.18rem]  rounded-sm text-success !font-medium !text-[0.8rem] bg-success/10">
      <i className="ri-cloud-line align-middle "></i> kg
      CO<sub>2</sub>
    </span>

    <span className="text-[#8c9097] dark:text-white/50 text-[0.6rem] ms-1">
      Carbon Emission last 7 days
    </span>
  </div>
</div>
```

- The calculated value is dynamically rendered in the CRM component to provide users with insights into their environmental impact.

### Icon Display Logic

The `Crm` component dynamically updates the AC status icons based on their state:

1. **Offline ACs**:
   - Icon: A Wi-Fi signal with a line across it.
   - Background: Red.

2. **Online and Off ACs**:
   - Icon: An AC icon.
   - Background: Grey.

3. **Online and Running ACs**:
   - Icon: An AC icon.
   - Background: Green.

- Implementation Example:

```javascript
<span
  className={`!text-[0.8rem] !w-[2.5rem] !h-[2.5rem] !leading-[2.5rem] !rounded-full inline-flex items-center justify-center ${
    sensor.sensors[0].status
      ? sensor.sensors[0].ac_state.toLowerCase().includes("off")
        ? "bg-gray-500"
        : "bg-success"
      : "bg-danger"
  }`}
>
  {sensor.sensors[0].status ? <AcIcon /> : <i className="ti ti-wifi-off"></i>}
</span>
```

- The logic ensures that users can quickly identify the status of each AC device through intuitive icons and background colors.

--

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

# Project Name: React Notification and Header Component

This project is a React-based implementation of a dynamic notification system and a header component. The header includes functionalities like notification bell navigation, full-screen toggle, and user profile management. Notifications are fetched dynamically and displayed in a responsive dropdown.

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
      navigate("/notifications"); // Pass notifications2
    };
    ```
  - This function is triggered when you click the notification bell button, and it is the only way to navigate to the notifications page.
- Dynamically fetches recent notifications using the `fetchRecentAcAlerts` function defined in `acApi.js`.
  - This function calls the endpoint `/temperature/alerts/recent/ac/` to retrieve the latest notifications.
  - The frequency of fetching is controlled by the `AC_NOTIF_INTERVAL` variable.

* Notifications are fetched dynamically using the `fetchRecentAcAlerts` function, with the fetching frequency determined by the `AC_NOTIF_INTERVAL` variable.
* In `Notifications.jsx`, the `notifications` state variable stores an array of notifications, each represented as a structured dictionary.

### Header

- Includes a navigation bar with a notification bell, profile dropdown, and application shortcuts.
- Full-screen toggle functionality.
- Dark/light mode toggle.
- Cart management functionality with dynamic item updates.

## Components

### Crm

The `Crm` component serves as the main dashboard for managing and monitoring air conditioning (AC) systems and power consumption data. It includes dynamic data fetching, visualization, and responsive behavior tailored to both desktop and mobile devices.

#### Weather

- The `Crm` component integrates a weather card that displays:
  - Current weather conditions, including temperature, humidity, and weather description.
  - A dynamic icon that corresponds to the weather condition.
  
- **Mobile Width Configuration**:
  - The mobile width threshold for determining mobile view behavior is stored as a constant in the `config.js` file.
  - Example usage:
    ```javascript
    const MOBILE_WIDTH = 768; // Defined in config.js
    const isMobile = window.innerWidth <= MOBILE_WIDTH;
    ```
  
- The weather card adapts its layout based on the screen size:
  - Fixed position and smaller layout for mobile devices.
  - Sticky and wider layout for desktop devices.

### Header

- The `Header` component includes:
  - A notification bell that navigates to the notifications page.
  - A profile section with dropdown options.
  - Cart management for displaying and removing items dynamically.
  - App shortcuts for quick navigation.



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








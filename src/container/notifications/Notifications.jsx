import  { Fragment, useEffect, useState } from 'react';
import Pageheader from "../../components/common/pageheader/pageheader.jsx"
import { AC_NOTIF_INTERVAL, fetchRecentAcAlerts } from '../../acApi.js';


const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
    useEffect(() => {
      const fetchNotifications = async () => {
        try {
          
          const data = await fetchRecentAcAlerts(); // Fetch recent notifications
          setNotifications(data); // Update notifications state
        } catch (error) {
          console.error("Failed to fetch notifications:", error);
        }
      };
  
      // Fetch immediately on mount
      fetchNotifications();
  
      // Set up an interval for periodic fetching
      const interval = setInterval(() => {
        fetchNotifications();
      }, AC_NOTIF_INTERVAL ); // Default to 30 seconds if AC_NOTIF_INTERVAL not provided
  
      // Clear interval on unmount
      return () => clearInterval(interval);
    }, []);


  const formatCreatedAt = (createdAt) => {
    if (!createdAt) return ""; // Handle empty case
  
    const [datePart, timePart, meridian] = createdAt.split(" "); // Split the date and time components
    const [day, month, year] = datePart.split("-"); // Extract day, month, year
  
    // Convert numeric month to short month name
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedMonth = monthNames[parseInt(month, 10) - 1];
  
    // Reconstruct formatted date
    return `${day} ${formattedMonth} ${year}, ${timePart} ${meridian}`;
  };
  
  // Function to determine the class based on notification color
  const getNotificationClass = (color) => {
    if (color === "green") return "badge bg-success/10 text-success font-semibold ";
    if (color === "red") return "badge bg-danger/10 text-danger font-semibold ";
    return ""; // Default class if no color matches
  };

  return(
    <Fragment>
      <Pageheader currentpage="Notifications" activepage="Pages" mainpage="Notifications" />
      <div className="container">
  <div className="grid grid-cols-12 !mx-auto">
    <div className="xxl:col-span-2 col-span-12"></div>
    <div className="xxl:col-span-8 xl:col-span-12 lg:col-span-12 md:col-span-12 sm:col-span-12 col-span-12">
      {notifications.length === 0 ? (
        // Show loading when notifications are empty
        <div className="!text-center mb-4">
          <button type="button" className="ti-btn ti-btn-info ti-btn-loader">
            Loading
            <span className="ti-spinner !h-4 !w-4" role="status"></span>
          </button>
        </div>
      ) : (
        // Show notifications when data exists
        <ul className="list-none mb-0 notification-container">
          {notifications.map((notif, index) => (
            <li key={index}>
              <div className="box un-read">
                <div className="box-body !p-4">
                  <div className="flex items-start mt-0 flex-wrap">
                    <div
                      className={`avatar avatar-md ${
                        notif.notification_color === "green" ? "online" : "offline"
                      } me-4 avatar-rounded bg-primary !text-white`}
                    >
                      {notif.sensor}
                    </div>
                    <div className="flex-grow">
                      <div className="sm:flex items-center">
                        <div className="sm:mt-0 mt-2">
                          <p className="mb-0 md:text-[.875rem] text-[.5rem] font-semibold">
                            {notif.branch_address}
                          </p>
                          <p className="mt-2 text-[#8c9097] dark:text-white/50 text-[1rem]">
                            <span className={getNotificationClass(notif.notification_color)}>
                              {notif.message}
                            </span>
                            <span className={getNotificationClass(notif.notification_color)}>
                              {notif.temperature_value} °C
                            </span>
                          </p>
                        </div>
                        <div className="ms-auto">
  <span className="ltr:float-right rtl:float-left badge bg-light text-[#8c9097] dark:text-white/50 whitespace-nowrap !text-xl">
    {formatCreatedAt(notif.created_at)}
  </span>
</div>



                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
    <div className="xxl:col-span-2 col-span-12"></div>
  </div>
</div>

    </Fragment>
);}

export default Notifications;

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App.jsx";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Crm from "./container/dashboards/crm/crm.jsx";
import "./index.scss";
import ScrollToTop from "./components/ui/scrolltotop.jsx";
import AcChart from "./container/ac-chart/AcChart.jsx";
import Power from "./container/dashboards/power/Power.jsx";
import Notifications from "./container/notifications/Notifications.jsx";
import { CrmProvider } from "./container/dashboards/crm/CrmContext"; // Import CrmProvider
import ReactModal from "react-modal";
import Auth from "./auth/auth.jsx";
import Login from "./auth/login.jsx";

ReactModal.setAppElement("#root");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.Fragment>
    <BrowserRouter>
      <React.Suspense>
        <ScrollToTop />
        <CrmProvider>
          {" "}
          {/* Wrap the entire app in CrmProvider */}
          <Routes>
            {/* Redirect base URL to dashboards main */}
            <Route
              path={`${import.meta.env.BASE_URL}`}
              element={
                <Navigate to={`${import.meta.env.BASE_URL}10/2/main`} replace />
              }
            />

            <Route path={`${import.meta.env.BASE_URL}`} element={<Auth />}>
              <Route
                path={`${import.meta.env.BASE_URL}auth/login`}
                element={<Login />}
              />
            </Route>

            {/* App layout as parent */}
            <Route
              path={`${import.meta.env.BASE_URL}/:storeId/:powerId`}
              element={<App />}
            >
              <Route path="main" element={<Crm />} />
              <Route path="power" element={<Power />} />
              <Route path="ac/temp-graph/:acId" element={<AcChart />} />
            </Route>

            <Route path={`${import.meta.env.BASE_URL}`} element={<App />}>
              <Route path="notifications" element={<Notifications />} />
            </Route>
          </Routes>
        </CrmProvider>
      </React.Suspense>
    </BrowserRouter>
  </React.Fragment>
);

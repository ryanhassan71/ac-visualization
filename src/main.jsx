import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './pages/App.jsx'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Crm from './container/dashboards/crm/crm.jsx'
import './index.scss'
import ScrollToTop from './components/ui/scrolltotop.jsx'
import AcChart from './container/ac-chart/AcChart.jsx'
import AcControl from './container/ac-controls/AcControl.jsx'
import Power from './container/dashboards/crm/Power.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.Fragment>
    <BrowserRouter>
      <React.Suspense>
        <ScrollToTop />
        <Routes>
          {/* Redirect base URL to dashboards main */}
          <Route path={`${import.meta.env.BASE_URL}`} element={<Navigate to={`${import.meta.env.BASE_URL}dashboards/main`} replace />} />
          
          {/* App layout as parent */}
          <Route path={`${import.meta.env.BASE_URL}dashboards/main`} element={<App />}>
            <Route index element={<Crm />} />
            <Route path="ac/:acId" element={<AcChart />} />
          </Route>

          <Route path={`${import.meta.env.BASE_URL}dashboards/main`} >
            <Route path="ac-control/:acId" element={<AcControl />} />
          </Route>

          {/** Power */}
          <Route path={`${import.meta.env.BASE_URL}dashboards/power`} element={<App />}>
            <Route index element={<Power />} />
          </Route>
      
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  </React.Fragment>
)


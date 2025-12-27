import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayOut'
import Home from '../pages/Home/Home'
import Courses from "../pages/Courses/Courses"
import Webinar from '../pages/Webinar/Webinar'
import Exams from '../pages/Exams/Exams'
import Marketing from '../pages/Marketing/Marketing'
import MyApp from '../pages/MyApp/MyApp'
import Websites from '../pages/Websites/Websites'
import Certificates from '../pages/Certificates/Certificates'
import AffiliateMarketing from '../pages/AffiliateMarketing/AffiliateMarketing'
import Users from '../pages/Users/Users'

import Settings from '../pages/Settings/Settings'
const AppRoutes = () => {
  return (
    <Routes>

      <Route  element={<DashboardLayout />}>
        <Route path="/"  element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/*" element={<Navigate to="/courses" replace />} />
        <Route path="/users" element={<Users />} />
        <Route path="/exams"  element={<Exams />} />
        <Route path="/webinar" element={<Webinar />} />
        <Route path="/certificates" element={<Certificates />} />
        <Route path="/marketing" element={<Marketing />} />
        <Route path="/affiliatemarketing"  element={<AffiliateMarketing />} />
        <Route path="/myapp" element={<MyApp />} />
        <Route path="/websites" element={<Websites />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes

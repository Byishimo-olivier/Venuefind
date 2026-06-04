import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './pages/auth/SignUp';
import Login from './pages/auth/Login';
import Verification from './pages/auth/Verification';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VenueHome from './pages/venues/VenueHome';
import VenueAllList from './pages/venues/VenueAllList';
import VenuePlanning from './pages/venues/VenuePlanning';
import VenueHeritage from './pages/venues/VenueHeritage';
import VenueSearchMap from './pages/venues/VenueSearchMap';
import VenueDetails from './pages/venues/VenueDetails';
import VenueBooking from './pages/venues/VenueBooking';
import VenueCheckout from './pages/venues/VenueCheckout';
import BookingConfirmation from './pages/venues/BookingConfirmation';
import PaymentSuccess from './pages/venues/PaymentSuccess';
import VenueReviews from './pages/venues/VenueReviews';
import VenueReviewForm from './pages/venues/VenueReviewForm';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import OwnerTransactions from './pages/owner/OwnerTransactions';
import OwnerPayouts from './pages/owner/OwnerPayouts';
import RegistrationBasic from './pages/owner/RegistrationBasic';
import RegistrationBusiness from './pages/owner/RegistrationBusiness';
import RegistrationVerification from './pages/owner/RegistrationVerification';
import RegistrationReview from './pages/owner/RegistrationReview';
import OwnerReputation from './pages/owner/OwnerReputation';
import OwnerPortfolio from './pages/owner/OwnerPortfolio';
import OwnerBookings from './pages/owner/OwnerBookings';
import OwnerAnalytics from './pages/owner/OwnerAnalytics';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminFinance from './pages/admin/AdminFinance';
import AdminProviders from './pages/admin/AdminProviders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminPerformance from './pages/admin/AdminPerformance';
import AdminDemand from './pages/admin/AdminDemand';
import AdminReports from './pages/admin/AdminReports';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/venue" element={<Navigate to="/venues" replace />} />
        <Route path="/venues" element={<VenueHome />} />
        <Route path="/venues/all" element={<VenueAllList />} />
        <Route path="/venues/planning" element={<VenuePlanning />} />
        <Route path="/venues/heritage" element={<VenueHeritage />} />
        <Route path="/venues/search" element={<VenueSearchMap />} />
        <Route path="/venues/:venueId" element={<VenueDetails />} />
        <Route path="/venues/:venueId/book" element={<VenueBooking />} />
        <Route path="/venues/:venueId/checkout" element={<VenueCheckout />} />
        <Route path="/venues/:venueId/confirmed" element={<BookingConfirmation />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/venues/:venueId/reviews" element={<VenueReviews />} />
        <Route path="/venues/:venueId/review/new" element={<VenueReviewForm />} />
        <Route path="/owner" element={<ProtectedRoute allowedRoles={['owner']}><OwnerDashboard /></ProtectedRoute>} />
        <Route path="/owner/transactions" element={<ProtectedRoute allowedRoles={['owner']}><OwnerTransactions /></ProtectedRoute>} />
        <Route path="/owner/invoices" element={<ProtectedRoute allowedRoles={['owner']}><OwnerTransactions /></ProtectedRoute>} />
        <Route path="/owner/payouts" element={<ProtectedRoute allowedRoles={['owner']}><OwnerPayouts /></ProtectedRoute>} />
        <Route path="/owner/register" element={<ProtectedRoute allowedRoles={['owner']}><RegistrationBasic /></ProtectedRoute>} />
        <Route path="/owner/register/business" element={<ProtectedRoute allowedRoles={['owner']}><RegistrationBusiness /></ProtectedRoute>} />
        <Route path="/owner/register/verification" element={<ProtectedRoute allowedRoles={['owner']}><RegistrationVerification /></ProtectedRoute>} />
        <Route path="/owner/register/review" element={<ProtectedRoute allowedRoles={['owner']}><RegistrationReview /></ProtectedRoute>} />
        <Route path="/owner/reputation" element={<ProtectedRoute allowedRoles={['owner']}><OwnerReputation /></ProtectedRoute>} />
        <Route path="/owner/portfolio" element={<ProtectedRoute allowedRoles={['owner']}><OwnerPortfolio /></ProtectedRoute>} />
        <Route path="/owner/bookings" element={<ProtectedRoute allowedRoles={['owner']}><OwnerBookings /></ProtectedRoute>} />
        <Route path="/owner/analytics" element={<ProtectedRoute allowedRoles={['owner']}><OwnerAnalytics /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/finance" element={<ProtectedRoute allowedRoles={['admin']}><AdminFinance /></ProtectedRoute>} />
        <Route path="/admin/providers" element={<ProtectedRoute allowedRoles={['admin']}><AdminProviders /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><AdminSettings /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['admin']}><AdminAnalytics /></ProtectedRoute>} />
        <Route path="/admin/performance" element={<ProtectedRoute allowedRoles={['admin']}><AdminPerformance /></ProtectedRoute>} />
        <Route path="/admin/demand" element={<ProtectedRoute allowedRoles={['admin']}><AdminDemand /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><AdminReports /></ProtectedRoute>} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verification" element={<Verification />} />
        {/* <Route path="/c" element={<Verification />} /> */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Redirect to venue discovery as default */}
        <Route path="/" element={<Navigate to="/venues" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

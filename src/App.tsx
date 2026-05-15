import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './pages/auth/SignUp';
import Login from './pages/auth/Login';
import Verification from './pages/auth/Verification';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VenueHome from './pages/venues/VenueHome';
import VenueSearchMap from './pages/venues/VenueSearchMap';
import VenueDetails from './pages/venues/VenueDetails';
import VenueBooking from './pages/venues/VenueBooking';
import VenueCheckout from './pages/venues/VenueCheckout';
import BookingConfirmation from './pages/venues/BookingConfirmation';
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
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/venues" element={<VenueHome />} />
        <Route path="/venues/search" element={<VenueSearchMap />} />
        <Route path="/venues/akagera" element={<VenueDetails />} />
        <Route path="/venues/akagera/book" element={<VenueBooking />} />
        <Route path="/venues/akagera/checkout" element={<VenueCheckout />} />
        <Route path="/venues/akagera/confirmed" element={<BookingConfirmation />} />
        <Route path="/venues/akagera/reviews" element={<VenueReviews />} />
        <Route path="/venues/akagera/review/new" element={<VenueReviewForm />} />
        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path="/owner/transactions" element={<OwnerTransactions />} />
        <Route path="/owner/invoices" element={<OwnerTransactions />} />
        <Route path="/owner/payouts" element={<OwnerPayouts />} />
        <Route path="/owner/register" element={<RegistrationBasic />} />
        <Route path="/owner/register/business" element={<RegistrationBusiness />} />
        <Route path="/owner/register/verification" element={<RegistrationVerification />} />
        <Route path="/owner/register/review" element={<RegistrationReview />} />
        <Route path="/owner/reputation" element={<OwnerReputation />} />
        <Route path="/owner/portfolio" element={<OwnerPortfolio />} />
        <Route path="/owner/bookings" element={<OwnerBookings />} />
        <Route path="/owner/analytics" element={<OwnerAnalytics />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/finance" element={<AdminFinance />} />
        <Route path="/admin/providers" element={<AdminProviders />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/performance" element={<AdminPerformance />} />
        <Route path="/admin/demand" element={<AdminDemand />} />
        <Route path="/admin/reports" element={<AdminReports />} />
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

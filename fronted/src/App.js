import './App.css'
import { Route, Routes } from "react-router-dom";
import IndexPage from "./pages/IndexPage.js";
import Layout from "./Layout";
import RegisterPage from "./pages/RegisterPage";
import axios from "axios";
import { UserContextProvider } from "./UserContext";
import ProfilePage from "./pages/ProfilePage.js";
import PlacesPage from "./pages/PlacesPage";
import PlacesFormPage from "./pages/PlacesFormPage";
import PlacePage from "./pages/PlacePage";
import BookingsPage from "./pages/BookingsPage";
import BookingPage from "./pages/BookingPage";
import Loginpage from './pages/LoginPage.js';
import Registerseller from './Registerseller';
import Dashboard from './pages/Dashboard';
import Payment from './pages/Payment';
import Userdata from './pages/Userdata';
import Allproduct from './pages/Allproducts';
import Payments from './pages/Payments';
import Checkout from './pages/Checkout';



axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<Loginpage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/registers" element={<Registerseller />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path="/account" element={<ProfilePage />} />
          <Route path="/account/places" element={<PlacesPage />} />
          <Route path="/account/places/new" element={<PlacesFormPage />} />
          <Route path="/account/places/:id" element={<PlacesFormPage />} />
          <Route path="/place/:id" element={<PlacePage />} />
          <Route path="/account/bookings" element={<BookingsPage />} />
          <Route path="/account/bookings/:id" element={<BookingPage />} />
          <Route path="/account/payment/:id" element={<Payment />} />
          {/* <Route path="/payments" element={<Payments />} /> */}
          <Route path="/account/payment/checkout" element={<Checkout />} />
          <Route path="/dashboard/userdata" element={<Userdata />} />
          <Route path="/dashboard/allproduct" element={<Allproduct />} />
        </Route>
      </Routes>
    </UserContextProvider>
  )
}

export default App;
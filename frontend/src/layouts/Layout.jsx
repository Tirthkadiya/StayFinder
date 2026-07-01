import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Flash from "../components/Flash";
import { useLocation, Outlet } from 'react-router-dom';

const Layout = ({ currUser }) => {
  const location = useLocation();
console.log("DEBUG: Current location state:", location.state);
  const success = location.state?.success;
  const error = location.state?.error;

  return (
    <>
      <Navbar currUser={currUser} />
      <div className="container mt-4">
        <Flash success={success} error={error} />
        <Outlet context={{ currUser }} />
      </div>
      <Footer />
    </>
  );
};

export default Layout;
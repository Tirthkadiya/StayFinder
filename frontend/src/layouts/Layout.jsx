
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import Flash from "../components/Flash";

// import { useEffect, useState } from 'react';
// import { useLocation, useNavigate, Outlet } from 'react-router-dom';

// const Layout = ({ currUser }) => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [flash, setFlash] = useState({
//     success: location.state?.success,
//     error: location.state?.error
//   });

//   useEffect(() => {
//     if (flash.success || flash.error) {
//       const timer = setTimeout(() => {
//         setFlash({ success: null, error: null });
//         navigate(location.pathname, { replace: true, state: {} });
//       }, 3000);

//       return () => clearTimeout(timer); 
//     }
//   }, [flash, navigate, location.pathname]);

//   return (
//     <>
//       <Navbar currUser={currUser} />
//       <div className="container mt-4">
//         {(flash.success || flash.error) && (
//           <Flash success={flash.success} error={flash.error} />
//         )}
//         <Outlet context={{ currUser }} />
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Layout;


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
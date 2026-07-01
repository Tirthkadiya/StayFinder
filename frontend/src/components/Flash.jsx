import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Flash = ({ success, error }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (success || error) {

      Swal.fire({
        icon: success ? "success" : "error",
        title: success ? "Success" : "Error",
        text: success || error,
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        if (location.state) {
          navigate(location.pathname, { replace: true, state: {} });
        }
        
      });
    }
  }, [success, error, navigate, location]);

  return null;
};

export default Flash;



// const Flash = ({ success, error }) => {
//   useEffect(() => {
//     if (success) {
//       Swal.fire({
//         icon: "success",
//         title: "Success",
//         text: success,
//         timer: 3000,
//         showConfirmButton: false,
//       });
//     }

//     if (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: error,
//         timer: 3000,
//         showConfirmButton: false,
//       });
//     }
//   }, [success, error]);

//   return null; 
// };

// export default Flash;

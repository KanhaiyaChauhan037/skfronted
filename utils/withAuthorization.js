import { toast } from "react-toastify";
import useAuthorization from "./useAuth";

function withAuthorization(WrappedComponent, expectedRoles) {
  function ProtectedPage(props) {
    const userRole = useAuthorization(expectedRoles);

    if (!expectedRoles.includes(userRole)) {
      toast.error("Unauthorised");
      return null; //  return a loading indicator or an error message
    }
    return <WrappedComponent {...props} />;
  }

  return ProtectedPage;
}

export default withAuthorization;

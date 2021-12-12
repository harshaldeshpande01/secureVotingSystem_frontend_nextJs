// HOC/withAuth.jsx
import { useRouter } from "next/router";
import jwt_decode from "jwt-decode";

const withAuth = (WrappedComponent) => {
  return (props) => {
    // checks whether we are on client / browser or server.
    if (typeof window !== "undefined") {
      const Router = useRouter();

      const accessToken = localStorage.getItem("accessToken");

      // If there is no access token we redirect to "/" page.
      if (!accessToken) {
        Router.replace("/login");
        return null;
      }
      else if (jwt_decode(accessToken).authLevel2) {
        Router.replace("/");
        return null;
      }
      else if (jwt_decode(accessToken).authLevel1) {
        return <WrappedComponent {...props} />;
      }
    }

    // If we are on server, return null
    return null;
  };
};

export default withAuth;
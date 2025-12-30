import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { checkAuth } from "./auth";

type RequireAuthProps = { children: React.ReactElement };

export default function RequireAuth({ children }: RequireAuthProps) {
  const location = useLocation();
  const [authState, setAuthState] = React.useState<"checking" | "authed" | "unauth" | "forbidden">(
    "checking"
  );

  React.useEffect(() => {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log("[RequireAuth] mount at", location.pathname);
    }
    let isMounted = true;
    checkAuth().then((info) => {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log("[RequireAuth] result", { info, from: location.pathname });
      }
      if (!isMounted) return;
      if (!info.authenticated) {
        setAuthState("unauth");
      } else if (
        !info.roles ||
        !info.roles.some(
          (role) => role.toLowerCase() === "manager" || role.toLowerCase() === "employee"
        )
      ) {
        setAuthState("forbidden");
      } else {
        setAuthState("authed");
      }
    });
    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  if (authState === "checking") {
    return null;
  }
  if (authState === "unauth") {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log("[RequireAuth] redirect to /login from", location.pathname);
    }
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }
  if (authState === "forbidden") {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log("[RequireAuth] forbidden: not a manager, redirect to /");
    }
    return <Navigate to="/" replace state={{ from: location.pathname + location.search }} />;
  }
  return children;
}

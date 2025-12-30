import React from "react";
import { Navigate } from "react-router-dom";
import { checkAuth } from "./auth";

type RedirectIfAuthedProps = { children: React.ReactElement };

export default function RedirectIfAuthed({ children }: RedirectIfAuthedProps) {
  const [authState, setAuthState] = React.useState<
    "checking" | "authed-manager" | "authed-customer" | "unauth"
  >("checking");
  React.useEffect(() => {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log("[RedirectIfAuthed] mount");
    }
    let isMounted = true;
    checkAuth().then((info) => {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log("[RedirectIfAuthed] result", { info });
      }
      if (isMounted) {
        if (!info.authenticated) {
          setAuthState("unauth");
        } else if (info.roles && info.roles.includes("manager")) {
          setAuthState("authed-manager");
        } else {
          setAuthState("authed-customer");
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  if (authState === "checking") {
    return null;
  }
  if (authState === "authed-manager") {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log("[RedirectIfAuthed] redirect to /manager");
    }
    return <Navigate to="/manager" replace />;
  }
  if (authState === "authed-customer") {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log("[RedirectIfAuthed] redirect to / (customer)");
    }
    return <Navigate to="/" replace />;
  }
  return children;
}

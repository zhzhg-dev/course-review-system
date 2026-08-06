import { useEffect, useState } from "react";
import { allRoutes } from "../constants/routes";

// Read the current hash route from the browser URL
// Falls back to the home page if the route does not exist
function getRoute() {
  const name = window.location.hash.replace("#/", "") || "home";
  return allRoutes.includes(name) ? name : "home";
}

// Update the browser hash and switch pages inside the SPA router
export function navigate(routeName) {
  window.location.hash = `/${routeName}`;
}

// Custom React hook for tracking hash route changes
// Listens for browser hash updates and re-renders the current page
export function useHashRoute() {
  const [route, setRoute] = useState(getRoute);

  // Watch for URL hash changes such as #/login or #/courses
  useEffect(() => {
    const handleHashChange = () => setRoute(getRoute());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return route;
}


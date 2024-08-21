import React, { Suspense, lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import DefaultLayout from "./components/layouts/DefaultLayout";
import GuestLayout from "./components/layouts/GuestLayout";


const Login = lazy(() => import('./views/Login'))

import FlightSearch from "./views/travel/FlightSearch";
import BookingLayout from "./components/layouts/BookingLayout";
import Books from "./views/travel/Books";

const router = createBrowserRouter([

  
  {
    path: "/",
    element: <DefaultLayout />,
    children: [

      {
        path: "/backend/booking",
        element: <Navigate to="/" />
      },
      {
        path: "/",
        element: <Books />,
      },

 
    ],
  },

  {
    path: "/",
    element: <GuestLayout />,
    children: [

      {
        path: "/login",
        element: <Suspense fallback=
          {<div>please wait...</div>}>
          <Login />
        </Suspense>,
      }
    ],
  },
  
  {
    path: "/",
    element: <BookingLayout />,
    children: [
      {
        path: "/booking",
        element: <FlightSearch />,
      }
    ],
  },

]);

export default router;

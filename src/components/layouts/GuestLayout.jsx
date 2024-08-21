import { NavLink, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "src/contexts/ContextProvider";
import { BuildingStorefrontIcon } from "@heroicons/react/24/outline";
import pineLogo from 'src/assets/pine.png'

export default function GuestLayout() {
  const { userToken } = useStateContext();

  if (userToken) {
    return <Navigate to="/" />
  }


  return (
    <div>


      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* <NavLink to="/shop/register">
            <BuildingStorefrontIcon className="h-6 w-6 text-blue-500" />
          </NavLink> */}
          <div>
            <NavLink to="/booking">
            <button className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">Booking</button>
            </NavLink>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  )
}

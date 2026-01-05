import { createBrowserRouter } from "react-router-dom";
import { MainPage } from "../pages/client/MainPage";
import { HallPage } from "../pages/client/HallPage";
import { PaymentPage } from "../pages/client/PaymentPage";
import { TicketPage } from "../pages/client/TicketPage";
import { NotFoundPage } from "../pages/client/NotFoundPage";
import { AdminPage } from "../pages/admin/AdminPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "/hall/:screeningId",
    element: <HallPage />,
  },
  {
    path: "payment",
    element: <PaymentPage />,
  },
  {
    path: "ticket",
    element: <TicketPage />,
  },
{
    path: "/admin",
    element: <AdminPage />,
  }, 
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Error from "./Error.jsx";
import Home from "./Home.jsx";
import Shop from "./Shop.jsx";
import Card from "./card-components.jsx";
import Contact from "./Contact.jsx";
import About from "./About.jsx";
import AdminLayout from "./AdminLayout.jsx";
import Dashboard from "./components/admin-dashboard-components/Dashboard.jsx";
import AddProduct from "./components/admin-dashboard-components/AddProduct.jsx";
import AdminProducts from "./components/admin-dashboard-components/AdminProducts.jsx";
import AdminPlaceholder from "./components/admin-dashboard-components/AdminPlaceholder.jsx";
import AdminOrders from "./components/admin-dashboard-components/AdminOrders.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";
import AdminCategories from "./pages/AdminCategories.jsx";
import ProtectedAdminRoute from "./components/admin-dashboard-components/ProtectedAdminRoute.jsx";
import { LaptopDataProvider } from "./context/LaptopDataProvider.jsx";
import { CartProvider } from "./context/CartProvider.jsx";
import { AdminAuthProvider } from "./context/AdminAuthProvider.jsx";
import { UserAuthProvider } from "./context/UserAuthProvider.jsx";
import Cart from "./pages/Cart.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "shop",
        element: <Shop />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: ":queryParams",
        element: <Card />,
      },
    ],
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    element: <ProtectedAdminRoute />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "add",
            element: <AddProduct />,
          },
          {
            path: "edit/:id",
            element: <AddProduct />,
          },
          {
            path: "products",
            element: <AdminProducts />,
          },
          {
            path: "orders",
            element: <AdminOrders />,
          },
          {
            path: "users",
            element: <AdminUsers />,
          },
          {
            path: "categories",
            element: <AdminCategories />,
          },
          {
            path: "analytics",
            element: <AdminPlaceholder title="Analytics" />,
          },
          {
            path: "reviews",
            element: <AdminPlaceholder title="Reviews" />,
          },
          {
            path: "messages",
            element: <AdminPlaceholder title="Messages" />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <UserAuthProvider>
    <AdminAuthProvider>
      <CartProvider>
        <LaptopDataProvider>
          <RouterProvider router={router}></RouterProvider>
        </LaptopDataProvider>
      </CartProvider>
    </AdminAuthProvider>
  </UserAuthProvider>
);

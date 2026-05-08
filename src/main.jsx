import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { lazy, Suspense } from "react";
import "./index.css";
import App from "./App.jsx";
import ProtectedAdminRoute from "./components/admin-dashboard-components/ProtectedAdminRoute.jsx";
import { LaptopDataProvider } from "./context/LaptopDataProvider.jsx";
import { CartProvider } from "./context/CartProvider.jsx";
import { AdminAuthProvider } from "./context/AdminAuthProvider.jsx";
import { UserAuthProvider } from "./context/UserAuthProvider.jsx";

const ErrorPage = lazy(() => import("./Error.jsx"));
const Home = lazy(() => import("./Home.jsx"));
const Shop = lazy(() => import("./Shop.jsx"));
const Card = lazy(() => import("./card-components.jsx"));
const Contact = lazy(() => import("./Contact.jsx"));
const About = lazy(() => import("./About.jsx"));
const Cart = lazy(() => import("./pages/Cart.jsx"));
const AccountDashboard = lazy(() => import("./pages/AccountDashboard.jsx"));
const MyOrders = lazy(() => import("./pages/MyOrders.jsx"));
const EditProfile = lazy(() => import("./pages/EditProfile.jsx"));
const AdminLayout = lazy(() => import("./AdminLayout.jsx"));
const Dashboard = lazy(() => import("./components/admin-dashboard-components/Dashboard.jsx"));
const AddProduct = lazy(() => import("./components/admin-dashboard-components/AddProduct.jsx"));
const AdminProducts = lazy(() => import("./components/admin-dashboard-components/AdminProducts.jsx"));
const AdminPlaceholder = lazy(() => import("./components/admin-dashboard-components/AdminPlaceholder.jsx"));
const AdminOrders = lazy(() => import("./components/admin-dashboard-components/AdminOrders.jsx"));
const AdminAnalytics = lazy(() => import("./pages/AdminAnalytics.jsx"));
const AdminLogin = lazy(() => import("./pages/AdminLogin.jsx"));
const AdminUsers = lazy(() => import("./pages/AdminUsers.jsx"));
const AdminCustomers = lazy(() => import("./pages/AdminCustomers.jsx"));
const AdminCategories = lazy(() => import("./pages/AdminCategories.jsx"));
const EditAbout = lazy(() => import("./components/admin-dashboard-components/EditAbout.jsx"));
const ViewMessages = lazy(() => import("./components/admin-dashboard-components/ViewMessages.jsx"));

function PageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6 text-base font-medium text-gray-700">
      Loading page...
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: (
      <Suspense fallback={<PageFallback />}>
        <ErrorPage />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageFallback />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "shop",
        element: (
          <Suspense fallback={<PageFallback />}>
            <Shop />
          </Suspense>
        ),
      },
      {
        path: "contact",
        element: (
          <Suspense fallback={<PageFallback />}>
            <Contact />
          </Suspense>
        ),
      },
      {
        path: "about",
        element: (
          <Suspense fallback={<PageFallback />}>
            <About />
          </Suspense>
        ),
      },
      {
        path: "cart",
        element: (
          <Suspense fallback={<PageFallback />}>
            <Cart />
          </Suspense>
        ),
      },
      {
        path: "account",
        element: (
          <Suspense fallback={<PageFallback />}>
            <AccountDashboard />
          </Suspense>
        ),
      },
      {
        path: "account/orders",
        element: (
          <Suspense fallback={<PageFallback />}>
            <MyOrders />
          </Suspense>
        ),
      },
      {
        path: "account/edit",
        element: (
          <Suspense fallback={<PageFallback />}>
            <EditProfile />
          </Suspense>
        ),
      },
      {
        path: ":queryParams",
        element: (
          <Suspense fallback={<PageFallback />}>
            <Card />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/admin/login",
    element: (
      <Suspense fallback={<PageFallback />}>
        <AdminLogin />
      </Suspense>
    ),
  },
  {
    element: <ProtectedAdminRoute />,
    children: [
      {
        path: "/admin",
        element: (
          <Suspense fallback={<PageFallback />}>
            <AdminLayout />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PageFallback />}>
                <Dashboard />
              </Suspense>
            ),
          },
          {
            path: "dashboard",
            element: (
              <Suspense fallback={<PageFallback />}>
                <Dashboard />
              </Suspense>
            ),
          },
          {
            path: "add",
            element: (
              <Suspense fallback={<PageFallback />}>
                <AddProduct />
              </Suspense>
            ),
          },
          {
            path: "edit/:id",
            element: (
              <Suspense fallback={<PageFallback />}>
                <AddProduct />
              </Suspense>
            ),
          },
          {
            path: "products",
            element: (
              <Suspense fallback={<PageFallback />}>
                <AdminProducts />
              </Suspense>
            ),
          },
          {
            path: "orders",
            element: (
              <Suspense fallback={<PageFallback />}>
                <AdminOrders />
              </Suspense>
            ),
          },
          {
            path: "users",
            element: (
              <Suspense fallback={<PageFallback />}>
                <AdminUsers />
              </Suspense>
            ),
          },
          {
            path: "customers",
            element: (
              <Suspense fallback={<PageFallback />}>
                <AdminCustomers />
              </Suspense>
            ),
          },
          {
            path: "categories",
            element: (
              <Suspense fallback={<PageFallback />}>
                <AdminCategories />
              </Suspense>
            ),
          },
          {
            path: "analytics",
            element: (
              <Suspense fallback={<PageFallback />}>
                <AdminAnalytics />
              </Suspense>
            ),
          },
          {
            path: "reviews",
            element: (
              <Suspense fallback={<PageFallback />}>
                <AdminPlaceholder title="Reviews" />
              </Suspense>
            ),
          },
          {
            path: "messages",
            element: (
              <Suspense fallback={<PageFallback />}>
                <ViewMessages />
              </Suspense>
            ),
          },
          {
            path: "about",
            element: (
              <Suspense fallback={<PageFallback />}>
                <EditAbout />
              </Suspense>
            ),
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
          <RouterProvider router={router} />
        </LaptopDataProvider>
      </CartProvider>
    </AdminAuthProvider>
  </UserAuthProvider>
);

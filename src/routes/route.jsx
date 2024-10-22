import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import FullLayout from "../layouts/FullLayout";

import Login from "../components/Auth/Login";
import Logout from "../components/Auth/Logout";
import Not_Found from "../components/Not_Found/Not_Found";
import Loader from "../components/Not_Found/Loader";
// import ProtectedRoute from "./ProtectedRoute";

// Lazy load your components
const Dashboard = lazy(() => import("../components/Dashboard/Dashboard"));
const Roles = lazy(() => import("../components/Roles/Roles"));
const UserList = lazy(() => import("../components/Users/UserList"));
const ProductList = lazy(() => import("../components/Products/ProductList"));
const EditProduct = lazy(() => import("../components/Products/EditProduct"));
const AddProduct = lazy(() => import("../components/Products/AddProduct"));
const Coupons = lazy(() => import("../components/Coupons/Coupons"));
const OrderList = lazy(() => import("../components/Orders/OrderList"));
const Features = lazy(() => import("../components/Features/Features"));
const AddFeature = lazy(() => import("../components/Features/AddFeature"));
const EditFeature = lazy(() => import("../components/Features/EditFeature"));
const CategoryList = lazy(() => import("../components/Category/CategoryList"));
const EditRole = lazy(() => import("../components/Roles/EditRole"));
const Address = lazy(() => import("../components/Address/Address"));

const Routing = () => {
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />

          {/* Main Layout Routes */}
          <Route path="/" element={<FullLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/roles/editrole/:id" element={<EditRole />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/editproduct/:id" element={<EditProduct />} />
            <Route path="/products/addproduct" element={<AddProduct />} />
            <Route path="/categories" element={<CategoryList />} />
            <Route path="/coupons" element={<Coupons />} />
            <Route path="/orders" element={<OrderList />} />
            <Route path="/user/address" element={<Address />} />
            <Route path="/features" element={<Features />} />
            <Route path="/features/addFeature" element={<AddFeature />} />
            <Route path="/features/editFeature/:id" element={<EditFeature />} />
          </Route>
          <Route path="*" element={<Not_Found />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

export default Routing;

import React from "react";
import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import FullLayout from "../layouts/FullLayout";

import Login from "../components/Auth/Login";
import Logout from "../components/Auth/Logout";

import Dashboard from "../components/Dashboard/Dashboard";
import Roles from "../components/Roles/Roles";
import UserList from "../components/Users/UserList";
import ProductList from "../components/Products/ProductList";
import EditProduct from "../components/Products/EditProduct";
import AddProduct from "../components/Products/AddProduct";
import Coupons from "../components/Coupons/Coupons";
import OrderList from "../components/Orders/OrderList";
import Features from "../components/Features/Features";
import AddFeature from "../components/Features/AddFeature";
import EditFeature from "../components/Features/EditFeature";
import CategoryList from "../components/Category/CategoryList";

import Not_Found from "../components/Not_Found/Not_Found";
import Address from "../components/Address/Address";

const Routing = () => {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />

        {/* Main Layout Routes */}
        <Route path="/" element={<FullLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/roles" element={<Roles />} />
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
    </AnimatePresence>
  );
};

export default Routing;

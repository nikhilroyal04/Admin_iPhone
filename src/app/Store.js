import { configureStore } from "@reduxjs/toolkit";
import menuReducer from "../app/features/menuSlice";
import categoryReducer from "../app/features/categorySlice";
import couponReducer from "../app/features/couponSlice";
import roleReducer from "../app/features/roleSlice";
import userReducer from "../app/features/userSlice";
import productReducer from "../app/features/productSlice";
import orderReducer from "../app/features/orderSlice";
import dashboardReducer from "../app/features/dashSlice";
import addressReducer from "../app/features/addressSlice";
import featureReducer from "../app/features/featureSlice";
import authReducer from "../app/features/authSlice";

const store = configureStore({
  reducer: {
    menu: menuReducer,
    dashboard: dashboardReducer,
    category: categoryReducer,
    coupon: couponReducer,
    role: roleReducer,
    user: userReducer,
    product: productReducer,
    order: orderReducer,
    address: addressReducer,
    feature: featureReducer,
    auth: authReducer,
  },
});

export default store;

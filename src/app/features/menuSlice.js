import { createSlice } from "@reduxjs/toolkit";

const iconMap = {
  Roles: "TfiControlEject",
  Users: "FaUsers",
  Categories: "BiCategoryAlt",
  Products: "FaProductHunt",
  Orders: "CiShop",
  Address: "FaRegAddressCard",
  Coupons: "TbRosetteDiscount",
  Features: "MdOutlineFeaturedPlayList",
};

const initialState = {
  LinkItems: [],
};

export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setLinkItems: (state, action) => {
      state.LinkItems = action.payload || [];
    },
  },
});

export const { setLinkItems } = menuSlice.actions;

export const fetchLinkItems = () => async (dispatch) => {
  try {
    const menuItems = [
      { module: "Users", pageRoute: "/users" },
      { module: "Roles", pageRoute: "/roles" },
      { module: "Categories", pageRoute: "/categories" },
      { module: "Products", pageRoute: "/products" },
      { module: "Orders", pageRoute: "/orders" },
      { module: "Address", pageRoute: "/user/address" },
      { module: "Coupons", pageRoute: "/coupons" },
      { module: "Features", pageRoute: "/features" },
    ].map((item) => ({
      title: item.module,
      href: item.pageRoute,
      iconName: iconMap[item.module],
    }));

    dispatch(setLinkItems(menuItems));
  } catch (error) {
    console.error("Error fetching menu items:", error);
  }
};

export default menuSlice.reducer;

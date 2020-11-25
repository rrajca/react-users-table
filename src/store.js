import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./views/usersTable/usersSlice";

export default configureStore({
  reducer: {
    users: usersReducer,
  },
});

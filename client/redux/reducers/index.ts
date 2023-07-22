import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authReducer";
import songSlice from "../slices/songSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  song: songSlice,
});

export default rootReducer;

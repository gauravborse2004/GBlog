import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import sessionStorage from "redux-persist/es/storage/session";
import authReducer from "./auth-slice/authSlice";
import categoryReducer from "./category-slice/categorySlice";
import blogReducer from "./blog-slice/blogSice";
import commentReducer from "./comment-slice/commentSlice";
import likeReducer from "./like-slice/likeSlice"

const rootReducer = combineReducers({
  auth: authReducer,
  category: categoryReducer,
  blog: blogReducer,
  comment: commentReducer,
  like:likeReducer
});

const persistConfig = {
  key: "root",
  storage: sessionStorage,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

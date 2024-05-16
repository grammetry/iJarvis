import { configureStore } from "@reduxjs/toolkit";
import currentMessageReducer from "./store/currentMessage";


export const store = configureStore({
    reducer: {
        currentMessage: currentMessageReducer,
    },
});
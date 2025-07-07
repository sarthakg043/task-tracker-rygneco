import { configureStore } from "@reduxjs/toolkit";
import todoReducer from '@/features/todo/todoSlice'
import darkModeReducer from '@/features/darkMode/darkModeSlice'
import authReducer from '@/features/auth/authSlice'

export const store = configureStore({
    reducer: {
        todo: todoReducer,
        darkMode: darkModeReducer,
        auth: authReducer
    }
})
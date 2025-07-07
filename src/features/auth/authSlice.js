import { createSlice } from '@reduxjs/toolkit'

// Check for existing user in localStorage
const getUserFromStorage = () => {
    try {
        const user = localStorage.getItem('user')
        return user ? JSON.parse(user) : null
    } catch (error) {
        return null
    }
}

const initialState = {
    isAuthenticated: !!getUserFromStorage(),
    user: getUserFromStorage(),
    loading: false,
    error: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true
            state.error = null
        },
        loginSuccess: (state, action) => {
            state.loading = false
            state.isAuthenticated = true
            state.user = action.payload
            state.error = null
            // Save user to localStorage
            localStorage.setItem('user', JSON.stringify(action.payload))
        },
        loginFailure: (state, action) => {
            state.loading = false
            state.isAuthenticated = false
            state.user = null
            state.error = action.payload
        },
        logout: (state) => {
            state.isAuthenticated = false
            state.user = null
            state.error = null
            // Remove user from localStorage
            localStorage.removeItem('user')
        },
        clearError: (state) => {
            state.error = null
        }
    }
})

export const { loginStart, loginSuccess, loginFailure, logout, clearError } = authSlice.actions
export default authSlice.reducer

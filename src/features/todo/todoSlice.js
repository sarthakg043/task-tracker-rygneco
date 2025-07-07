/**
 * todoSlice.js - Redux Slice for Todo Management
 * 
 * This file contains the Redux Toolkit slice for managing todo state.
 * It handles all todo-related actions including CRUD operations and tag management.
 * 
 * Features:
 * - Complete todo lifecycle management (create, read, update, delete)
 * - Priority system (high, medium, low, none)
 * - Tag management with unique tag storage
 * - Local storage persistence
 * - Immutable state updates using Redux Toolkit
 * 
 * State Structure:
 * - todos: Array of todo objects
 * - availableTags: Array of unique tag strings for autocomplete
 * 
 * @author Sarthak Gupta
 * @version 1.0.0
 */

import { createSlice, nanoid } from "@reduxjs/toolkit";
import { useEffect } from "react";

// Load persisted data from localStorage
const todos = JSON.parse(localStorage.getItem('todos') || '[]')
const savedTags = JSON.parse(localStorage.getItem('availableTags') || '[]')

/**
 * Initial state for the todo slice
 * 
 * @typedef {Object} TodoState
 * @property {Array} todos - Array of todo objects
 * @property {Array} availableTags - Array of unique tag strings
 */
const initialState = {
    todos,                    // Restored from localStorage
    availableTags: savedTags, // Array of unique tag strings for autocomplete
}

/**
 * Todo Redux Slice
 * 
 * Creates the Redux slice with all todo-related reducers.
 * Each reducer handles a specific todo operation and maintains immutability.
 */
export const todoSlice = createSlice({
    name: "todo",
    initialState,
    reducers: {
        /**
         * Add Todo Reducer
         * 
         * Creates a new todo with all provided properties and adds it to the state.
         * Also updates the available tags list with any new tags.
         * 
         * @param {Object} state - Current Redux state
         * @param {Object} action - Action object with payload containing todo data
         * @param {string} action.payload.title - Todo title (required)
         * @param {string} action.payload.description - Todo description (optional)
         * @param {string} action.payload.targetDate - ISO date string (optional)
         * @param {string} action.payload.priority - Priority level: 'high', 'medium', 'low', or null
         * @param {Array} action.payload.tags - Array of tag strings (optional)
         */
        addTodo: (state, action) => {
            // Create new todo object with unique ID
            const todo = {
                id: nanoid(),                                           // Generate unique ID
                title: action.payload.title,
                description: action.payload.description,
                targetDate: action.payload.targetDate,
                priority: action.payload.priority || null,             // high, medium, low, or null
                tags: action.payload.tags || [],                       // Array of tag strings
                isCompleted: false                                      // New todos are always incomplete
            }
            
            // Add todo to state
            state.todos.push(todo)
            
            // Update available tags (prevent duplicates)
            if (action.payload.tags && action.payload.tags.length > 0) {
                const newTags = action.payload.tags.filter(tag => !state.availableTags.includes(tag))
                state.availableTags = [...state.availableTags, ...newTags]
                localStorage.setItem('availableTags', JSON.stringify(state.availableTags))
            }
            
            // Persist todos to localStorage
            localStorage.setItem('todos', JSON.stringify(state.todos))
        },

        /**
         * Update Todo Reducer
         * 
         * Updates an existing todo with new data. Finds todo by ID and replaces its properties.
         * Also updates available tags if new tags are provided.
         * 
         * @param {Object} state - Current Redux state
         * @param {Object} action - Action object with payload containing update data
         * @param {string} action.payload.id - ID of todo to update (required)
         * @param {string} action.payload.title - Updated title
         * @param {string} action.payload.description - Updated description
         * @param {string} action.payload.targetDate - Updated target date (ISO string)
         * @param {string} action.payload.priority - Updated priority level
         * @param {Array} action.payload.tags - Updated tags array
         */
        updateTodo:(state, action) => {
            // Find and update the specific todo
            state.todos = state.todos.map((todo) => (
                todo.id === action.payload.id ? {
                    ...todo,                                            // Preserve existing properties
                    title: action.payload.title,
                    description: action.payload.description,
                    targetDate: action.payload.targetDate,
                    priority: action.payload.priority,
                    tags: action.payload.tags || []
                } : todo
            ))
            
            // Update available tags (prevent duplicates)
            if (action.payload.tags && action.payload.tags.length > 0) {
                const newTags = action.payload.tags.filter(tag => !state.availableTags.includes(tag))
                state.availableTags = [...state.availableTags, ...newTags]
                localStorage.setItem('availableTags', JSON.stringify(state.availableTags))
            }
            
            // Persist updated todos to localStorage
            localStorage.setItem('todos', JSON.stringify(state.todos))
        },

        /**
         * Remove Todo Reducer
         * 
         * Removes a todo from the state by filtering out the todo with matching ID.
         * 
         * @param {Object} state - Current Redux state
         * @param {Object} action - Action object with payload containing todo ID
         * @param {string} action.payload - ID of todo to remove
         */
        removeTodo: (state, action) => {
            // Filter out the todo with matching ID
            state.todos = state.todos.filter((todo) => todo.id !== action.payload)
            
            // Persist updated todos to localStorage
            localStorage.setItem('todos', JSON.stringify(state.todos))
        },

        /**
         * Toggle Complete Reducer
         * 
         * Toggles the completion status of a todo by ID.
         * Finds the todo and flips its isCompleted boolean value.
         * 
         * @param {Object} state - Current Redux state
         * @param {Object} action - Action object with payload containing todo ID
         * @param {string} action.payload - ID of todo to toggle
         */
        toggleComplete: (state, action) => {
            // Find todo and toggle its completion status
            state.todos = state.todos.map((todo) => (
                todo.id === action.payload ? {...todo, isCompleted: !todo.isCompleted} : todo
            ))
            
            // Persist updated todos to localStorage
            localStorage.setItem('todos', JSON.stringify(state.todos))
        }
    }
})

/**
 * Export action creators
 * 
 * These action creators are automatically generated by Redux Toolkit
 * and can be imported and dispatched from components.
 * 
 * Usage example:
 * import { addTodo, updateTodo, removeTodo, toggleComplete } from '@/features/todo/todoSlice'
 * dispatch(addTodo({ title: 'New Todo', description: 'Todo description' }))
 */
export const { addTodo, updateTodo, removeTodo, toggleComplete } = todoSlice.actions

/**
 * Export the reducer
 * 
 * This reducer needs to be added to the store configuration.
 * It handles all todo-related state updates.
 */
export default todoSlice.reducer
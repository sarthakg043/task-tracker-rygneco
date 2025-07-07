import { createSlice, nanoid } from "@reduxjs/toolkit";
import { useEffect } from "react";

const todos = JSON.parse(localStorage.getItem('todos') || '[]')
const savedTags = JSON.parse(localStorage.getItem('availableTags') || '[]')

const initialState = {
    todos,
    availableTags: savedTags, // Array of unique tag strings
}

export const todoSlice = createSlice({
    name: "todo",
    initialState,
    reducers: {
        // all functionality is describes here making single source of truth
        addTodo: (state, action) => {
            const todo = {
                id: nanoid(),
                title: action.payload.title,
                description: action.payload.description,
                targetDate: action.payload.targetDate,
                priority: action.payload.priority || null, // high, medium, low, or null
                tags: action.payload.tags || [], // Array of tag strings
                isCompleted: false
            }
            state.todos.push(todo)
            
            // Update available tags (no duplicates)
            if (action.payload.tags && action.payload.tags.length > 0) {
                const newTags = action.payload.tags.filter(tag => !state.availableTags.includes(tag))
                state.availableTags = [...state.availableTags, ...newTags]
                localStorage.setItem('availableTags', JSON.stringify(state.availableTags))
            }
            
            localStorage.setItem('todos', JSON.stringify(state.todos))
        },
        updateTodo:(state, action) => {
            // accepts an object with id, title, description, targetDate, priority, tags
            // remember to pass date as string by String(targetDate)
            state.todos = state.todos.map((todo) => (
                todo.id === action.payload.id ? {
                    ...todo,
                    title: action.payload.title,
                    description: action.payload.description,
                    targetDate: action.payload.targetDate,
                    priority: action.payload.priority,
                    tags: action.payload.tags || []
                } : todo
            ))
            
            // Update available tags (no duplicates)
            if (action.payload.tags && action.payload.tags.length > 0) {
                const newTags = action.payload.tags.filter(tag => !state.availableTags.includes(tag))
                state.availableTags = [...state.availableTags, ...newTags]
                localStorage.setItem('availableTags', JSON.stringify(state.availableTags))
            }
            
            localStorage.setItem('todos', JSON.stringify(state.todos))
        },
        removeTodo: (state, action) => {
            // accepts an id
            state.todos = state.todos.filter((todo) => todo.id !== action.payload)
            localStorage.setItem('todos', JSON.stringify(state.todos))
        },
        toggleComplete: (state, action) => {
            // accepts an id
            state.todos = state.todos.map((todo) => (
                todo.id === action.payload ? {...todo, isCompleted: !todo.isCompleted} : todo
            ))
            localStorage.setItem('todos', JSON.stringify(state.todos))
        }
    }
})

// export action creators
export const { addTodo, updateTodo, removeTodo, toggleComplete } = todoSlice.actions

// Store needs to know about the slice, so we export the slice
export default todoSlice.reducer
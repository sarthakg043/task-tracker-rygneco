/**
 * TodoForm.jsx - Main Todo Management Component
 * 
 * This component handles the core todo functionality including:
 * - Creating new todos with title, description, tags, priority, and target date
 * - Displaying all todos with filtering and sorting capabilities
 * - Managing todo state through Redux
 * - Providing real-time statistics and filtering options
 * 
 * Features:
 * - Form validation and submission
 * - Priority-based sorting (High → Medium → Low → None)
 * - Filter by completion status (All, Pending, Completed)
 * - Tag management with autocomplete
 * - Date picker integration
 * - Responsive design with scrollable todo list
 * 
 * @author Sarthak Gupta
 * @version 1.0.0
 */

import React, { useState, useMemo } from 'react'
import { Button } from './ui/button'
import { DatePickerWithPresets } from './DatePickerWithPresets'
import Todo from './Todo'
import TagInput from './TagInput'
import { useDispatch, useSelector } from 'react-redux'
import { addTodo } from '@/features/todo/todoSlice'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

/**
 * TodoForm Component
 * 
 * Main component that renders the todo creation form and todo list.
 * Manages local state for form inputs and integrates with Redux for todo management.
 * 
 * @returns {JSX.Element} The complete todo form and list interface
 */
const TodoForm = () => {
    // Form state management
    const [title, setTitle] = useState('')                    // Todo title (required)
    const [description, setDescription] = useState('')        // Todo description (optional)
    const [targetDate, setTargetDate] = useState(null)        // Target completion date (optional)
    const [priority, setPriority] = useState(null)            // Priority level: high, medium, low, or null
    const [tags, setTags] = useState([])                      // Array of tag strings
    const [filter, setFilter] = useState('all')               // Filter state: all, pending, completed

    // Redux state and dispatch
    const dispatch = useDispatch()
    const todos = useSelector(state => state.todo.todos)                    // All todos from Redux store
    const availableTags = useSelector(state => state.todo.availableTags)    // Available tags for autocomplete

    /**
     * Memoized filtered and sorted todos
     * 
     * Filters todos based on completion status and sorts by priority.
     * Uses useMemo for performance optimization to prevent unnecessary recalculations.
     * 
     * Priority order: High (0) → Medium (1) → Low (2) → None (3)
     */
    const filteredTodos = useMemo(() => {
        let filtered = []
        
        // Filter by completion status
        switch (filter) {
            case 'completed':
                filtered = todos.filter(todo => todo.isCompleted)
                break
            case 'pending':
                filtered = todos.filter(todo => !todo.isCompleted)
                break
            case 'all':
            default:
                filtered = todos
        }
        
        // Sort by priority (high > medium > low > no priority)
        // Create a copy of the array before sorting to avoid mutating Redux state
        return [...filtered].sort((a, b) => {
            const priorityOrder = { 'high': 0, 'medium': 1, 'low': 2, null: 3, undefined: 3 }
            return priorityOrder[a.priority] - priorityOrder[b.priority]
        })
    }, [todos, filter])

    /**
     * Memoized task statistics
     * 
     * Calculates total, completed, and pending task counts.
     * Used for displaying statistics in the UI.
     */
    const taskStats = useMemo(() => {
        const total = todos.length
        const completed = todos.filter(todo => todo.isCompleted).length
        const pending = total - completed
        return { total, completed, pending }
    }, [todos])

    /**
     * Handle form submission
     * 
     * Creates a new todo with all form data and dispatches it to Redux store.
     * Resets all form fields after successful submission.
     * 
     * @param {Event} e - Form submission event
     */
    const handleSubmit = (e) => {
        e.preventDefault()
        
        // Dispatch new todo to Redux store
        dispatch(addTodo({
            title,
            description,
            targetDate: targetDate ? targetDate.toISOString() : null,  // Convert Date to ISO string
            priority,
            tags,
        }))
        
        // Reset form fields
        setTitle('')
        setDescription('')
        setTargetDate(null)
        setPriority(null)
        setTags([])
    }

    /**
     * Handle date picker changes
     * 
     * Updates the target date state when user selects a date.
     * 
     * @param {Date} date - Selected date from date picker
     */
    const handleDateChange = (date) => {
        setTargetDate(date)
    }

    return (
        <div 
            className='w-full flex flex-row justify-center items-center text-xl font-bold bg-transparent'
        >
            <div 
                className='w-11/12 max-w-[40rem] flex flex-wrap justify-center items-center dark:bg-black shadow-md rounded-lg p-4 mt-12 backdrop-blur-sm bg-white/30 dark:bg-black/30'
            >
                {/* Todo Creation Form */}
                <form onSubmit={handleSubmit} className=' w-full bg-white dark:bg-black dark:text-white border dark:border-cyan-500  shadow-sm rounded-md pb-5 px-3 pt-2'>
                    {/* Title Input - Required field */}
                    <input 
                        name="title"
                        type='text' 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className='w-4/5 h-10 px-2 text-base lg:text-lg font-normal rounded-lg bg-transparent focus:outline-none  dark:text-white' 
                        placeholder='Add todo...'
                        maxLength={50}
                        required
                    />
                    
                    {/* Description Input - Optional field */}
                    <input 
                        name="description"
                        type='text' 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className='w-4/5 h-10 px-2 text-xs lg:text-sm font-light rounded-lg focus:outline-none bg-transparent dark:text-white' 
                        placeholder='Add description...'
                        maxLength={225}
                    />
                    
                    {/* Tag Input Component */}
                    <div className="pt-2">
                        <TagInput
                            tags={tags}
                            onTagsChange={setTags}
                            availableTags={availableTags}
                            placeholder="Add tags (press Enter or comma to add)..."
                        />
                    </div>
                    
                    {/* Form Controls Row */}
                    <div className='flex flex-wrap justify-between pt-3 gap-2'>
                        {/* Date Picker */}
                        <div className="w-full sm:w-auto">
                            <DatePickerWithPresets 
                                label={"Pick a target Date"} 
                                onStateChange={handleDateChange} 
                                value={targetDate}
                            />
                        </div>
                        
                        {/* Priority Selector */}
                        <div className="w-full sm:w-auto">
                            <Select value={priority || "none"} onValueChange={(value) => setPriority(value === "none" ? null : value)}>
                                <SelectTrigger className="w-full sm:w-32">
                                    <SelectValue placeholder="Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">No Priority</SelectItem>
                                    <SelectItem value="high">🚩 High</SelectItem>
                                    <SelectItem value="medium">🟡 Medium</SelectItem>
                                    <SelectItem value="low">🔵 Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        {/* Submit Button */}
                        <div className='w-full max-w-32 sm:w-1/5 pt-3 sm:pt-0'>
                            <Button
                                type='submit'
                                className='w-full h-10 dark:outline-cyan-500 outline text-white font-bold rounded-lg bg-blue-500 dark:bg-transparent dark:text-cyan-500 dark:hover:bg-cyan-500 dark:hover:text-white'
                            >
                                Add
                            </Button>
                        </div>
                    </div>
                </form>
                
                {/* Todo List Section */}
                <div className='w-full'>
                    {/* Header with Statistics and Filter */}
                    <div className='flex justify-between items-center my-4'>
                        <div>
                            <h3 className='text-lg font-semibold text-gray-800 dark:text-white'>
                                Your Tasks ({filteredTodos.length})
                            </h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>
                                Total: {taskStats.total} | Completed: {taskStats.completed} | Pending: {taskStats.pending}
                            </p>
                        </div>
                        
                        {/* Filter Controls */}
                        <div className='flex items-center space-x-2'>
                            <span className='text-sm text-gray-600 dark:text-gray-400'>Filter:</span>
                            <Select value={filter} onValueChange={setFilter}>
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Filter" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Tasks</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    
                    {/* Todo List or Empty State */}
                    {filteredTodos.length === 0 ? (
                        // Empty state with contextual messaging
                        <div className='text-center py-8 text-gray-500 dark:text-gray-400'>
                            {filter === 'all' 
                                ? 'No tasks yet. Add your first task above!' 
                                : filter === 'completed' 
                                    ? 'No completed tasks yet.' 
                                    : 'No pending tasks. Great job!'
                            }
                        </div>
                    ) : (
                        // Scrollable todo list container (max-height: 650px)
                        <div className="max-h-[650px] overflow-y-auto pr-2 space-y-2">
                            {/* Todo List */}
                            {filteredTodos.map((todo) => (
                                <Todo key={todo.id} todo={todo} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TodoForm
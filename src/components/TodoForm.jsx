import React, { useState, useMemo } from 'react'
import { Button } from './ui/button'
import { DatePickerWithPresets } from './DatePickerWithPresets'
import Todo from './Todo'
import { useDispatch, useSelector } from 'react-redux'
import { addTodo } from '@/features/todo/todoSlice'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const TodoForm = () => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [targetDate, setTargetDate] = useState(null)
    const [priority, setPriority] = useState(null)
    const [filter, setFilter] = useState('all')

    const dispatch = useDispatch()
    const todos = useSelector(state => state.todo.todos)

    // Filter todos based on selected filter
    const filteredTodos = useMemo(() => {
        let filtered = []
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

    // Calculate task statistics
    const taskStats = useMemo(() => {
        const total = todos.length
        const completed = todos.filter(todo => todo.isCompleted).length
        const pending = total - completed
        return { total, completed, pending }
    }, [todos])

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(addTodo({
            title,
            description,
            targetDate: targetDate ? targetDate.toISOString() : null,
            priority,
        }))
        setTitle('')
        setDescription('')
        setTargetDate(null)
        setPriority(null)
    }

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
            <form onSubmit={handleSubmit} className=' w-full bg-white dark:bg-black dark:text-white border dark:border-cyan-500  shadow-sm rounded-md pb-5 px-3 pt-2'>
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
                <input 
                    name="description"
                    type='text' 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className='w-4/5 h-10 px-2 text-xs lg:text-sm font-light rounded-lg focus:outline-none bg-transparent dark:text-white' 
                    placeholder='Add description...'
                    maxLength={225}
                />
                <div className='flex flex-wrap justify-between pt-3 gap-2'>
                    <div className="w-full sm:w-auto">
                        <DatePickerWithPresets label={"Pick a target Date"} onStateChange={handleDateChange} value={targetDate}/>
                    </div>
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
            <div className='w-full'>
                <div className='flex justify-between items-center my-4'>
                    <div>
                        <h3 className='text-lg font-semibold text-gray-800 dark:text-white'>
                            Your Tasks ({filteredTodos.length})
                        </h3>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>
                            Total: {taskStats.total} | Completed: {taskStats.completed} | Pending: {taskStats.pending}
                        </p>
                    </div>
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
                
                {filteredTodos.length === 0 ? (
                    <div className='text-center py-8 text-gray-500 dark:text-gray-400'>
                        {filter === 'all' 
                            ? 'No tasks yet. Add your first task above!' 
                            : filter === 'completed' 
                                ? 'No completed tasks yet.' 
                                : 'No pending tasks. Great job!'
                        }
                    </div>
                ) : (
                    <>
                        {/* Todo List */}
                        {filteredTodos.map((todo) => (
                            <Todo key={todo.id} todo={todo} />
                        ))}
                    </>
                )}
            </div>
        </div>
    </div>
  )
}

export default TodoForm
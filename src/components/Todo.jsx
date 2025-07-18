import { useEffect, useState } from 'react'
import { DatePickerWithPresets } from './DatePickerWithPresets'
import { Button } from './ui/button'
import TagInput from './TagInput'
import { useDispatch, useSelector } from 'react-redux'
import { updateTodo, removeTodo, toggleComplete } from '@/features/todo/todoSlice'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Helper function to get priority flag
const getPriorityFlag = (priority) => {
  switch (priority) {
    case 'high':
      return '🔴'
    case 'medium':
      return '🟡'
    case 'low':
      return '🔵'
    default:
      return null
  }
}

const Todo = ({todo}) => {

  // const {updateTodo, toggleComplete, removeTodo} = useTodoContext()
  const dispatch = useDispatch()
  const availableTags = useSelector(state => state.todo.availableTags)
  const [isTodoEditable, setIsTodoEditable] = useState(false)
  const [todoTitle, setTodoTitle] = useState(todo.title)
  const [todoDescription, setTodoDescription] = useState(todo.description)
  const [todoTargetDate, setTodoTargetDate] = useState(todo.targetDate ? new Date(todo.targetDate) : null)
  const [todoPriority, setTodoPriority] = useState(todo.priority || null)
  const [todoTags, setTodoTags] = useState(todo.tags || [])

  const editTodo = () => {
    if(!todoTitle) return;
    dispatch(updateTodo({
      type: 'todos/updateTodo',
      payload: {
        id: todo.id,
        title: todoTitle,
        description: todoDescription,
        targetDate: todoTargetDate ? todoTargetDate.toISOString() : null,
        priority: todoPriority,
        tags: todoTags
      }
    }))
    setIsTodoEditable(false);
  }

  useEffect(() => {
    if(todo.isCompleted){
      setIsTodoEditable(false)
    }
  }, [todo.isCompleted])

  return (
    <div className={`border font-light   shadow-sm rounded-md pb-1 mb-1 px-3 pt-2 dark:bg-transparent
      ${todo.isCompleted ? "bg-[#c6e9a7] dark:border-[#c6e9a7]" : `${isTodoEditable ? "bg-white text-black" : "bg-[#afcce5]"} dark:border-[#afcce5] dark:text-[#afcce5]`}
    `}>
      <form onSubmit={(e) => e.preventDefault()}>
      <div
        className='w-full flex justify-between m-0'
      >
        <div className='flex items-center w-4/5'>
          {getPriorityFlag(todoPriority) && (
            <span className='text-lg mr-2 flex-shrink-0'>
              {getPriorityFlag(todoPriority)}
            </span>
          )}
          <input 
            className={`flex-1 px-4 text-sm lg:text-base font-normal bg-transparent focus:outline-none transition ease-in-out border-b
              ${ isTodoEditable ? "border-black/20 px-2 dark:border-white/50 dark:text-white" : "border-transparent cursor-default"} ${todo.isCompleted ? "line-through" : ""}`} 
            type='text'
            value={todoTitle}
            onChange={(e) => setTodoTitle(e.target.value)}
            placeholder='Title'
            readOnly={!isTodoEditable}
            maxLength={50}
            name='title'
            required
          />
        </div>
        <div
          className='w-1/5 flex justify-end items-center px-2 dark:text-white text-sm'
        >
          <label htmlFor="todoComplete">Completed</label>
          <input
            id='todoComplete' 
            type="checkbox" 
            className='mx-2 cursor-pointer' 
            onChange={() => dispatch(toggleComplete(todo.id))} 
            checked={todo.isCompleted} 
          /> 
        </div>
      </div>
      
      {/* Tags display */}
      {(todoTags.length > 0 || isTodoEditable) && (
        <div className="px-4 py-2 w-full">
          <TagInput
            tags={todoTags}
            onTagsChange={setTodoTags}
            availableTags={availableTags}
            isEditable={isTodoEditable}
            placeholder="Add tags..."
          />
        </div>
      )}
      
      <div className='m-0 w-4/5'>
        {isTodoEditable || todoDescription ? (
        <input 
          className={`w-full px-4 text-xs text-wrap lg:text-sm font-light rounded-sm focus:outline-none bg-transparent transition ease-in-out
            ${ isTodoEditable ? " border-black/10 dark:border-white/50 dark:text-white" : "border-transparent cursor-default text-"}
          `}
          type='text'
          value={todoDescription}
          onChange={(e) => setTodoDescription(e.target.value)}
          readOnly={!isTodoEditable}
          maxLength={225}
          placeholder={`${isTodoEditable ? "Description" : ""}`}
          name='description'
        />
        ) : null}
      </div>
      <div className='flex flex-wrap justify-between gap-2'>
        <div className="w-full sm:w-auto">
          {isTodoEditable || todoTargetDate ? (
            <DatePickerWithPresets 
              label={"Pick a target Date"} 
              isEditable={isTodoEditable} 
              value={todoTargetDate} 
              onStateChange={(date) => setTodoTargetDate(date)} 
              classNames={` outline-none border-none ${isTodoEditable ? "dark:text-white" : "bg-transparent hover:bg-transparent dark:hover:text-inherit"}`}
            />
          ): null}
        </div>
        
        <div className="w-full sm:w-auto">
          {isTodoEditable ? (
            <Select 
              value={todoPriority || "none"} 
              onValueChange={(value) => setTodoPriority(value === "none" ? null : value)}
              disabled={!isTodoEditable}
            >
              <SelectTrigger className={`w-full sm:w-32 ${!isTodoEditable ? "bg-transparent border-none shadow-none hover:bg-transparent" : ""}`}>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Priority</SelectItem>
                <SelectItem value="high">🚩 High</SelectItem>
                <SelectItem value="medium">🟡 Medium</SelectItem>
                <SelectItem value="low">🔵 Low</SelectItem>
              </SelectContent>
            </Select>
          ): null}
        </div>
        
        <div className='w-full flex sm:justify-end flex-1 pt-3 sm:pt-1'>
        {!todo.isCompleted ? (
          <Button
            className={`min-w-28 sm:min-w-20 h-10 sm:h-8  outline text-white font-bold rounded-lg bg-yellow-500 dark:bg-transparent dark:text-yellow-500 dark:hover:bg-yellow-500 dark:hover:text-white
              ${isTodoEditable ? "bg-blue-500 dark:bg-transparent dark:text-blue-500 dark:hover:bg-blue-500 dark:hover:text-white" : "dark:outline-yellow-500"}
            `}
            onClick={() => {
              if (isTodoEditable) {
                editTodo();
              } else setIsTodoEditable((prev) => !prev);
            }}
            disabled={todo.isCompleted}
          >
            {isTodoEditable ? "Save" : "Edit"}
          </Button>
          ) : null}
          <Button
            className='min-w-28 sm:min-w-20 h-10 sm:h-8 mx-3 dark:outline-red-500 outline text-white font-bold rounded-lg bg-red-500 dark:bg-transparent dark:text-red-500 dark:hover:bg-red-500 dark:hover:text-white'
            onClick={() => dispatch(removeTodo(todo.id))}
          >
            Remove
          </Button>
        </div>
      </div>
      </form>
    </div>
  )
}

export default Todo
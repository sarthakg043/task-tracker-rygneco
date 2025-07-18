"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function DatePickerWithPresets({label, onStateChange, value, isEditable = true, classNames=""}) {
  const [date, setDate] = React.useState(value || null)

  // Update local state when value prop changes
  React.useEffect(() => {
    setDate(value || null)
  }, [value])

  const handleChange = (date) => {
    const val = addDays(new Date(), parseInt(date))
    setDate(val)
    onStateChange(val)
  }

  // Helper function to safely format date
  const formatDate = (dateToFormat) => {
    if (!dateToFormat) return null
    try {
      // Handle string dates
      if (typeof dateToFormat === 'string') {
        const parsedDate = new Date(dateToFormat)
        if (isNaN(parsedDate.getTime())) return null
        return format(parsedDate, "PPP")
      }
      // Handle Date objects
      if (dateToFormat instanceof Date && !isNaN(dateToFormat.getTime())) {
        return format(dateToFormat, "PPP")
      }
      return null
    } catch (error) {
      console.warn('Error formatting date:', error)
      return null
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground", classNames
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (formatDate(date) || <span>{label}</span>) : <span>{label}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
        <Select
          onValueChange={isEditable ? handleChange : undefined}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="0">Today</SelectItem>
            <SelectItem value="1">Tomorrow</SelectItem>
            <SelectItem value="3">In 3 days</SelectItem>
            <SelectItem value="7">In a week</SelectItem>
          </SelectContent>
        </Select>
        <div className="rounded-md border">
          <Calendar mode="single" selected={date} onSelect={isEditable ? ((selectedDate) => { onStateChange(selectedDate); setDate(selectedDate)}) : undefined} 
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}

import React, { useState, useRef } from 'react'
import { Badge } from './ui/badge'
import { X } from 'lucide-react'

// Function to get consistent colors for tags
const getTagColor = (tag) => {
  const colors = [
    'bg-blue-100 text-blue-800 border-blue-200',
    'bg-green-100 text-green-800 border-green-200',
    'bg-yellow-100 text-yellow-800 border-yellow-200',
    'bg-purple-100 text-purple-800 border-purple-200',
    'bg-pink-100 text-pink-800 border-pink-200',
    'bg-indigo-100 text-indigo-800 border-indigo-200',
    'bg-red-100 text-red-800 border-red-200',
    'bg-orange-100 text-orange-800 border-orange-200',
  ]
  
  // Generate consistent color based on tag string
  let hash = 0
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

const TagInput = ({ tags, onTagsChange, availableTags = [], isEditable = true, placeholder = "Add tags..." }) => {
  const [inputValue, setInputValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef(null)

  // Filter available tags based on input and exclude already selected tags
  const filteredSuggestions = availableTags.filter(tag => 
    tag.toLowerCase().includes(inputValue.toLowerCase()) && 
    !tags.includes(tag)
  )

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
    setShowSuggestions(true)
  }

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(inputValue.trim())
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      // Remove last tag when backspace is pressed on empty input
      removeTag(tags[tags.length - 1])
    }
  }

  const addTag = (tag) => {
    if (tag && !tags.includes(tag)) {
      onTagsChange([...tags, tag])
      setInputValue('')
      setShowSuggestions(false)
    }
  }

  const removeTag = (tagToRemove) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSuggestionClick = (tag) => {
    addTag(tag)
    inputRef.current?.focus()
  }

  const handleInputBlur = () => {
    // Add current input as tag if it's not empty
    if (inputValue.trim()) {
      addTag(inputValue.trim())
    }
    // Delay hiding suggestions to allow click events
    setTimeout(() => setShowSuggestions(false), 150)
  }

  return (
    <div className="relative">
      <div className={`flex flex-wrap gap-1 p-2 border rounded-md bg-background ${isEditable ? 'border-input' : 'border-transparent bg-transparent'}`}>
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            className={`text-xs ${getTagColor(tag)}`}
          >
            #{tag}
            {isEditable && (
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 hover:text-red-600"
              >
                <X size={12} />
              </button>
            )}
          </Badge>
        ))}
        {isEditable && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={handleInputBlur}
            placeholder={tags.length === 0 ? placeholder : ''}
            className="flex-1 min-w-20 outline-none bg-transparent text-sm"
          />
        )}
      </div>
      
      {/* Suggestions dropdown */}
      {showSuggestions && isEditable && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-background border border-border rounded-md shadow-lg max-h-40 overflow-y-auto">
          {filteredSuggestions.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleSuggestionClick(tag)}
              className="w-full text-left px-3 py-2 hover:bg-accent hover:text-accent-foreground text-sm"
            >
              #{tag}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default TagInput

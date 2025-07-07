/**
 * TagInput.jsx - Tag Management Component
 * 
 * A sophisticated tag input component that provides:
 * - Interactive tag creation and removal
 * - Autocomplete suggestions from available tags
 * - Color-coded tag display with consistent theming
 * - Keyboard shortcuts for efficient tag management
 * - Responsive design for all screen sizes
 * 
 * Features:
 * - Press Enter or comma to add tags
 * - Backspace to remove last tag when input is empty
 * - Click X button to remove individual tags
 * - Dropdown suggestions with previously used tags
 * - Consistent color assignment based on tag string
 * - Edit/view mode support for different contexts
 * 
 * @author Sarthak Gupta
 * @version 1.0.0
 */

import React, { useState, useRef } from 'react'
import { Badge } from './ui/badge'
import { X } from 'lucide-react'

/**
 * Generate consistent colors for tags
 * 
 * Uses a hash function to assign consistent colors to tags based on their string value.
 * This ensures the same tag always gets the same color across the application.
 * 
 * @param {string} tag - The tag string to generate color for
 * @returns {string} Tailwind CSS classes for consistent tag coloring
 */
const getTagColor = (tag) => {
  // Available color schemes for tags
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
  
  // Generate consistent hash from tag string
  let hash = 0
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  // Return color based on hash modulo
  return colors[Math.abs(hash) % colors.length]
}

/**
 * TagInput Component
 * 
 * An interactive component for managing tags with autocomplete functionality.
 * Supports both edit and view modes, keyboard shortcuts, and responsive design.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.tags - Current array of tag strings
 * @param {Function} props.onTagsChange - Callback function when tags change
 * @param {Array} props.availableTags - Array of available tags for autocomplete
 * @param {boolean} props.isEditable - Whether tags can be edited or just viewed
 * @param {string} props.placeholder - Placeholder text for input field
 * @returns {JSX.Element} The TagInput component
 */
const TagInput = ({ tags, onTagsChange, availableTags = [], isEditable = true, placeholder = "Add tags..." }) => {
  // Local state for input management
  const [inputValue, setInputValue] = useState('')           // Current input text
  const [showSuggestions, setShowSuggestions] = useState(false) // Toggle suggestions dropdown
  const inputRef = useRef(null)                              // Reference to input element

  /**
   * Filter available tags for autocomplete
   * 
   * Shows tags that match current input and aren't already selected.
   * Case-insensitive matching for better user experience.
   */
  const filteredSuggestions = availableTags.filter(tag => 
    tag.toLowerCase().includes(inputValue.toLowerCase()) && 
    !tags.includes(tag)
  )

  /**
   * Handle input value changes
   * 
   * Updates input state and shows suggestions when user types.
   * 
   * @param {Event} e - Input change event
   */
  const handleInputChange = (e) => {
    setInputValue(e.target.value)
    setShowSuggestions(true)
  }

  /**
   * Handle keyboard shortcuts
   * 
   * Supports multiple keyboard interactions:
   * - Enter/Comma: Add current input as tag
   * - Backspace: Remove last tag when input is empty
   * 
   * @param {KeyboardEvent} e - Keyboard event
   */
  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(inputValue.trim())
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      // Remove last tag when backspace is pressed on empty input
      removeTag(tags[tags.length - 1])
    }
  }

  /**
   * Add new tag
   * 
   * Adds a tag if it's not empty and not already in the list.
   * Clears input and hides suggestions after adding.
   * 
   * @param {string} tag - Tag string to add
   */
  const addTag = (tag) => {
    if (tag && !tags.includes(tag)) {
      onTagsChange([...tags, tag])
      setInputValue('')
      setShowSuggestions(false)
    }
  }

  /**
   * Remove existing tag
   * 
   * Removes a tag from the current tags array.
   * 
   * @param {string} tagToRemove - Tag string to remove
   */
  const removeTag = (tagToRemove) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove))
  }

  /**
   * Handle suggestion click
   * 
   * Adds suggested tag and refocuses input for continued editing.
   * 
   * @param {string} tag - Suggested tag to add
   */
  const handleSuggestionClick = (tag) => {
    addTag(tag)
    inputRef.current?.focus()
  }

  /**
   * Handle input blur (loss of focus)
   * 
   * Adds current input as tag if it's not empty.
   * Delays hiding suggestions to allow click events on suggestions.
   */
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
      {/* Main tag container */}
      <div className={`flex flex-wrap gap-1 p-2 border rounded-md bg-background ${isEditable ? 'border-input' : 'border-transparent bg-transparent'}`}>
        {/* Render existing tags */}
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            className={`text-xs ${getTagColor(tag)}`}
          >
            #{tag}
            {/* Remove button (only in edit mode) */}
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
        
        {/* Input field (only in edit mode) */}
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
      
      {/* Autocomplete suggestions dropdown */}
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

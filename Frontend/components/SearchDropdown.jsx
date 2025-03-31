"use client"

import { useState, useRef, useEffect } from "react"
import { Search, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from "./ui/input"

export default function SearchDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const dropdownRef = useRef(null)
  const inputRef = useRef(null)
  const router = useRouter()
  
  // Fetch real search results
  useEffect(() => {
    if (value.trim() === "") {
      setSearchResults([])
      setIsOpen(false)
      return
    }
  
    // Fetch real search results
    fetch(`/products?search=${value}`)
      .then((res) => res.json())
      .then((data) => {
        setSearchResults(data)
        setIsOpen(data.length > 0)
      })
  }, [value])

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : prev))
    }

    if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0))
    }

    if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault()
      handleSelectProduct(searchResults[selectedIndex])
    }

    if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  const handleSelectProduct = (product) => {
    onChange("")
    setIsOpen(false)
    router.push(`/product/${product.id}`)
  }

  const clearSearch = () => {
    onChange("")
    inputRef.current.focus()
  }

  return (
    <div className="relative flex-1" ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search for products..."
          className="w-full pl-8 pr-8 border rounded-md bg-background"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => searchResults.length > 0 && setIsOpen(true)}
        />
        {value && (
          <button
            className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
            onClick={clearSearch}
          >
            <X className="w-4 h-4" />
            <span className="sr-only">Clear search</span>
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 overflow-y-auto border rounded-md shadow-lg bg-background max-h-80">
          <div className="p-2 text-xs border-b text-muted-foreground">{searchResults.length} results found</div>
          <ul>
            {searchResults.map((product, index) => (
              <li key={product.id}>
                <button
                  className={`w-full text-left px-4 py-2 hover:bg-muted flex items-center justify-between ${
                    index === selectedIndex ? "bg-muted" : ""
                  }`}
                  onClick={() => handleSelectProduct(product)}
                >
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-xs text-muted-foreground">{product.category}</div>
                  </div>
                  <div className="text-xs text-primary">View details</div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

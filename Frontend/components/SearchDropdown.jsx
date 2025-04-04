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
    fetch(`http://localhost:5000/products?search=${encodeURIComponent(value)}`)
      .then((res) => res.json())
      .then((data) => {
        setSearchResults(data)
        setIsOpen(data.length > 0)
      })
      .catch((error) => {
        console.error("Error fetching search results:", error)
        setSearchResults([])
        setIsOpen(false)
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

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => 
          prev < searchResults.length - 1 ? prev + 1 : 0
        )
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => 
          prev > 0 ? prev - 1 : searchResults.length - 1
        )
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
          handleSelectProduct(searchResults[selectedIndex])
        }
        break
      case "Escape":
        e.preventDefault()
        setIsOpen(false)
        setSelectedIndex(-1)
        break
    }
  }

  const handleSelectProduct = (product) => {
    onChange(product.name)
    setIsOpen(false)
    setSelectedIndex(-1)
    router.push(`/products?search=${encodeURIComponent(product.name)}`)
  }

  const clearSearch = () => {
    onChange("")
    setSearchResults([])
    setIsOpen(false)
    setSelectedIndex(-1)
  }

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />

        
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search for products..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-9 pr-9"
        />



        
        {value && (
          <button
            onClick={clearSearch}
            className="absolute -translate-y-1/2 right-3 top-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && searchResults.length > 0 && (
        <div className="absolute z-50 w-full mt-1 border rounded-md shadow-lg bg-background">
          <ul className="py-1">
            {searchResults.map((result, index) => (
              <li
                key={result._id || index}
                className={`px-4 py-2 cursor-pointer hover:bg-muted ${
                  index === selectedIndex ? "bg-muted" : ""
                }`}
                onClick={() => handleSelectProduct(result)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{result.name}</span>
                  <span className="text-sm text-muted-foreground">
                    Rs.{result.lowestPrice?.toFixed(2) || "N/A"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

"use client"

import { useState, forwardRef, useImperativeHandle, useEffect, useRef } from "react"

const AlertDropdown = forwardRef((props, ref) => {
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false) // Set to false by default
  const dropdownRef = useRef(null)

  // Expose this function to parent via ref
  const loadAlerts = () => {
    console.log("loadAlerts called")
    setIsLoading(true)
    fetch("http://localhost:5000/alerts")
      .then((res) => res.json())
      .then((data) => {
        console.log("Alerts data received:", data)
        setSearchResults(data)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching alerts:", error)
        setSearchResults([])
        setIsLoading(false)
      })
  }

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsVisible(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Allow parent to call loadAlerts
  useImperativeHandle(ref, () => ({
    loadAlerts,
    toggleVisibility: () => {
      console.log("toggleVisibility called, current state:", isVisible)
      setIsVisible(prev => !prev)
    },
    isVisible: () => isVisible
  }))

  // For debugging
  useEffect(() => {
    console.log("AlertDropdown rendered", { isLoading, searchResults, isVisible })
  }, [isLoading, searchResults, isVisible])

  if (!isVisible) return null

  return (
    <div ref={dropdownRef} className="z-50 p-10 bg-white border-2 border-red-500 rounded-md shadow-md w-150">
      {/* <div className="mb-2 text-sm font-bold">Alert Dropdown (Always Visible)</div> */}
      
      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <div className="w-5 h-5 border-t-2 rounded-full border-primary animate-spin"></div>
          <span className="ml-2 text-sm text-muted-foreground">Loading alerts...</span>
        </div>
      ) : searchResults.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {searchResults.map((alert, index) => (
            <li key={alert.id} className="py-2">
              <div className="px-2 py-1 text-sm cursor-pointer hover:bg-muted">
                <div className="font-medium">{alert.name}</div>
                <div className="text-xs text-muted-foreground">₹{alert.price?.toFixed(2) ?? "N/A"}</div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">No alerts added yet.</p>
      )}
    </div>
  )
})

AlertDropdown.displayName = "AlertDropdown"

export default AlertDropdown

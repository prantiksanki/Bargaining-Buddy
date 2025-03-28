"use client"

import { useState, useRef, useEffect, createContext, useContext, forwardRef } from "react"

const DropdownMenuContext = createContext(null)

export const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <DropdownMenuContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative inline-block text-left">{children}</div>
    </DropdownMenuContext.Provider>
  )
}

export const DropdownMenuTrigger = forwardRef(({ asChild, children, ...props }, ref) => {
  const { isOpen, setIsOpen } = useContext(DropdownMenuContext)
  const Comp = asChild ? "div" : "button"

  return (
    <Comp
      ref={ref}
      onClick={() => setIsOpen(!isOpen)}
      aria-expanded={isOpen}
      data-state={isOpen ? "open" : "closed"}
      {...props}
    >
      {children}
    </Comp>
  )
})

DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

export const DropdownMenuContent = forwardRef(({ children, className = "", align = "center", ...props }, ref) => {
  const { isOpen, setIsOpen } = useContext(DropdownMenuContext)
  const dropdownRef = useRef(null)

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
  }, [setIsOpen])

  if (!isOpen) return null

  const alignClasses = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  }

  return (
    <div
      ref={(node) => {
        // Merge refs
        if (typeof ref === "function") ref(node)
        else if (ref) ref.current = node
        dropdownRef.current = node
      }}
      className={`absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 ${alignClasses[align]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
})

DropdownMenuContent.displayName = "DropdownMenuContent"

export const DropdownMenuItem = forwardRef(({ className = "", children, onClick, ...props }, ref) => {
  const { setIsOpen } = useContext(DropdownMenuContext)

  const handleClick = (e) => {
    onClick?.(e)
    setIsOpen(false)
  }

  return (
    <button
      ref={ref}
      className={`relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  )
})

DropdownMenuItem.displayName = "DropdownMenuItem"


"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import ProductComparison from "../../components/product-comparison"

export default function ProductSearchPage() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('search')
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true)
        setError(null)
        console.log("Fetching product with search:", searchQuery)
        const response = await fetch(`http://localhost:5000/products?search=${encodeURIComponent(searchQuery)}`)
        if (!response.ok) {
          const errorMessage = `Failed to fetch product: ${response.status} ${response.statusText}`
          console.error(errorMessage)
          setError(errorMessage)
          return
        }
        const data = await response.json()
        console.log("Fetched product data:", data)
        console.log("Product prices:", data[0]?.prices)
        console.log("Product structure:", JSON.stringify(data[0], null, 2))
        
        // Check if data is an array and has at least one product
        if (Array.isArray(data) && data.length > 0) {
          // Use the first matching product
          setProduct(data[0])
        } else if (!Array.isArray(data)) {
          // If it's a single product object, use it directly
          setProduct(data)
        } else {
          setError("No matching products found")
        }
      } catch (error) {
        console.error("Error fetching product:", error)
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    if (searchQuery) {
      fetchProduct()
    }
  }, [searchQuery])

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div>No products found matching "{searchQuery}"</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <ProductComparison product={product} />
    </div>
  )
} 
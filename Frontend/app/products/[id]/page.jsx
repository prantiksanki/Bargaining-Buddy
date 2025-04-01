"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import ProductComparison from "../../../components/product-comparison"

export default function ProductDetailsPage() {
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
        const response = await fetch(`http://localhost:5000/products?search=${searchQuery}`)
        if (!response.ok) {
          const errorMessage = `Failed to fetch product: ${response.status} ${response.statusText}`
          console.error(errorMessage)
          setError(errorMessage)
          return
        }
        const data = await response.json()
        console.log("Fetched product data:", data)
        setProduct(data)
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Product not found</div>
      </div>
    )
  }

  return <ProductComparison product={product} />
} 
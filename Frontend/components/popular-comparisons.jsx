"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Skeleton } from "./ui/skeleton"

export default function PopularComparisons() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch("http://localhost:5000/products/popular")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        // Take only the first 3 products for popular comparisons
        setProducts(data.slice(0, 3))
      } catch (error) {
        console.error("Error fetching popular products:", error)
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPopularProducts()
  }, [])

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array(3)
          .fill(null)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="w-3/4 h-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="w-full h-20 mb-4" />
                <Skeleton className="w-1/2 h-4" />
              </CardContent>
            </Card>
          ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <p className="text-red-500">Error loading popular comparisons</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <Link 
          key={product.id} 
          href={`/products?search=${encodeURIComponent(product.name)}`}
        >
          <Card className="overflow-hidden transition-shadow hover:shadow-lg">
            <div className="relative aspect-square">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={`${product.name} - ${product.category} product image`}
                fill
                className="object-cover transition-transform hover:scale-105"
                priority
              />
            </div>
            <CardHeader>
              <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold">
                  Rs.{product.lowestPrice}
                </p>
                <p className="text-sm text-muted-foreground">
                  {product.category}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
} 
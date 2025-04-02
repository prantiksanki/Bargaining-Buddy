"use client"

import {useState} from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpDown, ExternalLink, Heart } from "lucide-react"

import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { PriceHistoryChart } from "./price-history-chart"

export default function ProductComparison({ product }) {
  const [isLoading, setIsLoading] = useState(!product)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-pulse">Loading product details...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div>No product data available</div>
      </div>
    )
  }

  // Safely format price with fallback
  const formatPrice = (price) => {
    if (price === undefined || price === null) return "N/A"
    return `$${Number(price).toFixed(2)}`
  }

  return (
    <Card className="w-full bg-card">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">{product.name}</CardTitle>
        <CardDescription className="text-muted-foreground">{product.category}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden border rounded-lg aspect-square bg-muted">
              <Image 
                src={product.image || "/placeholder.svg"} 
                alt={`${product.name} - ${product.category} product image`} 
                fill 
                className="object-cover" 
                priority
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold">
                {formatPrice(product.lowestPrice)} - {formatPrice(product.highestPrice)}
              </p>
              <Button variant="outline" size="icon" className="shrink-0">
                <Heart className="w-4 h-4" />
                <span className="sr-only">Add to favorites</span>
              </Button>
            </div>
          </div>
          <div className="space-y-6">
            <Tabs defaultValue="prices" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="prices">Price Comparison</TabsTrigger>
                <TabsTrigger value="history">Price History</TabsTrigger>
              </TabsList>
              <TabsContent value="prices" className="space-y-4">
                <div className="border rounded-md bg-card">
                  <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">Retailer</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">Price</p>
                      <Button variant="ghost" size="icon" className="shrink-0">
                        <ArrowUpDown className="w-4 h-4" />
                        <span className="sr-only">Sort by price</span>
                      </Button>
                    </div>
                  </div>
                  <div className="divide-y">
                    {Array.isArray(product.prices) && product.prices.length > 0 ? (
                      product.prices.map((price, index) => (
                        <div key={index} className="flex items-center justify-between p-4">
                          <div>
                            <p className="font-medium">{price.retailer}</p>
                            <p className="text-sm text-muted-foreground">
                              {price.inStock ? "In Stock" : "Out of Stock"}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                              {formatPrice(price.price)}
                            </p>
                            {price.url && (
                              <Link href={price.url} target="_blank" className="shrink-0">
                                <Button variant="ghost" size="icon">
                                  <ExternalLink className="w-4 h-4" />
                                  <span className="sr-only">Visit retailer</span>
                                </Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center p-8 text-muted-foreground">
                        No price comparison data available
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="history">
                <div className="space-y-4">
                  <div className="p-4 border rounded-md bg-card">
                    <PriceHistoryChart data={product.priceHistory} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <div>
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <Button variant="outline">Set Price Alert</Button>
        <Button>
          <Link href={`/products?search=${encodeURIComponent(product.name)}`} className="flex items-center">
            View Full Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}


import Image from "next/image"
import Link from "next/link"

import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"

export default function SearchResults() {
  // This would typically come from an API or props
  const results = [
    {
      id: "1",
      name: "Apple iPhone 15 Pro",
      image: "/placeholder.svg?height=200&width=200",
      category: "Electronics",
      lowestPrice: 999.0,
      savings: 200.0,
      retailers: 6,
    },
    {
      id: "2",
      name: 'Samsung 65" QLED 4K TV',
      image: "/placeholder.svg?height=200&width=200",
      category: "Electronics",
      lowestPrice: 1299.99,
      savings: 400.0,
      retailers: 5,
    },
    {
      id: "3",
      name: "Dyson V12 Vacuum",
      image: "/placeholder.svg?height=200&width=200",
      category: "Home",
      lowestPrice: 499.99,
      savings: 100.0,
      retailers: 4,
    },
    {
      id: "4",
      name: "Nike Air Max 270",
      image: "/placeholder.svg?height=200&width=200",
      category: "Fashion",
      lowestPrice: 129.99,
      savings: 50.0,
      retailers: 8,
    },
  ]

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {results.map((result) => (
        <Card key={result.id} className="overflow-hidden">
          <div className="relative aspect-square">
            <Image
              src={result.image || "/placeholder.svg"}
              alt={result.name}
              fill
              className="object-cover transition-transform hover:scale-105"
            />
          </div>
          <CardHeader className="p-4">
            <div className="flex items-start justify-between">
              <CardTitle className="text-base line-clamp-2">{result.name}</CardTitle>
              <Badge variant="outline" className="ml-2 shrink-0">
                {result.category}
              </Badge>
            </div>
            <CardDescription>Compare prices from {result.retailers} retailers</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Lowest price</p>
                <p className="text-xl font-bold">${result.lowestPrice.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Potential savings</p>
                <p className="text-lg font-medium text-emerald-600 dark:text-emerald-400">
                  Up to ${result.savings.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button asChild className="w-full">
              <Link href={`/product/${result.id}`}>Compare Prices</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}


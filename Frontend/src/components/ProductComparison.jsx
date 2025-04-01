"use client"

import { useState } from "react"
import { ArrowUpDown, ExternalLink, Heart } from "lucide-react"

import Button from "./ui/Button"
import Card from "./ui/Card"
import Tabs from "./ui/Tabs"
import { PriceHistoryChart } from "./PriceHistoryChart"

export default function ProductComparison() {
  // This would typically come from an API or props
  const product = {
    id: "1",
    name: "Sony WH-1000XM4 Wireless Noise Cancelling Headphones",
    image: "https://placehold.co/300x300",
    description: "Industry-leading noise cancellation with Dual Noise Sensor technology",
    category: "Electronics",
    prices: [
      { retailer: "Amazon", price: 278.0, url: "#", inStock: true },
      { retailer: "Best Buy", price: 299.99, url: "#", inStock: true },
      { retailer: "Walmart", price: 289.0, url: "#", inStock: false },
      { retailer: "Target", price: 299.99, url: "#", inStock: true },
    ],
    lowestPrice: 278.0,
    highestPrice: 349.99,
    averagePrice: 298.0,
    priceHistory: [
      { date: "Jan", amazon: 349, bestbuy: 349, walmart: 349, target: 349 },
      { date: "Feb", amazon: 329, bestbuy: 349, walmart: 339, target: 349 },
      { date: "Mar", amazon: 329, bestbuy: 329, walmart: 329, target: 329 },
      { date: "Apr", amazon: 299, bestbuy: 329, walmart: 319, target: 329 },
      { date: "May", amazon: 299, bestbuy: 299, walmart: 299, target: 299 },
      { date: "Jun", amazon: 278, bestbuy: 299, walmart: 289, target: 299 },
    ],
  }

  const [activeTab, setActiveTab] = useState("prices")

  return (
    <Card className="w-full">
      <div className="p-6 border-b">
        <h3 className="text-2xl font-bold">{product.name}</h3>
        <p className="text-muted-foreground">{product.category}</p>
      </div>
      <div className="p-6">
        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square overflow-hidden rounded-lg border">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium">Price Range</p>
                <p className="text-2xl font-bold">
                  ${product.lowestPrice.toFixed(2)} - ${product.highestPrice.toFixed(2)}
                </p>
              </div>
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
                <span className="sr-only">Add to favorites</span>
              </Button>
            </div>
          </div>
          <div className="space-y-6">
            <Tabs
              tabs={[
                { id: "prices", label: "Price Comparison" },
                { id: "history", label: "Price History" },
              ]}
              activeTab={activeTab}
              onChange={setActiveTab}
            >
              {activeTab === "prices" && (
                <div className="space-y-4 mt-4">
                  <div className="rounded-md border">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">Retailer</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">Price</p>
                        <Button variant="ghost" size="icon">
                          <ArrowUpDown className="h-4 w-4" />
                          <span className="sr-only">Sort by price</span>
                        </Button>
                      </div>
                    </div>
                    <div className="divide-y">
                      {product.prices.map((price) => (
                        <div key={price.retailer} className="flex items-center justify-between p-4">
                          <div>
                            <p className="font-medium">{price.retailer}</p>
                            <p className="text-sm text-muted-foreground">
                              {price.inStock ? "In Stock" : "Out of Stock"}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <p
                              className={`text-lg font-bold ${price.price === product.lowestPrice ? "text-emerald-600 dark:text-emerald-400" : ""}`}
                            >
                              ${price.price.toFixed(2)}
                            </p>
                            <Button asChild size="sm">
                              <a href={price.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View
                              </a>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "history" && (
                <div className="space-y-4 mt-4">
                  <div className="rounded-md border p-4">
                    <PriceHistoryChart data={product.priceHistory} />
                  </div>
                </div>
              )}
            </Tabs>
            <div>
              <h3 className="text-lg font-medium">Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 border-t flex justify-between">
        <Button variant="outline">Set Price Alert</Button>
        <Button>View Full Details</Button>
      </div>
    </Card>
  )
}


"use client"

import {useState, useEffect} from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpDown, ExternalLink, Heart } from "lucide-react"

import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { PriceHistoryChart } from "./price-history-chart"
const axios = require('axios');


export default function ProductComparison() {
  // This would typically come from an API or props
  // const product = {
  //   id: "1",
  //   name: "Sony WH-1000XM4 Wireless Noise Cancelling Headphones",
  //   image: "https://www.bhphotovideo.com/images/images2500x2500/sony_wh1000xm4_s_wh_1000xm4_wireless_noise_canceling_over_ear_1582976.jpg?height=300&width=300",
  //   description: "Industry-leading noise cancellation with Dual Noise Sensor technology",
  //   category: "Electronics",
  //   prices: [
  //     { retailer: "Amazon", price: 278.0, url: "#", inStock: true },
  //     { retailer: "Best Buy", price: 299.99, url: "#", inStock: true },
  //     { retailer: "Walmart", price: 289.0, url: "#", inStock: false },
  //     { retailer: "Target", price: 299.99, url: "#", inStock: true },
  //   ],
  //   lowestPrice: 278.0,
  //   highestPrice: 349.99,
  //   averagePrice: 298.0,
  //   priceHistory: [
  //     { date: "Jan", amazon: 349, bestbuy: 349, walmart: 349, target: 349 },
  //     { date: "Feb", amazon: 329, bestbuy: 349, walmart: 339, target: 349 },
  //     { date: "Mar", amazon: 329, bestbuy: 329, walmart: 329, target: 329 },
  //     { date: "Apr", amazon: 299, bestbuy: 329, walmart: 319, target: 329 },
  //     { date: "May", amazon: 299, bestbuy: 299, walmart: 299, target: 299 },
  //     { date: "Jun", amazon: 278, bestbuy: 299, walmart: 289, target: 299 },
  //   ],
  // }

  const [product, setProduct] = useState(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get("http://localhost:5000/products");
        setProduct(response.data);
        console.log(response.data); 
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
  
    fetchProduct();
  }, []);
  
  
  if (!product) {
    return <p>Loading product details...</p>;
  }

  
  

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.category}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden border rounded-lg aspect-square">
              <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
            </div>
            <div className="flex justify-between">
            <p className="text-2xl font-bold">
          ${product?.lowestPrice ? product.lowestPrice.toFixed(2) : "N/A"} - 
          ${product?.highestPrice ? product.highestPrice.toFixed(2) : "N/A"}
            </p>
              <Button variant="outline" size="icon">
                <Heart className="w-4 h-4" />
                <span className="sr-only">Add to favorites</span>
              </Button>
            </div>
          </div>
          <div className="space-y-6">
            <Tabs defaultValue="prices">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="prices">Price Comparison</TabsTrigger>
                <TabsTrigger value="history">Price History</TabsTrigger>
              </TabsList>
              <TabsContent value="prices" className="space-y-4">
                <div className="border rounded-md">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">Retailer</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">Price</p>
                      <Button variant="ghost" size="icon">
                        <ArrowUpDown className="w-4 h-4" />
                        <span className="sr-only">Sort by price</span>
                      </Button>
                    </div>
                  </div>
                  <div className="divide-y">
                    {product.prices.map((price) => (
                      <div key={price.retailer} className="flex items-center justify-between p-4">
                        <div>
                          <p className="font-medium">{price.retailer}</p>
                          <p className="text-sm text-muted-foreground">{price.inStock ? "In Stock" : "Out of Stock"}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-lg font-bold ${price.price === product.lowestPrice ? "text-emerald-600 dark:text-emerald-400" : ""}`}
                          >
                            ${price.price.toFixed(2)}
                          </p>
                          <Button asChild size="sm">
                            <Link href={price.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="history">
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <PriceHistoryChart data={product.priceHistory} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <div>
              <h3 className="text-lg font-medium">Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Set Price Alert</Button>
        <Button>View Full Details</Button>
      </CardFooter>
    </Card>
  )
}


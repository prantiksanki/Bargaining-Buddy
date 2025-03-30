"use client"

import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { ArrowLeft, Star, ShoppingCart, Heart, Share2, Bell } from "lucide-react"
import { Link } from "react-router-dom"
import Button from "../components/ui/Button"
import ProductComparison from "../components/ProductComparison"
import Tabs from "../../components/ui/tabs"

export default function ProductDetailsPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  // Mock product data - in a real app, this would come from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockProduct = {
        id,
        name:
          id === "1"
            ? "Apple iPhone 15 Pro"
            : id === "2"
              ? "Samsung Galaxy S23"
              : id === "3"
                ? "Sony WH-1000XM4 Headphones"
                : "Product " + id,
        category: "Electronics",
        rating: 4.5,
        reviewCount: 128,
        description:
          "Experience the next generation of technology with this premium device. Featuring cutting-edge performance, stunning display, and innovative features that set new standards in the industry.",
        longDescription:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio.",
        specs: [
          { name: "Dimensions", value: "146.7 x 71.5 x 7.8 mm" },
          { name: "Weight", value: "187g" },
          { name: "Display", value: "6.1 inches, OLED" },
          { name: "Resolution", value: "2532 x 1170 pixels" },
          { name: "Processor", value: "A16 Bionic" },
          { name: "RAM", value: "6GB" },
          { name: "Storage", value: "128GB / 256GB / 512GB" },
          { name: "Battery", value: "3095 mAh" },
        ],
        images: [
          "https://placehold.co/600x600?text=Product+Image+1",
          "https://placehold.co/600x600?text=Product+Image+2",
          "https://placehold.co/600x600?text=Product+Image+3",
          "https://placehold.co/600x600?text=Product+Image+4",
        ],
        price: {
          lowest: id === "1" ? 999 : id === "2" ? 899 : id === "3" ? 349 : 499,
          highest: id === "1" ? 1299 : id === "2" ? 1099 : id === "3" ? 399 : 699,
        },
      }

      setProduct(mockProduct)
      setLoading(false)
    }, 500)
  }, [id])

  if (loading) {
    return (
      <div className="container py-12">
        <div className="space-y-4 animate-pulse">
          <div className="w-1/3 h-8 rounded bg-muted"></div>
          <div className="h-64 rounded bg-muted"></div>
          <div className="w-1/4 h-8 rounded bg-muted"></div>
          <div className="h-32 rounded bg-muted"></div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container py-12">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="mt-4">The product you're looking for doesn't exist or has been removed.</p>
        <Button asChild className="mt-6">
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    )
  }

  return (
    <main className="flex-1">
      <div className="container py-8">
        <Link to="/" className="inline-flex items-center mb-6 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="grid gap-8 mb-12 md:grid-cols-2">
          <div>
            <div className="relative mb-4 overflow-hidden border rounded-lg aspect-square">
              <img
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className={`aspect-square overflow-hidden rounded-md border cursor-pointer ${index === 0 ? "ring-2 ring-primary" : ""}`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} view ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : i < product.rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-muted-foreground">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-lg font-medium">Price Range</p>
              <p className="text-3xl font-bold">
                ${product.price.lowest.toFixed(2)} - ${product.price.highest.toFixed(2)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">Prices from multiple retailers</p>
            </div>

            <div className="mb-6">
              <p className="mb-2 text-lg font-medium">Description</p>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button className="flex-1">
                <ShoppingCart className="w-4 h-4 mr-2" />
                View Best Deals
              </Button>
              <Button variant="outline" className="flex-1">
                <Heart className="w-4 h-4 mr-2" />
                Add to Wishlist
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="mt-6">
              <Button variant="secondary" className="w-full">
                <Bell className="w-4 h-4 mr-2" />
                Set Price Alert
              </Button>
            </div>
          </div>
        </div>

        <Tabs
          tabs={[
            { id: "overview", label: "Overview" },
            { id: "specs", label: "Specifications" },
            { id: "prices", label: "Price Comparison" },
            { id: "reviews", label: "Reviews" },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        >
          {activeTab === "overview" && (
            <div className="py-6">
              <h2 className="mb-4 text-2xl font-bold">Product Overview</h2>
              <p className="mb-4">{product.longDescription}</p>
              <p className="mb-4">{product.longDescription}</p>
              <div className="grid gap-6 mt-8 sm:grid-cols-2">
                <div className="p-6 rounded-lg bg-muted">
                  <h3 className="mb-2 text-lg font-medium">Key Features</h3>
                  <ul className="pl-5 space-y-1 list-disc text-muted-foreground">
                    <li>Premium build quality</li>
                    <li>High-performance processor</li>
                    <li>Advanced camera system</li>
                    <li>All-day battery life</li>
                    <li>Water and dust resistant</li>
                  </ul>
                </div>
                <div className="p-6 rounded-lg bg-muted">
                  <h3 className="mb-2 text-lg font-medium">What's in the Box</h3>
                  <ul className="pl-5 space-y-1 list-disc text-muted-foreground">
                    <li>{product.name}</li>
                    <li>USB-C to USB-C Cable</li>
                    <li>Quick Start Guide</li>
                    <li>Warranty Information</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="py-6">
              <h2 className="mb-4 text-2xl font-bold">Technical Specifications</h2>
              <div className="overflow-hidden border rounded-lg">
                <table className="w-full">
                  <tbody>
                    {product.specs.map((spec, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-muted/50" : ""}>
                        <td className="px-4 py-3 font-medium">{spec.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "prices" && (
            <div className="py-6">
              <h2 className="mb-4 text-2xl font-bold">Price Comparison</h2>
              <ProductComparison />
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="py-6">
              <h2 className="mb-4 text-2xl font-bold">Customer Reviews</h2>
              <div className="flex items-center mb-6">
                <div className="mr-4 text-5xl font-bold">{product.rating}</div>
                <div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : i < product.rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">Based on {product.reviewCount} reviews</p>
                </div>
              </div>

              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="pb-6 border-b">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">John D.</div>
                      <div className="text-sm text-muted-foreground">2 weeks ago</div>
                    </div>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          className={`h-4 w-4 ${j < 4 + (i % 2) ? "fill-primary text-primary" : "text-muted-foreground"}`}
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground">
                      Great product! Exactly what I was looking for. The quality is excellent and it works perfectly.
                      {i === 0 && " I would definitely recommend this to anyone looking for a reliable device."}
                    </p>
                  </div>
                ))}
              </div>

              <Button className="mt-6">Load More Reviews</Button>
            </div>
          )}
        </Tabs>
      </div>
    </main>
  )
}


"use client"
import { Suspense, useState } from "react"
import Link from "next/link"
import { Search } from "lucide-react"

import { Button } from "../components/ui/button"
import SearchDropdown from "../components/SearchDropdown"
import PopularComparisons from "../components/popular-comparisons"
import SearchResults from "../components/search-results"
import { Skeleton } from "../components/ui/skeleton"
import { ThemeToggle } from "../components/theme-toggle"

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center h-14">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="text-primary">BargainBuddy</span>
          </Link>
          <div className="flex items-center justify-end flex-1 space-x-4">
            <nav className="flex items-center space-x-2">
              <Link
                href="/deals"
                className="text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
              >
                Deals
              </Link>
              <Link
                href="/alerts"
                className="text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
              >
                Price Alerts
              </Link>
              <Link
                href="/history"
                className="text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
              >
                History
              </Link>
              
              <ThemeToggle />

              
            </nav>
          </div>
        </div>
      </header>


      
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center max-w-3xl mx-auto space-y-8">
              <div className="space-y-4 text-center">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Find the Best Deals Across the Web
                </h1>
                <div className = "flex flex-col items-center justify-center text-center">
                  
                <p className="max-w-[600px] text-muted-foreground md:text-xl mx-auto ">
                  Compare prices from multiple retailers and save money on your purchases.
                </p>
              </div>
              <div className="w-auto max-w-2xl">
                <div className="flex flex-col gap-4 min-[400px]:flex-row">
                  <div className="relative flex-1 w-full">
                    
                    <SearchDropdown 
                      value={searchTerm}
                      onChange={setSearchTerm}
                    />
                  </div>
                  
                  <Button type="submit" className="min-[400px]:w-auto ">Search</Button>
                </div>
                </div>
                
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-8">
                <Button variant="outline" size="sm">
                  Electronics
                </Button>
                <Button variant="outline" size="sm">
                  Fashion
                </Button>
                <Button variant="outline" size="sm">
                  Home & Kitchen
                </Button>
                <Button variant="outline" size="sm">
                  Beauty
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col gap-4 md:gap-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter">Popular Comparisons</h2>
                <p className="text-muted-foreground">See what other shoppers are comparing right now</p>
              </div>

              {/* whenever PopularComparisons will load dynamically, ProductComparisonSkeleton is display */}
              <Suspense fallback={<ProductComparisonSkeleton />}>
                <PopularComparisons />
              </Suspense>


              
            </div>
          </div>
        </section>




        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col gap-4 md:gap-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter">Recent Searches</h2>
                <p className="text-muted-foreground">Products you've recently viewed</p>
              </div>
              <Suspense fallback={<SearchResultsSkeleton />}>
                <SearchResults searchTerm={searchTerm} />
              </Suspense>
            </div>
          </div>
        </section>
      </main>


      
      <footer className="w-full py-6 border-t">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm leading-loose text-center text-muted-foreground md:text-left">
            © 2023 BargainBuddy. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="/terms"
              className="text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function ProductComparisonSkeleton() {
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

function SearchResultsSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array(4)
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


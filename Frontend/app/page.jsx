import { Suspense } from "react"
import Link from "next/link"
import { Search } from "lucide-react"

import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import ProductComparison from "../components/product-comparison"
import SearchResults from "../components/search-results"
import { Skeleton } from "../components/ui/skeleton"
import { ThemeToggle } from "../components/theme-toggle"

export default function HomePage() {
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
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Find the Best Deals Across the Web
                  </h1>

                  
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Compare prices from multiple retailers and save money on your purchases.
                  </p>

                  
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    
                     
                    <Input
                      type="search"
                      placeholder="Search for products..."
                      className="w-full pl-8 border rounded-md bg-background"
                    />

                    
                  </div>
                  <Button type="submit">Search</Button>
                </div>

                
                <div className="flex flex-wrap gap-2">
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
          </div>
        </section>

        

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col gap-4 md:gap-8">


                
                {/* POPULAR COMPARISON */}
              
              <div>
                <h2 className="text-3xl font-bold tracking-tighter">Popular Comparisons</h2>
                <p className="text-muted-foreground">See what other shoppers are comparing right now</p>
              </div>

              
              <Suspense fallback={<ProductComparisonSkeleton />}>
                <ProductComparison />
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
                <SearchResults />
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
        .fill(0)
        .map((_, i) => (
          <div key={i} className="border rounded-lg shadow-sm bg-card text-card-foreground">
            <div className="p-6 space-y-4">
              <Skeleton className="w-1/2 h-4" />
              <Skeleton className="w-full h-20" />
              <div className="space-y-2">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-2/3 h-4" />
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}

function SearchResultsSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="border rounded-lg shadow-sm bg-card text-card-foreground">
            <div className="p-6 space-y-4">
              <Skeleton className="w-1/2 h-4" />
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-2/3 h-4" />
            </div>
          </div>
        ))}
    </div>
  )
}


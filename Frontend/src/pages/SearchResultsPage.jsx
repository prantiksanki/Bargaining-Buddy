// "use client"

// import { useEffect, useState } from "react"
// import { useSearchParams, Link } from "react-router-dom"
// import { Search, Filter, SlidersHorizontal } from "lucide-react"
// import Button from "../components/ui/Button"
// import Input from "../components/ui/Input"
// import Card from "../components/ui/Card"
// import Badge from "../components/ui/Badge"
// import Skeleton from "../components/ui/Skeleton"

// export default function SearchResultsPage() {
//   const [searchParams, setSearchParams] = useSearchParams()
//   const query = searchParams.get("q") || ""
//   const [searchTerm, setSearchTerm] = useState(query)
//   const [results, setResults] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [sortBy, setSortBy] = useState("relevance")
//   const [filterOpen, setFilterOpen] = useState(false)

//   // Mock product data - in a real app, this would come from an API
//   const mockProducts = [
//     {
//       id: "1",
//       name: "Apple iPhone 15 Pro",
//       image: "https://placehold.co/200x200",
//       category: "Electronics",
//       lowestPrice: 999.0,
//       highestPrice: 1299.0,
//       savings: 200.0,
//       retailers: 6,
//       rating: 4.8,
//       reviewCount: 245,
//     },
//     {
//       id: "2",
//       name: "Samsung Galaxy S23",
//       image: "https://placehold.co/200x200",
//       category: "Electronics",
//       lowestPrice: 899.0,
//       highestPrice: 1099.0,
//       savings: 150.0,
//       retailers: 5,
//       rating: 4.6,
//       reviewCount: 189,
//     },
//     {
//       id: "3",
//       name: "Sony WH-1000XM4 Headphones",
//       image: "https://placehold.co/200x200",
//       category: "Audio",
//       lowestPrice: 349.0,
//       highestPrice: 399.0,
//       savings: 50.0,
//       retailers: 8,
//       rating: 4.9,
//       reviewCount: 312,
//     },
//     {
//       id: "4",
//       name: "LG C2 OLED TV 55-inch",
//       image: "https://placehold.co/200x200",
//       category: "TVs",
//       lowestPrice: 1299.0,
//       highestPrice: 1599.0,
//       savings: 300.0,
//       retailers: 4,
//       rating: 4.7,
//       reviewCount: 156,
//     },
//     {
//       id: "5",
//       name: "Dyson V12 Vacuum",
//       image: "https://placehold.co/200x200",
//       category: "Home",
//       lowestPrice: 499.99,
//       highestPrice: 599.99,
//       savings: 100.0,
//       retailers: 4,
//       rating: 4.5,
//       reviewCount: 98,
//     },
//     {
//       id: "6",
//       name: "Nike Air Max 270",
//       image: "https://placehold.co/200x200",
//       category: "Fashion",
//       lowestPrice: 129.99,
//       highestPrice: 179.99,
//       savings: 50.0,
//       retailers: 8,
//       rating: 4.4,
//       reviewCount: 276,
//     },
//     {
//       id: "7",
//       name: "PlayStation 5 Digital Edition",
//       image: "https://placehold.co/200x200",
//       category: "Gaming",
//       lowestPrice: 399.99,
//       highestPrice: 499.99,
//       savings: 100.0,
//       retailers: 3,
//       rating: 4.8,
//       reviewCount: 423,
//     },
//     {
//       id: "8",
//       name: "MacBook Pro M2 13-inch",
//       image: "https://placehold.co/200x200",
//       category: "Computers",
//       lowestPrice: 1299.0,
//       highestPrice: 1499.0,
//       savings: 200.0,
//       retailers: 5,
//       rating: 4.7,
//       reviewCount: 187,
//     },
//   ]

//   // Filter products based on search query
//   useEffect(() => {
//     setLoading(true)

//     // Simulate API call delay
//     setTimeout(() => {
//       if (!query) {
//         setResults([])
//         setLoading(false)
//         return
//       }

//       const filtered = mockProducts.filter(
//         (product) =>
//           product.name.toLowerCase().includes(query.toLowerCase()) ||
//           product.category.toLowerCase().includes(query.toLowerCase()),
//       )

//       // Sort results
//       const sorted = [...filtered]
//       if (sortBy === "price-low") {
//         sorted.sort((a, b) => a.lowestPrice - b.lowestPrice)
//       } else if (sortBy === "price-high") {
//         sorted.sort((a, b) => b.lowestPrice - a.lowestPrice)
//       } else if (sortBy === "rating") {
//         sorted.sort((a, b) => b.rating - a.rating)
//       }

//       setResults(sorted)
//       setLoading(false)
//     }, 500)
//   }, [query, sortBy])

//   const handleSearch = (e) => {
//     e.preventDefault()
//     if (searchTerm.trim()) {
//       setSearchParams({ q: searchTerm })
//     }
//   }

//   return (
//     <main className="container flex-1 py-8">
//       <div className="mb-8">
//         <h1 className="mb-4 text-3xl font-bold">Search Results</h1>
//         <form onSubmit={handleSearch} className="flex gap-2">
//           <div className="relative flex-1">
//             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//             <Input
//               type="search"
//               placeholder="Search for products..."
//               className="w-full pl-8 border rounded-md bg-background"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <Button type="submit">Search</Button>
//         </form>
//       </div>

//       {query && (
//         <div className="mb-6">
//           <p className="text-muted-foreground">
//             {loading ? "Searching..." : `Showing ${results.length} results for "${query}"`}
//           </p>
//         </div>
//       )}

//       <div className="flex flex-col gap-8 md:flex-row">
//         <div className="md:w-64 shrink-0">
//           <div className="sticky top-20">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-lg font-medium">Filters</h2>
//               <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setFilterOpen(!filterOpen)}>
//                 <SlidersHorizontal className="w-4 h-4 mr-2" />
//                 {filterOpen ? "Hide" : "Show"}
//               </Button>
//             </div>

//             <div className={`space-y-6 ${filterOpen ? "block" : "hidden md:block"}`}>
//               <div>
//                 <h3 className="mb-2 font-medium">Categories</h3>
//                 <div className="space-y-1">
//                   {["Electronics", "Audio", "TVs", "Home", "Fashion", "Gaming", "Computers"].map((category) => (
//                     <div key={category} className="flex items-center">
//                       <input
//                         type="checkbox"
//                         id={`category-${category}`}
//                         className="w-4 h-4 border-gray-300 rounded text-primary focus:ring-primary"
//                       />
//                       <label htmlFor={`category-${category}`} className="ml-2 text-sm">
//                         {category}
//                       </label>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div>
//                 <h3 className="mb-2 font-medium">Price Range</h3>
//                 <div className="grid grid-cols-2 gap-2">
//                   <Input type="number" placeholder="Min" className="text-sm" />
//                   <Input type="number" placeholder="Max" className="text-sm" />
//                 </div>
//                 <Button variant="outline" size="sm" className="w-full mt-2">
//                   Apply
//                 </Button>
//               </div>

//               <div>
//                 <h3 className="mb-2 font-medium">Rating</h3>
//                 <div className="space-y-1">
//                   {[4, 3, 2, 1].map((rating) => (
//                     <div key={rating} className="flex items-center">
//                       <input
//                         type="checkbox"
//                         id={`rating-${rating}`}
//                         className="w-4 h-4 border-gray-300 rounded text-primary focus:ring-primary"
//                       />
//                       <label htmlFor={`rating-${rating}`} className="ml-2 text-sm">
//                         {rating}+ Stars
//                       </label>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <Button className="w-full">Apply Filters</Button>
//             </div>
//           </div>
//         </div>

//         <div className="flex-1">
//           <div className="flex items-center justify-between mb-4">
//             <div className="text-sm text-muted-foreground">
//               {!loading && results.length > 0 && `${results.length} products`}
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="text-sm">Sort by:</span>
//               <select
//                 className="p-1 text-sm border rounded-md bg-background"
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//               >
//                 <option value="relevance">Relevance</option>
//                 <option value="price-low">Price: Low to High</option>
//                 <option value="price-high">Price: High to Low</option>
//                 <option value="rating">Rating</option>
//               </select>
//             </div>
//           </div>

//           {loading ? (
//             <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//               {[1, 2, 3, 4, 5, 6].map((_, i) => (
//                 <Card key={i} className="overflow-hidden">
//                   <Skeleton className="w-full aspect-square" />
//                   <div className="p-4">
//                     <Skeleton className="w-3/4 h-6 mb-2" />
//                     <Skeleton className="w-1/2 h-4 mb-4" />
//                     <Skeleton className="w-full h-5 mb-2" />
//                     <Skeleton className="w-full h-10" />
//                   </div>
//                 </Card>
//               ))}
//             </div>
//           ) : results.length > 0 ? (
//             <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//               {results.map((product) => (
//                 <Card key={product.id} className="overflow-hidden">
//                   <div className="relative aspect-square">
//                     <img
//                       src={product.image || "/placeholder.svg"}
//                       alt={product.name}
//                       className="object-cover w-full h-full transition-transform hover:scale-105"
//                     />
//                   </div>
//                   <div className="p-4 border-b">
//                     <div className="flex items-start justify-between">
//                       <h3 className="text-base font-bold line-clamp-2">{product.name}</h3>
//                       <Badge variant="outline" className="ml-2 shrink-0">
//                         {product.category}
//                       </Badge>
//                     </div>
//                     <div className="flex items-center mt-1">
//                       <div className="flex">
//                         {[...Array(5)].map((_, i) => (
//                           <svg
//                             key={i}
//                             className={`w-3 h-3 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
//                             fill="currentColor"
//                             viewBox="0 0 20 20"
//                           >
//                             <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                           </svg>
//                         ))}
//                       </div>
//                       <span className="ml-1 text-xs text-muted-foreground">({product.reviewCount})</span>
//                     </div>
//                   </div>
//                   <div className="p-4">
//                     <div className="flex items-baseline justify-between">
//                       <div>
//                         <p className="text-sm text-muted-foreground">Lowest price</p>
//                         <p className="text-xl font-bold">${product.lowestPrice.toFixed(2)}</p>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-sm text-muted-foreground">Potential savings</p>
//                         <p className="text-lg font-medium text-emerald-600 dark:text-emerald-400">
//                           Up to ${product.savings.toFixed(2)}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="p-4 pt-0">
//                     <Button asChild className="w-full">
//                       <Link to={`/product/${product.id}`}>Compare Prices</Link>
//                     </Button>
//                   </div>
//                 </Card>
//               ))}
//             </div>
//           ) : query ? (
//             <div className="py-12 text-center">
//               <div className="mb-4 text-4xl">🔍</div>
//               <h3 className="mb-2 text-xl font-medium">No results found</h3>
//               <p className="mb-6 text-muted-foreground">We couldn't find any products matching "{query}"</p>
//               <div className="flex justify-center gap-4">
//                 <Button variant="outline" asChild>
//                   <Link to="/">Browse Popular Products</Link>
//                 </Button>
//                 <Button>
//                   <Filter className="w-4 h-4 mr-2" />
//                   Adjust Filters
//                 </Button>
//               </div>
//             </div>
//           ) : (
//             <div className="py-12 text-center">
//               <div className="mb-4 text-4xl">🔍</div>
//               <h3 className="mb-2 text-xl font-medium">Start searching</h3>
//               <p className="text-muted-foreground">Enter a search term to find products</p>
//             </div>
//           )}

//           {!loading && results.length > 0 && (
//             <div className="flex justify-center mt-8">
//               <Button variant="outline">Load More Results</Button>
//             </div>
//           )}
//         </div>
//       </div>
//     </main>
//   )
// }


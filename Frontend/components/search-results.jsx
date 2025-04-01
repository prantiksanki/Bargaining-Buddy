//Purpose: Displays search results and handles product data fetching

"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export default function SearchResults({ searchTerm }) {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log("Fetching products with search:", searchTerm);
        
        // If there's a search term, use the search endpoint
        const url = searchTerm 
          ? `http://localhost:5000/products?search=${encodeURIComponent(searchTerm)}`
          : "http://localhost:5000/products";
          
        const response = await axios.get(url);

        
        console.log("Fetched products:", response.data);
        
        // Check if response.data is an array
        if (Array.isArray(response.data)) {
          setResults(response.data);
        } else {
          console.error("Response data is not an array:", response.data);
          setError("Invalid response format");
          setResults([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error.message || "Failed to fetch products");
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [searchTerm]); // Add searchTerm as a dependency

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>No products found</div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {results.map((result, index) => {
        console.log("Rendering product:", result);
        // Use a combination of index and name as fallback if _id is not available
        const uniqueKey = result._id || `${result.name}-${index}`;
        return (
          <Link href={`/products?search=${encodeURIComponent(result.name)}`} key={uniqueKey}>
            <Card className="overflow-hidden transition-shadow hover:shadow-lg">
              
              <div className="relative aspect-square">
                <Image
                  src={result.image || "/placeholder.svg"}
                  alt={`${result.name} - ${result.category} product image`}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                  priority
                />
          
          
              </div>
              <div className="p-4 border-b">
                <div className="flex items-start justify-between">
                  <h3 className="text-base font-bold line-clamp-2">{result.name}</h3>
                  <Badge variant="outline" className="ml-2 shrink-0">
                    {result.category}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {result.description}
                </p>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold">
                    ${result.lowestPrice?.toFixed(2) || "N/A"}
                  </p>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

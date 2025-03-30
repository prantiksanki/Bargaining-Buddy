"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";

export default function SearchResults() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get("http://localhost:5000/search");
        setResults(response.data || []); // Ensure results is always an array
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, []);

  if (!results.length) {
    return <p>Loading product details...</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {results.map((result) => (
        result.id ? ( // Ensure result.id exists before rendering the Link
          <Card key={result.id} className="overflow-hidden">
            <div className="relative aspect-square">
              <img
                src={result.image || "/placeholder.svg"}
                alt={result.name}
                className="object-cover w-full h-full transition-transform hover:scale-105"
              />
            </div>
            <div className="p-4 border-b">
              <div className="flex items-start justify-between">
                <h3 className="text-base font-bold line-clamp-2">{result.name}</h3>
                <Badge variant="outline" className="ml-2 shrink-0">
                  {result.category}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Compare prices from {result.retailers} retailers</p>
            </div>
            <div className="p-4">
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
            </div>
            <div className="p-4 pt-0">
              <Button asChild className="w-full">
                <Link href={`/product/${result.id}`}>Compare Prices</Link>
              </Button>
            </div>
          </Card>
        ) : null // Skip rendering if result.id is undefined
      ))}
    </div>
  );
}

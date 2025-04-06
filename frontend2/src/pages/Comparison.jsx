import React from 'react'
import { useLocation } from 'react-router-dom'
import ProductDetails from '../components/ProductDetails'

export default function Comparison() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('search');

  return (
    <div className="min-h-screen bg-gray-900">
      <ProductDetails searchQuery={query} />
    </div>
  )
}

import React from 'react'
import { useLocation } from 'react-router-dom'
import {ProductDetails,NavBar} from '../components'

export default function Comparison() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('search');

  return (
    <div>
    <NavBar/>
    <div className="min-h-screen bg-gray-900">
      <ProductDetails searchQuery={query} />
    </div>
    </div>
  )
}

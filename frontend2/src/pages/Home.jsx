import React from 'react'
import {NavBar} from '../components'
import {HeroSection} from '../components'
import {PopularComparisons} from '../components'
import {RecentSearches} from '../components'
import {Footer} from '../components'
export default function Home() {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
  
        <div className="flex-1">
        <HeroSection />
          <PopularComparisons />
          <RecentSearches />
        </div>
  
        <Footer />
      </div>
    );
  }
  
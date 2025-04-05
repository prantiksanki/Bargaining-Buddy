import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
// import Home from './pages/Home.jsx'
import Comparison from './pages/Comparison.jsx'
import Home from './pages/Home.jsx'

function App() {

  return (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/comparison" element={<Comparison />} />
            
          </Routes>

  )
}

export default App

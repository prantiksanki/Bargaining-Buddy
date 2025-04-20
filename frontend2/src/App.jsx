import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Comparison from './pages/Comparison.jsx'
import Signup from './pages/Signup.jsx'
import SearchResult from './pages/searchResult.jsx' // fixed

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/comparison" element={<Comparison />} />
        <Route path="/auth" element={<Signup />} />
        <Route path="/result/:name" element={<SearchResult />} />
      </Routes>
    </Router>
  )
}

export default App

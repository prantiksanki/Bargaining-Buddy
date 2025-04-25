import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Comparison from './pages/Comparison.jsx'
import Signup from './pages/Signup.jsx'
import SearchResult from './pages/searchResult.jsx' // fixed
import Profile from './pages/profile.jsx' // fixed

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/comparison" element={<Comparison />} />
        <Route path="/" element={<Signup />} />
        <Route path="/result/:name" element={<SearchResult />} />
        <Route path="/profile" element={<Profile />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  )
}

export default App

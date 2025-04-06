// App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Comparison from './pages/Comparison.jsx'
import Signup from './pages/Signup.jsx'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/comparison" element={<Comparison />} />
        <Route path="/auth" element={<Signup />} />
      </Routes>
    </Router>
  )
}

export default App

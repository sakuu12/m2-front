import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Timeline from './pages/Timeline'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Timeline />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}

export default App
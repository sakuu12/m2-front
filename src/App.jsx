import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Timeline from './pages/Timeline'
import PrivateRoute from './PrivateRoute'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Timeline />
          </PrivateRoute>
        }
      />
    </Routes>
  )
}

export default App
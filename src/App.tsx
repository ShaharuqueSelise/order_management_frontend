import { useState } from 'react'
import './App.css'
import { AuthProvider } from './contexts/AuthContext'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import Products from './pages/Products'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/products" element={<Products />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </div>
  )
}

export default App

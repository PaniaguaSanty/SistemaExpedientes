import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Camera } from 'lucide-react'

const CORRECT_PASSWORD = 'password123'

export default function Login() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [profileImage, setProfileImage] = useState('/placeholder.svg?height=100&width=100')
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === CORRECT_PASSWORD) {
      localStorage.setItem('isAuthenticated', 'true')
      navigate('/dashboard')
    } else {
      setError('Contraseña incorrecta')
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 relative">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-8 bg-white rounded-lg shadow-md w-96 z-10"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h1>
        <div className="mb-6 flex flex-col items-center">
          <div className="relative w-24 h-24 mb-4 bg-teal-500 rounded-full">
            <img
              src={profileImage}
              className="w-full h-full object-cover rounded-full"
            />
            <label htmlFor="profileImage" className="absolute bottom-0 right-0 bg-blue-800 rounded-full p-2 cursor-pointer">
              <Camera className="text-white" size={18} />
              <input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-lg font-medium">Usuario</p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm mb-4"
            >
              {error}
            </motion.p>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Iniciar Sesión
          </motion.button>
        </form>
      </motion.div>
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-cover bg-center" style={{ backgroundImage: 'url(C:/Users/pania/OneDrive/Imágenes/Capturas de pantalla/MisionesMembrete.png)' }}></div>
    </div>
  )
}

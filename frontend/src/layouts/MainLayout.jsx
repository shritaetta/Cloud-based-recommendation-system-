import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <footer className="text-center text-xs text-gray-600 py-4 border-t border-gray-800">
        DSCC Cloud Project — Internship Recommendation System · Microservices Architecture
      </footer>
    </div>
  )
}

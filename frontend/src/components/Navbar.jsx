import { Link, useNavigate, useLocation } from 'react-router-dom'
import { isLoggedIn, removeToken } from '../utils/auth'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const loggedIn = isLoggedIn()

  const handleLogout = () => {
    removeToken()
    navigate('/login')
  }

  const linkClass = (path) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      location.pathname === path
        ? 'bg-blue-700 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`

  return (
    <nav className="bg-gray-900 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <span className="text-blue-400 text-lg font-bold">⚡</span>
            <Link to="/" className="text-white font-semibold text-sm tracking-wide">
              Internship Recommender
            </Link>
          </div>
          <div className="flex items-center gap-1">
            <Link to="/" className={linkClass('/')}>Dashboard</Link>
            <Link to="/internships" className={linkClass('/internships')}>Internships</Link>
            {loggedIn && (
              <>
                <Link to="/resume" className={linkClass('/resume')}>Resume</Link>
                <Link to="/recommendations" className={linkClass('/recommendations')}>Recommendations</Link>
              </>
            )}
            {loggedIn ? (
              <button
                onClick={handleLogout}
                className="ml-3 px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:bg-red-900/40 hover:text-red-300 transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className="ml-3 px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

import { useEffect, useState } from 'react'
import { getGatewayHealth } from '../services/api'
import { isLoggedIn } from '../utils/auth'
import { Link } from 'react-router-dom'

const services = [
  { name: 'API Gateway', port: '8000', color: 'blue',   icon: '🌐', desc: 'Routes all client requests to downstream microservices. JWT validation layer.' },
  { name: 'User Service', port: '8001', color: 'green',  icon: '👤', desc: 'Handles registration, login, and JWT token issuance using bcrypt + python-jose.' },
  { name: 'Resume Service',port: '8002', color: 'purple', icon: '📄', desc: 'Parses PDF resumes via PyMuPDF. Extracts skills with spaCy NLP + keyword matching.' },
  { name: 'Internship Svc',port: '8003', color: 'orange', icon: '💼', desc: 'Hosts 277+ internship records from Excel. Serves skill-based recommendations.' },
  { name: 'PostgreSQL',     port: '5432', color: 'teal',   icon: '🗄️', desc: 'Isolated databases per service: user_db, resume_db, recommendation_db.' },
]

const techBadges = ['FastAPI', 'React + Vite', 'PostgreSQL', 'Docker Compose', 'JWT Auth', 'spaCy NLP', 'PyMuPDF', 'Async SQLAlchemy', 'Tailwind CSS', 'Axios']

const colorMap = {
  blue:   'border-blue-500/40 bg-blue-900/10',
  green:  'border-green-500/40 bg-green-900/10',
  purple: 'border-purple-500/40 bg-purple-900/10',
  orange: 'border-orange-500/40 bg-orange-900/10',
  teal:   'border-teal-500/40 bg-teal-900/10',
}
const iconBg = {
  blue:   'bg-blue-500/20 text-blue-400',
  green:  'bg-green-500/20 text-green-400',
  purple: 'bg-purple-500/20 text-purple-400',
  orange: 'bg-orange-500/20 text-orange-400',
  teal:   'bg-teal-500/20 text-teal-400',
}

export default function Dashboard() {
  const [gatewayUp, setGatewayUp] = useState(null)
  const loggedIn = isLoggedIn()

  useEffect(() => {
    getGatewayHealth()
      .then(() => setGatewayUp(true))
      .catch(() => setGatewayUp(false))
  }, [])

  return (
    <div className="space-y-10">

      {/* Hero */}
      <div className="text-center space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-medium mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
          DSCC Cloud Computing Project
        </div>
        <h1 className="text-4xl font-bold text-white">Internship Recommendation System</h1>
        <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
          A cloud-native, microservices-based platform that parses resumes, extracts skills using NLP,
          and matches students with relevant internships through a skill-overlap recommendation engine.
        </p>

        {/* Gateway status */}
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium ${
          gatewayUp === null  ? 'border-gray-600 text-gray-400' :
          gatewayUp           ? 'border-green-500/40 bg-green-500/10 text-green-400' :
                                'border-red-500/40 bg-red-500/10 text-red-400'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${gatewayUp ? 'bg-green-400 animate-pulse' : gatewayUp === false ? 'bg-red-400' : 'bg-gray-500'}`}></span>
          {gatewayUp === null ? 'Checking gateway…' : gatewayUp ? 'API Gateway reachable' : 'API Gateway offline'}
        </div>

        {/* CTA buttons */}
        <div className="flex justify-center gap-3 pt-2">
          {!loggedIn ? (
            <>
              <Link to="/register" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">Get Started</Link>
              <Link to="/login"    className="px-5 py-2 border border-gray-600 hover:border-gray-500 text-gray-300 rounded-lg text-sm font-medium transition-colors">Login</Link>
            </>
          ) : (
            <>
              <Link to="/resume"          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">Upload Resume</Link>
              <Link to="/recommendations" className="px-5 py-2 border border-gray-600 hover:border-gray-500 text-gray-300 rounded-lg text-sm font-medium transition-colors">Get Recommendations</Link>
            </>
          )}
        </div>
      </div>

      {/* Architecture Flow */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-5">System Architecture Flow</h2>
        <div className="flex items-center justify-center gap-2 flex-wrap text-sm">
          {['Client Browser', 'API Gateway :8000', 'User Service :8001', 'Resume Service :8002', 'Internship Service :8003', 'PostgreSQL :5432'].map((node, i, arr) => (
            <div key={node} className="flex items-center gap-2">
              <div className={`px-3 py-1.5 rounded-lg border text-xs font-mono ${
                i === 0 ? 'bg-gray-800 border-gray-600 text-gray-300' :
                i === 1 ? 'bg-blue-900/30 border-blue-500/40 text-blue-300' :
                i === arr.length - 1 ? 'bg-teal-900/30 border-teal-500/40 text-teal-300' :
                'bg-gray-800/50 border-gray-700 text-gray-300'
              }`}>{node}</div>
              {i < arr.length - 1 && <span className="text-gray-600">→</span>}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-600 text-center mt-4">All requests route through the API Gateway which validates JWT tokens before forwarding</p>
      </div>

      {/* Service cards */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Microservices</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((svc) => (
            <div key={svc.name} className={`rounded-xl border p-5 space-y-3 ${colorMap[svc.color]}`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-base ${iconBg[svc.color]}`}>
                  {svc.icon}
                </div>
                <div>
                  <div className="text-white font-medium text-sm">{svc.name}</div>
                  <div className="text-gray-500 text-xs font-mono">:{svc.port}</div>
                </div>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">{svc.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Workflow */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-5">Recommendation Workflow</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
          {[
            { step: '1', title: 'Register / Login', desc: 'Authenticate via User Service. JWT token issued.', icon: '🔐' },
            { step: '2', title: 'Upload Resume',     desc: 'PDF parsed by PyMuPDF. Skills extracted by spaCy.', icon: '📤' },
            { step: '3', title: 'Match Skills',      desc: 'Skills compared against 277+ internship skill tags.', icon: '🧠' },
            { step: '4', title: 'View Matches',      desc: 'Internships ranked by match % with gap analysis.', icon: '🎯' },
          ].map((s) => (
            <div key={s.step} className="space-y-2">
              <div className="w-10 h-10 mx-auto rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-xl">{s.icon}</div>
              <div className="text-blue-400 text-xs font-bold">STEP {s.step}</div>
              <div className="text-white text-sm font-medium">{s.title}</div>
              <p className="text-gray-500 text-xs leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech stack */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Technology Stack</h2>
        <div className="flex flex-wrap gap-2">
          {techBadges.map((t) => (
            <span key={t} className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-xs text-gray-300">{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

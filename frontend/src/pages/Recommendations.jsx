import { useState } from 'react'
import { getRecommendations } from '../services/api'

export default function Recommendations() {
  const [skills, setSkills] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const skillList = skills.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
    if (!skillList.length) return
    setLoading(true)
    setError('')
    try {
      const res = await getRecommendations({ user_skills: skillList })
      setResults(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch recommendations.')
    } finally {
      setLoading(false)
    }
  }

  const scoreColor = (pct) => {
    if (pct >= 70) return 'text-green-400 bg-green-500/10 border-green-500/30'
    if (pct >= 40) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
    return 'text-red-400 bg-red-500/10 border-red-500/30'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Internship Recommendations</h1>
        <p className="text-gray-400 text-sm mt-1">
          Enter your skills to get ranked internship matches based on skill overlap.
        </p>
      </div>

      {/* Input form */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Your Skills <span className="text-gray-600">(comma-separated)</span></label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="python, docker, sql, machine learning, fastapi"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['python, sql, docker', 'java, spring boot, sql', 'react, javascript, html', 'machine learning, python, nlp'].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setSkills(preset)}
                className="px-2.5 py-1 bg-gray-800 border border-gray-700 rounded-full text-xs text-gray-400 hover:text-gray-200 hover:border-gray-600 transition-colors"
              >
                {preset}
              </button>
            ))}
          </div>
          {error && (
            <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-3 text-red-400 text-sm">{error}</div>
          )}
          <button
            type="submit"
            disabled={loading || !skills.trim()}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {loading ? 'Matching…' : 'Get Recommendations'}
          </button>
        </form>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Top Matches ({results.length})
            </h2>
            <span className="text-xs text-gray-600">Sorted by match percentage</span>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-12 text-gray-600">No matching internships found.</div>
          ) : (
            <div className="grid gap-4">
              {results.map((rec, i) => (
                <div key={rec.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs text-gray-400 font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-sm capitalize">{rec.title}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-gray-500 text-xs capitalize">{rec.domain}</span>
                          {rec.location && (
                            <>
                              <span className="text-gray-700">·</span>
                              <span className="text-gray-500 text-xs capitalize">📍 {rec.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full border text-xs font-bold shrink-0 ${scoreColor(rec.match_percentage)}`}>
                      {rec.match_percentage.toFixed(0)}% match
                    </div>
                  </div>

                  {/* Match bar */}
                  <div className="w-full bg-gray-800 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        rec.match_percentage >= 70 ? 'bg-green-500' :
                        rec.match_percentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(rec.match_percentage, 100)}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Matched */}
                    <div className="space-y-1.5">
                      <span className="text-xs font-medium text-green-400">✓ Matched ({rec.matched_skills.length})</span>
                      <div className="flex flex-wrap gap-1">
                        {rec.matched_skills.length > 0 ? rec.matched_skills.map((s) => (
                          <span key={s} className="px-2 py-0.5 bg-green-900/20 border border-green-500/20 rounded text-xs text-green-300">{s}</span>
                        )) : <span className="text-xs text-gray-600">—</span>}
                      </div>
                    </div>
                    {/* Missing */}
                    <div className="space-y-1.5">
                      <span className="text-xs font-medium text-red-400">✗ Missing ({rec.missing_skills.length})</span>
                      <div className="flex flex-wrap gap-1">
                        {rec.missing_skills.length > 0 ? rec.missing_skills.slice(0, 5).map((s) => (
                          <span key={s} className="px-2 py-0.5 bg-red-900/20 border border-red-500/20 rounded text-xs text-red-300">{s}</span>
                        )) : <span className="text-xs text-gray-600">—</span>}
                        {rec.missing_skills.length > 5 && (
                          <span className="text-xs text-gray-600">+{rec.missing_skills.length - 5} more</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

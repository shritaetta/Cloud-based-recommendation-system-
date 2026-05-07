import { useState, useEffect, useCallback } from 'react'
import { getInternships } from '../services/api'

export default function Internships() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({ domain: '', location: '', skill_tags: '', duration: '' })
  const PAGE_SIZE = 12

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, page_size: PAGE_SIZE }
      if (filters.domain)    params.domain    = filters.domain
      if (filters.location)  params.location  = filters.location
      if (filters.skill_tags) params.skill_tags = filters.skill_tags
      if (filters.duration)  params.duration  = filters.duration
      const res = await getInternships(params)
      setData(res.data)
    } catch { /* silent */ }
    finally { setLoading(false) }
  }, [page, filters])

  useEffect(() => { fetchData() }, [fetchData])

  const handleFilter = (e) => {
    e.preventDefault()
    setPage(1)
    fetchData()
  }

  const totalPages = data ? Math.ceil(data.total_count / PAGE_SIZE) : 1

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Browse Internships</h1>
        <p className="text-gray-400 text-sm mt-1">
          {data ? `${data.total_count} internships available` : 'Loading…'}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <form onSubmit={handleFilter} className="flex flex-wrap gap-3 items-end">
          {[
            { key: 'domain',    placeholder: 'Domain (e.g. software)' },
            { key: 'location',  placeholder: 'Location (e.g. bangalore)' },
            { key: 'skill_tags',placeholder: 'Skill (e.g. python)' },
            { key: 'duration',  placeholder: 'Duration (e.g. 3 months)' },
          ].map(({ key, placeholder }) => (
            <input
              key={key}
              type="text"
              placeholder={placeholder}
              value={filters[key]}
              onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
              className="flex-1 min-w-40 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500 transition-colors"
            />
          ))}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
          >
            Filter
          </button>
          <button
            type="button"
            onClick={() => { setFilters({ domain: '', location: '', skill_tags: '', duration: '' }); setPage(1) }}
            className="px-4 py-2 border border-gray-700 text-gray-400 hover:text-gray-200 rounded-lg text-xs font-medium transition-colors"
          >
            Clear
          </button>
        </form>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3 animate-pulse">
              <div className="h-4 bg-gray-800 rounded w-3/4"></div>
              <div className="h-3 bg-gray-800 rounded w-1/2"></div>
              <div className="h-3 bg-gray-800 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : data?.data?.length === 0 ? (
        <div className="text-center py-16 text-gray-600">No internships match your filters.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.data?.map((item) => (
            <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3 hover:border-gray-700 transition-colors">
              <div>
                <h3 className="text-white font-semibold text-sm capitalize leading-tight">{item.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 bg-blue-900/30 border border-blue-500/30 rounded text-xs text-blue-300 capitalize">{item.domain}</span>
                  {item.location && (
                    <span className="text-gray-500 text-xs capitalize">📍 {item.location}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {item.stipend && (
                  <div className="text-gray-500">💰 <span className="text-gray-300 capitalize">{item.stipend}</span></div>
                )}
                {item.duration && (
                  <div className="text-gray-500">⏱ <span className="text-gray-300 capitalize">{item.duration}</span></div>
                )}
                {item.eligibility && (
                  <div className="text-gray-500 col-span-2">🎓 <span className="text-gray-300 capitalize">{item.eligibility}</span></div>
                )}
              </div>

              {item.skill_tags?.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1 border-t border-gray-800">
                  {item.skill_tags.slice(0, 4).map((s) => (
                    <span key={s} className="px-1.5 py-0.5 bg-gray-800 rounded text-xs text-gray-400">{s}</span>
                  ))}
                  {item.skill_tags.length > 4 && (
                    <span className="text-xs text-gray-600">+{item.skill_tags.length - 4}</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 border border-gray-700 rounded-lg text-xs text-gray-400 disabled:opacity-40 hover:border-gray-600 transition-colors"
          >
            ← Previous
          </button>
          <span className="text-xs text-gray-500">Page {page} of {totalPages} · {data.total_count} total</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 border border-gray-700 rounded-lg text-xs text-gray-400 disabled:opacity-40 hover:border-gray-600 transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}

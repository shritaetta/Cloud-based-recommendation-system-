import { useState } from 'react'
import { uploadResume } from '../services/api'
import { getPayload } from '../utils/auth'
import { Link } from 'react-router-dom'

export default function Resume() {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) return
    setError('')
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await uploadResume(fd)
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed. Make sure the file is a valid PDF under 5MB.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Resume Upload</h1>
        <p className="text-gray-400 text-sm mt-1">
          Upload your PDF resume. The Resume Service will extract your skills and education keywords using NLP.
        </p>
      </div>

      {/* Upload form */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Upload PDF Resume</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
              file ? 'border-blue-500/60 bg-blue-500/5' : 'border-gray-700 hover:border-gray-600'
            }`}
            onClick={() => document.getElementById('fileInput').click()}
          >
            <input
              id="fileInput"
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <div className="text-3xl mb-2">📄</div>
            {file ? (
              <div>
                <p className="text-blue-400 font-medium text-sm">{file.name}</p>
                <p className="text-gray-500 text-xs mt-1">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            ) : (
              <div>
                <p className="text-gray-400 text-sm">Click to select PDF resume</p>
                <p className="text-gray-600 text-xs mt-1">Max file size: 5MB</p>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-3 text-red-400 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={!file || loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {loading ? 'Parsing resume…' : 'Upload & Parse'}
          </button>
        </form>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <div className="bg-gray-900 border border-green-500/30 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
              <h2 className="text-sm font-semibold text-green-400 uppercase tracking-wider">Parse Successful</h2>
            </div>

            <div className="text-xs text-gray-500">
              File: <span className="text-gray-300">{result.filename}</span>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Extracted Skills ({result.skills?.length ?? 0})</h3>
              {result.skills?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {result.skills.map((s) => (
                    <span key={s} className="px-2.5 py-1 bg-blue-900/30 border border-blue-500/30 rounded-full text-xs text-blue-300">{s}</span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-xs">No technical skills detected.</p>
              )}
            </div>

            {/* Education */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Education Keywords</h3>
              {result.education_keywords?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {result.education_keywords.map((k) => (
                    <span key={k} className="px-2.5 py-1 bg-purple-900/30 border border-purple-500/30 rounded-full text-xs text-purple-300">{k}</span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-xs">No education keywords detected.</p>
              )}
            </div>
          </div>

          <Link
            to="/recommendations"
            className="block w-full text-center py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            View Internship Recommendations →
          </Link>
        </div>
      )}
    </div>
  )
}

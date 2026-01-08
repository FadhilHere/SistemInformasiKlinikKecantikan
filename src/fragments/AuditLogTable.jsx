import { Fragment, useEffect, useMemo, useState } from 'react'
import { apiFetch } from '../lib/api'

const AuditLogTable = () => {
  const [logs, setLogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [page, setPage] = useState(1)
  const [perPage] = useState(20)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0
  })

  const fetchLogs = async (query = '', pageNumber = 1) => {
    try {
      setIsLoading(true)
      setError('')
      const params = new URLSearchParams()
      if (query) params.set('q', query)
      params.set('page', String(pageNumber))
      params.set('per_page', String(perPage))
      const res = await apiFetch(`/api/audit-logs?${params.toString()}`)
      const payload = res?.data || res || []
      const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
        ? payload.data
        : []
      setLogs(list)
      setPagination({
        currentPage: payload?.current_page || pageNumber,
        lastPage: payload?.last_page || 1,
        total: payload?.total || list.length
      })
    } catch (err) {
      setError(err?.data?.message || 'Gagal memuat data audit log')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs(searchQuery, page)
  }, [searchQuery, page])

  useEffect(() => {
    setPage(1)
  }, [searchQuery])

  const formatDateTime = (value) => {
    if (!value) return '-'
    const date = new Date(value)
    return date.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const statusClass = (status) => {
    if (!status) return 'bg-gray-100 text-gray-600'
    if (status >= 500) return 'bg-red-100 text-red-600'
    if (status >= 400) return 'bg-amber-100 text-amber-600'
    if (status >= 300) return 'bg-blue-100 text-blue-600'
    return 'bg-green-100 text-green-600'
  }

  const methodClass = (method) => {
    const upper = (method || '').toUpperCase()
    if (upper === 'POST') return 'bg-blue-100 text-blue-600'
    if (upper === 'PUT' || upper === 'PATCH') return 'bg-amber-100 text-amber-600'
    if (upper === 'DELETE') return 'bg-red-100 text-red-600'
    return 'bg-gray-100 text-gray-600'
  }

  const filteredLogs = useMemo(() => logs, [logs])

  const toggleExpanded = (id) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  const renderJson = (value) => {
    if (!value || (typeof value === 'object' && Object.keys(value).length === 0)) {
      return '-'
    }
    try {
      return JSON.stringify(value, null, 2)
    } catch {
      return String(value)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 flex items-center border-b border-gray-100">
        <div className="ml-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari log..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </div>
        </div>
      </div>

      {error && <div className="px-4 py-2 text-sm text-red-600">{error}</div>}
      {isLoading ? (
        <div className="py-6 text-center text-sm text-gray-500">Memuat data...</div>
      ) : (
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-sm text-left">
            <thead className="text-gray-500 border-b border-gray-100 bg-white">
              <tr>
                <th className="py-4 px-6 font-medium w-12">No</th>
                <th className="py-4 px-6 font-medium">Waktu</th>
                <th className="py-4 px-6 font-medium">User</th>
                <th className="py-4 px-6 font-medium">Role</th>
                <th className="py-4 px-6 font-medium">Method</th>
                <th className="py-4 px-6 font-medium">Path</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 font-medium">IP</th>
                <th className="py-4 px-6 font-medium">Durasi</th>
                <th className="py-4 px-6 font-medium text-center">Detail</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, index) => {
                const logKey = log.id || `${log.path}-${index}`
                return (
                <Fragment key={logKey}>
                  <tr
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6 text-gray-400">{index + 1}</td>
                    <td className="py-4 px-6 text-gray-500 whitespace-nowrap">
                      {formatDateTime(log.created_at)}
                    </td>
                    <td className="py-4 px-6 text-gray-500">
                      {log.user_id || '-'}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        {log.role || '-'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${methodClass(log.method)}`}>
                        {(log.method || '-').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-500 max-w-xs truncate">
                      {log.path || '-'}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass(log.status_code)}`}>
                        {log.status_code || '-'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-500 whitespace-nowrap">
                      {log.ip || '-'}
                    </td>
                    <td className="py-4 px-6 text-gray-500 whitespace-nowrap">
                      {log.duration_ms ? `${log.duration_ms} ms` : '-'}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        type="button"
                        onClick={() => toggleExpanded(logKey)}
                        className="text-xs font-semibold text-brand hover:underline"
                      >
                        {expandedId === logKey ? 'Tutup' : 'Lihat'}
                      </button>
                    </td>
                  </tr>
                  {expandedId === logKey && (
                    <tr className="border-b border-gray-50 bg-gray-50/40">
                      <td colSpan="10" className="px-6 pb-6 pt-2">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <div className="text-xs font-semibold text-gray-500 mb-2">
                              Query Params
                            </div>
                            <pre className="whitespace-pre-wrap rounded-lg bg-white p-3 text-xs text-gray-600 border border-gray-100">
                              {renderJson(log.query_params)}
                            </pre>
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-gray-500 mb-2">
                              Request Body
                            </div>
                            <pre className="whitespace-pre-wrap rounded-lg bg-white p-3 text-xs text-gray-600 border border-gray-100">
                              {renderJson(log.request_body)}
                            </pre>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
                )
              })}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan="10" className="py-8 text-center text-gray-500">
                    {searchQuery
                      ? 'Tidak ada log yang sesuai dengan pencarian.'
                      : 'Belum ada audit log tersimpan.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between p-4 border-t border-gray-100 text-sm text-gray-500">
        <div>
          Menampilkan{' '}
          <span className="font-medium text-gray-700">
            {logs.length ? (pagination.currentPage - 1) * perPage + 1 : 0}
          </span>{' '}
          -{' '}
          <span className="font-medium text-gray-700">
            {(pagination.currentPage - 1) * perPage + logs.length}
          </span>{' '}
          dari{' '}
          <span className="font-medium text-gray-700">
            {pagination.total}
          </span>{' '}
          data
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={pagination.currentPage <= 1}
            className="px-3 py-1 rounded-md border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Prev
          </button>
          <span className="text-gray-600">
            {pagination.currentPage} / {pagination.lastPage}
          </span>
          <button
            type="button"
            onClick={() =>
              setPage((prev) => Math.min(pagination.lastPage, prev + 1))
            }
            disabled={pagination.currentPage >= pagination.lastPage}
            className="px-3 py-1 rounded-md border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuditLogTable

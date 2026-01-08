import DashboardSidebar from '../fragments/DashboardSidebar'
import AuditLogTable from '../fragments/AuditLogTable'

const AuditLogPage = ({ onLogout, onNavigate }) => {
  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <DashboardSidebar
        onLogout={onLogout}
        activeMenu="audit-logs"
        onNavigate={onNavigate}
      />

      <main className="flex-1 p-8 h-full overflow-y-auto w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Audit Log</h1>
          <p className="text-gray-500 text-sm">
            Daftar aktivitas request yang masuk ke sistem untuk kebutuhan audit.
          </p>
        </div>

        <AuditLogTable />
      </main>
    </div>
  )
}

export default AuditLogPage

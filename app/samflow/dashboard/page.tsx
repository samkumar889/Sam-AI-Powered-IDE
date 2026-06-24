'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Zap, LayoutDashboard, FolderKanban, MessageSquare, BarChart3, 
  Settings, LogOut, Plus, Users, CreditCard, Loader2, 
  AlertCircle, FileText, ChevronRight, Menu, X 
} from 'lucide-react'

// Mock data
const stats = [
  { id: 1, title: 'Total Projects', value: '12', change: '+3 this week' },
  { id: 2, title: 'Tasks Completed', value: '84', change: '+12 this week' },
  { id: 3, title: 'AI Interactions', value: '328', change: '+48 this week' },
  { id: 4, title: 'Team Members', value: '6', change: '+2 this month' },
]

const recentProjects = [
  { id: 'p1', name: 'E-Commerce Platform', status: 'In Progress', pendingTasks: 5 },
  { id: 'p2', name: 'Mobile App Redesign', status: 'In Review', pendingTasks: 2 },
  { id: 'p3', name: 'Marketing Website', status: 'Completed', pendingTasks: 0 },
]

// Empty state component
function EmptyState({ icon: Icon, title, description, action }: {
  icon: any
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-4">
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-sm mb-6">{description}</p>
      {action}
    </div>
  )
}

// Loading state component
function LoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-8 w-8 text-red-700 animate-spin" />
      <span className="ml-3 text-gray-600 dark:text-gray-400 font-medium">Loading...</span>
    </div>
  )
}

// Error state component
function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-2xl mb-4">
        <AlertCircle className="h-8 w-8 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Something went wrong</h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-sm mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-all"
        >
          Try Again
        </button>
      )}
    </div>
  )
}

// Stat Card component
function StatCard({ title, value, change, isLoading }: {
  title: string
  value: string
  change: string
  isLoading?: boolean
}) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24 mb-2 animate-pulse"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-16 mb-2 animate-pulse"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-20 animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200">
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
      <p className="text-sm text-green-600 dark:text-green-400 mt-1">{change}</p>
    </div>
  )
}

// Project Item component
function ProjectItem({ name, status, pendingTasks }: {
  name: string
  status: string
  pendingTasks: number
}) {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-between group hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-700 to-red-900 flex items-center justify-center flex-shrink-0">
          <FolderKanban className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0">
          <h4 className="font-medium text-gray-900 dark:text-white truncate">{name}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {pendingTasks === 0 ? 'All tasks complete' : `${pendingTasks} task${pendingTasks !== 1 ? 's' : ''} pending`}
          </p>
        </div>
      </div>
      <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium text-sm px-3 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center gap-1">
        View
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogout = () => {
    router.push('/samflow/login')
  }

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'projects', icon: FolderKanban, label: 'Projects' },
    { id: 'ai-chat', icon: MessageSquare, label: 'AI Assistant' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'team', icon: Users, label: 'Team' },
    { id: 'billing', icon: CreditCard, label: 'Billing' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ]

  const renderContent = () => {
    if (isLoading) return <LoadingState />
    if (error) return <ErrorState message={error} onRetry={() => setError(null)} />

    if (activeTab === 'dashboard') {
      return (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <StatCard
                key={stat.id}
                title={stat.title}
                value={stat.value}
                change={stat.change}
              />
            ))}
          </div>

          {/* Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Projects</h3>
              </div>
              <div className="p-6">
                {recentProjects.length === 0 ? (
                  <EmptyState
                    icon={FileText}
                    title="No projects yet"
                    description="Create your first project to get started!"
                    action={
                      <button className="px-5 py-2.5 bg-gradient-to-r from-red-700 to-red-900 hover:from-red-800 hover:to-red-950 text-white font-medium rounded-xl transition-all">
                        Create Project
                      </button>
                    }
                  />
                ) : (
                  <div className="space-y-4">
                    {recentProjects.map((project) => (
                      <ProjectItem
                        key={project.id}
                        name={project.name}
                        status={project.status}
                        pendingTasks={project.pendingTasks}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
              </div>
              <div className="p-6 space-y-4">
                <button
                  onClick={() => setActiveTab('ai-chat')}
                  className="w-full py-3 bg-gradient-to-r from-red-700 to-red-900 hover:from-red-800 hover:to-red-950 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-red-700/20"
                >
                  <MessageSquare className="h-5 w-5" />
                  Talk to AI Assistant
                </button>
                <button
                  onClick={() => setActiveTab('projects')}
                  className="w-full py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <FolderKanban className="h-5 w-5" />
                  Create New Task
                </button>
                <button
                  onClick={() => setActiveTab('team')}
                  className="w-full py-3 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Users className="h-5 w-5" />
                  Invite Team Members
                </button>
              </div>
            </div>
          </div>
        </>
      )
    }

    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-12 text-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {menuItems.find(m => m.id === activeTab)?.label}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Coming soon in future updates!
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-6 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-8 lg:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-red-700 to-red-900 rounded-xl">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">SAMFlow</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-3 mb-8">
          <div className="p-2 bg-gradient-to-br from-red-700 to-red-900 rounded-xl">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">SAMFlow</h1>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <span className="font-medium">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 lg:p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  Hey there! 👋
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Welcome back to your SAMFlow dashboard!
                </p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-700 to-red-900 hover:from-red-800 hover:to-red-950 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-red-700/20">
              <Plus className="h-5 w-5" />
              <span className="hidden sm:inline">New Project</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 lg:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}
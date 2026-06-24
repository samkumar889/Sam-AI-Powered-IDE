import { Zap, LayoutDashboard, MessageSquare, BarChart3, Users, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function SAMFlowLanding() {
  const features = [
    {
      icon: Zap,
      title: 'AI-Powered',
      description: 'Advanced AI assistant to help you manage projects and complete tasks faster.'
    },
    {
      icon: LayoutDashboard,
      title: 'Beautiful Dashboard',
      description: 'Intuitive interface designed for productivity and ease of use.'
    },
    {
      icon: MessageSquare,
      title: 'Real-time Chat',
      description: 'Collaborate with your team and AI assistant in real-time.'
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'Detailed insights and analytics to track your team performance.'
    },
    {
      icon: Users,
      title: 'Team Management',
      description: 'Easily manage your team members and project access.'
    },
    {
      icon: ShieldCheck,
      title: 'Enterprise Security',
      description: 'Bank-grade security and data protection for your projects.'
    }
  ]

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for getting started',
      features: ['1 User', '3 Projects', 'Basic AI Features', 'Community Support']
    },
    {
      name: 'Pro',
      price: '$19',
      description: 'For growing teams',
      features: ['10 Users', 'Unlimited Projects', 'Advanced AI', 'Priority Support'],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$99',
      description: 'For large organizations',
      features: ['Unlimited Users', 'Everything in Pro', 'Custom Integration', 'Dedicated Support']
    }
  ]

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-red-700 to-red-900 rounded-xl">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-semibold text-white tracking-tight">SAMFlow</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/samflow/login"
                className="text-gray-400 hover:text-white font-medium transition-colors"
              >
                Log in
              </Link>
              <Link href="/samflow/register">
                <button className="px-5 py-2.5 bg-gradient-to-r from-red-700 to-red-900 hover:from-red-800 hover:to-red-950 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-red-700/20">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 rounded-full text-gray-300 text-sm font-medium mb-6">
            <Zap className="h-4 w-4 text-red-400" />
            <span>AI-Powered Project Management</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
            Build better products <br />
            <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              with AI
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            SAMFlow combines beautiful design with powerful AI to help you manage projects, collaborate with your team, and ship faster.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/samflow/register">
              <button className="px-8 py-4 bg-gradient-to-r from-red-700 to-red-900 hover:from-red-800 hover:to-red-950 text-white font-semibold text-lg rounded-2xl transition-all duration-200 shadow-xl shadow-red-700/20 flex items-center gap-2">
                Start for Free
                <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Powerful features designed to make your team more productive and your projects more successful.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="bg-gray-900 border border-gray-800 rounded-3xl p-8 hover:border-gray-700 transition-colors duration-200">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-700/20 to-red-900/20 rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="h-7 w-7 text-red-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Choose the plan that fits your team. No hidden fees. Cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`relative bg-gray-900 border border-gray-800 rounded-3xl p-8 ${plan.popular ? 'border-indigo-500/50 shadow-xl shadow-indigo-500/10' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-red-700 to-red-900 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-semibold text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-400 mb-4">
                  {plan.description}
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/samflow/register">
                  <button className={`w-full py-3 font-medium rounded-xl transition-all duration-200 ${plan.popular ? 'bg-gradient-to-r from-red-700 to-red-900 hover:from-red-800 hover:to-red-950 text-white shadow-lg shadow-red-700/20' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}>
                    Get Started
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-red-700 to-red-900 rounded-xl">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-white tracking-tight">SAMFlow</span>
            </div>
            <p className="text-gray-500">
              © 2024 SAMFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
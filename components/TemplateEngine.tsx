'use client';

import { useState } from 'react';
import {
  Zap,
  Users,
  ShoppingCart,
  DollarSign,
  Heart,
  Brain,
  Briefcase,
  CheckCircle2,
  Play,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  sampleDescription: string;
  features: string[];
}

export const TEMPLATES: Template[] = [
  {
    id: 'saas',
    name: 'SaaS Platform',
    description: 'Modern SaaS platform with user authentication, subscription plans, billing, and dashboard',
    icon: Zap,
    color: 'from-blue-500 to-purple-600',
    sampleDescription: 'SaaS Platform - Build a modern subscription-based SaaS application with user authentication, payment integration, and analytics dashboard.',
    features: [
      'User Authentication & Authorization',
      'Subscription Plans (Stripe)',
      'Analytics Dashboard',
      'API Documentation',
      'Billing Management',
      'Multi-Tenant Support',
    ],
  },
  {
    id: 'crm',
    name: 'CRM System',
    description: 'Complete customer relationship management system with contacts, deals, and tasks',
    icon: Users,
    color: 'from-green-500 to-teal-600',
    sampleDescription: 'CRM System - Customer relationship management system with contacts, deals, tasks, and reporting.',
    features: [
      'Contacts & Leads',
      'Deal Pipeline',
      'Task Management',
      'Reporting & Analytics',
      'Activity Timeline',
      'Team Collaboration',
    ],
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce',
    description: 'Full-featured e-commerce store with products, cart, checkout, and payments',
    icon: ShoppingCart,
    color: 'from-pink-500 to-rose-600',
    sampleDescription: 'E-Commerce Store - Online shopping platform with products, shopping cart, checkout, and payment integration.',
    features: [
      'Product Catalog',
      'Shopping Cart',
      'Checkout Flow',
      'Payment Integration',
      'Order Management',
      'Inventory System',
    ],
  },
  {
    id: 'finance',
    name: 'Finance App',
    description: 'Financial management app with budgeting, transactions, and analytics',
    icon: DollarSign,
    color: 'from-amber-500 to-orange-600',
    sampleDescription: 'Finance App - Personal and business finance management with transactions, budgeting, and reports.',
    features: [
      'Transaction Tracking',
      'Budgeting & Goals',
      'Reports & Charts',
      'Bank Connections',
      'Expense Categorization',
      'Financial Insights',
    ],
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Healthcare management system with patients, appointments, and medical records',
    icon: Heart,
    color: 'from-red-500 to-pink-600',
    sampleDescription: 'Healthcare System - Patient management system with appointments, medical records, and healthcare providers.',
    features: [
      'Patient Management',
      'Appointment Scheduling',
      'Medical Records',
      'Billing System',
      'Doctor Profiles',
      'Patient Portal',
    ],
  },
  {
    id: 'ai-startup',
    name: 'AI Startup',
    description: 'AI startup platform with AI features, landing page, and SaaS features',
    icon: Brain,
    color: 'from-indigo-500 to-purple-600',
    sampleDescription: 'AI Startup Platform - Landing page, AI features, and SaaS platform for AI products.',
    features: [
      'Modern Landing Page',
      'AI Chat Interface',
      'API Integration',
      'User Onboarding',
      'AI Features Demo',
      'Analytics Dashboard',
    ],
  },
  {
    id: 'agency',
    name: 'Agency Website',
    description: 'Creative agency website with portfolio, services, and contact forms',
    icon: Briefcase,
    color: 'from-cyan-500 to-blue-600',
    sampleDescription: 'Creative Agency Website - Portfolio, services, team, and contact forms.',
    features: [
      'Portfolio Showcase',
      'Services Pages',
      'Team Profiles',
      'Contact Forms',
      'Blog System',
      'Responsive Design',
    ],
  },
];

interface TemplateEngineProps {
  onSelectTemplate: (template: Template) => void;
}

export function TemplateEngine({ onSelectTemplate }: TemplateEngineProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-gray-100 p-6 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Choose a Template</h2>
        <p className="text-gray-400">Select a professional template to get started quickly</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATES.map((template) => (
          <div
            key={template.id}
            className={cn(
              "relative overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1",
              selectedTemplate?.id === template.id
                ? "border-purple-500 bg-purple-500/10"
                : "border-gray-700 bg-gray-800 hover:border-gray-600"
            )}
            onClick={() => {
              setSelectedTemplate(template);
              onSelectTemplate(template);
            }}
          >
            <div className={cn("h-2 bg-gradient-to-r", template.color)} />
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className={cn("p-3 rounded-lg bg-gradient-to-br", template.color)}>
                  <template.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{template.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{template.description}</p>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Features:</h4>
                <ul className="space-y-1">
                  {template.features.slice(0, 4).map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-gray-400">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              {selectedTemplate?.id === template.id && (
                  <button
                    className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-all">
                    <Play className="w-4 h-4" />
                    Use This Template
                  </button>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

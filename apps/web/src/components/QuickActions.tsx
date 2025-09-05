import { Plus, Phone, Mail, Calendar, FileText, TrendingUp } from 'lucide-react';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  href?: string;
  onClick?: () => void;
}

const quickActions: QuickAction[] = [
  {
    id: 'add-lead',
    title: 'Add New Lead',
    description: 'Create a new lead entry',
    icon: Plus,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    onClick: () => console.log('Add lead clicked'),
  },
  {
    id: 'schedule-call',
    title: 'Schedule Call',
    description: 'Book a follow-up call',
    icon: Phone,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    onClick: () => console.log('Schedule call clicked'),
  },
  {
    id: 'send-email',
    title: 'Send Email',
    description: 'Compose and send email',
    icon: Mail,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    onClick: () => console.log('Send email clicked'),
  },
  {
    id: 'create-proposal',
    title: 'Create Proposal',
    description: 'Generate property proposal',
    icon: FileText,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    onClick: () => console.log('Create proposal clicked'),
  },
  {
    id: 'view-reports',
    title: 'View Reports',
    description: 'Analytics and insights',
    icon: TrendingUp,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    onClick: () => console.log('View reports clicked'),
  },
  {
    id: 'schedule-meeting',
    title: 'Schedule Meeting',
    description: 'Book property viewing',
    icon: Calendar,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
    onClick: () => console.log('Schedule meeting clicked'),
  },
];

interface QuickActionsProps {
  onActionClick?: (actionId: string) => void;
}

export default function QuickActions({ onActionClick }: QuickActionsProps) {
  return (
    <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => {
                action.onClick?.();
                onActionClick?.(action.id);
              }}
              className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 text-left group"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${action.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className={`h-4 w-4 ${action.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {action.title}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {action.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

import { Lead } from '@/types';
import { formatDate } from '@/lib/utils';
import { UserPlus, Phone, Mail, DollarSign } from 'lucide-react';

interface RecentActivityProps {
  leads: Lead[];
}

export default function RecentActivity({ leads }: RecentActivityProps) {
  const getActivityIcon = (lead: Lead) => {
    if (lead.status === 'NEW') return UserPlus;
    if (lead.phone) return Phone;
    if (lead.email) return Mail;
    if (lead.budget) return DollarSign;
    return UserPlus;
  };

  const getActivityText = (lead: Lead) => {
    switch (lead.status) {
      case 'NEW':
        return 'New lead added';
      case 'CONTACTED':
        return 'Lead contacted';
      case 'QUALIFIED':
        return 'Lead qualified';
      case 'PROPOSAL':
        return 'Proposal sent';
      case 'NEGOTIATION':
        return 'In negotiation';
      case 'CLOSED_WON':
        return 'Deal closed - Won';
      case 'CLOSED_LOST':
        return 'Deal closed - Lost';
      default:
        return 'Lead updated';
    }
  };

  if (leads.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <p className="text-gray-500 text-sm">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="flow-root">
        <ul className="-mb-8">
          {leads.map((lead, index) => {
            const Icon = getActivityIcon(lead);
            const isLast = index === leads.length - 1;
            
            return (
              <li key={lead.id}>
                <div className="relative pb-8">
                  {!isLast && (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  )}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                        <Icon className="h-4 w-4 text-white" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          {getActivityText(lead)} - <span className="font-medium text-gray-900">{lead.firstName} {lead.lastName}</span>
                        </p>
                        {lead.budget && (
                          <p className="text-sm text-gray-500">
                            Budget: ${lead.budget.toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        {formatDate(lead.updatedAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

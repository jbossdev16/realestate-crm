'use client';

import { useState, useEffect } from 'react';
import { Users, Building2, UserPlus, TrendingUp, DollarSign, Activity, Plus, Filter, Calendar, Target } from 'lucide-react';
import { leadsApi, usersApi, agenciesApi } from '@/services/api';
import { Lead, User, Agency } from '@/types';
import { formatDate, formatCurrency, getStatusColor } from '@/lib/utils';
import LeadsTable from '../components/LeadsTable';
import StatsCard from '../components/StatsCard';
import RecentActivity from '../components/RecentActivity';
import CreateLeadModal from '../components/CreateLeadModal';
import QuickActions from '../components/QuickActions';
import PerformanceMetrics from '../components/PerformanceMetrics';
import SimpleChart from '../components/SimpleChart';

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    qualifiedLeads: 0,
    totalRevenue: 0,
    conversionRate: 0,
    avgDealSize: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leadsData, usersData, agenciesData] = await Promise.all([
          leadsApi.getLeads(),
          usersApi.getUsers(),
          agenciesApi.getAgencies(),
        ]);

        setLeads(leadsData);
        setUsers(usersData);
        setAgencies(agenciesData);

        // Calculate enhanced stats
        const newLeads = leadsData.filter(lead => lead.status === 'NEW').length;
        const qualifiedLeads = leadsData.filter(lead => lead.status === 'QUALIFIED').length;
        const closedWon = leadsData.filter(lead => lead.status === 'CLOSED_WON').length;
        const totalRevenue = leadsData.reduce((sum, lead) => sum + (lead.budget || 0), 0);
        const conversionRate = leadsData.length > 0 ? (closedWon / leadsData.length) * 100 : 0;
        const avgDealSize = closedWon > 0 ? totalRevenue / closedWon : 0;

        setStats({
          totalLeads: leadsData.length,
          newLeads,
          qualifiedLeads,
          totalRevenue,
          conversionRate,
          avgDealSize,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg rounded-lg p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-blue-100 mt-2">Welcome back! Here&apos;s what&apos;s happening with your real estate business.</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Lead
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-400 transition-colors flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatsCard
          title="Total Leads"
          value={stats.totalLeads}
          icon={UserPlus}
          color="blue"
          change="+12%"
          changeType="positive"
        />
        <StatsCard
          title="New Leads"
          value={stats.newLeads}
          icon={Activity}
          color="green"
          change="+8%"
          changeType="positive"
        />
        <StatsCard
          title="Qualified"
          value={stats.qualifiedLeads}
          icon={TrendingUp}
          color="purple"
          change="+15%"
          changeType="positive"
        />
        <StatsCard
          title="Total Pipeline"
          value={formatCurrency(stats.totalRevenue)}
          icon={DollarSign}
          color="yellow"
          change="+23%"
          changeType="positive"
        />
        <StatsCard
          title="Conversion Rate"
          value={`${stats.conversionRate.toFixed(1)}%`}
          icon={Target}
          color="red"
          change="+2.1%"
          changeType="positive"
        />
        <StatsCard
          title="Avg Deal Size"
          value={formatCurrency(stats.avgDealSize)}
          icon={Calendar}
          color="purple"
          change="+5%"
          changeType="positive"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleChart
          title="Leads by Status"
          data={[
            { label: 'New', value: stats.newLeads, color: '#3B82F6' },
            { label: 'Qualified', value: stats.qualifiedLeads, color: '#10B981' },
            { label: 'Proposal', value: leads.filter(l => l.status === 'PROPOSAL').length, color: '#F59E0B' },
            { label: 'Closed Won', value: leads.filter(l => l.status === 'CLOSED_WON').length, color: '#8B5CF6' },
          ]}
          type="bar"
        />
        <SimpleChart
          title="Revenue by Month"
          data={[
            { label: 'Jan', value: 120000, color: '#3B82F6' },
            { label: 'Feb', value: 150000, color: '#10B981' },
            { label: 'Mar', value: 180000, color: '#F59E0B' },
            { label: 'Apr', value: 200000, color: '#8B5CF6' },
          ]}
          type="pie"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enhanced Leads Table */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-lg rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Leads</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Showing {Math.min(leads.length, 5)} of {leads.length}</span>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View All
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <LeadsTable leads={leads.slice(0, 5)} />
            </div>
          </div>
        </div>

        {/* Enhanced Sidebar */}
        <div className="space-y-6">
          {/* Agency Info */}
          <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <Building2 className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Agency Info</h3>
            </div>
            {agencies.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{agencies[0].name}</p>
                    <p className="text-sm text-gray-500">{agencies[0].email}</p>
                  </div>
                </div>
                {agencies[0].phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">📞</span>
                    {agencies[0].phone}
                  </div>
                )}
                {agencies[0].address && (
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">📍</span>
                    {agencies[0].address}
                  </div>
                )}
                {agencies[0].website && (
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">🌐</span>
                    <a href={agencies[0].website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      {agencies[0].website}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Enhanced Team Members */}
          <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
              </div>
              <span className="text-sm text-gray-500">{users.length} total</span>
            </div>
            <div className="space-y-4">
              {users.slice(0, 3).map((user) => (
                <div key={user.id} className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {user.firstName[0]}{user.lastName[0]}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">{user.role.toLowerCase()}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'OWNER' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'ADMIN' ? 'bg-blue-100 text-blue-800' :
                      user.role === 'AGENT' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                </div>
              ))}
              {users.length > 3 && (
                <div className="text-center pt-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View all {users.length} members
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <QuickActions onActionClick={(actionId) => {
            if (actionId === 'add-lead') {
              setShowCreateModal(true);
            }
          }} />

          {/* Performance Metrics */}
          <PerformanceMetrics 
            metrics={[
              {
                label: 'Lead Response Time',
                value: '2.4h',
                change: -15,
                changeType: 'increase',
                period: 'vs last month'
              },
              {
                label: 'Conversion Rate',
                value: '24.5%',
                change: 8.2,
                changeType: 'increase',
                period: 'vs last month'
              },
              {
                label: 'Avg Deal Size',
                value: '$485K',
                change: 12.1,
                changeType: 'increase',
                period: 'vs last month'
              },
              {
                label: 'Client Satisfaction',
                value: '4.8/5',
                change: 0.3,
                changeType: 'increase',
                period: 'vs last month'
              }
            ]}
          />

          {/* Recent Activity */}
          <RecentActivity leads={leads.slice(0, 3)} />
        </div>
      </div>

      {/* Create Lead Modal */}
      {showCreateModal && (
        <CreateLeadModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            // Refresh data
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}

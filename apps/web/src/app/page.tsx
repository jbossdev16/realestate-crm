'use client';

import { useState, useEffect } from 'react';
import { Users, Building2, UserPlus, TrendingUp, DollarSign, Activity } from 'lucide-react';
import { leadsApi, usersApi, agenciesApi } from '@/services/api';
import { Lead, User, Agency } from '@/types';
import { formatDate, formatCurrency, getStatusColor } from '@/lib/utils';
import LeadsTable from '../components/LeadsTable';
import StatsCard from '../components/StatsCard';
import RecentActivity from '../components/RecentActivity';

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    qualifiedLeads: 0,
    totalRevenue: 0,
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

        // Calculate stats
        const newLeads = leadsData.filter(lead => lead.status === 'NEW').length;
        const qualifiedLeads = leadsData.filter(lead => lead.status === 'QUALIFIED').length;
        const totalRevenue = leadsData.reduce((sum, lead) => sum + (lead.budget || 0), 0);

        setStats({
          totalLeads: leadsData.length,
          newLeads,
          qualifiedLeads,
          totalRevenue,
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
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here&apos;s what&apos;s happening with your real estate business.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads Table */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Leads</h2>
            </div>
            <div className="p-6">
              <LeadsTable leads={leads.slice(0, 5)} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Agency Info */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Agency Info</h3>
            {agencies.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{agencies[0].name}</p>
                    <p className="text-sm text-gray-500">{agencies[0].email}</p>
                  </div>
                </div>
                {agencies[0].phone && (
                  <div className="text-sm text-gray-600">
                    📞 {agencies[0].phone}
                  </div>
                )}
                {agencies[0].address && (
                  <div className="text-sm text-gray-600">
                    📍 {agencies[0].address}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Team Members */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Members</h3>
            <div className="space-y-3">
              {users.slice(0, 3).map((user) => (
                <div key={user.id} className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        {user.firstName[0]}{user.lastName[0]}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{user.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <RecentActivity leads={leads.slice(0, 3)} />
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Building2, Phone, Mail, Globe, MapPin } from 'lucide-react';
import { agenciesApi } from '@/services/api';
import { Agency } from '@/types';
import { formatDate } from '@/lib/utils';

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const agenciesData = await agenciesApi.getAgencies();
        setAgencies(agenciesData);
      } catch (error) {
        console.error('Error fetching agencies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgencies();
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Agencies</h1>
            <p className="text-gray-600 mt-1">Manage your real estate agencies</p>
          </div>
        </div>
      </div>

      {/* Agencies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {agencies.map((agency) => (
          <div key={agency.id} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-lg bg-blue-500 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-900">{agency.name}</h3>
                  {agency.description && (
                    <p className="text-gray-600">{agency.description}</p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {agency.email && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-3 text-gray-400" />
                    {agency.email}
                  </div>
                )}
                
                {agency.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-3 text-gray-400" />
                    {agency.phone}
                  </div>
                )}
                
                {agency.website && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Globe className="h-4 w-4 mr-3 text-gray-400" />
                    <a href={agency.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      {agency.website}
                    </a>
                  </div>
                )}
                
                {agency.address && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                    {agency.address}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Created: {formatDate(agency.createdAt)}</span>
                  <span>Updated: {formatDate(agency.updatedAt)}</span>
                </div>
              </div>

              <div className="mt-4 flex space-x-2">
                <button className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-100">
                  Edit
                </button>
                <button className="flex-1 bg-green-50 text-green-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-green-100">
                  View Stats
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {agencies.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No agencies</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new agency.</p>
        </div>
      )}
    </div>
  );
}

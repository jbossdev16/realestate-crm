// Placeholder domain types - will be replaced by zod schemas later
export interface Agency {
  id: string;
  name: string;
  domain?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'OWNER' | 'ADMIN' | 'AGENT' | 'VIEWER';
  agencyId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface Lead {
  id: string;
  email?: string;
  phone?: string;
  firstName: string;
  lastName: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'VIEWING_BOOKED' | 'OFFER_MADE' | 'CLOSED' | 'LOST';
  source?: string;
  notes?: string;
  agencyId: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// Common response types
export interface ApiResponse<T> {
  data: T;
  meta?: Record<string, any>;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

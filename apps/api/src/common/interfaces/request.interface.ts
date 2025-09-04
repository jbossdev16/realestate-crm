export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    agencyId: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

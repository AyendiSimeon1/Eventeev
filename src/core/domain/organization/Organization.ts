import { Document } from 'mongoose';

export interface IOrganization extends Document {
  name: string;
  type: 'company' | 'individual' | 'nonprofit';
  address?: string;
  phone?: string;
  website?: string;
  owner: string; // Reference to User
  members: string[]; // References to Users
  createdAt: Date;
  updatedAt: Date;
}

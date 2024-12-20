import mongoose from 'mongoose';
import { IOrganization } from '@/core/domain/organization/Organization';

const organizationSchema = new mongoose.Schema<IOrganization>({
  name: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['company', 'individual', 'nonprofit'],
    required: true
  },
  address: String,
  phone: String,
  website: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

export const Organization = mongoose.model<IOrganization>('Organization', organizationSchema);

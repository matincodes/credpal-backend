import { Schema, model, Document, Types } from 'mongoose';

export interface ISubscription extends Document {
  user: Types.ObjectId;
  name: string;
  price: number;
  currency: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  category: string;
  status: 'active' | 'cancelled' | 'expired';
  startDate: Date;
  nextPaymentDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true }, // Index for speed
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  currency: { type: String, enum: ['NGN', 'USD', 'GBP', 'EUR'], default: 'NGN' },
  frequency: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly'], required: true },
  category: { type: String, default: 'Other' },
  status: { type: String, enum: ['active', 'cancelled', 'expired'], default: 'active' },
  startDate: { type: Date, required: true, default: Date.now },
  nextPaymentDate: { type: Date, required: true }
}, { timestamps: true });

// --- SMART DATE CALCULATION HOOK ---
subscriptionSchema.pre('validate', function() {
  // Only calculate if nextPaymentDate is missing OR if start/frequency changed
  if (!this.nextPaymentDate && this.startDate && this.frequency) {
    const date = new Date(this.startDate);
    
    switch (this.frequency) {
      case 'daily': date.setDate(date.getDate() + 1); break;
      case 'weekly': date.setDate(date.getDate() + 7); break;
      case 'monthly': date.setMonth(date.getMonth() + 1); break;
      case 'yearly': date.setFullYear(date.getFullYear() + 1); break;
    }
    this.nextPaymentDate = date;
  }
});

export const Subscription = model<ISubscription>('Subscription', subscriptionSchema);
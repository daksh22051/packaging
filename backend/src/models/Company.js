import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    industry: {
      type: String,
      default: 'Packaging & Manufacturing',
      trim: true,
    },
    businessType: {
      type: String,
      enum: ['Manufacturer', 'Retailer', 'Recycler', 'Logistics', 'Converter', 'Brand', 'Other'],
      default: 'Manufacturer',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      default: '',
      trim: true,
    },
    logo: {
      type: String,
      default: '',
    },
    location: {
      address: { type: String, default: '' },
      city: { type: String, default: 'Ahmedabad' },
      state: { type: String, default: 'Gujarat' },
      country: { type: String, default: 'India' },
      latitude: { type: Number, default: 23.0225 },
      longitude: { type: Number, default: 72.5714 },
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'trusted'],
      default: 'pending',
    },
    circularityScore: {
      type: Number,
      default: 80,
      min: 0,
      max: 100,
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    totalTransactions: {
      type: Number,
      default: 0,
    },
    totalMaterialsExchanged: {
      type: Number,
      default: 0,
    },
    totalWasteDiverted: {
      type: Number,
      default: 0,
    },
    totalCarbonAvoided: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

const Company = mongoose.model('Company', companySchema);

export default Company;

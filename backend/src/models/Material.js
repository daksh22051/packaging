import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema(
  {
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Supplier user reference is required'],
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Owner company reference is required'],
    },
    name: {
      type: String,
      required: [true, 'Material name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Material category is required'],
      enum: {
        values: ['cardboard', 'plastic', 'pallet', 'pallets', 'paper', 'glass', 'metal', 'other'],
        message: '{VALUE} is not a valid material category',
      },
      lowercase: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Material quantity is required'],
      min: [0, 'Quantity cannot be negative'],
    },
    unit: {
      type: String,
      required: [true, 'Quantity unit is required'],
      default: 'kg',
      trim: true,
    },
    price: {
      type: Number,
      default: 0,
      min: [0, 'Price cannot be negative'],
    },
    currency: {
      type: String,
      default: 'INR',
      trim: true,
    },
    condition: {
      type: String,
      required: [true, 'Condition is required'],
      enum: ['new', 'good', 'used', 'recyclable'],
      lowercase: true,
    },
    grade: {
      type: String,
      default: 'Commercial Grade A',
      trim: true,
    },
    dimensions: {
      type: String,
      default: '',
      trim: true,
    },
    weight: {
      type: Number,
      default: 0,
    },
    recyclability: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },
    transactionType: {
      type: String,
      required: [true, 'Transaction type is required'],
      enum: ['sell', 'free_claim', 'exchange'],
      default: 'sell',
    },
    location: {
      address: { type: String, default: '' },
      city: { type: String, required: true, default: 'Ahmedabad' },
      state: { type: String, default: 'Gujarat' },
      country: { type: String, default: 'India' },
      latitude: { type: Number, default: 23.0225 },
      longitude: { type: Number, default: 72.5714 },
    },
    images: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'reserved', 'sold', 'expired', 'draft'],
      default: 'active',
      lowercase: true,
    },
    estimatedCarbonAvoided: {
      type: Number,
      default: 0,
    },
    estimatedWasteDiverted: {
      type: Number,
      default: 0,
    },
    estimatedVirginMaterialAvoided: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days default
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

// Indexing for performant filtering and geospatial lookup
materialSchema.index({ category: 1, status: 1 });
materialSchema.index({ price: 1 });
materialSchema.index({ 'location.city': 1 });
materialSchema.index({ name: 'text', description: 'text', tags: 'text' });

const Material = mongoose.model('Material', materialSchema);

export default Material;

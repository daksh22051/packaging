import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Buyer user is required'],
    },
    buyerCompany: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Buyer company is required'],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Seller user is required'],
    },
    sellerCompany: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Seller company is required'],
    },
    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Material',
      required: [true, 'Material reference is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Transaction quantity is required'],
      min: [0.01, 'Quantity must be greater than zero'],
    },
    materialCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    transportCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      default: 'INR',
      trim: true,
    },
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'pickup_scheduled',
        'in_transit',
        'delivered',
        'verified',
        'cancelled',
      ],
      default: 'pending',
    },
    pickupLocation: {
      address: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      latitude: { type: Number, default: 23.0225 },
      longitude: { type: Number, default: 72.5714 },
    },
    destinationLocation: {
      address: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      latitude: { type: Number, default: 23.0225 },
      longitude: { type: Number, default: 72.5714 },
    },
    distance: {
      type: Number,
      default: 0,
    },
    estimatedTransportCarbon: {
      type: Number,
      default: 0,
    },
    estimatedTotalCarbonAvoided: {
      type: Number,
      default: 0,
    },
    deliveryDate: {
      type: Date,
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

transactionSchema.index({ buyerCompany: 1, status: 1 });
transactionSchema.index({ sellerCompany: 1, status: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;

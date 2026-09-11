import Transaction from '../models/Transaction.js';
import Material from '../models/Material.js';
import Company from '../models/Company.js';

export const transactionService = {
  /**
   * Generate unique readable order numbers like CM-2048
   */
  async generateOrderNumber() {
    const count = await Transaction.countDocuments();
    const baseNumber = 2048 + count;
    const orderNumber = `CM-${baseNumber}`;

    // Verify uniqueness
    const existing = await Transaction.findOne({ orderNumber });
    if (existing) {
      const suffix = Math.floor(100 + Math.random() * 900);
      return `CM-${baseNumber}-${suffix}`;
    }
    return orderNumber;
  },

  /**
   * Approximate great-circle distance between two coordinate pairs in kilometers (Haversine formula)
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 35; // Default sensible regional distance (35 km)
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.max(5, Math.round(R * c));
  },

  /**
   * Calculate logistics transport emissions in kg CO2e
   * Standard medium freight factor: ~0.095 kg CO2e per tonne-km
   */
  calculateTransportCarbon(quantityKg, distanceKm) {
    const tonnes = Math.max(0.01, quantityKg / 1000);
    const emissionsKg = tonnes * distanceKm * 0.095;
    return Number(emissionsKg.toFixed(2));
  },

  /**
   * Apply material inventory and state adjustments based on transaction status transition
   */
  async handleStatusTransition(transaction, newStatus) {
    const oldStatus = transaction.status;
    if (oldStatus === newStatus) return transaction;

    const material = await Material.findById(transaction.material);

    if (material) {
      if (newStatus === 'confirmed' || newStatus === 'pickup_scheduled') {
        // Reserve material or deduct
        if (material.quantity <= transaction.quantity) {
          material.status = 'reserved';
        }
        await material.save();
      } else if (newStatus === 'delivered' || newStatus === 'verified') {
        // Mark sold or decrease quantity
        const remaining = material.quantity - transaction.quantity;
        if (remaining <= 0) {
          material.quantity = 0;
          material.status = 'sold';
        } else {
          material.quantity = remaining;
          material.status = 'active';
        }
        await material.save();

        // Update company impact metrics
        await this.updateCompanyMetrics(transaction);
      } else if (newStatus === 'cancelled') {
        // Restore active status
        if (material.status === 'reserved' || material.status === 'sold') {
          material.status = 'active';
          await material.save();
        }
      }
    }

    transaction.status = newStatus;
    if (newStatus === 'delivered' && !transaction.deliveryDate) {
      transaction.deliveryDate = new Date();
    }
    await transaction.save();

    return transaction;
  },

  /**
   * Update buyer and seller companies' circular statistics upon verified delivery
   */
  async updateCompanyMetrics(transaction) {
    const wasteDiverted = transaction.quantity;
    const carbonAvoided = transaction.estimatedTotalCarbonAvoided;

    // Update Seller Company
    await Company.findByIdAndUpdate(transaction.sellerCompany, {
      $inc: {
        totalTransactions: 1,
        totalMaterialsExchanged: 1,
        totalWasteDiverted: wasteDiverted,
        totalCarbonAvoided: carbonAvoided,
      },
    });

    // Update Buyer Company
    await Company.findByIdAndUpdate(transaction.buyerCompany, {
      $inc: {
        totalTransactions: 1,
        totalMaterialsExchanged: 1,
        totalWasteDiverted: wasteDiverted,
        totalCarbonAvoided: carbonAvoided,
      },
    });
  },
};

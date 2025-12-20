const { products } = require('../models/Product');

class CheckoutService {
  // Validate payment method
  static validatePaymentMethod(paymentMethod) {
    const validMethods = ['cash', 'credit_card'];
    return validMethods.includes(paymentMethod.toLowerCase());
  }

  // Calculate discount based on payment method
  static calculateDiscount(amount, paymentMethod) {
    if (paymentMethod.toLowerCase() === 'cash') {
      return amount * 0.1; // 10% discount for cash
    }
    return 0; // No discount for credit card
  }

  // Validate product exists and has stock
  static validateProduct(productId, quantity) {
    const product = products.find(p => p.id === parseInt(productId));
    if (!product) {
      throw new Error('Product not found');
    }
    if (product.stock < quantity) {
      throw new Error(`Insufficient stock. Available: ${product.stock}`);
    }
    return product;
  }

  // Process checkout
  static processCheckout(userId, items, paymentMethod, simulate = false) {
    // Validate payment method
    if (!this.validatePaymentMethod(paymentMethod)) {
      throw new Error('Invalid payment method. Only cash or credit_card accepted');
    }

    // Validate items and calculate totals
    let totalAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = this.validateProduct(item.productId, item.quantity);
      
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      validatedItems.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
        total: itemTotal
      });

      // Update stock (simulate purchase) unless simulate flag set
      if (!simulate) {
        product.stock -= item.quantity;
      }
    }

    // Calculate discount
    const discount = this.calculateDiscount(totalAmount, paymentMethod);
    const finalAmount = totalAmount - discount;

    // Generate order
    const order = {
      id: Date.now(), // Simple ID generation
      userId,
      items: validatedItems,
      paymentMethod: paymentMethod.toLowerCase(),
      subtotal: totalAmount,
      discount,
      total: finalAmount,
      status: 'completed',
      createdAt: new Date()
    };

    return order;
  }
}

module.exports = CheckoutService;

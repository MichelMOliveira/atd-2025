const CheckoutService = require('../services/CheckoutService');

class CheckoutController {
  // POST /checkout
  static async checkout(req, res) {
    try {
      const { items, paymentMethod } = req.body;
      const userId = req.user.id;

      // Validate required fields
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Items array is required and must not be empty'
        });
      }

      if (!paymentMethod) {
        return res.status(400).json({
          success: false,
          message: 'Payment method is required'
        });
      }

      // Validate each item
      for (const item of items) {
        if (!item.productId || !item.quantity) {
          return res.status(400).json({
            success: false,
            message: 'Each item must have productId and quantity'
          });
        }

        if (item.quantity <= 0) {
          return res.status(400).json({
            success: false,
            message: 'Quantity must be greater than 0'
          });
        }
      }

      const simulate = req.headers['x-simulate'] === 'true' || false;
      const order = CheckoutService.processCheckout(userId, items, paymentMethod, simulate);

      res.json({
        success: true,
        message: 'Checkout completed successfully',
        data: order
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = CheckoutController;

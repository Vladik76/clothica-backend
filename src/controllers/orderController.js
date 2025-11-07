import createError from 'http-errors';
import Cart from '../models/cart.js';
import Order from '../models/order.js';

export async function createOrder(req, res, next) {
  try {
    const sessionId = req.header('x-session-id');
    const userId = req.user?.userId;
    const cart = await Cart.findOne({ $or: [{ sessionId }, { userId }] });
    if (!cart || cart.items.length === 0) throw createError(400, 'Cart empty');
    const subtotal = cart.items.reduce((s, it) => s + (it.price * it.qty), 0);
    const shipping = 0;
    const total = subtotal + shipping;
    const order = await Order.create({
      userId,
      items: cart.items.map(it => ({ productId: it.productId, variantKey: it.variantKey, qty: it.qty, price: it.price })),
      totals: { subtotal, shipping, total },
      status: 'created',
    });
    cart.items = [];
    await cart.save();
    res.json({ data: order });
  } catch (e) { next(e); }
}

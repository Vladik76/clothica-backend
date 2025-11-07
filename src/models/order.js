import { Schema, model } from 'mongoose';
import { SIZES } from '../constants/size';
import { ORDER_STATUS } from '../constants/status';

const orderItemSchema = new Schema(
  {
    goodId: {
      type: Schema.Types.ObjectId,
      ref: 'Good',
      required: true,
    },
    qty: Number,
    price: Number,
    size: {
      type: String,
      enum: SIZES,
    },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    items: [orderItemSchema],
    totals: {
      subtotal: Number,
      shipping: Number,
      total: Number,
    },
    status: {
      type: String,
      default: 'created',
      enum: ORDER_STATUS,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
const Order = model('Order', orderSchema);
export default Order;

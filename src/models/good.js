import { Schema, model } from 'mongoose';
import { SIZES } from '../constants/size.js';
import { GENDERS } from '../constants/gender.js';
import { CURRENCIES } from '../constants/currency.js';

const priceSchema = new Schema(
  {
    value: { type: Number, required: true, min: 0 },
    currency: {
      type: String,
      required: true,
      trim: true,
      uppercase: false,
      enum: CURRENCIES,
      default: 'грн',
    },
  },
  { _id: false },
);

const goodSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: priceSchema,
      required: true,
    },
    size: {
      type: [String],
      default: [],
      enum: SIZES,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    feedbacks: {
      type: [Schema.Types.ObjectId],
      ref: 'Review',
      default: [],
    },
    prevDescription: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: GENDERS,
      default: 'unisex',
      required: true,
    },
    characteristics: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
goodSchema.index({ name: 'text', category: 1, gender: 1 });

export const Good = model('Good', goodSchema);

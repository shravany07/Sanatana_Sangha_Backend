import mongoose from 'mongoose';
import { toJSON } from './plugins';
import enumModel from './enum.model';

const tokenSchema = mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(enumModel.EnumTypeOfToken),
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
// add plugin that converts mongoose to json
tokenSchema.plugin(toJSON);
/**
 * @typedef Token
 */
const Token = mongoose.models.Token || mongoose.model('Token', tokenSchema);
module.exports = Token;

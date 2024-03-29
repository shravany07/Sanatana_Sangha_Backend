import mongoose from 'mongoose';
import mongoosePaginateV2 from 'mongoose-paginate-v2';
import { toJSON } from 'models/plugins';
import enumModel from 'models/enum.model';
import bcrypt from 'bcryptjs';
/**
 * This file is generated by Appinvento, also it can be overwritten by Appinvento.
 */
const OauthSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  token: {
    type: String,
  },
});
const UserSchema = new mongoose.Schema({
  /**
   * Name of User
   * */
  name: {
    type: String,
  },
  /**
   * Email address of User
   * */
  email: {
    type: String,
    // eslint-disable-next-line security/detect-unsafe-regex
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  },
  /**
   * For email verification
   * */
  emailVerified: {
    type: Boolean,
    private: true,
  },
  /**
   * role
   * */
  role: {
    type: String,
    enum: Object.values(enumModel.EnumRoleOfUser),
    default: enumModel.EnumRoleOfUser.USER,
  },
  /**
   * Google based authentication
   * */
  googleProvider: {
    type: OauthSchema,
  },
  /**
   * user phone number
   * */
  phone: {
    type: Number,
    required: true,
  },
  /**
   * user profile picture
   * */
  profile_picture: {
    type: String,
  },
  /**
   * user password
   * */
  password: {
    type: String,
    required: true,
    private: true,
    match: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~-]).{8}$/,
  },
});
UserSchema.plugin(toJSON);
UserSchema.plugin(mongoosePaginateV2);
/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the User to be excluded
 * @returns Promise with boolean value
 */
UserSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const User = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!User;
};
UserSchema.pre('save', async function (next) {
  const User = this;
  if (User.isModified('password')) {
    User.password = await bcrypt.hash(User.password, 8);
  }
  next();
});
/**
 * When user reset password or change password then it save in bcrypt format
 */
UserSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate(); // {password: "..."}
  if (update && update.password) {
    const passwordHash = await bcrypt.hash(update.password, 10);
    this.getUpdate().password = passwordHash;
  }
  next();
});
const UserModel = mongoose.models.User || mongoose.model('User', UserSchema, 'User');
module.exports = UserModel;

import ApiError from 'utils/ApiError';
import httpStatus from 'http-status';
import { User } from 'models';

export async function getUserById(id, options = {}) {
  return User.findById(id, options.projection, options);
}

export async function getOne(query, options = {}) {
  return User.findOne(query, options.projection, options);
}

export async function getUserList(filter, options = {}) {
  return User.find(filter, options.projection, options);
}

export async function getUserListWithPagination(filter, options = {}) {
  return User.paginate(filter, options);
}

export async function createUser(body) {
  if (await User.isEmailTaken(body.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(body);
}

export async function updateUser(filter, body, options = {}) {
  const userData = await getOne(filter, {});
  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not found');
  }
  if (body.email && (await User.isEmailTaken(body.email, userData.id))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.findOneAndUpdate(filter, body, options);
}

export async function updateManyUser(filter, body, options = {}) {
  return User.updateMany(filter, body, options);
}

export async function removeUser(filter) {
  return User.findOneAndRemove(filter);
}

export async function removeManyUser(filter) {
  return User.deleteMany(filter);
}

import Joi from 'joi';

export const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export const googleLogin = {
  body: Joi.object().keys({
    access_token: Joi.string().required(),
  }),
};

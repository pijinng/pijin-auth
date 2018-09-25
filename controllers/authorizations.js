const Joi = require('joi');
const db = require('../config/db');

const Authorization = db.models.authorization;

async function createAuthorization(call, callback) {
  const { userID, password } = call.request;

  try {
    const schema = Joi.object().keys({
      userID: Joi.string().required(),
      password: Joi.string().required(),
    });
    const validation = Joi.validate(call.request, schema);
    if (validation.error !== null) throw new Error(validation.error.details[0].message);

    const data = new Authorization();
    if (userID !== undefined) data.userID = userID;
    if (password !== undefined) data.password = password;

    await data.save();

    callback(null, { data: JSON.stringify(data) });
  } catch (error) {
    console.error(error);
    callback(error);
  }
}

async function getAuthorizationByID(call, callback) {
  const { id } = call.request;
  try {
    const schema = Joi.object().keys({
      id: Joi.string().required(),
    });
    const validation = Joi.validate(call.request, schema);
    if (validation.error !== null) throw new Error(validation.error.details[0].message);

    const match = {};
    if (id !== undefined) match._id = id;

    const data = await Authorization.findOne(match);

    if (!data) {
      callback(null, { error: 'Authorization not found' });
      return;
    }

    callback(null, {
      data: JSON.stringify(data),
    });
  } catch (error) {
    console.error(error);
    callback(error);
  }
}

async function getAllAuthorizations(call, callback) {
  // const {} = call.request;

  try {
    const schema = Joi.object().keys({
      // param: Joi.string().required(),
    });
    const validation = Joi.validate(call.request, schema);
    if (validation.error !== null) throw new Error(validation.error.details[0].message);

    const filters = {};
    // if (param !== undefined) filters.param = param;

    const data = await Authorization.find(filters);
    callback(null, { data: JSON.stringify(data) });
  } catch (error) {
    console.error(error);
    callback(error);
  }
}

async function updateAuthorization(call, callback) {
  const { id, password } = call.request;

  try {
    const schema = Joi.object().keys({
      id: Joi.string().required(),
      password: Joi.string().optional(),
    });

    const validation = Joi.validate(call.request, schema);
    if (validation.error !== null) throw new Error(validation.error.details[0].message);

    const data = await Authorization.findById(id);

    if (!data) {
      callback(null, { error: 'Not found' });
      return;
    }

    if (password !== undefined) data.password = password;
    await data.save();

    callback(null, { data: JSON.stringify(data) });
  } catch (error) {
    console.error(error);
    callback(error);
  }
}

async function deleteAuthorizationByID(call, callback) {
  const { id } = call.request;

  try {
    const schema = Joi.object().keys({ id: Joi.string().required() });
    const validation = Joi.validate(call.request, schema);
    if (validation.error !== null) throw new Error(validation.error.details[0].message);

    await Authorization.findByIdAndRemove(id);

    callback(null);
  } catch (err) {
    console.error(err);
    callback(err);
  }
}

async function getAuthorizationByUserID(call, callback) {
  const { userID } = call.request;
  try {
    const schema = Joi.object().keys({
      userID: Joi.string().required(),
    });
    const validation = Joi.validate(call.request, schema);
    if (validation.error !== null) throw new Error(validation.error.details[0].message);

    const match = {};
    if (userID !== undefined) match.userID = userID;

    const data = await Authorization.findOne(match);

    if (!data) {
      callback(null, { error: 'Authorization not found' });
      return;
    }

    callback(null, {
      data: JSON.stringify(data),
    });
  } catch (error) {
    console.error(error);
    callback(error);
  }
}

async function validatePasswordWithUserID(call, callback) {
  const { userID, password } = call.request;
  try {
    const schema = Joi.object().keys({
      userID: Joi.string().required(),
      password: Joi.string().required(),
    });
    const validation = Joi.validate(call.request, schema);
    if (validation.error !== null) throw new Error(validation.error.details[0].message);

    const match = {};
    if (userID !== undefined) match.userID = userID;

    const data = await Authorization.findOne(match);

    if (!data) {
      callback(null, { error: 'Authorization not found' });
      return;
    }

    const isValidPassword = await data.comparePassword(password);

    callback(null, {
      data: isValidPassword,
    });
  } catch (error) {
    console.error(error);
    callback(error);
  }
}

module.exports = {
  getAllAuthorizations,
  getAuthorizationByID,
  deleteAuthorizationByID,
  createAuthorization,
  updateAuthorization,
  getAuthorizationByUserID,
  validatePasswordWithUserID,
};

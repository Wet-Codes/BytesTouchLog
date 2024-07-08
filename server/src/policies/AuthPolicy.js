const Joi = require('joi');


//Contents of the Login
const Login = Joi.object({
  //username
  username: Joi.string().min(3).required()
  .messages({
    'string.base': 'Username should be a type of text',
    'string.empty': 'Username cannot be empty',
    'string.min': 'Username should have a minimum length of {#limit}',
    'any.required': 'Username is required',
  }),
  //password
  password: Joi.string().min(8).required()
  .messages({
    'string.base': 'Password should be a type of text',
    'string.empty': 'Password cannot be empty',
    'string.min': 'Password should have a minimum length of {#limit}',
    'any.required': 'Password is required',
  }),

});

module.exports = {
    //validation of the login
  ValidateLogin: (req, res, next) => {
    const { error } = Login.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  },
};

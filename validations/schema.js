const Joi = require('joi');

const userCreateSchema = Joi.object({
    fullName: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    username: Joi.string().required(),
    password: Joi.string().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,10}$/)).message('Password must contain eight to ten characters, at least one uppercase letter, one lowercase letter and one number').required(),
    confPass: Joi.equal(Joi.ref('password')).options({ messages: { 'any.only': 'confirm password does not match' } }),
    division: Joi.string().valid('Kerohanian', 'Pengurus Inti', 'PSDM', 'Minat & Bakat', 'PDD')
})

const userLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

const adminCreateBillSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().greater(0).required()
})

module.exports = {userCreateSchema, userLoginSchema, adminCreateBillSchema}
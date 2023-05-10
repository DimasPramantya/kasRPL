const { userCreateSchema, userLoginSchema } = require("./schema")

const validateUserCreatePayload = async(payload)=>{
    const validationResult = await userCreateSchema.validate(payload);
    if(validationResult.error){
        throw new Error(validationResult.error.message);
    }
}

const validateUserLoginPayload = async(payload)=>{
    const validationResult = await userLoginSchema(payload);
    if(validationResult.error){
        throw new Error(validationResult.error.message);
    }
}

module.exports = {validateUserCreatePayload, validateUserLoginPayload};


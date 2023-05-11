const { userCreateSchema, userLoginSchema, adminCreateBillSchema } = require("./schema")

const validateUserCreatePayload = (payload)=>{
    const validationResult = userCreateSchema.validate(payload);
    if(validationResult.error){
        throw new Error(validationResult.error.message);
    }
}

const validateUserLoginPayload = (payload)=>{
    const validationResult = userLoginSchema.validate(payload);
    if(validationResult.error){
        throw new Error(validationResult.error.message);
    }
}

const validateAdminCreateBillPayload = (payload)=>{
    const validationResult = adminCreateBillSchema.validate(payload);
    if(validationResult.error){
        throw new Error(validationResult.error.message);
    }
}

module.exports = {validateUserCreatePayload, validateUserLoginPayload, validateAdminCreateBillPayload};


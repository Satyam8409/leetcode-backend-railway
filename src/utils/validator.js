const validator= require('validator');

const validate=(data)=>{
    const mandatoryField=['firstName','emailId','password'];
    const isAllField=mandatoryField.every((key)=>key in data);
    if(!isAllField){
        throw new Error("API-Level-validation fails atleast 1 required field is not present")
    }

    if(!validator.isEmail(data.emailId)){
        throw new Error("API-Level-validation fails email format is incorrect")
    }
    if(!validator.isStrongPassword(data.password)){
        throw new Error("API-Level-validation fails password is weak (password must have 1 upper case 1 specila character & length atleast 8)")
    }
    if(!(data.firstName.length>2 && data.firstName.length<20)){
        throw new Error("API-Level-validation fails firstName length has to be in bw 2 and 20")
    }

}

module.exports=validate;
// Import Global Password Model And Admin Model Object

const { globalPasswordModel, adminModel } = require("./all.models");

const { getSuitableTranslations } = require("../global/functions");

// require cryptoJs module for password encrypting

const cryptoJS = require("crypto-js");

async function getPasswordForBussinessEmail(email, language){
    try{
        const user = await globalPasswordModel.findOne({ email });
        if (user) {
            return {
                msg: getSuitableTranslations("Get Password For Bussiness Email Process Has Been Successfully !!", language),
                error: false,
                data: cryptoJS.AES.decrypt(user.password, process.env.secretKey).toString(cryptoJS.enc.Utf8),
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, Email Incorrect !!", language),
            error: true,
            data: {},
        }
    }
    catch(err){
        throw Error(err);
    }
}

async function changeBussinessEmailPassword(authorizationId, email, password, newPassword, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            if (admin.isWebsiteOwner) {
                const user = await globalPasswordModel.findOne({ email });
                if (user) {
                    const bytes = cryptoJS.AES.decrypt(user.password, process.env.secretKey);
                    const decryptedPassword = bytes.toString(cryptoJS.enc.Utf8);
                    if (decryptedPassword === password) {
                        const encrypted_password = cryptoJS.AES.encrypt(newPassword, process.env.secretKey).toString();
                        await globalPasswordModel.updateOne({ password: encrypted_password });
                        return {
                            msg: getSuitableTranslations("Changing Global Password Process Has Been Successfully !!", language),
                            error: false,
                            data: {},
                        }
                    }
                    return {
                        msg: getSuitableTranslations("Sorry, Email Or Password Incorrect !!", language),
                        error: true,
                        data: {},
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, Email Or Password Incorrect !!", language),
                    error: true,
                    data: {},
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, Permission Denied !!", language),
                error: true,
                data: {},
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

module.exports = {
    getPasswordForBussinessEmail,
    changeBussinessEmailPassword,
}
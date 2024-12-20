// Import Admin Model Object

const { getSuitableTranslations } = require("../global/functions");

const { adminModel, couponModel } = require("./all.models");

async function getAllCoupons(admintId, language) {
    try {
        const admin = await adminModel.findById(admintId);
        if (admin) {
            return {
                msg: getSuitableTranslations("Get All Coupons Process Has Been Successfully !!", language),
                error: false,
                data: await couponModel.find(),
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
            error: true,
            data: {},
        }
    } catch (err) {
        throw Error(err);
    }
}

async function getCouponDetails(code, language) {
    try{
        const couponDetails = await couponModel.findOne({ code });
        if (couponDetails) {
            return {
                msg: getSuitableTranslations("Get Coupon Details Process Has Been Successfully !!", language),
                error: false,
                data: couponDetails,
            }
        } else {
            return {
                msg: getSuitableTranslations("Sorry, This Code Is Not Exist !!", language),
                error: true,
                data: {},
            }
        }
    }
    catch(err) {
        throw Error(err);
    }
}

async function addNewCoupon(adminId, couponInfo, language) {
    try{
        const admin = await adminModel.findById(adminId);
        if (admin) {
            const couponDetails = await couponModel.findOne({ code: couponInfo.code });
            if (!couponDetails) {
                await(new couponModel(couponInfo)).save();
                return {
                    msg: getSuitableTranslations("Creating New Coupon Process Has Been Successfully !!", language),
                    error: false,
                    data: {},
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Coupon Is Already Exist !!", language),
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
    catch(err) {
        throw Error(err);
    }
}

async function updateCouponInfo(adminId, couponId, newCouponDetails, language) {
    try {
        const admin = await adminModel.findById(adminId);
        if (admin) {
            const couponDetails = await couponModel.findOne({ code: newCouponDetails.code, _id: { $ne: couponId } });
            if (!couponDetails) {
                const couponInfo = await couponModel.findOneAndUpdate({ _id: couponId }, newCouponDetails);
                if (couponInfo) {
                    return {
                        msg: getSuitableTranslations("Updating Coupon Details Process Has Been Successfully !!", language),
                        error: false,
                        data: {},
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Coupon Is Not Exist !!", language),
                    error: true,
                    data: {},
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This New Code Is Already Exist !!", language),
                error: true,
                data: {},
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
            error: true,
            data: {},
        }
    } catch (err) {
        throw Error(err);
    }
}

async function deleteCoupon(adminId, couponId, language){
    try{
        const admin = await adminModel.findById(adminId);
        if (admin) {
            const couponDetails = await couponModel.findOneAndDelete({ _id: couponId });
            if (couponDetails) {
                return {
                    msg: getSuitableTranslations("Deleting Coupon Process Has Been Successfully !!", language),
                    error: false,
                    data: {},
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Coupon Is Not Exist !!", language),
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
    catch(err){
        throw Error(err);
    }
}

module.exports = {
    getAllCoupons,
    getCouponDetails,
    addNewCoupon,
    updateCouponInfo,
    deleteCoupon
}
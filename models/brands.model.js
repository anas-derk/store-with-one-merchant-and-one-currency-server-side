// Import Brand Model Object

const { brandModel, adminModel } = require("../models/all.models");

async function addNewBrand(authorizationId, brandInfo) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            await (new brandModel(brandInfo)).save();
            return {
                msg: "Adding New Brand Process Has Been Successfuly ...",
                error: false,
                data: {},
            };
        }
        return {
            msg: "Sorry, This Admin Is Not Exist !!",
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getLastSevenBrands(filters) {
    try {
        return {
            msg: "Get All Brands Process Has Been Successfully !!",
            error: false,
            data: await brandModel.find(filters).limit(7),
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getBrandsCount(filters) {
    try {
        return {
            msg: "Get Brands Count Process Has Been Successfully !!",
            error: false,
            data: await brandModel.countDocuments(filters),
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getAllBrandsInsideThePage(pageNumber, pageSize, filters) {
    try {
        return {
            msg: `Get All Brands Inside The Page: ${pageNumber} Process Has Been Successfully !!`,
            error: false,
            data: await brandModel.find(filters).skip((pageNumber - 1) * pageSize).limit(pageSize),
        };
    }
    catch (err) {
        throw Error(err);
    }
}

async function deleteBrand(authorizationId, brandId) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            const brandInfo = await brandModel.findOneAndDelete({
                _id: brandId,
            });
            if (brandInfo) {
                return {
                    error: false,
                    msg: "Deleting Brand Process Has Been Successfuly ...",
                    data: {
                        deletedBrandPath: brandInfo.imagePath,
                    },
                }
            }
            return {
                msg: "Sorry, This Brand Id Is Not Exist !!",
                error: true,
                data: {},
            };
        }
        return {
            msg: "Sorry, This Admin Is Not Exist !!",
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function updateBrandInfo(authorizationId, brandId, newBrandTitle) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            const brandInfo = await brandModel.findOneAndUpdate({ _id: brandId }, { title: newBrandTitle });
            if (brandInfo) {
                return {
                    msg:  "Updating Brand Info Process Has Been Successfuly ...",
                    error: false,
                    data: {},
                }
            }
            return {
                msg: "Sorry, This Brand Is Not Exist !!",
                error: true,
                data: {},
            }
        }
        return {
            msg: "Sorry, This Admin Is Not Exist !!",
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function changeBrandImage(authorizationId, brandId, newBrandImagePath) {
    try{
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            const brand = await brandModel.findOneAndUpdate({ _id: brandId }, { imagePath: newBrandImagePath });
            if (brand) {
                return {
                    msg: "Updating Brand Image Process Has Been Successfully !!",
                    error: false,
                    data: { deletedBrandImagePath: brand.imagePath }
                }
            }
            return {
                msg: "Sorry, This Brand Is Not Exist !!",
                error: true,
                data: {}
            }
        }
        return {
            msg: "Sorry, This Admin Is Not Exist !!",
            error: true,
            data: {},
        }
    }
    catch(err) {
        throw Error(err);
    }
}

module.exports = {
    addNewBrand,
    getLastSevenBrands,
    getBrandsCount,
    getAllBrandsInsideThePage,
    deleteBrand,
    updateBrandInfo,
    changeBrandImage,
}
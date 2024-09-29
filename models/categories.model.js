// Import Category And Admin Model Object

const { categoryModel, adminModel, productModel } = require("../models/all.models");

async function addNewCategory(authorizationId, categoryName) {
    try{
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            const category = await categoryModel.findOne({ name: categoryName });
            if (category) {
                return {
                    msg: "Sorry, This Cateogry Is Already Exist !!",
                    error: true,
                    data: {},
                }
            }
            await (new categoryModel({
                name: categoryName,
            })).save();
            return {
                msg: "Adding New Category Process Has Been Successfuly ...",
                error: false,
                data: {},
            }
        }
        return {
            msg: "Sorry, This Admin Is Not Exist !!",
            error: true,
            data: {},
        }
    }
    catch(err){
        throw Error(err);
    }
}

async function getAllCategories(filters) {
    try {
        return {
            msg: "Get All Categories Process Has Been Successfully !!",
            error: false,
            data: await categoryModel.find(filters),
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getCategoryInfo(categoryId) {
    try {
        const categoryInfo = await categoryModel.findById(categoryId);
        if (categoryInfo) {
            return {
                msg: "Get Category Info Process Has Been Successfuly !!",
                error: false,
                data: categoryInfo,
            }
        }
        return {
            msg: "Sorry, This Category It Not Exist !!",
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getCategoriesCount(filters) {
    try {
        return {
            msg: "Get All Categories Process Has Been Successfully !!",
            error: false,
            data: await categoryModel.countDocuments(filters),
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getAllCategoriesInsideThePage(pageNumber, pageSize, filters) {
    try {
        return {
            msg: `Get All Categories Inside The Page: ${pageNumber} Process Has Been Successfully !!`,
            error: false,
            data: await categoryModel.find(filters).skip((pageNumber - 1) * pageSize).limit(pageSize),
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function deleteCategory(authorizationId, categoryId) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            const category = await categoryModel.findOneAndDelete({
                _id: categoryId,
            });
            if (category) {
                await productModel.updateMany({ categoryId }, { category: "uncategorized" });
                return {
                    msg: "Deleting Category Process Has Been Successfuly ...",
                    error: false,
                    data: {},
                };
            }
            return {
                msg: "Sorry, This Category Is Not Exist !!",
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

async function updateCategory(authorizationId, categoryId, newCategoryName) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            const category = await categoryModel.findOneAndUpdate( { _id: categoryId }, { name: newCategoryName });
            if (category) {
                return {
                    msg: "Updating Category Process Has Been Successfuly !!",
                    error: false,
                    data: {},
                };
            }
            return {
                msg: "Sorry, This Category Is Not Exist !!",
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

module.exports = {
    addNewCategory,
    getAllCategories,
    getCategoriesCount,
    getAllCategoriesInsideThePage,
    getCategoryInfo,
    deleteCategory,
    updateCategory,
}
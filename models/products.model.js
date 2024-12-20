// Import Product Model Object

const { productModel, categoryModel, adminModel, mongoose } = require("../models/all.models");

const { getSuitableTranslations } = require("../global/functions");

async function addNewProduct(authorizationId, productInfo, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            const product = await productModel.findOne({ name: productInfo.name, categoryId: productInfo.categoryId });
            if (!product) {
                const category = await categoryModel.findById(productInfo.categoryId);
                if (category) {
                    productInfo.category = category.name;
                    await (new productModel(productInfo)).save();
                    return {
                        msg: getSuitableTranslations("Adding New Product Process Has Been Successfuly !!", language),
                        error: false,
                        data: {},
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Category Is Not Exist !!", language),
                    error: true,
                    data: {},
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Product Is Already Exist !!", language),
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

async function addNewImagesToProductGallery(authorizationId, productId, newGalleryImagePaths, language) {
    try{
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            const product = await productModel.findById(productId);
            if (product) {
                const galleryImagePathsAfterAddNewPaths = product.galleryImagesPaths.concat(newGalleryImagePaths);
                await productModel.updateOne({ _id: productId },
                {
                    galleryImagesPaths: galleryImagePathsAfterAddNewPaths,
                });
                return {
                    msg: getSuitableTranslations("Add New Images To Product Gallery Process Has Been Successfuly !!", language),
                    error: false,
                    data: {
                        galleryImagePathsAfterAddNewPaths,
                    },
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Product Is Not Found !!", language),
                error: false,
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

async function getProductsByIds(productsIds, language) {
    try{
        return {
            msg: getSuitableTranslations("Get Products By Ids Process Has Been Successfully !!", language),
            error: false,
            data: {
                products: await productModel.find({ _id: { $in: productsIds }, quantity: { $gte: 1 } }),
                currentDate: new Date(),
            },
        }
    }
    catch(err) {
        throw Error(err);
    }
}

async function getProductInfo(productId, language) {
    try {
        const productInfo = await productModel.findById(productId);
        if (productInfo) {
            return {
                msg: getSuitableTranslations("Get Product Info Process Has Been Successfuly !!", language),
                error: false,
                data: {
                    productDetails: productInfo,
                    currentDate: new Date(),
                },
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This Product Is Not Exist !!", language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getProductsCount(filters, language) {
    try {
        return {
            msg: getSuitableTranslations("Get Products Count Process Has Been Successfully !!", language),
            error: false,
            data: await productModel.countDocuments(filters),
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getFlashProductsCount(filters, language) {
    try {
        const currentDate = new Date();
        filters.startDiscountPeriod = { $lte: currentDate };
        filters.endDiscountPeriod = { $gte: currentDate };
        return {
            msg: getSuitableTranslations("Get Flash Products Count Process Has Been Successfully !!", language),
            error: false,
            data: await productModel.countDocuments(filters),
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getAllFlashProductsInsideThePage(pageNumber, pageSize, filters, sortDetailsObject, language) {
    try {
        const currentDate = new Date();
        filters.startDiscountPeriod = { $lte: currentDate };
        filters.endDiscountPeriod = { $gte: currentDate };
        return {
            msg: getSuitableTranslations("Get All Flash Products Inside The Page: {{pageNumber}} Process Has Been Successfully !!", language, { pageNumber }),
            error: false,
            data: {
                productsCount: await productModel.countDocuments(filters),
                products: await productModel
                            .find(filters)
                            .skip((pageNumber - 1) * pageSize)
                            .limit(pageSize).sort(sortDetailsObject),
                currentDate: new Date(),
            },
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getAllProductsInsideThePage(pageNumber, pageSize, filters, sortDetailsObject, language) {
    try {
        return {
            msg: getSuitableTranslations("Get All Products Inside The Page: {{pageNumber}} Process Has Been Successfully !!", language, { pageNumber }),
            error: false,
            data: {
                productsCount: await productModel.countDocuments(filters),
                products: await productModel.find(filters).sort(sortDetailsObject).skip((pageNumber - 1) * pageSize).limit(pageSize),
                currentDate: new Date()
            },
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getRelatedProductsInTheProduct(productId, language) {
    try {
        const productInfo = await productModel.findById(productId);
        if (productInfo) {
            return {
                msg: getSuitableTranslations("Get Sample From Related Products In This Product Process Has Been Successfuly !!", language),
                error: false,
                data: await productModel.aggregate([
                    { $match: { categoryId: productInfo.categoryId, _id: { $ne: new mongoose.Types.ObjectId(productId) } } },
                    { $sample: { size: 10 } }
                ]),
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This Product Is Not Exist !!", language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getAllGalleryImages(authorizationId, productId, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            const product = await productModel.findOne({ _id: productId });
            if (product) {
                return {
                    msg: getSuitableTranslations("Get All Gallery Images Process Has Been Successfully !!", language),
                    error: false,
                    data: product.galleryImagesPaths,
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Product Is Not Exist !!", language),
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

async function deleteProduct(authorizationId, productId, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            const productInfo = await productModel.findOneAndDelete({
                _id: productId,
            });
            if (productInfo) {
                return {
                    msg: getSuitableTranslations("Deleting Product Process Has Been Successfuly !!", language),
                    error: false,
                    data: {
                        deletedProductImagePath: productInfo.imagePath,
                        galleryImagePathsForDeletedProduct: productInfo.galleryImagesPaths,
                    },
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Product Is Not Exist !!", language),
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

async function deleteImageFromProductGallery(authorizationId, productId, galleryImagePath, language) {
    try{
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            const product = await productModel.findById(productId);
            if (product) {
                await productModel.updateOne({ _id: productId }, { galleryImagesPaths: product.galleryImagesPaths.filter((path) => galleryImagePath !== path) });
                return {
                    msg: getSuitableTranslations("Deleting Image From Product Gallery Process Has Been Successfully !!", language),
                    error: false,
                    data: product.imagePath,
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Product Is Not Exist !!", language),
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

async function updateProduct(authorizationId, productId, newData, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            const category = await categoryModel.findById(newData.categoryId);
            if (category) {
                newData.category = category.name;
            }
            else {
                newData.category = "uncategorized";
            }
            const product = await productModel.findOneAndUpdate({ _id: productId }, newData);
            if (product) {
                return {
                    msg: getSuitableTranslations("Updating Product Info Process Has Been Successfully !!", language),
                    error: false,
                    data: {},
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Product Is Not Exist !!", language),
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

async function updateProductGalleryImage(authorizationId, productId, oldGalleryImagePath, newGalleryImagePath, language) {
    try{
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            const product = await productModel.findById(productId);
            if (product) {
                const galleryImagePathIndex = product.galleryImagesPaths.findIndex((galleryImagePath) => galleryImagePath === oldGalleryImagePath);
                if (galleryImagePathIndex >= 0) {
                    product.galleryImagesPaths[galleryImagePathIndex] = newGalleryImagePath;
                    await productModel.updateOne({ _id: productId }, {
                        galleryImagesPaths: product.galleryImagesPaths
                    });
                    return {
                        msg: getSuitableTranslations("Updating Product Galley Image Process Has Been Successfully !!", language),
                        error: false,
                        data: newGalleryImagePath,
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Path Is Not Found !!", language),
                    error: true,
                    data: {},
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Product Is Not Exist !!", language),
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

async function updateProductImage(authorizationId, productId, newProductImagePath, language) {
    try{
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            const product = await productModel.findOneAndUpdate({ _id: productId }, { imagePath: newProductImagePath });
            if (product) {
                return {
                    msg: getSuitableTranslations("Changing Product Image Process Has Been Successfully !!", language),
                    error: false,
                    data: {
                        deletedProductImagePath: product.imagePath,
                    },
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Product Is Not Exist !!", language),
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

module.exports = {
    addNewProduct,
    addNewImagesToProductGallery,
    getProductsByIds,
    getProductInfo,
    getProductsCount,
    getFlashProductsCount,
    getAllFlashProductsInsideThePage,
    getAllProductsInsideThePage,
    getRelatedProductsInTheProduct,
    getAllGalleryImages,
    deleteProduct,
    deleteImageFromProductGallery,
    updateProduct,
    updateProductGalleryImage,
    updateProductImage,
}
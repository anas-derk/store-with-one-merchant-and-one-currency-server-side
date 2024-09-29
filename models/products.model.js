// Import Product Model Object

const { productModel, categoryModel, adminModel, mongoose } = require("../models/all.models");

async function addNewProduct(authorizationId, productInfo) {
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
                        msg: "Adding New Product Process Has Been Successfuly !!",
                        error: false,
                        data: {},
                    }
                }
                return {
                    msg: "Sorry, This Category Is Not Exist !!",
                    error: true,
                    data: {},
                }
            }
            return {
                msg: "Sorry, This Product Is Already Exist !!",
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

async function addNewImagesToProductGallery(authorizationId, productId, newGalleryImagePaths) {
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
                    msg: "Add New Images To Product Gallery Process Has Been Successfuly !!",
                    error: false,
                    data: {
                        galleryImagePathsAfterAddNewPaths,
                    },
                }
            }
            return {
                msg: "Sorry, This Product Is Not Found !!",
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
    catch(err) {
        throw Error(err);
    }
}

async function getProductsByIds(productsIds) {
    try{
        return {
            msg: "Get Products By Ids Process Has Been Successfully !!",
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

async function getProductInfo(productId) {
    try {
        const productInfo = await productModel.findById(productId);
        if (productInfo) {
            return {
                msg: "Get Product Info Process Has Been Successfuly !!",
                error: false,
                data: {
                    productDetails: productInfo,
                    currentDate: new Date(),
                },
            }
        }
        return {
            msg: "Sorry, This Product It Not Exist !!",
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getProductsCount(filters) {
    try {
        return {
            msg: "Get Products Count Process Has Been Successfully !!",
            error: false,
            data: await productModel.countDocuments(filters),
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getFlashProductsCount(filters) {
    try {
        const currentDate = new Date();
        filters.startDiscountPeriod = { $lte: currentDate };
        filters.endDiscountPeriod = { $gte: currentDate };
        return {
            msg: "Get Flash Products Count Process Has Been Successfully !!",
            error: false,
            data: await productModel.countDocuments(filters),
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getAllFlashProductsInsideThePage(pageNumber, pageSize, filters, sortDetailsObject) {
    try {
        const currentDate = new Date();
        filters.startDiscountPeriod = { $lte: currentDate };
        filters.endDiscountPeriod = { $gte: currentDate };
        return {
            msg: `Get Flash Products Inside The Page: ${pageNumber} Process Has Been Successfully !!`,
            error: false,
            data: {
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

async function getAllProductsInsideThePage(pageNumber, pageSize, filters, sortDetailsObject) {
    try {
        return {
            msg: `Get Products Inside The Page: ${pageNumber} Process Has Been Successfully !!`,
            error: false,
            data: {
                products: await productModel.find(filters).sort(sortDetailsObject).skip((pageNumber - 1) * pageSize).limit(pageSize),
                currentDate: new Date()
            },
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getRelatedProductsInTheProduct(productId) {
    try {
        const productInfo = await productModel.findById(productId);
        if (productInfo) {
            return {
                msg: "Get Sample From Related Products In This Product Process Has Been Successfuly !!",
                error: false,
                data: await productModel.aggregate([
                    { $match: { category: productInfo.category, _id: { $ne: new mongoose.Types.ObjectId(productId) } } },
                    { $sample: { size: 10 } }
                ]),
            }
        }
        return {
            msg: "Sorry, This Product It Not Exist !!",
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getAllGalleryImages(authorizationId, productId) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            const product = await productModel.findOne({ _id: productId });
            if (product) {
                return {
                    msg: "Get All Gallery Images Process Has Been Successfully !!",
                    error: false,
                    data: product.galleryImagesPaths,
                }
            }
            return {
                msg: "Sorry, This Product Is Not Exist !!",
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

async function deleteProduct(authorizationId, productId) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            const productInfo = await productModel.findOneAndDelete({
                _id: productId,
            });
            if (productInfo) {
                return {
                    msg: "Deleting Product Process Has Been Successfuly !!",
                    error: false,
                    data: {
                        deletedProductImagePath: productInfo.imagePath,
                        galleryImagePathsForDeletedProduct: productInfo.galleryImagesPaths,
                    },
                }
            }
            return {
                msg: "Sorry, This Product Is Not Exist !!",
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

async function deleteImageFromProductGallery(authorizationId, productId, galleryImagePath) {
    try{
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            const product = await productModel.findById(productId);
            if (product) {
                await productModel.updateOne({ _id: productId }, { galleryImagesPaths: product.galleryImagesPaths.filter((path) => galleryImagePath !== path) });
                return {
                    msg: "Deleting Image From Product Gallery Process Has Been Successfully !!",
                    error: false,
                    data: product.imagePath,
                }
            }
            return {
                msg: "Sorry, This Product Is Not Exist !!",
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
    catch(err) {
        throw Error(err);
    }
}

async function updateProduct(authorizationId, productId, newData) {
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
                    msg: "Updating Product Process Has Been Successfully !!",
                    error: false,
                    data: {},
                }
            }
            return {
                msg: "Sorry, This Product Is Not Exist !!",
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

async function updateProductGalleryImage(authorizationId, productId, oldGalleryImagePath, newGalleryImagePath) {
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
                        msg: "Updating Product Galley Image Process Has Been Successfully !!",
                        error: false,
                        data: newGalleryImagePath,
                    }
                }
                return {
                    msg: "Sorry, This Path Is Not Found !!",
                    error: true,
                    data: {},
                }
            }
            return {
                msg: "Sorry, This Product Is Not Exist !!",
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
    catch(err) {
        throw Error(err);
    }
}

async function updateProductImage(authorizationId, productId, newProductImagePath) {
    try{
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            const product = await productModel.findOneAndUpdate({ _id: productId }, { imagePath: newProductImagePath });
            if (product) {
                return {
                    msg: "Change Product Image Process Has Been Successfully !!",
                    error: false,
                    data: {
                        deletedProductImagePath: product.imagePath,
                    },
                }
            }
            return {
                msg: "Sorry, This Product Is Not Exist !!",
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
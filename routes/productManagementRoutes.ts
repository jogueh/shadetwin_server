import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { addProductManually, addProductShadeManually, deleteProduct, deleteProductShade, getAllProducts, getAllProductShades } from '../controllers/productManagementController';

const router = express.Router();

router.post('/add-product-manually', asyncHandler(addProductManually));
router.post('/add-product-shade-manually', asyncHandler(addProductShadeManually));
router.get('/get-products', asyncHandler(getAllProducts));
router.get('/get-product-shades', asyncHandler(getAllProductShades));
router.post('/delete-product', asyncHandler(deleteProduct));
router.post('/delete-product-shade', asyncHandler(deleteProductShade));

export default router;
import { NextFunction, Request, Response } from "express";
import { ApiError } from "../errors/apiError";
import prisma from "../prisma";

export const addProductManually = async (req: Request, res: Response, next: NextFunction) => {
    const { name, brand, type, link, img_link, price } = req.body;
    try {
        // Validate required fields
        if (!name || !brand || !type || !link || !img_link || !price) {
            throw new ApiError(400, 'All fields are required');
        }

        // Create new product in the database
        const newProduct = await prisma.products.create({
            data: {
                name,
                brand,
                type,
                link,
                img_link,
                price
            }
        });

        res.status(201).json({ message: 'Product added successfully', product: newProduct });
    } catch (err) {
        if (err instanceof ApiError) {
            return next(err);
        }
        next(new ApiError(500, 'Failed to add product'));
    }
}

export const addProductShadeManually = async (req: Request, res: Response, next: NextFunction) => {
    const {productId, name, hex, r, g, b} = req.body;
    try {
        // Validate required fields
        if (!productId || !name || !hex || r === undefined || g === undefined || b === undefined) {
            throw new ApiError(400, 'All fields are required');
        }

        const product = await prisma.products.findUnique({
            where: { id: productId }
        });
        if (!product) {
            throw new ApiError(404, 'Product not found');
        }
        const existingShade = await prisma.shades.findFirst({
            where: {name}
        });
        if (existingShade) {
            throw new ApiError(400, 'A shade with this name already exists for this product');
        }
        // Create new product shade in the database
        const newShade = await prisma.shades.create({
            data: {
                product_id: productId,
                name,
                hex,
                r,
                g,
                b
            }
        });
        res.status(201).json({ message: 'Product shade added successfully', shade: newShade });
    }
    catch (err) {
        if (err instanceof ApiError) {
            return next(err);
        }
        next(new ApiError(500, 'Failed to add product shade'));
    }
}

export const addProductAutomatically = async (req: Request, res: Response, next: NextFunction) => {
    const {link} = req.body;
    // use AI to extract product details from the link
}

export const addProductShadeAutomatically = async (req: Request, res: Response, next: NextFunction) => {
    const {productId, link} = req.body;
    const product = await prisma.products.findUnique({
            where: { id: productId }
        });
    if (!product) {
        throw new ApiError(404, 'Product not found');
    }
    // use AI to extract shade details from the link
}

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Fetch all products from the database
        const products = await prisma.products.findMany();
        res.status(200).json(products);
    } catch (err) {
        if (err instanceof ApiError) {
            return next(err);
        }
        next(new ApiError(500, 'Failed to fetch products'));
    }
}

export const getAllProductShades = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const shades = await prisma.shades.findMany();
        res.status(200).json(shades);
    } catch (err) {
        if (err instanceof ApiError) {
            return next(err); 
        }
        next(new ApiError(500, 'Failed to fetch product shades'));
    }
}

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;
    try {
        // Validate product ID
        if (!productId) {
            throw new ApiError(400, 'Product ID is required');
        }

        // Delete product from the database
        const deletedProduct = await prisma.products.delete({
            where: { id: Number(productId) }
        });

        res.status(200).json({ message: 'Product deleted successfully', product: deletedProduct });
    } catch (err) {
        if (err instanceof ApiError) {
            return next(err);
        }
        next(new ApiError(500, 'Failed to delete product'));
    }
}

export const deleteProductShade = async (req: Request, res: Response, next: NextFunction) => {
    const { shadeId } = req.params;
    try {
        // Validate shade ID
        if (!shadeId) {
            throw new ApiError(400, 'Shade ID is required');
        }

        // Delete product shade from the database
        const deletedShade = await prisma.shades.delete({
            where: { id: Number(shadeId) }
        });

        res.status(200).json({ message: 'Product shade deleted successfully', shade: deletedShade });
    } catch (err) {
        if (err instanceof ApiError) {
            return next(err);
        }
        next(new ApiError(500, 'Failed to delete product shade'));
    }
}
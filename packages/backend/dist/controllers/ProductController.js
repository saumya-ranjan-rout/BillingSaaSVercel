"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const express_validator_1 = require("express-validator");
const logger_1 = __importDefault(require("../utils/logger"));
function getErrorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
class ProductController {
    constructor(productService, categoryService, cacheService) {
        this.productService = productService;
        this.categoryService = categoryService;
        this.cacheService = cacheService;
    }
    async createProduct(req, res) {
        const start = Date.now();
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty())
                return res.status(400).json({ errors: errors.array() });
            if (!req.user)
                return res.status(401).json({ error: 'Unauthorized' });
            const tenantId = req.user.tenantId;
            const product = await this.productService.createProduct(tenantId, req.body);
            await this.cacheService.invalidatePattern(`cache:${tenantId}:/api/products*`);
            logger_1.default.info(`Product created in ${Date.now() - start}ms`, { productId: product.id, tenantId });
            res.status(201).json(product);
        }
        catch (error) {
            logger_1.default.error('Error creating product:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async getProduct(req, res) {
        const start = Date.now();
        try {
            if (!req.user)
                return res.status(401).json({ error: 'Unauthorized' });
            const { id } = req.params;
            const tenantId = req.user.tenantId;
            const cacheKey = `product:${tenantId}:${id}`;
            const product = await this.cacheService.getOrSet(cacheKey, () => this.productService.getProduct(tenantId, id), 300);
            if (!product)
                return res.status(404).json({ error: 'Product not found' });
            logger_1.default.debug(`Product fetched in ${Date.now() - start}ms`, { id, tenantId });
            res.json(product);
        }
        catch (error) {
            logger_1.default.error('Error fetching product:', error);
            res.status(404).json({ error: getErrorMessage(error) });
        }
    }
    async getProducts(req, res) {
        const start = Date.now();
        try {
            if (!req.user)
                return res.status(401).json({ error: 'Unauthorized' });
            const tenantId = req.user.tenantId;
            const { page, limit, search, categoryId, type, stockStatus, isActive } = req.query;
            const options = {
                page: parseInt(page) || 1,
                limit: Math.min(100, parseInt(limit) || 10),
                search: search,
                categoryId: categoryId,
                type: type,
                stockStatus: stockStatus,
                isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined
            };
            const cacheKey = `products:${tenantId}:${JSON.stringify(options)}`;
            const products = await this.cacheService.getOrSet(cacheKey, () => this.productService.getProducts(tenantId, options), 60);
            logger_1.default.debug(`Products fetched in ${Date.now() - start}ms`, { tenantId, page: options.page, limit: options.limit });
            res.json(products);
        }
        catch (error) {
            logger_1.default.error('Error fetching products:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async updateProduct(req, res) {
        const start = Date.now();
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty())
                return res.status(400).json({ errors: errors.array() });
            if (!req.user)
                return res.status(401).json({ error: 'Unauthorized' });
            const { id } = req.params;
            const tenantId = req.user.tenantId;
            console.log("oye:", req.body);
            const product = await this.productService.updateProduct(tenantId, id, req.body);
            await Promise.all([
                this.cacheService.del(`products:${tenantId}:${id}`),
                this.cacheService.invalidatePattern(`products:${tenantId}:*`),
                this.cacheService.invalidatePattern(`cache:${tenantId}:/api/products*`)
            ]);
            logger_1.default.info(`Product updated in ${Date.now() - start}ms`, { id, tenantId });
            res.json(product);
        }
        catch (error) {
            logger_1.default.error('Error updating product:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async updateProductStock(req, res) {
        try {
            if (!req.user)
                return res.status(401).json({ error: 'Unauthorized' });
            const { id } = req.params;
            const { quantity, operation } = req.body;
            const tenantId = req.user.tenantId;
            const product = await this.productService.updateProductStock(tenantId, id, quantity, operation);
            await this.cacheService.del(`product:${tenantId}:${id}`);
            res.json(product);
        }
        catch (error) {
            logger_1.default.error('Error updating product stock:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async deleteProduct(req, res) {
        const start = Date.now();
        try {
            if (!req.user)
                return res.status(401).json({ error: 'Unauthorized' });
            const { id } = req.params;
            const tenantId = req.user.tenantId;
            await this.productService.deleteProduct(tenantId, id);
            await Promise.all([
                this.cacheService.del(`product:${tenantId}:${id}`),
                this.cacheService.invalidatePattern(`cache:${tenantId}:/api/products*`)
            ]);
            logger_1.default.info(`Product deleted in ${Date.now() - start}ms`, { id, tenantId });
            res.status(204).send();
        }
        catch (error) {
            logger_1.default.error('Error deleting product:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async searchProducts(req, res) {
        try {
            if (!req.user)
                return res.status(401).json({ error: 'Unauthorized' });
            const tenantId = req.user.tenantId;
            const { query } = req.query;
            const cacheKey = `products:search:${tenantId}:${query}`;
            const products = await this.cacheService.getOrSet(cacheKey, () => this.productService.searchProducts(tenantId, query), 60);
            res.json(products);
        }
        catch (error) {
            logger_1.default.error('Error searching products:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async getProductsByCategory(req, res) {
        try {
            if (!req.user)
                return res.status(401).json({ error: 'Unauthorized' });
            const { categoryId } = req.params;
            const tenantId = req.user.tenantId;
            const cacheKey = `products:category:${tenantId}:${categoryId}`;
            const products = await this.cacheService.getOrSet(cacheKey, () => this.productService.getProductsByCategory(tenantId, categoryId), 120);
            res.json(products);
        }
        catch (error) {
            logger_1.default.error('Error fetching products by category:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async getLowStockProducts(req, res) {
        try {
            if (!req.user)
                return res.status(401).json({ error: 'Unauthorized' });
            const tenantId = req.user.tenantId;
            const cacheKey = `products:lowstock:${tenantId}`;
            const products = await this.cacheService.getOrSet(cacheKey, () => this.productService.getLowStockProducts(tenantId), 180);
            res.json(products);
        }
        catch (error) {
            logger_1.default.error('Error fetching low stock products:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async getProductSummary(req, res) {
        try {
            if (!req.user)
                return res.status(401).json({ error: 'Unauthorized' });
            const tenantId = req.user.tenantId;
            const cacheKey = `products:summary:${tenantId}`;
            const summary = await this.cacheService.getOrSet(cacheKey, () => this.productService.getProductSummary(tenantId), 300);
            res.json(summary);
        }
        catch (error) {
            logger_1.default.error('Error fetching product summary:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async createCategory(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty())
                return res.status(400).json({ errors: errors.array() });
            if (!req.user)
                return res.status(401).json({ error: 'Unauthorized' });
            const tenantId = req.user.tenantId;
            const category = await this.categoryService.createCategory(tenantId, req.body);
            await this.cacheService.invalidatePattern(`cache:${tenantId}:/api/categories*`);
            res.status(201).json(category);
        }
        catch (error) {
            logger_1.default.error('Error creating category:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async getCategories(req, res) {
        try {
            if (!req.user)
                return res.status(401).json({ error: 'Unauthorized' });
            const tenantId = req.user.tenantId;
            const { page, limit, search, parentId, isActive } = req.query;
            const options = {
                page: parseInt(page) || 1,
                limit: Math.min(100, parseInt(limit) || 10),
                search: search,
                parentId: parentId,
                isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined
            };
            const cacheKey = `categories:${tenantId}:${JSON.stringify(options)}`;
            const categories = await this.cacheService.getOrSet(cacheKey, () => this.categoryService.getCategories(tenantId, options), 120);
            res.json(categories);
        }
        catch (error) {
            logger_1.default.error('Error fetching categories:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async getCategoryTree(req, res) {
        try {
            if (!req.user)
                return res.status(401).json({ error: 'Unauthorized' });
            const tenantId = req.user.tenantId;
            const cacheKey = `categories:tree:${tenantId}`;
            const categories = await this.cacheService.getOrSet(cacheKey, () => this.categoryService.getCategoryTree(tenantId), 300);
            res.json(categories);
        }
        catch (error) {
            logger_1.default.error('Error fetching category tree:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
    async deleteCategory(req, res) {
        try {
            if (!req.user)
                return res.status(401).json({ error: 'Unauthorized' });
            const { id } = req.params;
            const tenantId = req.user.tenantId;
            await this.categoryService.deleteCategory(tenantId, id);
            await this.cacheService.invalidatePattern(`cache:${tenantId}:/api/categories*`);
            res.status(204).send();
        }
        catch (error) {
            logger_1.default.error('Error deleting category:', error);
            res.status(400).json({ error: getErrorMessage(error) });
        }
    }
}
exports.ProductController = ProductController;
//# sourceMappingURL=ProductController.js.map
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ProductService } from '../services/product/ProductService';
import { CategoryService } from '../services/product/CategoryService';
import { ProductType, StockStatus } from '../entities/Product';
import { CacheService } from '../services/cache/CacheService';
import logger from '../utils/logger';
import { clearTenantCache } from '../utils/cacheUtils';
function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export class ProductController {
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cacheService: CacheService
  ) {}

  async createProduct(req: Request, res: Response) {
    const start = Date.now();
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

      const tenantId = req.user.tenantId;
      const product = await this.productService.createProduct(tenantId, req.body);

      // Invalidate related cache
      // await this.cacheService.invalidatePattern(`products:${tenantId}:*`);
      await this.cacheService.invalidatePattern(`cache:${tenantId}:/api/products*`);


      logger.info(`Product created in ${Date.now() - start}ms`, { productId: product.id, tenantId });
      res.status(201).json(product);
    } catch (error) {
      logger.error('Error creating product:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  async getProduct(req: Request, res: Response) {
    const start = Date.now();
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const { id } = req.params;
      const tenantId = req.user.tenantId;

      const cacheKey = `product:${tenantId}:${id}`;
      const product = await this.cacheService.getOrSet(
        cacheKey,
        () => this.productService.getProduct(tenantId, id),
        300
      );

      if (!product) return res.status(404).json({ error: 'Product not found' });

      logger.debug(`Product fetched in ${Date.now() - start}ms`, { id, tenantId });
      res.json(product);
    } catch (error) {
      logger.error('Error fetching product:', error);
      res.status(404).json({ error: getErrorMessage(error) });
    }
  }

  async getProducts(req: Request, res: Response) {
    const start = Date.now();
   // console.log("Hi ProductController getProducts");
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

      const tenantId = req.user.tenantId;

      //console.log("Hi ProductController getProducts tenantId:", tenantId);
      const { page, limit, search, categoryId, type, stockStatus, isActive } = req.query;

      const options = {
        page: parseInt(page as string) || 1,
        limit: Math.min(100, parseInt(limit as string) || 10),
        search: search as string,
        categoryId: categoryId as string,
        type: type as ProductType,
        stockStatus: stockStatus as StockStatus,
        isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined
      };

      const cacheKey = `products:${tenantId}:${JSON.stringify(options)}`;
      const products = await this.cacheService.getOrSet(
        cacheKey,
        () => this.productService.getProducts(tenantId, options),
        60
      );

      logger.debug(`Products fetched in ${Date.now() - start}ms`, { tenantId, page: options.page, limit: options.limit });
      res.json(products);
    } catch (error) {
      logger.error('Error fetching products:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  async updateProduct(req: Request, res: Response) {
    const start = Date.now();
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

      const { id } = req.params;
      const tenantId = req.user.tenantId;
      const product = await this.productService.updateProduct(tenantId, id, req.body);

      await Promise.all([
        this.cacheService.del(`products:${tenantId}:${id}`),
        this.cacheService.invalidatePattern(`products:${tenantId}:*`),
       this.cacheService.invalidatePattern(`cache:${tenantId}:/api/products*`)
      ]);


      logger.info(`Product updated in ${Date.now() - start}ms`, { id, tenantId });
      res.json(product);
    } catch (error) {
      logger.error('Error updating product:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  async updateProductStock(req: Request, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

      const { id } = req.params;
      const { quantity, operation } = req.body;
      const tenantId = req.user.tenantId;

      const product = await this.productService.updateProductStock(tenantId, id, quantity, operation);

      await this.cacheService.del(`product:${tenantId}:${id}`);

      res.json(product);
    } catch (error) {
      logger.error('Error updating product stock:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  async deleteProduct(req: Request, res: Response) {
    const start = Date.now();
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const { id } = req.params;
      const tenantId = req.user.tenantId;

      await this.productService.deleteProduct(tenantId, id);

 await Promise.all([
        this.cacheService.del(`product:${tenantId}:${id}`),
       // this.cacheService.invalidatePattern(`products:${tenantId}:*`)
       this.cacheService.invalidatePattern(`cache:${tenantId}:/api/products*`)
      ]);


      logger.info(`Product deleted in ${Date.now() - start}ms`, { id, tenantId });
      res.status(204).send();
    } catch (error) {
      logger.error('Error deleting product:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  async searchProducts(req: Request, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const tenantId = req.user.tenantId;
      const { query } = req.query;

      const cacheKey = `products:search:${tenantId}:${query}`;
      const products = await this.cacheService.getOrSet(
        cacheKey,
        () => this.productService.searchProducts(tenantId, query as string),
        60
      );

      res.json(products);
    } catch (error) {
      logger.error('Error searching products:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  async getProductsByCategory(req: Request, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const { categoryId } = req.params;
      const tenantId = req.user.tenantId;

      const cacheKey = `products:category:${tenantId}:${categoryId}`;
      const products = await this.cacheService.getOrSet(
        cacheKey,
        () => this.productService.getProductsByCategory(tenantId, categoryId),
        120
      );

      res.json(products);
    } catch (error) {
      logger.error('Error fetching products by category:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  async getLowStockProducts(req: Request, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const tenantId = req.user.tenantId;

      const cacheKey = `products:lowstock:${tenantId}`;
      const products = await this.cacheService.getOrSet(
        cacheKey,
        () => this.productService.getLowStockProducts(tenantId),
        180
      );

      res.json(products);
    } catch (error) {
      logger.error('Error fetching low stock products:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  async getProductSummary(req: Request, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const tenantId = req.user.tenantId;

      const cacheKey = `products:summary:${tenantId}`;
      const summary = await this.cacheService.getOrSet(
        cacheKey,
        () => this.productService.getProductSummary(tenantId),
        300
      );

      res.json(summary);
    } catch (error) {
      logger.error('Error fetching product summary:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  // ---------------- Category Methods ----------------
  async createCategory(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

      const tenantId = req.user.tenantId;
      const category = await this.categoryService.createCategory(tenantId, req.body);

      // await this.cacheService.invalidatePattern(`categories:${tenantId}:*`);
              await this.cacheService.invalidatePattern(`cache:${tenantId}:/api/categories*`)

      res.status(201).json(category);
    } catch (error) {
      logger.error('Error creating category:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  async getCategories(req: Request, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const tenantId = req.user.tenantId;
      const { page, limit, search, parentId, isActive } = req.query;

      const options = {
        page: parseInt(page as string) || 1,
        limit: Math.min(100, parseInt(limit as string) || 10),
        search: search as string,
        parentId: parentId as string,
        isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined
      };

      const cacheKey = `categories:${tenantId}:${JSON.stringify(options)}`;
      const categories = await this.cacheService.getOrSet(
        cacheKey,
        () => this.categoryService.getCategories(tenantId, options),
        120
      );

      res.json(categories);
    } catch (error) {
      logger.error('Error fetching categories:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  async getCategoryTree(req: Request, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const tenantId = req.user.tenantId;

      const cacheKey = `categories:tree:${tenantId}`;
      const categories = await this.cacheService.getOrSet(
        cacheKey,
        () => this.categoryService.getCategoryTree(tenantId),
        300
      );

      res.json(categories);
    } catch (error) {
      logger.error('Error fetching category tree:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  async deleteCategory(req: Request, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const { id } = req.params;
      const tenantId = req.user.tenantId;

      await this.categoryService.deleteCategory(tenantId, id);
      //await this.cacheService.invalidatePattern(`categories:${tenantId}:*`);
            await this.cacheService.invalidatePattern(`cache:${tenantId}:/api/categories*`)

      res.status(204).send();
    } catch (error) {
      logger.error('Error deleting category:', error);
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }
}































// import { Request, Response } from 'express';
// import { validationResult } from 'express-validator';
// import { ProductService } from '../services/product/ProductService';
// import { CategoryService } from '../services/product/CategoryService';
// import { ProductType, StockStatus } from '../entities/Product';
// import logger from '../utils/logger';

// function getErrorMessage(error: unknown): string {
//   if (error instanceof Error) {
//     return error.message;
//   }
//   return String(error);
// }

// export class ProductController {
//   constructor(
//     private productService: ProductService,
//     private categoryService: CategoryService
//   ) {}

//   async createProduct(req: Request, res: Response) {
//     try {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//       }

//       if (!req.user) {
//         return res.status(401).json({ error: 'Unauthorized' });
//       }

//       const tenantId = req.user.tenantId;
//       const productData = req.body;
//       const product = await this.productService.createProduct(tenantId, productData);
//       res.status(201).json(product);
//     } catch (error) {
//       logger.error('Error creating product:', error);
//       res.status(400).json({ error: getErrorMessage(error) });
//     }
//   }

//   async getProduct(req: Request, res: Response) {
//     try {
//       if (!req.user) {
//         return res.status(401).json({ error: 'Unauthorized' });
//       }

//       const { id } = req.params;
//       const tenantId = req.user.tenantId;
//       const product = await this.productService.getProduct(tenantId, id);
//       res.json(product);
//     } catch (error) {
//       logger.error('Error fetching product:', error);
//       res.status(404).json({ error: getErrorMessage(error) });
//     }
//   }

//   async getProducts(req: Request, res: Response) {
//     try {
//       if (!req.user) {
//         return res.status(401).json({ error: 'Unauthorized' });
//       }

//       const tenantId = req.user.tenantId;
//       const { page, limit, search, categoryId, type, stockStatus, isActive } = req.query;
//       const options = {
//         page: parseInt(page as string) || 1,
//         limit: parseInt(limit as string) || 10,
//         search: search as string,
//         categoryId: categoryId as string,
//         type: type as ProductType,
//         stockStatus: stockStatus as StockStatus,
//         isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined
//       };
//       const products = await this.productService.getProducts(tenantId, options);
//       res.json(products);
//     } catch (error) {
//       logger.error('Error fetching products:', error);
//       res.status(400).json({ error: getErrorMessage(error) });
//     }
//   }

//   async updateProduct(req: Request, res: Response) {
//     try {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//       }

//       if (!req.user) {
//         return res.status(401).json({ error: 'Unauthorized' });
//       }

//       const { id } = req.params;
//       const tenantId = req.user.tenantId;
//       const updates = req.body;
//       const product = await this.productService.updateProduct(tenantId, id, updates);
//       res.json(product);
//     } catch (error) {
//       logger.error('Error updating product:', error);
//       res.status(400).json({ error: getErrorMessage(error) });
//     }
//   }

//   async updateProductStock(req: Request, res: Response) {
//     try {
//       if (!req.user) {
//         return res.status(401).json({ error: 'Unauthorized' });
//       }

//       const { id } = req.params;
//       const { quantity, operation } = req.body;
//       const tenantId = req.user.tenantId;
      
//       const product = await this.productService.updateProductStock(tenantId, id, quantity, operation);
//       res.json(product);
//     } catch (error) {
//       logger.error('Error updating product stock:', error);
//       res.status(400).json({ error: getErrorMessage(error) });
//     }
//   }

//   async deleteProduct(req: Request, res: Response) {
//     try {
//       if (!req.user) {
//         return res.status(401).json({ error: 'Unauthorized' });
//       }

//       const { id } = req.params;
//       const tenantId = req.user.tenantId;
//       await this.productService.deleteProduct(tenantId, id);
//       res.status(204).send();
//     } catch (error) {
//       logger.error('Error deleting product:', error);
//       res.status(400).json({ error: getErrorMessage(error) });
//     }
//   }

//   async searchProducts(req: Request, res: Response) {
//     try {
//       if (!req.user) {
//         return res.status(401).json({ error: 'Unauthorized' });
//       }

//       const tenantId = req.user.tenantId;
//       const { query } = req.query;
//       const products = await this.productService.searchProducts(tenantId, query as string);
//       res.json(products);
//     } catch (error) {
//       logger.error('Error searching products:', error);
//       res.status(400).json({ error: getErrorMessage(error) });
//     }
//   }

//   async getProductsByCategory(req: Request, res: Response) {
//     try {
//       if (!req.user) {
//         return res.status(401).json({ error: 'Unauthorized' });
//       }

//       const { categoryId } = req.params;
//       const tenantId = req.user.tenantId;
//       const products = await this.productService.getProductsByCategory(tenantId, categoryId);
//       res.json(products);
//     } catch (error) {
//       logger.error('Error fetching products by category:', error);
//       res.status(400).json({ error: getErrorMessage(error) });
//     }
//   }

//   async getLowStockProducts(req: Request, res: Response) {
//     try {
//       if (!req.user) {
//         return res.status(401).json({ error: 'Unauthorized' });
//       }

//       const tenantId = req.user.tenantId;
//       const products = await this.productService.getLowStockProducts(tenantId);
//       res.json(products);
//     } catch (error) {
//       logger.error('Error fetching low stock products:', error);
//       res.status(400).json({ error: getErrorMessage(error) });
//     }
//   }

//   async getProductSummary(req: Request, res: Response) {
//     try {
//       if (!req.user) {
//         return res.status(401).json({ error: 'Unauthorized' });
//       }

//       const tenantId = req.user.tenantId;
//       const summary = await this.productService.getProductSummary(tenantId);
//       res.json(summary);
//     } catch (error) {
//       logger.error('Error fetching product summary:', error);
//       res.status(400).json({ error: getErrorMessage(error) });
//     }
//   }

//   // Category methods
//   async createCategory(req: Request, res: Response) {
//     try {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//       }

//       if (!req.user) {
//         return res.status(401).json({ error: 'Unauthorized' });
//       }

//       const tenantId = req.user.tenantId;
//       const categoryData = req.body;
//       const category = await this.categoryService.createCategory(tenantId, categoryData);
//       res.status(201).json(category);
//     } catch (error) {
//       logger.error('Error creating category:', error);
//       res.status(400).json({ error: getErrorMessage(error) });
//     }
//   }

//   async getCategories(req: Request, res: Response) {
//     console.log("Hi CategoryController getCategories");
//     try {
//       if (!req.user) {
//         return res.status(401).json({ error: 'Unauthorized' });
//       }

//       const tenantId = req.user.tenantId;
//       const { page, limit, search, parentId, isActive } = req.query;
//       const options = {
//         page: parseInt(page as string) || 1,
//         limit: parseInt(limit as string) || 10,
//         search: search as string,
//         parentId: parentId as string,
//         isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined
//       };
//       const categories = await this.categoryService.getCategories(tenantId, options);
//       res.json(categories);
//     } catch (error) {
//       logger.error('Error fetching categories:', error);
//       res.status(400).json({ error: getErrorMessage(error) });
//     }
//   }

//   async getCategoryTree(req: Request, res: Response) {
//     try {
//       if (!req.user) {
//         return res.status(401).json({ error: 'Unauthorized' });
//       }

//       const tenantId = req.user.tenantId;
//       const categories = await this.categoryService.getCategoryTree(tenantId);
//       res.json(categories);
//     } catch (error) {
//       logger.error('Error fetching category tree:', error);
//       res.status(400).json({ error: getErrorMessage(error) });
//     }
//   }

//   async deleteCategory(req: Request, res: Response) {
//     try {
//       if (!req.user) {
//         return res.status(401).json({ error: 'Unauthorized' });
//       }

//       const { id } = req.params;
//       const tenantId = req.user.tenantId;
//       await this.categoryService.deleteCategory(tenantId, id);
//       res.status(204).send();
//     } catch (error) {
//       logger.error('Error deleting category:', error);
//       res.status(400).json({ error: getErrorMessage(error) });
//     }
//   }
// }

import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { ProductService } from '../services/product/ProductService';
import { CategoryService } from '../services/product/CategoryService';
import { CacheService } from '../services/cache/CacheService';  // ✅ import
import { authMiddleware } from '../middleware/auth';
import { tenantMiddleware } from '../middleware/tenant';
import { rbacMiddleware } from '../middleware/rbac';
import { validationMiddleware } from '../middleware/validation';
import { productSchema, categorySchema } from '../utils/validators';
import { cacheMiddleware } from '../middleware/cache'; // ✅ import cache
import { checkSubscription } from '../middleware/checkSubscription';

const router = Router();
const productService = new ProductService();
const categoryService = new CategoryService();
const cacheService = new CacheService();   // ✅ create instance

const productController = new ProductController(productService, categoryService, cacheService); // ✅ pass to controller

// All routes require authentication and tenant context
router.use(authMiddleware, tenantMiddleware, checkSubscription);

// Product routes
router.post(
  '/',
  rbacMiddleware(['create:products']),
  validationMiddleware(productSchema),
  productController.createProduct.bind(productController)
);

router.get(
  '/',
  rbacMiddleware(['read:products']),
  cacheMiddleware('3m'), // ✅ cache products list
  productController.getProducts.bind(productController)
);

router.get(
  '/search',
  rbacMiddleware(['read:products']),
  cacheMiddleware('2m'), // ✅ short cache for searches
  productController.searchProducts.bind(productController)
);

router.get(
  '/low-stock',
  rbacMiddleware(['read:products']),
  cacheMiddleware('1m'), // ✅ stock levels can change quickly
  productController.getLowStockProducts.bind(productController)
);

router.get(
  '/summary',
  rbacMiddleware(['read:products']),
  cacheMiddleware('5m'), // ✅ summary doesn’t change very often
  productController.getProductSummary.bind(productController)
);

router.get(
  '/category/:categoryId',
  rbacMiddleware(['read:products']),
  cacheMiddleware('3m'),
  productController.getProductsByCategory.bind(productController)
);

router.get(
  '/categories',
  rbacMiddleware(['read:products']),
  cacheMiddleware('10m'), // ✅ categories change rarely
  productController.getCategories.bind(productController)
);

router.get(
  '/categories/tree',
  rbacMiddleware(['read:products']),
  cacheMiddleware('10m'),
  productController.getCategoryTree.bind(productController)
);

router.delete(
  '/categories/:id',
  rbacMiddleware(['delete:products']),
  productController.deleteCategory.bind(productController)
);

router.get(
  '/:id',
  rbacMiddleware(['read:products']),
  cacheMiddleware('2m'),
  productController.getProduct.bind(productController)
);

router.put(
  '/:id',
  rbacMiddleware(['update:products']),
  validationMiddleware(productSchema),
  productController.updateProduct.bind(productController)
);

router.patch(
  '/:id/stock',
  rbacMiddleware(['update:products']),
  productController.updateProductStock.bind(productController)
);

router.delete(
  '/:id',
  rbacMiddleware(['delete:products']),
  productController.deleteProduct.bind(productController)
);

// Category routes
router.post(
  '/categories',
  rbacMiddleware(['create:products']),
  validationMiddleware(categorySchema),
  productController.createCategory.bind(productController)
);

export default router;



// import { Router } from 'express';
// import { ProductController } from '../controllers/ProductController';
// import { ProductService } from '../services/product/ProductService';
// import { CategoryService } from '../services/product/CategoryService';
// import { authMiddleware } from '../middleware/auth';
// import { tenantMiddleware } from '../middleware/tenant';
// import { rbacMiddleware } from '../middleware/rbac';
// import { validationMiddleware } from '../middleware/validation';
// import { productSchema, categorySchema } from '../utils/validators';

// const router = Router();
// const productService = new ProductService();
// const categoryService = new CategoryService();
// const productController = new ProductController(productService, categoryService);

// // All routes require authentication and tenant context
// router.use(authMiddleware, tenantMiddleware);

// // Product routes
// router.post(
//   '/',
//   rbacMiddleware(['create:products']),
//   validationMiddleware(productSchema),
//   productController.createProduct.bind(productController)
// );

// router.get(
//   '/',
//   rbacMiddleware(['read:products']),
//   productController.getProducts.bind(productController)
// );

// router.get(
//   '/search',
//   rbacMiddleware(['read:products']),
//   productController.searchProducts.bind(productController)
// );

// router.get(
//   '/low-stock',
//   rbacMiddleware(['read:products']),
//   productController.getLowStockProducts.bind(productController)
// );

// router.get(
//   '/summary',
//   rbacMiddleware(['read:products']),
//   productController.getProductSummary.bind(productController)
// );

// router.get(
//   '/category/:categoryId',
//   rbacMiddleware(['read:products']),
//   productController.getProductsByCategory.bind(productController)
// );

// router.get(
//   '/categories',
//   rbacMiddleware(['read:products']),
//   productController.getCategories.bind(productController)
// );

// router.get(
//   '/categories/tree',
//   rbacMiddleware(['read:products']),
//   productController.getCategoryTree.bind(productController)
// );

// router.delete(
//   '/categories/:id',
//   rbacMiddleware(['delete:products']),
//   productController.deleteCategory.bind(productController)
// );

// router.get(
//   '/:id',
//   rbacMiddleware(['read:products']),
//   productController.getProduct.bind(productController)
// );

// router.put(
//   '/:id',
//   rbacMiddleware(['update:products']),
//   validationMiddleware(productSchema),
//   productController.updateProduct.bind(productController)
// );

// router.patch(
//   '/:id/stock',
//   rbacMiddleware(['update:products']),
//   productController.updateProductStock.bind(productController)
// );

// router.delete(
//   '/:id',
//   rbacMiddleware(['delete:products']),
//   productController.deleteProduct.bind(productController)
// );

// // Category routes
// router.post(
//   '/categories',
//   rbacMiddleware(['create:products']),
//   validationMiddleware(categorySchema),
//   productController.createCategory.bind(productController)
// );



// export default router;

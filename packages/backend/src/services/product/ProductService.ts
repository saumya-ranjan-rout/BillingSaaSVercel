import { Repository, ILike, In, FindOptionsWhere, IsNull } from 'typeorm'; 
import { AppDataSource } from '../../config/database'; 
import { Product, ProductType, StockStatus } from '../../entities/Product'; 
import { Category } from '../../entities/Category'; 
import logger from '../../utils/logger'; 
import { PaginatedResponse } from '../../types/customTypes'; 
// Extended interface for product creation that includes category name 
interface CreateProductData extends Partial<Product> { 
categoryName?: string; 
} 
interface UpdateProductData { 
categoryName?: string; 
categoryId?: string; 
[key: string]: any; 
} 
export class ProductService { 
private productRepository: Repository<Product>; 
private categoryRepository: Repository<Category>; 
  constructor() { 
    this.productRepository = AppDataSource.getRepository(Product); 
    this.categoryRepository = AppDataSource.getRepository(Category); 
  } 
 
  private calculateStockStatus(stockQuantity: number, lowStockThreshold: number): 
StockStatus { 
    if (stockQuantity <= 0) return StockStatus.OUT_OF_STOCK; 
    if (stockQuantity <= lowStockThreshold) return StockStatus.LOW_STOCK; 
    return StockStatus.IN_STOCK; 
  } 
 
  /** 
   * Find or create a category for a tenant 
   */ 
  private async findOrCreateCategory(tenantId: string, categoryName: string): 
Promise<Category> { 
    try { 
      // First, try to find existing category by name for this tenant 
      let category = await this.categoryRepository.findOne({ 
        where: {  
          name: ILike(`%${categoryName}%`),  
          tenantId,  
          deletedAt: IsNull()  
        } 
      }); 
 
      // If category doesn't exist, create a new one 
      if (!category) { 
        category = this.categoryRepository.create({ 
          name: categoryName.trim(), 
          description: `Automatically created category for ${categoryName}`, 
          tenantId, 
          isActive: true 
        }); 
        category = await this.categoryRepository.save(category); 
        logger.info(`Auto-created category: ${categoryName} for tenant: ${tenantId}`); 
      } 
 
      return category; 
    } catch (error) { 
      logger.error('Error in findOrCreateCategory:', error); 
      throw error; 
    } 
  } 
 
  async createProduct(tenantId: string, productData: CreateProductData): 
Promise<Product> { 
    try { 
      const { categoryName, ...productFields } = productData; 
 
      let finalCategoryId: string | undefined = productFields.categoryId; 
 
      // Handle automatic category creation if categoryName is provided 
      if (categoryName && !productFields.categoryId) { 
        const category = await this.findOrCreateCategory(tenantId, categoryName); 
        finalCategoryId = category.id; 
      } 
 
      // Validate category exists if we have a categoryId (either provided or auto-created) 
      if (finalCategoryId) { 
        const category = await this.categoryRepository.findOne({ 
          where: { id: finalCategoryId, tenantId, deletedAt: IsNull() } 
        }); 
        if (!category) { 
          throw new Error('Category not found'); 
        } 
        // Update the product fields with the validated categoryId 
        productFields.categoryId = finalCategoryId; 
      } 
 
      // Check if product with same SKU already exists for this tenant 
      if (productFields.sku) { 
        const existingProduct = await this.productRepository.findOne({ 
          where: { sku: productFields.sku, tenantId, deletedAt: IsNull() } 
        }); 
        if (existingProduct) { 
          throw new Error('Product with this SKU already exists'); 
        } 
      } 
 
      const stockStatus = this.calculateStockStatus( 
        productFields.stockQuantity || 0, 
        productFields.lowStockThreshold || 0 
      ); 
 
      const product = this.productRepository.create({ 
        ...productFields, 
        stockStatus, 
        tenantId 
      }); 
 
      const savedProduct = await this.productRepository.save(product); 
      return savedProduct; 
    } catch (error) { 
      logger.error('Error creating product:', error); 
      throw error; 
    } 
  } 
 
  async getProduct(tenantId: string, productId: string): Promise<Product> { 
    try { 
      const product = await this.productRepository.findOne({ 
        where: { id: productId, tenantId, deletedAt: IsNull() }, 
        relations: ['category'] 
      }); 
      if (!product) { 
        throw new Error('Product not found'); 
      } 
      return product; 
    } catch (error) { 
      logger.error('Error fetching product:', error); 
      throw error; 
    } 
  } 
 
  async getProducts(tenantId: string, options: { 
    page: number; 
    limit: number; 
    search?: string; 
    categoryId?: string; 
    type?: ProductType; 
    stockStatus?: StockStatus; 
    isActive?: boolean; 
  }): Promise<PaginatedResponse<Product>> { 
    try { 
      const { page, limit, search, categoryId, type, stockStatus, isActive } = options; 
      const skip = (page - 1) * limit; 
 
      let whereConditions: FindOptionsWhere<Product> | FindOptionsWhere<Product>[] = {  
        tenantId,  
        deletedAt: IsNull()  
      }; 
 
      if (categoryId) { 
        whereConditions.categoryId = categoryId; 
      } 
      if (type) { 
        whereConditions.type = type; 
      } 
      if (stockStatus) { 
        whereConditions.stockStatus = stockStatus; 
      } 
      if (isActive !== undefined) { 
        whereConditions.isActive = isActive; 
      } 
 
      if (search) { 
        whereConditions = [ 
          { ...whereConditions as FindOptionsWhere<Product>, name: ILike(`%${search}%`) }, 
          { ...whereConditions as FindOptionsWhere<Product>, sku: ILike(`%${search}%`) }, 
          { ...whereConditions as FindOptionsWhere<Product>, description: 
ILike(`%${search}%`) } 
        ] as FindOptionsWhere<Product>[]; 
      } 
 
      const [products, total] = await this.productRepository.findAndCount({ 
        where: whereConditions, 
        relations: ['category'], 
        skip, 
        take: limit, 
        order: { createdAt: 'DESC' } 
      }); 
 
      return { 
        data: products, 
        pagination: { 
          page, 
          limit, 
          total, 
          pages: Math.ceil(total / limit) 
        } 
      }; 
    } catch (error) { 
      logger.error('Error fetching products:', error); 
      throw error; 
    } 
  } 
 
  async updateProduct(tenantId: string, productId: string, updates: UpdateProductData): 
Promise<Product> { 
    try { 
      const product = await this.getProduct(tenantId, productId); 
 
      const { categoryName, ...updateFields } = updates; 
 
      let finalCategoryId: string | undefined = updateFields.categoryId; 
 
      // Handle automatic category creation if categoryName is provided 
      if (categoryName && !updateFields.categoryId) { 
        const category = await this.findOrCreateCategory(tenantId, categoryName); 
        finalCategoryId = category.id; 
      } 
 
      // Validate category exists if we have a categoryId (either provided or auto-created) 
      if (finalCategoryId) { 
        const category = await this.categoryRepository.findOne({ 
          where: { id: finalCategoryId, tenantId, deletedAt: IsNull() } 
        }); 
        if (!category) { 
          throw new Error('Category not found'); 
        } 
        // Update the update fields with the validated categoryId 
        updateFields.categoryId = finalCategoryId; 
      } 
 
      // Check if SKU is being changed and if it's already taken 
      if (updateFields.sku && updateFields.sku !== product.sku) { 
        const existingProduct = await this.productRepository.findOne({ 
          where: { sku: updateFields.sku, tenantId, deletedAt: IsNull() } 
        }); 
        if (existingProduct && existingProduct.id !== productId) { 
          throw new Error('Product with this SKU already exists'); 
        } 
      } 
 
      // Update stock status if stock quantity or threshold changes 
      if (updateFields.stockQuantity !== undefined || updateFields.lowStockThreshold !== 
undefined) { 
        const stockQuantity = updateFields.stockQuantity !== undefined ? 
updateFields.stockQuantity : product.stockQuantity; 
        const lowStockThreshold = updateFields.lowStockThreshold !== undefined ? 
updateFields.lowStockThreshold : product.lowStockThreshold; 
        updateFields.stockStatus = this.calculateStockStatus(stockQuantity, 
lowStockThreshold); 
      } 
 
      Object.assign(product, updateFields); 
      return await this.productRepository.save(product); 
    } catch (error) { 
      logger.error('Error updating product:', error); 
      throw error; 
    } 
  } 
 
  async updateProductStock(tenantId: string, productId: string, quantity: number, 
operation: 'add' | 'subtract'): Promise<Product> { 
    const queryRunner = AppDataSource.createQueryRunner(); 
    await queryRunner.connect(); 
    await queryRunner.startTransaction(); 
 
    try { 
      const product = await this.getProduct(tenantId, productId); 
 
      if (product.type !== ProductType.GOODS) { 
        throw new Error('Only goods products can have stock updated'); 
      } 
 
      let newStockQuantity = product.stockQuantity; 
      if (operation === 'add') { 
        newStockQuantity += quantity; 
      } else if (operation === 'subtract') { 
        if (product.stockQuantity < quantity) { 
          throw new Error('Insufficient stock'); 
        } 
        newStockQuantity -= quantity; 
      } 
 
      product.stockQuantity = newStockQuantity; 
      product.stockStatus = this.calculateStockStatus(newStockQuantity, 
product.lowStockThreshold); 
 
const updatedProduct = await queryRunner.manager.save(product); 
await queryRunner.commitTransaction(); 
return updatedProduct; 
} catch (error) { 
await queryRunner.rollbackTransaction(); 
logger.error('Error updating product stock:', error); 
throw error; 
} finally { 
await queryRunner.release(); 
} 
} 
async deleteProduct(tenantId: string, productId: string): Promise<void> { 
try { 
const product = await this.getProduct(tenantId, productId); 
// Soft delete: set deletedAt timestamp 
product.deletedAt = new Date(); 
await this.productRepository.save(product); 
} catch (error) { 
logger.error('Error deleting product:', error); 
throw error; 
} 
} 
async searchProducts(tenantId: string, query: string): Promise<Product[]> { 
try { 
      if (!query || query.length < 2) { 
        throw new Error('Search query must be at least 2 characters long'); 
      } 
 
      const products = await this.productRepository.find({ 
        where: [ 
          { tenantId, name: ILike(`%${query}%`), deletedAt: IsNull() }, 
          { tenantId, sku: ILike(`%${query}%`), deletedAt: IsNull() }, 
          { tenantId, description: ILike(`%${query}%`), deletedAt: IsNull() } 
        ], 
        take: 10, 
        relations: ['category'] 
      }); 
 
      return products; 
    } catch (error) { 
      logger.error('Error searching products:', error); 
      throw error; 
    } 
  } 
 
  async getProductsByCategory(tenantId: string, categoryId: string): Promise<Product[]> { 
    try { 
      const products = await this.productRepository.find({ 
        where: { tenantId, categoryId, deletedAt: IsNull(), isActive: true }, 
        relations: ['category'], 
        order: { name: 'ASC' } 
      }); 
      return products; 
    } catch (error) { 
      logger.error('Error fetching products by category:', error); 
      throw error; 
    } 
  } 
 
  async getLowStockProducts(tenantId: string): Promise<Product[]> { 
    try { 
      const products = await this.productRepository.find({ 
        where: { 
          tenantId, 
          stockStatus: StockStatus.LOW_STOCK, 
          deletedAt: IsNull(), 
          isActive: true 
        }, 
        relations: ['category'], 
        order: { stockQuantity: 'ASC' } 
      }); 
      return products; 
    } catch (error) { 
      logger.error('Error fetching low stock products:', error); 
      throw error; 
    } 
  } 
 
  async getProductSummary(tenantId: string): Promise<any> { 
    try { 
      const summary = await this.productRepository 
        .createQueryBuilder('product') 
        .select('product.type', 'type') 
        .addSelect('COUNT(product.id)', 'count') 
        .addSelect('SUM(product.stockQuantity)', 'totalStock') 
        .addSelect('SUM(product.stockQuantity * product.costPrice)', 'totalInventoryValue') 
        .where('product.tenantId = :tenantId', { tenantId }) 
        .andWhere('product.deletedAt IS NULL') 
        .andWhere('product.isActive = true') 
        .groupBy('product.type') 
        .getRawMany(); 
 
      return summary; 
    } catch (error) { 
      logger.error('Error fetching product summary:', error); 
      throw error; 
    } 
  } 
}
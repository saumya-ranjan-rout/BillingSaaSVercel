import { Repository, ILike, TreeRepository, IsNull } from 'typeorm';
import { AppDataSource } from '../../config/database';
import { Category } from '../../entities/Category';
import { Product } from '../../entities/Product';
import logger from '../../utils/logger';
import { PaginatedResponse } from '../../types/customTypes';

export class CategoryService {
  private categoryRepository: Repository<Category>;
  private productRepository: Repository<Product>;

  constructor() {
    this.categoryRepository = AppDataSource.getRepository(Category);
    this.productRepository = AppDataSource.getRepository(Product);
  }

  async createCategory(tenantId: string, categoryData: Partial<Category>): Promise<Category> {
    try {
      // Validate parent category exists if provided
      if (categoryData.parentId) {
        const parentCategory = await this.categoryRepository.findOne({
          where: { id: categoryData.parentId, tenantId, deletedAt: IsNull() }
        });
        if (!parentCategory) {
          throw new Error('Parent category not found');
        }
      }

      // Check if category with same name already exists for this tenant
      const existingCategory = await this.categoryRepository.findOne({
        where: { name: categoryData.name, tenantId, deletedAt: IsNull() }
      });
      if (existingCategory) {
        throw new Error('Category with this name already exists');
      }

      const category = this.categoryRepository.create({
        ...categoryData,
        tenantId
      });

      const savedCategory = await this.categoryRepository.save(category);
      return savedCategory;
    } catch (error) {
      logger.error('Error creating category:', error);
      throw error;
    }
  }

  async getCategory(tenantId: string, categoryId: string): Promise<Category> {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id: categoryId, tenantId, deletedAt: IsNull() },
        relations: ['parent', 'children']
      });

      if (!category) {
        throw new Error('Category not found');
      }

      return category;
    } catch (error) {
      logger.error('Error fetching category:', error);
      throw error;
    }
  }

  async getCategories(tenantId: string, options: {
    page: number;
    limit: number;
    search?: string;
    parentId?: string;
    isActive?: boolean;
  }): Promise<PaginatedResponse<Category>> {
    try {
      const { page, limit, search, parentId, isActive } = options;
      const skip = (page - 1) * limit;

      let whereConditions: any = { tenantId, deletedAt: IsNull() };

      if (parentId !== undefined) {
        whereConditions.parentId = parentId;
      }

      if (isActive !== undefined) {
        whereConditions.isActive = isActive;
      }

      if (search) {
        whereConditions = [
          { ...whereConditions, name: ILike(`%${search}%`) },
          { ...whereConditions, description: ILike(`%${search}%`) }
        ];
      }

      const [categories, total] = await this.categoryRepository.findAndCount({
        where: whereConditions,
        relations: ['parent', 'children'],
        skip,
        take: limit,
        order: { name: 'ASC' }
      });

      return {
        data: categories,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching categories:', error);
      throw error;
    }
  }

  async updateCategory(tenantId: string, categoryId: string, updates: any): Promise<Category> {
    try {
      const category = await this.getCategory(tenantId, categoryId);

      // Validate parent category exists if provided and prevent circular reference
      if (updates.parentId) {
        if (updates.parentId === categoryId) {
          throw new Error('Category cannot be its own parent');
        }

        const parentCategory = await this.categoryRepository.findOne({
          where: { id: updates.parentId, tenantId, deletedAt: IsNull() }
        });
        if (!parentCategory) {
          throw new Error('Parent category not found');
        }
      }

      // Check if name is being changed and if it's already taken
      if (updates.name && updates.name !== category.name) {
        const existingCategory = await this.categoryRepository.findOne({
          where: { name: updates.name, tenantId, deletedAt: IsNull() }
        });
        if (existingCategory && existingCategory.id !== categoryId) {
          throw new Error('Category with this name already exists');
        }
      }

      Object.assign(category, updates);
      return await this.categoryRepository.save(category);
    } catch (error) {
      logger.error('Error updating category:', error);
      throw error;
    }
  }

  async deleteCategory(tenantId: string, categoryId: string): Promise<void> {
    try {
      const category = await this.getCategory(tenantId, categoryId);
      
      // Check if category has products
      const productCount = await this.productRepository.count({
        where: { categoryId, tenantId, deletedAt: IsNull() }
      });

      if (productCount > 0) {
        throw new Error('Cannot delete category with associated products');
      }

      // Check if category has children
      const childrenCount = await this.categoryRepository.count({
        where: { parentId: categoryId, tenantId, deletedAt: IsNull() }
      });

      if (childrenCount > 0) {
        throw new Error('Cannot delete category with sub-categories');
      }

      // Soft delete: set deletedAt timestamp
      category.deletedAt = new Date();
      await this.categoryRepository.save(category);
    } catch (error) {
      logger.error('Error deleting category:', error);
      throw error;
    }
  }

  async getCategoryTree(tenantId: string): Promise<Category[]> {
    try {
      const categories = await this.categoryRepository.find({
        where: { tenantId, deletedAt: IsNull(), isActive: true },
        relations: ['children', 'parent'],
        order: { name: 'ASC' }
      });

      // Build tree structure
      const categoryMap = new Map();
      const roots: Category[] = [];

      categories.forEach(category => {
        categoryMap.set(category.id, { ...category, children: [] });
      });

      categories.forEach(category => {
        const node = categoryMap.get(category.id);
        if (category.parentId && categoryMap.has(category.parentId)) {
          const parent = categoryMap.get(category.parentId);
          parent.children.push(node);
        } else {
          roots.push(node);
        }
      });

      return roots;
    } catch (error) {
      logger.error('Error fetching category tree:', error);
      throw error;
    }
  }

  async getCategoryWithProducts(tenantId: string, categoryId: string): Promise<Category> {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id: categoryId, tenantId, deletedAt: IsNull() },
        relations: ['products', 'children']
      });

      if (!category) {
        throw new Error('Category not found');
      }

      return category;
    } catch (error) {
      logger.error('Error fetching category with products:', error);
      throw error;
    }
  }
}

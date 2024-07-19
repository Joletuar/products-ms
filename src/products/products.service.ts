import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { PrismaClient } from '@prisma/client';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from './dto/pagination.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(ProductsService.name);

  onModuleInit() {
    this.$connect();

    this.logger.log('Connected to the database');
  }

  async create(createProductDto: CreateProductDto) {
    return await this.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, filter } = paginationDto;

    const offset = (page - 1) * limit;

    const totalPages = await this.product.count();
    const lastPage = Math.ceil(totalPages / limit);

    return {
      data: await this.product.findMany({
        where: {
          name: {
            contains: filter,
          },
          inStock: true,
        },

        skip: offset,
        take: limit,
      }),

      meta: {
        total: totalPages,
        page,
        lastPage,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findUnique({
      where: {
        id,
        inStock: true,
      },
    });

    if (!product)
      throw new RpcException({
        message: `Product with ${id} not found`,
        status: HttpStatus.BAD_REQUEST,
      });

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    if (!updateProductDto?.name && !updateProductDto?.price) return;

    await this.findOne(id);

    const { ...data } = updateProductDto;

    const updatedProduct = await this.product.update({
      data,
      where: {
        id,
      },
    });

    return updatedProduct;
  }

  async remove(id: number) {
    await this.findOne(id);

    const deletedProduct = await this.product.update({
      data: {
        inStock: false,
      },
      where: {
        id,
      },
    });

    return deletedProduct;
  }

  async validateProducts(ids: Array<number>) {
    const uniqueIds = Array.from(new Set(ids));

    const products = await this.product.findMany({
      where: {
        id: {
          in: uniqueIds, // Buscar multiples register usando un array de ids
        },
      },
    });

    if (products.length !== ids.length) {
      throw new RpcException({
        message: 'Some products were not found',
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return products;
  }
}

import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Category, Product } from '@prisma/client';
import { Hits, MeiliSearch } from 'meilisearch';

@Injectable()
export class MeilisearchService implements OnModuleInit {
    constructor(@Inject('MEILISEARCH_CLIENT') private readonly meiliClient: MeiliSearch) {}

    async onModuleInit() {
        if (!(await this.meiliClient.isHealthy())) {
            console.error('MeiliSearch is not healthy');
        }

        const indexes = await this.meiliClient.getIndexes();
        if (!indexes.results.length) {
            await this.createIndexes();
        }

        console.log(indexes.results);
        console.log('MeiliSearch is healthy');
    }

    async searchIndex(index: string, query: string): Promise<Hits<Category | Product>> {
        const result = await this.meiliClient.index(index).search<Category | Product>(query);
        return result.hits;
    }

    async addDocument(index: string, document: Category | Product): Promise<void> {
        await this.meiliClient.index(index).addDocuments([document]);
    }

    async updateDocument(index: string, document: Category | Product, primaryKey: string): Promise<void> {
        await this.meiliClient.index(index).updateDocuments([document], { primaryKey });
    }

    async deleteDocument(index: string, documentId: string | number): Promise<any> {
        return this.meiliClient.index(index).deleteDocument(documentId.toString());
    }

    async createIndexes() {
        await this.meiliClient.deleteIndexIfExists('categories');
        await this.meiliClient.createIndex('categories', { primaryKey: 'id' });

        await this.meiliClient.deleteIndexIfExists('products');
        await this.meiliClient.createIndex('products', { primaryKey: 'id' });
    }
}

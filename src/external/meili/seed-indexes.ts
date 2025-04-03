import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { MeilisearchService } from './meili.service';

async function runSeed() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const meilisearchService = app.get(MeilisearchService);

    // Create indexes and seed data
    await meilisearchService.createIndexes();
    console.log('Seeding completed successfully.');

    await app.close();
}

runSeed().catch((error) => {
    console.error('Error running seed:', error);
    process.exit(1);
});

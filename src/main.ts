import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Load environment variables before creating the app
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const rootDir = process.cwd();
  const publicPath = join(rootDir, 'src/public');
  const viewsPath = join(rootDir, 'src/views');

  console.log('Root directory:', rootDir);
  console.log('Public path:', publicPath);
  console.log('Views path:', viewsPath);

  app.useStaticAssets(publicPath);
  app.setBaseViewsDir(viewsPath);
  app.setViewEngine('hbs');

  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
}

void bootstrap();

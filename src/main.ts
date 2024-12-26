import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import * as firebaseAdmin from 'firebase-admin';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*', // Allows all origins (not recommended for production)
  });

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  //firebase
  const firebaseKeyFilePath = './bookbee-b6db9-firebase-adminsdk-90poz-4ae4135c22.json'
  const firebaseServiceAccount = JSON.parse(
    fs.readFileSync(firebaseKeyFilePath).toString(),
  );

  if(firebaseAdmin.apps.length === 0){
    console.log('Initialize Firebase Application.');
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(firebaseServiceAccount),
    });
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on http://localhost:${port}`);
}
bootstrap();
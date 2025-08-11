import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ClsModule } from 'nestjs-cls';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './auth/auth.module';
import { configModule } from './configs/app.config';
import { clsMongoose } from './configs/clsMongoose.config';
import { httpConfig } from './configs/http.config';
import { loggerConfig } from './configs/logger.config';
import { mongooseRootConfig } from './configs/mongo.config';
import { ProductModule } from './products/product.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [
    ClsModule.forRoot(clsMongoose),
    ConfigModule.forRoot(configModule),
    HttpModule.register(httpConfig),
    LoggerModule.forRoot(loggerConfig),
    MongooseModule.forRootAsync(mongooseRootConfig),
    AuthModule,
    ProductModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

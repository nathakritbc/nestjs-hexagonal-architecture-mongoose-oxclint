import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { Builder } from 'builder-pattern';

// For direct imports
// export const mongoUri = process.env.MONGO_URI ?? 'mongodb://root:12345678@localhost:27017/test';
export const mongoUri = process.env.MONGO_URI ?? 'mongodb://localhost:27017/nestjs-hexagonal-architecture-mongoose';

// For dependency injection
export const getMongoConfig = (configService: ConfigService) => {
  const uri = configService.get<string>('MONGO_URI');
  return {
    uri: uri ?? mongoUri,
  };
};

const imports = [ConfigModule];
const inject = [ConfigService];

export const mongooseRootConfig = Builder<MongooseModuleAsyncOptions>()
  .imports(imports)
  .inject(inject)
  .useFactory(getMongoConfig)
  .build();

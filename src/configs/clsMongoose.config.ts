import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterMongoose } from '@nestjs-cls/transactional-adapter-mongoose';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Builder } from 'builder-pattern';
import { ClsModuleOptions } from 'nestjs-cls';

const imports = [
  // module in which the Connection instance is provided
  MongooseModule,
];
const adapter = new TransactionalAdapterMongoose({
  // the injection token of the mongoose Connection
  mongooseConnectionToken: getConnectionToken(),
});
const clsPluginTransactional = new ClsPluginTransactional({
  imports: imports,
  adapter: adapter,
});
const plugins = [clsPluginTransactional];

export const clsMongoose = Builder<ClsModuleOptions>().plugins(plugins).build();

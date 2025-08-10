import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterMongoose } from '@nestjs-cls/transactional-adapter-mongoose';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Builder } from 'builder-pattern';
import { ClsModuleOptions } from 'nestjs-cls';

const plugins = [
  new ClsPluginTransactional({
    imports: [
      // module in which the Connection instance is provided
      MongooseModule,
    ],
    adapter: new TransactionalAdapterMongoose({
      // the injection token of the mongoose Connection
      mongooseConnectionToken: getConnectionToken(),
    }),
  }),
];

export const clsMongoose = Builder<ClsModuleOptions>().plugins(plugins).build();

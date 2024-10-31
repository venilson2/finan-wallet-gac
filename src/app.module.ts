import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { TransfersModule } from './transfers/transfers.module';
import { AuthModule } from './auth/auth.module';
import { AccountsModule } from './accounts/accounts.module';
import { LoggerService } from './common/logger/logger.service';
import { LoggerModule } from './common/logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    SequelizeModule.forRoot({
      dialect: process.env.DB_DIALECT as any,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      models: [],
      define: {
        timestamps: true,
        underscored: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
      },
      autoLoadModels: true,
      synchronize: true,
      sync: {
        alter: true,
      },
      logging: false,
      benchmark: false,
      schema: process.env.SCHEMA,
      timezone: 'utc',
    }),
    UsersModule,
    TransfersModule,
    AuthModule,
    AccountsModule,
    LoggerModule
  ],
  controllers: [],
  providers: [LoggerService],
  exports: [LoggerService]
})
export class AppModule {}
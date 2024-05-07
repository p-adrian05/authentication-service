import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DBOptions } from '../db.datasourceoptions';
import { RolesService } from './roles/service/roles.service';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: `.env.${process.env.NODE_ENV}`
  }),
    TypeOrmModule.forRootAsync({
      imports: undefined,
      useFactory: (config: ConfigService) => {
        const dbOptions: TypeOrmModuleOptions = {
          // retryAttempts: 10,
          // retryDelay: 3000,
          // autoLoadEntities: false
        };

        Object.assign(dbOptions, DBOptions);

        return dbOptions;
      }
    }),
    UsersModule,
    RolesModule],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true
      })
    },
    RolesService],
})
export class AppModule {}

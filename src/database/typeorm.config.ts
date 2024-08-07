import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  //   url: process.env.DB_URL,   //if you want to use as url
  autoLoadEntities: true, // all entity wil be loaded
  //   synchronize: process.env.DB_SYNC === 'true',
  synchronize: true,
});

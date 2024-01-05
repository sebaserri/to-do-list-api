import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'database.sqlite3',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};

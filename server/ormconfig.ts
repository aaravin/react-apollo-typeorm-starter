import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export = {
  type: 'postgres',
  host: 'localhost',
  post: 5432,
  username: 'postgres',
  password: 'root',
  database: 'instacraft',
  synchronize: true,
  logging: false,
  entities: ['src/entities/*.*'],
  namingStrategy: new SnakeNamingStrategy(),
}

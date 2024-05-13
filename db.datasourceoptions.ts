const _DBOptions = {
  synchronize: false,
  entities: [__dirname + '/**/*.entity{.js,.ts}'],
  migrations: [__dirname + "/migrations/*.js"],
  cli:{
    migrationsDir: "migrations"
  }
};
switch (process.env.NODE_ENV) {

  case 'development':
    Object.assign(_DBOptions,{
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'secret',
      database: process.env.DB_NAME || 'postgres',
      synchronize: true
    });
    break;
  case 'test':
    Object.assign(_DBOptions,{
      type: 'sqlite',
      database: 'test.sqlite',
      synchronize: true
    });
    break;
  default:
    throw new Error('Unknown environment');
}

export const DBOptions = _DBOptions;
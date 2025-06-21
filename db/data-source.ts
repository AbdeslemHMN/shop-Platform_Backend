import { DataSource, DataSourceOptions } from "typeorm";
import { config } from "dotenv";

config() ;

export const AppDataSourceOptions: DataSourceOptions = {
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USERNAME ,
    password: process.env.DB_PASSWORD ,
    database: process.env.DB_DATABASE ,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/db/migrations/*{.ts,.js}'],
    logging: false,
    synchronize: false,
    ssl: {
    rejectUnauthorized: false, 
},
}

const dataSource = new DataSource(AppDataSourceOptions);
dataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
    })
    .catch((err) => {
        throw new Error(`Error during Data Source initialization: ${err.message}`);    
    });
    
export default dataSource;


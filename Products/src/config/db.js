import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false
    }
);

sequelize.authenticate()
    .then(() => console.log('Conexion exitosa a la base de datos'))
    .catch((err) => console.error('No se pudo conectar a la base de datos: ', err));

export default sequelize;

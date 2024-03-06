import { createConnection, getConnection } from 'typeorm';
import dotenv from 'dotenv';
import { dbConnection } from './config';

// initialize configuration
dotenv.config();

const evnConnection: string = process.env.DB_CLIENT_NAME || 'BCT';

export const connection = createConnection(dbConnection[evnConnection]);

const establishConnection = () => {
	return getConnection('connection');
};

export { establishConnection };

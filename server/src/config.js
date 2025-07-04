import { config as dotenv } from "dotenv";
dotenv();

export default {
    port: process.env.PORT || 3000,
    db_server: 'LAPTOP\\SQLEXPRESSGAM',
    db_database: 'SFD',
    db_user: 'sa',
    db_password: 'Admin123!',
}

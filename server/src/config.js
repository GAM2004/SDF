import { config as dotenv } from "dotenv";
dotenv();

export default {
    port: process.env.PORT || 3000,
    db_server: 'PC\\GAM_SQL',
    db_database: 'SFD',
    db_user: 'sa',
    db_password: '16062004',
}

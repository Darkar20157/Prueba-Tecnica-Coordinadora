require('dotenv').config();
const { Pool } = require("pg");

//CONEXION
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.PORT
})
module.exports = pool;
// const getUsers = async() => {
//     const client = new Client();
//     await client.connect();

//     const res = await client.query("SELECT * FROM users");
//     console.log(res.rows[0].messages);
//     await client.end();

//     return res;
// }

// getUsers().then(res => { console.log(res)});
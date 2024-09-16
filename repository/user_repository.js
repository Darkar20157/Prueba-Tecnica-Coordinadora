const pool = require('../config/db');

class UserRepository{
    static async getFindAllUsersRepository() {
        const result = await pool.query("SELECT * FROM USERS");
        return result.rows;
    }

    static async getUsersRepository(document_nro, name, email) {
        try{
            let query = "SELECT * FROM USERS WHERE 1 = 1\n";
            const values = [];
            let paramIndex = 1;
            if(document_nro){
                query += ` AND DOCUMENT_NRO = $${paramIndex++}`;
                values.push(document_nro);
            }
            if(name){
                query += ` AND NAME = $${paramIndex++}`;
                values.push(name);
            }
            if(email){
                query += ` AND EMAIL = $${paramIndex++}`;
                values.push(email);
            }
            const result = await pool.query(query, values);
            return result.rows;
        }catch(error){
            console.error('Error executing query', error.stack);
            throw error;
        }
    }

    static async saveUserRepository(userData){
        const {document_nro, name, phone, email, issue_date, active} = userData;
        try{
            const query = `INSERT INTO USERS (DOCUMENT_NRO, NAME, PHONE, EMAIL, ISSUE_DATE, ACTIVE) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
            const values = [document_nro, name, phone, email, issue_date, active];
            const result = await pool.query(query, values);
            return result.rows[0];
        }catch(error){
            console.error('Error executing query', error.stack);
            throw error;
        }
    }
    
}
module.exports = UserRepository;
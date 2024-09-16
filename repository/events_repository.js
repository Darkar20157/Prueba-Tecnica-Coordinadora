const pool = require('../config/db');
class EventRepository{
    static async getFindAllEventsRepository() {
        let sql = "SELECT E.NAME AS NOMBRE, E.DESCRIPTION, E.ADDRESS, JSONB_BUILD_OBJECT('user_id', U.ID, 'user_name', U.NAME, 'user_phone', U.PHONE,'user_email', U.EMAIL, 'event_id', E.ID) AS USER_ID, E.DATA_LOCATION, E.EVENT_DATE FROM EVENTS E INNER JOIN USERS U ON E.USER_ID = U.ID\n";
        sql += ` WHERE U.ACTIVE IS TRUE`;
        const result = await pool.query(sql);
        return result.rows;
    }

    static async getEventRepository(id) {
        try{
            let query = "SELECT * FROM EVENTS WHERE 1 = 1\n";
            const values = [];
            let paramIndex = 1;
            if(id){
                query += ` AND ID = $${paramIndex++}`;
                values.push(id.id);
            }
            // if(address){
            //     query += ` AND ADDRESS = $${paramIndex++}`;
            //     values.push(address);
            // }
            const result = await pool.query(query, values);
            return result.rows;
        }catch(error){
            console.error('Error executing query', error.stack);
            throw error;
        }
    }

    static async saveEventRepository(userData){
        const {active, issue_date, name, description, address, user_id} = userData;
        try{
            const query = `INSERT INTO EVENTS (ACTIVE, ISSUE_DATE, NAME, DESCRIPTION, ADDRESS, USER_ID) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
            const values = [active, issue_date, name, description, address, user_id];
            const result = await pool.query(query, values);
            return result.rows[0];
        }catch(error){
            console.error('Error executing query', error.stack);
            throw error;
        }
    }

    static async deleteEventRepository(id) {
        try{
            let query = "DELETE FROM EVENTS WHERE 1 = 1\n";
            const values = [];
            let paramIndex = 1;
            if(id){
                query += ` AND ID = $${paramIndex++}`;
                values.push(id);
            }
            let result = await pool.query(query, values);
            if(result){
                result = true;
            }
            return result;
        }catch(error){
            console.error('Error executing query', error.stack);
            throw error;
        }
    }
}
module.exports = EventRepository;
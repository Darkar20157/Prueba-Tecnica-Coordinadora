const pool = require('../config/db');
class EventRepository{
    static async getFindAllEventsRepository() {
        let sql = "SELECT E.ID, E.NAME AS NOMBRE, E.DESCRIPTION, E.ADDRESS, JSONB_BUILD_OBJECT('user_id', U.ID, 'user_name', U.NAME, 'user_phone', U.PHONE,'user_email', U.EMAIL, 'event_id', E.ID) AS USER_ID, E.DATA_LOCATION, E.EVENT_DATE FROM EVENTS E INNER JOIN USERS U ON E.USER_ID = U.ID\n";
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

    static async getUsersAssistEventRepository(id) {
        try{
            let query = "SELECT U.* FROM USERS U INNER JOIN USERS_ASSIST UA ON UA.USERS_ID = U.ID LEFT JOIN EVENTS E ON E.ID = UA.EVENTS_ID WHERE 1 = 1 AND UA.ACTIVE IS TRUE";
            const values = [];
            let paramIndex = 1;
            if(id){
                query += ` AND UA.EVENTS_ID = $${paramIndex++}`;
                values.push(id);
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
        const {active, issue_date, name, description, address, user_id, event_date, data_location} = userData;
        try{
            const query = `INSERT INTO EVENTS (ACTIVE, ISSUE_DATE, NAME, DESCRIPTION, ADDRESS, USER_ID, EVENT_DATE, DATA_LOCATION) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
            const values = [active, issue_date, name, description, address, user_id, event_date, data_location];
            const result = await pool.query(query, values);
            return result.rows[0];
        }catch(error){
            console.error('Error executing query', error.stack);
            throw error;
        }
    }

    static async saveEventAssist(userData){
        const {user_id, id} = userData;
        try{
            const sql = `INSERT INTO USERS_ASSIST (USERS_ID, EVENTS_ID) VALUES ($1, $2) RETURNING *`;
            const value = [user_id, id];
            const result = await pool.query(sql, value);
            return result.rows[0];
        }catch(error){
            console.error('Error executing query', error.stack);
            throw error;
        }
    }

    static async editEventRepository(userData){
        const {id, active, issue_date, name, description, address, user_id, data_location} = userData;
        try{
            let query = `UPDATE EVENTS SET ACTIVE = $1, EVENT_DATE = $2, NAME = $3, DESCRIPTION = $4, ADDRESS = $5, USER_ID = $6, DATA_LOCATION = $7 WHERE 1 = 1`;
            const values = [active, issue_date, name, description, address, user_id, JSON.stringify(data_location)];
            if(id){
                query += ` AND ID = $8`;
                values.push(id);
            }
            query += " RETURNING *";
            
            const result = await pool.query(query, values);
            return result.rows[0];
        }catch(error){
            console.error('Error executing query', error.stack);
            throw error;
        }
    }

    static async assistEventRepository(userData){
        const {idEvent, idUser, check} = userData;
        try{
            let res = await this.getUsersAssistEventRepository(idEvent);
            let result;
            if(res.filter(x => x.id == idUser).length > 0){
                let query = `UPDATE USERS_ASSIST SET ACTIVE = $1 WHERE 1 = 1 AND USERS_ID = $2 AND EVENTS_ID = $3`;
                const values = [check, idEvent, idUser];
                query += " RETURNING *";
                result = await pool.query(query, values);
            }else{
                let query = `INSERT INTO USERS_ASSIST(EVENTS_ID, USERS_ID, ACTIVE) VALUES($1, $2, $3)`;
                const values = [idEvent, idUser, check];
                result = await pool.query(query, values);
            }
            if(result){
                result = true;
            }else{
                result = false;
            }
            return result;
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
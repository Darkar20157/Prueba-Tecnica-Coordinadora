class EventRepository{
    static async getFindAllEventsRepository() {
        const result = await pool.query("SELECT * FROM EVENTS");
        return result.rows;
    }

    static async getEventRepository(name, address) {
        try{
            let query = "SELECT * FROM EVENTS WHERE 1 = 1\n";
            const values = [];
            let paramIndex = 1;
            if(name){
                query += ` AND NAME = $${paramIndex++}`;
                values.push(name);
            }
            if(address){
                query += ` AND ADDRESS = $${paramIndex++}`;
                values.push(address);
            }
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
}
module.exports = EventRepository;
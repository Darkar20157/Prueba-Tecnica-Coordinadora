const formatDate = require('../helper/helper');

class EventService{
    static async getAllEventsServices(filters) {
        const res = await UserRepository.getFindAllEventsRepository();
        return res;
    }

    static async getEventServices({document_nro, name}) {
        const res = await UserRepository.getEventRepository(document_nro, name);
        return res;
    }
    
    static async saveEventServices(userData) {
        if(userData){
            userData.active = true;
            userData.issue_date = formatDate(new Date());
        }
        const res = await UserRepository.saveEventRepository(userData);
        return res;
    }
}
module.exports = EventService;
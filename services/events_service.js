const formatDate = require('../helper/helper');
const EventRepository = require('../repository/events_repository');

class EventService{
    static async getAllEventsServices(filters) {
        const res = await EventRepository.getFindAllEventsRepository();
        return res;
    }

    static async getEventServices({id}) {
        const res = await EventRepository.getEventRepository(id);
        return res;
    }
    
    static async saveEventServices(userData) {
        if(userData){
            userData.active = true;
            userData.issue_date = formatDate(new Date());
        }
        const res = await EventRepository.saveEventRepository(userData);
        return res;
    }

    static async deleteEventServices({id}) {
        const res = await EventRepository.deleteEventRepository(id);
        return res;
    }
}
module.exports = EventService;
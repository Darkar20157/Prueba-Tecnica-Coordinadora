const EventService = require('../services/events_service')

class EventController{
    static async getAllEvents() {
        try{
            const users = await EventService.getAllEventsServices();
            res.status(200).json(users);
        }catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching items: '+error });
        }
    }

    static async getEvent(req, res){
        const {document_nro, name} = req.query;
        try{
            if(!document_nro && !name){
                return res.status(400).json({message: "Missing parameters: document_nro or name are required."})
            }
            const user = await EventService.getEventServices({document_nro, name});
            if(user.lenght === 0){
                return res.status(404).json({message : 'User not found'})
            }
            res.status(200).json(user);
        }catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching items: '+error });
        }
    }

    static async saveEvent(req, res){
        try{
            const userData = req.body;
            const saveUser = await EventService.saveEventServices(userData);
            res.status(200).json(saveUser);
        }catch (error) {
            res.status(500).json({ message: 'Error fetching items: '+error });
        }
    }
}

module.exports = EventController
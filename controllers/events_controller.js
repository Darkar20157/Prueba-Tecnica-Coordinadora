const EventService = require('../services/events_service')

class EventController{
    static async getAllEvents(req, res) {
        try{
            const users = await EventService.getAllEventsServices();
            res.status(200).json(users);
        }catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching items: '+error });
        }
    }

    static async getEvent(req, res){
        const id = req.query;
        try{
            if(!id){
                return res.status(400).json({message: "Missing parameters: document_nro or name are required."})
            }
            const user = await EventService.getEventServices({id});
            if(user.lenght === 0){
                return res.status(404).json({message : 'User not found'})
            }
            res.status(200).json(user);
        }catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching items: '+error });
        }
    }

    static async getUsersAssistEvent(req, res){
        const {id} = req.query;
        try{
            if(!id){
                return res.status(400).json({message: "Missing parameters: document_nro or name are required."})
            }
            const user = await EventService.getUsersAssistEventServices({id});
            if(user.lenght === 0){
                return res.status(404).json({message : 'User not found'})
            }
            res.status(200).json(user);
        }catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching items: '+error });
        }
    }

    static async assistEvent(req, res){
        try{
            const userData = req.body;
            const saveUser = await EventService.assistEventServices(userData);
            res.status(200).json(saveUser);
        }catch (error) {
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

    static async editEvent(req, res){
        try{
            const userData = req.body;
            const saveUser = await EventService.editEventServices(userData);
            res.status(200).json(saveUser);
        }catch (error) {
            res.status(500).json({ message: 'Error fetching items: '+error });
        }
    }

    static async deleteEvent(req, res){
        const id = req.params.id;
        try{
            if(!id){
                return res.status(400).json({message: "Missing parameters: id are required."})
            }
            const user = await EventService.deleteEventServices({id});
            if(!user){
                return res.status(404).json({message : 'User not found'})
            }
            res.status(200).json(user);
        }catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching items: '+error });
        }
    }
}

module.exports = EventController
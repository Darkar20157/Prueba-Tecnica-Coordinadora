const UserService = require('../services/user_services')

class UserController{
    static async getAllUsers(req, res) {
        try{
            const users = await UserService.getAllUsersServices();
            res.status(200).json(users);
        }catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching items: '+error });
        }
    }

    static async getUser(req, res){
        const {document_nro, name, email} = req.query;
        try{
            if(!document_nro && !name && !email){
                return res.status(400).json({message: "Missing parameters: document_nro, email or name are required."})
            }
            const user = await UserService.getUsersServices({document_nro, name, email});
            if(user.lenght === 0){
                return res.status(404).json({message : 'User not found'})
            }
            res.status(200).json(user);
        }catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching items: '+error });
        }
    }

    static async saveUser(req, res){
        try{
            const userData = req.body;
            const saveUser = await UserService.saveUserServices(userData);
            res.status(200).json(saveUser);
        }catch (error) {
            res.status(500).json({ message: 'Error fetching items: '+error });
        }
    }
}

module.exports = UserController
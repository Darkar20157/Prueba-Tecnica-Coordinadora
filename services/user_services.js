const formatDate = require('../helper/helper');
const UserRepository = require('../repository/user_repository');

class UserService{
    static async getAllUsersServices(filters) {
        const res = await UserRepository.getFindAllUsersRepository();
        return res;
    }

    static async getUsersServices({document_nro, name, email}) {
        const res = await UserRepository.getUsersRepository(document_nro, name, email);
        return res;
    }
    
    static async saveUserServices(userData) {
        if(userData){
            userData.active = true;
            userData.issue_date = formatDate(new Date());
        }
        const res = await UserRepository.saveUserRepository(userData);
        return res;
    }
}

module.exports = UserService;
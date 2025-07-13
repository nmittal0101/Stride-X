import { usermodel } from "../models/usermodel";

export const uploadProductPermission = async(userid) => {
    const user = await usermodel.findById(userid);

    if(user.role === 'ADMIN'){
        return true
    }

    return false
};
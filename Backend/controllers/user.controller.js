import userModel from "../models/user.model.js";
import {createUser} from '../services/user.service.js'
import {validationResult} from "express-validator"

export const userRegister = async (req,res, next) => {
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({errors:error.array()})
    }

    const {fullname,email,password} = req.body;
    
    const hashPassword = await userModel.hashPassword(password);
    const user = await createUser({
        firstname: fullname.firstname,
        lastname : fullname.lastname,
        email,
        password
    })

    const token = user.generateAuthToken();

    res.status(200).json({token,user});
}
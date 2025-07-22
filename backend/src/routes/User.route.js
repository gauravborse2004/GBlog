import express from "express";
import { deleteUser, getAllUser, getUser, updateUser } from "../controllers/User.controller.js";
import upload from "../config/multer.js";
import { authenticate } from "../middleware/authenticate.js";
import { onlyadmin } from "../middleware/onlyAdmin.js";

const UserRouter = express.Router();


UserRouter.put("/updateProfile",authenticate, upload.single("avatar"), updateUser);

UserRouter.get('/get-all-user',onlyadmin, getAllUser);

UserRouter.get('/get-user/:userid',authenticate, getUser);

UserRouter.delete('/delete/:id',onlyadmin, deleteUser);

export default UserRouter;

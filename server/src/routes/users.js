import { Router } from "express";
import { loginUser, newUser } from "../controllers/users.js";

const router = Router();
router.post('/users/login', loginUser);
router.post('/users', newUser);


export default router;
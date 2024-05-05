import express  from "express";
import { authenticate, restrict } from "../auth/verifyToken.js";
import { getChat, sendMessage } from "../Controllers/chatController.js";

const router = express.Router();
router.post('/chat', authenticate,sendMessage);
router.get('/ovo/:destId',authenticate,getChat);

export default router;

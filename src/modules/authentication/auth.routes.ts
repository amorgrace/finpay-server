import { Router } from "express";
import { googleLogin } from "./auth.controllers.js";

const router = Router();


router.post("/google", googleLogin);

export default router;

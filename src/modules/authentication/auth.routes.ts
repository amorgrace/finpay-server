import { Router } from "express";
import { googleLogin } from "./auth.controllers";

const router = Router();


router.post("/google", googleLogin);

export default router;

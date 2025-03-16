import express, { Request, Response, NextFunction } from "express";
import { getUserProfile, updateUserProfile } from "../controllers/user_controller";
import { authMiddleware as verifyToken } from "../controllers/auth_controller";

const router = express.Router();

// פונקציה wrapper לטיפול בשגיאות בפונקציות אסינכרוניות
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

router.get("/:id", asyncHandler(getUserProfile));
router.put("/:id", verifyToken, asyncHandler(updateUserProfile));

export default router;
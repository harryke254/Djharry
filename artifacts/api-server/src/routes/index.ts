import { Router, type IRouter } from "express";
import healthRouter from "./health";
import mixtapesRouter from "./mixtapes";
import storageRouter from "./storage";

const router: IRouter = Router();

router.use(healthRouter);
router.use(mixtapesRouter);
router.use(storageRouter);

export default router;

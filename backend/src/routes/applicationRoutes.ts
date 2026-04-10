import { Router } from "express";
import {
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
  updateApplicationStatus,
} from "../controllers/applicationController";
import authenticate from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.get("/", getApplications);
router.get("/:id", getApplication);
router.post("/", createApplication);
router.put("/:id", updateApplication);
router.patch("/:id/status", updateApplicationStatus);
router.delete("/:id", deleteApplication);

export default router;

import express from "express";
import {
  createRegulationCon,
  getActiveRegulationsCon,
  getRegulationById,
  updateRegulationCon,
  deleteRegulationCon,
} from "../controllers/regulationController.js";
import { authorize } from "../middleware/authorize.js";

const regulationRoute = express.Router();

regulationRoute.post("/", createRegulationCon);
regulationRoute.get("/", getActiveRegulationsCon);
regulationRoute.get("/:id", getRegulationById);
regulationRoute.put("/:id", updateRegulationCon);
regulationRoute.delete("/:id", deleteRegulationCon);

export default regulationRoute;

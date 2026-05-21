import { Router } from "express";
import * as adminController from "../controllers/adminController";
import { authRequired, authorizeRoles } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validate";
import { assignRoleSchema } from "../schemas/adminSchemas";
import { eventIdParamSchema, updateEventSchema } from "../schemas/eventSchemas";

const router = Router();

router.use(authRequired, authorizeRoles("admin"));

router.get("/events", adminController.getAllEvents);
router.put("/events/:id", validate(updateEventSchema), adminController.updateEvent);
router.delete("/events/:id", validate(eventIdParamSchema), adminController.deleteEvent);
router.get("/users", adminController.getUsers);
router.patch("/users/role", validate(assignRoleSchema), adminController.assignRole);

export default router;

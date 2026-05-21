import { Router } from "express";
import * as eventController from "../controllers/eventController";
import { authRequired, authorizeRoles } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validate";
import { eventIdParamSchema } from "../schemas/eventSchemas";
import { createEventSchema, updateEventSchema } from "../schemas/eventSchemas";

const router = Router();

router.get("/", eventController.getEvents);
router.get("/:id", validate(eventIdParamSchema), eventController.getEventDetail);
router.post(
  "/",
  authRequired,
  authorizeRoles("organizer"),
  validate(createEventSchema),
  eventController.createEvent,
);
router.put(
  "/:id",
  authRequired,
  authorizeRoles("organizer"),
  validate(updateEventSchema),
  eventController.updateEvent,
);
router.delete(
  "/:id",
  authRequired,
  authorizeRoles("organizer"),
  validate(eventIdParamSchema),
  eventController.deleteEvent,
);
router.patch(
  "/:id/publish",
  authRequired,
  authorizeRoles("organizer"),
  validate(eventIdParamSchema),
  eventController.publishEvent,
);

export default router;

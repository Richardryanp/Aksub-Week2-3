import { Request, Response } from "express";
import * as eventService from "../services/eventService";
import { asyncHandler } from "../utils/asyncHandler";

export const getEvents = asyncHandler(async (_req: Request, res: Response) => {
  const events = await eventService.getPublishedEvents();
  res.status(200).json(events);
});

export const getEventDetail = asyncHandler(async (req: Request, res: Response) => {
  const event = await eventService.getEventById(Number(req.params.id));
  res.status(200).json(event);
});

export const createEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await eventService.createEvent(req.user!.id, req.body);
  res.status(201).json(event);
});

export const updateEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await eventService.updateOwnedEvent(Number(req.params.id), req.user!.id, req.body);
  res.status(200).json(event);
});

export const deleteEvent = asyncHandler(async (req: Request, res: Response) => {
  const result = await eventService.deleteOwnedEvent(Number(req.params.id), req.user!.id);
  res.status(200).json(result);
});

export const publishEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await eventService.publishOwnedEvent(Number(req.params.id), req.user!.id);
  res.status(200).json(event);
});

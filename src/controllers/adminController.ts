import { Request, Response } from "express";
import * as adminService from "../services/adminService";
import { asyncHandler } from "../utils/asyncHandler";

export const getAllEvents = asyncHandler(async (_req: Request, res: Response) => {
  const events = await adminService.getAllEvents();
  res.status(200).json(events);
});

export const updateEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await adminService.updateAnyEvent(Number(req.params.id), req.body);
  res.status(200).json(event);
});

export const deleteEvent = asyncHandler(async (req: Request, res: Response) => {
  const result = await adminService.deleteAnyEvent(Number(req.params.id));
  res.status(200).json(result);
});

export const getUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await adminService.getAllUsers();
  res.status(200).json(users);
});

export const assignRole = asyncHandler(async (req: Request, res: Response) => {
  const user = await adminService.assignOrganizerRole(req.body.email);
  res.status(200).json(user);
});

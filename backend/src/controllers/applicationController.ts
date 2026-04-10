import { Response, NextFunction } from "express";
import Application from "../models/Application";
import { createError } from "../middleware/errorHandler";
import type { AuthRequest, ApplicationStatus } from "../types";

const VALID_STATUSES: ApplicationStatus[] = [
  "Applied",
  "Phone Screen",
  "Interview",
  "Offer",
  "Rejected",
];

export const getApplications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const applications = await Application.find({
      userId: req.user!.userId,
    }).sort({ order: 1, createdAt: -1 });

    res.json(applications);
  } catch (error) {
    next(error);
  }
};

export const getApplication = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.user!.userId,
    });

    if (!application) {
      throw createError("Application not found", 404);
    }

    res.json(application);
  } catch (error) {
    next(error);
  }
};

export const createApplication = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      company,
      role,
      status,
      jdLink,
      jobDescription,
      notes,
      salaryRange,
      location,
      seniority,
      requiredSkills,
      niceToHaveSkills,
      resumeSuggestions,
      dateApplied,
    } = req.body;

    if (!company || !role) {
      throw createError("Company and role are required", 400);
    }

    if (status && !VALID_STATUSES.includes(status)) {
      throw createError("Invalid status value", 400);
    }

    // Get the max order for the target status column
    const maxOrderDoc = await Application.findOne({
      userId: req.user!.userId,
      status: status ?? "Applied",
    }).sort({ order: -1 });

    const order = maxOrderDoc ? maxOrderDoc.order + 1 : 0;

    const application = await Application.create({
      userId: req.user!.userId,
      company,
      role,
      status: status ?? "Applied",
      jdLink,
      jobDescription,
      notes,
      salaryRange,
      location,
      seniority,
      requiredSkills: requiredSkills ?? [],
      niceToHaveSkills: niceToHaveSkills ?? [],
      resumeSuggestions: resumeSuggestions ?? [],
      dateApplied: dateApplied ?? new Date(),
      order,
    });

    res.status(201).json(application);
  } catch (error) {
    next(error);
  }
};

export const updateApplication = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status } = req.body;

    if (status && !VALID_STATUSES.includes(status)) {
      throw createError("Invalid status value", 400);
    }

    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!.userId },
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!application) {
      throw createError("Application not found", 404);
    }

    res.json(application);
  } catch (error) {
    next(error);
  }
};

export const deleteApplication = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      userId: req.user!.userId,
    });

    if (!application) {
      throw createError("Application not found", 404);
    }

    res.json({ message: "Application deleted" });
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, order } = req.body;

    if (!status || !VALID_STATUSES.includes(status)) {
      throw createError("Valid status is required", 400);
    }

    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!.userId },
      { status, order: order ?? 0 },
      { new: true }
    );

    if (!application) {
      throw createError("Application not found", 404);
    }

    res.json(application);
  } catch (error) {
    next(error);
  }
};

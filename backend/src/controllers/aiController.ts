import { Response, NextFunction } from "express";
import { parseAndSuggest } from "../services/aiService";
import { createError } from "../middleware/errorHandler";
import type { AuthRequest } from "../types";

export const parseJobDescription = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { jobDescription } = req.body;

    if (!jobDescription || typeof jobDescription !== "string") {
      throw createError("Job description text is required", 400);
    }

    if (jobDescription.trim().length < 50) {
      throw createError(
        "Job description is too short. Please paste the full job description.",
        400
      );
    }

    const result = await parseAndSuggest(jobDescription);
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("429")) {
        next(createError("AI rate limit reached. Please wait a moment and try again.", 429));
        return;
      }
      if (error.message.includes("503")) {
        next(createError("Google AI Service is currently overloaded. Please try again in a few seconds.", 503));
        return;
      }
      if (error.message.includes("Company name or role")) {
        next(createError("Could not detect Company Name or Job Role. Please ensure the pasted text includes them.", 400));
        return;
      }
      
      // Fallback AI error caught from custom throws or SDK
      next(createError(`AI Parsing failed: ${error.message}`, 400));
      return;
    }
    next(error);
  }
};

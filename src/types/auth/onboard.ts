import { ZodIssue } from 'zod';

export interface OnboardResponse {
  success: boolean;
  token?: string;
  error?: string;
  details?: ZodIssue[];
}

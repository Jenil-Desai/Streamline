import { ZodIssue } from 'zod';

export interface RegisterResponse {
  success: boolean;
  token?: string;
  error?: string;
  details?: ZodIssue[];
}

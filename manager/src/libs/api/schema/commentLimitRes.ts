/**
 * Generated by orval v6.17.0 🍺
 * Do not edit manually.
 * actic_web_app_project
 * OpenAPI spec version: 0.1.0
 */
import type { Comment } from './comment';

export interface CommentLimitRes {
  current: number;
  results?: Comment[] | null;
  total: number;
}

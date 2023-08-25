/**
 * Generated by orval v6.17.0 🍺
 * Do not edit manually.
 * actic_web_app_project
 * OpenAPI spec version: 0.1.0
 */
import type { SpuFileObject } from './spuFileObject';

export interface SpuDetail {
  acclaim: number;
  activity: number;
  bad_reviews: number;
  carousel: SpuFileObject[];
  company_id?: number | null;
  cover: SpuFileObject;
  create_time: string;
  description?: string | null;
  id: number;
  issue_time: string;
  name: string;
  price: number;
  tag_ids: number[];
  type_ids: number[];
  update_time: string;
  views: number;
}

import { z } from "zod";

import { EventStatus } from "../constants/status";

export const eventQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  search: z.string().optional(),
  status: z.nativeEnum(EventStatus).optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  sortBy: z.enum(["reportingDateTime", "createdAt"]).default("reportingDateTime"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type EventQueryDto = z.infer<typeof eventQuerySchema>;

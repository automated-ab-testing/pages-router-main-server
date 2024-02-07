import { z } from "zod";
import { EventType } from "@prisma/client";

import { createTRPCRouter, adminProcedure } from "~/server/api/trpc";

export const analyticsRouter = createTRPCRouter({
  getTestNames: adminProcedure.query(async ({ ctx }) => {
    // Get all test names
    return await ctx.db.test.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }),

  getVersionLabels: adminProcedure
    .input(
      z.object({
        testId: z.string().uuid().nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { testId } = input;

      // If testId is null, return an empty array
      if (!testId) return [] as { id: string; label: string }[];

      // Get all version labels of the selected test
      return await ctx.db.version.findMany({
        where: {
          testId,
        },
        select: {
          id: true,
          label: true,
        },
      });
    }),

  getAnalytics: adminProcedure
    .input(
      z.object({
        versionId: z.string().uuid().nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { versionId } = input;

      // If versionId is null, return an empty array
      if (!versionId) return {} as Record<EventType, number>;

      // Get all event logs of the selected version
      const data = await ctx.db.eventLog.groupBy({
        where: {
          versionId,
        },
        by: ["type"],
        _count: {
          id: true,
        },
      });

      // Pivot the data
      const pivot = Object.values(EventType).reduce(
        (acc, curr) => {
          const datum = data.find((d) => d.type === curr);

          acc[curr] = datum ? datum._count.id : 0;

          return acc;
        },
        {} as Record<EventType, number>,
      );

      return pivot;
    }),
});

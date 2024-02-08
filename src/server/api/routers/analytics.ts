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

  getAnalytics: adminProcedure
    .input(
      z.object({
        testId: z.string().uuid().nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { testId } = input;

      if (!testId) return {} as Record<EventType, Record<string, number>>;

      // Get the analytics data
      const { versions, countEvents } = await ctx.db.$transaction(
        async (tx) => {
          const versions = await tx.version.findMany({
            where: { testId },
            select: { id: true, label: true },
          });

          const countEvents = await tx.eventLog.groupBy({
            by: ["type", "versionId"],
            where: {
              version: {
                testId,
              },
            },
            _count: {
              id: true,
            },
          });

          return { versions, countEvents };
        },
      );

      // Pivot the data by type
      const pivot = Object.values(EventType)
        .flatMap((type) => versions.map((version) => ({ type, version })))
        .reduce(
          (acc, curr) => {
            // Get the type and version
            const { type, version } = curr;

            // If the type is not in the accumulator, add it
            if (!acc[type]) acc[type] = {} as Record<string, number>;

            // Find the count event
            const foundEvent = countEvents.find(
              (c) => c.type === type && c.versionId === version.id,
            );

            // Add the count to the accumulator
            acc[type][version.label] = foundEvent ? foundEvent._count.id : 0;

            return acc;
          },
          {} as Record<EventType, Record<string, number>>,
        );

      return pivot;
    }),
});

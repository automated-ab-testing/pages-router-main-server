import { z } from "zod";

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

      if (!testId) return {} as Record<string, Record<string, number>>;

      // Get the analytics data
      const { versions, countImpressions, countClicks } =
        await ctx.db.$transaction(async (tx) => {
          // Get the label and id of all versions for the test
          const versions = await tx.version.findMany({
            where: { testId },
            select: { id: true, label: true },
          });

          // Get the count of impressions for each version
          const countImpressions = await tx.eventLog.groupBy({
            by: ["versionId"],
            where: {
              version: {
                testId,
              },
            },
            _count: {
              id: true,
            },
          });

          // Get the count of clicks for each version
          const countClicks = await tx.eventLog.groupBy({
            by: ["versionId"],
            where: {
              version: {
                testId,
              },
              isClicked: true,
            },
            _count: {
              id: true,
            },
          });

          return { versions, countImpressions, countClicks };
        });

      const dataImpressions = versions.reduce(
        (acc, curr) => {
          // Find the count for the current versionId
          const count = countImpressions.find((c) => c.versionId === curr.id);

          // Add the count to the pivot object
          acc[curr.label] = count ? count._count.id : 0;

          // Return the pivot object
          return acc;
        },
        {} as Record<string, number>,
      );

      const dataClicks = versions.reduce(
        (acc, curr) => {
          // Find the count for the current versionId
          const count = countClicks.find((c) => c.versionId === curr.id);

          // Add the count to the pivot object
          acc[curr.label] = count ? count._count.id : 0;

          // Return the pivot object
          return acc;
        },
        {} as Record<string, number>,
      );

      return {
        impressions: dataImpressions,
        clicks: dataClicks,
      };
    }),
});

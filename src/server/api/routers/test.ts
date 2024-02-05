import { z } from "zod";
import { sample } from "lodash";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const testRouter = createTRPCRouter({
  getInitialData: protectedProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.$transaction(async (tx) => {
      // Get all active tests
      const activeTests = await tx.test.findMany({
        where: {
          isActive: true,
        },
        select: {
          id: true,
        },
      });

      // Randomly select one test
      const randomTest = sample(activeTests);

      if (!randomTest)
        return {
          versionId: null,
          styles: null,
        };

      // Get all versions of the selected test
      const versions = await tx.version.findMany({
        where: {
          testId: randomTest.id,
        },
        select: {
          id: true,
        },
      });

      // Randomly select one version
      // NOTE: Distribusi peluang dapat diubah dengan menggunakan HMM
      const randomVersion = sample(versions);

      if (!randomVersion)
        return {
          versionId: null,
          styles: null,
        };

      // Get all styles of the selected version
      const styles = await tx.style.findMany({
        where: {
          versionId: randomVersion.id,
        },
        select: {
          className: true,
          component: {
            select: {
              domId: true,
            },
          },
        },
      });

      // Pivot the styles
      const pivot = styles.reduce(
        (acc, curr) => {
          const { component, className } = curr;
          const { domId } = component;

          acc[domId] = className;

          return acc;
        },
        {} as Record<string, string>,
      );

      // Return all data
      return {
        versionId: randomVersion.id,
        styles: pivot,
      };
    });

    return data;
  }),

  incrementImpressions: protectedProcedure
    .input(
      z.object({
        versionId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { versionId } = input;

      await ctx.db.version.update({
        where: {
          id: versionId,
        },
        data: {
          numberOfImpressions: {
            increment: 1,
          },
        },
      });
    }),

  incrementClicks: protectedProcedure
    .input(
      z.object({
        versionId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { versionId } = input;

      await ctx.db.version.update({
        where: {
          id: versionId,
        },
        data: {
          numberOfClicks: {
            increment: 1,
          },
        },
      });
    }),
});

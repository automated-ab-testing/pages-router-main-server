import { z } from "zod";
import { sample } from "lodash";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const testRouter = createTRPCRouter({
  getVersion: publicProcedure.query(async ({ ctx }) => {
    const randomVersion = await ctx.db.$transaction(async (tx) => {
      const activeTests = await tx.test.findMany({
        where: {
          isActive: true,
        },
        select: {
          id: true,
        },
      });

      const randomTest = sample(activeTests);

      if (!randomTest)
        return {
          id: null,
        };

      const versions = await tx.version.findMany({
        where: {
          testId: randomTest.id,
        },
        select: {
          id: true,
        },
      });

      // NOTE: Distribusi peluang dapat diubah dengan menggunakan HMM
      const randomVersion = sample(versions);

      if (!randomVersion)
        return {
          id: null,
        };

      return randomVersion;
    });

    return randomVersion;
  }),

  getComponentStyles: publicProcedure
    .input(
      z.object({
        versionId: z.string().uuid().nullable().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { versionId } = input;

      // If versionId is not provided or null, return empty styles
      if (versionId === undefined || versionId === null)
        return { styles: {} as Record<string, string> };

      const pivot = await ctx.db.$transaction(async (tx) => {
        // Get all styles of the selected version
        const styles = await tx.style.findMany({
          where: {
            versionId,
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

        return pivot;
      });

      return {
        styles: pivot,
      };
    }),

  incrementImpressions: publicProcedure
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

  incrementClicks: publicProcedure
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

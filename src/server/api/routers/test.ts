import { z } from "zod";
import { sample } from "lodash";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const testRouter = createTRPCRouter({
  getVersion: publicProcedure.query(async ({ ctx }) => {
    const activeTests = await ctx.db.test.findMany({
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

    const versions = await ctx.db.version.findMany({
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
  }),

  getComponentStyles: publicProcedure
    .input(
      z.object({
        componentDomId: z.string(),
        versionId: z.string().uuid().nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { componentDomId, versionId } = input;

      if (!versionId)
        return {
          className: null,
        };

      const component = await ctx.db.component.findUnique({
        where: {
          domId: componentDomId,
        },
        select: {
          id: true,
        },
      });

      if (!component)
        return {
          className: null,
        };

      const style = await ctx.db.style.findUnique({
        where: {
          componentId_versionId: {
            componentId: component.id,
            versionId,
          },
        },
        select: {
          className: true,
        },
      });

      if (!style)
        return {
          className: null,
        };

      return style;
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

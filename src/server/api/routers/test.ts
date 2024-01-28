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

    if (!randomTest) return null;

    const versions = await ctx.db.version.findMany({
      where: {
        testId: randomTest.id,
      },
      select: {
        id: true,
      },
    });
    const randomVersion = sample(versions);

    if (!randomVersion) return null;

    return {
      versionId: randomVersion.id,
    };
  }),

  getComponentStyles: publicProcedure
    .input(
      z.object({
        versionId: z.string().uuid(),
        componentDomId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { componentDomId, versionId } = input;

      const component = await ctx.db.component.findUnique({
        where: {
          domId: componentDomId,
        },
        select: {
          id: true,
        },
      });

      if (!component) return null;

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

      if (!style) return null;

      return {
        className: style.className,
      };
    }),
});

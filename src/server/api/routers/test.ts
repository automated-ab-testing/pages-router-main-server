import { z } from "zod";
import { sample } from "lodash";
import { EventType } from "@prisma/client";

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
          featureFlags: {} as Record<string, boolean>,
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
          featureFlags: {} as Record<string, boolean>,
        };

      // Get all feature flags of the selected version
      const featureFlags = await tx.featureFlag.findMany({
        where: {
          versionId: randomVersion.id,
        },
        select: {
          isActive: true,
          component: {
            select: {
              domId: true,
            },
          },
        },
      });

      // Pivot the feature flags
      const pivot = featureFlags.reduce(
        (acc, curr) => {
          const { component, isActive } = curr;
          const { domId } = component;

          acc[domId] = isActive;

          return acc;
        },
        {} as Record<string, boolean>,
      );

      // Return all data
      return {
        versionId: randomVersion.id,
        featureFlags: pivot,
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

      await ctx.db.$transaction(async (tx) => {
        const prevEventLog = await tx.eventLog.findUnique({
          where: {
            versionId_userId_type: {
              versionId,
              userId: ctx.session.user.id,
              type: EventType.IMPRESSION,
            },
          },
        });

        if (!!prevEventLog) return;

        await tx.eventLog.create({
          data: {
            versionId,
            userId: ctx.session.user.id,
            type: EventType.IMPRESSION,
          },
        });
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

      await ctx.db.$transaction(async (tx) => {
        const prevEventLog = await tx.eventLog.findUnique({
          where: {
            versionId_userId_type: {
              versionId,
              userId: ctx.session.user.id,
              type: EventType.CLICK,
            },
          },
        });

        if (!!prevEventLog) return;

        await tx.eventLog.create({
          data: {
            versionId,
            userId: ctx.session.user.id,
            type: EventType.CLICK,
          },
        });
      });
    }),
});

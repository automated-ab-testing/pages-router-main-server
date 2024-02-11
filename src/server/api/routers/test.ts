import { z } from "zod";
import seedrandom from "seedrandom";
import { createTRPCRouter, userProcedure } from "~/server/api/trpc";

export const testRouter = createTRPCRouter({
  getInitialData: userProcedure.query(async ({ ctx }) => {
    // Define the seed for the random number generator
    const rng = seedrandom(ctx.session.user.id);

    const { versionId, rawFeatureFlags } = await ctx.db.$transaction(
      async (tx) => {
        // Get all active tests
        const activeTests = await tx.test.findMany({
          where: {
            isActive: true,
          },
          select: {
            id: true,
          },
        });

        // If there are no active tests, return empty data
        if (activeTests.length === 0)
          return {
            versionId: null,
            rawFeatureFlags: [] as {
              component: {
                domId: string;
              };
              isActive: boolean;
            }[],
          };

        // Randomly select one active test (deterministically using the seed)
        const randomTestIdx = rng.int32() % activeTests.length;
        const randomTest = activeTests[randomTestIdx];

        if (!randomTest)
          return {
            versionId: null,
            rawFeatureFlags: [] as {
              component: {
                domId: string;
              };
              isActive: boolean;
            }[],
          };

        // Get all versions in the active test
        const versions = await tx.version.findMany({
          where: {
            testId: randomTest.id,
          },
          select: {
            id: true,
          },
        });

        // If there are no versions in the active test, return empty data
        if (versions.length === 0)
          return {
            versionId: null,
            rawFeatureFlags: [] as {
              component: {
                domId: string;
              };
              isActive: boolean;
            }[],
          };

        // Randomly select one version in the active test (deterministically using the seed)
        // NOTE: Distribusi peluang dapat diubah dengan menggunakan HMM
        const randomVersionIdx = rng.int32() % versions.length;
        const randomVersion = versions[randomVersionIdx];

        if (!randomVersion)
          return {
            versionId: null,
            rawFeatureFlags: [] as {
              component: {
                domId: string;
              };
              isActive: boolean;
            }[],
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

        // Return all data
        return {
          versionId: randomVersion.id,
          rawFeatureFlags: featureFlags,
        };
      },
    );

    // Pivot the feature flag
    const pivot = rawFeatureFlags.reduce(
      (acc, curr) => {
        const { component, isActive } = curr;
        const { domId } = component;

        acc[domId] = isActive;

        return acc;
      },
      {} as Record<string, boolean>,
    );

    return {
      versionId,
      featureFlags: pivot,
    };
  }),

  incrementImpressions: userProcedure
    .input(
      z.object({
        versionId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { versionId } = input;

      await ctx.db.$transaction(async (tx) => {
        // Check if the user has already viewed the component
        const prevEventLog = await tx.eventLog.findUnique({
          where: {
            userId: ctx.session.user.id,
          },
        });

        // If the user has already viewed the component, return
        if (!!prevEventLog) return;

        // Else, create a new event log
        await tx.eventLog.create({
          data: {
            versionId,
            userId: ctx.session.user.id,
          },
        });
      });
    }),

  incrementClicks: userProcedure.mutation(async ({ ctx }) => {
    // Update the event log
    await ctx.db.eventLog.update({
      where: {
        userId: ctx.session.user.id,
      },
      data: {
        isClicked: true,
      },
    });
  }),
});

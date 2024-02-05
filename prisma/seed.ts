import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const result = await db.$transaction(async (tx) => {
    const test = await tx.test.create({
      data: {
        name: "Test Pertama",
      },
    });

    const firstVersion = await tx.version.create({
      data: {
        label: "A",
        testId: test.id,
      },
    });

    const secondVersion = await tx.version.create({
      data: {
        label: "B",
        testId: test.id,
      },
    });

    const firstComponent = await tx.component.create({
      data: {
        domId: "first-button",
      },
    });

    const secondComponent = await tx.component.create({
      data: {
        domId: "second-button",
      },
    });

    const styles = await tx.style.createMany({
      data: [
        {
          className: "bg-purple-500",
          versionId: firstVersion.id,
          componentId: firstComponent.id,
        },
        {
          className: "bg-red-500",
          versionId: secondVersion.id,
          componentId: secondComponent.id,
        },
      ],
    });

    return {
      test,
      versions: [firstVersion, secondVersion],
      components: [firstComponent, secondComponent],
      styles,
    };
  });

  console.log(result);
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });

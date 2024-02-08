import dynamic from "next/dynamic";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
} from "@nextui-org/react";

import SelectTest from "~/components/analytics/SelectTest";

const BarChart = dynamic(() => import("~/components/analytics/BarChart"), {
  ssr: false,
});

export default function DataCard() {
  return (
    <Card className="h-1/2 min-h-96 w-1/2 min-w-96">
      <CardHeader>
        <p className="text-lg">A/B Testing Analytics</p>
      </CardHeader>
      <Divider />
      <CardBody className="items-center justify-center">
        <BarChart />
      </CardBody>
      <Divider />
      <CardFooter className="flex w-auto flex-row gap-2 py-2">
        <SelectTest />
      </CardFooter>
    </Card>
  );
}

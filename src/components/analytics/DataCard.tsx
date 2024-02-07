import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
} from "@nextui-org/react";

import SelectTest from "~/components/analytics/SelectTest";
import SelectVersion from "~/components/analytics/SelectVersion";
import BarChart from "~/components/analytics/BarChart";

export default function DataCard() {
  return (
    <Card className="w-96">
      <CardHeader>
        <p className="text-lg">A/B Testing Analytics</p>
      </CardHeader>
      <Divider />
      <CardBody>
        <BarChart />
      </CardBody>
      <Divider />
      <CardFooter className="flex w-auto flex-row gap-2 py-2">
        <SelectTest />
        <SelectVersion />
      </CardFooter>
    </Card>
  );
}

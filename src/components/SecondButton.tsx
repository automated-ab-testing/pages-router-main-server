import { Button } from "@nextui-org/react";

import ButtonWrapper from "~/wrappers/ButtonWrapper";

export default function FirstButton() {
  return (
    <ButtonWrapper
      render={(props) => (
        <Button id="second-button" {...props}>
          Second Button
        </Button>
      )}
    />
  );
}

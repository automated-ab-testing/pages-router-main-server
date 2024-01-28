import { Button } from "@nextui-org/react";

import ButtonWrapper from "~/wrappers/ButtonWrapper";

export default function FirstButton() {
  return (
    <ButtonWrapper
      render={(props) => (
        <Button id="first-button" {...props}>
          First Button
        </Button>
      )}
    />
  );
}

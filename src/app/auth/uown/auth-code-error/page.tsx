"use client";

import {Button, Container, Title} from "@mantine/core";

///
export default function AuthCodeErrorPage() {
  //
  return (
    <Container className="flex flex-col items-center gap-5" size={"sm"} style={{marginTop: 80, textAlign: "center"}}>
      <Title order={2} className="text-red-600">Authentication Error</Title>
      <span>There was an issue with your authentication process. Please try again!</span>
      <Button color="red" onClick={() => {window.location.href = "vprojectz://uown.app/"}}>Back to App</Button>
    </Container>
  );
}
"use client";

import {Alert, Button, Text, Container, Title} from "@mantine/core";
import {IconAlertCircle} from "@tabler/icons-react";
import {useEffect, useState} from "react";

/// Example error: http://localhost:3000/auth/uown/auth-code-error#error=server_error&error_code=unexpected_failure&error_description=Database+error+saving+new+user
///
export default function AuthCodeErrorPage() {
  const [errorParams, setErrorParams] = useState<Record<string, string>>({});
  //
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.slice(1); // Remove the `#`
      const params = new URLSearchParams(hash);
      const result: Record<string, string> = {};
      for (const [key, value] of params.entries()) {
        result[key] = value;
      }
      setErrorParams(result);
    }
  }, []);
  //
  return (
    <Container className="flex flex-col items-center gap-5" size={"sm"} style={{marginTop: 80, textAlign: "center"}}>
      <Title order={2} className="text-red-600">Authentication Error</Title>
      <span>{"There was an issue with your authentication process. Please try again!"}</span>
      <Alert miw={"90%"} icon={<IconAlertCircle size={24} />} title={`Error: ${errorParams.error_code || errorParams.error}`} color="red" mb="md">
        <Text ta={"left"}>{errorParams.error_description || "An unknown error occurred during email confirmation."}</Text>
      </Alert>
      <Button color="red" onClick={() => {window.location.href = "vprojectz://uown.app/"}}>Back to App</Button>
    </Container>
  );
}
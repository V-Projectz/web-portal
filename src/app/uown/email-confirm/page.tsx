"use client";

import NextImage from "next/image";
import { useSearchParams } from "next/navigation";
import { Container, Title, Text, Alert, Button, Center, Image } from "@mantine/core";
import { IconCheck, IconAlertCircle } from "@tabler/icons-react";

import uOwnLogo from "@assets/svgs/u-own-logo.svg";
import { Suspense, useEffect, useState } from "react";

/* ========================================================================= */
///
export default function EmailConfirmPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <EmailConfirmContent />
    </Suspense>
  );
}

///
function EmailConfirmContent() {
  const searchParams = useSearchParams();

  const error = searchParams?.get("error");
  const errorCode = searchParams?.get("error_code");
  const errorDescription = searchParams?.get("error_description");
  const success = !error; // Assume success if no error param

  //
  const countdown = useAutoRedirect(5, "vprojectz://uown.app/");

  return (
    <Container size="sm" my="xl">
      <Center className="flex flex-col gap-2">
        <Image className="bg-gray-300" radius={"md"} component={NextImage} src={uOwnLogo} alt="U-Own Logo" h={60} w={60} />
        <Title order={2} mb="md">
          Email Confirmation for U-Own Application
        </Title>
      </Center>

      {success ? (
        <>
          <Alert icon={<IconCheck size={24} />} title="Success!" color="green" mb="md">
            Your email has been confirmed successfully. Thank you!
          </Alert>
          <Center>
            <Button component="a" href="vprojectz://uown.app/" variant="filled" color="green">
              Redirect to App ({countdown})
            </Button>
          </Center>
        </>
      ) : (
        <>
          <Alert icon={<IconAlertCircle size={24} />} title={`Error: ${errorCode || error}`} color="red" mb="md">
            <Text>{errorDescription || "An unknown error occurred during email confirmation."}</Text>
          </Alert>
          <Center>
            <Button component="a" href="/support" variant="filled" color="red">
              Contact Support
            </Button>
          </Center>
        </>
      )}
    </Container>
  );
}

///
function useAutoRedirect(seconds: number, url: string) {
  const [count, setCount] = useState(seconds);
  useEffect(() => {
    const timer = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          clearInterval(timer); // Stop counting
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    const redirect = setTimeout(() => (window.location.href = url), seconds * 1000);
    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [seconds, url]);
  //
  return count;
}
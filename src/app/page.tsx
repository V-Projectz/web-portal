import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  Text,
  Title,
} from "@mantine/core";
import { IconCircleFilled } from "@tabler/icons-react";

/* ========================================================================= */
export default function Root() {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShellHeader className="flex items-center px-5">
        <IconCircleFilled className="text-green-500 mr-2" />
        <Text className="font-bold">Welcome to <b className="font-extrabold">V-Projectz Web Portal</b>!</Text>
      </AppShellHeader>
      <AppShellMain>
        <Title className="text-center">
          <Text className="mr-2" inherit component="span" variant="gradient" gradient={{ from: "green", to: "gold" }}>
            V-Projectz
          </Text>
          Web Portal
        </Title>
        <Text
          className="text-center text-gray-700 dark:text-gray-300 max-w-[500px] mx-auto mt-xl"
          ta="center"
          size="lg"
          maw={"70%"}
          mx="auto"
          mt="xl"
        >
          This page is part of our developer infrastructure and is not intended for general users.<br />
          If you arrived here by accident, <span className="text-rose-600">there&apos;s nothing you need to do</span>.<br />
          For questions or access, please <span className="text-green-600">contact</span> the development team.
        </Text>
        <div className="p-5 text-center">
          <Text>
            Our main website located here: {" "}
            <a className="text-sky-600" href="https://vprojectz.com" target="_blank" rel="noopener noreferrer">
              www.vprojectz.com
            </a>
          </Text>
        </div>
      </AppShellMain>
    </AppShell>
  );
}

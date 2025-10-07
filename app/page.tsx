import { Analytics } from "@vercel/analytics/react";
import dynamic from "next/dynamic";

const HomeClient = dynamic(
  async () => (await import("./components/home")).Home,
  {
    ssr: false,
  },
);

export default async function App() {
  return (
    <>
      <HomeClient />
      <Analytics />
    </>
  );
}

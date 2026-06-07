import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/blank")({
  head: () => ({
    meta: [{ title: "Blank" }],
  }),
  component: Blank,
});

function Blank() {
  return null;
}

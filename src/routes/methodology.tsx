import { createFileRoute } from "@tanstack/react-router";
import About from "./about";

export const Route = createFileRoute("/methodology")({
  head: () => ({
    meta: [
      { title: "Methodology, Data & Scientific Limitations — TerraFlux" },
      {
        name: "description",
        content:
          "Scientific methodology, sensor specifications, harmonization logic, and radiometric limitations of TerraFlux for NASA FIRMS MODIS and VIIRS observations.",
      },
    ],
  }),
  component: About,
});

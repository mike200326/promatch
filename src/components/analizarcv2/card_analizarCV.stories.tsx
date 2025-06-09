import type { Meta, StoryObj } from "@storybook/react";
import { CardAnalizarCV } from "./card_analizarCV";

const meta: Meta<typeof CardAnalizarCV> = {
  title: "AnalizarCV/CardAnalizarCV", // cómo aparecerá en el panel de Storybook
  component: CardAnalizarCV,
  tags: ["autodocs"], // permite documentación automática
};

export default meta;

type Story = StoryObj<typeof CardAnalizarCV>;

export const Example: Story = {
  args: {
    logoUrl: "https://logo.clearbit.com/amazon.com",
    empresa: "Amazon",
    puesto: "Software Developer Jr.",
    coincidencias: 5,
    link: "/examen",
  },
};

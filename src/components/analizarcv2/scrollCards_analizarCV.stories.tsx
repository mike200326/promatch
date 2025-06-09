import type { Meta, StoryObj } from "@storybook/react";
import { ScrollCardsAnalizarCV } from "./scrollCards_analizarCV";

const meta: Meta<typeof ScrollCardsAnalizarCV> = {
  title: "AnalizarCV/ScrollCardsAnalizarCV", // 📁 Categoría y nombre
  component: ScrollCardsAnalizarCV,
  tags: ["autodocs"], // 📚 Documentación automática
};

export default meta;

type Story = StoryObj<typeof ScrollCardsAnalizarCV>;

export const Example: Story = {
  args: {},
};

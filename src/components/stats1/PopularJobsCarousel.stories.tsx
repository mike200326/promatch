import type { Meta, StoryObj } from "@storybook/react";
import PopularJobsCarousel from "./PopularJobsCarousel";

// 🚫 Vamos a evitar que use el botón de navegación

const meta: Meta<typeof PopularJobsCarousel> = {
  title: "Stats/PopularJobsCarousel",
  component: PopularJobsCarousel,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof PopularJobsCarousel>;

export const Default: Story = {
  render: () => (
    <div className="max-w-6xl mx-auto p-4 bg-gray-50">
      <PopularJobsCarousel />
    </div>
  ),
};

import type { Meta, StoryObj } from "@storybook/react";
import TimeStats, { TimeStat } from "./TimeStats";

const meta: Meta<typeof TimeStats> = {
  title: "Components/TimeStats",
  component: TimeStats,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    stats: {
      control: "object",
      description: "Array de estadísticas a mostrar",
    },
  },
};

export default meta;
type Story = StoryObj<typeof TimeStats>;

// Datos de ejemplo para las stories
const defaultStats: TimeStat[] = [
  { value: "100 hrs", label: "Tiempo promedio en Reclutamiento" },
  { value: "300 hrs", label: "Tiempo buscando empleados" },
  { value: "240 hrs", label: "Tiempo buscando trabajo por semana" },
  { value: "8 hrs", label: "Tiempo en exámenes en la página" },
];

const minimalStats: TimeStat[] = [
  { value: "24h", label: "Respuesta rápida" },
  { value: "99%", label: "Satisfacción" },
];

const manyStats: TimeStat[] = [
  ...defaultStats,
  { value: "5", label: "Procesos simultáneos" },
  { value: "30+", label: "Empresas asociadas" },
  { value: "1K", label: "Candidatos activos" },
];

// Stories
export const Default: Story = {
  args: {
    stats: defaultStats,
  },
};

export const MinimalVersion: Story = {
  args: {
    stats: minimalStats,
  },
  parameters: {
    docs: {
      description: {
        story: "Versión con solo dos estadísticas mostradas",
      },
    },
  },
};

export const ManyStats: Story = {
  args: {
    stats: manyStats,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Versión con más de cuatro estadísticas para probar el responsive",
      },
    },
  },
};

export const CustomColors: Story = {
  args: {
    stats: defaultStats.map((stat) => ({
      ...stat,
      value: `🔥 ${stat.value}`, // Ejemplo de personalización
    })),
  },
  decorators: [
    (Story) => (
      <div className="bg-gray-100 p-8 rounded-xl">
        <Story />
      </div>
    ),
  ],
};

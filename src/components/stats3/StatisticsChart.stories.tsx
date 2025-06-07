import type { Meta, StoryObj } from "@storybook/react"
import { StatisticsChart } from "./StatisticsChart"

const meta: Meta<typeof StatisticsChart> = {
    title: "Stats/StatisticsChart",
    component: StatisticsChart,
    tags: ["autodocs"],
    parameters: {
      docs: {
        description: {
          component:
            "StatisticsChart muestra una gráfica de líneas representando datos estadísticos en el tiempo, ideal para visualizar tendencias anuales.",
        },
      },
    },
  };

export default meta
type Story = StoryObj<typeof StatisticsChart>

export const Default: Story = {
  render: () => <StatisticsChart />
}

export const Empty: Story = {
    name: "Empty (sin datos)",
    render: () => (
      <div style={{
        padding: "2rem",
        backgroundColor: "#f9fafb",
        display: "flex",
        justifyContent: "center",
      }}>
        <div
          style={{
            width: "800px",
            height: "420px",
            border: "1px dashed #ccc",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#999",
            fontSize: "18px",
          }}
        >
          No hay datos para mostrar
        </div>
      </div>
    ),
  };

  export const Loading: Story = {
    name: "Cargando",
    render: () => (
      <div style={{
        width: "800px",
        height: "400px",
        backgroundColor: "#eee",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#888",
        fontSize: "18px",
      }}>
        ⏳ Cargando gráfica...
      </div>
    ),
  };

  export const Error: Story = {
    name: "Error al cargar",
    render: () => (
      <div style={{
        width: "800px",
        height: "400px",
        backgroundColor: "#fee",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#c00",
        fontSize: "18px",
      }}>
        ❌ Error al cargar datos
      </div>
    ),
  };
import type { Meta, StoryObj } from "@storybook/react";
import { ChartControls } from "./ChartControls";

const meta: Meta<typeof ChartControls> = {
  title: "Stats/ChartControls",
  component: ChartControls,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "ChartControls presenta botones rápidos para interactuar con la gráfica: bloquear, marcar, compartir, exportar o imprimir.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ChartControls>;

export const Default: Story = {
  name: "Default",
  render: () => (
    <div style={{ position: "relative", width: "600px", height: "400px", backgroundColor: "#f9fafb", border: "1px solid #ddd", borderRadius: "8px" }}>
      <ChartControls />
    </div>
  ),
};

export const Minimal: Story = {
  name: "Minimal (2 acciones)",
  render: () => (
    <div style={{ position: "relative", width: "600px", height: "400px", backgroundColor: "#f9fafb", border: "1px dashed #bbb", borderRadius: "8px" }}>
      <div style={{
        position: "absolute",
        top: "48px",
        right: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem"
      }}>
        <button style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "white", border: "1px solid #ccc" }}>🔗</button>
        <button style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "white", border: "1px solid #ccc" }}>📄</button>
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  name: "Controles Deshabilitados",
  render: () => (
    <div style={{ position: "relative", width: "600px", height: "400px", backgroundColor: "#f9fafb", border: "1px solid #ddd", borderRadius: "8px" }}>
      <div style={{
        position: "absolute",
        top: "48px",
        right: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem"
      }}>
        <button style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#eee", border: "1px solid #ccc", color: "#aaa", pointerEvents: "none" }}>🔒</button>
        <button style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#eee", border: "1px solid #ccc", color: "#aaa", pointerEvents: "none" }}>⭐</button>
      </div>
    </div>
  ),
};

import type { Meta, StoryObj } from "@storybook/react";
import { SourcesPanel } from "./SourcesPanel";

const meta: Meta<typeof SourcesPanel> = {
  title: "Stats/SourcesPanel",
  component: SourcesPanel,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "SourcesPanel muestra la metadata de una estadística como fecha, región, periodo, notas y citas.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SourcesPanel>;

export const Default: Story = {
  name: "Default",
  render: () => (
    <div style={{ padding: "2rem", backgroundColor: "#f9fafb", display: "flex", justifyContent: "center" }}>
      <SourcesPanel />
    </div>
  ),
};

export const Empty: Story = {
  name: "Empty (sin datos)",
  render: () => (
    <div style={{ padding: "2rem", backgroundColor: "#f9fafb", display: "flex", justifyContent: "center" }}>
      <div style={{
        width: "300px",
        border: "1px dashed #ccc",
        padding: "16px",
        borderRadius: "8px",
        textAlign: "center",
        color: "#888",
      }}>
        No hay fuentes disponibles
      </div>
    </div>
  ),
};

export const ExtendedNotes: Story = {
  name: "Notas extensas",
  render: () => (
    <div style={{ padding: "2rem", backgroundColor: "#f9fafb", display: "flex", justifyContent: "center" }}>
      <div style={{
        width: "300px",
        border: "1px solid #ccc",
        padding: "16px",
        borderRadius: "8px",
        backgroundColor: "white",
      }}>
        <h3>Fuentes</h3>
        <p><b>Notas Suplementarias:</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce at nulla in purus fermentum bibendum. Integer nec ex non justo convallis fermentum. Proin fermentum felis nec massa aliquam.</p>
      </div>
    </div>
  ),
};

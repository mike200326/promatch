export function SourcesPanel() {
  const sources = [
    { label: "Fecha de Publicación", value: "Febrero 2025" },
    { label: "Región", value: "México" },
    { label: "Periodo de Estudio", value: "2010 - 2025" },
    { label: "Notas Suplementarias" },
    { label: "Formatos de Citación" },
  ]

  return (
    <div className="bg-white border rounded-lg px-5 py-4 shadow-lg max-w-xs w-full space-y-2">
      <h3 className="text-xl font-bold text-gray-700">
        Fuentes
      </h3>
      <ul className="space-y-4"> {}
        {sources.map((src, i) => (
          <li key={i} className="text-sm text-gray-800 leading-tight flex flex-col">
            <span className="font-semibold">⭐ {src.label}</span>
            {src.value && <span className="text-gray-600">{src.value}</span>}
          </li>
        ))}
      </ul>
    </div>
  )
}

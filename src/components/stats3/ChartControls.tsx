import { Button } from "@/components/ui/button"
export function ChartControls() {
    const actions = ["🔒", "⭐", "🔗", "📄", "🖨️"]
  
    return (
      <div className="absolute right-3 top-12 flex flex-col space-y-2 z-10">
        {actions.map((icon, index) => (
          <Button
            key={index}
            variant="outline"
            size="icon"
            className="w-10 h-10 rounded-full shadow-md bg-white"
          >
            {icon}
          </Button>
        ))}
      </div>
    )
  }
  
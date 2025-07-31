"use client"

import { Button } from "@/components/ui/button"
import { Delete } from "lucide-react"

interface NumericKeypadProps {
  onNumberPress: (number: string) => void
  onBackspace: () => void
  disabled?: boolean
}

export function NumericKeypad({ onNumberPress, onBackspace, disabled = false }: NumericKeypadProps) {
  const numbers = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["", "0", "backspace"],
  ]

  return (
    <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
      {numbers.flat().map((item, index) => {
        if (item === "") {
          return <div key={index} className="h-16" /> // Empty space
        }

        if (item === "backspace") {
          return (
            <Button
              key={index}
              onClick={onBackspace}
              disabled={disabled}
              variant="outline"
              className="h-16 text-xl font-semibold bg-white/80 hover:bg-white border-gray-200 hover:border-gray-300 disabled:opacity-50"
            >
              <Delete size={24} className="text-gray-600" />
            </Button>
          )
        }

        return (
          <Button
            key={index}
            onClick={() => onNumberPress(item)}
            disabled={disabled}
            variant="outline"
            className="h-16 text-xl font-semibold bg-white/80 hover:bg-white border-gray-200 hover:border-gray-300 disabled:opacity-50"
          >
            {item}
          </Button>
        )
      })}
    </div>
  )
}

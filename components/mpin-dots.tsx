"use client"

interface MPINDotsProps {
  length: number
  filledCount: number
  error?: boolean
}

export function MPINDots({ length, filledCount, error = false }: MPINDotsProps) {
  return (
    <div className="flex justify-center space-x-4 my-8">
      {Array.from({ length }).map((_, index) => (
        <div
          key={index}
          className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
            index < filledCount
              ? error
                ? "bg-red-500 border-red-500"
                : "bg-blue-600 border-blue-600"
              : error
                ? "border-red-300"
                : "border-gray-300"
          }`}
        />
      ))}
    </div>
  )
}

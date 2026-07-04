"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Settings } from "lucide-react"

export default function Calculator() {
  const [display, setDisplay] = useState("0")
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === "0" ? num : display + num)
    }
  }

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.")
      setWaitingForOperand(false)
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".")
    }
  }

  const clear = () => {
    setDisplay("0")
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  const performOperation = (nextOperation: string) => {
    const inputValue = Number.parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case "+":
        return firstValue + secondValue
      case "-":
        return firstValue - secondValue
      case "×":
        return firstValue * secondValue
      case "÷":
        return firstValue / secondValue
      case "=":
        return secondValue
      default:
        return secondValue
    }
  }

  const handleEquals = () => {
    const inputValue = Number.parseFloat(display)

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation)
      setDisplay(String(newValue))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForOperand(true)
    }
  }

  return (
    <Card className="w-80 bg-gray-100 overflow-hidden">
      {/* Display Area */}
      <div className="bg-gray-200 p-4 h-20 flex items-center justify-between">
        <span className="text-sm text-gray-600">Rad</span>
        <div className="flex-1 text-right mr-4">
          <div className="text-2xl font-light text-gray-800 truncate">{display}</div>
        </div>
        <Settings className="w-5 h-5 text-gray-600" />
      </div>

      {/* Keypad */}
      <div className="bg-gray-800 p-4">
        <div className="grid grid-cols-4 gap-3">
          {/* Row 1 */}
          <Button
            onClick={() => inputNumber("7")}
            className="h-14 text-xl font-light bg-gray-700 hover:bg-gray-600 text-white border-0"
          >
            7
          </Button>
          <Button
            onClick={() => inputNumber("8")}
            className="h-14 text-xl font-light bg-gray-700 hover:bg-gray-600 text-white border-0"
          >
            8
          </Button>
          <Button
            onClick={() => inputNumber("9")}
            className="h-14 text-xl font-light bg-gray-700 hover:bg-gray-600 text-white border-0"
          >
            9
          </Button>
          <Button onClick={clear} className="h-14 text-lg font-light bg-gray-700 hover:bg-gray-600 text-white border-0">
            AC
          </Button>

          {/* Row 2 */}
          <Button
            onClick={() => inputNumber("4")}
            className="h-14 text-xl font-light bg-gray-700 hover:bg-gray-600 text-white border-0"
          >
            4
          </Button>
          <Button
            onClick={() => inputNumber("5")}
            className="h-14 text-xl font-light bg-gray-700 hover:bg-gray-600 text-white border-0"
          >
            5
          </Button>
          <Button
            onClick={() => inputNumber("6")}
            className="h-14 text-xl font-light bg-gray-700 hover:bg-gray-600 text-white border-0"
          >
            6
          </Button>
          <Button
            onClick={() => performOperation("÷")}
            className="h-14 text-xl font-light bg-gray-700 hover:bg-gray-600 text-white border-0"
          >
            ÷
          </Button>

          {/* Row 3 */}
          <Button
            onClick={() => inputNumber("1")}
            className="h-14 text-xl font-light bg-gray-700 hover:bg-gray-600 text-white border-0"
          >
            1
          </Button>
          <Button
            onClick={() => inputNumber("2")}
            className="h-14 text-xl font-light bg-gray-700 hover:bg-gray-600 text-white border-0"
          >
            2
          </Button>
          <Button
            onClick={() => inputNumber("3")}
            className="h-14 text-xl font-light bg-gray-700 hover:bg-gray-600 text-white border-0"
          >
            3
          </Button>
          <Button
            onClick={() => performOperation("×")}
            className="h-14 text-xl font-light bg-gray-700 hover:bg-gray-600 text-white border-0"
          >
            ×
          </Button>

          {/* Row 4 */}
          <Button
            onClick={inputDecimal}
            className="h-14 text-xl font-light bg-gray-700 hover:bg-gray-600 text-white border-0"
          >
            .
          </Button>
          <Button
            onClick={() => inputNumber("0")}
            className="h-14 text-xl font-light bg-gray-700 hover:bg-gray-600 text-white border-0"
          >
            0
          </Button>
          <Button
            onClick={handleEquals}
            className="h-14 text-xl font-light bg-gray-700 hover:bg-gray-600 text-white border-0"
          >
            =
          </Button>
          <Button
            onClick={() => performOperation("-")}
            className="h-14 text-xl font-light bg-gray-700 hover:bg-gray-600 text-white border-0"
          >
            −
          </Button>

          {/* Plus button spanning full height on the right */}
          <Button
            onClick={() => performOperation("+")}
            className="h-14 text-xl font-light bg-teal-600 hover:bg-teal-500 text-white border-0 col-start-4 row-start-5"
          >
            +
          </Button>
        </div>
      </div>
    </Card>
  )
}

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
  

interface Props {
    value :string
    onChange: (value?: string) => void
    placeholder ?: string
    disabled?: boolean
}

function AmountInput({onChange,value,disabled,placeholder}:Props) {
    const parsedValue = parseFloat(value)
    const isIncome = parsedValue > 0
    const isExpense = parsedValue < 0
  return (
    <div><TooltipProvider>
    <Tooltip>
      <TooltipTrigger>Hover</TooltipTrigger>
      <TooltipContent>
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
  </div>
  )
}

export default AmountInput
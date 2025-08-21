import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface FormFieldProps {
  label: string
  id: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  type?: string
  multiline?: boolean
  rows?: number
  helpText?: string
  className?: string
}

export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ label, id, value, onChange, placeholder, required = false, type = "text", multiline = false, rows = 4, helpText, className }, ref) => {
    const InputComponent = multiline ? Textarea : Input

    return (
      <div ref={ref} className={cn("space-y-2", className)}>
        <Label htmlFor={id} className="text-sm font-medium text-foreground">
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
        <InputComponent
          id={id}
          type={type}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full"
          rows={multiline ? rows : undefined}
        />
        {helpText && (
          <p className="text-xs text-muted-foreground">
            {helpText}
          </p>
        )}
      </div>
    )
  }
)

FormField.displayName = "FormField"

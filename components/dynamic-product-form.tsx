"use client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getCategoryByName, type ProductField } from "@/lib/product-categories"

interface DynamicProductFormProps {
  category: string
  formData: Record<string, any>
  onChange: (data: Record<string, any>) => void
}

export function DynamicProductForm({ category, formData, onChange }: DynamicProductFormProps) {
  const categoryConfig = getCategoryByName(category)

  if (!categoryConfig) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">Please select a category to see product fields</p>
      </div>
    )
  }

  const handleFieldChange = (fieldName: string, value: string | number) => {
    onChange({
      ...formData,
      [fieldName]: value,
    })
  }

  const renderField = (field: ProductField) => {
    const value = formData[field.name] || ""

    switch (field.type) {
      case "text":
        return (
          <Input
            id={field.name}
            className="col-span-3"
            value={value}
            placeholder={field.placeholder}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
          />
        )

      case "number":
        return (
          <Input
            id={field.name}
            type="number"
            className="col-span-3"
            value={value}
            placeholder={field.placeholder}
            onChange={(e) => handleFieldChange(field.name, Number(e.target.value) || 0)}
          />
        )

      case "select":
        return (
          <Select value={value} onValueChange={(val) => handleFieldChange(field.name, val)}>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-800">Category: {category}</h4>
        <p className="text-sm text-blue-600">Fill in the fields specific to this product category</p>
      </div>

      {categoryConfig.fields.map((field) => (
        <div key={field.name} className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor={field.name} className="text-right">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {renderField(field)}
        </div>
      ))}
    </div>
  )
}

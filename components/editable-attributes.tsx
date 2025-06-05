"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Edit2, X } from "lucide-react"
import type { ExtractedAttributes } from "@/lib/ocr-service"

interface EditableAttributesProps {
  attributes: ExtractedAttributes
  onSave: (updatedAttributes: ExtractedAttributes) => void
  onCancel?: () => void
}

export function EditableAttributes({ attributes, onSave, onCancel }: EditableAttributesProps) {
  const [editedAttributes, setEditedAttributes] = useState<ExtractedAttributes>({ ...attributes })
  const [isEditing, setIsEditing] = useState(false)

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setEditedAttributes({ ...attributes })
    setIsEditing(false)
    if (onCancel) onCancel()
  }

  const handleSave = () => {
    onSave(editedAttributes)
    setIsEditing(false)
  }

  const handleChange = (key: string, value: string) => {
    setEditedAttributes((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md">Extracted Product Data</CardTitle>
        {!isEditing ? (
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Edit2 className="h-4 w-4 mr-1" /> Edit
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
            <Button variant="default" size="sm" onClick={handleSave}>
              <Check className="h-4 w-4 mr-1" /> Save
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(editedAttributes).map(([key, value]) => (
            <div key={key} className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor={`attr-${key}`} className="text-right">
                {key}
              </Label>
              {isEditing ? (
                <Input
                  id={`attr-${key}`}
                  value={value}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="col-span-2"
                />
              ) : (
                <div className="col-span-2 p-2 bg-muted rounded-md">{value}</div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      {isEditing && (
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </CardFooter>
      )}
    </Card>
  )
}

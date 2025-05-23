"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface MiniModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children?: React.ReactNode
  footerContent?: React.ReactNode
}

export function MiniModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footerContent,
}: MiniModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="fixed inset-0 bg-black/50" />
      <div 
        className="z-50 max-w-[320px] rounded-lg bg-white shadow-lg p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-base font-medium">{title}</h3>
            {description && <p className="text-xs text-gray-500">{description}</p>}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="py-1">
          {children}
        </div>
        
        {footerContent && (
          <div className="mt-3 flex justify-end space-x-2">
            {footerContent}
          </div>
        )}
      </div>
    </div>
  )
} 
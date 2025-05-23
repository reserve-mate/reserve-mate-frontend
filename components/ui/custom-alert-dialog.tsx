"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const CompactAlertDialog = AlertDialogPrimitive.Root

const CompactAlertDialogTrigger = AlertDialogPrimitive.Trigger

const CompactAlertDialogPortal = AlertDialogPrimitive.Portal

const CompactAlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 flex items-center justify-center",
      className
    )}
    {...props}
    ref={ref}
  />
))
CompactAlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const CompactAlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <CompactAlertDialogPortal>
    <CompactAlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-[320px] translate-x-[-50%] translate-y-[-50%] gap-2 border bg-background p-3 shadow-lg rounded-lg overflow-hidden duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        className
      )}
      {...props}
    />
  </CompactAlertDialogPortal>
))
CompactAlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const CompactAlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
CompactAlertDialogHeader.displayName = "CompactAlertDialogHeader"

const CompactAlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-row justify-end space-x-1",
      className
    )}
    {...props}
  />
)
CompactAlertDialogFooter.displayName = "CompactAlertDialogFooter"

const CompactAlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-base font-medium", className)}
    {...props}
  />
))
CompactAlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const CompactAlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-xs text-muted-foreground", className)}
    {...props}
  />
))
CompactAlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

const CompactAlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants({ size: "sm" }), "h-7 text-xs px-3 py-0", className)}
    {...props}
  />
))
CompactAlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const CompactAlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline", size: "sm" }),
      "h-7 text-xs px-3 py-0",
      className
    )}
    {...props}
  />
))
CompactAlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  CompactAlertDialog,
  CompactAlertDialogPortal,
  CompactAlertDialogOverlay,
  CompactAlertDialogTrigger,
  CompactAlertDialogContent,
  CompactAlertDialogHeader,
  CompactAlertDialogFooter,
  CompactAlertDialogTitle,
  CompactAlertDialogDescription,
  CompactAlertDialogAction,
  CompactAlertDialogCancel,
} 
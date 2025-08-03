"use client"

import * as React from "react"
import type { ToastProps, ToastActionElement } from "@radix-ui/react-toast"
import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

const Toast = React.forwardRef<React.ElementRef<typeof toast.Root>, ToastProps>(
  ({ className, variant, ...props }, ref) => {
    const Icon =
      variant === "success"
        ? CheckCircle
        : variant === "destructive"
          ? XCircle
          : variant === "info"
            ? Info
            : variant === "warning"
              ? AlertTriangle
              : null

    return (
      <toast.Root
        ref={ref}
        className={cn(
          "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full data-[state=closed]:slide-out-to-right-full",
          variant === "default" && "border bg-background text-foreground",
          variant === "destructive" &&
            "destructive group border-destructive bg-destructive text-destructive-foreground",
          variant === "success" && "border-green-500 bg-green-500 text-white",
          variant === "info" && "border-blue-500 bg-blue-500 text-white",
          variant === "warning" && "border-yellow-500 bg-yellow-500 text-black",
          className,
        )}
        {...props}
      >
        {Icon && <Icon className="h-5 w-5" />}
        <div className="grid gap-1">
          {props.title && <toast.Title>{props.title}</toast.Title>}
          {props.description && <toast.Description>{props.description}</toast.Description>}
        </div>
        {props.action}
        <toast.Close />
      </toast.Root>
    )
  },
)
Toast.displayName = toast.Root.displayName

type ToastActionProps = React.ComponentPropsWithoutRef<typeof toast.Action>

const ToastAction = React.forwardRef<React.ElementRef<typeof toast.Action>, ToastActionProps>(
  ({ className, ...props }, ref) => (
    <toast.Action
      ref={ref}
      className={cn(
        "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
        className,
      )}
      {...props}
    />
  ),
)
ToastAction.displayName = toast.Action.displayName

type ToastCloseProps = React.ComponentPropsWithoutRef<typeof toast.Close>

const ToastClose = React.forwardRef<React.ElementRef<typeof toast.Close>, ToastCloseProps>(
  ({ className, ...props }, ref) => (
    <toast.Close
      ref={ref}
      className={cn(
        "absolute right-1 top-1 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100",
        className,
      )}
      toast-close=""
      {...props}
    >
      <XCircle className="h-4 w-4" />
    </toast.Close>
  ),
)
ToastClose.displayName = toast.Close.displayName

type ToastTitleProps = React.ComponentPropsWithoutRef<typeof toast.Title>

const ToastTitle = React.forwardRef<React.ElementRef<typeof toast.Title>, ToastTitleProps>(
  ({ className, ...props }, ref) => (
    <toast.Title ref={ref} className={cn("text-sm font-semibold", className)} {...props} />
  ),
)
ToastTitle.displayName = toast.Title.displayName

type ToastDescriptionProps = React.ComponentPropsWithoutRef<typeof toast.Description>

const ToastDescription = React.forwardRef<React.ElementRef<typeof toast.Description>, ToastDescriptionProps>(
  ({ className, ...props }, ref) => (
    <toast.Description ref={ref} className={cn("text-sm opacity-90", className)} {...props} />
  ),
)
ToastDescription.displayName = toast.Description.displayName

type ToastViewportProps = React.ComponentPropsWithoutRef<typeof toast.Viewport>

const ToastViewport = React.forwardRef<React.ElementRef<typeof toast.Viewport>, ToastViewportProps>(
  ({ className, ...props }, ref) => (
    <toast.Viewport
      ref={ref}
      className={cn(
        "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
        className,
      )}
      {...props}
    />
  ),
)
ToastViewport.displayName = toast.Viewport.displayName

export {
  Toast,
  ToastAction,
  ToastClose,
  ToastTitle,
  ToastDescription,
  ToastViewport,
  type ToastProps,
  type ToastActionElement,
}

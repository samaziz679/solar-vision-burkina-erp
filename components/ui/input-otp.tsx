"use client"

import * as React from "react"
import { OTPInput, type OTPInputProps } from "input-otp"
import { Dot } from "lucide-react"

import { cn } from "@/lib/utils"

const InputOTP = React.forwardRef<React.ElementRef<typeof OTPInput>, OTPInputProps>(
  ({ className, containerClassName, ...props }, ref) => (
    <OTPInput
      ref={ref}
      containerClassName={cn("flex items-center gap-2 has-[:disabled]:opacity-50", containerClassName)}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  ),
)
InputOTP.displayName = "InputOTP"

const InputOTPGroup = React.forwardRef<React.ElementRef<"div">, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("flex items-center", className)} {...props} />,
)
InputOTPGroup.displayName = "InputOTPGroup"

const InputOTPSlot = React.forwardRef<
  React.ElementRef<"div">,
  React.HTMLAttributes<HTMLDivElement> & { index: number }
>(({ index, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex h-9 w-9 items-center justify-center border border-input text-sm shadow-sm transition-all has-[:focus-visible]:z-10 has-[:focus-visible]:ring-1 has-[:focus-visible]:ring-ring",
      index === 0 && "rounded-l-md",
      index === props.children.length - 1 && "rounded-r-md",
      className,
    )}
    {...props}
  >
    {props.children}
    <div className="pointer-events-none absolute inset-0 -z-10 rounded-md bg-white" />
  </div>
))
InputOTPSlot.displayName = "InputOTPSlot"

const InputOTPSeparator = React.forwardRef<React.ElementRef<"div">, React.HTMLAttributes<HTMLDivElement>>(
  ({ ...props }, ref) => (
    <div ref={ref} role="separator" {...props}>
      <Dot />
    </div>
  ),
)
InputOTPSeparator.displayName = "InputOTPSeparator"

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }

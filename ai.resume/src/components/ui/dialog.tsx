"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X as XIcon } from "lucide-react"; // adjust import if you use XIcon
import { cn } from "./utils";

// Root / Triggers / Portal / Close — simple wrappers (no refs required)
function Dialog(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}
function DialogTrigger(props: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}
function DialogPortal(props: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}
function DialogClose(props: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

// Overlay must forward ref (if you wrap Radix primitives)
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    data-slot="dialog-overlay"
    className={cn(
      "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = "DialogOverlay";

// IMPORTANT: forwardRef for Content. This is the key piece.
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { children?: React.ReactNode }
>(({ className, children, ...props }, ref) => {
  return (
    <DialogPortal>
      <DialogOverlay />

      <DialogPrimitive.Content
        ref={ref}
        data-slot="dialog-content"
        className={cn(
          // Note: p-0 and overflow-hidden allow internal scroll area to handle overflow
          "fixed left-1/2 top-1/2 z-50 w-full max-w-5xl translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white shadow-lg p-0 overflow-hidden",
          className
        )}
        {...props}
      >
        {/* structure: sticky header -> scrollable body -> sticky footer */}
        <div className="flex flex-col max-h-[90vh]">
          {/* put header outside scrollable area */}
          {/* If user wants a header component, render children with Header/Footer wrappers as needed */}
          {/* We'll assume the children includes header/body/footer; we provide a standard slot layout below */}
          {/*
            If your consumer renders header/footer separately, put them as first/last children.
            Otherwise you can use the sample usage shown in README snippet below.
          */}

          {/* To keep things backward-compatible, if user passed children directly,
              we won't assume they are split; but we offer a recommended structure in docs. */}
          <div style={{ WebkitOverflowScrolling: "touch" }} className="flex-1 overflow-y-auto">
            {children}
          </div>
        </div>

        {/* Close button */}
        <DialogPrimitive.Close aria-label="Close" className="absolute right-4 top-4 inline-flex items-center justify-center p-1 rounded hover:opacity-90">
          <XIcon />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});
DialogContent.displayName = "DialogContent";

// Small presentational components
function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="dialog-header" className={cn("flex flex-col gap-2 p-4", className)} {...props} />
  );
}
function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="dialog-footer" className={cn("flex items-center justify-end gap-3 p-4", className)} {...props} />
  );
}
function DialogTitle(props: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title data-slot="dialog-title" className="text-lg font-semibold" {...props} />;
}
function DialogDescription(props: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description data-slot="dialog-description" className="text-sm text-muted-foreground" {...props} />;
}

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose
};

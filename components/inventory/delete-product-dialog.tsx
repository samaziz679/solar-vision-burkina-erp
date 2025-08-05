"use client"
import { useTransition } from "react"

interface DeleteProductDialogProps {
  productId: string
  isOpen: boolean
  onClose: () => void
}

export function DeleteProductDialog({ productId, isOpen, onClose }: DeleteProductDialogProps) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {

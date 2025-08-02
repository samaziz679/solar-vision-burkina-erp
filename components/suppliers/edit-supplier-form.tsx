import { useFormState, type FormAction } from "react-dom"
import type Supplier from "@/types/Supplier" // Assuming Supplier type is imported from a types file

interface EditSupplierFormProps {
  initialData: Supplier
  action: FormAction // Add action prop with FormAction type
}

export default function EditSupplierForm({ initialData, action }: EditSupplierFormProps) {
  const [state, formAction] = useFormState(action, {}) // Update useFormState to pass the action prop
  // ... rest of the component
}

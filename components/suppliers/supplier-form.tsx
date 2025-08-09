"use client"

import type React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"

interface SupplierFormProps {
  initialData?: {
    name: string
    email: string
    phone_number: string
  }
  onSubmit: (data: any) => void
}

const SupplierForm: React.FC<SupplierFormProps> = ({ initialData, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [phoneNumber, setPhoneNumber] = useState(initialData?.phone_number || "")

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-2">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={initialData?.name}
          {...register("name", { required: "Name is required" })}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>
      <div className="grid gap-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={initialData?.email}
          {...register("email", { required: "Email is required" })}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>
      <div className="grid gap-2">
        <label htmlFor="phone_number" className="text-sm font-medium">
          Phone Number
        </label>
        <input
          id="phone_number"
          name="phone_number"
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none"
        />
        {errors.phone_number && <p className="text-red-500">{errors.phone_number.message}</p>}
      </div>
      <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
        Submit
      </button>
    </form>
  )
}

export default SupplierForm

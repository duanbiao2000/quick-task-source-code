import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ErrorHoverCard } from "./ErrorHoverCard";
import { useFormContext } from "react-hook-form";

function PasswordInput({ name, label }: { name: string; label: string }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  // Simplified errorMessage logic based on name
  const errorMessage = errors[name]?.message?.toString();

  return (
    <div className="grid gap-2 relative">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        {...register(name)}
        type="password"
        required
        placeholder={`Your ${label}...`}
      />
      {errorMessage && <ErrorHoverCard message={errorMessage} />}
    </div>
  );
}

export default PasswordInput;

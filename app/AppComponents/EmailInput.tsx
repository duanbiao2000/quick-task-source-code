import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ErrorHoverCard } from "./ErrorHoverCard";
import { useFormContext } from "react-hook-form";
function EmailInput({ name, label }: { name: string; label: string }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const errorMessage = errors["email"] && errors["email"].message;
  return (
    <div className="grid gap-2 relative">
      <Label htmlFor="email">{label}</Label>
      <Input
        {...register("email")}
        id={name}
        type="email"
        placeholder="m@example.com"
        required
      />
      {errors["email"] && (
        <>
          <ErrorHoverCard message={errorMessage?.toString()} />
        </>
      )}
    </div>
  );
}

export default EmailInput;

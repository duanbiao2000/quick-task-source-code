"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { AppLogo } from "../AppLogo";
import EmailInput from "../EmailInput";
import PasswordInput from "../PasswordInput";
import { signUpSchema } from "../validationSchema";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

import { useUserStore } from "@/app/stores/useUserStore";

// Infer the form data type from the signUpSchema
type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const methods = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const { toast } = useToast();
  const router = useRouter();

  const { signUpFunction, isLoading } = useUserStore();

  const onSubmit = async (data: SignUpFormData) => {
    const res = await signUpFunction({
      email: data.email,
      password: data.password,
    });

    if (res.result) {
      toast({
        title: "Sign up successful!",
        description: "Your account has been created.",
      });
      router.push("/to-dos");
    } else if (res.error) {
      toast({
        title: res.error,
        description:
          "This email is already registered. Please use a different email or try logging in.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sign up failed",
        description: "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const handleErrorsToast = () => {
    const { errors } = methods.formState;
    const errorFields = ["email", "password", "confirmPassword"] as const;

    errorFields.forEach((field) => {
      if (errors[field]) {
        toast({
          title: "Validation Error",
          description: errors[field]?.message?.toString(),
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div>
      <AppLogo />
      <Card className="w-full max-w-sm py-2">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit, handleErrorsToast)}>
            <CardHeader>
              <CardTitle className="text-[22px] font-bold">Sign Up</CardTitle>
              <CardDescription>
                Enter your information to create an account
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 mt-3">
              <EmailInput name="email" label="Email" />
              <PasswordInput name="password" label="Password" />
              <PasswordInput name="confirmPassword" label="Confirm Password" />
              <div className="mt-4 text-sm flex items-center justify-center gap-1">
                <span>Already have an account?</span>
                <Label className="text-primary">
                  <Link href="/">Sign in</Link>
                </Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                {isLoading ? "loading..." : "create an account"}
              </Button>
            </CardFooter>
          </form>
        </FormProvider>
      </Card>
    </div>
  );
}

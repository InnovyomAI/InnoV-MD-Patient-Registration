"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "../form";
//import { loginUser } from "@/lib/actions/user.actions"; // Adjust the import as necessary
import { LoginFormValidation } from "../../lib/validation"; // Adjust the import as necessary

import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";

const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof LoginFormValidation>>({
    resolver: zodResolver(LoginFormValidation),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginFormValidation>) => {
    setIsLoading(true);

    try {
      const user = {
        username: values.username,
        password: values.password,
      };

      //const loggedInUser = await loginUser(user);
      const loggedInUser = 'sanil';
      if (loggedInUser) {
        router.push(`/dashboard`); // Redirect to a protected route after login
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        <section className="mb-12 space-y-4">
          <h1 className="header">Welcome Back</h1>
          <p className="text-dark-700">Please login to register patients.</p>
        </section>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="username"
          label="Username"
          placeholder="johndoe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="password"
          label="Password"
          placeholder="********"
          iconSrc="/assets/icons/passkey.svg"
          iconAlt="lock"
        />

        <SubmitButton isLoading={isLoading}>Login</SubmitButton>
      </form>
    </Form>
  );
};

export default LoginForm;

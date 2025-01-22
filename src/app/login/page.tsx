"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Link from "next/link";
import Loading from "@/components/Loading";

const Page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();

  const signUpSchema = z.object({
    email: z
      .string()
      .min(1, { message: "Email is required." })
      .email("Invalid email."),
    password: z.string().min(8, "Password must be 8 character."),
  });
  type SignUpFormData = z.infer<typeof signUpSchema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  useEffect(() => {
    if (status === "loading") return;

    if (session) {
      router.push("/");
    } else {
      setIsLoading(false);
    }
  }, [session, status, router]);

  if (isLoading || status === "loading") {
    return (
      <div className="h-screen">
        <Loading />;
      </div>
    );
  }

  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true);
    const response = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    setLoading(false);
    if (!response?.error) {
      toast.success("Logged in successfully.");
      router.push("/");
      router.refresh();
      return;
    }
    return toast.error("Incorrect email or password.");
  };

  return (
    <div className="font-barlow max-w-[600px] w-11/12 md:w-1/2 lg:w-1/3 mx-auto  py-10 md:py-16">
      {loading && (
        <div className=" absolute bg-white/80 z-[100] w-full md:w-1/2 lg:w-1/3 mx-auto w- h-[70%] overflow-hidden">
          <Loading />
        </div>
      )}
      <div className="flex flex-col items-center gap-7">
        <h1 className="text-3xl text-black font-semibold">Log In</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-7 w-full"
        >
          <div className="flex flex-col gap-2 w-full">
            <Input
              type="email"
              label="Email:"
              placeHolder="example@gmail.com"
              register={register("email")}
              error={errors.email}
              required={true}
              name="email"
            />
            <Input
              type="password"
              label="Password:"
              placeHolder="Password"
              register={register("password")}
              error={errors.password}
              required={true}
              name="password"
            />
            <div className="flex justify-center gap-1">
              <p className="">If you don&apos;t have an account</p>
              <Link href="/signup" className="text-blue-600">
                Create Account
              </Link>
            </div>
          </div>
          <Button type="submit" variant="secondary" size="md">
            Log in
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Page;

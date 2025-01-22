"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Loading from "@/components/Loading";
import { useSession } from "next-auth/react";

const Page = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const signUpSchema = z.object({
    name: z.string().min(3, "User name is required."),
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
    try {
      setLoading(true);
      await axios.post("/api/auth/register", data);
      setLoading(false);
      toast.success("Account created successfully you can now login");
      router.push("/login");
    } catch (err) {
      setLoading(false);
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message;
        if (msg) {
          toast.error(msg);
        } else {
          toast.error(err?.message);
        }
      }
    }
  };
  return (
    <div className="font-barlow max-w-[600px] relative w-11/12 md:w-1/2 lg:w-1/3 mx-auto py-10 md:py-16">
      {loading && (
        <div className=" absolute bg-white/80 z-[100] w-full h-[85%]">
          <Loading />
        </div>
      )}
      <div className="flex flex-col items-center gap-7">
        <h1 className="text-3xl font-semibold tracking-wide text-black">
          Sign Up
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-7 w-full"
        >
          <div className="flex flex-col gap-2 w-full">
            <Input
              type="text"
              label="Username:"
              placeHolder="Betelhem Kirub"
              register={register("name")}
              error={errors.name}
              required={true}
              name="name"
            />
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
              <p className="">If you already have an account </p>
              <Link href="/login" className="text-blue-600">
                Log in
              </Link>
            </div>
          </div>
          <Button type="submit" variant="secondary" size="md">
            Sign Up
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Page;

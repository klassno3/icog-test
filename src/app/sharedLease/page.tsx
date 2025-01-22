"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SharedLease from "./SharedLease";
import Loading from "@/components/Loading";

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login"); // Redirect to login page if not authenticated
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

  return (
    <div className="w-11/12 mx-auto min-h-screen">
      <SharedLease />
    </div>
  );
};

export default Page;

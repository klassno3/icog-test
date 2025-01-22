import Link from "next/link";
import React from "react";
import Button from "./Button";

const Error = () => {
  return (
    <section className="bg-white min-h-screen font-barlow">
      <div className="py-24 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="text-[#B631EE] mb-4 text-6xl md:text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600">
            404
          </h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-black md:text-4xl ">
            Something is missing.
          </p>
          <p className="mb-4 text-lg font-light text-gray-500">
            Sorry, we can not find that page. You will find lots to explore on
            the home page.{" "}
          </p>
          <Link
            href="/"
          >
            <Button type="submit" variant="secondary" size="md">
              Back to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Error;

import LeaseForm from "@/components/leaseForm";

export default async function Home() {
  return (
    <div className="">
      <div className="bg-secondary w-full h-[35vh] md:h-[46vh]">
        <h1 className="font-barlow flex tracking-wide justify-center items-center w-full h-full text-white text-2xl lg:text-5xl md:text-4xl font-bold">
          Lease Calculator
        </h1>
      </div>
      <div className="w-11/12 mx-auto">
        <LeaseForm />
      </div>
    </div>
  );
}

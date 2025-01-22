import React, { useState, FocusEvent } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type DropDownType = {
  label: string;
  header?: string;
  data: { name: "residential" | "commercial" }[];
  onChange: (value: "residential" | "commercial") => void;
  error?: { message?: string };
  required?: boolean;
  register: UseFormRegisterReturn;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
};

const Dropdown = ({
  label,
  header,
  data,
  error,
  required,
  onChange,
  register,
}: DropDownType) => {
  const [showList, setShowList] = useState(false);
  const [selected, setSelected] = useState(label);

  const handleChange = (name: "residential" | "commercial") => {
    setSelected(name);
    onChange(name);
  };

  return (
    <div className="w-full flex flex-col items-start gap-2.5  group ">
      {header ? (
        <div className="text-sm lg:text-base  text-primaryColor-100">
          {header} {required && <span className="text-red-400 text-xl">*</span>}
        </div>
      ) : null}
      <button
        {...register}
        onClick={() => setShowList((prev) => !prev)}
        onBlur={() => setShowList(false)}
        data-dropdown-toggle="dropdown"
        className={`w-full  border-[.5px]  border-primaryColor-400/70 hover:border-primaryColor-400/80 rounded-sm px-4 md:px-5 py-2 focus:outline-none text-sm  text-center flex items-start justify-between relative gap-4 capitalize group ${
          error && "border-red-400/60 border-[.5px] "
        }`}
        type="button"
      >
        <span className=" text-sm md:text-base">{selected}</span>

        <svg
          className="w-4 h-4  "
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
        <div
          id="dropdown"
          className={`z-[5000] bg-white shadow-sm w-full
           absolute top-full left-0 mt-0 rounded  py-3  ${
             showList ? " visible opacity-100" : "invisible opacity-0"
           }`}
        >
          <ul
            className="w-full text-sm text-center  max-h-[21rem] overflow-y-auto"
            aria-labelledby="dropdownDefaultButton"
          >
            {data.map(({ name }, idx) => {
              return (
                <li key={idx} onClick={() => handleChange(name)}>
                  <p className=" capitalize py-2.5 text-sm md:text-sm relative cursor-pointer z-10 transition-all bg-[-100%] duration-300 text-primaryColor-200 hover:text-primary hover:bg-[#f1dff8]/40">
                    {name}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </button>
      {error && (
        <p
          className={`transition-all duration-300  text-[13px] text-red-400/70 ${
            error ? "translate-y-0 " : "-z-10 opacity-0 -translate-y-1/2"
          }`}
        >
          {error.message}
        </p>
      )}
    </div>
  );
};

export default Dropdown;

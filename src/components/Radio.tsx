import React, { ChangeEvent } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
type InputType = {
  type: string;
  value: string;
  register: UseFormRegisterReturn;
  checked?: boolean | undefined;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  required: boolean;
  name: string;
  label: string;
  clicked?: string;
  error?: { message?: string };
};

const Radio = ({
  type,
  value,
  error,
  checked,
  onChange,
  register,
  required,
  name,
  label,
  clicked,
}: InputType) => {
  return (
    <div className="flex items-center">
      <input
        {...register}
        required={required}
        id={name}
        type={type}
        value={value}
        name={name}
        onChange={onChange}
        checked={checked}
        className="w-4 h-4 text-primaryColor-200 accent-secondary  bg-gray-100 border-gray-300 checked:bg-primaryColor-200  focus:ring-0 "
      />
      <label
        htmlFor={name}
        className={`ms-2 text-xs md:text-sm font-medium
    ${clicked !== value ? "text-primaryColor-400" : "text-primaryColor-100"}
      `}
      >
        {label}
      </label>
      <p
        className={`transition-all duration-300  text-[13px] text-red-400/70 ${
          error ? "translate-y-0 " : "-z-10 opacity-0 -translate-y-1/2"
        }`}
      >
        {error?.message}
      </p>
    </div>
  );
};

export default Radio;

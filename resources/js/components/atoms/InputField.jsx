import { useState } from "react";
import EyeIcon from "./icons/EyeIcon";

const InputField = ({
    label,
    type = "text",
    placeholder,
    className = "",
    name,
    value,
    onChange,
    allowToggle = false,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            {label && (
                <label className="text-sm font-semibold text-brand/80">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    type={inputType}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all placeholder:text-gray-400 focus:border-brand/40 focus:bg-white focus:ring-4 focus:ring-brand/10"
                />
                {allowToggle && isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-brand"
                    >
                        <EyeIcon
                            className={`h-5 w-5 ${
                                showPassword ? "text-brand" : ""
                            }`}
                        />
                    </button>
                )}
            </div>
        </div>
    );
};

export default InputField;

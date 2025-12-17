import React from "react";

const Button = ({
    children,
    className = "",
    variant = "primary",
    type = "button",
    ...props
}) => {
    const baseClasses =
        "inline-flex items-center justify-center rounded-full font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary:
            "bg-[#4aa731] text-white hover:bg-[#3d8b28] shadow-md hover:shadow-lg",
        secondary: "bg-brand text-white hover:bg-brand/90 shadow-md",
        ghost: "bg-transparent text-[#4aa731] hover:bg-[#4aa731]/10",
        light: "bg-white text-[#4aa731] hover:bg-gray-50 shadow-md",
        outline:
            "border-2 border-[#4aa731] text-[#4aa731] hover:bg-[#4aa731] hover:text-white",
    };

    const variantClasses = variants[variant] || variants.primary;

    return (
        <button
            type={type}
            className={`${baseClasses} ${variantClasses} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;

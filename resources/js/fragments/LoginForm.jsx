import { useState } from "react";
import { router } from "@inertiajs/react";
import InputField from "../components/atoms/InputField";
import Button from "../components/atoms/Button";
import LogoIcon from "../components/atoms/LogoIcon";

const INITIAL_FORM = {
    email: "",
    password: "",
};

const LoginForm = ({ onLoginSuccess }) => {
    const [formValues, setFormValues] = useState(INITIAL_FORM);
    const [statusMessage, setStatusMessage] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!formValues.email || !formValues.password) {
            setStatusMessage("Email dan password wajib diisi.");
            return;
        }

        if (
            formValues.email === "as22si@mahsiswa.pcr.ac.id" &&
            formValues.password === "acop123"
        ) {
            setStatusMessage("Login Berhasil!");
            router.visit("/");
        } else {
            setStatusMessage("Email atau password salah.");
        }
    };

    return (
        <section className="flex w-full max-w-xl flex-col gap-6 rounded-[24px] bg-white px-8 py-12 shadow-card">
            <div className="flex flex-col items-center text-center">
                <LogoIcon size={72} className="mb-3" />
                <div className="text-[32px] font-semibold">mische</div>
                <p className="text-xs font-semibold tracking-[0.4em] text-brand/60">
                    AESTHETIC CLINIC
                </p>
            </div>

            <div>
                <h1 className="text-3xl font-semibold text-brand">Login</h1>
                <p className="text-brand/70">
                    Masukkan email dan password yang terdaftar
                </p>
            </div>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <InputField
                    label="Email"
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={formValues.email}
                    onChange={handleChange}
                />
                <InputField
                    label="Password"
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={formValues.password}
                    onChange={handleChange}
                    allowToggle
                />

                {statusMessage && (
                    <span className="text-sm text-amber-600">
                        {statusMessage}
                    </span>
                )}

                <Button type="submit" className="w-full">
                    Login
                </Button>
            </form>
        </section>
    );
};

export default LoginForm;

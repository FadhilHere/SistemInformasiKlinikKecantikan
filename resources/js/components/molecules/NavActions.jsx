import { Link, usePage } from "@inertiajs/react";
import Button from "../atoms/Button";
import CartIcon from "../atoms/icons/CartIcon";

const NavActions = () => {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <div className="flex items-center gap-3">
            <Link
                href="/cart"
                className="rounded-full border border-brand/20 p-2 transition hover:border-primary hover:text-primary"
                aria-label="Keranjang"
            >
                <CartIcon />
            </Link>

            {user ? (
                <Link href="/profile">
                    <Button
                        variant="primary"
                        className="flex items-center gap-2 px-6!"
                    >
                        <svg
                            className="h-5 w-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Profil
                    </Button>
                </Link>
            ) : (
                <>
                    <Link href="/login">
                        <Button variant="ghost">Login</Button>
                    </Link>
                    <Link href="/register">
                        <Button variant="primary">Registrasi</Button>
                    </Link>
                </>
            )}
        </div>
    );
};

export default NavActions;

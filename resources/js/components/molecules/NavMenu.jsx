import { Link, usePage } from "@inertiajs/react";

const NAV_ITEMS = [
    { label: "Beranda", route: "/" },
    { label: "Produk", route: "/products" },
    { label: "Promo", route: "/promos" },
    { label: "Event", route: "/events" },
    { label: "Reservasi", route: "/reservation" },
    { label: "Tentang Kami", route: "/about", hasDropdown: true },
];

const NavMenu = () => {
    const { url } = usePage(); // Get current URL automatically

    return (
        <nav className="flex flex-wrap items-center justify-center gap-6 text-base font-medium text-brand">
            {NAV_ITEMS.map((item) => {
                // Simple active check: if URL starts with the route (handling root / correctly)
                const isActive =
                    item.route === "/"
                        ? url === "/"
                        : url.startsWith(item.route);

                const baseClasses =
                    "inline-flex items-center gap-1 transition-colors duration-150";
                const activeClasses = isActive
                    ? "text-primary-dark border-b-2 border-primary pb-1"
                    : "text-brand hover:text-primary-dark";

                return (
                    <Link
                        key={item.label}
                        href={item.route}
                        className={`${baseClasses} ${activeClasses}`}
                    >
                        {item.label}
                        {item.hasDropdown && (
                            <span className="inline-block h-0 w-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-primary" />
                        )}
                    </Link>
                );
            })}
        </nav>
    );
};

export default NavMenu;

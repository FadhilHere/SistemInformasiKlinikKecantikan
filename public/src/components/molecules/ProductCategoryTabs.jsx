const CATEGORIES = ['Semua Produk', 'Acne', 'Whitening', 'Anti-Aging']

const ProductCategoryTabs = ({ activeCategory, onSelect }) => {
    return (
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-semibold uppercase tracking-widest text-brand/60">
            {CATEGORIES.map((category) => {
                const isActive =
                    activeCategory?.toLowerCase() === category.toLowerCase()
                return (
                    <button
                        key={category}
                        type="button"
                        onClick={() => onSelect?.(category)}
                        className="flex flex-col items-center gap-2 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary/60"
                    >
                        <span
                            className={`h-1.5 w-16 rounded-full ${isActive ? 'bg-primary' : 'bg-brand/20'
                                }`}
                        />
                        <span className={isActive ? 'text-primary' : ''}>{category}</span>
                    </button>
                )
            })}
        </div>
    )
}

export default ProductCategoryTabs

const ProductCategoryTabs = ({ activeCategory, onSelect, categories = [] }) => {
    const tabs = [
        { id: 'all', name: 'Semua Produk' },
        ...categories.map((category) => ({
            id: category.id,
            name: category.name
        }))
    ]

    return (
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-semibold uppercase tracking-widest text-brand/60">
            {tabs.map((category) => {
                const isActive = String(activeCategory) === String(category.id)
                return (
                    <button
                        key={category.id}
                        type="button"
                        onClick={() => onSelect?.(category.id)}
                        className="flex flex-col items-center gap-2 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary/60"
                    >
                        <span
                            className={`h-1.5 w-16 rounded-full ${isActive ? 'bg-primary' : 'bg-brand/20'
                                }`}
                        />
                        <span className={isActive ? 'text-primary' : ''}>{category.name}</span>
                    </button>
                )
            })}
        </div>
    )
}

export default ProductCategoryTabs

"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import ProductCard from "../components/ProductCard"

const CATEGORIES = [
  { id: "soap", label: "Soaps" },
  { id: "toothpaste", label: "Toothpaste" },
  { id: "shampoo", label: "Shampoo" },
  { id: "detergent", label: "Detergent" },
  { id: "cleaner", label: "Cleaners" },
  { id: "baby-care", label: "Baby Care" },
  { id: "cosmetics", label: "Cosmetics" },
]

export default function MarketplacePage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [sortBy, setSortBy] = useState("new")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, sortBy, page, searchTerm])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page,
        limit: 20,
        sortBy,
        ...(selectedCategory && { category: selectedCategory }),
      })

      const response = await fetch(`http://localhost:5000/api/products?${params}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products)
        setTotal(data.pagination.total)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="py-8">
      <div className="max-w-container px-2">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-6">Browse Our Deals</h1>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 text-neutral-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-200">
              <label className="block text-sm font-bold mb-2">Category</label>
              <select
                className="w-full"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value)
                  setPage(1)
                }}
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-200">
              <label className="block text-sm font-bold mb-2">Sort By</label>
              <select
                className="w-full"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value)
                  setPage(1)
                }}
              >
                <option value="new">Newest</option>
                <option value="discount">Highest Discount</option>
                <option value="expiry">Expiring Soon</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-600 text-lg">No products found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-4 mb-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2">
              <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="btn btn-outline btn-small">
                Previous
              </button>
              <span className="py-2 px-4 text-neutral-600">Page {page}</span>
              <button
                disabled={page * 20 >= total}
                onClick={() => setPage((p) => p + 1)}
                className="btn btn-outline btn-small"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Tag,
  DollarSign,
  Filter,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Flame,
  Zap,
} from 'lucide-react';
import { Product, AdminNavPage } from '../../types';
import { formatBDT } from '../../utils/currency';

interface ProductManagementViewProps {
  products: Product[];
  onNavigate: (page: AdminNavPage) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onOpenQuickPrice: (product: Product) => void;
}

export const ProductManagementView: React.FC<ProductManagementViewProps> = ({
  products,
  onNavigate,
  onEditProduct,
  onDeleteProduct,
  onOpenQuickPrice,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState<'all' | 'inStock' | 'outOfStock'>('all');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.category));
    return ['All', ...Array.from(set)];
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;

      const matchesStock =
        stockFilter === 'all' ||
        (stockFilter === 'inStock' && product.inStock) ||
        (stockFilter === 'outOfStock' && !product.inStock);

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchQuery, selectedCategory, stockFilter]);

  const confirmDelete = () => {
    if (productToDelete) {
      onDeleteProduct(productToDelete.id);
      setProductToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action & Filter Bar */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products by title, category, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick CTA buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('add-product')}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shadow-orange-600/20 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>

            <button
              onClick={() => onNavigate('delete-product')}
              className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-700 border border-stone-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              title="Open Delete Management Console"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Delete Manager</span>
            </button>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <span className="text-xs font-bold text-stone-500 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-orange-600 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Stock state filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-stone-500">Stock:</span>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
              className="bg-stone-100 border border-stone-200 rounded-lg px-2.5 py-1 text-xs font-medium text-stone-700 focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
            >
              <option value="all">All ({products.length})</option>
              <option value="inStock">In Stock ({products.filter((p) => p.inStock).length})</option>
              <option value="outOfStock">Out of Stock ({products.filter((p) => !p.inStock).length})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <p className="text-xs font-bold text-stone-700">
            Showing <span className="text-orange-600">{filteredProducts.length}</span> of {products.length} Products
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-stone-500">
            <p className="text-sm font-bold text-stone-700">No products match your criteria</p>
            <p className="text-xs text-stone-400 mt-1">Try resetting filters or search query.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setStockFilter('all');
              }}
              className="mt-3 text-xs font-bold text-orange-600 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-stone-50/80 border-b border-stone-200/80 text-stone-500 uppercase tracking-wider text-[11px] font-bold">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Price</th>
                  <th className="py-3 px-3">Discount</th>
                  <th className="py-3 px-3">Stock Status</th>
                  <th className="py-3 px-3">Badges</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-stone-50/70 transition-colors">
                    {/* Image & Title */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-xl border border-stone-200 bg-stone-100 flex-shrink-0"
                        />
                        <div className="max-w-xs">
                          <p className="font-bold text-stone-900 line-clamp-1">{product.name}</p>
                          <p className="text-[10px] text-stone-500 font-mono">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-medium text-[11px]">
                        {product.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-3">
                      <div>
                        <span className="font-extrabold text-stone-900 text-sm">
                          {formatBDT(product.price)}
                        </span>
                        {product.oldPrice && (
                          <span className="block text-[10px] text-stone-400 line-through">
                            {formatBDT(product.oldPrice)}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Discount */}
                    <td className="py-3 px-3">
                      {product.discountPercent > 0 ? (
                        <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-700 font-extrabold text-[11px]">
                          -{product.discountPercent}%
                        </span>
                      ) : (
                        <span className="text-stone-400 text-[11px]">None</span>
                      )}
                    </td>

                    {/* Stock Status */}
                    <td className="py-3 px-3">
                      {product.inStock ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          In Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-600 font-bold text-[11px]">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Out of Stock
                        </span>
                      )}
                    </td>

                    {/* Badges */}
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {product.isFlashDeal && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold">
                            <Zap className="w-2.5 h-2.5 fill-amber-500" />
                            Flash
                          </span>
                        )}
                        {product.isTrending && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-orange-50 border border-orange-200 text-orange-700 text-[10px] font-bold">
                            <Flame className="w-2.5 h-2.5 fill-orange-500" />
                            Trend
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Quick Price change */}
                        <button
                          onClick={() => onOpenQuickPrice(product)}
                          className="p-1.5 text-stone-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                          title="Quick Price & Discount Editor"
                        >
                          <DollarSign className="w-4 h-4" />
                        </button>

                        {/* Edit Product */}
                        <button
                          onClick={() => onEditProduct(product)}
                          className="p-1.5 text-stone-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Product Details"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Delete Product */}
                        <button
                          onClick={() => setProductToDelete(product)}
                          className="p-1.5 text-stone-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-stone-900">Delete Product?</h3>
              <p className="text-xs text-stone-500 mt-1">
                Are you sure you want to remove <span className="font-bold text-stone-800">&ldquo;{productToDelete.name}&rdquo;</span> from your catalog?
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-xs cursor-pointer"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

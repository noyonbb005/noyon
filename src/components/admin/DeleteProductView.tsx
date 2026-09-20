import React, { useState, useMemo } from 'react';
import {
  Trash2,
  AlertTriangle,
  CheckSquare,
  Square,
  Search,
  ArrowLeft,
  RefreshCw,
  Package,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Product, AdminNavPage } from '../../types';
import { formatBDT } from '../../utils/currency';

interface DeleteProductViewProps {
  products: Product[];
  onDeleteProduct: (productId: string) => void;
  onBatchDeleteProducts: (productIds: string[]) => void;
  onResetToDefaults: () => void;
  onNavigate: (page: AdminNavPage) => void;
}

export const DeleteProductView: React.FC<DeleteProductViewProps> = ({
  products,
  onDeleteProduct,
  onBatchDeleteProducts,
  onResetToDefaults,
  onNavigate,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOutOnly, setFilterOutOnly] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Product | null>(null);
  const [isConfirmingBatch, setIsConfirmingBatch] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStock = filterOutOnly ? !p.inStock : true;
      return matchesSearch && matchesStock;
    });
  }, [products, searchQuery, filterOutOnly]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map((p) => p.id));
    }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSingleDelete = () => {
    if (itemToDelete) {
      onDeleteProduct(itemToDelete.id);
      setSelectedIds((prev) => prev.filter((id) => id !== itemToDelete.id));
      setNotice(`Removed "${itemToDelete.name}" from catalog.`);
      setItemToDelete(null);
      setTimeout(() => setNotice(null), 3000);
    }
  };

  const handleBatchDelete = () => {
    if (selectedIds.length > 0) {
      onBatchDeleteProducts(selectedIds);
      setNotice(`Successfully deleted ${selectedIds.length} selected items.`);
      setSelectedIds([]);
      setIsConfirmingBatch(false);
      setTimeout(() => setNotice(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Info */}
      <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-rose-900">
              Catalog Clean-up & Product Deletion Console
            </h3>
            <p className="text-xs text-rose-700/90 mt-0.5">
              Permanently remove discontinued products, manage bulk inventory purges, or clean out of stock items.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('products')}
            className="px-3.5 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer"
          >
            Cancel / Back
          </button>
          <button
            onClick={onResetToDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            title="Reset catalog back to initial demo items"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Catalog</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Action and Search Controls */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Find items to remove..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer bg-stone-50 border border-stone-200 px-3 py-2 rounded-xl">
              <input
                type="checkbox"
                checked={filterOutOnly}
                onChange={(e) => setFilterOutOnly(e.target.checked)}
                className="rounded text-rose-600 focus:ring-rose-500"
              />
              <span>Out of Stock Only ({products.filter((p) => !p.inStock).length})</span>
            </label>

            {selectedIds.length > 0 && (
              <button
                onClick={() => setIsConfirmingBatch(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer animate-in fade-in"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Selected ({selectedIds.length})</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100">
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-1.5 font-bold text-stone-700 hover:text-stone-900 cursor-pointer"
          >
            {selectedIds.length > 0 && selectedIds.length === filteredProducts.length ? (
              <CheckSquare className="w-4 h-4 text-rose-600" />
            ) : (
              <Square className="w-4 h-4 text-stone-400" />
            )}
            <span>Select All Visible ({filteredProducts.length})</span>
          </button>

          <span className="text-stone-500">
            {selectedIds.length} of {filteredProducts.length} items marked for deletion
          </span>
        </div>
      </div>

      {/* Deletion Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-stone-500">
            <Package className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-stone-700">No products found matching filters</p>
            <p className="text-xs text-stone-400 mt-1">Change your search query or reset filter settings.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-stone-50/80 border-b border-stone-200/80 text-stone-500 uppercase tracking-wider text-[11px] font-bold">
                  <th className="py-3 px-4 w-10">Select</th>
                  <th className="py-3 px-3">Product</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Current Price</th>
                  <th className="py-3 px-3">Stock</th>
                  <th className="py-3 px-4 text-right">Direct Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredProducts.map((product) => {
                  const isSelected = selectedIds.includes(product.id);
                  return (
                    <tr
                      key={product.id}
                      className={`hover:bg-rose-50/40 transition-colors ${
                        isSelected ? 'bg-rose-50/60' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => toggleSelectItem(product.id)}
                          className="cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-rose-600" />
                          ) : (
                            <Square className="w-4 h-4 text-stone-300 hover:text-stone-500" />
                          )}
                        </button>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded-xl border border-stone-200 bg-stone-100 flex-shrink-0"
                          />
                          <div>
                            <p className="font-bold text-stone-900 line-clamp-1">{product.name}</p>
                            <p className="text-[10px] text-stone-400 font-mono">ID: {product.id}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 font-medium text-stone-600">
                        {product.category}
                      </td>

                      <td className="py-3 px-3 font-bold text-stone-900">
                        {formatBDT(product.price)}
                      </td>

                      <td className="py-3 px-3">
                        {product.inStock ? (
                          <span className="text-emerald-700 font-bold text-[11px]">In Stock</span>
                        ) : (
                          <span className="text-rose-600 font-bold text-[11px]">Out of Stock</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setItemToDelete(product)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white rounded-lg text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Single Item Delete Confirmation */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-stone-900">Permanently Delete Item?</h3>
              <p className="text-xs text-stone-500 mt-1">
                You are about to remove <span className="font-bold text-stone-800">&ldquo;{itemToDelete.name}&rdquo;</span>. This item will no longer appear on storefront or search.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSingleDelete}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Batch Deletion Confirmation Modal */}
      {isConfirmingBatch && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-stone-900">
                Confirm Batch Delete ({selectedIds.length} Products)
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Are you sure you want to permanently delete all {selectedIds.length} selected items? This bulk operation cannot be undone unless you reset to demo catalog.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setIsConfirmingBatch(false)}
                className="flex-1 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleBatchDelete}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white cursor-pointer"
              >
                Confirm Bulk Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import type { Product } from '../types';

interface Props {
  product: Product;
  onAdd: (p: Product) => void;
}

export default function ProductCard({ product, onAdd }: Props) {
  const disabled = product.stock <= 0;
  return (
    <div
      className={`bg-flamita-card p-4 rounded-lg border transition-all ${
        disabled
          ? 'border-gray-800 opacity-50'
          : 'border-flamita-border hover:border-flamita-red cursor-pointer'
      }`}
      onClick={() => !disabled && onAdd(product)}
    >
      <div className="flex justify-between items-start gap-2">
        <h3 className="font-titles font-bold text-flamita-red text-sm leading-tight">
          {product.name}
        </h3>
        <span
          className={`text-xs px-2 py-0.5 rounded whitespace-nowrap ${
            product.stock > 10
              ? 'bg-green-900 text-green-300'
              : product.stock > 0
              ? 'bg-yellow-900 text-yellow-300'
              : 'bg-red-900 text-red-300'
          }`}
        >
          {product.stock}
        </span>
      </div>
      <p className="text-xs text-gray-400 mt-1 line-clamp-2 min-h-[32px]">
        {product.description}
      </p>
      <div className="flex justify-between items-center mt-3">
        <span className="text-xl font-bold text-white">${product.price}</span>
        <button
          disabled={disabled}
          className="bg-flamita-dark-red hover:bg-flamita-red disabled:bg-gray-700 px-3 py-1 rounded text-white text-sm font-bold"
        >
          + Agregar
        </button>
      </div>
    </div>
  );
}
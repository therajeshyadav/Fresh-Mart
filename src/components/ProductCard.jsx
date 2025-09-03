import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const stock = Number(product?.stock ?? 0);
  const price = Number(product?.price ?? 0);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (stock === 0) {
      toast.error('Product is out of stock');
      return;
    }

    try {
      setIsAdding(true);
      await addToCart(product?._id, quantity);
      toast.success(`${product?.name ?? 'Item'} added to cart!`);
      setQuantity(1);
    } catch (error) {
      toast.error(error?.message || 'Failed to add to cart');
    } finally {
      setIsAdding(false);
    }
  };

  const incrementQuantity = () => {
    if (quantity < stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={product?.image || '/placeholder.png'}
          alt={product?.name || 'Product'}
          className="w-full h-48 object-cover"
        />
        {stock === 0 && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">Out of Stock</span>
          </div>
        )}
        {product?.category && (
          <div className="absolute top-2 right-2">
            <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full shadow">
              {product.category}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{product?.name || 'Unnamed Product'}</h3>
        {product?.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        )}
        
        {/* Rating */}
        {product?.ratings?.count > 0 && (
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product?.ratings?.average ?? 0)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-2">
              ({product?.ratings?.count})
            </span>
          </div>
        )}
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-2xl font-bold text-emerald-600">
            ${price.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500">
            Stock: {stock}
          </span>
        </div>
        
        {/* Nutrition Info */}
        {product?.nutritionInfo?.calories > 0 && (
          <div className="text-xs text-gray-500 mb-3">
            {product?.nutritionInfo?.calories} cal | {product?.nutritionInfo?.protein} protein
          </div>
        )}
        
        {stock > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              
              <span className="font-semibold text-lg min-w-[2rem] text-center">
                {quantity}
              </span>
              
              <button
                onClick={incrementQuantity}
                disabled={quantity >= stock}
                className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isAdding ? (
                <span>Adding...</span>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Search, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const UserNavbar = ({ onLogout, searchTerm, setSearchTerm, handleSearch }) => {
  const { user } = useAuth();
  const { getCartItemCount } = useCart();
  const cartItemCount = getCartItemCount();

  return (
    <div className="flex items-center space-x-4">
      <Link to="/products" className="text-gray-700 hover:text-emerald-600 transition-colors">
        Products
      </Link>

      {/* Cart */}
      <Link to="/cart" className="relative p-2 text-gray-700 hover:text-emerald-600 transition-colors">
        <ShoppingCart className="w-6 h-6" />
        {cartItemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {cartItemCount}
          </span>
        )}
      </Link>

      {/* Profile dropdown */}
      <div className="relative group">
        <button className="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 transition-colors">
          <User className="w-5 h-5" />
          <span>{user?.name}</span>
        </button>
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
          <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
          <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Orders</Link>
          <button
            onClick={onLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="w-4 h-4 inline mr-2" /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserNavbar;

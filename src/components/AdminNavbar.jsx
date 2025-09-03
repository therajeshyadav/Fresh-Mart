import { Link } from 'react-router-dom';
import { LogOut, LayoutDashboard, Package, ClipboardList } from 'lucide-react';

const AdminNavbar = ({ onLogout }) => {
  return (
    <div className="flex items-center space-x-6">
      <Link to="/admin" className="flex items-center space-x-1 text-gray-700 hover:text-emerald-600">
        <LayoutDashboard className="w-5 h-5" />
        <span>Dashboard</span>
      </Link>

      <Link to="/admin/products" className="flex items-center space-x-1 text-gray-700 hover:text-emerald-600">
        <Package className="w-5 h-5" />
        <span>Products</span>
      </Link>

      <Link to="/admin/orders" className="flex items-center space-x-1 text-gray-700 hover:text-emerald-600">
        <ClipboardList className="w-5 h-5" />
        <span>Orders</span>
      </Link>

      <button onClick={onLogout} className="flex items-center space-x-1 text-gray-700 hover:text-emerald-600">
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default AdminNavbar;

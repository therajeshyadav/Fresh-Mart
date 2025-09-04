import axios from "axios";

// ======================== AXIOS CLIENT ======================== //

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically from localStorage //
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ======================== AUTH ======================== //

export const AuthApi = {
  login: async (email, password) => {
    const { data } = await client.post("/auth/login", { email, password });
    return data; // <- important
  },
  register: async (name, email, password, role = "customer") => {
    const { data } = await client.post("/auth/register", {
      name,
      email,
      password,
      role,
    });
    return data; // <- important
  },
  profile: async () => {
    const { data } = await client.get("/auth/profile");
    return data; // <- important
  },
  updateProfile: async (body) => {
    const { data } = await client.put("/auth/profile", body);
    return data; // <- important
  },
};

// ======================== PRODUCTS ======================== //
export const ProductsApi = {
  list: async (params) => {
    const { data } = await client.get("/products", { params });
    // Handle both { products: [...] } and [...] response shapes
    return Array.isArray(data?.products)
      ? data.products
      : Array.isArray(data)
      ? data
      : [];
  },
  get: async (id) => {
    const { data } = await client.get(`/products/${id}`);
    return data;
  },
  create: async (body) => {
    const { data } = await client.post("/products", body);
    return data;
  },
  update: async (id, body) => {
    const { data } = await client.put(`/products/${id}`, body);
    return data;
  },
  remove: async (id) => {
    const { data } = await client.delete(`/products/${id}`);
    return data;
  },
};

// ======================== CART ======================== //
export const CartApi = {
  get: async () => {
    const { data } = await client.get("/cart");
    return data;
  },
  add: async (productId, quantity = 1) => {
    const { data } = await client.post("/cart", { productId, quantity });
    return data;
  },
  update: async (productId, quantity) => {
    const { data } = await client.put(`/cart/${productId}`, { quantity });
    return data;
  },
  remove: async (productId) => {
    const { data } = await client.delete(`/cart/${productId}`);
    return data;
  },
  clear: async () => {
    const { data } = await client.delete("/cart/clear");
    return data;
  },
};

// ======================== ORDERS ======================== //
export const OrdersApi = {
  // Fetch orders for the logged-in user
  list: async () => {
    const { data } = await client.get("/orders/my-orders");
    return data;
  },

  // Fetch single order
  get: async (id) => {
    const { data } = await client.get(`/orders/${id}`);
    return data;
  },

  // Create new order
  create: async (body) => {
    const { data } = await client.post("/orders", body);
    return data;
  },

  // Update order status (admin use usually)
  updateStatus: async (id, status) => {
    const { data } = await client.put(`/orders/${id}/status`, { status });
    return data;
  },
};

// ======================== Admin ======================== //
export const AdminApi = {
  stats: async () => {
    const { data } = await client.get("/admin/stats");
    return {
      totalUsers: data?.totalUsers ?? 0,
      totalProducts: data?.totalProducts ?? 0,
      totalOrders: data?.totalOrders ?? 0,
      totalRevenue: data?.totalRevenue ?? 0,
    };
  },

  list: async () => {
    const { data } = await client.get("/orders");
    // if API sends { orders: [...] }
    return Array.isArray(data) ? data : data.orders || [];
  },
  userlist: async () => {
    const { data } = await client.get("/users");
    // Handle both { users: [...] } and plain [...]
    return Array.isArray(data?.users) ? data.users : data;
  },

  toggleStatus: async (id, currentStatus) => {
    const { data } = await client.put(`/users/${id}/status`, {
      isActive: !currentStatus,
    });
    return data;
  },
};

// ======================== EXPORT ======================== //
export default {
  AuthApi,
  ProductsApi,
  CartApi,
  OrdersApi,
};

// routes/admin.js
import express from "express";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

const router = express.Router();

// GET /api/admin/stats
router.get("/stats", async (req, res) => {
  try {
    // Total Users
    const totalUsers = await User.countDocuments();

    // Total Products
    const totalProducts = await Product.countDocuments();

    // Total Orders
    const totalOrders = await Order.countDocuments();

    // GMV (Gross Merchandise Value) - sum of all order totalPrice
    const gmvData = await Order.aggregate([
      { $group: { _id: null, gmv: { $sum: "$totalPrice" } } }
    ]);
    const gmv = gmvData.length > 0 ? gmvData[0].gmv : 0;

    // Net Revenue (only delivered + paid orders)
    const revenueData = await Order.aggregate([
      { $match: { isPaid: true, status: "delivered" } },
      { $group: { _id: null, revenue: { $sum: "$totalPrice" } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].revenue : 0;

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      gmv,         // total order value (like Amazon GMV)
      totalRevenue,   // recognized revenue (like Amazon reports to investors)
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ message: "Server error while fetching stats" });
  }
});

export default router;

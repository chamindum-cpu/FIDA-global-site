import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getDbConnection();
    
    // Fetch counts for the dashboard
    const blogCount = await pool.request().query("SELECT COUNT(*) as count FROM blogs");
    const projectCount = await pool.request().query("SELECT COUNT(*) as count FROM projects");
    const expertiseCount = await pool.request().query("SELECT COUNT(*) as count FROM expertise");
    const userCount = await pool.request().query("SELECT COUNT(*) as count FROM users");

    // Fetch recent activity (latest blogs)
    const recentBlogs = await pool.request().query("SELECT TOP 5 title, created_at, status FROM blogs ORDER BY created_at DESC");

    return NextResponse.json({
      stats: {
        blogs: blogCount.recordset[0].count,
        projects: projectCount.recordset[0].count,
        expertise: expertiseCount.recordset[0].count,
        users: userCount.recordset[0].count,
      },
      recentBlogs: recentBlogs.recordset
    });
  } catch (error: any) {
    console.error("Dashboard Stats Error:", error);
    return NextResponse.json({ message: "Failed to fetch stats" }, { status: 500 });
  }
}

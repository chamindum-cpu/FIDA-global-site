import { NextResponse } from "next/server";
import { getDbConnection } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getDbConnection();
    const result = await pool.request().query("SELECT id, name FROM categories ORDER BY name ASC");
    return NextResponse.json(result.recordset);
  } catch (error: any) {
    console.error("Fetch Categories Error:", error);
    return NextResponse.json({ message: "Failed to fetch categories" }, { status: 500 });
  }
}

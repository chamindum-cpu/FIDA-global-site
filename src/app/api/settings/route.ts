import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getDbConnection();
    const result = await pool.request().execute("sp_GetAllSiteSettings");
    
    const settings: { [key: string]: string } = {};
    result.recordset.forEach(row => {
      settings[row.setting_key] = row.setting_value;
    });
    
    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to fetch settings", error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { key, value } = data;
    const pool = await getDbConnection();

    await pool.request()
      .input('key', sql.NVarChar(100), key)
      .input('value', sql.NVarChar(sql.MAX), value)
      .execute("sp_UpdateSiteSetting");

    return NextResponse.json({ message: "Setting updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to update setting", error: error.message }, { status: 500 });
  }
}

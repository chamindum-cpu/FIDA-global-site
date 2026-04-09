import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getDbConnection();
    const result = await pool.request().query("SELECT setting_key, setting_value FROM site_settings");
    
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
      .query("UPDATE site_settings SET setting_value = @value, updated_at = GETDATE() WHERE setting_key = @key");

    return NextResponse.json({ message: "Setting updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to update setting", error: error.message }, { status: 500 });
  }
}

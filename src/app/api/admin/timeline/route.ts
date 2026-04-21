import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getDbConnection();
    const result = await pool.request().execute('sp_GetAllTimelineAdmin');
    return NextResponse.json({ success: true, data: result.recordset });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { year, text, orderIndex, isActive } = await req.json();

    if (!year || !text) {
      return NextResponse.json({ success: false, message: "Year and Text are required" }, { status: 400 });
    }

    const pool = await getDbConnection();
    await pool.request()
      .input("Year", sql.NVarChar(50), year)
      .input("Text", sql.NVarChar(sql.MAX), text)
      .input("OrderIndex", sql.Int, orderIndex || 0)
      .input("IsActive", sql.Bit, isActive ?? 1)
      .execute('sp_CreateTimeline');

    return NextResponse.json({ success: true, message: "Timeline entry added successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, year, text, orderIndex, isActive } = await req.json();

    if (!id || !year || !text) {
      return NextResponse.json({ success: false, message: "ID, Year, and Text are required" }, { status: 400 });
    }

    const pool = await getDbConnection();
    await pool.request()
      .input("TimelineId", sql.Int, id)
      .input("Year", sql.NVarChar(50), year)
      .input("Text", sql.NVarChar(sql.MAX), text)
      .input("OrderIndex", sql.Int, orderIndex || 0)
      .input("IsActive", sql.Bit, isActive ?? 1)
      .execute('sp_UpdateTimeline');

    return NextResponse.json({ success: true, message: "Timeline entry updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
       return NextResponse.json({ success: false, message: "Missing ID" }, { status: 400 });
    }

    const pool = await getDbConnection();
    await pool.request()
      .input('TimelineId', sql.Int, id)
      .execute('sp_DeleteTimeline');

    return NextResponse.json({ success: true, message: "Timeline entry deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

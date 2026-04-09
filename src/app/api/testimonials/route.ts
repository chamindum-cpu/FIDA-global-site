import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getDbConnection();
    const result = await pool.request().execute('sp_GetTestimonials');
    return NextResponse.json(result.recordset);
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to fetch testimonials", error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { id, clientName, clientPosition, clientCompany, content, imageUrl, rating, status } = data;
    const pool = await getDbConnection();

    await pool.request()
      .input('id', sql.Int, id || null)
      .input('client_name', sql.NVarChar(255), clientName)
      .input('client_position', sql.NVarChar(255), clientPosition)
      .input('client_company', sql.NVarChar(255), clientCompany)
      .input('content', sql.NVarChar(sql.MAX), content)
      .input('image_url', sql.NVarChar(sql.MAX), imageUrl)
      .input('rating', sql.Int, rating || 5)
      .input('status', sql.NVarChar(50), status || 'Active')
      .execute('sp_UpsertTestimonial');

    return NextResponse.json({ message: "Testimonial saved successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to save testimonial", error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const pool = await getDbConnection();
    await pool.request()
      .input('id', sql.Int, id)
      .query(`UPDATE testimonials SET status = 'Deleted' WHERE id = @id`); // Soft delete

    return NextResponse.json({ message: "Testimonial deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to delete testimonial", error: error.message }, { status: 500 });
  }
}

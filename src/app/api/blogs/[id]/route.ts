import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    console.log(`GET Blog Request: ID=${id}`);
    const pool = await getDbConnection();
    
    const result = await pool.request()
      .input('BlogId', sql.Int, parseInt(id))
      .execute('sp_GetBlogById');

    console.log(`GET Blog Result: ${result.recordset.length} rows found`);

    if (result.recordset.length > 0) {
      const b = result.recordset[0];
      // Map to consistent frontend fields
      const blog = {
        ...b,
        imageUrl: b.image_url,
        date: b.created_at,
        cat: b.category_name,
        author: b.author_name
      };
      return NextResponse.json(blog);
    } else {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }
  } catch (error: any) {
    console.error("Fetch Blog Single FULL Error:", error);
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await request.json();
    console.log(`PUT Blog Request: ID=${id}`, data);
    const { categoryId, title, excerpt, content, imageUrl, status } = data;

    const pool = await getDbConnection();
    
    // Call the provided update stored procedure
    const result = await pool.request()
      .input('BlogId', sql.Int, parseInt(id))
      .input('CategoryId', sql.Int, categoryId ? parseInt(categoryId) : null)
      .input('Title', sql.NVarChar(255), title || null)
      .input('Excerpt', sql.NVarChar(500), excerpt || null)
      .input('Content', sql.NVarChar(sql.MAX), content || null)
      .input('ImageUrl', sql.NVarChar(sql.MAX), imageUrl || null)
      .input('Status', sql.NVarChar(20), status || null)
      .execute('sp_UpdateBlogPost');

    console.log("PUT Blog Update Successful");

    return NextResponse.json({ 
      message: "Blog updated successfully", 
      blog: result.recordset[0] 
    });
  } catch (error: any) {
    console.error("Update Blog FULL Error:", error);
    return NextResponse.json({ message: "Failed to update blog", error: error.message }, { status: 500 });
  }
}

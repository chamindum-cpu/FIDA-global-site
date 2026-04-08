import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getDbConnection();
    const result = await pool.request().execute('sp_GetAllProjects');
    return NextResponse.json(result.recordset);
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to fetch projects", error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { title, clientName, categoryId, description, imageUrl, status } = data;
    const pool = await getDbConnection();
    
    const result = await pool.request()
      .input('Title', sql.NVarChar(255), title)
      .input('ClientName', sql.NVarChar(100), clientName)
      .input('CategoryId', sql.Int, categoryId)
      .input('Description', sql.NVarChar(sql.MAX), description)
      .input('ImageUrl', sql.NVarChar(sql.MAX), imageUrl)
      .input('Status', sql.NVarChar(20), status || 'Published')
      .execute('sp_CreateProject');

    return NextResponse.json({ message: "Project created", projectId: result.recordset[0].ProjectId });
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to create project", error: error.message }, { status: 500 });
  }
}

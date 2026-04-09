import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getDbConnection();
    const result = await pool.request().execute('sp_GetTeamMembers');
    return NextResponse.json(result.recordset);
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to fetch team members", error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { id, name, position, bio, imageUrl, linkedinUrl, twitterUrl, accent, orderIndex, status } = data;
    const pool = await getDbConnection();

    await pool.request()
      .input('id', sql.Int, id || null)
      .input('name', sql.NVarChar(255), name)
      .input('position', sql.NVarChar(255), position)
      .input('bio', sql.NVarChar(sql.MAX), bio)
      .input('image_url', sql.NVarChar(sql.MAX), imageUrl)
      .input('linkedin_url', sql.NVarChar(sql.MAX), linkedinUrl)
      .input('twitter_url', sql.NVarChar(sql.MAX), twitterUrl)
      .input('accent', sql.NVarChar(50), accent || "#38a3f5")
      .input('order_index', sql.Int, orderIndex || 0)
      .input('status', sql.NVarChar(50), status || 'Active')
      .execute('sp_UpsertTeamMember');

    return NextResponse.json({ message: "Team member saved successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to save team member", error: error.message }, { status: 500 });
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
      .query(`UPDATE team_members SET status = 'Deleted' WHERE id = @id`);

    return NextResponse.json({ message: "Team member deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to delete team member", error: error.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getDbConnection();
    const result = await pool.request().execute('sp_GetAllJobApplications');
    return NextResponse.json(result.recordset);
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to fetch job applications", error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { FullName, Email, Phone, Position, ResumeUrl, Message } = data;

    if (!FullName || !Email || !Position) {
       return NextResponse.json({ message: "Full Name, Email, and Position are required" }, { status: 400 });
    }

    const pool = await getDbConnection();

    const result = await pool.request()
      .input('FullName', sql.NVarChar(255), FullName)
      .input('Email', sql.NVarChar(255), Email)
      .input('Phone', sql.NVarChar(50), Phone || null)
      .input('Position', sql.NVarChar(255), Position)
      .input('ResumeUrl', sql.NVarChar(sql.MAX), ResumeUrl || null)
      .input('Message', sql.NVarChar(sql.MAX), Message || null)
      .execute('sp_CreateJobApplication');

    return NextResponse.json({ message: "Application submitted successfully", applicationId: result.recordset[0].ApplicationId });
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to submit application", error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, status } = data;
    
    if (!id || !status) {
      return NextResponse.json({ message: "ID and Status are required" }, { status: 400 });
    }

    const pool = await getDbConnection();
    await pool.request()
      .input('ApplicationId', sql.Int, id)
      .input('Status', sql.NVarChar(50), status)
      .execute('sp_UpdateJobApplicationStatus');

    return NextResponse.json({ message: "Status updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to update status", error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ message: "Application ID is required" }, { status: 400 });
    }

    const pool = await getDbConnection();
    await pool.request()
      .input('ApplicationId', sql.Int, id)
      .execute('sp_DeleteJobApplication');

    return NextResponse.json({ message: "Application deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to delete application", error: error.message }, { status: 500 });
  }
}

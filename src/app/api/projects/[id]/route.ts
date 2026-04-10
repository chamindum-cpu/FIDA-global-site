import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const pool = await getDbConnection();
    
    // Use the existing SP and filter in JS to be safe
    const result = await pool.request().execute('sp_GetAllProjects');
    const projects = result.recordset;
    
    // Find the project by ID. We check both 'ProjectId' and 'id' just in case.
    const project = projects.find((p: any) => 
      String(p.ProjectId) === id || String(p.id) === id
    );
    
    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }
    
    // Map fields to be consistent (as seen in admin and frontend)
    const formattedProject = {
      ...project,
      // Ensure Title, Description, ImageUrl, ClientName, CategoryName are available
      // even if they came back as snake_case from the SP
      Title: project.Title || project.title,
      Description: project.Description || project.description,
      ImageUrl: project.ImageUrl || project.image_url,
      ClientName: project.ClientName || project.client_name,
      CategoryName: project.CategoryName || project.category_name,
      ProjectId: project.ProjectId || project.id || project.Id
    };
    
    return NextResponse.json(formattedProject);
  } catch (error: any) {
    console.error("Error fetching project:", error);
    return NextResponse.json({ message: "Failed to fetch project", error: error.message }, { status: 500 });
  }
}

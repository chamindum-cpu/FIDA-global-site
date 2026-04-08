import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Login Request Body:", body);
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ message: "Username and password are required" }, { status: 400 });
    }

    console.log("Connecting to DB...");
    const pool = await getDbConnection();
    
    // Fetch the user by username
    console.log("Executing Query for user:", username);
    const result = await pool.request()
      .input('username', sql.NVarChar, username)
      .query('SELECT id, username, password FROM users WHERE username = @username');

    console.log("Query Result count:", result.recordset.length);

    if (result.recordset.length > 0) {
      const user = result.recordset[0];
      
      console.log("Comparing passwords...");
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log("Password valid:", isPasswordValid);

      if (isPasswordValid) {
        // Login successful
        console.log("Login success! Setting cookies...");
        const response = NextResponse.json({ 
          message: "Login successful", 
          user: { id: user.id, username: user.username } 
        });

        // Set a simple session cookie
        response.cookies.set("auth_session", "true", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24, // 1 day
          path: "/",
        });

        return response;
      }
    }

    // Login failed (generic message for security)
    console.log("Login failed: invalid credentials.");
    return NextResponse.json({ message: "Invalid username or password" }, { status: 401 });

  } catch (error: any) {
    console.error("Login API FULL Error:", error);
    return NextResponse.json({ 
      message: "Internal server error", 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}

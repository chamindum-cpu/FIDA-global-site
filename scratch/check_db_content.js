const { sql } = require("./src/lib/db");

async function checkData() {
  try {
    const expertise = await sql.query("SELECT * FROM dbo.Capabilities"); // Based on conversation history it might be named differently, let's check common names
    console.log("Expertise:", expertise.recordset);
    
    const projects = await sql.query("SELECT TOP 5 * FROM dbo.Projects");
    console.log("Projects:", projects.recordset);
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    process.exit();
  }
}

checkData();

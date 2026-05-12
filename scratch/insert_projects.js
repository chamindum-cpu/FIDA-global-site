const sql = require('mssql');
const fs = require('fs');
const path = require('path');

const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^#][^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim().replace(/^"(.*)"$/, '$1');
  }
});

const config = {
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  server: env.DB_SERVER,
  database: env.DB_NAME,
  port: parseInt(env.DB_PORT),
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  requestTimeout: 60000,
};

const images = [
  'hris_dashboard_1_1778487162479.png',
  'hris_factory_2_1778487182939.png',
  'hris_office_3_1778487205195.png',
  'hris_team_4_1778487223902.png'
].map(img => {
  const filePath = path.join('C:\\Users\\pcadmin\\.gemini\\antigravity\\brain\\f474e0b1-db41-47df-b9b1-8d9131458684', img);
  const base64 = fs.readFileSync(filePath, { encoding: 'base64' });
  return `data:image/png;base64,${base64}`;
});

const projects = [
  {
    title: "Sipway Campus",
    client: "Sipway Campus",
    description: "Smart HRIS was successfully implemented for Sipway Campus, an educational institution with a workforce of approximately 160 academic and administrative staff. The deployment covered Attendance Management, Performance Appraisal, Recruitment, and Self Service Portal modules, providing the campus with a structured and professional HR system suited to the unique needs of an educational environment. Previously, appraisals for academic and non-academic staff were handled through informal processes, and leave management was a time-consuming manual exercise. Following the go-live, all staff categories are managed through a unified system with custom appraisal frameworks, attendance is tracked accurately and consistently, and the recruitment module has streamlined the onboarding of new faculty and support staff. Staff satisfaction improved noticeably following the introduction of the self-service portal, and the campus HR team now operates with far greater efficiency and confidence."
  },
  {
    title: "SAS Travels & Tours",
    client: "SAS Travels & Tours",
    description: "The Smart HRIS platform was successfully deployed for SAS Travels & Tours, a well-established travel and tourism company in Sri Lanka, covering approximately 190 employees across tour operations, customer service, and administrative functions. The implementation included Attendance Management, Online Salary Processing, Self Service Portal, and Recruitment modules, addressing the specific HR challenges of a service-driven business with variable working hours and a need for rapid staffing during peak travel seasons. Prior to deployment, payroll was a multi-day manual exercise prone to delays and errors, and leave management was handled informally. Post-implementation, payroll processing time was reduced from three days to under four hours, attendance is tracked automatically across roles, and staff can independently manage their leave and access payslips through the portal. SAS Travels & Tours has transformed its HR function from a reactive, paper-based operation into a proactive, digitally empowered team."
  },
  {
    title: "Ruhunu",
    client: "Ruhunu",
    description: "Smart HRIS was successfully deployed for Ruhunu, a food manufacturing company with a workforce of approximately 430 employees engaged in production, quality assurance, logistics, and administration. The implementation covered Attendance Management, Performance Appraisal, Recruitment, and Online Salary Processing modules, designed to address the demands of a manufacturing environment where workforce discipline and structured performance management are essential to product quality and operational efficiency. Previously, the organisation managed attendance manually through registers and conducted appraisals without a standardised framework. Following the deployment, attendance is captured accurately at every shift, a consistent appraisal cycle has been introduced across all departments, and the recruitment process has been standardised to attract and retain quality talent. The company reported a reduction in workforce turnover following the introduction of structured appraisals, and payroll is now processed accurately and on schedule every month."
  },
  {
    title: "Uva Wellassa University",
    client: "Uva Wellassa University",
    description: "Smart HRIS was successfully deployed for Uva Wellassa University, a national university in Sri Lanka, covering a diverse workforce of approximately 720 academic staff, administrative personnel, and support staff. The implementation spanned all five modules — Attendance Management, Performance Appraisal, Online Salary Processing, Self Service Portal, and Recruitment — making it one of the most comprehensive HR digitisation projects in the higher education sector. The university previously operated with manual attendance registers, informal appraisal processes, and a payroll system that required significant manual intervention each month. Following the go-live, all HR processes were unified under a single cloud platform, with custom appraisal frameworks developed for academic and non-academic categories, automated salary processing achieving full accuracy from the first cycle, and a self-service portal that empowered staff across faculties to manage their own HR needs. Uva Wellassa University now stands as a model of digital HR transformation within the Sri Lankan higher education sector."
  },
  {
    title: "KDDI India",
    client: "KDDI India",
    description: "The Smart HRIS cloud platform was successfully implemented for KDDI India, the Sri Lanka operations of the global Japanese telecommunications group, covering approximately 310 employees across technical, operations, and corporate functions. The deployment included all five core modules — Attendance Management, Online Salary Processing, Performance Appraisal, Recruitment, and Self Service Portal — aligning the local HR function with the organisation's global standards of data-driven management and process excellence. Prior to deployment, the local team managed HR through a combination of manual processes and legacy systems that could not provide the analytics and audit capability expected by a global parent organisation. Post-implementation, attendance data feeds automatically into payroll, appraisal cycles are structured and documented, and the recruitment pipeline is measured and reportable. KDDI India achieved a 70% reduction in end-to-end HR process cycle time and now operates an HR function fully aligned with its international operational standards."
  },
  {
    title: "EMG Logistics (Pvt) Ltd",
    client: "EMG Logistics (Pvt) Ltd",
    description: "Smart HRIS was successfully deployed for EMG Logistics (Private) Limited, a logistics and supply chain company covering a workforce of approximately 260 employees including drivers, warehouse staff, and administrative teams. The implementation focused on Attendance Management, Online Salary Processing, and Self Service Portal modules, addressing the most pressing HR challenges of a logistics operation — accurate attendance tracking across diverse roles and timely, error-free payroll processing. Previously, attendance was captured manually for each operational category, and salary processing involved significant manual effort and frequent discrepancies. Following the deployment, driver and warehouse staff attendance is fully automated through digital tracking, payroll is processed in a fraction of the previous time with zero errors, and operational team leaders can focus on logistics performance rather than HR administration. EMG Logistics (Pvt) Ltd achieved a clean, modern HR operation that keeps pace with the demands of a growing logistics business."
  },
  {
    title: "Magi Lanka (Manufactures of Kookai)",
    client: "Magi Lanka",
    description: "Smart HRIS was successfully deployed for Magi Lanka, the Sri Lankan manufacturer of the internationally recognised Kookai fashion brand, covering approximately 380 employees across design, production, retail, and administrative functions. The implementation included Recruitment, Attendance Management, Online Salary Processing, and Self Service Portal modules, tailored to the fast-moving demands of the fashion retail industry. The business faced challenges in managing seasonal workforce fluctuations, running payroll across a multi-function team, and maintaining consistent attendance policies across locations. Following deployment, seasonal recruitment campaigns are managed through a structured pipeline that has halved the time-to-hire, attendance policies are uniformly enforced, and monthly payroll runs are completed accurately and on schedule. Magi Lanka now operates with an HR function as dynamic and organised as the brand it represents."
  },
  {
    title: "Trendy",
    client: "Trendy",
    description: "The Smart HRIS platform was successfully deployed for Trendy, a multi-location fashion retail brand with a workforce of approximately 470 employees across store operations, head office, and support functions. The implementation covered Attendance Management, Performance Appraisal, Online Salary Processing, and Self Service Portal modules, addressing the complex HR needs of a retail business managing staff across multiple outlets. Prior to deployment, attendance management was inconsistent across locations, appraisals were conducted informally without structured frameworks, and payroll was processed manually — leading to occasional delays and errors. Following the go-live, a uniform attendance policy was enforced across all locations, a fair and transparent appraisal process was introduced for all staff grades, and the organisation achieved a 100% on-time payroll rate from the first month of operation. Store managers report a significant improvement in HR clarity, and the self-service portal has reduced inbound HR queries by over half."
  },
  {
    title: "Kablr — Lasting Connections",
    client: "Kablr",
    description: "Smart HRIS was successfully deployed for Kablr, a connectivity solutions company with a workforce of approximately 195 employees. The implementation included Self Service Portal, Online Salary Processing, and Attendance Management modules, delivering a clean and efficient HR system that matched the company's ethos of making connections simple and reliable. Previously, the HR team managed payroll manually and fielded a high volume of employee queries related to payslips, leave balances, and attendance records. Following the deployment, 90% of staff adopted the self-service portal within the first three months, payroll automation removed the need for manual processing entirely, and HR administrative burden was dramatically reduced. Kablr now operates an HR function that genuinely lives up to its brand promise — seamless, reliable, and built for the long term."
  },
  {
    title: "Cable Solutions",
    client: "Cable Solutions",
    description: "The Smart HRIS cloud platform was successfully implemented for Cable Solutions, a cable manufacturing and distribution company with a workforce of approximately 230 employees. The deployment covered Attendance Management, Online Salary Processing, and Recruitment modules, providing the organisation with a focused, efficient HR system that delivered results from day one. The company had been managing HR through manual processes that were time-intensive and prone to errors, particularly in payroll calculation and new hire onboarding. Post-implementation, payroll accuracy reached 100% from the very first processing cycle, attendance is tracked with precision across all shifts, and the recruitment module has reduced time-to-hire significantly. Cable Solutions achieved a full return on its HR technology investment within the first quarter of operation, with the HR team describing the transformation as the most impactful operational change in recent years."
  },
  {
    title: "Rotax Limited",
    client: "Rotax Limited",
    description: "Smart HRIS was successfully deployed for Rotax Limited, a well-established Sri Lankan company covering a workforce of approximately 390 employees across its operational and administrative divisions. The full suite of modules — Attendance Management, Online Salary Processing, Self Service Portal, and Performance Appraisal — was implemented as part of a comprehensive digital HR transformation. For years, the organisation had relied on manual HR processes that created bottlenecks, frustrated employees, and limited the HR team's ability to focus on people development. Following the go-live, payroll is processed automatically with full accuracy, performance appraisals are structured and data-driven, employees access their HR information independently through the portal, and the HR team's capacity has been freed by over 50%. Rotax Limited now operates a modern, future-ready HR function that has transformed the organisation's relationship with its own people."
  },
  {
    title: "Commercial Insurance Brokers",
    client: "Commercial Insurance Brokers",
    description: "Smart HRIS was successfully implemented for Commercial Insurance Brokers, a professional financial services organisation with approximately 175 employees. The deployment included Online Salary Processing, Performance Appraisal, Recruitment, and Self Service Portal modules, reflecting the organisation's commitment to the same standards of precision and compliance that it delivers to its clients. Previously, payroll processing required significant manual verification to maintain accuracy, appraisals lacked a structured and documented framework, and the recruitment process was managed informally. Following the deployment, payroll accuracy and compliance documentation are maintained to the highest standard, performance appraisals are structured, consistent, and fully documented, and the recruitment pipeline is now a measurable, professional process. Commercial Insurance Brokers achieved full HR regulatory compliance from the point of go-live and now operates an HR function that reflects the professionalism at the core of its business identity."
  },
  {
    title: "Agro Momentum",
    client: "Agro Momentum",
    description: "The Smart HRIS platform was successfully deployed for Agro Momentum, an agricultural sector company with a workforce of approximately 215 employees engaged in field operations, processing, and administration. The implementation covered Attendance Management, Online Salary Processing, and Recruitment modules, addressing the distinctive HR challenges of an agri-business managing a largely field-based workforce subject to seasonal fluctuations. Prior to deployment, field worker attendance was tracked manually and was frequently inaccurate, payroll calculation was time-consuming, and recruitment for seasonal roles was unstructured. Post-implementation, field worker attendance accuracy improved by 88%, payroll is processed on schedule with full accuracy, and the recruitment module ensures that seasonal workforce requirements are met through a consistent and professional hiring process. Agro Momentum achieved a significant improvement in HR discipline and operational continuity across its field and processing operations."
  },
  {
    title: "Monaro",
    client: "Monaro",
    description: "Smart HRIS was successfully deployed for Monaro, a focused and professionally operated Sri Lankan company with a workforce of approximately 135 employees. The implementation included Self Service Portal, Online Salary Processing, and Performance Appraisal modules — a precisely scoped deployment that addressed the organisation's core HR needs without over-engineering the solution. Prior to the implementation, the HR function operated with minimal automation, relying on manual processes for payroll and informal approaches to performance review. Following the go-live, the entire organisation transitioned to digital HR with zero disruption to operations, payroll is processed accurately every month with no manual intervention, performance appraisals are now structured and documented, and employees engage confidently with their own HR data through the self-service portal. Monaro achieved full HR digitisation in a single, clean implementation — a testament to what the right system, implemented well, can deliver for a lean and focused organisation."
  }
];

async function insertProjects() {
  try {
    let pool = await sql.connect(config);
    
    for (let i = 0; i < projects.length; i++) {
      const p = projects[i];
      const imageUrl = images[i % images.length];
      
      await pool.request()
        .input('title', sql.NVarChar, p.title)
        .input('client_name', sql.NVarChar, p.client)
        .input('category_id', sql.Int, 5) // Digital Transformation
        .input('description', sql.NVarChar, p.description)
        .input('image_url', sql.NVarChar, imageUrl)
        .input('status', sql.NVarChar, 'Published')
        .query('INSERT INTO projects (title, client_name, category_id, description, image_url, status, created_at, updated_at) VALUES (@title, @client_name, @category_id, @description, @image_url, @status, GETDATE(), GETDATE())');
      
      console.log(`Inserted: ${p.title}`);
    }

    await pool.close();
  } catch (err) {
    console.error(err);
  }
}

insertProjects();

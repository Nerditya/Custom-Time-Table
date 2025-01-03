const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const xlsx = require('xlsx');
const ExcelJS = require('exceljs');
const path = require('path');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(cors());

const limiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'You have reached the maximum number of requests for today.',
    keyGenerator: (req) => req.body.email, // rate limit based on email
});
// Dummy course data for demonstration
const courses = [
    { value: 'CE406', label: 'Steel Structures (CE406)' },
    { value: 'CE518', label: 'Irrigation and Drainage (CE518)' },
    { value: 'CH504', label: 'Numerical Methods for Engineers (CH504)' },
    { value: 'CS540', label: 'Cryptocurrencies and Blockchain Technology (CS540)' },
    { value: 'CY458', label: 'Bio Materials (CY458)' },
    { value: 'EE510', label: 'High Voltage Engineering (EE510)' },
    { value: 'EE524', label: 'Detection and Estimation Theory (EE524)' },
    { value: 'HS505', label: 'Sound Patterns in Human Language (HS505)' },
    { value: 'HS511', label: 'Pension Economics and Finance (HS511)' },
    { value: 'MA614', label: 'Applied Linear Algebra and Matrix Analysis (MA614)' },
    { value: 'ME581', label: 'Automotive Engineering (ME581)' },
    { value: 'MM309', label: 'Polymers and Composites (MM309)' },
    { value: 'PH303', label: 'Optics and Photonics (PH303)' },
    { value: 'PH554', label: 'Nonlinear Optics (PH554)' },
    { value: 'BM614', label: 'Immunology (BM614)' },
    { value: 'CE619', label: 'Solid and Hazardous Waste Management (CE619)' },
    { value: 'CH516', label: 'Advanced Process Control (CH516)' },
    { value: 'CS604', label: 'Advanced Operating Systems (CS604)' },
    { value: 'EE514', label: 'Design & Application of Electric Drives (EE514)' },
    { value: 'EE657', label: 'Mixed-Signal IC Design (EE657)' },
    { value: 'GE103', label: 'Introduction to Computing and Data Structures (GE103)' },
    { value: 'HS475', label: 'Introduction to Fantasy and Science Fiction (HS475)' },
    { value: 'MA517', label: 'Distributed Algorithms (MA517)' },
    { value: 'MA628', label: 'Financial Derivatives Pricing (MA628)' },
    { value: 'ME515', label: 'Finite Element Methods in Engineering (ME515)' },
    { value: 'PH457', label: 'Engineering Photonics (PH457)' },
    { value: 'PH566', label: 'Foundations of Quantum Theory (PH566)' },
    { value: 'BM101', label: 'Biology for Engineers (BM101)' },
    { value: 'BM607', label: 'Medical Devices and Equipment (BM607)' },
    { value: 'CE563', label: 'Geoinformatics for Landuse Planning (CE563)' },
    { value: 'CH603', label: 'Engineering Applications of Rheology (CH603)' },
    { value: 'CS560', label: 'Optimization in Machine Learning (CS560)' },
    { value: 'CY421', label: 'Advanced Organic Chemistry (CY421)' },
    { value: 'GE104', label: 'Introduction to Electrical Engineering (GE104)' },
    { value: 'HS202', label: 'Human Geography and Social Needs (HS202)' },
    { value: 'MA421', label: 'Topics in Complex Analysis (MA421)' },
    { value: 'ME561', label: 'Advanced Welding Technology (ME561)' },
    { value: 'ME584', label: 'Fundamentals of Compressible Flows (ME584)' },
    { value: 'BM608', label: 'Biomechanics (BM608)' },
    { value: 'CE302', label: 'Pipe and Open Channel Hydraulics (CE302)' },
    { value: 'CE504', label: 'Water Resources Planning and Management (CE504)' },
    { value: 'CS533', label: 'Reinforcement Learning (CS533)' },
    { value: 'CY230', label: 'Introduction to Organic Chemistry and Biochemistry (CY230)' },
    { value: 'CY422', label: 'Coordination Chemistry (CY422)' },
    { value: 'MA102', label: 'Linear Algebra, Integral Transforms and Special Functions (MA102)' },
    { value: 'MA203', label: 'Probability and Stochastic Processes (MA203)' },
    { value: 'MA423', label: 'Stochastic Processes (MA423)' },
    { value: 'ME203', label: 'Theory of Machines (ME203)' },
    { value: 'ME514', label: 'Fracture and Fatigue (ME514)' },
    { value: 'MM206', label: 'Principles of Extractive Metallurgy (MM206)' },
    { value: 'MM556', label: 'Electron Microscopy & Microanalysis (MM556)' },
    { value: 'PH421', label: 'Quantum Mechanics II (PH421)' },
    { value: 'BM609', label: 'Physics of Medical Imaging (BM609)' },
    { value: 'CE301', label: 'Structural Analysis (CE301)' },
    { value: 'CE526', label: 'Computational Geomechanics (CE526)' },
    { value: 'CH601', label: 'Chemical Engineering Thermodynamics (CH601)' },
    { value: 'CH203', label: 'Heat & Mass Transfer (CH203)' },
    { value: 'CS202', label: 'Programming Paradigms and Pragmatics (CS202)' },
    { value: 'CS510', label: 'Advanced Computer Architecture (CS510)' },
    { value: 'CS512', label: 'Artificial Intelligence (CS512)' },
    { value: 'CS535', label: 'Introduction to Game Theory and Mechanism Design (CS535)' },
    { value: 'CY423', label: 'Solid-State Chemistry (CY423)' },
    { value: 'EE209', label: 'Circuit Theory (EE209)' },
    { value: 'EE530', label: 'Core - VLSI Fabrication Technology (EE530)' },
    { value: 'HS201', label: 'Economics (HS201)' },
    { value: 'MA204', label: 'Introduction to Numerical Analysis (MA204)' },
    { value: 'MA424', label: 'Numerical Analysis (MA424)' },
    { value: 'ME546', label: 'Micromanufacturing (ME546)' },
    { value: 'ME624', label: 'Machine Vibration Analysis (ME624)' },
    { value: 'PH101', label: 'Physics for Engineers (PH101)' },
    { value: 'PH422', label: 'Experimental Methods (PH422)' },
    { value: 'BM610', label: 'Research Ethics and Professional (BM610)' },
    { value: 'CE503', label: 'Groundwater Hydrology (CE503)' },
    { value: 'CE545', label: 'Basic Rock Mechanics (CE545)' },
    { value: 'CH101', label: 'Introduction to Chemical Engineering (CH101)' },
    { value: 'CH509', label: 'Molecular Simulation (CH509)' },
    { value: 'CS101', label: 'Discrete Mathematical Structures (CS101)' },
    { value: 'CS111', label: 'Mathematical Foundation for AI and DE (CS111)' },
    { value: 'CS550', label: 'Research Methodologies in Computer Science (CS550)' },
    { value: 'CS558', label: 'Cybersecurity Essentials (CS558)' },
    { value: 'CY427', label: 'Interpretative Molecular Spectroscopy (CY427)' },
    { value: 'GE106', label: 'Material Science for Electrical and Electronics Engineers (GE106)' },
    { value: 'GE108', label: 'Basic Electronics (GE108)' },
    { value: 'GE110', label: 'Introduction to Metallurgical and Materials Engineering (GE110)' },
    { value: 'HS101', label: 'History of Technology (HS101)' },
    { value: 'MA422', label: 'Partial Differential Equation (MA422)' },
    { value: 'PH423', label: 'Atomic & Molecular Physics (PH423)' },
    { value: 'CE405', label: 'Waste Water Engineering (CE405)' },
    { value: 'CH305', label: 'Process Design and Economics (CH305)' },
    { value: 'CS306', label: 'Theory of Computation (CS306)' },
    { value: 'CY516', label: 'Elementary Principles of Equilibrium Statistical Mechanics and Stochastic Processes (CY516)' },
    { value: 'EE307', label: 'Power Electronics (EE307)' },
    { value: 'EE628', label: 'RF Systems for Communications (EE628)' },
    { value: 'HS491', label: 'Cine Politics and National Emergency (HS491)' },
    { value: 'MA425', label: 'Topology (MA425)' },
    { value: 'MA610', label: 'Measure Theory (MA610)' },
    { value: 'ME305', label: 'Manufacturing Technology-II (ME305)' },
    { value: 'ME520', label: 'Composite Materials (ME520)' },
    { value: 'MM307', label: 'Electronic, Magnetic and Optical Materials (MM307)' },
    { value: 'PH305', label: 'Semiconductor Physics and Applications (PH305)' },
    { value: 'BM604', label: 'Introduction to Advanced Biology (BM604)' },
    { value: 'CE525', label: 'Analysis and Design of Industrial Structures (CE525)' },
    { value: 'CH610', label: 'Chemical Engineering Mathematics (CH610)' },
    { value: 'CS204', label: 'Computer Architecture (CS204)' },
    { value: 'CS515', label: 'Computer Graphics (CS515)' },
    { value: 'CS539', label: 'Internet of Things (CS539)' },
    { value: 'CY424', label: 'Electrochemistry and Statistical Thermodynamics (CY424)' },
    { value: 'EE207', label: 'Control Engineering (EE207)' },
    { value: 'ME549', label: 'Additive Manufacturing (ME549)' },
    { value: 'ME580', label: 'Computational Fluid Dynamics (ME580)' },
    { value: 'MM601', label: 'Phase Transformations (MM601)' },
    { value: 'PH424', label: 'Nuclear and Particle Physics (PH424)' },
    { value: 'MA202', label: 'Probability and Statistics (MA202)' },
    { value: 'CE303', label: 'Soil Mechanics (CE303)' },
    { value: 'CE407', label: 'Transportation Engineering (CE407)' },
    { value: 'CE506', label: 'Environment Impact Assessment of Water Resources Development (CE506)' },
    { value: 'CH204', label: 'Fluid Mechanics (CH204)' },
    { value: 'CS305', label: 'Software Engineering (CS305)' },
    { value: 'CS503', label: 'Machine Learning (CS503)' },
    { value: 'HS507', label: 'Positive Psychology & Well-Being (HS507)' },
    { value: 'MA426', label: 'Theory of Computation (MA426)' },
    { value: 'ME204', label: 'Fluid Mechanics (ME204)' },
    { value: 'ME576', label: 'Convective Heat Transfer (ME576)' },
    { value: 'MM202', label: 'Transport Phenomena (MM202)' },
    { value: 'MM207', label: 'Phase Transformation and Heat Treatment (MM207)' },
    { value: 'MM511', label: 'Introduction to Nanoscience and Nanotechnology (MM511)' },
    { value: 'PH304', label: 'Quantum Theory of Solids (PH304)' },
    { value: 'PH425', label: 'Condensed Matter Physics (PH425)' },
    { value: 'CE403', label: 'Foundation Engineering (CE403)' },
    { value: 'CE552', label: 'Bridge Engineering (CE552)' },
    { value: 'CH304', label: 'Process Equipment Design (CH304)' },
    { value: 'CS517', label: 'Digital Image Processing & Analysis (CS517)' },
    { value: 'CS536', label: 'Graph Theory (CS536)' },
    { value: 'CS619', label: 'Advanced Algorithms (CS619)' },
    { value: 'CY101', label: 'Chemistry for Engineers (CY101)' },
    { value: 'ED501', label: 'Administration and Management of Engineering Education (ED501)' },
    { value: 'EE309', label: 'Power Systems (EE309)' },
    { value: 'MA302', label: 'Optimization Techniques (MA302)' },
    { value: 'ME304', label: 'Machine Design (ME304)' },
    { value: 'ME512', label: 'Robotic Manipulators: Kinematics, Dynamics and Control (ME512)' },
    { value: 'MM306', label: 'Corrosion and Its Prevention (MM306)' },
    { value: 'MM522', label: 'Electrochemistry and Degradation of Materials (MM522)' },
    { value: 'PH306', label: 'Numerical Method and Analysis (PH306)' },
    { value: 'PH562', label: 'Introduction to Quantum Computation and Communication (PH562)' },
    { value: 'BM611', label: 'Cancer Biology - Advances in Diagnostics and Therapeutics (BM611)' },
    { value: 'EE522', label: 'Adaptive Signal Processing (EE522)' },
    { value: 'GE111', label: 'Introduction to Environmental Science and Engineering (GE111)' },
    { value: 'HS301', label: 'Industrial Management (HS301)' },
    { value: 'HS501', label: 'Academic Communication: Basics (HS501)' },
    { value: 'ME545', label: 'Sustainable Design and Manufacturing (ME545)' },
    { value: 'MM521', label: 'Steel Plant Technology (MM521)' },
    { value: 'PH568', label: 'Introduction to Many Body Quantum Physics (PH568)' },
    { value: 'CE602', label: 'Earthquake Resistant Design of Structures (CE602)' },
    { value: 'CH507A', label: 'Introduction to Polymer Science and Engineering (CH507A)' },
    { value: 'CS304', label: 'Computer Networks (CS304)' },
    { value: 'CS546', label: 'Introduction to Agriculture Cyber Physical Systems (CS546)' },
    { value: 'EE512', label: 'Stability & Control of Power Systems (EE512)' },
    { value: 'HS104', label: 'Professional Ethics (HS104)' },
    { value: 'HS514', label: 'Philosophy of Mind, Consciousness and Cognition (HS514)' },
    { value: 'MA703', label: 'Computational Partial Differential Equations (MA703)' },
    { value: 'ME504', label: 'Deep Learning for Physical Systems (ME504)' },
    { value: 'ME542', label: 'Modern Manufacturing Processes (ME542)' },
    { value: 'MM532', label: 'Computational Fracture Mechanics (MM532)' },
    { value: 'PH612', label: 'Thin Films Science and Technology (PH612)' },
    { value: 'EE646', label: 'IoT & its Application (EE646)' },
    { value: 'EE673', label: 'Deep Learning for Computer Vision (EE673)' },
    { value: 'MA625', label: 'Calculus of Variations & Integral Equations (MA625)' },
  
    { value: 'BM799', label: 'PROJECT-II (BM799)' },
  
    { value: 'CE799', label: 'PROJECT-II (CE799)' },
  
    { value: 'CH220', label: 'Seminar-II (CH220)' },
  
    { value: 'CH231', label: 'Fluid Mechanics, Heat & Mass Transfer Lab (CH231)' },
  
    { value: 'CH331', label: 'Process Control Lab (CH331)' },
  
    { value: 'CH420', label: 'Aspects of Chemical Business and Ethics (CH420)' },
  
    { value: 'CH501', label: 'Chemical Engineering Technical Communication - II (CH501)' },
  
    { value: 'CH799', label: 'PROJECT-II (CH799)' },
  
    { value: 'CP301', label: 'Development Engineering Project (CP301)' },
  
    { value: 'CP302', label: 'Capstone I (CP302)' },
  
    { value: 'CP303', label: 'Capstone Project - II (CP303)' },
  
    { value: 'CS500', label: 'PG Seminar in Computer Science (CS500)' },
  
    { value: 'CS543', label: 'Reinforcement Learning Lab (CS543)' },
  
    { value: 'CS626', label: 'Advanced Operating Systems (CS626)' },
  
    { value: 'CS799', label: 'Project-II (CS799)' },
  
    { value: 'CY403', label: 'Practical – 3 (CY403)' },
  
    { value: 'CY404', label: 'Practical – 4 (CY404)' },
  
    { value: 'CY500', label: 'Seminar (CY500)' },
  
    { value: 'CY799', label: 'Project - II (CY799)' },
  
    { value: 'EE206', label: 'Electromechanics Laboratory (EE206)' },
  
    { value: 'EE304', label: 'Communication Lab (EE304)' },
  
    { value: 'EE306', label: 'Electromagnetics Lab (EE306)' },
  
    { value: 'EE308', label: 'Power Electronics Lab (EE308)' },
  
    { value: 'EE310', label: 'Power Systems Lab (EE310)' },
  
    { value: 'EE526', label: 'Communication & Signal Processing Lab: 2 (EE526)' },
  
    { value: 'EE532', label: 'Core Lab - Device Stimulation Lab (EE532)' },
  
    { value: 'EE534', label: 'Core - Seminar 2 (EE534)' },
  
    { value: 'EE799', label: 'PROJECT-II (EE799)' },
  
    { value: 'GE101', label: 'Technology Museum Lab (GE101)' },
  
    { value: 'GE102', label: 'Workshop Practice (GE102)' },
  
    { value: 'GE105', label: 'Engineering Drawing (GE105)' },
  
    { value: 'GE107', label: 'Tinkering Lab (GE107)' },
  
    { value: 'GE109', label: 'Introduction to Engineering Products (GE109)' },
  
    { value: 'MA205', label: 'Computing Lab (MA205)' },
  
    { value: 'MA303', label: 'Computing Lab-II (MA303)' },
  
    { value: 'MA500', label: 'Seminar (MA500)' },
  
    { value: 'MA799', label: 'Project-II (MA799)' },
  
    { value: 'ME101', label: 'Engineering Mechanics (ME101)' },
  
    { value: 'ME205', label: 'Design Lab-I (ME205)' },
  
    { value: 'ME306', label: 'Design Lab-II (ME306)' },
  
    { value: 'ME307', label: 'Thermo-Fluids Lab-II (ME307)' },
  
    { value: 'ME308', label: 'Manufacturing Lab-II (ME308)' },
  
    { value: 'ME799', label: 'PROJECT-II (ME799)' },
  
    { value: 'MM208', label: 'Phase Transformation and Heat Treatment Lab (MM208)' },
  
    { value: 'MM222', label: 'Computational Thermodynamics (MM222)' },
  
    { value: 'MM310', label: 'Corrosion Lab (MM310)' },
  
    { value: 'MM322', label: 'Modeling of Metallurgical System Lab (MM322)' },
  
    { value: 'NO102', label: 'NSO II (NO102)' },
  
    { value: 'NO104', label: 'NSO- IV/NSS- IV (NO104)' },
  
    { value: 'NS102', label: 'NSS II (NS102)' },
  
    { value: 'PH420', label: 'Condensed Matter Lab + Nuclear Physics Lab (PH420)' },
  
    { value: 'PH102', label: 'Physics for Engineers Lab (PH102)' },
  
    { value: 'PH210', label: 'Physics Lab II (PH210)' },
  
    { value: 'PH500', label: 'MSc Seminar and Viva Voce (PH500)' },
  
    { value: 'PH799', label: 'MSc Project II (PH799)' }
  ]
let hits = 0;

const colors = [
    'FFFFB3BA', 'FFFFDFBA', 'FFFFFFBA', 'FFBAFFC9', 'FFBAE1FF',
    'FFB3E5FC', 'FFB2DFDB', 'FFC8E6C9', 'FFDCEDC8', 'FFF0F4C3',
    'FFFFF9C4', 'FFFFE0B2', 'FFFFCCBC', 'FFD7CCC8', 'FFCFD8DC'
];

function getColorForCourse(courseCode) {
    const hash = courseCode.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
}

app.post('/submit', limiter, async (req, res) => {
    try {
        console.log("hits- " + hits);

        const { email, courseCodes } = req.body;
        const courseCodesArray = courseCodes.split(',').map(code => code.trim());

        const originalFilePath = path.join(__dirname, 'schedule2.xlsx');

        // Read the Excel file
        const workbook = xlsx.readFile(originalFilePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

        // Extract the top 4 rows and the first column
        const topRows = data.slice(0, 4);

        // Process the data while preserving top 4 rows and the first column
        const processedData = data.map((row, rowIndex) => {
            if (rowIndex < 4) {
                return row; // Keep the first 4 rows unchanged
            }

            return row.map((cell, colIndex) => {
                if (colIndex === 0 || rowIndex < 4) {
                    return cell; // Preserve the first column and top 4 rows
                } else {
                    // Clear cell content if it does not match any course code
                    if (courseCodesArray.some(code => cell && cell.toString().includes(code))) {
                        return cell; // Keep the content if it matches
                    } else {
                        return ''; // Clear the content if it does not match
                    }
                }
            });
        });

        // Remove completely empty rows
        const nonEmptyRows = processedData.filter(row => row.some(cell => cell !== ''));

        // Remove the last 24 rows
        let filteredRows = nonEmptyRows.slice(0, -24);
        filteredRows = filteredRows.slice(2);

        // Create a new workbook with the filtered and processed data
        const newSheet = xlsx.utils.aoa_to_sheet(filteredRows);
        const newWorkbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(newWorkbook, newSheet, 'Filtered');

        // Save the workbook with the processed data
        const tempFilePath = path.join('/tmp', 'filtered_timetable.xlsx');
        xlsx.writeFile(newWorkbook, tempFilePath);

        // Use ExcelJS for applying formatting
        const workbookWithBorders = new ExcelJS.Workbook();
        await workbookWithBorders.xlsx.readFile(tempFilePath);
        const worksheet = workbookWithBorders.getWorksheet('Filtered');

        const dayRows = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday","Saturday"];

        worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
            if (row.values.some(cell => dayRows.some(day => cell && cell.toString().includes(day)))) {
                if (rowNumber > 1) {
                    // Apply bold borders from column A to L
                    for (let col = 1; col <= 12; col++) { // Columns A to L
                        const cell = worksheet.getCell(rowNumber-1, col); // Adjusted row number
                        cell.border = {
                            bottom: { style: 'thick', color: { argb: 'FF000000' } } // Black color
                        };
                    }
                }
            }
        });

        // Apply colors to matching cells
        worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
            row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                const cellValue = cell.value ? cell.value.toString() : '';
                const matchingCode = courseCodesArray.find(code => cellValue.includes(code));
                if (matchingCode) {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: getColorForCourse(matchingCode) }
                    };
                }
            });
        });

        // Set column widths to fit the content
        worksheet.columns.forEach(column => {
            let maxLength = 0;
            column.eachCell({ includeEmpty: true }, cell => {
                const cellValue = cell.value ? cell.value.toString() : '';
                maxLength = Math.max(maxLength, cellValue.length);
            });
            column.width = maxLength + 2; // Add some padding
        });

        // Filter the courses to include only those with matching course codes
        const matchingCourses = courses.filter(course => courseCodesArray.includes(course.value));
      
        // Append course codes and labels at the bottom
        worksheet.addRow([]);
        worksheet.addRow(['Course Codes and Labels']);
        matchingCourses.forEach(course => {
            worksheet.addRow([course.value, course.label]);
        });

        // Add disclaimer note
        worksheet.addRow([]);
        worksheet.addRow(['Note: This is simply extracted from the timetable sent by the academic section, use at your own risk.']);

        // Save the workbook with borders and additional info
        await workbookWithBorders.xlsx.writeFile(tempFilePath);

        // Send email with attachment
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Your Custom Timetable',
            text: 'Please find attached your custom timetable based on the requested courses.',
            attachments: [
                {
                    filename: 'filtered_timetable.xlsx',
                    path: tempFilePath
                }
            ]
        };

        try {
            await transporter.sendMail(mailOptions);
            res.status(200).send('Email sent successfully');
            hits++;
        } catch (error) {
            res.status(500).send('Error sending email: ' + error.message);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(`An error occurred ${error}`);
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
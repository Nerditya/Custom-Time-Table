import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './App.css';
// import 'react-select/dist/react-select.css';


const courses = [
    { value: 'BM101', label: 'Biology for Engineers (BM101)' },
    { value: 'BM601', label: 'Fundamentals of Human Physiology (BM601)' },
    { value: 'BM605', label: 'Biomedical Electronics and Communication (BM605)' },
    { value: 'BM606', label: 'BIOMATERIAL - TISSUE INTERACTIONS (BM606)' },
    { value: 'BM614', label: 'Immunology (BM614)' },
    { value: 'BM615', label: 'Biomedical-Photonics: An Introduction (BM615)' },
    { value: 'BM699', label: 'PROJECT-I (BM699)' },
    { value: 'CE401', label: 'Structural Analysis II (CE401)' },
    { value: 'CE201', label: 'Strength of Materials (CE201)' },
    { value: 'CE202', label: 'Fundamentals of Fluid Mechanics (CE202)' },
    { value: 'CE203', label: 'Computer Aided Building Drawing (CE203)' },
    { value: 'CE304', label: 'Geomatics (CE304)' },
    { value: 'CE402', label: 'Water Resources Engineering (CE402)' },
    { value: 'CE404', label: 'Reinforced Concrete Structures (CE404)' },
    { value: 'CE501', label: 'Advanced Surface Hydrology (CE501)' },
    { value: 'CE502', label: 'Advanced Fluid Mechanics (CE502)' },
    { value: 'CE505', label: 'Water Quality Assessment (CE505)' },
    { value: 'CE507', label: 'Seminar (CE507)' },
    { value: 'CE511', label: 'Air pollution control and industrial management (CE511)' },
    { value: 'CE515', label: 'Computational Methods in Water and Environment (CE515)' },
    { value: 'CE516', label: 'Geoinformatics for water and environment (CE516)' },
    { value: 'CE519', label: 'Urban Transportation Systems Planning (CE519)' },
    { value: 'CE520', label: 'Dynamics of Structures (CE520)' },
    { value: 'CE521', label: 'Finite Element Analysis for Civil Engineering Applications (CE521)' },
    { value: 'CE522', label: 'Advanced Design of Concrete Structures (CE522)' },
    { value: 'CE523', label: 'Advanced foundation Engineering (CE523)' },
    { value: 'CE524', label: 'Earth Retaining Structures and Slope Stability (CE524)' },
    { value: 'CE527', label: 'Seminar (CE527)' },
    { value: 'CE546', label: 'Rock Engineering (CE546)' },
    { value: 'CE699', label: 'PROJECT-I (CE699)' },
    { value: 'CH120', label: 'Seminar 1 - Technical Communication for Chemical Engineers (CH120)' },
    { value: 'CH201', label: 'Thermodynamics (CH201)' },
    { value: 'CH202', label: 'Transport Phenomena (CH202)' },
    { value: 'CH230', label: 'CHE Simulation (Lab I) (CH230)' },
    { value: 'CH301', label: 'Separation Processes (CH301)' },
    { value: 'CH302', label: 'Chemical Reaction Engineering (CH302)' },
    { value: 'CH303', label: 'Process Control (CH303)' },
    { value: 'CH320', label: 'Seminar III (Chemical Engg. Applications) (CH320)' },
    { value: 'CH330', label: 'Chemical Reaction Engineering Lab (CH330)' },
    { value: 'CH500', label: 'CHEMICAL ENGINEERING TECHNICAL COMMUNICATION-I (CH500)' },
    { value: 'CH503', label: 'FUNDAMENTALS AND APPLICATIONS OF MICROFLUIDICS (CH503)' },
    { value: 'CH506', label: 'CHEMICAL PROCESS SAFETY (CH506)' },
    { value: 'CH510', label: 'Introduction to Process Systems Engineering (CH510)' },
    { value: 'CH514', label: 'Introduction to Granular Media: Statics and Kinematics (CH514)' },
    { value: 'CH602', label: 'Advanced Transport Phenomena (CH602)' },
    { value: 'CH611', label: 'Advanced Chemical Reation Engineering (CH611)' },
    { value: 'CH616', label: 'Biorheology (CH616)' },
    { value: 'CH699', label: 'PROJECT-I (CH699)' },
    { value: 'CP302', label: 'Capstone Project I (CP302)' },
    { value: 'CS201', label: 'Data Structures (CS201)' },
    { value: 'CS203', label: 'Digital Logic Design (CS203)' },
    { value: 'CS205', label: 'Data Structures and Algorithms (CS205)' },
    { value: 'CS206', label: 'Foundation of Computer Systems (CS206)' },
    { value: 'CS207', label: 'Foundation of Computer Systems Lab (CS207)' },
    { value: 'CS301', label: 'Introduction to Database Systems (CS301)' },
    { value: 'CS302', label: 'Analysis and Design of Algorithms (CS302)' },
    { value: 'CS303', label: 'Operating Systems (CS303)' },
    { value: 'CS501', label: 'Computational Complexity (CS501)' },
    { value: 'CS503', label: 'Machine Learning (CS503)' },
    { value: 'CS504', label: 'Artificial Neural Networks (CS504)' },
    { value: 'CS506', label: 'Data Structures and Algorithms (CS506)' },
    { value: 'CS509', label: 'PG Software Lab (CS509)' },
    { value: 'CS516', label: 'Wireless Adhoc Networks (CS516)' },
    { value: 'CS526', label: 'Mathematical Foundation of Computer Science (CS526)' },
    { value: 'CS527', label: 'Computer Systems (CS527)' },
    { value: 'CS539', label: 'Internet of Things (CS539)' },
    { value: 'CS542', label: 'Designing Machine Learning Systems (CS542)' },
    { value: 'CS551', label: 'Colloquium Series (CS551)' },
    { value: 'CS557', label: 'Artificial Intelligence for Healthcare (CS557)' },
    { value: 'CS603', label: 'Combinatorial Optimization (CS603)' },
    { value: 'CS699', label: 'PROJECT-I (CS699)' },
    { value: 'Cs712', label: 'Topics in AI (Cs712)' },
    { value: 'CY400', label: 'Homogeneous and Heterogeneous Catalysis (CY400)' },
    { value: 'CY401', label: 'Practical - 1 (CY401)' },
    { value: 'CY402', label: 'Practical - 2 (CY402)' },
    { value: 'CY411', label: 'Concise Inorganic Chemistry (CY411)' },
    { value: 'CY412', label: 'Concise Organic Chemistry (CY412)' },
    { value: 'CY414', label: 'An introduction to Biochemistry (CY414)' },
    { value: 'CY415', label: 'Numerical Methods for Chemists (CY415)' },
    { value: 'CY416', label: 'Reaction Rates and Chemical Thermodynamics (CY416)' },
    { value: 'CY417', label: 'Quantum Chemistry and Group Theory (CY417)' },
    { value: 'CY511', label: 'Instrumentation Analysis (CY511)' },
    { value: 'CY513', label: 'Polymer Chemistry (CY513)' },
    { value: 'CY514', label: 'Environmental Chemistry (CY514)' },
    { value: 'CY515', label: 'Bio-organic Chemistry (CY515)' },
    { value: 'CY516', label: 'Elementary Principles of Equilibrium Statistical Mechanics and Stochastic Processes (CY516)' },
    { value: 'CY699', label: 'Project-I (CY699)' },
    { value: 'ED502', label: 'Learning theory, pedagogy and assessment in engineering education (ED502)' },
    { value: 'EE201', label: 'Signals and Systems (EE201)' },
    { value: 'EE203', label: 'Digital Circuits (EE203)' },
    { value: 'EE204', label: 'Digital Circuits Lab (EE204)' },
    { value: 'EE205', label: 'Electromechanics (EE205)' },
    { value: 'EE208', label: 'CONTROL ENGINEERING LAB (EE208)' },
    { value: 'EE301', label: 'Analog Circuits (EE301)' },
    { value: 'EE302', label: 'Analog Circuits Lab (EE302)' },
    { value: 'EE303', label: 'Communication Engineering (EE303)' },
    { value: 'EE305', label: 'Microprocessor and Microcontroller (EE305)' },
    { value: 'EE306', label: 'Microprocessor and Microcontroller Lab (EE306)' },
    { value: 'EE401', label: 'Electromagnetic Theory (EE401)' },
    { value: 'EE402', label: 'Power Electronics (EE402)' },
    { value: 'EE403', label: 'Power Electronics Lab (EE403)' },
    { value: 'EE404', label: 'Electric Machines (EE404)' },
    { value: 'EE405', label: 'Electric Machines Lab (EE405)' },
    { value: 'EE406', label: 'Power Systems (EE406)' },
    { value: 'EE407', label: 'Power Systems Lab (EE407)' },
    { value: 'EE608', label: 'ADVANCED CONTROL DESIGN TECHNIQUES FOR POWER CONVERTERS (EE608)' },
    { value: 'EE629', label: 'SPECIAL TOPICS IN COMMUNICATION (EE629)' },
    { value: 'EE699', label: 'PROJECT-I (EE699)' },
    { value: 'GE107', label: 'Tinkering Lab (GE107)' },
    { value: 'GE108', label: 'Basic Electronics (GE108)' },
    { value: 'GE109', label: 'Introduction to Engineering Products (GE109)' },
    { value: 'GE111', label: 'Introduction to Environmental Science & Engineering (GE111)' },
    { value: 'GE201', label: 'Introduction to Materials Science and Engg. (GE201)' },
    { value: 'GE203', label: 'Material Science for Civil Engineers (GE203)' },
    { value: 'HS414', label: 'Chinese A2 (HS414)' },
    { value: 'HS104', label: 'Professional Ethics (HS104)' },
    { value: 'HS201', label: 'Economics (HS201)' },
    { value: 'HS202', label: 'HUMAN GEOGRAPHY AND SOCIAL NEEDS (HS202)' },
    { value: 'HS301', label: 'Industrial Management (HS301)' },
    { value: 'HS405', label: 'Chinese Level 1 (A1) (HS405)' },
    { value: 'HS406', label: 'Managerial Science (HS406)' },
    { value: 'HS485', label: 'Psychology at Workplace (HS485)' },
    { value: 'HS505', label: 'Sound Patterns in Human Language (HS505)' },
    { value: 'HS506', label: 'Brain and Language (HS506)' },
    { value: 'HS513', label: 'Science of Happiness (HS513)' },
    { value: 'II301', label: 'Industrial Internship and Comprehensive Viva (II301)' },
    { value: 'II302', label: 'Additional Internship (II302)' },
    { value: 'MA201', label: 'Differential Equations (MA201)' },
    { value: 'MA301', label: 'Computational Algebra (MA301)' },
    { value: 'MA411', label: 'Real Analysis (MA411)' },
    { value: 'MA412', label: 'LINEAR ALGEBRA (MA412)' },
    { value: 'MA413', label: 'COMPUTER PROGRAMMING (MA413)' },
    { value: 'MA414', label: 'ORDINARY DIFFERENTIAL EQUATION (MA414)' },
    { value: 'MA415', label: 'ALGEBRA (MA415)' },
    { value: 'MA511', label: 'FUNCTIONAL ANALYSIS (MA511)' },
    { value: 'MA512', label: 'MATHEMATICAL METHODS (MA512)' },
    { value: 'MA513', label: 'OPTIMIZATION TECHNIQUES (MA513)' },
    { value: 'MA514', label: 'ANALYSIS & DESIGN OF ALGORITHMS (MA514)' },
    { value: 'MA515', label: 'Foundations of Data Science (MA515)' },
    { value: 'MA617', label: 'Graph Theory (MA617)' },
    { value: 'MA630', label: 'Introduction to Applied Statistical Methods (MA630)' },
    { value: 'MA718', label: 'Evolutionary Game Theory (MA718)' },
    { value: 'ME206', label: 'Manufacturing Technology-I (ME206)' },
    { value: 'ME303', label: 'Thermo-Fluids Lab-I (ME303)' },
    { value: 'ME102', label: 'Engineering Thermodynamics (ME102)' },
    { value: 'ME201', label: 'Solid Mechanics (ME201)' },
    { value: 'ME202', label: 'Machine Drawing (ME202)' },
    { value: 'ME207', label: 'Manufacturing Lab-I (ME207)' },
    { value: 'ME301', label: 'Vibrations and Control (ME301)' },
    { value: 'ME302', label: 'Heat and Mass Transfer (ME302)' },
    { value: 'ME501', label: 'Mathematics for Engineers (ME501)' },
    { value: 'ME502', label: 'Applied Numerical Methods (Core-2) (ME502)' },
    { value: 'ME503', label: 'Measurements and Instrumentation (ME503)' },
    { value: 'ME506', label: 'Non Linear FEM (ME506)' },
    { value: 'ME507', label: 'Fundamentals and Modeling of Turbulent Flows (ME507)' },
    { value: 'ME508', label: 'Wave Propagation (ME508)' },
    { value: 'ME517', label: 'Advanced Solid Mechanics (ME517)' },
    { value: 'ME518', label: 'Multibody Dynamics (ME518)' },
    { value: 'ME547', label: 'Analysis of Material Removal Processes (ME547)' },
    { value: 'ME548', label: 'Analysis of Casting, Forming and Joining Processes (ME548)' },
    { value: 'ME549', label: 'Additive Manufacturing (ME549)' },
    { value: 'ME571', label: 'Advanced Fluid Mechanics (ME571)' },
    { value: 'ME579', label: 'Advanced Thermodynamics (ME579)' },
    { value: 'ME699', label: 'PROJECT-I (ME699)' },
    { value: 'MM201', label: 'Metallurgical Thermodynamics and Kinetics (MM201)' },
    { value: 'MM203', label: 'Materials Characterization Techniques (MM203)' },
    { value: 'MM204', label: 'Materials Characterization Techniques Lab (MM204)' },
    { value: 'MM205', label: 'Physical Metallurgy Lab (MM205)' },
    { value: 'MM221', label: 'Introduction to Materials Modeling Lab (MM221)' },
    { value: 'MM301', label: 'Iron and Steel Making (MM301)' },
    { value: 'MM302', label: 'Mechanical Behaviour and Testing of Materials (MM302)' },
    { value: 'MM303', label: 'Materials Processing (MM303)' },
    { value: 'MM304', label: 'Mechanical Behaviour and Testing lab (MM304)' },
    { value: 'MM305', label: 'Materials Processing Lab (MM305)' },
    { value: 'MM321', label: 'Mesoscale Modeling Lab (MM321)' },
    { value: 'MM404', label: 'Advanced Mechanics of Materials (MM404)' },
    { value: 'MM551', label: 'Mathematical and Experimental Methods in Materials Engineering (MM551)' },
    { value: 'MM552', label: 'Thermodynamics and Kinetics of Materials (MM552)' },
    { value: 'MM553', label: 'Physics of Materials (MM553)' },
    { value: 'MM554', label: 'Mechanical Behaviour of Materials (MM554)' },
    { value: 'MM555', label: 'X-Ray Diffraction and Spectroscopic Techniques (MM555)' },
    { value: 'NO103/NS103', label: 'NSO/NSS (NO103/NS103)' },
    { value: 'PH201', label: 'Physics Lab I (PH201)' },
    { value: 'PH202', label: 'Applied Mathematical Physics (PH202)' },
    { value: 'PH203', label: 'Classical Mechanics (PH203)' },
    { value: 'PH204', label: 'Electromagnetic Theory (PH204)' },
    { value: 'PH301', label: 'THERMAL AND STATISTICAL PHYSICS (PH301)'},
    { value: 'PH511', label: 'MODERN OPTICS (PH511)' },
    { value: 'PH512', label: 'STATISTICAL MECHANICS (PH512)' },
    { value: 'PH513', label: 'NUMERICAL METHODS AND PROGRAMMING (PH513)' },
    { value: 'PH552', label: 'PHYSICS AND APPLICATION OF NANOMATERIALS (PH552)' },
    { value: 'PH614', label: 'Laser Physics (PH614)' },
    { value: 'PH699', label: 'M.SC. PROJECT-I (PH699)' }
];

function App() {
  const [email, setEmail] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/submit', {
        email,
        courseCodes: selectedCourses.map(course => course.value).join(',')
      });
      alert(response.data);
    } catch (error) {
      console.error('There was an error sending the email!', error);
    }
  };

  return (
    <div className="container">
      <h1>Timetable Request Form</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Course Codes:</label>
          <Select
            isMulti
            options={courses}
            value={selectedCourses}
            onChange={setSelectedCourses}
            className="custom-select"
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
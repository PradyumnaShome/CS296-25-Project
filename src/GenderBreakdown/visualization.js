
// Using jQuery, read our data and call visualize(...) only once the page is ready:
$(function () {
    const datasetPath = "datasets/grouped.csv";
    d3.csv(datasetPath).then(function (data) {
        // Write the data to the console for debugging:
        console.log("HERE");
        console.log(data);

        // Call our visualize function:
        visualize(data);
    });
});


var visualize = function(data) {
    // Boilerplate:
    var margin = { top: 50, right: 50, bottom: 50, left: 150 },
        width = 960*2 - margin.left - margin.right,
        height = 4500*2 - margin.top - margin.bottom;

    // Visualization Code
    var svg = d3.select("#chart")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .style("width", width + margin.left + margin.right)
                .style("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

    // title
    svg.append("text")
    .attr("x", (width / 2))             
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")  
    .style("font-size", "16px") 
    .style("text-decoration", "italics")  
    .text("UIUC Gender Visualization by Major over Time");

    // Scale Years:
  var yearScale = d3.scaleTime()
                    .domain([new Date(1980, 0, 1, 0), new Date(2018, 0, 1, 2)])
                    .range([0, width]);

    yearScale.ticks(d3.timeYear.every(20));

    // Scale Teams:
    var majorScale = d3.scaleBand()
                    .domain(majors)
                    .range([0, height]);

    // Axis:
    var topAxis = d3.axisTop()
                    .scale( yearScale );

    var leftAxis = d3.axisLeft()
                     .scale( majorScale );

    svg.append("g")
       .call( topAxis );
    
    svg.append("g")
       .call( leftAxis );

    // Visual Encoding:
  svg.selectAll("data")
    .data(data)
    .enter()
    .append("circle")
    .attr("r", function (d, i) {
        // percent
        // var percentMale = parseInt(d['Male']) / (parseInt(d['Male']) + parseInt(d['Female']));
        // var adder = 0;
        // // max radius of 10
        // if (percentMale > 0.5) {
        //     adder = 10*(percentMale - 0.5);
        // } else {
        //     adder = 10*(1 - percentMale);
        // }

        // count
        var difference = parseInt(d['Male']) - parseInt(d['Female']);
        // max is 1074
        var adder = Math.min(15, Math.abs(difference) / 50);
        // baselines radius of 3
        return 3 + adder;
    })
    .attr("cx", function (d, i) {
        var time = d['Fall'];
        return yearScale(parseTime(time));
    })
    .attr("cy", function(d, i) {
        var major = d['Major Name'];
        return majorScale(major);
    })
    .attr("fill", function(d, i) {
        if (parseInt(d['Male']) > parseInt(d['Female'])) {
            return 'blue';
        }
        return 'pink';
    })
    .attr("stroke", "black");

};

var parseTime = d3.timeParse("%Y");

majors = [
    'ACES Undeclared',
    'Accountancy',
    'Actuarial Science',
    'Advertising',
    'Aero & Astro Engineering',
    'Aerospace Engineering',
    'African American Studies',
    'African Studies',
    'Agr & Consumer Economics',
    'Agr & Environmental Cmc & Educ',
    'Agr Engineering & Agr Science',
    'Agribusiness, Farm & Financial ',
    'Agric Leadership & Sci Educ',
    'Agricultural & Applied Econ',
    'Agricultural & Biological Engr',
    'Agricultural Communications',
    'Agricultural Economics',
    'Agricultural Education',
    'Agricultural Engineering',
    'Agricultural Production',
    'Agricultural Sciences',
    'Agriculture',
    'Agronomy',
    'Air Systems',
    'American Civilization',
    'Animal Sciences',
    'Anthropology',
    'Application Design',
    'Applied Mathematics',
    'Architectural Studies',
    'Architecture',
    'Art Education',
    'Art Foundation',
    'Art History',
    'Art and Design',
    'Asian American Studies',
    'Asian Studies',
    'Astronomy',
    'Athletic Training',
    'Atmospheric Sciences',
    'Audiology',
    'Aviation Human Factors',
    'Avionics',
    'BIOCH',
    'BUS EDUC',
    'BUS NON-DEGREE',
    'BUSINESS ED ACT',
    'BUSINESS ED MKT',
    'Biochemistry',
    'Bioenergy',
    'Bioengineering',
    'Bioinformatics',
    'Bioinstrumentation',
    'Biology',
    'Biophysics',
    'Biophysics & Computnl Biology',
    'Biophysics & Quant Biology',
    'Bioprocessing and Bioenergy',
    'Broadcast Journalism',
    'Business Administration',
    'Business Administration (MBA)',
    'Business Process Management',
    'CBA NON-DEGREE',
    'CELL & STR BIOL',
    'CER ENGR',
    'CERAMIC ENG',
    'CERAMICS',
    'CFTM-CNSMR&TXTL',
    'CFTM-MKT&PRICE',
    'CHEM E NUS',
    'CMDTY,FD,TXTL M',
    'COM TEACH',
    'CONSM ECON',
    'CORE CURR',
    'CTM-CNSMR&TXTL',
    'CUR INST 2',
    'CUR INST#1',
    'CUR INST#3',
    'Cell and Developmental Biology',
    'Cell and Structural Biology',
    'Chemical Engineering',
    'Chemical Physics',
    'Chemistry',
    'Civil Engineering',
    'Classical Philology',
    'Classics',
    'Communication',
    'Communications',
    'Communications and Media',
    'Community Health',
    'Comparative Literature',
    'Computer Engineering',
    'Computer Sci & Anthropology',
    'Computer Sci & Astronomy',
    'Computer Sci & Chemistry',
    'Computer Sci & Linguistics',
    'Computer Science',
    'Computer Science & Economics',
    'Computer Science and Music',
    'Computer Science&Crop Sciences',
    'Consumer and Textile Marketing',
    'Crafts',
    'Creative Writing',
    'Crop Sciences',
    'Curric Unassigned',
    'Curriculum and Instruction',
    'DAIRY SCI',
    'DIETETICS',
    'Dance',
    'E Asian Languages & Cultures',
    'ED POL ST',
    'ED SEC&CON',
    'EDUC ELEMENTARY',
    'EDUC GEN',
    'EDUC IDISC',
    'ENGR MECH',
    'ENGR NONDEGREE',
    'ENGR PHYS',
    'ENV ENGR',
    'ENV SCI',
    'EXT EDUC',
    'Early Childhood Education',
    'Earth Systems, Env, & Society ',
    'Earth, Soc, Env Sustainability ',
    'Earth, Society, & Environment ',
    'East Asian Studies',
    'Ecol, Evol, Conservation Biol ',
    'Ecology, Ethology, & Evolution ',
    'Econometrics & Quant Econ',
    'Economics',
    'Ed Organization and Leadership',
    'Educ Policy, Orgzn & Leadrshp ',
    'Educ Voc Tech',
    'Education',
    'Education Curriculum Uassign',
    'Education General',
    'Educational Policy Studies',
    'Educational Psychology',
    'Electrical & Computer Engr',
    'Electrical Engineering',
    'Elementary Education',
    'Engineering',
    'Engineering Mechanics',
    'Engineering Physics',
    'Engineering Undeclared',
    'Engineering Undesignated',
    'English',
    'Entomology',
    'Environ Engr in Civil Engr',
    'Environ Science in Civil Engr',
    'European Union Studies',
    'Executive MBA Program',
    'FAM&CON EC',
    'Finance',
    'Financial Engineering',
    'Food Science & Human Nutrition',
    'Forestry',
    'French',
    'GEN AGR',
    'GEN AGRIC',
    'GEN CURR',
    'GEN ENGR',
    'GEN H ECON',
    "Gender and Women's Studies",
    'General Curriculum',
    'General Engineering',
    'Genetics',
    'Geography',
    'Geography & Geographic Info Sc',
    'Geology',
    'German',
    'Germanic Lang & Lit',
    'Germanic Studies',
    'Global Studies',
    'Graphic Design',
    'H DVL-FAM',
    'HDFS',
    'HDFS-CH&AD DEV',
    'HDFS-FS',
    'HEALTH&SAF',
    'HLTH EDUC',
    'HLTH PL AD',
    'HOME EC ED',
    'HOME ECON',
    'HOME MGMT',
    'HORT -- P&M',
    'HORT--HORT SCI',
    'HR & IND RELS',
    'HR&FS',
    'HR&FS A&ID',
    'HR&FS GEN',
    'HU DEV&FAM',
    'Health',
    'Health Communication',
    'History',
    'History of Art',
    'Horticulture',
    'Human & Community Development',
    'Human Development & Family St',
    'Human Dvlpmt & Family Studies',
    'Human Factors',
    'Human Res & Industrial Rels',
    'Human Resource Education',
    'Humanities',
    'INST MGMT',
    'INT DSGN',
    "INT'L MSBA",
    'INTRSRCCNSECON',
    'IRCE-CONS EC&F',
    'IRCE-E&NR MGMT',
    'IRCE-INDCURRIC',
    'IRCE-POL,TRD,DV',
    'Individual Plans of Study',
    'Industrial Agriculture',
    'Industrial Design',
    'Industrial Engineering',
    'Informatics',
    'Information Management',
    'Information Sys & Info Tech',
    'Information Systems',
    'Instrumental Music',
    'Integrative Biology',
    'Interdisciplinary',
    'Interdisciplinary Health Sci',
    'International Studies',
    'Intl, Resource, Consumer Econ ',
    'Italian',
    'Jazz Performance',
    'Journalism',
    'Kinesiology',
    'LAB&IN REL',
    'LAS - Undeclared',
    'LAS TCH MATH',
    'LATIN AMER ST',
    'Landscape Architecture',
    'Latin American Studies',
    'Latina/Latino Studies',
    'Law',
    'Learning and Education Studies',
    'Leisure Studies',
    'Library & Information Science',
    'Linguistics',
    'Lyric Theatre',
    'MANAGEMENT',
    'MARKETING',
    'MATSCI&ENG',
    'MCS INTERNET',
    'METAL ENGR',
    'MKT TEXT&A',
    'MOTOR DEV',
    'MOTOR P&SP',
    'MSPH IN C HLTH',
    'MUS-VOICE',
    'MUSIC(AMS)',
    'MUSIC-COMP',
    'MUSIC-INST',
    'MUSIC-OPEN',
    'Management',
    'Marketing',
    'Materials Science & Engr',
    'Math & Computer Science',
    'Mathematics',
    'Mechanical Agriculture',
    'Mechanical Engineering',
    'Media Studies',
    'Media and Cinema Studies',
    'Medicine - Carle Illinois COM',
    'Microbiology',
    'Middle Grades Education',
    'Molecular & Integrative Physi',
    'Molecular and Cellular Biology',
    'Molecular&Cell Bio-undeclared',
    'Music',
    'Music Composition',
    'Music Education',
    'Music History',
    'Musicology',
    'NRES - SOILS',
    'NRES-BIOL SCI',
    'NRES-ENV S W',
    'NRES-F & W CONS',
    'NRES-SOC SCI',
    'Natural Res & Env Sciences',
    'Natural Resrcs & Environ Sci',
    'Neuroscience',
    'New Media',
    'News-Editorial',
    'Nondegree',
    'Nondegree-CE',
    'Nuclear Engineering',
    'Nuclear, Plasma, Radiolgc Engr ',
    'Nutritional Sciences',
    'ORN HORT',
    'OUTDR REC',
    'Open Studies',
    'Operations Management',
    'PARK & NR MGMT',
    'PERFORM ST',
    'PERSN AREA',
    'PHYS ED',
    'PLANT PATH',
    'PP/AS',
    'PRE-JOURN',
    'PRE-MED',
    'PROG MANAG',
    'PROG SPEC',
    'PUB ADMIN',
    'Painting',
    'Philosophy',
    'Photography',
    'Physics',
    'Plant Biology',
    'Plant Biotechnology',
    'Plant Pathology',
    'Political Science',
    'Portuguese',
    'Pre-Early Chld/Elem Ed/Spec Ed',
    'Pre-Engineering',
    'Professional Pilot',
    'Psychological Science',
    'Psychology',
    'Public Health',
    'REES',
    'REHAB STUDIES',
    'REST MGMT',
    'Recreation, Sport, and Tourism ',
    'Regional Planning',
    'Rehabilitation',
    'Religion',
    'Religious Studies',
    'Rhetoric',
    'Russian & E European Studies',
    'Russian Lang & Literature',
    'Russian, E Eur, Eurasian St ',
    'S Asian & Middle Eastern St',
    'SCH HEALTH',
    'SEC TRAINING',
    'SOC SCI SP',
    'SOCIAL SCI',
    'SOIL SCI',
    'SP CORRECT',
    'STATS-ECON',
    'Sculpture',
    'Secondary & Continuing Educ',
    'Secondary Education',
    'Slavic Languages & Literature',
    'Slavic Studies',
    'Social Work',
    'Sociology',
    'Spanish',
    'Special Education',
    'Speech & Hearing Science',
    'Speech Communication',
    'Statistics',
    'Statistics & Computer Science',
    'Strategic Brand Communication',
    'Supply Chain Management',
    'Systems & Entrepreneurial Engr',
    'Systems Engineering and Design',
    'TCH BIOL',
    'TCH CS',
    'TCH DANCE',
    'TCH ENGL',
    'TCH ENGL IN MN',
    'TCH ENGL OUT MN',
    'TCH GEN SCIENCE',
    'TCH GEOGR',
    'TCH KINES',
    'TCH LIFE SCI',
    'TCH PHY SC',
    'TCH PHYS SCI',
    'TCH PS CHEM',
    'TCH PS PHYSICS',
    'TCH RUSS',
    'TCH SOC ST',
    'TCH SOC ST IN',
    'TCH SOC ST OUT',
    'TCH SPEECH',
    'TEACH CS',
    'TECH ED INDUST',
    'TECH ED LAW ENF',
    'TECH ED SP',
    'TEXT-APPRL',
    'THER REC',
    'TRANSITION',
    'Taxation',
    'Teaching of Biological Science',
    'Teaching of Chemistry',
    'Teaching of Earth Science',
    'Teaching of English Sec Lang',
    'Teaching of French',
    'Teaching of German',
    'Teaching of Latin',
    'Teaching of Mathematics',
    'Teaching of Physics',
    'Teaching of Spanish',
    'Technical Systems Management',
    'Technology Management',
    'Theatre',
    'Theoretical & Applied Mechans',
    'Translation and Interpreting',
    'UG NON-DEG',
    'UNASSIGNED',
    'UNCLASS',
    'UNCM FR&SO',
    'Undeclared',
    'Urban Planning',
    'Urban Studies & Planning',
    'VMS - Comparative Biosciences',
    'VMS - Pathobiology',
    'VMS - Veterinary Biosciences',
    'VMS - Veterinary Pathobiology',
    'VMS-Veterinary Clinical Medcne',
    'VOC H E ED',
    'VP SCHOLARS',
    'Veterinary Medical Science',
    'Veterinary Medicine',
    'Voice',
    'Wood Sciences',
    'XMURAL',
    'Zoology'];

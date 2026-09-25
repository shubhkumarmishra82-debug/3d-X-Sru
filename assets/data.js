/* =========================================================================
   SR UNIVERSITY CAMPUS COMPANION — SHARED DATA
   Edit this file to update facts everywhere (home, tour, locator, chatbot).
   Sourced from publicly available SR University material as of Aug 2026.
   Building positions in `locator3d` are STYLISED/illustrative, not a
   surveyed site plan — swap in real coordinates when you have them.
   ========================================================================= */

const SRU_DATA = {

  university: {
    name: "SR University",
    shortName: "SRU",
    tagline: "Ananthasagar · Hasanparthy · Warangal, Telangana",
    founded: "Roots in SR Engineering College (est. 1980) · elevated to full university status in 2008",
    chancellor: "Sri A. Varada Reddy",
    viceChancellor: "Prof. Deepak Garg",
    accreditation: "NAAC 'A' Grade · NBA Tier-I accredited B.Tech programs (CSE, ECE, EEE, ME, CE) · SIRO recognition (DSIR)",
    ranking: "NIRF Engineering band (~91–98) · Ranked among the top private universities in Telangana",
    campusSize: "150 acres",
    address: "SR University, Ananthasagar, Hasanparthy, Warangal Urban – 506371, Telangana, India",
    coords: "17.98° N, 79.58° E (approx.)",
    highway: "On the Warangal–Karimnagar National Highway, ~15 km from Warangal city centre",
    phones: ["0870 281 8333", "0870 281 8311"],
    admissionHelpline: ["+91 83310 03030", "+91 83310 04040", "+91 83740 39180"],
    email: "info@sru.edu.in",
    website: "https://sru.edu.in"
  },

  stats: [
    { value: "150", suffix: "acres", label: "Campus" },
    { value: "6",   suffix: "",      label: "Schools" },
    { value: "140+",suffix: "",      label: "Programs" },
    { value: "97",  suffix: "%",     label: "2026 batch placed" },
    { value: "₹51L",suffix: "/yr",   label: "Highest package" },
    { value: "150+",suffix: "",      label: "Recruiters" }
  ],

  schools: [
    {
      name: "School of Computer Science & Artificial Intelligence",
      short: "CS & AI",
      programs: ["B.Tech CSE", "B.Tech CSE (AI & ML)", "B.Tech CSE (Cyber Security)", "B.Tech CSE (Business Systems)"]
    },
    {
      name: "School of Engineering",
      short: "Engineering",
      programs: ["B.Tech ECE", "B.Tech EEE", "B.Tech Civil Engineering", "B.Tech Mechanical Engineering", "M.Tech (Advanced Manufacturing Systems)", "Ph.D. (Mechanical Engineering)"]
    },
    {
      name: "Aastra School of Business",
      short: "Business",
      programs: ["BBA (Finance & Accounting / Marketing / Business Analytics)", "Integrated MBA [3+2]", "MBA", "MBA (Innovation, Entrepreneurship & Venture Development)", "Ph.D. (Management)"]
    },
    {
      name: "School of Agriculture",
      short: "Agriculture",
      programs: ["B.Sc. Agriculture", "M.Sc. Agriculture", "Ph.D. Agriculture"]
    },
    {
      name: "School of Allied Health Sciences",
      short: "Health Sciences",
      programs: ["Allied Health Sciences UG/PG programs"]
    },
    {
      name: "School of Sciences & Humanities",
      short: "Sciences & Humanities",
      programs: ["Ph.D. Mathematics", "Ph.D. Physics", "Ph.D. Chemistry", "Ph.D. Cognitive Science", "Ph.D. Psychology", "Ph.D. English"]
    }
  ],

  facilities: [
    { icon: "hostel", name: "Boys & Girls Hostels", detail: "Separate hostels, AC rooms, Wi-Fi, TV & game rooms, round-the-clock medical access, gym." },
    { icon: "library", name: "Central Library", detail: "Large study halls, digital access, and a wide collection across every discipline on campus." },
    { icon: "lab", name: "Departmental Labs", detail: "Discipline-specific labs kept current with industry-grade tools and software." },
    { icon: "incubator", name: "SRiX Technology Business Incubator", detail: "~1,00,000 sq ft incubator — one of the largest in a Tier-2 Indian city, supporting 40+ startups in AI/ML, IoT, AR/VR, agri-tech and cleantech." },
    { icon: "sports", name: "Sports Complex", detail: "Grounds and courts for outdoor and indoor sports, plus a campus gym." },
    { icon: "medical", name: "Health Centre", detail: "On-campus first-aid and medical support for students and staff." },
    { icon: "cafeteria", name: "Cafeteria & Food Court", detail: "Multiple food options serving the whole campus community." },
    { icon: "wifi", name: "Campus-wide Wi-Fi", detail: "High-speed connectivity across academic blocks and hostels." }
  ],

  placements: {
    summary: "97% of the 2026 batch placed, with 150+ recruiters visiting campus and 1,300+ offers made.",
    highest: "₹51 LPA",
    average: "₹6.5 LPA",
    topStipend: "₹1.10 lakh/month (internships)",
    recruiters: ["Amazon", "Cisco", "IBM", "PwC", "Synopsys", "S&P Global", "Accenture", "Infosys", "Wipro", "TCS", "Cognizant", "HCL", "Tech Mahindra"]
  },

  /* ---------------------------------------------------------------------
     Buildings — used by the Tour page, the 3D Locator, AND the Live
     Navigate panel on the Locator page.
     grid:    stylised (x, z) position for the 3D scene, in grid units.
     coords:  approximate real-world { lat, lng } for each block, derived
              from the grid position — used for live "walk this way"
              directions and the "Open in Google Maps" link. These are
              illustrative estimates (not surveyed), same as the layout.
     aliases: alternate names people might type/search for this place
              (e.g. "mess" finds the Cafeteria) — used by the Navigate
              search box.
     color:   base colour of the 3D block.
     --------------------------------------------------------------------- */
  buildings: [
    {
      id: "gate",
      name: "Main Gate & Admin Block",
      zone: "Admin",
      icon: "admin",
      grid: { x: 0, z: -9 },
      coords: { lat: 17.982587, lng: 79.580000 },
      aliases: ["main gate", "gate", "entrance", "admin block", "admin office", "admissions", "registrar"],
      size: { w: 3.2, h: 2.4, d: 1.8 },
      color: "#7a1f2b",
      blurb: "Entry point to campus and home to admissions, registrar and administrative offices.",
      facilities: ["Admissions desk", "Registrar office", "Visitor pass counter"]
    },
    {
      id: "library",
      name: "Central Library",
      zone: "Academics",
      icon: "library",
      grid: { x: 0, z: -3.5 },
      coords: { lat: 17.981006, lng: 79.580000 },
      aliases: ["library", "reading hall", "book library", "study hall"],
      size: { w: 3.6, h: 3.2, d: 2.6 },
      color: "#c99a3e",
      blurb: "The university's main library — quiet study halls, digital resources and reading rooms shared by every school.",
      facilities: ["Reading halls", "Digital library", "Group study rooms"]
    },
    {
      id: "csai",
      name: "School of Computer Science & AI",
      zone: "Academics",
      icon: "lab",
      grid: { x: -4.5, z: 1 },
      coords: { lat: 17.979713, lng: 79.578640 },
      aliases: ["cse block", "computer science block", "ai block", "cs and ai", "cse department"],
      size: { w: 3.4, h: 4.2, d: 2.8 },
      color: "#2f5d62",
      blurb: "Home to CSE, AI & ML, Cyber Security and Business Systems programs, with dedicated computing and AI labs.",
      facilities: ["AI/ML labs", "Cyber security lab", "Cloud computing lab"]
    },
    {
      id: "engineering",
      name: "School of Engineering",
      zone: "Academics",
      icon: "lab",
      grid: { x: 4.5, z: 1 },
      coords: { lat: 17.979713, lng: 79.581360 },
      aliases: ["engineering block", "ece block", "eee block", "mechanical block", "civil block", "core engineering"],
      size: { w: 3.4, h: 3.8, d: 2.8 },
      color: "#3a5a8c",
      blurb: "ECE, EEE, Civil and Mechanical Engineering departments with workshops and core engineering labs.",
      facilities: ["Core workshops", "Electronics labs", "Manufacturing lab"]
    },
    {
      id: "business",
      name: "Aastra School of Business",
      zone: "Academics",
      icon: "business",
      grid: { x: -4.5, z: 5.5 },
      coords: { lat: 17.978419, lng: 79.578640 },
      aliases: ["business school", "mba block", "bba block", "aastra", "management block"],
      size: { w: 3.0, h: 3.0, d: 2.4 },
      color: "#8c4a2f",
      blurb: "BBA, MBA and Integrated MBA programs, with case-study rooms and an entrepreneurship-development focus.",
      facilities: ["Case-study rooms", "Finance lab", "Seminar hall"]
    },
    {
      id: "agriculture",
      name: "School of Agriculture",
      zone: "Academics",
      icon: "agriculture",
      grid: { x: 4.5, z: 5.5 },
      coords: { lat: 17.978419, lng: 79.581360 },
      aliases: ["agriculture block", "agri block", "farm", "agri school"],
      size: { w: 3.0, h: 2.6, d: 2.4 },
      color: "#4c7a3a",
      blurb: "B.Sc./M.Sc. Agriculture programs with access to campus farmland and research plots.",
      facilities: ["Agri research plots", "Soil & seed labs"]
    },
    {
      id: "health",
      name: "School of Allied Health Sciences",
      zone: "Academics",
      icon: "health",
      grid: { x: 0, z: 5.5 },
      size: { w: 2.8, h: 3.0, d: 2.4 },
      coords: { lat: 17.978419, lng: 79.580000 },
      aliases: ["health sciences block", "health block", "nursing block", "allied health"],
      color: "#a33c5a",
      blurb: "One of SRU's newer schools, offering allied health science programs alongside campus health facilities.",
      facilities: ["Simulation labs", "Health sciences classrooms"]
    },
    {
      id: "srix",
      name: "SRiX — Technology Business Incubator",
      zone: "Innovation",
      icon: "incubator",
      grid: { x: -9, z: 1 },
      coords: { lat: 17.979713, lng: 79.577280 },
      aliases: ["incubator", "startup block", "tbi", "srix block"],
      size: { w: 3.2, h: 2.8, d: 2.6 },
      color: "#c9762f",
      blurb: "A ~1,00,000 sq ft incubator — among the largest in a Tier-2 Indian city — supporting startups across AI, IoT, AR/VR and agri-tech.",
      facilities: ["Startup workspaces", "Mentoring rooms", "Demo lab"]
    },
    {
      id: "hostel_boys",
      name: "Boys Hostel",
      zone: "Residential",
      icon: "hostel",
      grid: { x: 9, z: -4.5 },
      coords: { lat: 17.981294, lng: 79.582720 },
      aliases: ["boys hostel", "mens hostel", "boys accommodation"],
      size: { w: 3.2, h: 3.6, d: 2.4 },
      color: "#4a5a7a",
      blurb: "AC rooms, Wi-Fi, TV and games rooms, gym access and round-the-clock medical support.",
      facilities: ["AC rooms", "Gym", "Games room"]
    },
    {
      id: "hostel_girls",
      name: "Girls Hostel",
      zone: "Residential",
      icon: "hostel",
      grid: { x: 9, z: -9 },
      coords: { lat: 17.982587, lng: 79.582720 },
      aliases: ["girls hostel", "womens hostel", "ladies hostel", "girls accommodation"],
      size: { w: 3.2, h: 3.6, d: 2.4 },
      color: "#7a4a6a",
      blurb: "AC rooms, Wi-Fi, TV and games rooms, gym access and round-the-clock medical support.",
      facilities: ["AC rooms", "Gym", "Games room"]
    },
    {
      id: "sports",
      name: "Sports Complex & Grounds",
      zone: "Recreation",
      icon: "sports",
      grid: { x: -9, z: -5.5 },
      coords: { lat: 17.981581, lng: 79.577280 },
      aliases: ["sports ground", "playground", "stadium", "gym", "sports complex"],
      size: { w: 4.2, h: 1.2, d: 3.4 },
      color: "#3a8c5a",
      blurb: "Outdoor grounds and courts plus an indoor gym for students and staff.",
      facilities: ["Cricket & football ground", "Indoor courts", "Campus gym"]
    },
    {
      id: "cafeteria",
      name: "Cafeteria & Food Court",
      zone: "Recreation",
      icon: "cafeteria",
      grid: { x: 0, z: 1 },
      coords: { lat: 17.979713, lng: 79.580000 },
      aliases: ["mess", "canteen", "food court", "dining hall", "cafeteria"],
      size: { w: 2.6, h: 1.6, d: 2.2 },
      color: "#c9a83e",
      blurb: "The everyday hub between classes — multiple food counters serving the whole campus.",
      facilities: ["Multi-cuisine counters", "Outdoor seating"]
    },
    {
      id: "auditorium",
      name: "Auditorium",
      zone: "Recreation",
      icon: "auditorium",
      grid: { x: 4.5, z: -4.5 },
      coords: { lat: 17.981294, lng: 79.581360 },
      aliases: ["auditorium", "convocation hall", "seminar hall", "main hall"],
      size: { w: 3.4, h: 2.2, d: 2.8 },
      color: "#5a3a7a",
      blurb: "The venue for convocations, fests, guest lectures and large campus gatherings.",
      facilities: ["Main stage & seating", "Green rooms"]
    }
  ],

  /* ---------------------------------------------------------------------
     Rule-based chatbot knowledge base — NO external AI API.
     Each intent has: id, keywords (matched against the user's message),
     and one or more possible responses (picked at random for variety).
     Keep keywords lowercase, single words or short phrases.
     --------------------------------------------------------------------- */
  chatbotIntents: [
    {
      id: "greeting",
      keywords: ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "namaste", "yo"],
      responses: [
        "Hey there! 👋 I'm the SR University campus helper. Ask me about admissions, courses, hostel life, placements, or how to find your way around.",
        "Hello! Welcome to SR University's helper bot. What would you like to know — courses, fees, hostel, or the campus tour?"
      ]
    },
    {
      id: "about",
      keywords: ["about", "what is sru", "what is sr university", "history", "founded", "established", "tell me about the university"],
      responses: [
        "SR University is a private university in Ananthasagar, Hasanparthy, Warangal, Telangana, spread across 150 acres. It grew out of SR Engineering College (established 1980) and was granted full university status in 2008. It's NAAC 'A' Grade accredited and holds NBA Tier-I accreditation across its core B.Tech programs."
      ]
    },
    {
      id: "location",
      keywords: ["location", "address", "where is", "directions", "how to reach", "map", "situated", "campus located"],
      responses: [
        "SR University is located at Ananthasagar, Hasanparthy, Warangal Urban – 506371, Telangana, on the Warangal–Karimnagar National Highway, about 15 km from Warangal city centre. Check the 3D Locator page for a stylised layout of the campus itself!"
      ]
    },
    {
      id: "courses",
      keywords: ["course", "courses", "programs", "program", "branch", "branches", "btech", "b.tech", "degree", "schools", "department", "departments", "streams"],
      responses: [
        "SR University offers 140+ programs across 6 schools: Computer Science & AI, Engineering (ECE/EEE/Civil/Mechanical), Aastra School of Business, Agriculture, Allied Health Sciences, and Sciences & Humanities. Want details on a specific school? Just type its name, e.g. 'computer science' or 'business'."
      ]
    },
    {
      id: "school_cs",
      keywords: ["computer science", "cse", "ai", "artificial intelligence", "machine learning", "cyber security", "cs and ai"],
      responses: [
        "The School of Computer Science & AI offers B.Tech CSE, plus specialisations in AI & ML, Cyber Security, and Business Systems — with dedicated AI, cloud and cyber-security labs."
      ]
    },
    {
      id: "school_engineering",
      keywords: ["ece", "eee", "civil", "mechanical", "electronics", "electrical", "engineering school", "core engineering"],
      responses: [
        "The School of Engineering covers ECE, EEE, Civil Engineering and Mechanical Engineering, plus an M.Tech in Advanced Manufacturing Systems and a Ph.D. in Mechanical Engineering."
      ]
    },
    {
      id: "school_business",
      keywords: ["business", "mba", "bba", "management", "aastra"],
      responses: [
        "Aastra School of Business runs BBA (Finance & Accounting / Marketing / Business Analytics), an Integrated MBA [3+2], a regular MBA, an MBA in Innovation & Entrepreneurship, and a Ph.D. in Management."
      ]
    },
    {
      id: "school_agri",
      keywords: ["agriculture", "agri", "farming", "b.sc agriculture"],
      responses: [
        "The School of Agriculture offers B.Sc. and M.Sc. Agriculture along with a Ph.D. program, with access to campus research plots."
      ]
    },
    {
      id: "school_health",
      keywords: ["health sciences", "allied health", "nursing", "paramedical"],
      responses: [
        "The School of Allied Health Sciences is one of SRU's newer schools, offering allied health programs alongside the campus health centre."
      ]
    },
    {
      id: "fees",
      keywords: ["fee", "fees", "tuition", "cost", "how much", "scholarship", "scholarships"],
      responses: [
        "Fees vary by program — B.Tech tuition is typically in the ₹1.8–2.5 lakh/year range depending on the branch and admission category, with scholarships available for eligible students. For the current fee structure, check sru.edu.in or contact admissions directly."
      ]
    },
    {
      id: "admissions",
      keywords: ["admission", "admissions", "apply", "application", "how to join", "eligibility", "entrance exam"],
      responses: [
        "For admissions, reach the SRU admissions team on the helpline numbers below, or visit sru.edu.in for the current process, eligibility criteria and entrance exam details."
      ]
    },
    {
      id: "hostel",
      keywords: ["hostel", "hostels", "accommodation", "stay", "boys hostel", "girls hostel", "room"],
      responses: [
        "SRU has separate Boys' and Girls' hostels with AC rooms, Wi-Fi, TV and games rooms, a gym, and round-the-clock medical access."
      ]
    },
    {
      id: "library",
      keywords: ["library", "books", "reading room", "study hall"],
      responses: [
        "The Central Library has spacious reading halls, digital resources, and group study rooms open to students across every school."
      ]
    },
    {
      id: "placements",
      keywords: ["placement", "placements", "package", "salary", "job", "jobs", "recruiter", "recruiters", "career"],
      responses: [
        "SRU placed 97% of its 2026 batch, with 150+ recruiters on campus and 1,300+ offers made. The highest package was ₹51 LPA and the average ₹6.5 LPA. Recruiters include Amazon, Cisco, IBM, Accenture, TCS, Infosys, Wipro and more."
      ]
    },
    {
      id: "srix",
      keywords: ["srix", "incubator", "startup", "startups", "innovation", "entrepreneurship", "tbi"],
      responses: [
        "SRiX is SR University's Technology Business Incubator — about 1,00,000 sq ft, one of the largest in a Tier-2 Indian city — supporting startups in AI/ML, IoT, AR/VR, agri-tech and cleantech."
      ]
    },
    {
      id: "accreditation",
      keywords: ["accreditation", "naac", "nba", "ranking", "nirf", "rank", "recognised", "recognized"],
      responses: [
        "SR University holds NAAC 'A' Grade accreditation and NBA Tier-I accreditation for its core B.Tech programs (CSE, ECE, EEE, ME, CE), and features in the NIRF Engineering ranking band."
      ]
    },
    {
      id: "facilities",
      keywords: ["facility", "facilities", "gym", "sports", "cafeteria", "canteen", "food", "wifi", "medical", "hospital", "clinic"],
      responses: [
        "Campus facilities include hostels, a central library, departmental labs, a sports complex and gym, a health centre, cafeteria/food court, and campus-wide Wi-Fi."
      ]
    },
    {
      id: "contact",
      keywords: ["contact", "phone", "number", "call", "email", "reach you", "helpline"],
      responses: [
        "You can reach SR University at 0870 281 8333 / 8311, or the admissions helpline at +91 83310 03030 / 04040 / +91 83740 39180. Email: info@sru.edu.in."
      ]
    },
    {
      id: "tour",
      keywords: ["tour", "explore campus", "show me around", "campus tour", "walkthrough"],
      responses: [
        "Head to the Campus Tour page from the menu above — it walks you through every major block on campus with details on each one."
      ]
    },
    {
      id: "locator",
      keywords: ["3d", "locator", "find building", "where is the", "campus map", "locate"],
      responses: [
        "Try the 3D Locator page — it's an interactive map of campus. Click any building to see what it is and what's inside."
      ]
    },
    {
      id: "thanks",
      keywords: ["thanks", "thank you", "thx", "great", "helpful", "awesome", "cool"],
      responses: [
        "You're welcome! Ask me anything else about SR University.",
        "Glad that helped! Anything else you'd like to know?"
      ]
    },
    {
      id: "bye",
      keywords: ["bye", "goodbye", "see you", "later", "exit"],
      responses: [
        "See you around campus! 🎓",
        "Bye for now — come back anytime you have a question about SRU."
      ]
    }
  ],

  chatbotFallback: [
    "I'm not sure about that one yet — try asking about admissions, courses, fees, hostel, placements, facilities, or contact details.",
    "I didn't quite catch that. You can ask me things like \"what courses are offered\", \"how much are the fees\", or \"where is the hostel\"."
  ],

  chatbotQuickReplies: [
    "What courses are offered?",
    "Tell me about placements",
    "Where is the campus?",
    "Hostel facilities",
    "Contact number",
    "What is SRiX?"
  ]
};

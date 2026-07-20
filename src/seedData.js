export const defaultNews = [
  {
    id: 1,
    title: "MORE THAN 84 UNDERGRADUATE INMATES NATIONWIDE ENROLL IN OPEN UNIVERSITY",
    content: "The Nigerian Correctional Service (NCS) has revealed that over 84 inmates across various command centers, including the Capstone Project, have successfully registered for degree programs at the National Open University of Nigeria (NOUN). This program aims to reform and rehabilitate inmates during their sentences.",
    date: "2026-07-08"
  },
  {
    id: 2,
    title: "MIT 800 CORRECTIONAL facility RECEIVES STATE-OF-THE-ART ICT UPGRADE",
    content: "Under the new e-governance initiative, the MIT 800 prison facility in the Capstone Project has completed the installation of local network infrastructure, laying down 5,500 meters of fiber optic cable. The upgrade will support the new digital Prison Management System and visitor tracking portals.",
    date: "2026-07-05"
  },
  {
    id: 3,
    title: "NEW CONTROLLER GENERAL OF CORRECTIONAL SERVICES VISITS CAPSTONE PROJECT",
    content: "Controller General Paul Audu made an official working visit to the Capstone Project yesterday. During his inspection of the MIT 800 facilities, he commended the command's strict adherence to inmate discipline and welfare guidelines, declaring the Capstone Project a model for other commands.",
    date: "2026-06-29"
  },
  {
    id: 4,
    title: "REMISSION SYSTEM DIGITIZED TO INCENTIVIZE GOOD BEHAVIOR",
    content: "In a bid to reduce jail congestion, the Capstone Project has rolled out a digitized remission calculator. Convicted inmates demonstrating consistent discipline and participating in educational programs will automatically have their remission computed, speeding up lawful releases.",
    date: "2026-06-15"
  }
];

export const defaultPrisoners = [
  {
    id: "MIT-2026-001",
    caseNo: "EN/CR/2025/104",
    surname: "Obaji",
    otherNames: "Chinonso",
    sex: "Male",
    age: 26,
    address: "12 Ogui Road, Capstone Project",
    stateOfOrigin: "Capstone Project",
    lga: "Capstone Project North",
    town: "Capstone Project",
    offence: "Stealing",
    crimeCommitted: "Theft of electronics from a commercial warehouse in Ogui.",
    crimeCode: "ST-02",
    court: "Magistrate Court Capstone Project",
    verdict: "Guilty - Sentenced to 2 Years Imprisonment",
    status: "Convicted",
    cellNo: "Cell 3A",
    arrestDate: "2025-05-10",
    dateConvicted: "2025-06-12",
    sentenceMonths: 24,
    goodBehaviorGrade: "A",
    remissionDays: 60,
    nextOfKin: "Emeka Obaji (Brother) - 08031234567",
    ipo: "Inspector Silas Okafor",
    photo: "", // will fall back to dynamic SVG in UI if empty
    medicalHistory: [
      { date: "2025-08-14", description: "Malaria fever", treatment: "Artemether/Lumefantrine dosage" },
      { date: "2026-02-10", description: "Routine dental checkup", treatment: "Scale and polish" }
    ],
    paroleLogs: [
      { date: "2026-05-01", status: "Reviewed", notes: "Demonstrated excellent conduct, recommended for early release review." }
    ],
    punishments: []
  },
  {
    id: "MIT-2026-002",
    caseNo: "EN/CR/2026/014",
    surname: "Inyama",
    otherNames: "Elizabeth",
    sex: "Female",
    age: 31,
    address: "4B Presidential Road, Independence Layout, Capstone Project",
    stateOfOrigin: "Abia",
    lga: "Umuahia North",
    town: "Umuahia",
    offence: "Forgery",
    crimeCommitted: "Alleged falsification of land registration titles at Capstone Project Ministry of Lands.",
    crimeCode: "FG-09",
    court: "High Court Capstone Project 3",
    verdict: "Awaiting Trial",
    status: "Under Trial",
    cellNo: "Cell 1F (Female)",
    arrestDate: "2026-02-15",
    dateConvicted: null,
    sentenceMonths: null,
    goodBehaviorGrade: "B",
    remissionDays: 0,
    nextOfKin: "Dr. Charles Inyama (Spouse) - 08059876543",
    ipo: "Sgt. Janet Alao",
    photo: "",
    medicalHistory: [
      { date: "2026-03-01", description: "Mild hypertension", treatment: "Prescribed Amlodipine 5mg daily" }
    ],
    paroleLogs: [],
    punishments: []
  },
  {
    id: "MIT-2026-003",
    caseNo: "EN/CR/2024/299",
    surname: "Audu",
    otherNames: "Paul Bashir",
    sex: "Male",
    age: 29,
    address: "88 Agbani Road, Capstone Project",
    stateOfOrigin: "Kogi",
    lga: "Ankpa",
    town: "Ankpa",
    offence: "Assault",
    crimeCommitted: "Grievous bodily harm during a street altercation in Agbani.",
    crimeCode: "AS-05",
    court: "High Court Capstone Project 1",
    verdict: "Guilty - Sentenced to 3 Years Imprisonment",
    status: "Convicted",
    cellNo: "Cell 4C",
    arrestDate: "2024-09-02",
    dateConvicted: "2024-10-15",
    sentenceMonths: 36,
    goodBehaviorGrade: "A+",
    remissionDays: 95,
    nextOfKin: "Aisha Audu (Mother) - 08123456789",
    ipo: "Inspector Silas Okafor",
    photo: "",
    medicalHistory: [
      { date: "2024-12-05", description: "Sutures removal from left hand", treatment: "Dressing and antibiotics" }
    ],
    paroleLogs: [
      { date: "2025-10-15", status: "Approved", notes: "Parole application approved for transition programs." }
    ],
    punishments: [
      { date: "2025-01-20", offense: "Disobedience to cell warden", punishment: "Solitary confinement for 3 days" }
    ]
  },
  {
    id: "MIT-2026-004",
    caseNo: "EN/CR/2026/089",
    surname: "Okonkwo",
    otherNames: "Ugochukwu",
    sex: "Male",
    age: 38,
    address: "5 Nike Lake Road, Abakpa, Capstone Project",
    stateOfOrigin: "Anambra",
    lga: "Nnewi North",
    town: "Nnewi",
    offence: "Armed Robbery",
    crimeCommitted: "Armed burglary and conspiracy at a commercial bank branch.",
    crimeCode: "AR-12",
    court: "Federal High Court Capstone Project",
    verdict: "Awaiting Trial",
    status: "Under Trial",
    cellNo: "Cell 8B (High Security)",
    arrestDate: "2026-05-20",
    dateConvicted: null,
    sentenceMonths: null,
    goodBehaviorGrade: "C",
    remissionDays: 0,
    nextOfKin: "Ngozi Okonkwo (Wife) - 07044433322",
    ipo: "Sgt. Peter Udo",
    photo: "",
    medicalHistory: [],
    paroleLogs: [],
    punishments: []
  }
];

export const defaultVisitors = [
  {
    id: "VIS-901",
    visitorName: "Chinedu Obaji",
    visitorPhone: "08039988776",
    visitorAddress: "14 Nike Road, Capstone Project",
    relationship: "Brother",
    prisonerId: "MIT-2026-001",
    prisonerName: "Obaji Chinonso",
    visitDate: "2026-07-09T14:30:00",
    passCode: "VP-4091-B",
    purpose: "Delivery of personal toiletries and clothes."
  },
  {
    id: "VIS-902",
    visitorName: "Dr. Charles Inyama",
    visitorPhone: "08059876543",
    visitorAddress: "4B Presidential Road, Independence Layout, Capstone Project",
    relationship: "Spouse",
    prisonerId: "MIT-2026-002",
    prisonerName: "Inyama Elizabeth",
    visitDate: "2026-07-10T10:15:00",
    passCode: "VP-8271-X",
    purpose: "Consulting on legal defense and medical prescription."
  }
];

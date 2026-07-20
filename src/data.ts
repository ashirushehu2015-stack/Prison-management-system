import { Inmate, Cell, Guard, Visit, Incident, UserAccount } from "./types";

export const INITIAL_INMATES: Inmate[] = [
  {
    id: "IN-2084",
    name: "Marcus Vance",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    dateOfBirth: "1988-04-12",
    securityLevel: "Medium",
    cellBlock: "Block A",
    cellNumber: "102",
    status: "Incarcerated",
    offenses: ["Grand Theft Auto", "Possession of Stolen Property"],
    admissionDate: "2023-05-14",
    releaseDate: "2028-11-20",
    medicalNotes: "Slight asthma; uses inhaler as-needed. No food allergies.",
    behaviorScore: 82,
    caseNotes: "Marcus has maintained excellent behavior over the last quarter. He is working in the library and participates actively in the restorative justice seminars. Very cooperative with guard staff.",
    medicalInvestigations: [
      {
        id: "INV-8401",
        type: "Pulmonary Function Test",
        requestDate: "2026-06-15",
        status: "Completed",
        notes: "Evaluate mild exercise-induced asthma severity.",
        results: "Mild airway obstruction. FEV1/FVC ratio within acceptable limits. Continue standard albuterol rescue inhaler.",
        investigator: "Dr. Robert Vance, MD"
      },
      {
        id: "INV-8402",
        type: "Routine Eye Exam",
        requestDate: "2026-07-10",
        status: "Pending",
        notes: "Subject reports slight blurry vision when reading.",
        investigator: "Optometrist Department"
      }
    ],
    medications: [
      {
        id: "MED-101",
        name: "Albuterol Inhaler (Ventolin)",
        dosage: "90 mcg (2 puffs)",
        frequency: "As needed every 4-6 hours",
        startDate: "2023-05-15",
        prescribedBy: "Dr. Robert Vance, MD",
        status: "Active",
        purpose: "Bronchospasm relief / asthma management"
      }
    ]
  },
  {
    id: "IN-1092",
    name: "Derrick 'Razor' Hayes",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    dateOfBirth: "1982-11-03",
    securityLevel: "Maximum",
    cellBlock: "Block C",
    cellNumber: "301",
    status: "Incarcerated",
    offenses: ["Armed Robbery", "Assault with a Deadly Weapon"],
    admissionDate: "2020-02-18",
    releaseDate: "2035-02-15",
    medicalNotes: "Chronic lower back pain. Takes prescription anti-inflammatories.",
    behaviorScore: 45,
    caseNotes: "Derrick remains high-risk. Disciplinary report filed last month following a verbal altercation in the yard. Refuses to attend educational classes, but has recently shown some interest in the culinary training program.",
    medicalInvestigations: [
      {
        id: "INV-9201",
        type: "Lumbar Spine MRI",
        requestDate: "2025-11-04",
        status: "Completed",
        notes: "Symptomatic lower back pain radiating down left thigh.",
        results: "Mild L4-L5 disc protrusion without significant neural canal stenosis. Recommended physical therapy and NSAIDs.",
        investigator: "Dr. Sarah Kim, Neurologist"
      },
      {
        id: "INV-9202",
        type: "Physical Therapy Assessment",
        requestDate: "2026-07-02",
        status: "In Review",
        notes: "Assessment of active core strength and pain thresholds for prison labor release.",
        results: "Subject displays moderate lumbar stiffness. Recommended for 6-week core reinforcement program.",
        investigator: "PT Daniel Craig"
      }
    ],
    medications: [
      {
        id: "MED-201",
        name: "Ibuprofen (Advil)",
        dosage: "400 mg",
        frequency: "Twice daily after meals",
        startDate: "2025-11-10",
        prescribedBy: "Dr. Robert Vance, MD",
        status: "Active",
        purpose: "Chronic lower back pain inflammation"
      },
      {
        id: "MED-202",
        name: "Cyclobenzaprine",
        dosage: "5 mg",
        frequency: "Once nightly before sleep",
        startDate: "2026-03-12",
        endDate: "2026-06-12",
        prescribedBy: "Dr. Robert Vance, MD",
        status: "Discontinued",
        purpose: "Acute lumbar muscle spasm therapy"
      }
    ]
  },
  {
    id: "IN-4451",
    name: "Julian Sterling",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
    dateOfBirth: "1975-09-24",
    securityLevel: "Minimum",
    cellBlock: "Block B",
    cellNumber: "204",
    status: "Incarcerated",
    offenses: ["Embezzlement", "Securities Fraud"],
    admissionDate: "2024-01-10",
    releaseDate: "2027-01-09",
    medicalNotes: "Type 2 Diabetes. Requires daily blood sugar monitoring and insulin shots with dinner.",
    behaviorScore: 95,
    caseNotes: "Extremely quiet and respectful. Julian runs the inmate peer-tutoring math program. Has requested early release consideration based on good behavior. No disciplinary history.",
    medicalInvestigations: [
      {
        id: "INV-5101",
        type: "Comprehensive Metabolic Panel",
        requestDate: "2026-04-12",
        status: "Completed",
        notes: "Quarterly glycemic evaluation and metabolic tracking.",
        results: "HbA1c level is 7.2% (stable). Kidney and liver functions are well within healthy clinical margins.",
        investigator: "Iconic Lab Services"
      }
    ],
    medications: [
      {
        id: "MED-301",
        name: "Insulin Glargine (Lantus)",
        dosage: "12 Units",
        frequency: "Once daily at dinner",
        startDate: "2024-01-11",
        prescribedBy: "Dr. Robert Vance, MD",
        status: "Active",
        purpose: "Type 2 Diabetes long-acting glycemic control"
      },
      {
        id: "MED-302",
        name: "Metformin HCl",
        dosage: "500 mg",
        frequency: "Twice daily with meals",
        startDate: "2024-01-11",
        prescribedBy: "Dr. Robert Vance, MD",
        status: "Active",
        purpose: "Oral glucose-lowering therapy"
      }
    ]
  },
  {
    id: "IN-8830",
    name: "Carlos Mendoza",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop",
    dateOfBirth: "1994-07-29",
    securityLevel: "Medium",
    cellBlock: "Block A",
    cellNumber: "105",
    status: "Incarcerated",
    offenses: ["Burglary", "Conspiracy to Commit Larceny"],
    admissionDate: "2022-09-02",
    releaseDate: "2026-10-15",
    medicalNotes: "Penicillin allergy. Dental examination pending.",
    behaviorScore: 71,
    caseNotes: "Carlos has shown positive progress. He participates in the landscaping crew and has logged 150 hours of vocational garden work. Expressed a desire to transition to a minimum-security block next month.",
    medicalInvestigations: [
      {
        id: "INV-3001",
        type: "Comprehensive Dental Evaluation",
        requestDate: "2026-07-15",
        status: "Pending",
        notes: "Reports mild localized pain in upper-right premolar.",
        investigator: "Dr. Helen Rostova, Dental Officer"
      }
    ],
    medications: []
  },
  {
    id: "IN-5104",
    name: "William Vance",
    avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop",
    dateOfBirth: "1991-03-15",
    securityLevel: "Minimum",
    cellBlock: "Block B",
    cellNumber: "201",
    status: "Released",
    offenses: ["Vandalism", "Reckless Driving"],
    admissionDate: "2024-02-01",
    releaseDate: "2025-02-01",
    medicalNotes: "None.",
    behaviorScore: 89,
    caseNotes: "Successfully served his sentence. Discharged with clean records on February 1st, 2025. Set up with an external parole officer and employment at local logistics yard.",
    medicalInvestigations: [],
    medications: []
  }
];

export const INITIAL_CELLS: Cell[] = [
  // Block A (Medium Security)
  { id: "A-101", block: "Block A", number: "101", capacity: 2, currentOccupants: [], securityLevel: "Medium", status: "Active" },
  { id: "A-102", block: "Block A", number: "102", capacity: 2, currentOccupants: ["IN-2084"], securityLevel: "Medium", status: "Active" },
  { id: "A-103", block: "Block A", number: "103", capacity: 2, currentOccupants: [], securityLevel: "Medium", status: "Maintenance" },
  { id: "A-104", block: "Block A", number: "104", capacity: 2, currentOccupants: [], securityLevel: "Medium", status: "Active" },
  { id: "A-105", block: "Block A", number: "105", capacity: 2, currentOccupants: ["IN-8830"], securityLevel: "Medium", status: "Active" },

  // Block B (Minimum Security)
  { id: "B-201", block: "Block B", number: "201", capacity: 4, currentOccupants: [], securityLevel: "Minimum", status: "Active" },
  { id: "B-202", block: "Block B", number: "202", capacity: 4, currentOccupants: [], securityLevel: "Minimum", status: "Active" },
  { id: "B-203", block: "Block B", number: "203", capacity: 4, currentOccupants: [], securityLevel: "Minimum", status: "Active" },
  { id: "B-204", block: "Block B", number: "204", capacity: 4, currentOccupants: ["IN-4451"], securityLevel: "Minimum", status: "Active" },

  // Block C (Maximum Security)
  { id: "C-301", block: "Block C", number: "301", capacity: 1, currentOccupants: ["IN-1092"], securityLevel: "Maximum", status: "Active" },
  { id: "C-302", block: "Block C", number: "302", capacity: 1, currentOccupants: [], securityLevel: "Maximum", status: "Active" },
  { id: "C-303", block: "Block C", number: "303", capacity: 1, currentOccupants: [], securityLevel: "Maximum", status: "Locked Down" }
];

export const INITIAL_GUARDS: Guard[] = [
  {
    id: "G-492",
    name: "Sgt. Sarah Jenkins",
    badgeNumber: "BADGE-8840",
    rank: "Sergeant",
    shift: "Morning",
    assignedBlock: "Block C",
    status: "Active",
    phone: "+1 (555) 019-2831"
  },
  {
    id: "G-102",
    name: "Officer Robert Chen",
    badgeNumber: "BADGE-1192",
    rank: "Officer",
    shift: "Morning",
    assignedBlock: "Block A",
    status: "Active",
    phone: "+1 (555) 014-9920"
  },
  {
    id: "G-881",
    name: "Lt. James Reynolds",
    badgeNumber: "BADGE-3304",
    rank: "Lieutenant",
    shift: "Swing",
    assignedBlock: "Block B",
    status: "Active",
    phone: "+1 (555) 012-3841"
  },
  {
    id: "G-229",
    name: "Officer Amanda Ross",
    badgeNumber: "BADGE-5521",
    rank: "Officer",
    shift: "Night",
    assignedBlock: "Block A",
    status: "Active",
    phone: "+1 (555) 018-4491"
  },
  {
    id: "G-553",
    name: "Officer Thomas Brady",
    badgeNumber: "BADGE-9022",
    rank: "Officer",
    shift: "Swing",
    assignedBlock: "Block C",
    status: "Active",
    phone: "+1 (555) 011-2092"
  }
];

export const INITIAL_VISITS: Visit[] = [
  {
    id: "V-993",
    inmateId: "IN-2084",
    inmateName: "Marcus Vance",
    visitorName: "Elena Vance",
    relationship: "Spouse",
    visitDate: "2026-07-15",
    startTime: "10:00",
    endTime: "11:30",
    status: "Approved",
    notes: "Visitor approved with standard personal effects check."
  },
  {
    id: "V-204",
    inmateId: "IN-4451",
    inmateName: "Julian Sterling",
    visitorName: "Thomas Sterling",
    relationship: "Son",
    visitDate: "2026-07-12",
    startTime: "14:00",
    endTime: "15:00",
    status: "Completed",
    notes: "Conducted in General Visitor Room. No incidents logged."
  },
  {
    id: "V-881",
    inmateId: "IN-1092",
    inmateName: "Derrick 'Razor' Hayes",
    visitorName: "Frank Hayes",
    relationship: "Brother",
    visitDate: "2026-07-16",
    startTime: "09:00",
    endTime: "10:00",
    status: "Pending",
    notes: "Requires level 3 security supervision due to inmate behavior rating."
  }
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: "INC-3081",
    title: "Verbal Escalation in Yard",
    date: "2026-06-18",
    time: "15:20",
    severity: "Medium",
    location: "Recreation Yard",
    involvedInmateIds: ["IN-1092"],
    reportingGuardId: "G-102",
    description: "Inmate Derrick Hayes entered a heated verbal altercation with another inmate over sports equipment. Refused initially to comply with Officer Chen's command to step back, but complied when Sgt. Jenkins intervened.",
    actionsTaken: "Hayes was escorted back to Block C and restricted from yard privileges for 5 days. Behavioral review scheduled.",
    status: "Closed"
  },
  {
    id: "INC-4402",
    title: "Damaged Lock in Block A Maintenance Cell",
    date: "2026-07-01",
    time: "08:15",
    severity: "Low",
    location: "Block A - Cell 103",
    involvedInmateIds: [],
    reportingGuardId: "G-229",
    description: "Officer Ross discovered that the sliding mechanical lock track on cell A-103 was jamming due to loose structural bolts.",
    actionsTaken: "Cell placed under 'Maintenance' status and structural engineers notified for refitting.",
    status: "Resolved"
  },
  {
    id: "INC-9912",
    title: "Unauthorized Medicine Possession",
    date: "2026-07-10",
    time: "20:30",
    severity: "High",
    location: "Block B Ward",
    involvedInmateIds: ["IN-4451"],
    reportingGuardId: "G-881",
    description: "Routine evening sweep uncovered unauthorized prescription strength sleep aid pills stored inside an envelope under Julian Sterling's mattress. Julian claimed they were misplaced by medical staff during his insulin rounds.",
    actionsTaken: "Pills confiscated. Medical log audited to verify daily inventory count discrepancy. Inmate's case file flagged for behavioral inquiry.",
    status: "Under Investigation"
  }
];

export const INITIAL_USERS: UserAccount[] = [
  {
    id: "U-1",
    username: "admin",
    name: "Warden Chief Administrator",
    role: "Admin",
    email: "admin@corrections.gov",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop",
    lastActive: "Just now",
    status: "Active",
    password: "admin123"
  },
  {
    id: "U-2",
    username: "warden_smith",
    name: "Deputy Warden Smith",
    role: "Warden",
    email: "d.smith@corrections.gov",
    avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop",
    lastActive: "3 mins ago",
    status: "Active",
    password: "warden123"
  },
  {
    id: "U-3",
    username: "officer_jones",
    name: "Ofc. Michael Jones",
    role: "Guard",
    email: "m.jones@corrections.gov",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    lastActive: "15 mins ago",
    status: "Active",
    password: "officer123"
  },
  {
    id: "U-4",
    username: "gate_desk",
    name: "Gate Agent Sarah Lee",
    role: "Visitor Desk",
    email: "s.lee@corrections.gov",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
    lastActive: "2 hours ago",
    status: "Active",
    password: "visitor123"
  },
  {
    id: "U-5",
    username: "dr_carter",
    name: "Dr. Evelyn Carter",
    role: "Medical",
    email: "e.carter@corrections.gov",
    avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop",
    lastActive: "Yesterday",
    status: "Active",
    password: "medical123"
  }
];


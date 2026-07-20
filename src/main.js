import { defaultNews, defaultPrisoners, defaultVisitors } from './seedData.js';

// ==========================================================================
// 1. STATE INITIALIZATION (LocalStorage Synchronized)
// ==========================================================================
let state = {
  prisoners: [],
  visitors: [],
  currentUser: null,
  activeSlideIndex: 0,
  selectedPrisonerForDossier: null,
  biometricScannedCode: null
};

// Facility capacity for occupancy rate
const FACILITY_CAPACITY = 50;

function initDatabase() {
  const localPrisoners = localStorage.getItem('mit_800_prisoners');
  const localVisitors = localStorage.getItem('mit_800_visitors');

  if (localPrisoners) {
    state.prisoners = JSON.parse(localPrisoners);
  } else {
    state.prisoners = [...defaultPrisoners];
    localStorage.setItem('mit_800_prisoners', JSON.stringify(state.prisoners));
  }

  if (localVisitors) {
    state.visitors = JSON.parse(localVisitors);
  } else {
    state.visitors = [...defaultVisitors];
    localStorage.setItem('mit_800_visitors', JSON.stringify(state.visitors));
  }
}

function savePrisonersToStorage() {
  localStorage.setItem('mit_800_prisoners', JSON.stringify(state.prisoners));
}

function saveVisitorsToStorage() {
  localStorage.setItem('mit_800_visitors', JSON.stringify(state.visitors));
}

// ==========================================================================
// 2. DOM INTERACTION HELPER FUNCTIONS
// ==========================================================================
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : '✗'}</span>
    <div>${message}</div>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Navigation & Routing
function navigateToSection(sectionId) {
  document.querySelectorAll('.view-section').forEach(section => {
    section.classList.remove('active');
  });
  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.add('active');
  }
}

function switchDashboardView(viewId) {
  document.querySelectorAll('.dashboard-view').forEach(view => {
    view.style.display = 'none';
    view.classList.remove('active');
  });
  const activeView = document.getElementById(viewId);
  if (activeView) {
    activeView.style.display = 'block';
    activeView.classList.add('active');
  }

  // Update Sidebar Active state
  document.querySelectorAll('.sidebar-item').forEach(item => {
    if (item.getAttribute('data-target') === viewId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Update Header Title dynamically
  const titleMap = {
    'view-overview': { title: 'MIT 800 Dashboard Overview', subtitle: 'Live statistical feed for Enugu Correctional Facility' },
    'view-registration': { title: 'New Prisoner Registration', subtitle: 'Enroll a new inmate profile and records' },
    'view-directory': { title: 'Inmate Directory', subtitle: 'Search, filter, and access comprehensive inmate files' },
    'view-visitors': { title: 'Visitor Management System (VMS)', subtitle: 'Log arrivals, schedule visits, and print gateway passes' },
    'view-reports': { title: 'Reports & Compliance Analytics', subtitle: 'Inspect facility demographics and download NCRB/NHRC reports' },
    'view-transfers': { title: 'Transfers & Releases Management', subtitle: 'Log inter-facility transfers and track upcoming inmate releases' }
  };

  if (titleMap[viewId]) {
    document.getElementById('db-view-title').innerText = titleMap[viewId].title;
    document.getElementById('db-view-subtitle').innerText = titleMap[viewId].subtitle;
  }

  // Hook modules to load data when view switches
  if (viewId === 'view-overview') {
    renderOverviewStats();
  } else if (viewId === 'view-directory') {
    renderDirectory();
  } else if (viewId === 'view-visitors') {
    populatePrisonerDropdown();
    renderVisitorsLog();
  } else if (viewId === 'view-reports') {
    renderSVGCharts();
  } else if (viewId === 'view-transfers') {
    renderTransfersView();
  }
}

// ==========================================================================
// 3. PUBLIC PORTAL FEATURES (Slideshow, Marquee, News Feed)
// ==========================================================================
function initPublicPortal() {
  // Set Date
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('portal-live-date').innerText = new Date().toLocaleDateString('en-US', dateOptions);

  // Load News Ticker Marquee
  const tickerContainer = document.getElementById('marquee-ticker-container');
  tickerContainer.innerHTML = '';
  defaultNews.forEach(item => {
    const li = document.createElement('li');
    li.className = 'ticker-item';
    li.innerText = `🚨 ${item.title}  | `;
    tickerContainer.appendChild(li);
  });

  // Load Side News feed
  const newsContainer = document.getElementById('news-feed-container');
  newsContainer.innerHTML = '';
  defaultNews.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'news-feed-item';
    itemDiv.innerHTML = `
      <h4>${item.title}</h4>
      <span>Published: ${item.date}</span>
    `;
    itemDiv.addEventListener('click', () => {
      alert(`[Official Gazette]\n\n${item.title}\nDate: ${item.date}\n\n${item.content}`);
    });
    newsContainer.appendChild(itemDiv);
  });

  // Slideshow Logic
  const sliderTrack = document.getElementById('slider-track');
  const slidesCount = sliderTrack.children.length;

  function updateSlides() {
    sliderTrack.style.transform = `translateX(-${state.activeSlideIndex * 100}%)`;
  }

  document.getElementById('slider-next').addEventListener('click', () => {
    state.activeSlideIndex = (state.activeSlideIndex + 1) % slidesCount;
    updateSlides();
  });

  document.getElementById('slider-prev').addEventListener('click', () => {
    state.activeSlideIndex = (state.activeSlideIndex - 1 + slidesCount) % slidesCount;
    updateSlides();
  });

  // Auto slide
  setInterval(() => {
    state.activeSlideIndex = (state.activeSlideIndex + 1) % slidesCount;
    updateSlides();
  }, 6000);
}

// ==========================================================================
// 4. USER AUTHENTICATION (Login / Logout)
// ==========================================================================
function handleLogin(e) {
  e.preventDefault();
  const usernameInput = document.getElementById('login-username').value.trim();
  const passwordInput = document.getElementById('login-password').value.trim();

  // Validate Mock credentials
  if (usernameInput === 'admin' && passwordInput === 'admin123') {
    state.currentUser = { name: 'Admin Officer', role: 'Superintendent' };
    
    // Init session details
    document.getElementById('officer-avatar-initials').innerText = 'AD';
    document.getElementById('officer-name-display').innerText = 'Admin Officer';

    showToast('Authentication Successful. Redirecting to MIT 800 Dashboard...');
    setTimeout(() => {
      navigateToSection('dashboard-section');
      switchDashboardView('view-overview');
    }, 1000);
  } else {
    showToast('Invalid Username or Password!', 'error');
  }
}

function handleLogout() {
  state.currentUser = null;
  showToast('Logged out successfully.');
  navigateToSection('public-portal');
  // reset login form inputs
  document.getElementById('login-form').reset();
}

// ==========================================================================
// 5. MIT 800 OVERVIEW PANEL DATA
// ==========================================================================
function renderOverviewStats() {
  const total = state.prisoners.length;
  const convicted = state.prisoners.filter(p => p.status === 'Convicted').length;
  const trial = total - convicted;
  const occupancyRate = ((total / FACILITY_CAPACITY) * 100).toFixed(0);

  // Update counters
  document.getElementById('stat-total-prisoners').innerText = total;
  document.getElementById('stat-convicted-prisoners').innerText = convicted;
  document.getElementById('stat-trial-prisoners').innerText = trial;
  document.getElementById('stat-occupancy-rate').innerText = `${occupancyRate}% (${total}/${FACILITY_CAPACITY})`;

  // Render recent additions (up to 4)
  const recentInmates = [...state.prisoners]
    .sort((a, b) => b.id.localeCompare(a.id))
    .slice(0, 4);

  const tbody = document.getElementById('overview-recent-prisoners-list');
  tbody.innerHTML = '';

  recentInmates.forEach(p => {
    const tr = document.createElement('tr');
    tr.style.cursor = 'pointer';
    tr.addEventListener('click', () => openDossier(p.id));

    tr.innerHTML = `
      <td>
        <div class="table-prisoner-meta">
          <div class="table-photo-placeholder">
            ${p.photo ? `<img src="${p.photo}">` : getDefaultPortraitSVG(p.sex)}
          </div>
          <div>
            <div class="table-name">${p.surname}, ${p.otherNames}</div>
            <div class="table-id-tag">${p.id}</div>
          </div>
        </div>
      </td>
      <td><strong>${p.offence}</strong></td>
      <td>
        <span class="badge ${p.status === 'Convicted' ? 'badge-convicted' : 'badge-trial'}">
          ${p.status}
        </span>
      </td>
      <td>${p.arrestDate}</td>
      <td><span class="badge badge-active">${p.cellNo}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

function getDefaultPortraitSVG(sex) {
  const fillColor = sex === 'Female' ? '#fda4af' : '#cbd5e1';
  return `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" fill="${fillColor}"/>
      <circle cx="12" cy="8" r="4" fill="#64748b"/>
      <path d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20" fill="#64748b"/>
    </svg>
  `;
}

// ==========================================================================
// 6. INMATE REGISTRATION MODULE (Remission & Uploads)
// ==========================================================================
let uploadedPhotoBase64 = "";

function initRegistrationModule() {
  const statusSelect = document.getElementById('reg-status');
  const condFields = document.getElementById('conviction-conditional-fields');

  // Show/Hide Conviction details conditionally
  statusSelect.addEventListener('change', (e) => {
    if (e.target.value === 'Convicted') {
      condFields.style.display = 'block';
      // Make child elements required
      document.getElementById('reg-arrestdate').setAttribute('required', 'true');
      document.getElementById('reg-convictdate').setAttribute('required', 'true');
      document.getElementById('reg-sentence').setAttribute('required', 'true');
      calculateReleaseDate();
    } else {
      condFields.style.display = 'none';
      document.getElementById('reg-arrestdate').removeAttribute('required');
      document.getElementById('reg-convictdate').removeAttribute('required');
      document.getElementById('reg-sentence').removeAttribute('required');
    }
  });

  // Remission change event listeners
  const inputDate = document.getElementById('reg-convictdate');
  const inputSentence = document.getElementById('reg-sentence');
  const inputBehavior = document.getElementById('reg-behavior');

  [inputDate, inputSentence, inputBehavior].forEach(elem => {
    elem.addEventListener('input', calculateReleaseDate);
  });

  // Photo Upload Trigger
  const uploadBtn = document.getElementById('btn-trigger-upload');
  const fileInput = document.getElementById('reg-photo-file');
  const previewContainer = document.getElementById('upload-preview-container');
  const previewImg = document.getElementById('reg-photo-preview');

  uploadBtn.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        uploadedPhotoBase64 = event.target.result;
        previewImg.src = uploadedPhotoBase64;
        previewContainer.style.display = 'block';
        uploadBtn.style.display = 'none';
      };
      reader.readAsDataURL(file);
    }
  });

  // Biometrics scan simulation
  const scannerBtn = document.getElementById('biometric-scanner-btn');
  const scannerStatus = document.getElementById('biometric-scan-status');

  scannerBtn.addEventListener('click', () => {
    if (scannerBtn.classList.contains('scanning')) return;

    scannerBtn.classList.add('scanning');
    scannerStatus.innerText = "Scanning fingerprint...";
    
    setTimeout(() => {
      scannerBtn.classList.remove('scanning');
      const mockHash = "BIO-FPR-" + Math.floor(100000 + Math.random() * 900000);
      document.getElementById('reg-biometrics').value = mockHash;
      scannerStatus.innerHTML = `✓ SCANNED: <code style="color: #10b981;">${mockHash}</code>`;
      scannerStatus.className = "biometric-status scanned";
      showToast("Fingerprint scan captures successfully!");
    }, 2500);
  });

  // Duplicate Check Validation
  const surnameInput = document.getElementById('reg-surname');
  const otherNamesInput = document.getElementById('reg-othernames');
  const duplicateAlert = document.getElementById('registration-duplicate-alert');

  function checkDuplicate() {
    const sName = surnameInput.value.trim().toLowerCase();
    const oNames = otherNamesInput.value.trim().toLowerCase();
    if (sName && oNames) {
      const duplicateExists = state.prisoners.some(p => 
        p.surname.toLowerCase() === sName && p.otherNames.toLowerCase() === oNames
      );
      if (duplicateExists) {
        duplicateAlert.innerHTML = `⚠️ <strong>System Warning:</strong> An inmate named "${surnameInput.value} ${otherNamesInput.value}" is already registered. Please verify identity before proceeding.`;
        duplicateAlert.style.display = 'block';
      } else {
        duplicateAlert.style.display = 'none';
      }
    }
  }

  surnameInput.addEventListener('input', checkDuplicate);
  otherNamesInput.addEventListener('input', checkDuplicate);

  // Form Submit
  const form = document.getElementById('prisoner-registration-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Verification check for biometrics
    const bioCode = document.getElementById('reg-biometrics').value;
    if (!bioCode) {
      showToast("Please capture inmate's fingerprint biometrics first!", "error");
      return;
    }

    // Capture values
    const surname = surnameInput.value.trim();
    const otherNames = otherNamesInput.value.trim();
    const sex = document.getElementById('reg-sex').value;
    const age = parseInt(document.getElementById('reg-age').value);
    const town = document.getElementById('reg-town').value.trim();
    const stateOfOrigin = document.getElementById('reg-state').value.trim();
    const lga = document.getElementById('reg-lga').value.trim();
    const address = document.getElementById('reg-address').value.trim();
    const nextOfKin = document.getElementById('reg-nextofkin').value.trim();

    const caseNo = document.getElementById('reg-caseno').value.trim();
    const crimeCode = document.getElementById('reg-crimecode').value.trim();
    const offence = document.getElementById('reg-offence').value;
    const court = document.getElementById('reg-court').value.trim();
    const crimeCommitted = document.getElementById('reg-crimecommitted').value.trim();
    const status = document.getElementById('reg-status').value;
    const cellNo = document.getElementById('reg-cell').value.trim();
    const ipo = document.getElementById('reg-ipo').value.trim();

    // Sentence variables
    let arrestDate = document.getElementById('reg-arrestdate').value || new Date().toISOString().split('T')[0];
    let dateConvicted = null;
    let sentenceMonths = null;
    let goodBehaviorGrade = "C";
    let remissionDays = 0;

    if (status === 'Convicted') {
      dateConvicted = document.getElementById('reg-convictdate').value;
      sentenceMonths = parseInt(document.getElementById('reg-sentence').value);
      goodBehaviorGrade = document.getElementById('reg-behavior').value;
      remissionDays = calculateRemissionDays(sentenceMonths, goodBehaviorGrade);
    }

    // Generate new MIT ID with zero-padded number
    const nextNum = state.prisoners.length + 1;
    const newId = `MIT-2026-${String(nextNum).padStart(3, '0')}`;

    const newPrisoner = {
      id: newId,
      caseNo, surname, otherNames, sex, age, address, stateOfOrigin, lga, town,
      offence, crimeCommitted, crimeCode, court, 
      verdict: status === 'Convicted' ? `Guilty - Sentenced to ${sentenceMonths} Months` : 'Awaiting Trial',
      status, cellNo, arrestDate, dateConvicted, sentenceMonths,
      goodBehaviorGrade, remissionDays, nextOfKin, ipo,
      photo: uploadedPhotoBase64,
      medicalHistory: [],
      paroleLogs: [],
      punishments: [],
      biometrics: bioCode
    };

    // Save
    state.prisoners.push(newPrisoner);
    savePrisonersToStorage();

    showToast(`Inmate ${surname} ${otherNames} registered successfully with ID ${newId}`);
    
    // Reset Form
    form.reset();
    uploadedPhotoBase64 = "";
    previewContainer.style.display = 'none';
    uploadBtn.style.display = 'block';
    scannerStatus.innerText = "Awaiting Fingerprint Placement";
    scannerStatus.className = "biometric-status";
    document.getElementById('reg-biometrics').value = "";
    duplicateAlert.style.display = 'none';

    // Transition
    switchDashboardView('view-directory');
  });
}

function calculateRemissionDays(months, grade) {
  if (!months) return 0;
  let ratePerMonth = 0;
  if (grade === 'A') ratePerMonth = 2.5;
  else if (grade === 'B') ratePerMonth = 1.5;
  else if (grade === 'D') ratePerMonth = -1.0; // Negative remission (extends sentence)
  
  return Math.round(months * ratePerMonth);
}

function calculateReleaseDate() {
  const dateVal = document.getElementById('reg-convictdate').value;
  const sentenceVal = document.getElementById('reg-sentence').value;
  const behaviorGrade = document.getElementById('reg-behavior').value;

  const display = document.getElementById('reg-calc-releasedate');
  if (!dateVal || !sentenceVal) {
    display.value = "Awaiting parameters...";
    return;
  }

  const convictDate = new Date(dateVal);
  const totalMonths = parseInt(sentenceVal);
  const remissionDays = calculateRemissionDays(totalMonths, behaviorGrade);

  // Approximate release date: Add sentence months then subtract remission days
  let releaseDate = new Date(convictDate);
  releaseDate.setMonth(releaseDate.getMonth() + totalMonths);
  releaseDate.setDate(releaseDate.getDate() - remissionDays);

  display.value = releaseDate.toISOString().split('T')[0];
}

// ==========================================================================
// 7. INMATE DIRECTORY VIEW (Search, Filter, Actions)
// ==========================================================================
function renderDirectory() {
  const searchVal = document.getElementById('dir-search').value.toLowerCase().trim();
  const statusFilter = document.getElementById('dir-filter-status').value;
  const sexFilter = document.getElementById('dir-filter-sex').value;

  const tbody = document.getElementById('directory-prisoners-list');
  tbody.innerHTML = '';

  const filtered = state.prisoners.filter(p => {
    const fullName = `${p.surname} ${p.otherNames}`.toLowerCase();
    const matchesSearch = fullName.includes(searchVal) || 
                          p.id.toLowerCase().includes(searchVal) || 
                          p.caseNo.toLowerCase().includes(searchVal) || 
                          p.offence.toLowerCase().includes(searchVal) || 
                          p.cellNo.toLowerCase().includes(searchVal);
    
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchesSex = sexFilter === 'ALL' || p.sex === sexFilter;

    return matchesSearch && matchesStatus && matchesSex;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">No inmates found matching search filters.</td></tr>`;
    return;
  }

  filtered.forEach(p => {
    // calculate estimated release date for display
    let dispReleaseDate = "Awaiting Trial";
    if (p.status === 'Convicted' && p.dateConvicted && p.sentenceMonths) {
      const convictDate = new Date(p.dateConvicted);
      convictDate.setMonth(convictDate.getMonth() + p.sentenceMonths);
      convictDate.setDate(convictDate.getDate() - (p.remissionDays || 0));
      dispReleaseDate = convictDate.toISOString().split('T')[0];
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div class="table-prisoner-meta" style="cursor: pointer;">
          <div class="table-photo-placeholder">
            ${p.photo ? `<img src="${p.photo}">` : getDefaultPortraitSVG(p.sex)}
          </div>
          <div>
            <div class="table-name">${p.surname}, ${p.otherNames}</div>
            <div class="table-id-tag">${p.id}</div>
          </div>
        </div>
      </td>
      <td><strong>${p.offence}</strong></td>
      <td>
        <span class="badge ${p.status === 'Convicted' ? 'badge-convicted' : 'badge-trial'}">
          ${p.status}
        </span>
      </td>
      <td>${p.status === 'Convicted' ? `${p.sentenceMonths} Months` : 'N/A'}</td>
      <td><span class="badge badge-active">${p.cellNo}</span></td>
      <td><strong>${dispReleaseDate}</strong></td>
      <td class="no-print">
        <div class="action-icon-btns">
          <button class="action-icon-btn btn-view" title="View Dossier">👁️</button>
          <button class="action-icon-btn btn-edit" title="Edit Profile" style="color:var(--crest-gold-dark);">✏️</button>
          <button class="action-icon-btn action-icon-btn-danger btn-delete" title="Delete Profile">🗑️</button>
        </div>
      </td>
    `;

    // Click on profile to open
    tr.querySelector('.table-prisoner-meta').addEventListener('click', () => openDossier(p.id));
    tr.querySelector('.btn-view').addEventListener('click', () => openDossier(p.id));
    tr.querySelector('.btn-edit').addEventListener('click', () => openEditModal(p.id));
    tr.querySelector('.btn-delete').addEventListener('click', () => confirmDeletePrisoner(p.id));

    tbody.appendChild(tr);
  });
}

function confirmDeletePrisoner(prisonerId) {
  const p = state.prisoners.find(x => x.id === prisonerId);
  if (!p) return;

  const conf = confirm(`⚠️ DANGER ZONE: Are you sure you want to permanently delete the profile of inmate "${p.surname}, ${p.otherNames}" (ID: ${p.id})?\n\nThis action cannot be undone.`);
  if (conf) {
    state.prisoners = state.prisoners.filter(x => x.id !== prisonerId);
    savePrisonersToStorage();
    showToast(`Inmate profile ${p.id} successfully deleted.`);
    renderDirectory();
  }
}

// ==========================================================================
// 8B. EDIT INMATE MODAL MODULE
// ==========================================================================
function openEditModal(prisonerId) {
  const p = state.prisoners.find(x => x.id === prisonerId);
  if (!p) return;

  document.getElementById('edit-prisoner-id').value = p.id;
  document.getElementById('edit-surname').value = p.surname;
  document.getElementById('edit-othernames').value = p.otherNames;
  document.getElementById('edit-sex').value = p.sex;
  document.getElementById('edit-age').value = p.age;
  document.getElementById('edit-town').value = p.town;
  document.getElementById('edit-state').value = p.stateOfOrigin;
  document.getElementById('edit-lga').value = p.lga;
  document.getElementById('edit-address').value = p.address;
  document.getElementById('edit-nextofkin').value = p.nextOfKin;
  document.getElementById('edit-caseno').value = p.caseNo;
  document.getElementById('edit-crimecode').value = p.crimeCode;
  document.getElementById('edit-offence').value = p.offence;
  document.getElementById('edit-court').value = p.court;
  document.getElementById('edit-crimecommitted').value = p.crimeCommitted;
  document.getElementById('edit-status').value = p.status;
  document.getElementById('edit-cell').value = p.cellNo;
  document.getElementById('edit-arrestdate').value = p.arrestDate || '';
  document.getElementById('edit-convictdate').value = p.dateConvicted || '';
  document.getElementById('edit-sentence').value = p.sentenceMonths || '';
  document.getElementById('edit-behavior').value = p.goodBehaviorGrade || 'C';
  document.getElementById('edit-ipo').value = p.ipo;

  document.getElementById('edit-inmate-modal').classList.add('active');
}

function closeEditModal() {
  document.getElementById('edit-inmate-modal').classList.remove('active');
}

function handleEditFormSubmit(e) {
  e.preventDefault();
  const pId = document.getElementById('edit-prisoner-id').value;
  const idx = state.prisoners.findIndex(x => x.id === pId);
  if (idx === -1) return;

  const status = document.getElementById('edit-status').value;
  const sentenceMonths = parseInt(document.getElementById('edit-sentence').value) || null;
  const goodBehaviorGrade = document.getElementById('edit-behavior').value;
  const remissionDays = status === 'Convicted' && sentenceMonths ? calculateRemissionDays(sentenceMonths, goodBehaviorGrade) : 0;

  state.prisoners[idx] = {
    ...state.prisoners[idx],
    surname: document.getElementById('edit-surname').value.trim(),
    otherNames: document.getElementById('edit-othernames').value.trim(),
    sex: document.getElementById('edit-sex').value,
    age: parseInt(document.getElementById('edit-age').value),
    town: document.getElementById('edit-town').value.trim(),
    stateOfOrigin: document.getElementById('edit-state').value.trim(),
    lga: document.getElementById('edit-lga').value.trim(),
    address: document.getElementById('edit-address').value.trim(),
    nextOfKin: document.getElementById('edit-nextofkin').value.trim(),
    caseNo: document.getElementById('edit-caseno').value.trim(),
    crimeCode: document.getElementById('edit-crimecode').value.trim(),
    offence: document.getElementById('edit-offence').value,
    court: document.getElementById('edit-court').value.trim(),
    crimeCommitted: document.getElementById('edit-crimecommitted').value.trim(),
    status,
    cellNo: document.getElementById('edit-cell').value.trim(),
    arrestDate: document.getElementById('edit-arrestdate').value,
    dateConvicted: document.getElementById('edit-convictdate').value || null,
    sentenceMonths,
    goodBehaviorGrade,
    remissionDays,
    verdict: status === 'Convicted' ? `Guilty - Sentenced to ${sentenceMonths} Months` : 'Awaiting Trial',
    ipo: document.getElementById('edit-ipo').value.trim()
  };

  savePrisonersToStorage();
  showToast(`Inmate record for ${state.prisoners[idx].surname}, ${state.prisoners[idx].otherNames} updated successfully.`);
  closeEditModal();
  renderDirectory();
}

// ==========================================================================
// 8C. TRANSFERS & RELEASES MODULE
// ==========================================================================
let transferLogs = [];

function initTransfersView() {
  // Load from localStorage
  const storedTransfers = localStorage.getItem('mit_800_transfers');
  if (storedTransfers) {
    transferLogs = JSON.parse(storedTransfers);
  }
}

function renderTransfersView() {
  // Populate inmate dropdown
  const sel = document.getElementById('transfer-inmate-select');
  sel.innerHTML = '<option value="">-- Select Inmate --</option>';
  state.prisoners.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.innerText = `${p.surname}, ${p.otherNames} (${p.id})`;
    sel.appendChild(opt);
  });

  // Show upcoming releases (within 30 days)
  const today = new Date();
  const in30Days = new Date(); in30Days.setDate(today.getDate() + 30);
  const releaseSoon = state.prisoners.filter(p => {
    if (p.status !== 'Convicted' || !p.dateConvicted || !p.sentenceMonths) return false;
    const rd = new Date(p.dateConvicted);
    rd.setMonth(rd.getMonth() + p.sentenceMonths);
    rd.setDate(rd.getDate() - (p.remissionDays || 0));
    return rd >= today && rd <= in30Days;
  });

  const listEl = document.getElementById('upcoming-releases-list');
  if (releaseSoon.length === 0) {
    listEl.innerHTML = `<p style="font-size:0.8rem; color:var(--text-muted);">No scheduled releases in the next 30 days.</p>`;
  } else {
    listEl.innerHTML = releaseSoon.map(p => {
      const rd = new Date(p.dateConvicted);
      rd.setMonth(rd.getMonth() + p.sentenceMonths);
      rd.setDate(rd.getDate() - (p.remissionDays || 0));
      return `<div style="padding:8px 0; border-bottom:1px solid var(--border-color); font-size:0.82rem;">
        <strong>${p.surname}, ${p.otherNames}</strong> <span style="color:var(--text-muted);">${p.id}</span><br>
        <span style="color:var(--primary-green-dark); font-weight:700;">Release: ${rd.toISOString().split('T')[0]}</span>
      </div>`;
    }).join('');
  }

  // Render transfer logs table
  const tbody = document.getElementById('transfer-release-log-body');
  tbody.innerHTML = '';
  if (transferLogs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">No transfer or release records logged.</td></tr>`;
    return;
  }
  [...transferLogs].reverse().forEach(log => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${log.inmateName}</strong><br><span style="font-size:0.75rem; color:var(--text-muted);">${log.inmateId}</span></td>
      <td><span class="badge badge-trial">Transfer</span></td>
      <td>${log.destination}</td>
      <td>${log.reason}</td>
      <td>${log.date}</td>
    `;
    tbody.appendChild(tr);
  });
}


function openDossier(prisonerId) {
  const p = state.prisoners.find(x => x.id === prisonerId);
  if (!p) return;

  state.selectedPrisonerForDossier = p;

  // Fill header details
  const photoContainer = document.getElementById('dossier-photo-container');
  photoContainer.innerHTML = p.photo ? `<img src="${p.photo}">` : getDefaultPortraitSVG(p.sex);
  
  document.getElementById('dossier-fullname').innerText = `${p.surname}, ${p.otherNames}`;
  document.getElementById('dossier-id').innerText = p.id;
  
  const statusContainer = document.getElementById('dossier-status-badge-container');
  statusContainer.innerHTML = `
    <span class="badge ${p.status === 'Convicted' ? 'badge-convicted' : 'badge-trial'}">${p.status}</span>
    <span class="badge badge-active">${p.cellNo}</span>
  `;

  // Fill Demographics
  document.getElementById('dossier-sex').innerText = p.sex;
  document.getElementById('dossier-age').innerText = p.age;
  document.getElementById('dossier-state').innerText = p.stateOfOrigin;
  document.getElementById('dossier-lga').innerText = p.lga;
  document.getElementById('dossier-town').innerText = p.town;
  document.getElementById('dossier-address').innerText = p.address;
  document.getElementById('dossier-nextofkin').innerText = p.nextOfKin;

  // Fill Case info
  document.getElementById('dossier-caseno').innerText = p.caseNo;
  document.getElementById('dossier-crimecode').innerText = p.crimeCode;
  document.getElementById('dossier-offence').innerText = p.offence;
  document.getElementById('dossier-court').innerText = p.court;
  document.getElementById('dossier-verdict').innerText = p.verdict;
  document.getElementById('dossier-cell').innerText = p.cellNo;
  document.getElementById('dossier-arrestdate').innerText = p.arrestDate;
  document.getElementById('dossier-convictdate').innerText = p.dateConvicted || 'N/A';
  document.getElementById('dossier-sentence').innerText = p.sentenceMonths ? `${p.sentenceMonths} Months` : 'N/A';
  document.getElementById('dossier-remission').innerText = p.status === 'Convicted' ? `${p.remissionDays} Days` : 'N/A';
  document.getElementById('dossier-ipo').innerText = p.ipo;

  // Calculate release date
  let releaseDateStr = "Awaiting Trial";
  if (p.status === 'Convicted' && p.dateConvicted && p.sentenceMonths) {
    const convictDate = new Date(p.dateConvicted);
    convictDate.setMonth(convictDate.getMonth() + p.sentenceMonths);
    convictDate.setDate(convictDate.getDate() - (p.remissionDays || 0));
    releaseDateStr = convictDate.toISOString().split('T')[0];
  }
  document.getElementById('dossier-releasedate').innerText = releaseDateStr;

  // Render sub-sections
  renderDossierMedicalLogs();
  renderDossierVisitorLogs();
  renderDossierDisciplinaryLogs();

  // Reset tab selection to Demographics
  document.querySelectorAll('.profile-tab-btn').forEach(btn => {
    if (btn.getAttribute('data-tab') === 'tab-demographics') {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  document.querySelectorAll('.profile-tab-content').forEach(tab => {
    if (tab.id === 'tab-demographics') {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  // Open modal overlay
  document.getElementById('inmate-profile-modal').classList.add('active');
}

function renderDossierMedicalLogs() {
  const p = state.selectedPrisonerForDossier;
  const tbody = document.getElementById('dossier-medical-table-body');
  tbody.innerHTML = '';

  if (!p.medicalHistory || p.medicalHistory.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: var(--text-muted);">No clinical logs recorded.</td></tr>`;
    return;
  }

  p.medicalHistory.forEach(log => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${log.date || new Date().toISOString().split('T')[0]}</td>
      <td><strong>${log.description}</strong></td>
      <td><span class="badge badge-active">${log.treatment}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

function renderDossierVisitorLogs() {
  const p = state.selectedPrisonerForDossier;
  const tbody = document.getElementById('dossier-visitors-table-body');
  tbody.innerHTML = '';

  const matchedVisitors = state.visitors.filter(v => v.prisonerId === p.id);

  if (matchedVisitors.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No recorded visitors for this inmate.</td></tr>`;
    return;
  }

  matchedVisitors.forEach(v => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><code style="font-weight:700; color:var(--primary-green-light);">${v.passCode}</code></td>
      <td><strong>${v.visitorName}</strong><br><span style="font-size:0.75rem; color:var(--text-muted);">${v.visitorPhone}</span></td>
      <td>${v.relationship}</td>
      <td>${v.visitDate.replace('T', ' ')}</td>
      <td>${v.purpose}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderDossierDisciplinaryLogs() {
  const p = state.selectedPrisonerForDossier;
  
  // Fill summaries
  document.getElementById('dossier-conduct-grade').innerText = p.goodBehaviorGrade || 'C';
  document.getElementById('dossier-conduct-punishments').innerText = p.punishments ? p.punishments.length : 0;

  // Render punishments table
  const tbodyPunish = document.getElementById('dossier-conduct-table-body');
  tbodyPunish.innerHTML = '';
  if (!p.punishments || p.punishments.length === 0) {
    tbodyPunish.innerHTML = `<tr><td colspan="3" style="text-align: center; color: var(--text-muted);">No disciplinary infractions logged.</td></tr>`;
  } else {
    p.punishments.forEach(log => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${log.date}</td>
        <td><strong style="color:var(--accent-red);">${log.offense}</strong></td>
        <td><span class="badge badge-convicted">${log.punishment}</span></td>
      `;
      tbodyPunish.appendChild(tr);
    });
  }

  // Render parole review table
  const tbodyParole = document.getElementById('dossier-parole-table-body');
  tbodyParole.innerHTML = '';
  if (!p.paroleLogs || p.paroleLogs.length === 0) {
    tbodyParole.innerHTML = `<tr><td colspan="3" style="text-align: center; color: var(--text-muted);">No parole board reviews logged.</td></tr>`;
  } else {
    p.paroleLogs.forEach(log => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${log.date}</td>
        <td><span class="badge ${log.status === 'Approved' ? 'badge-active' : 'badge-trial'}">${log.status}</span></td>
        <td>${log.notes}</td>
      `;
      tbodyParole.appendChild(tr);
    });
  }
}

// ==========================================================================
// 9. VISITOR MANAGEMENT MODULE (Pass Generator)
// ==========================================================================
function populatePrisonerDropdown() {
  const select = document.getElementById('vms-prisoner-select');
  select.innerHTML = '<option value="">-- Choose Inmate --</option>';
  
  state.prisoners.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.innerText = `${p.surname}, ${p.otherNames} (${p.id} - ${p.cellNo})`;
    select.appendChild(opt);
  });
}

function renderVisitorsLog() {
  const tbody = document.getElementById('vms-arrivals-log');
  tbody.innerHTML = '';

  if (state.visitors.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No visitor entries found.</td></tr>`;
    return;
  }

  // Sort by date descending
  const sortedVisitors = [...state.visitors].sort((a, b) => b.visitDate.localeCompare(a.visitDate));

  sortedVisitors.forEach(v => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><code style="font-weight:700; color:var(--primary-green-dark);">${v.passCode}</code></td>
      <td><strong>${v.visitorName}</strong><br><span style="font-size:0.75rem; color:var(--text-muted);">${v.visitorPhone}</span></td>
      <td>${v.prisonerName}<br><span style="font-size:0.75rem; color:var(--text-muted);">${v.prisonerId}</span></td>
      <td>${v.visitDate.replace('T', ' ')}</td>
      <td>
        <button class="btn btn-outline btn-sm btn-view-pass" style="padding:4px 8px; font-size:0.8rem;">Reprint</button>
      </td>
    `;
    tr.querySelector('.btn-view-pass').addEventListener('click', () => displayVisitorPass(v));
    tbody.appendChild(tr);
  });
}

function displayVisitorPass(visitorObj) {
  // Populate pass elements
  document.getElementById('pass-val-code').innerText = visitorObj.passCode;
  document.getElementById('pass-val-code-footer').innerText = visitorObj.passCode;
  document.getElementById('pass-val-name').innerText = visitorObj.visitorName;
  document.getElementById('pass-val-phone').innerText = visitorObj.visitorPhone;
  document.getElementById('pass-val-address').innerText = visitorObj.visitorAddress;
  document.getElementById('pass-val-prisoner').innerText = `${visitorObj.prisonerName} (${visitorObj.prisonerId})`;
  document.getElementById('pass-val-relation').innerText = visitorObj.relationship;
  document.getElementById('pass-val-purpose').innerText = visitorObj.purpose;
  document.getElementById('pass-val-date').innerText = visitorObj.visitDate.replace('T', ' ');

  // Show Modal
  document.getElementById('visitor-pass-modal').classList.add('active');
}

// ==========================================================================
// 10. STATISTICS & REPORTING MODULE (SVG Charts & Compliance Exports)
// ==========================================================================
function renderSVGCharts() {
  const total = state.prisoners.length;
  if (total === 0) return;

  const convicted = state.prisoners.filter(p => p.status === 'Convicted').length;
  const trial = total - convicted;
  
  const male = state.prisoners.filter(p => p.sex === 'Male').length;
  const female = total - male;

  // A. Sentence Status Donut
  const statusPie = document.getElementById('chart-status-pie');
  const trialPct = (trial / total) * 100;
  const convictedPct = (convicted / total) * 100;
  
  // Donut chart using dasharrays
  statusPie.innerHTML = `
    <svg width="150" height="150" viewBox="0 0 42 42" class="donut">
      <circle class="donut-hole" cx="21" cy="21" r="15.915" fill="#fff"></circle>
      <circle class="donut-ring" cx="21" cy="21" r="15.915" fill="transparent" stroke="#ef4444" stroke-width="4"></circle>
      <circle class="donut-segment" cx="21" cy="21" r="15.915" fill="transparent" stroke="#3b82f6" stroke-width="4"
              stroke-dasharray="${trialPct} ${convictedPct}" stroke-dashoffset="25"></circle>
    </svg>
  `;
  document.getElementById('chart-status-legend').innerHTML = `
    <div class="legend-item"><span class="legend-color" style="background-color:#3b82f6;"></span>Awaiting Trial (${trialPct.toFixed(0)}%)</div>
    <div class="legend-item"><span class="legend-color" style="background-color:#ef4444;"></span>Convicted (${convictedPct.toFixed(0)}%)</div>
  `;

  // B. Gender Donut Chart
  const genderPie = document.getElementById('chart-gender-pie');
  const malePct = (male / total) * 100;
  const femalePct = (female / total) * 100;
  
  genderPie.innerHTML = `
    <svg width="150" height="150" viewBox="0 0 42 42" class="donut">
      <circle class="donut-hole" cx="21" cy="21" r="15.915" fill="#fff"></circle>
      <circle class="donut-ring" cx="21" cy="21" r="15.915" fill="transparent" stroke="#fda4af" stroke-width="4"></circle>
      <circle class="donut-segment" cx="21" cy="21" r="15.915" fill="transparent" stroke="#006633" stroke-width="4"
              stroke-dasharray="${malePct} ${femalePct}" stroke-dashoffset="25"></circle>
    </svg>
  `;
  document.getElementById('chart-gender-legend').innerHTML = `
    <div class="legend-item"><span class="legend-color" style="background-color:#006633;"></span>Male (${malePct.toFixed(0)}%)</div>
    <div class="legend-item"><span class="legend-color" style="background-color:#fda4af;"></span>Female (${femalePct.toFixed(0)}%)</div>
  `;

  // C. Crime categories Bar Chart
  const categories = {};
  state.prisoners.forEach(p => {
    categories[p.offence] = (categories[p.offence] || 0) + 1;
  });

  const barContainer = document.getElementById('chart-crime-bar');
  barContainer.innerHTML = '';

  const maxCount = Math.max(...Object.values(categories), 1);
  const categoriesEntries = Object.entries(categories);

  const barWrapper = document.createElement('div');
  barWrapper.style.display = 'flex';
  barWrapper.style.flexDirection = 'column';
  barWrapper.style.gap = '10px';
  barWrapper.style.width = '100%';

  categoriesEntries.forEach(([offence, count]) => {
    const pct = (count / maxCount) * 100;
    const row = document.createElement('div');
    row.style.fontSize = '0.75rem';
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.gap = '10px';
    row.innerHTML = `
      <div style="width: 80px; text-align: right; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight:700;">${offence}</div>
      <div style="flex: 1; height: 16px; background-color: var(--bg-light); border-radius:4px; overflow:hidden;">
        <div style="width: ${pct}%; height:100%; background-color: var(--primary-green); border-radius:4px; transition: width 0.5s ease-out;"></div>
      </div>
      <div style="width: 15px; font-weight:700;">${count}</div>
    `;
    barWrapper.appendChild(row);
  });

  barContainer.appendChild(barWrapper);
}

function openExportReport(type) {
  const total = state.prisoners.length;
  const convicted = state.prisoners.filter(p => p.status === 'Convicted').length;
  const trial = total - convicted;
  
  const reportDate = new Date().toISOString().split('T')[0];
  document.getElementById('export-report-date').innerText = reportDate;

  const kpisWrapper = document.getElementById('export-report-kpis');
  kpisWrapper.innerHTML = `
    <div style="border: 1px solid #000; padding:10px; text-align:center;">
      <span style="font-size:0.75rem; display:block;">TOTAL POPULATION</span>
      <strong style="font-size:1.5rem;">${total}</strong>
    </div>
    <div style="border: 1px solid #000; padding:10px; text-align:center;">
      <span style="font-size:0.75rem; display:block;">CONVICTED INMATES</span>
      <strong style="font-size:1.5rem;">${convicted}</strong>
    </div>
    <div style="border: 1px solid #000; padding:10px; text-align:center;">
      <span style="font-size:0.75rem; display:block;">AWAITING TRIAL</span>
      <strong style="font-size:1.5rem;">${trial}</strong>
    </div>
    <div style="border: 1px solid #000; padding:10px; text-align:center;">
      <span style="font-size:0.75rem; display:block;">CAPACITY OCCUPANCY</span>
      <strong style="font-size:1.5rem;">${((total/FACILITY_CAPACITY)*100).toFixed(0)}%</strong>
    </div>
  `;

  const tbody = document.getElementById('export-report-table-body');
  tbody.innerHTML = '';
  
  state.prisoners.forEach(p => {
    let dispReleaseDate = "Awaiting Trial";
    if (p.status === 'Convicted' && p.dateConvicted && p.sentenceMonths) {
      const convictDate = new Date(p.dateConvicted);
      convictDate.setMonth(convictDate.getMonth() + p.sentenceMonths);
      convictDate.setDate(convictDate.getDate() - (p.remissionDays || 0));
      dispReleaseDate = convictDate.toISOString().split('T')[0];
    }

    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid #ccc';
    tr.innerHTML = `
      <td style="padding:8px;">${p.id}</td>
      <td style="padding:8px;"><strong>${p.surname}, ${p.otherNames}</strong></td>
      <td style="padding:8px;">${p.offence}</td>
      <td style="padding:8px;">${p.status}</td>
      <td style="padding:8px;">${p.arrestDate}</td>
      <td style="padding:8px;">${p.status === 'Convicted' ? `${p.sentenceMonths} Mos` : 'N/A'}</td>
      <td style="padding:8px;"><strong>${dispReleaseDate}</strong></td>
    `;
    tbody.appendChild(tr);
  });

  if (type === 'ncrb') {
    document.getElementById('export-meta-org').innerText = "NATIONAL CRIME RECORDS BUREAU";
    document.getElementById('export-report-heading').innerText = "OFFICIAL INMATE REGISTRY & CENSUS SHEET";
    document.getElementById('export-report-intro').innerText = "This compliance document presents an audit of all active detainees and convicts housed at the Capstone Project MIT 800 Facility, compiled for review by the National Crime Records Bureau database inspectors.";
  } else {
    document.getElementById('export-meta-org').innerText = "NATIONAL HUMAN RIGHTS COMMISSION";
    document.getElementById('export-report-heading').innerText = "PRISON CONDITIONS & CUSTODIAL CENSUS REPORT";
    document.getElementById('export-report-intro').innerText = "Official custody census details and inmate classifications prepared for the NHRC Human Rights inspectorate. All registered inmates listed below are certified as held under verified judicial warrants.";
  }

  document.getElementById('export-modal').classList.add('active');
}

// ==========================================================================
// 11. GENERAL APP INITIALIZATION & EVENT REGISTER
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initDatabase();
  initPublicPortal();
  initRegistrationModule();
  initTransfersView();

  // Navigation Links
  document.getElementById('nav-login-btn').addEventListener('click', (e) => {
    e.preventDefault();
    navigateToSection('login-section');
  });

  document.getElementById('btn-portal-login').addEventListener('click', () => {
    navigateToSection('login-section');
  });

  document.getElementById('btn-login-back').addEventListener('click', (e) => {
    e.preventDefault();
    navigateToSection('public-portal');
  });

  // Login Form Submission
  document.getElementById('login-form').addEventListener('submit', handleLogin);

  // Logout Actions
  document.getElementById('btn-db-logout').addEventListener('click', handleLogout);

  // Dashboard Sub-Views Routing
  document.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = item.getAttribute('data-target');
      switchDashboardView(targetView);
      // Close sidebar on mobile after navigation
      document.getElementById('dashboard-sidebar').classList.remove('sidebar-open');
      document.getElementById('sidebar-overlay').classList.remove('active');
    });
  });

  // Mobile Sidebar Toggle
  const sidebarToggleBtn = document.getElementById('btn-sidebar-toggle');
  const sidebarEl = document.getElementById('dashboard-sidebar');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  if (sidebarToggleBtn) {
    sidebarToggleBtn.addEventListener('click', () => {
      sidebarEl.classList.toggle('sidebar-open');
      sidebarOverlay.classList.toggle('active');
    });
    sidebarOverlay.addEventListener('click', () => {
      sidebarEl.classList.remove('sidebar-open');
      sidebarOverlay.classList.remove('active');
    });
  }

  // Handle overview triggers to other screens
  document.querySelectorAll('.sidebar-trigger-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      switchDashboardView(target);
    });
  });

  // Realtime live clock inside Dashboard Header
  setInterval(() => {
    const timeEl = document.getElementById('db-live-time');
    if (timeEl) {
      timeEl.innerText = new Date().toLocaleTimeString();
    }
  }, 1000);

  // Inmate Dossier Modal events
  document.getElementById('btn-close-profile-modal').addEventListener('click', () => {
    document.getElementById('inmate-profile-modal').classList.remove('active');
    state.selectedPrisonerForDossier = null;
  });

  // Profile dossier Tab Switching
  document.querySelectorAll('.profile-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      document.querySelectorAll('.profile-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.profile-tab-content').forEach(content => {
        content.classList.toggle('active', content.id === tabId);
      });
    });
  });

  // Add Medical Log dialog toggles
  document.getElementById('btn-add-medical-record').addEventListener('click', () => {
    document.getElementById('dossier-medical-add-form').style.display = 'block';
  });
  document.getElementById('btn-cancel-medical-log').addEventListener('click', () => {
    document.getElementById('dossier-medical-add-form').style.display = 'none';
    document.getElementById('med-description').value = '';
    document.getElementById('med-treatment').value = '';
  });
  document.getElementById('btn-save-medical-log').addEventListener('click', () => {
    const desc = document.getElementById('med-description').value.trim();
    const treatment = document.getElementById('med-treatment').value.trim();
    if (desc && treatment && state.selectedPrisonerForDossier) {
      const pId = state.selectedPrisonerForDossier.id;
      const targetIndex = state.prisoners.findIndex(x => x.id === pId);
      if (targetIndex !== -1) {
        if (!state.prisoners[targetIndex].medicalHistory) state.prisoners[targetIndex].medicalHistory = [];
        state.prisoners[targetIndex].medicalHistory.push({
          date: new Date().toISOString().split('T')[0],
          description: desc,
          treatment
        });
        savePrisonersToStorage();
        state.selectedPrisonerForDossier = state.prisoners[targetIndex];
        renderDossierMedicalLogs();
        showToast("Clinical medical log successfully added.");
        document.getElementById('dossier-medical-add-form').style.display = 'none';
        document.getElementById('med-description').value = '';
        document.getElementById('med-treatment').value = '';
      }
    } else {
      showToast("Please complete description and treatment details first!", "error");
    }
  });

  // Add Conduct infraction dialog toggles
  document.getElementById('btn-add-conduct-record').addEventListener('click', () => {
    document.getElementById('dossier-conduct-add-form').style.display = 'block';
  });
  document.getElementById('btn-cancel-conduct-log').addEventListener('click', () => {
    document.getElementById('dossier-conduct-add-form').style.display = 'none';
    document.getElementById('conduct-offense').value = '';
    document.getElementById('conduct-punishment').value = '';
  });
  document.getElementById('btn-save-conduct-log').addEventListener('click', () => {
    const offense = document.getElementById('conduct-offense').value.trim();
    const punishment = document.getElementById('conduct-punishment').value.trim();
    if (offense && punishment && state.selectedPrisonerForDossier) {
      const pId = state.selectedPrisonerForDossier.id;
      const targetIndex = state.prisoners.findIndex(x => x.id === pId);
      if (targetIndex !== -1) {
        if (!state.prisoners[targetIndex].punishments) state.prisoners[targetIndex].punishments = [];
        state.prisoners[targetIndex].punishments.push({
          date: new Date().toISOString().split('T')[0],
          offense,
          punishment
        });
        savePrisonersToStorage();
        state.selectedPrisonerForDossier = state.prisoners[targetIndex];
        renderDossierDisciplinaryLogs();
        showToast("Disciplinary infraction penalty recorded.");
        document.getElementById('dossier-conduct-add-form').style.display = 'none';
        document.getElementById('conduct-offense').value = '';
        document.getElementById('conduct-punishment').value = '';
      }
    } else {
      showToast("Please provide infraction and sanction details first!", "error");
    }
  });

  // Parole Log dialog toggles
  document.getElementById('btn-add-parole-record').addEventListener('click', () => {
    document.getElementById('dossier-parole-add-form').style.display = 'block';
  });
  document.getElementById('btn-cancel-parole-log').addEventListener('click', () => {
    document.getElementById('dossier-parole-add-form').style.display = 'none';
    document.getElementById('parole-notes').value = '';
  });
  document.getElementById('btn-save-parole-log').addEventListener('click', () => {
    const status = document.getElementById('parole-status').value;
    const notes = document.getElementById('parole-notes').value.trim();
    if (notes && state.selectedPrisonerForDossier) {
      const pId = state.selectedPrisonerForDossier.id;
      const targetIndex = state.prisoners.findIndex(x => x.id === pId);
      if (targetIndex !== -1) {
        if (!state.prisoners[targetIndex].paroleLogs) state.prisoners[targetIndex].paroleLogs = [];
        state.prisoners[targetIndex].paroleLogs.push({
          date: new Date().toISOString().split('T')[0],
          status,
          notes
        });
        savePrisonersToStorage();
        state.selectedPrisonerForDossier = state.prisoners[targetIndex];
        renderDossierDisciplinaryLogs();
        showToast("Parole review successfully logged.");
        document.getElementById('dossier-parole-add-form').style.display = 'none';
        document.getElementById('parole-notes').value = '';
      }
    } else {
      showToast("Please provide parole review notes!", "error");
    }
  });

  // Edit Inmate Modal
  document.getElementById('edit-prisoner-form').addEventListener('submit', handleEditFormSubmit);
  document.getElementById('btn-close-edit-modal').addEventListener('click', closeEditModal);
  document.getElementById('btn-cancel-edit-modal').addEventListener('click', closeEditModal);

  // Transfer Log Form
  document.getElementById('transfer-log-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const inmateId = document.getElementById('transfer-inmate-select').value;
    const destination = document.getElementById('transfer-destination').value.trim();
    const reason = document.getElementById('transfer-reason').value;
    if (!inmateId) { showToast("Please select an inmate for transfer!", "error"); return; }
    const p = state.prisoners.find(x => x.id === inmateId);
    if (!p) return;
    const logEntry = {
      inmateId: p.id,
      inmateName: `${p.surname}, ${p.otherNames}`,
      destination,
      reason,
      date: new Date().toISOString().split('T')[0]
    };
    transferLogs.push(logEntry);
    localStorage.setItem('mit_800_transfers', JSON.stringify(transferLogs));
    showToast(`Transfer of ${p.surname} ${p.otherNames} to ${destination} logged.`);
    document.getElementById('transfer-log-form').reset();
    renderTransfersView();
  });

  // Inmate Search and Filtering Events
  document.getElementById('dir-search').addEventListener('input', renderDirectory);
  document.getElementById('dir-filter-status').addEventListener('change', renderDirectory);
  document.getElementById('dir-filter-sex').addEventListener('change', renderDirectory);

  // Visitor Management booking form
  document.getElementById('visitor-log-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const prisonerId = document.getElementById('vms-prisoner-select').value;
    const visitorName = document.getElementById('vms-visitor-name').value.trim();
    const visitorPhone = document.getElementById('vms-visitor-phone').value.trim();
    const visitorAddress = document.getElementById('vms-visitor-address').value.trim();
    const relationship = document.getElementById('vms-relationship').value.trim();
    const purpose = document.getElementById('vms-purpose').value;

    if (!prisonerId) {
      showToast("Please select the inmate being visited!", "error");
      return;
    }

    const p = state.prisoners.find(x => x.id === prisonerId);
    if (!p) return;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const passCode = `VP-${randomSuffix}-${p.sex === 'Female' ? 'F' : 'M'}`;

    const newVisitorEntry = {
      id: `VIS-${Date.now()}`,
      visitorName, visitorPhone, visitorAddress, relationship,
      prisonerId: p.id,
      prisonerName: `${p.surname} ${p.otherNames}`,
      visitDate: new Date().toISOString().substring(0, 16),
      passCode, purpose
    };

    state.visitors.push(newVisitorEntry);
    saveVisitorsToStorage();

    showToast(`Visitor pass ${passCode} registered! Displaying printable gate slip.`);
    displayVisitorPass(newVisitorEntry);

    document.getElementById('visitor-log-form').reset();
    renderVisitorsLog();
  });

  // Print Pass actions
  document.getElementById('btn-close-visitor-modal').addEventListener('click', () => {
    document.getElementById('visitor-pass-modal').classList.remove('active');
  });
  document.getElementById('btn-dismiss-visitor-modal').addEventListener('click', () => {
    document.getElementById('visitor-pass-modal').classList.remove('active');
  });
  document.getElementById('btn-print-slip-execute').addEventListener('click', () => window.print());

  // Report Export Actions
  document.getElementById('btn-export-ncrb').addEventListener('click', () => openExportReport('ncrb'));
  document.getElementById('btn-export-nhrc').addEventListener('click', () => openExportReport('nhrc'));
  document.getElementById('btn-close-export-modal').addEventListener('click', () => {
    document.getElementById('export-modal').classList.remove('active');
  });
  document.getElementById('btn-dismiss-export-modal').addEventListener('click', () => {
    document.getElementById('export-modal').classList.remove('active');
  });
  document.getElementById('btn-print-report-execute').addEventListener('click', () => window.print());
});

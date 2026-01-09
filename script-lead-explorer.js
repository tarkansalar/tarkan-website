/**
 * ====================================
 * LinkedIn Lead Explorer - JavaScript
 * Version: 1.0
 * Integrated with Tarkan Salar Theme
 * ====================================
 */

// Global State
let allLeads = [];
let filteredLeads = [];
let allHeaders = [];
const imageValidationCache = {};

// DOM Elements
const sheetUrlInput = document.getElementById('sheetUrl');
const loadBtn = document.getElementById('loadBtn');
const csvInput = document.getElementById('csvInput');
const parseCsvBtn = document.getElementById('parseCsvBtn');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const leadsContainer = document.getElementById('leadsContainer');
const noDataState = document.getElementById('noDataState');
const analyticsSection = document.getElementById('analyticsSection');
const searchSection = document.getElementById('searchSection');
const leadModal = document.getElementById('leadModal');
const closeModal = document.getElementById('closeModal');
const modalBody = document.getElementById('modalBody');
const modalTitle = document.getElementById('modalTitle');
const toast = document.getElementById('toast');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');

// Tab Elements
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// ====================================
// 1. TAB SWITCHING
// ====================================
tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const tabId = btn.getAttribute('data-tab');
    
    // Deactivate all tabs
    tabButtons.forEach(b => b.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Activate selected tab
    btn.classList.add('active');
    document.getElementById(tabId).classList.add('active');
  });
});

// ====================================
// 2. DATA LOADING & PARSING
// ====================================

/**
 * Convert Google Sheets URL to CSV export URL
 */
function convertSheetURLtoCSV(url) {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (!match) throw new Error('Invalid Google Sheets URL format');
  const sheetId = match[1];
  return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
}

/**
 * Fetch CSV from Google Sheets with CORS proxy
 */
/**
 * Fetch CSV from Google Sheets with CORS proxy fallback
 */
async function fetchCSVfromSheet(url) {
  const csvUrl = convertSheetURLtoCSV(url);
  
  // List of proxies to try in order
  const proxies = [
    // AllOrigins - usually reliable
    (target) => `https://api.allorigins.win/raw?url=${encodeURIComponent(target)}`,
    // CorsProxy.io - alternative
    (target) => `https://corsproxy.io/?${encodeURIComponent(target)}`,
    // CodeTabs - fallback
    (target) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(target)}`
  ];

  let lastError = null;

  for (const proxyGen of proxies) {
    try {
      const proxyUrl = proxyGen(csvUrl);
      console.log(`Trying proxy: ${proxyUrl}`);
      
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error(`Status ${response.status}`);
      }
      
      const text = await response.text();
      
      // Basic validation: HTML error pages often start with <!DOCTYPE or <html
      // Valid CSV should probably not start with those, unless the content itself is HTML (unlikely for lead data)
      if (text.trim().toLowerCase().startsWith('<!doctype') || 
          text.trim().toLowerCase().startsWith('<html')) {
        throw new Error('Proxy returned HTML error page instead of CSV');
      }

      // If we got here, it looks like valid text
      return text;
      
    } catch (error) {
      console.warn(`Proxy failed: ${error.message}`);
      lastError = error;
      // Continue to next proxy
    }
  }

  // If we exhaust all proxies
  throw new Error('Could not load Google Sheet. Please check your internet connection/that the sheet is public. ' + (lastError ? lastError.message : ''));
}

/**
 * Parse CSV text to array of objects
 * - Supports Multi-line fields
 * - Auto-detects Comma vs Tab delimiters
 * - Normalizes headers to Uppercase
 */
function parseCSVData(csvText) {
  try {
    const text = csvText.trim();
    if (!text) throw new Error('Input is empty');

    // Auto-detect delimiter
    const firstLineEnd = text.indexOf('\n');
    const firstLine = firstLineEnd === -1 ? text : text.substring(0, firstLineEnd);
    const commaCount = (firstLine.match(/,/g) || []).length;
    const tabCount = (firstLine.match(/\t/g) || []).length;
    const delimiter = tabCount > commaCount ? '\t' : ',';
    
    // Parse all rows using state machine
    const rows = parseCSV(text, delimiter);
    
    if (rows.length < 2) throw new Error('CSV must have at least header and one data row');
    
    // Process Headers
    const rawHeaders = rows[0];
    if (!rawHeaders || rawHeaders.length === 0) throw new Error('Could not parse CSV headers');
    
    allHeaders = rawHeaders.map(h => h.trim().toUpperCase());
    
    // Process Data Rows
    const leads = [];
    let skippedCount = 0;
    
    for (let i = 1; i < rows.length; i++) {
        const values = rows[i];
        
        // Skip empty rows (regex parser might leave one at end)
        if (values.length === 0 || (values.length === 1 && values[0] === '')) continue;
        
        const lead = {};
        allHeaders.forEach((header, idx) => {
            lead[header] = values[idx] ? values[idx].trim() : '';
        });
        
        // RELAXED VALIDATION RULES
        const fullName = lead['FULL NAME'];
        const hasName = fullName && fullName.length > 0;
        
        if (hasName) {
            leads.push(lead);
        } else {
            skippedCount++;
        }
    }
    
    if (leads.length === 0) {
        if (skippedCount > 0) {
            throw new Error(`Found ${skippedCount} items, but none had a valid Full Name.`);
        } else {
            throw new Error('No valid data rows found.');
        }
    }
    
    return leads;
  } catch (error) {
    console.error(error);
    throw new Error('CSV parsing error: ' + error.message);
  }
}

/**
 * Robust CSV/TSV Parser using State Machine
 * Handles multi-line quotes and escaped quotes correctly
 */
function parseCSV(text, delimiter) {
    const rows = [];
    let currentRow = [];
    let currentVal = '';
    let insideQuote = false;
    
    // Normalize newlines to \n for easier parsing
    // But be careful not to double-replace if mixed. 
    // Just iterating char by char is safer.
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];
        
        if (char === '"') {
            if (insideQuote && nextChar === '"') {
                currentVal += '"';
                i++; // Skip the 2nd quote of the pair
            } else {
                insideQuote = !insideQuote;
            }
        } else if (char === delimiter && !insideQuote) {
            currentRow.push(currentVal);
            currentVal = '';
        } else if ((char === '\n' || char === '\r') && !insideQuote) {
            // Handle CRLF or just LF or just CR
            if (char === '\r' && nextChar === '\n') {
                i++; // Skip \n
            }
            
            currentRow.push(currentVal);
            rows.push(currentRow);
            currentRow = [];
            currentVal = '';
        } else {
            currentVal += char;
        }
    }
    
    // Push the very last row if it has content
    if (currentRow.length > 0 || currentVal !== '') {
        currentRow.push(currentVal);
        rows.push(currentRow);
    }
    
    return rows;
}

/**
 * Load data from Google Sheets URL
 */
async function handleLoadSheet() {
  const url = sheetUrlInput.value.trim();
  
  if (!url) {
    showError('Please enter a Google Sheets URL');
    return;
  }
  
  try {
    loadBtn.disabled = true;
    loadBtn.textContent = 'Loading...';
    showMessage('loading', 'Fetching your Google Sheet...');
    
    const csvText = await fetchCSVfromSheet(url);
    allLeads = parseCSVData(csvText);
    filteredLeads = [...allLeads];
    
    showSuccess(`Successfully loaded ${allLeads.length} leads!`);
    displayLeads();
    updateAnalytics();
    
    loadBtn.disabled = false;
    loadBtn.textContent = 'Load Data';
  } catch (error) {
    showError(error.message);
    loadBtn.disabled = false;
    loadBtn.textContent = 'Load Data';
  }
}

/**
 * Parse CSV from textarea
 */
function handleParseCSV() {
  const csvText = csvInput.value.trim();
  
  if (!csvText) {
    showError('Please paste CSV data');
    return;
  }
  
  try {
    allLeads = parseCSVData(csvText);
    filteredLeads = [...allLeads];
    
    showSuccess(`Successfully parsed ${allLeads.length} leads!`);
    displayLeads();
    updateAnalytics();
    
    csvInput.value = '';
  } catch (error) {
    showError(error.message);
  }
}

// ====================================
// 3. SEARCH & FILTER
// ====================================

/**
 * Debounce utility for search
 */
function debounce(fn, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Filter leads based on search query
 */
function filterLeads() {
  const query = searchInput.value.toLowerCase();
  
  if (!query) {
    filteredLeads = [...allLeads];
  } else {
    filteredLeads = allLeads.filter(lead => {
      const searchableFields = [
        lead['FULL NAME'],
        lead['EMAIL'],
        lead['POSITION'],
        lead['HEADLINE'],
        lead['LOCATION'],
        lead['COMPANY NAME'],
        lead['COMPANY INDUSTRY'],
        lead['COMPANY LOCATION'],
      ].join(' ').toLowerCase();
      
      return searchableFields.includes(query);
    });
  }
  
  displayLeads();
  updateResultCount();
}

/**
 * Update search result count
 */
function updateResultCount() {
  const count = filteredLeads.length;
  document.getElementById('resultCount').textContent = `${count} result${count !== 1 ? 's' : ''}`;
}

/**
 * Clear search
 */
function handleClearSearch() {
  searchInput.value = '';
  filterLeads();
}

// ====================================
// 4. AVATAR GENERATION
// ====================================

/**
 * Generate initials from full name
 */
function generateInitials(fullName) {
  if (!fullName || fullName.trim() === '') return '?';
  
  return fullName
    .split(' ')
    .slice(0, 2)
    .map(name => name[0].toUpperCase())
    .join('')
    .substring(0, 2);
}

/**
 * Get gradient colors based on initials
 */
function getGradientColor(initials) {
  const colorPairs = [
    ['#d8f911', '#ffeb3b'],     // Yellow (Primary)
    ['#42d1ff', '#00bcd4'],     // Cyan
    ['#16bc53', '#4caf50'],     // Green
    ['#ff4d4d', '#f44336'],     // Red
    ['#f2ad0c', '#ff9800'],     // Orange
    ['#9c27b0', '#e91e63'],     // Purple
    ['#2196f3', '#03a9f4'],     // Blue
    ['#00bcd4', '#009688'],     // Teal
  ];
  
  const code = initials.charCodeAt(0) || 0;
  const index = code % colorPairs.length;
  
  return colorPairs[index];
}

/**
 * Validate image URL
 */
async function validateImageUrl(url) {
  if (!url || url.trim() === '') return false;
  
  // Check cache
  if (imageValidationCache[url] !== undefined) {
    return imageValidationCache[url];
  }
  
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      imageValidationCache[url] = false;
      resolve(false);
    }, 3000);
    
    const img = new Image();
    img.onload = () => {
      clearTimeout(timeout);
      imageValidationCache[url] = true;
      resolve(true);
    };
    img.onerror = () => {
      clearTimeout(timeout);
      imageValidationCache[url] = false;
      resolve(false);
    };
    img.src = url;
  });
}

/**
 * Render initials avatar HTML
 */
function renderInitialsAvatar(initials) {
  const gradient = getGradientColor(initials);
  return `<div class="lead-avatar-initials" style="background: linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 100%);">${initials}</div>`;
}

/**
 * Create avatar HTML (image or initials)
 */
async function createAvatarHTML(lead) {
  const pictureUrl = lead['PICTURE URL'];
  
  if (pictureUrl && pictureUrl.trim() !== '') {
    const isValid = await validateImageUrl(pictureUrl);
    if (isValid) {
      return `<img class="lead-avatar-image" src="${pictureUrl}" alt="${lead['FULL NAME']}" />`;
    }
  }
  
  const initials = generateInitials(lead['FULL NAME']);
  return renderInitialsAvatar(initials);
}

// ====================================
// 5. DISPLAY LEADS
// ====================================

/**
 * Display leads in grid
 */
async function displayLeads() {
  if (filteredLeads.length === 0) {
    leadsContainer.style.display = 'none';
    noDataState.style.display = 'block';
    analyticsSection.style.display = 'none';
    searchSection.style.display = 'none';
    return;
  }
  
  leadsContainer.style.display = 'grid';
  noDataState.style.display = 'none';
  analyticsSection.style.display = 'block';
  searchSection.style.display = 'block';
  
  // Create all cards
  const cardPromises = filteredLeads.map(async (lead, idx) => {
    return createLeadCard(lead, idx);
  });
  
  const cards = await Promise.all(cardPromises);
  leadsContainer.innerHTML = cards.join('');
  
  // Add click handlers
  document.querySelectorAll('.lead-card').forEach((card, idx) => {
    card.addEventListener('click', () => openLeadModal(idx));
  });
}

/**
 * Create a single lead card HTML
 */
async function createLeadCard(lead, index) {
  const avatarHTML = await createAvatarHTML(lead);
  const name = lead['FULL NAME'] || 'N/A';
  const position = lead['POSITION'] || lead['HEADLINE'] || 'Position not listed';
  const company = lead['COMPANY NAME'] || 'Company not listed';
  const email = lead['EMAIL'] || 'No email';
  
  return `
    <div class="lead-card" data-index="${index}">
      <div class="lead-avatar">
        ${avatarHTML}
      </div>
      <div class="lead-name">${escapeHtml(name)}</div>
      <div class="lead-position">${escapeHtml(position)}</div>
      <div class="lead-company">${escapeHtml(company)}</div>
      <div class="lead-email">${escapeHtml(email)}</div>
    </div>
  `;
}

// ====================================
// 6. ANALYTICS
// ====================================

/**
 * Update analytics metrics
 */
function updateAnalytics() {
  const leads = filteredLeads.length > 0 ? filteredLeads : allLeads;
  
  // Total Leads
  document.getElementById('totalLeads').textContent = leads.length;
  
  // Unique Companies
  const companies = new Set(
    leads.map(l => l['COMPANY NAME']).filter(c => c && c.trim() !== '')
  );
  document.getElementById('uniqueCompanies').textContent = companies.size;
  
  // Valid Emails
  const validEmails = leads.filter(l => 
    l['EMAIL'] && l['EMAIL'].trim() !== '' && l['EMAIL'].includes('@')
  ).length;
  document.getElementById('validEmails').textContent = validEmails;
  
  // Premium Leads
  const premiumLeads = leads.filter(l => 
    String(l['IS PREMIUM']).trim().toLowerCase() === 'true'
  ).length;
  document.getElementById('premiumLeads').textContent = premiumLeads;
}

// ====================================
// 7. MODAL & DETAILS
// ====================================

/**
 * Open lead details modal
 */
async function openLeadModal(idx) {
  const lead = filteredLeads[idx];
  if (!lead) return;
  
  modalTitle.textContent = lead['FULL NAME'] || 'Lead Details';
  
  let html = '';
  
  // Add avatar if picture URL exists
  const pictureUrl = lead['PICTURE URL'];
  if (pictureUrl && pictureUrl.trim() !== '') {
    const isValid = await validateImageUrl(pictureUrl);
    if (isValid) {
      html += `
        <div class="modal-avatar-section">
          <img class="modal-avatar-image" src="${pictureUrl}" alt="${lead['FULL NAME']}" />
        </div>
      `;
    }
  }
  
  // Organize information into categories
  const personalInfo = [];
  const companyInfo = [];
  const otherInfo = [];
  
  const keyMapping = {
    'ID': 'ID',
    'OBJECT': 'Object',
    'RESULT POSITION': 'Rank',
    'TASK ID': 'Task ID',
    'FULL NAME': 'Full Name',
    'FIRST NAME': 'First Name',
    'LAST NAME': 'Last Name',
    'EMAIL': 'Email',
    'EMAIL STATUS': 'Email Status',
    'LINKEDIN PROFILE URL': 'LinkedIn Profile',
    'SALES NAVIGATOR PROFILE URL': 'Sales Navigator',
    'POSITION': 'Position',
    'HEADLINE': 'Headline',
    'SENIORITY': 'Seniority',
    'IS OPEN': 'Open to Opportunities',
    'YEARS IN POSITION': 'Years in Position',
    'MONTHS IN POSITION': 'Months in Position',
    'YEARS IN COMPANY': 'Years in Company',
    'MONTHS IN COMPANY': 'Months in Company',
    'IS PREMIUM': 'Premium Lead',
    'LOCATION': 'Location',
    'SUMMARY': 'Summary',
    'DEGREE': 'Education',
    'STARTED ON': 'Joined Date',
    'PICTURE URL': 'Picture URL',
    'IS SAVED': 'Is Saved',
    'COMPANY ID': 'Company ID',
    'CURRENT JOB NUMBERS': 'Current Job #',
    'PERSON ID': 'Person ID',
    'MATCH FILTERS': 'Match Filters',
    'NO MATCH REASON': 'No Match Reason',
    'COMPANY NAME': 'Company Name',
    'COMPANY DESCRIPTION': 'Company Description',
    'COMPANY DOMAIN': 'Company Website',
    'COMPANY TYPE': 'Company Type',
    'COMPANY LOCATION': 'Company Location',
    'COMPANY INDUSTRY': 'Industry',
    'COMPANY SPECIALTIES': 'Specialties',
    'COMPANY REVENUE RANGE': 'Revenue Range',
    'COMPANY LINKEDIN URL': 'Company LinkedIn',
    'COMPANY EMPLOYEE COUNT': 'Employee Count',
    'COMPANY EMPLOYEE COUNT RANGE': 'Employee Count Range',
    'COMPANY FOUNDED YEAR': 'Founded Year',
    'COMPANY PROFILE PICTURE': 'Company Logo',
    'COLLECTED AT': 'Collected At',
    'INPUT URL': 'Source URL',
    'PARAM MOBILE PHONE': 'Mobile Phone',
    'PARAM EMAIL': 'Param Email',
    'PARAM PROFILES PER PAGE': 'Profiles/Page',
    'PARAM MAX PAGES': 'Max Pages'
  };
  
  // Define personal fields explicitly to ensure they appear first
  const personalFields = [
    'FULL NAME', 'EMAIL', 'mobile phone', 'POSITION', 'HEADLINE', 
    'LOCATION', 'SENIORITY', 'IS PREMIUM', 'EMAIL STATUS', 
    'IS OPEN', 'LINKEDIN PROFILE URL', 'SALES NAVIGATOR PROFILE URL',
    'SUMMARY', 'DEGREE', 'STARTED ON'
  ];

  // Categorize fields
  Object.entries(lead).forEach(([key, value]) => {
    if (!value || value.trim() === '') return;
    if (key === 'PICTURE URL') return; // Skip avatar URL in list, handled separately
    
    const displayLabel = keyMapping[key] || formatFieldName(key);
    const item = { label: displayLabel, value, key };
    
    // Logic:
    // 1. If in personalFields list -> Personal
    // 2. If key starts with "COMPANY" -> Company
    // 3. Else -> Other
    
    if (personalFields.includes(key) || personalFields.includes(key.toLowerCase())) {
      personalInfo.push(item);
    } else if (key.startsWith('COMPANY')) {
      companyInfo.push(item);
    } else {
      otherInfo.push(item);
    }
  });
  
  // Render Personal Info
  if (personalInfo.length > 0) {
    html += '<div class="detail-group">';
    html += '<div class="detail-group-title">Personal Info</div>';
    personalInfo.forEach(item => {
      const isLink = item.key.includes('LINKEDIN') || item.key.includes('URL');
      const isEmail = item.key === 'EMAIL';
      
      if (isLink) {
        html += `<div class="detail-item"><div class="detail-label">${item.label}</div><div class="detail-value"><a href="${escapeHtml(item.value)}" target="_blank" rel="noopener">View ↗</a></div></div>`;
      } else if (isEmail) {
        html += `<div class="detail-item"><div class="detail-label">${item.label}</div><div class="detail-value"><a href="mailto:${escapeHtml(item.value)}">${escapeHtml(item.value)}</a></div></div>`;
      } else {
        html += `<div class="detail-item"><div class="detail-label">${item.label}</div><div class="detail-value">${escapeHtml(item.value)}</div></div>`;
      }
    });
    html += '</div>';
  }
  
  // Render Company Info
  if (companyInfo.length > 0) {
    html += '<div class="detail-group">';
    html += '<div class="detail-group-title">Company Info</div>';
    companyInfo.forEach(item => {
      const isLink = item.key.includes('URL');
      if (isLink) {
        html += `<div class="detail-item"><div class="detail-label">${item.label}</div><div class="detail-value"><a href="${escapeHtml(item.value)}" target="_blank" rel="noopener">View ↗</a></div></div>`;
      } else {
        html += `<div class="detail-item"><div class="detail-label">${item.label}</div><div class="detail-value">${escapeHtml(item.value)}</div></div>`;
      }
    });
    html += '</div>';
  }
  
  // Render Other Info
  if (otherInfo.length > 0) {
    html += '<div class="detail-group">';
    html += '<div class="detail-group-title">Additional Info</div>';
    otherInfo.forEach(item => {
      const isLink = item.key.includes('URL');
      if (isLink) {
        html += `<div class="detail-item"><div class="detail-label">${item.label}</div><div class="detail-value"><a href="${escapeHtml(item.value)}" target="_blank" rel="noopener">View ↗</a></div></div>`;
      } else {
        html += `<div class="detail-item"><div class="detail-label">${item.label}</div><div class="detail-value">${escapeHtml(item.value)}</div></div>`;
      }
    });
    html += '</div>';
  }
  
  // Copy as JSON button
  html += `<button class="copy-btn" onclick="copyLeadAsJSON(${idx})">📋 Copy as JSON</button>`;
  
  modalBody.innerHTML = html;
  leadModal.classList.add('active');
}

/**
 * Close modal
 */
function handleCloseModal() {
  leadModal.classList.remove('active');
}

/**
 * Copy lead as JSON
 */
function copyLeadAsJSON(idx) {
  const lead = filteredLeads[idx];
  if (!lead) return;
  
  const leadJSON = JSON.stringify(lead, null, 2);
  
  navigator.clipboard.writeText(leadJSON).then(() => {
    showToast('✅ Copied to clipboard!');
  }).catch(() => {
    showError('Failed to copy to clipboard');
  });
}

// ====================================
// 8. UTILITY FUNCTIONS
// ====================================

/**
 * Format field names for display
 */
function formatFieldName(fieldName) {
  return fieldName
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Show error message
 */
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add('show');
  setTimeout(() => {
    errorMessage.classList.remove('show');
  }, 5000);
}

/**
 * Show success message
 */
function showSuccess(message) {
  successMessage.textContent = message;
  successMessage.classList.add('show');
  setTimeout(() => {
    successMessage.classList.remove('show');
  }, 4000);
}

/**
 * Show message (generic)
 */
function showMessage(type, message) {
  if (type === 'error') showError(message);
  else if (type === 'success') showSuccess(message);
}

/**
 * Show toast notification
 */
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}

// ====================================
// 9. EVENT LISTENERS
// ====================================

// Load button
loadBtn.addEventListener('click', handleLoadSheet);

// Parse CSV button
parseCsvBtn.addEventListener('click', handleParseCSV);

// Search input with debounce
const debouncedSearch = debounce(filterLeads, 200);
searchInput.addEventListener('input', debouncedSearch);

// Clear search
clearSearchBtn.addEventListener('click', handleClearSearch);

// Modal close
closeModal.addEventListener('click', handleCloseModal);

// Close modal on backdrop click
leadModal.addEventListener('click', (e) => {
  if (e.target === leadModal) {
    handleCloseModal();
  }
});

// Close modal with ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && leadModal.classList.contains('active')) {
    handleCloseModal();
  }
});

// Allow Enter key to load sheet
sheetUrlInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    handleLoadSheet();
  }
});

// ====================================
// 10. INITIALIZATION
// ====================================

console.log('LinkedIn Lead Explorer initialized successfully!');

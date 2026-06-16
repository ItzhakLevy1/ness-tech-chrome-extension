// content.js

// Extract the job ID from the current URL
function getJobId() {
  const match = window.location.pathname.match(/\/job\/(\d+)/);
  return match ? match[1] : null;
}

// Injects the permanent status sidebar into the page
function createSidebar() {
  if (document.getElementById('ness-tracker-sidebar')) return;

  const sidebar = document.createElement('div');
  sidebar.id = 'ness-tracker-sidebar';
  sidebar.innerText = 'תוסף הגשת המועמדות שלי פעיל 🟢';

  document.body.appendChild(sidebar);
}

// Updates the job card UI based on application status
function updateJobUI() {
  const jobId = getJobId();
  if (!jobId) return;

  const descCard = document.querySelector('div.description-card');
  if (!descCard) return;

  chrome.storage.local.get(['submittedJobsData'], (result) => {
    const jobsData = result.submittedJobsData || {};
    
    // Check if this specific job ID exists in our data object
    if (jobsData[jobId]) {
      descCard.classList.add('applied-job');
      
      // Inject the submission date notice if it doesn't exist yet
      let dateBadge = document.getElementById('ness-extension-date-badge');
      if (!dateBadge) {
        dateBadge = document.createElement('div');
        dateBadge.id = 'ness-extension-date-badge';
        descCard.appendChild(dateBadge);
      }
      dateBadge.innerText = `הוגש בתאריך: ${jobsData[jobId].date}`;
    } else {
      descCard.classList.remove('applied-job');
      
      // Remove the date badge if it exists
      const dateBadge = document.getElementById('ness-extension-date-badge');
      if (dateBadge) dateBadge.remove();
    }
  });
  
  // Attach listener to the native submit button if it exists
  attachSubmitButtonListener(jobId);
}

// Finds the site's original submit button and listens to clicks
function attachSubmitButtonListener(jobId) {
  const buttons = document.querySelectorAll('button, input[type="button"], input[type="submit"]');
  let nativeSubmitBtn = null;

  for (let btn of buttons) {
    const text = btn.innerText || btn.value || '';
    if (text.includes('שליחה') || text.includes('להגשת מועמדות') || text.includes('הגש מועמדות')) {
      nativeSubmitBtn = btn;
      break;
    }
  }

  if (nativeSubmitBtn && !nativeSubmitBtn.dataset.trackedByExtension) {
    nativeSubmitBtn.dataset.trackedByExtension = 'true';
    
    nativeSubmitBtn.addEventListener('click', () => {
      chrome.storage.local.get(['submittedJobsData'], (result) => {
        const jobsData = result.submittedJobsData || {};
        
        if (!jobsData[jobId]) {
          // Get current date formatted as DD/MM/YYYY
          const today = new Date();
          const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
          
          // Save both the status and the timestamp
          jobsData[jobId] = {
            submitted: true,
            date: formattedDate
          };
          
          chrome.storage.local.set({ submittedJobsData: jobsData }, () => {
            updateJobUI();
          });
        }
      });
    });
  }
}

// Initialize components
createSidebar();

// Observe dynamic content changes (Angular)
const observer = new MutationObserver(() => {
  createSidebar();
  const descCard = document.querySelector('div.description-card');
  if (descCard) {
    updateJobUI();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Initial run
updateJobUI();
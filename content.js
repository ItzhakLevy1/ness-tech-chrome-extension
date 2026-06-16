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

  chrome.storage.local.get(['submittedJobs'], (result) => {
    const submittedJobs = result.submittedJobs || [];
    
    if (submittedJobs.includes(jobId)) {
      descCard.classList.add('ness-submitted-card');
    } else {
      descCard.classList.remove('ness-submitted-card');
    }
  });
  
  // Attach listener to the native submit button if it exists
  attachSubmitButtonListener(jobId);
}

// Finds the site's original submit button and listens to clicks
function attachSubmitButtonListener(jobId) {
  // Look for buttons that contain the text "שליחה" or "הגשת מועמדות"
  const buttons = document.querySelectorAll('button, input[type="button"], input[type="submit"]');
  let nativeSubmitBtn = null;

  for (let btn of buttons) {
    const text = btn.innerText || btn.value || '';
    if (text.includes('שליחה') || text.includes('להגשת מועמדות') || text.includes('הגש מועמדות')) {
      nativeSubmitBtn = btn;
      break;
    }
  }

  // If found and not already tracked, add click event
  if (nativeSubmitBtn && !nativeSubmitBtn.dataset.trackedByExtension) {
    nativeSubmitBtn.dataset.trackedByExtension = 'true';
    
    nativeSubmitBtn.addEventListener('click', () => {
      chrome.storage.local.get(['submittedJobs'], (result) => {
        const submittedJobs = result.submittedJobs || [];
        if (!submittedJobs.includes(jobId)) {
          submittedJobs.push(jobId);
          chrome.storage.local.set({ submittedJobs }, () => {
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
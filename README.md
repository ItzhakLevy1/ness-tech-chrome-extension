# Ness Careers Job Tracker - Chrome Extension

A simple and efficient Chrome Extension designed for the Ness Technologies careers website. This extension helps job seekers track positions they have already applied for by automatically highlighting the job description card and saving the status locally in the browser.

## ✨ Key Features
* **Permanent Sidebar Status:** A persistent, clean sidebar on the screen indicating that the extension is running (`תוסף הגשת המועמדות שלי פעיל 🟢`).
* **Fully Automated Tracking:** No extra buttons needed. Clicking the native "Submit" (שליחה / הגשת מועמדות) button on the website automatically logs the job.
* **Clear Visual Feedback:** Submitted jobs are instantly highlighted with a soft green background and a distinct border.
* **Local Storage Persistence:** Data is stored securely in the browser's local storage (`chrome.storage.local`), ensuring your history is saved even after refreshing the page or closing the browser.
* **Dynamic Content Support:** Uses a `MutationObserver` to seamlessly handle the dynamic Angular architecture of the website as elements load.

## 📁 Folder Structure
The extension consists of 3 core files inside a single directory:
* `manifest.json` — Configuration and permissions file for the extension (Manifest V3).
* `content.js` — Core logic that detects the submit button, manages local storage, and handles UI updates.
* `style.css` — Stylesheet for the permanent sidebar and the highlighted job card states.

## 🛠️ Installation Instructions (Developer Mode)

1. **Prepare the Files:** Ensure that all three files (`manifest.json`, `content.js`, and `style.css`) are saved together in a dedicated folder on your computer (e.g., a folder named `Ness-Job-Tracker`).
2. **Open Extensions Page:** Open Google Chrome and navigate to the following URL:
   
Enable Developer Mode: In the top-right (or top-left, depending on your language settings), toggle the "Developer mode" switch to ON.

Load the Extension: Click the "Load unpacked" button that appears in the top menu bar.

Select Folder: In the file picker dialog, select the folder containing your extension files and click "Select Folder".

🚀 How to Use
Navigate to any job listing page on the Ness careers website (under the domain ness-tech.co.il/careers/job/*).

You will see the black and green status sidebar on the side of your screen, indicating the extension is active.

Fill out your details in the application form and click the native submit button.

Upon clicking, the extension captures the Job ID, updates your local storage, and changes the job description card background to green instantly.

Whenever you revisit this job page in the future, it will automatically remain highlighted.
import { getProfile, clearProfile } from "./storage.js";
import { showToast } from "./toast.js";
import { showScreen } from "./navigation.js";
import { enterEditMode, enterAddMode } from "./form.js";

// Maps the course value stored in the form (e.g. "bscs") to a readable label.
const courseLabels = {
  bscs: "BS Computer Science",
  bsit: "BS Information Technology",
  bsis: "BS Information Systems",
};

// Rebuilds the Profile screen's content based on what's in storage. Called on setup, and again whenever the profile changes (save/edit/delete).
function renderProfile() {
  const container = document.getElementById("profile-content");
  if (!container) return;

  const profile = getProfile();

  // No profile saved yet — show an empty state with an "Add Profile" button.
  if (!profile) {
    container.innerHTML = `
      <p class="form-description">No profile yet. Add your information to get started.</p>
      <button id="add-profile-btn" class="btn btn-primary" type="button">Add Profile</button>
    `;
    document
      .getElementById("add-profile-btn")
      .addEventListener("click", enterAddMode);
    return;
  }

  // Profile exists — display each field, falling back to the raw course value if it's not in courseLabels for some reason.
  container.innerHTML = `
    <div class="profile-field"><span class="profile-label">Student Name</span><span class="profile-value">${profile.name}</span></div>
    <div class="profile-field"><span class="profile-label">Student ID</span><span class="profile-value">${profile.studentId}</span></div>
    <div class="profile-field"><span class="profile-label">Course</span><span class="profile-value">${courseLabels[profile.course] ?? profile.course}</span></div>
    <div class="profile-field"><span class="profile-label">Year Level</span><span class="profile-value">${profile.yearLevel}</span></div>
    <div class="profile-field"><span class="profile-label">Email</span><span class="profile-value">${profile.email}</span></div>
    <div class="profile-field"><span class="profile-label">Contact Number</span><span class="profile-value">${profile.contactNumber}</span></div>
    <div class="profile-actions">
      <button id="edit-profile-btn" class="btn btn-ghost" type="button">Edit</button>
      <button id="delete-profile-btn" class="btn btn-ghost" type="button">Delete</button>
    </div>
  `;

  document
    .getElementById("edit-profile-btn")
    .addEventListener("click", enterEditMode);
  document
    .getElementById("delete-profile-btn")
    .addEventListener("click", () => {
      clearProfile();
      showToast("Profile deleted.");

      enterAddMode(); // After deleting, send the user straight into "add" mode since there's no profile left to show.
    });
}

// Renders the profile content and switches to the Profile screen. Used by the "View Profile" button on Home.
export function goToProfile() {
  renderProfile();
  showScreen("profile-screen");
}

export const setupProfile = () => {
  const backBtn = document.getElementById("profile-back-btn");
  if (backBtn)
    backBtn.addEventListener("click", () => showScreen("home-screen"));

  // Re-render whenever form.js announces that the profile was saved, updated, or deleted, so the Profile screen always stays in sync.
  document.addEventListener("profile-changed", renderProfile);

  renderProfile(); // Render once immediately in case the Profile screen is visible on load
};

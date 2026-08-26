import { getProfile, saveProfile } from "./storage.js";
import { showToast } from "./toast.js";
import { showScreen } from "./navigation.js";

// One validator function per form field. Each takes the field's current
// value and returns an error message string, or "" if the value is valid.
const validators = {
  "student-name": (value) => {
    if (!value.trim()) return "Name is required.";
    return "";
  },
  "student-id": (value) => {
    if (!value.trim()) return "Student ID is required.";

    const pattern = /^\d{4}-\d{2}-\d{5}$/; // Expected format: 2025-01-12345 (year-course code-5 digit number).
    if (!pattern.test(value.trim())) {
      return "Use the format YYYY-XX-XXXXX (e.g. 2025-01-12345).";
    }

    return "";
  },
  course: (value) => (!value ? "Please select a course." : ""),
  "year-level": (value) => (!value ? "Please select a year level." : ""),
  email: (value) => {
    if (!value.trim()) return "Email is required.";

    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email shape check: something@something.something
    if (!pattern.test(value.trim())) return "Enter a valid email address.";

    return "";
  },
  "contact-number": (value) => {
    if (!value.trim()) return "Contact number is required.";

    const pattern = /^09\d{9}$/; // Mobile format: starts with 09, 11 digits total.
    if (!pattern.test(value.trim())) {
      return "Enter an 11-digit number starting with 09.";
    }

    return "";
  },
};

// Tracks whether the form is currently editing an existing profile
let isEditing = false;

// Displays a message under a field and colors both the field and message
function showFieldMessage(fieldId, message, isError) {
  const msgEl = document.getElementById(`${fieldId}-message`);
  const inputEl = document.getElementById(fieldId);
  if (!msgEl || !inputEl) return;

  msgEl.textContent = message;
  msgEl.classList.toggle("error", isError);
  msgEl.classList.toggle("success", !isError && message !== "");
  inputEl.classList.toggle("error", isError);
  inputEl.classList.toggle("success", !isError && message !== "");
}

// Clears all validation messages and styling from every field
function clearAllMessages() {
  Object.keys(validators).forEach((fieldId) => {
    const msgEl = document.getElementById(`${fieldId}-message`);
    const inputEl = document.getElementById(fieldId);
    if (msgEl) {
      msgEl.textContent = "";
      msgEl.classList.remove("error", "success");
    }
    if (inputEl) inputEl.classList.remove("error", "success");
  });
}

// Runs every field through its validator.
function validateForm() {
  let isValid = true;
  Object.entries(validators).forEach(([fieldId, validate]) => {
    const value = document.getElementById(fieldId).value;
    const errorMessage = validate(value);
    if (errorMessage) {
      showFieldMessage(fieldId, errorMessage, true);
      isValid = false;
    } else {
      showFieldMessage(fieldId, "Looks good.", false);
    }
  });
  return isValid;
}

// Reads the current values out of the form inputs into a plain object, ready to be saved.
function readFormValues() {
  return {
    name: document.getElementById("student-name").value.trim(),
    studentId: document.getElementById("student-id").value.trim(),
    course: document.getElementById("course").value,
    yearLevel: document.getElementById("year-level").value,
    email: document.getElementById("email").value.trim(),
    contactNumber: document.getElementById("contact-number").value.trim(),
  };
}

// Fills the form inputs with an existing profile's values (used when entering edit mode).
function fillForm(profile) {
  document.getElementById("student-name").value = profile.name;
  document.getElementById("student-id").value = profile.studentId;
  document.getElementById("course").value = profile.course;
  document.getElementById("year-level").value = profile.yearLevel;
  document.getElementById("email").value = profile.email;
  document.getElementById("contact-number").value = profile.contactNumber;
}

function resetForm(form) {
  form.reset();
  clearAllMessages();
}

// Updates the form's UI to reflect whether we're adding a new profile
// or editing an existing one: button text, cancel button visibility,
// form title, and the nav bar label.
function setFormMode(editing) {
  isEditing = editing;
  const submitBtn = document.querySelector(
    '#registration-form button[type="submit"]',
  );
  const cancelBtn = document.getElementById("cancel-edit-btn");
  const formTitle = document.getElementById("form-title");
  const navLabel = document.getElementById("nav-add-profile-label");

  submitBtn.textContent = editing ? "Update Profile" : "Save Profile";
  if (cancelBtn) cancelBtn.classList.toggle("hidden", !editing);
  if (formTitle)
    formTitle.textContent = editing
      ? "Editing Student Information"
      : "Registration Form";
  if (navLabel) navLabel.textContent = editing ? "Edit Profile" : "Add Profile";
}

// Opens the form pre-filled with the existing profile, in edit mode.
// Called when the user taps "Edit" on the Profile screen.
export function enterEditMode() {
  const profile = getProfile();
  if (!profile) return;
  fillForm(profile);
  setFormMode(true);
  showScreen("registration-screen");
}

// Opens a blank form in "add new profile" mode.
export function enterAddMode() {
  const form = document.getElementById("registration-form");
  resetForm(form);
  setFormMode(false);
  showScreen("registration-screen");
}

// Entry point used by the nav bar's "Add/Edit Profile" button: decides
// whether to open the form in edit mode (profile exists) or add mode (no profile yet).
export function openRegistration() {
  getProfile() ? enterEditMode() : enterAddMode();
}

// Runs once when the app starts. Wires up field-level validation on blur, the cancel button, and the form submit handler.
export const setupForm = () => {
  const form = document.getElementById("registration-form");
  if (!form) return;

  // Validate each field as soon as the user leaves it (on blur), rather than waiting until submit, for faster feedback.
  Object.keys(validators).forEach((fieldId) => {
    const inputEl = document.getElementById(fieldId);
    if (!inputEl) return;
    inputEl.addEventListener("blur", () => {
      const errorMessage = validators[fieldId](inputEl.value);
      showFieldMessage(fieldId, errorMessage, Boolean(errorMessage));
    });
  });

  // Cancel button: discard changes and go back to the Profile screen
  const cancelBtn = document.getElementById("cancel-edit-btn");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      resetForm(form);
      setFormMode(false);
      showScreen("profile-screen");
      document.dispatchEvent(new CustomEvent("profile-changed"));
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Stop the browser's default form submission (page reload).

    if (!validateForm()) {
      showToast("Please fix the highlighted fields.", "error");
      return;
    }

    saveProfile(readFormValues());
    resetForm(form);

    // Capture this before setFormMode resets it, so the toast message below can still tell add vs. edit apart.
    const wasEditing = isEditing;
    setFormMode(false);
    showToast(
      wasEditing
        ? "Profile updated successfully!"
        : "Profile saved successfully!",
    );
    showScreen("profile-screen");

    // Tell profile.js (and anything else listening) that the saved profile has changed, so the Profile screen and nav label update.
    document.dispatchEvent(new CustomEvent("profile-changed"));
  });

  // Runs once, at setup: registers the listener and sets the correct label immediately, whether or not a profile already exists.
  document.addEventListener("profile-changed", syncNavLabel);
  syncNavLabel();
};

// Keeps the nav bar's "Add/Edit Profile" label in sync with whether a profile currently exists.
export function syncNavLabel() {
  const navLabel = document.getElementById("nav-add-profile-label");
  if (navLabel) {
    navLabel.textContent = getProfile() ? "Edit Profile" : "Add Profile";
  }
}

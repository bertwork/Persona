const NAV_BUTTONS = {
  "home-screen": "nav-home",
  "about-screen": "nav-home",
  "profile-screen": "nav-home",
  "registration-screen": "nav-add-profile",
};

export function showScreen(screenId) {
  document.querySelectorAll("[data-screen]").forEach((section) => {
    section.classList.toggle("hidden", section.dataset.screen !== screenId);
  });
  updateActiveNav(screenId);
}

function updateActiveNav(screenId) {
  const activeNavId = NAV_BUTTONS[screenId];
  document.querySelectorAll("nav .btn-link").forEach((btn) => {
    btn.classList.toggle("active", btn.id === activeNavId);
  });
}

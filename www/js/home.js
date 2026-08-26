import { showScreen } from "./navigation.js";
import { goToProfile } from "./profile.js";
import { openRegistration } from "./form.js";

export const setupHome = () => {
  document
    .getElementById("home-view-profile-btn")
    ?.addEventListener("click", goToProfile);
  document
    .getElementById("home-about-btn")
    ?.addEventListener("click", () => showScreen("about-screen"));
  document
    .getElementById("about-back-btn")
    ?.addEventListener("click", () => showScreen("home-screen"));

  document
    .getElementById("nav-home")
    ?.addEventListener("click", () => showScreen("home-screen"));
  document
    .getElementById("nav-add-profile")
    ?.addEventListener("click", openRegistration);
};

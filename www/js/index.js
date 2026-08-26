import { setupTheme } from "./theme.js";
import { setupForm } from "./form.js";
import { setupProfile } from "./profile.js";
import { setupHome } from "./home.js";
import { showScreen } from "./navigation.js";

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  console.log("Running cordova-" + cordova.platformId + "@" + cordova.version);
  setupTheme();
  setupForm();
  setupProfile();
  setupHome();
  showScreen("home-screen");
}

let themeLightEl;
let themeDarkEl;

export const setupTheme = () => {
  document.getElementById("theme-toggle").addEventListener("click", setTheme);

  themeLightEl = document.getElementById("theme-light");
  themeDarkEl = document.getElementById("theme-dark");

  const currentTheme = localStorage.getItem("theme");

  if (currentTheme) {
    document.documentElement.classList.add(currentTheme); // A theme was chosen before — reapply it.
    updateThemeIcon(currentTheme);
  } else {
    document.documentElement.classList.add("light"); // First time opening the app — default to light mode and remember it.
    localStorage.setItem("theme", "light");
    updateThemeIcon("light");
  }
};

// Runs when the theme toggle button is clicked. Flips between light and dark.
const setTheme = () => {
  const currentTheme = document.documentElement.classList.contains("dark")
    ? "dark"
    : "light";

  const newTheme = currentTheme === "dark" ? "light" : "dark";

  document.documentElement.classList.remove(currentTheme);
  document.documentElement.classList.add(newTheme);

  localStorage.setItem("theme", newTheme);

  updateThemeIcon(newTheme);
};

// Shows the moon icon in dark mode and the sun icon in light mode
const updateThemeIcon = (theme) => {
  if (theme === "dark") {
    themeLightEl.classList.remove("hidden");
    themeDarkEl.classList.add("hidden");
  } else {
    themeLightEl.classList.add("hidden");
    themeDarkEl.classList.remove("hidden");
  }
};

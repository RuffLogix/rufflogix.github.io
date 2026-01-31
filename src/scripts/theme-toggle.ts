/**
 * Theme toggle functionality for dark/light mode switching
 */

class ThemeManager {
  private themeToggle: HTMLButtonElement | null = null;
  private currentTheme: "dark" | "light" = "dark";

  constructor() {
    this.init();
  }

  private init(): void {
    this.themeToggle = document.getElementById(
      "theme-toggle",
    ) as HTMLButtonElement;
    if (!this.themeToggle) return;

    // Get saved theme or default to dark
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    this.currentTheme = savedTheme || "dark";

    // Apply initial theme
    this.applyTheme(this.currentTheme);

    // Bind toggle event
    this.themeToggle.addEventListener("click", () => this.toggleTheme());
  }

  private getSystemTheme(): "dark" | "light" {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  private applyTheme(theme: "dark" | "light"): void {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    this.currentTheme = theme;
  }

  private toggleTheme(): void {
    const newTheme = this.currentTheme === "dark" ? "light" : "dark";
    this.applyTheme(newTheme);
  }
}

// Initialize theme manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ThemeManager();
});

// Also initialize immediately if DOM is already loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => new ThemeManager());
} else {
  new ThemeManager();
}

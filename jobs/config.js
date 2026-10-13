/* CURE Jobs settings. Edit this file only. */
window.CURE_CONFIG = {
  /* Where the app gets its listings. Default: jobs.json at the site root (kept there so the weekly refresh does not change).
     To use an API instead, put its full https address here; it must return the same
     JSON shape as jobs.json and allow requests from the app's address (CORS). */
  jobsSource: "../jobs.json"
};

# CURE Jobs

Installable web app for CURE (Center for Ultrasound Research and Education) students and graduates: verified sonography job openings, a sonographer resume builder and a career toolkit.

- The app lives in `jobs/` (address: /jobs/). The site root only forwards to it, so the CURE Student Resource Portal at /Student-Resource-Portal/ installs as a separate app.
- `jobs.json` (site root) holds the listings. It is replaced every Monday by CURE's scheduled refresh.
- `jobs/config.js` sets where listings come from.
- After changing any app file, raise `VERSION` in `jobs/sw.js` so installed copies update.

Maintained by CURE Career Services, White Plains, NY.

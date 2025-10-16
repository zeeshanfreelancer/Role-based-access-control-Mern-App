import cron from "node-cron";

// Example cron job placeholder (run every day at midnight)
export const initCronJobs = () => {
  cron.schedule("0 0 * * *", () => {
    console.log("Daily cron job running - placeholder");
    // e.g. cleanup tasks, cache warmup, notifications, etc.
  });
  console.log("Cron jobs initialized");
};

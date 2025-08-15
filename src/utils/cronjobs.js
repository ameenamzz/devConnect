const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const connectionRequest = require("../models/connectionRequest");
const sendEmail = require("./sendEmail");

cron.schedule("50 21 * * *", async () => {
  try {
    const yesterday = subDays(new Date(), 0);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequests = await connectionRequest
      .find({
        status: "interested",
        createdAt: {
          $gte: yesterdayStart,
          $lt: yesterdayEnd,
        },
      })
      .populate("fromUserId toUserId");

    const listOfEmails = [
      ...new Set(pendingRequests.map((res) => res.toUserId.email)),
    ];

    console.log(listOfEmails);

    for (const email of listOfEmails) {
      try {
        const res = await sendEmail.run(
          "New friend Request pending, " + email,
          "adjlkfjdslkjsa;lfkj;daskfsdl;;"
        );
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  }
  console.log("running a task every minute");
});

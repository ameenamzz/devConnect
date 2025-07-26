const adminAuth = (req, res, next) => {
  console.log("Admin Authorized");
  const token = "abc";
  const isAdminAuth = token === "abc";
  if (!isAdminAuth) {
    res.status(401).send("Invalid request");
  } else {
    next();
  }
};

const uesrAuth = (req, res, next) => {
  console.log("User Authorized...");
  const token = "abc";
  const isAdminAuth = token === "abc";
  if (!isAdminAuth) {
    res.status(401).send("Invalid request");
  } else {
    next();
  }
};
module.exports = { adminAuth, uesrAuth };

const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not Valid");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is not Valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not Strong");
  }
};

const validateAllowedProfileEdit = (req) => {
//TODO : Also need to validate each Field because user can enter any data into each field

  const allowedProfileEditField = [
    "age",
    "skills",
    "firstName",
    "lastName",
    "photURL",
    "gender",
    "description",
  ];
  const isAllowedProfielEdit = Object.keys(req.body).every((field) =>
    allowedProfileEditField.includes(field)
  );
  return isAllowedProfielEdit;
};

module.exports = { validateSignUpData, validateAllowedProfileEdit };

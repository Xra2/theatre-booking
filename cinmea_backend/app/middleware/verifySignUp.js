const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  User.findOne({
    where: {
      username: req.body.username,
    },
  }).then((user) => {
    if (user) {
      res.status(400).send({
        message: "Failed! Username is already in use!",
      });
      return;
    }

    // Email
    User.findOne({
      where: {
        email: req.body.email,
      },
    }).then((user) => {
      if (user) {
        res.status(400).send({
          message: "Failed! Email is already in use!",
        });
        return;
      }

      next();
    });
  });
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: "Failed! Role does not exist = " + req.body.roles[i],
        });
        return;
      }
    }
  }

  next();
};

const isStrongPassword = (password) => {
  // Define criteria for a strong password
  const minLength = 8;
  const hasUpperCase = /[A-Z]/; // At least one uppercase letter
  const hasLowerCase = /[a-z]/; // At least one lowercase letter
  const hasDigit = /\d/; // At least one digit
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/; // At least one special character

  if (password.length < minLength) {
    return {
      isValid: false,
      message: "Password must be at least 8 characters long.",
    };
  }
  if (!hasUpperCase.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one uppercase letter.",
    };
  }
  if (!hasLowerCase.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one lowercase letter.",
    };
  }
  if (!hasDigit.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one digit.",
    };
  }
  if (!hasSpecialChar.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one special character.",
    };
  }

  // If all criteria are met
  return { isValid: true };
};

const verifyStrongPassword = (req, res, next) => {
  console.log(req.body);
  const isStrong = isStrongPassword(req.body.password);
  if (!isStrong.isValid) {
    res.status(400).send({
      message: isStrong.message,
    });
    return;
  }

  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkRolesExisted: checkRolesExisted,
  verifyStrongPassword: verifyStrongPassword,
};

module.exports = verifySignUp;

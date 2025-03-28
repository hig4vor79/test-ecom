import { body } from "express-validator";

export const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email and password required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("password")
    .notEmpty()
    .withMessage("Email and password required")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long"),
];

export const registerValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email and password required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("password")
    .notEmpty()
    .withMessage("Email and password required")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long"),
];

export const updateUserValidation = [
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long"),

  body("newPassword", "Password must be at least 5 characters long")
    .trim()
    .notEmpty()
    .withMessage("New password required")
    .isLength({ min: 5 })
    .withMessage("New password must be at least 5 characters long"),
];

export const createProductValidation = [
  body("title").trim().notEmpty().withMessage("Title required"),

  body("durations")
    .isArray({ min: 1 })
    .withMessage("Must have at least one lease term")
    .custom((value) => {
      if (!value.every((d) => d.amount && d.price && d.unit)) {
        throw new Error(
          "Each lease term must have a valid amount / price / unit"
        );
      }
      return true;
    }),
];

export const createOrderValidation = [
  //   body("password")
  //   .trim()
  //   .notEmpty()
  //   .withMessage("Password required")
  //   .isLength({ min: 5 })
  //   .withMessage("Password must be at least 5 characters long"),
  // body("newPassword", "Password must be at least 5 characters long")
  //   .trim()
  //   .notEmpty()
  //   .withMessage("New password required")
  //   .isLength({ min: 5 })
  //   .withMessage("New password must be at least 5 characters long"),
];

// export const createProductValidation = [
//   body("title", "Title must be at least 2 characters long").isLength({
//     min: 2,
//   }),
//   body(
//     "slug",
//     "SLUG NOT NULL. Must contain only lowercase Latin letters, digits, and hyphens (no spaces)"
//   )
//     .notEmpty()
//     .matches(/^[a-z0-9\-]+$/),
// ];

// export const createPostValidation = [
//   body("title", "Title must be not empty").notEmpty(),
//   body(
//     "slug",
//     "SLUG NOT NULL. Must contain only lowercase Latin letters, digits, and hyphens (no spaces)"
//   )
//     .notEmpty()
//     .matches(/^[a-z0-9\-]+$/),
// ];

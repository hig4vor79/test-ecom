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

export const updateValidation = [
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

export const createOrderValidation = [
  body("items", "Must be at least 1 item").notEmpty(),
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

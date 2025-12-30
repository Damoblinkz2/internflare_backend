import { Request, Response, NextFunction } from "express";

const verifyCaptcha = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { captchaToken } = req.body;

    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`,
      }
    );

    const data = (await response.json()) as { success: boolean };

    if (!data.success)
      return next(res.status(400).json({ error: "CAPTCHA failed" }));

    // Allow access
    next();
  } catch (err) {
    next(err);
  }
};

export default verifyCaptcha;

// 2. Register your site

// Go to Google reCAPTCHA admin

// Create a site

// Get:

// Site key (public, goes in React)

// Secret key (private, backend only)

// ⚠️ Never put the secret key in your React code.

// npm install react-google-recaptcha

// import ReCAPTCHA from "react-google-recaptcha";
// import { useState } from "react";

// function ContactForm() {
//   const [captchaToken, setCaptchaToken] = useState(null);

//   const onSubmit = async (e) => {
//     e.preventDefault();

//     if (!captchaToken) {
//       alert("Please complete the CAPTCHA");
//       return;
//     }

//     // Send captchaToken to your backend
//     await fetch("/api/submit", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ captchaToken }),
//     });
//   };

//   return (
//     <form onSubmit={onSubmit}>
//       {/* your form fields */}

//       <ReCAPTCHA
//         sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
//         onChange={setCaptchaToken}
//       />

//       <button type="submit">Submit</button>
//     </form>
//   );
// }

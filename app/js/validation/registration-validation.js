import { validateForm } from './../utils/validation';
/**
 * 
 * @param {{ full_name: String, username: String, email: String, password: String, confirm_password: string }} 
 * @returns Object
 */
function generateFormObjectWithRegex({
  full_name,
  username,
  email,
  password,
  confirm_password
}) {
  const fullNameRegex = /^[A-Z][a-zA-Z]{3,}(?: [A-Z][a-zA-Z]*){0,2}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/ //Minimum eight characters, at least one letter and one number:
  const usernameRegex = /^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/
  // └─────┬────┘└───┬──┘└─────┬─────┘└─────┬─────┘ └───┬───┘
  // │         │         │            │           no _ or . at the end
  // │         │         │            │
  // │         │         │            allowed characters
  // │         │         │
  // │         │         no __ or _. or ._ or .. inside
  // │         │
  // │         no _ or . at the beginning
  // │
  // username is 3-20 characters long

  return {
    'fullName': {
      val: full_name,
      regex: fullNameRegex
    },
    username: {
      val: username,
      regex: usernameRegex
    },
    email: {
      val: email
    },
    password: {
      val: password,
      regex: passwordRegex
    },
    "confirmPassword": {
      val: confirm_password,
      fn: () => password.trim() == confirm_password.trim()
    }
  }
}
/**
 * @returns {{ full_name: String, username: String, email: String, password: String, confirm_password: string }}
 */
function getValuesFromForm() {
  const full_name = document.querySelector('#fullName').value
  const username = document.querySelector('#username').value
  const email = document.querySelector('#email').value
  const password = document.querySelector('#password').value
  const confirm_password = document.querySelector('#confirmPassword').value

  return {
    full_name,
    username,
    email,
    password,
    confirm_password
  }
}

function validateRegistrationForm() {
  return validateForm(generateFormObjectWithRegex(getValuesFromForm()))
}

export {
  validateRegistrationForm
}
import { validateForm } from './../utils/validation';

function generateFormObjectWithRegex({ email, password }) {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/ //Minimum eight characters, at least one letter and one number:

  return {
    email: {
      val: email
    },
    password: {
      val: password,
      regex: passwordRegex
    }
  }
}

function getValuesFromForm() {
  const email = document.querySelector('#email').value
  const password = document.querySelector('#password').value

  return {
    email,
    password
  }
}

function validateLoginForm() {
  return validateForm(generateFormObjectWithRegex(getValuesFromForm()))
}

export {
  validateLoginForm
}
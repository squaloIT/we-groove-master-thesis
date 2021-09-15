import { validateRegistrationForm } from './validation/registration-validation.js';
import { addErrBorder, removeErrBorder, displayErrorLabel, hideErrorLabel } from './utils/validation.js';

export default function registration() {
  Array.from(document.querySelectorAll('.form-control'))
    .forEach(el => {
      el.addEventListener('focus', () => {
        removeErrBorder(el)
      })
    });

  document.querySelector('form#registration-form')
    .addEventListener('submit', e => {
      e.preventDefault();

      const formValidationObject = validateRegistrationForm()
      const isErrorWhileValidating = Object.keys(formValidationObject)
        .filter(key => {
          const el = document.querySelector('#' + key)
          removeErrBorder(el)
          hideErrorLabel(el)
          return formValidationObject[key].is_valid === false
        }).length > 0;

      if (isErrorWhileValidating) {
        Object.keys(formValidationObject)
          .forEach(errFieldKey => {
            if (formValidationObject[errFieldKey].is_valid === false) {
              const el = document.querySelector('#' + errFieldKey)
              addErrBorder(el)
              displayErrorLabel(el)
            }
          })
      } else {
        document.querySelector('form#registration-form').submit();
      }
    });
}
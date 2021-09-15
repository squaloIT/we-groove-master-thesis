import { addErrBorder, removeErrBorder, displayErrorLabel, hideErrorLabel } from './utils/validation';
import { validateLoginForm } from './validation/login-validation';

export default function login() {
  document.querySelector('form#login-form')
    .addEventListener('submit', e => {
      e.preventDefault();

      const formValidationObject = validateLoginForm()
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
        document.querySelector('form#login-form').submit();
      }
    });
}
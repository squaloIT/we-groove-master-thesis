const validateForm = (formObject) => {
  const returnObj = {}
  Object.keys(formObject)
    .forEach(key => {
      if (formObject[key].fn) {
        returnObj[key] = {
          ...formObject[key],
          is_valid: formObject[key].fn()
        }
      } else {
        if (false == validateInput(formObject[key].val, formObject[key]?.regex)) {
          returnObj[key] = {
            ...formObject[key],
            is_valid: false
          }
        } else {
          returnObj[key] = {
            ...formObject[key],
            is_valid: true
          }
        }
      }
    })

  return returnObj
}

function removeErrBorder(el) {
  el.classList.remove('ring-1')
  el.classList.remove('ring-red-500');
}

function addErrBorder(el) {
  el.classList.add('ring-1')
  el.classList.add('ring-red-500')
}

function displayErrorLabel(el) {
  el.nextElementSibling.classList.remove('hidden')
  el.nextElementSibling.classList.add('block')
}

function hideErrorLabel(el) {
  el.nextElementSibling.classList.remove('block')
  el.nextElementSibling.classList.add('hidden')
}

const validateInput = (val, regex = null) => {
  if (!regex) {
    return !!val;
  }
  return val && new RegExp(regex).test(val)
}

const validateNumberOfImages = e => {
  if (e.target.files.length >= 5) {
    alert("Maximum is 4 images")
    e.target.value = ''
    return false;
  }

  return true;
}

export {
  validateForm,
  removeErrBorder,
  addErrBorder,
  displayErrorLabel,
  hideErrorLabel,
  validateNumberOfImages
}

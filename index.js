const storageKey = 'SimplePadContent'

document.addEventListener('DOMContentLoaded', function () {
  const textarea = document.querySelector('textarea')

  if (localStorage.getItem(storageKey)) {
    textarea.value = localStorage.getItem(storageKey) ?? ''
  } else {
    textarea.select()
  }

  textarea.addEventListener('input', () => {
    localStorage.setItem(storageKey, textarea.value)
  })
})

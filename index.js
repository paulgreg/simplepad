const throttle = (func, delay) => {
  let timeoutId = null
  return function (...args) {
    if (!timeoutId) {
      func.apply(this, args)
      timeoutId = setTimeout(() => {
        timeoutId = null
      }, delay)
    }
  }
}

const saveContent = (content) => {
  localStorage.setItem(storageKey, JSON.stringify(content))
}

const throttledSaveContent = throttle((content) => {
  saveContent(content)
}, 1000)

const quill = new Quill('#editor', {
  theme: 'bubble',
  modules: {
    toolbar: [
      [{ header: [false, 1, 2, 3, 4] }, { size: ['small', false, 'large'] }],
      [{ align: [] }, { color: [] }, { background: [] }],
      [
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'code-block',
        'link',
      ],
      [{ list: 'bullet' }, { list: 'ordered' }, { list: 'check' }],
    ],
  },
})

const storageKey = 'SimplePadContent'
const initialContent = [
  { insert: 'Welcome to Simple Pad\n', attributes: { bold: true } },
  {
    insert:
      "Everything you type here will be stored in (and only) our current device (until you clear browser's data).",
  },
  { insert: '\n' },
]

document.addEventListener('DOMContentLoaded', function () {
  try {
    const localStorageContent = localStorage.getItem(storageKey)
    if (localStorageContent) {
      const content = localStorageContent.startsWith('{')
        ? JSON.parse(localStorageContent)
        : [{ insert: localStorageContent }] // for migration from textarea
      quill.setContents(content)
    } else {
      quill.setContents(initialContent)
    }
  } catch (error) {
    console.error('Failed to parse content from localStorage', error)
  }

  quill.on('text-change', (_delta, _oldDelta, _source) =>
    throttledSaveContent(quill.getContents())
  )

  window.addEventListener('beforeunload', () => {
    saveContent(quill.getContents())
  })

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      saveContent(quill.getContents())
    }
  })
})

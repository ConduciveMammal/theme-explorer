
import browser from 'webextension-polyfill'
// import initSimpleSettings from './lib/simple-settings'

document.addEventListener('DOMContentLoaded', () => {
  // initSimpleSettings()
  // Saves options to chrome.storage
  function saveOptions() {
    var defaultPage = document.getElementById('default-page').value
    chrome.storage.sync.set({
      loadDefaultPage: defaultPage,
    }, function () {
      // Update status to let user know options were saved.
      var status = document.getElementById('status')
      status.textContent = `Options saved with ${defaultPage}`
      setTimeout(function () {
        status.textContent = ''
      }, 3000)
    })
  }

  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage.
  function restoreOptions() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
      loadDefaultPage: 'themes',
    }, function (items) {
      document.getElementById('default-page').value = items.loadDefaultPage
      document.getElementById('saved-setting').textContent = `<p>Default theme: <strong>${items.loadDefaultPage}</strong>.</p>`
    })
  }
  document.addEventListener('DOMContentLoaded', restoreOptions)
  document.getElementById('save').addEventListener('click',
    saveOptions)
})

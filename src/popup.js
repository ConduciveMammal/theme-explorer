import browser from 'webextension-polyfill'
import $ from 'jquery'
import Accordion from './js/modules/accordion'
import Preload from "./js/modules/preload";

import getThemes from './js/modules/themes';

const accordion = new Accordion()
const preload = new Preload()

document.addEventListener('DOMContentLoaded', function () {
  $('.Nav__Button').click(function () {
    let thisTab = $(this)
    let tabData = $(this).data('toggle')

    $(thisTab).addClass('Nav__Button--active').attr('data-tab', 'true')
    $('.Nav__Button').not(thisTab).removeClass('Nav__Button--active').attr('data-tab', 'false')
    switch (tabData) {
      case 'themes':
        getThemes()
        break
      default:
        break
    }
  })
})

window.onload = function () {
  if ($('[data-tab]') === 'active') {

  }
}

$('body').on('click', 'a[target="_blank"]', function (e) {
  e.preventDefault()
  chrome.tabs.create({
    url: $(this).prop('href'),
    active: false,
  })
  return false
})

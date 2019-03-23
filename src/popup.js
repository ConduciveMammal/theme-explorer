import browser from 'webextension-polyfill'
import $ from 'jquery'
import Accordion from './js/modules/accordion'
import Preload from './js/modules/preload'

import getThemes from './js/modules/themes'
// import getShop from './js/modules/shop'

const accordion = new Accordion()
const preload = new Preload()

document.addEventListener('DOMContentLoaded', function () {
  $('.Nav__Button').click(function () {
    let thisTab = $(this)
    let tabData = $(this).data('toggle')

    $(thisTab).addClass('Nav__Button--active').attr('data-tab', 'true')
    $('.Nav__Button').not(thisTab).removeClass('Nav__Button--active').attr('data-tab', 'false')

    const tabPanelID = `#${tabData}`
    $('.Panel').not(tabPanelID).attr('data-panel', 'disabled')
    $(tabPanelID).attr('data-panel', 'active')
    console.log(tabData);

    if (tabData == 'themes') {
      getThemes()
    } else if (tabData == 'apps') {
      alert('apps')
    } else if (tabData === '') {
      // getShop()
      alert('shop')
    } else if (tabData == 'products') {
      alert('products')
    } else if (tabData == 'collections') {
      alert('collections')
    }
  })

  getCurrentPage()
})

$('body').on('click', 'a[target="_blank"]', function (e) {
  e.preventDefault()
  chrome.tabs.create({
    url: $(this).prop('href'),
    active: false,
  })
  return false
})

function getCurrentPage() {
  chrome.tabs.getSelected(null, function (tab) {
    const currentUrl = tab.url
    const isAdmin = currentUrl.includes('.myshopify.com/admin')
    const shopDir = currentUrl.split('.com/').slice(1, 2)
    if (isAdmin) {
      const adminDir = currentUrl.split('/admin').slice(0, 3)
      const adminPanelID = `#${adminDir}`
      console.log('test');
      alert(adminDir);
      $('.Panel').not(adminPanelID).attr('data-panel', 'disabled')
      $('[data-popup-body]').find(adminPanelID).attr('data-panel', 'active')

      if (adminDir == 'themes') {
        getThemes()
      } else if (adminDir == 'apps') {
        alert('apps')
      } else if (shopDir === 'admin') {
        getShop()
        alert('shop')
      } else if (adminDir == 'products') {
        alert('products')
      } else if (adminDir == 'collections') {
        alert('collections')
      }
    }
  })
}

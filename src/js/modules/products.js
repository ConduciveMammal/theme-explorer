import $ from 'jquery'
import format from 'date-fns/format'

export default function () {
  chrome.tabs.getSelected(null, function (tab) {
    const tabUrl = tab.url
    const adminUrl = tabUrl.split('/admin')
    const adminPath = `${adminUrl[0]}/admin`
    const shopUrl = `${adminPath}/shop.json`
    $.ajax({
      type: 'GET',
      url: shopUrl,
      data: 'json',
      async: true,
      success: function (shops) {
        shopArr = shops.shop
        shop = {
          domain: shopArr.myshopify_domain,
        }
      },
      error: function (xhr, status, error) {
        let errorText
        switch (xhr.status) {
          case 404:
            errorText = 'Shopify admin was not found. Make sure the admin tab is focused.'
            break
          case 401:
            errorText = 'Admin access was not autorised. Please log in again.'
            break
          default:
            errorText = xhr.statusText
            break
        }
        const errorMessage = `
          <div class="Alert Alert--error">
            <div class="Alert__Icon-container">
              <svg class="Alert__Icon">
                <use xlink:href="#ErrorIcon" xmlns:xlink="http://www.w3.org/1999/xlink"></use>
              </svg>
            </div>
            <div class="Alert__Content">
              <p class="Alert__Message">${errorText}</p>
            </div>
          </div>
        `
        $('.Popup__Header').hide()
        $('[data-panel="active"]').empty().append(errorMessage)
      },
    })
  })
}

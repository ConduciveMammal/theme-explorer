import $ from 'jquery'
import format from 'date-fns/format'

export default function () {
  chrome.tabs.getSelected(null, function (tab) {
    const tabUrl = tab.url
    const adminUrl = tabUrl.split('/admin')
    const adminPath = `${adminUrl[0]}/admin`
    const shopUrl = `${adminPath}/shop.json`
    let shopDetails
    let location
    let currency
    let shopArr
    $.ajax({
      type: 'GET',
      url: shopUrl,
      data: 'json',
      async: true,
      beforeSend: function () {
        console.log('Loading!')
      },
      success: function (shops) {
        shopArr = shops.shop
        shopDetails = {
          owner: shopArr.shop_owner,
          email: shopArr.email,
          customerEmail: shopArr.customer_email,
          createdAt: format(shopArr.created_at, 'DD-MM-YYYY'),
          lastUpdated: format(shopArr.updated_at, 'DD-MM-YYYY'),
        }
        location = {
          address1: shopArr.address1,
          address2: shopArr.address2,
          city: shopArr.city,
          zip: shopArr.zip,
          country: shopArr.country_name,
          timezone: shopArr.timezone,
        }
        currency = {
          currency: shopArr.currency,
          moneyFormat: shopArr.money_format,
          moneyInEmailsFormat: shopArr.money_in_emails_format,
          moneyWithCurrencyFormat: shopArr.money_with_currency_format,
          moneyWithCurrencyInEmailsFormat: shopArr.money_with_currency_in_emails_format,
        }

        console.dir(shopArr)

        let shopAccordion = `
          <div class="Accordion__Container">
          <header class="Accordion__Header" data-accordion-toggle>
            <div class="Accordion__Icon-container">
            <svg viewBox="0 0 56 56" class="Accordion__Icon">
              <use xlink:href="#ShopIcon" xmlns:xlink="http://www.w3.org/1999/xlink"></use>
            </svg>
            </div>
            <p class="Accordion__Title">Shop Details</p>
          </header>
          <div class="Accordion__Body" data-accordion-body>
            <p class="Accordion__Detail">
              <span class="Accordion__Label">Shop Owner:</span>
              <span class="Accordion__Value">${shopDetails.owner}</span>
            </p>
            <p class="Accordion__Detail">
              <span class="Accordion__Label">Account Email:</span>
              <span class="Accordion__Value">${shopDetails.email}</span>
            </p>
            <p class="Accordion__Detail">
              <span class="Accordion__Label">Customer Email:</span>
              <span class="Accordion__Value">${shopDetails.customerEmail}</span>
            </p>
            <p class="Accordion__Detail">
              <span class="Accordion__Label">Store Created:</span>
              <span class="Accordion__Value">${shopDetails.createdAt}</span>
            </p>
            <p class="Accordion__Detail">
              <span class="Accordion__Label">Store Last Updated:</span>
              <span class="Accordion__Value">${shopDetails.lastUpdated}</span>
            </p>
          </div>
        </div>`
        let locationAccordion = `
          <div class="Accordion__Container">
          <header class="Accordion__Header" data-accordion-toggle>
            <div class="Accordion__Icon-container">
              <svg viewBox="0 0 56 56" class="Accordion__Icon">
                <use xlink:href="#LocationIcon" xmlns:xlink="http://www.w3.org/1999/xlink"></use>
              </svg>
            </div>
            <p class="Accordion__Title">Location Details</p>
          </header>
          <div class="Accordion__Body" data-accordion-body>
          <p class="Accordion__Detail">
          <span class="Accordion__Label">Address 1:</span>
          <span class="Accordion__Value">${location.address1}</span>
            </p>
            <p class="Accordion__Detail">
              <span class="Accordion__Label">Address 2:</span>
              <span class="Accordion__Value">${location.address2}</span>
            </p>
            <p class="Accordion__Detail">
              <span class="Accordion__Label">City:</span>
              <span class="Accordion__Value">${location.city}</span>
            </p>
            <p class="Accordion__Detail">
              <span class="Accordion__Label">Zip:</span>
              <span class="Accordion__Value">${location.zip}</span>
            </p>
            <p class="Accordion__Detail">
              <span class="Accordion__Label">Country:</span>
              <span class="Accordion__Value">${location.country}</span>
            </p>
            <p class="Accordion__Detail">
              <span class="Accordion__Label">Timezone:</span>
              <span class="Accordion__Value">${location.timezone}</span>
            </p>
          </div>
        </div>`
        let currencyAccordion = `
          <div class="Accordion__Container">
          <header class="Accordion__Header" data-accordion-toggle>
            <div class="Accordion__Icon-container">
              <svg viewBox="0 0 56 56" class="Accordion__Icon">
                <use xlink:href="#CurrencyIcon" xmlns:xlink="http://www.w3.org/1999/xlink"></use>
              </svg>
            </div>
            <p class="Accordion__Title">Currency Details</p>
          </header>
          <div class="Accordion__Body" data-accordion-body>
          <p class="Accordion__Detail">
          <span class="Accordion__Label">Currency:</span>
          <span class="Accordion__Value">${currency.currency}</span>
            </p>
            <p class="Accordion__Detail">
              <span class="Accordion__Label">Money Format:</span>
              <span class="Accordion__Value">${currency.moneyFormat}</span>
            </p>
            <p class="Accordion__Detail">
              <span class="Accordion__Label">Money in Emails Format:</span>
              <span class="Accordion__Value">${currency.moneyInEmailsFormat}</span>
            </p>
            <p class="Accordion__Detail">
              <span class="Accordion__Label">Money with Currency Format:</span>
              <span class="Accordion__Value">${currency.moneyWithCurrencyFormat}</span>
            </p>
            <p class="Accordion__Detail">
              <span class="Accordion__Label">Money with Currency in Emails Format:</span>
              <span class="Accordion__Value">${currency.moneyWithCurrencyInEmailsFormat}</span>
            </p>
          </div>
        </div>`
        let jsonAccordion = `
          <div class="Accordion__Container">
          <header class="Accordion__Header" data-accordion-toggle>
            <div class="Accordion__Icon-container">
            <svg viewBox="0 0 56 56" class="Accordion__Icon">
              <use xlink:href="#JsonIcon" xmlns:xlink="http://www.w3.org/1999/xlink"></use>
            </svg>
            </div>
            <p class="Accordion__Title">
              <a href="${shopUrl}" target="_blank">View JSON</a>
            </p>
          </header>
        </div>`

        let shop
        shop = {
          name: shopArr.name,
          id: shopArr.id,
          myshopify: shopArr.myshopify_domain,
          domain: shopArr.domain,
        }

        $('.Header__Title').empty().text(shop.name)
        $('.Subtitle--Aside small').empty().text(`Store ID: ${shop.id}`)
        $('.Subtitle--Primary').empty().text(shop.myshopify)
        $('.Subtitle--Secondary').empty().text(shop.domain)

        $('[data-panel="active"]').append(shopAccordion).append(locationAccordion).append(currencyAccordion).append(jsonAccordion)
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
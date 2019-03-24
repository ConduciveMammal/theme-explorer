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
      async: false,
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
              <svg xmlns="http://www.w3.org/2000/svg" class="Accordion__Icon" viewBox="0 0 489.4 489.4"><path d="M347.7 263.75h-66.5c-18.2 0-33 14.8-33 33v51c0 18.2 14.8 33 33 33h66.5c18.2 0 33-14.8 33-33v-51c0-18.2-14.8-33-33-33zm9 84c0 5-4.1 9-9 9h-66.5c-5 0-9-4.1-9-9v-51c0-5 4.1-9 9-9h66.5c5 0 9 4.1 9 9v51z"/><path d="M489.4 171.05c0-2.1-.5-4.1-1.6-5.9l-72.8-128c-2.1-3.7-6.1-6.1-10.4-6.1H84.7c-4.3 0-8.3 2.3-10.4 6.1l-72.7 128c-1 1.8-1.6 3.8-1.6 5.9 0 28.7 17.3 53.3 42 64.2v211.1c0 6.6 5.4 12 12 12h381.3c6.6 0 12-5.4 12-12v-209.6c0-.5 0-.9-.1-1.3 24.8-10.9 42.2-35.6 42.2-64.4zM91.7 55.15h305.9l56.9 100.1H34.9l56.8-100.1zm256.6 124c-3.8 21.6-22.7 38-45.4 38s-41.6-16.4-45.4-38h90.8zm-116.3 0c-3.8 21.6-22.7 38-45.4 38s-41.6-16.4-45.5-38H232zm-207.2 0h90.9c-3.8 21.6-22.8 38-45.5 38-22.7.1-41.6-16.4-45.4-38zm176.8 255.2h-69v-129.5c0-9.4 7.6-17.1 17.1-17.1h34.9c9.4 0 17.1 7.6 17.1 17.1v129.5h-.1zm221.7 0H225.6v-129.5c0-22.6-18.4-41.1-41.1-41.1h-34.9c-22.6 0-41.1 18.4-41.1 41.1v129.6H66v-193.3c1.4.1 2.8.1 4.2.1 24.2 0 45.6-12.3 58.2-31 12.6 18.7 34 31 58.2 31s45.5-12.3 58.2-31c12.6 18.7 34 31 58.1 31 24.2 0 45.5-12.3 58.1-31 12.6 18.7 34 31 58.2 31 1.4 0 2.7-.1 4.1-.1v193.2zm-4.1-217.1c-22.7 0-41.6-16.4-45.4-38h90.9c-3.9 21.5-22.8 38-45.5 38z"/></svg>
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
              <svg xmlns="http://www.w3.org/2000/svg" class="Accordion__Icon"  viewBox="0 0 477 477" width="512" height="512"><path d="M238.4 0C133 0 47.2 85.8 47.2 191.2c0 12 1.1 24.1 3.4 35.9.1.7.5 2.8 1.3 6.4 2.9 12.9 7.2 25.6 12.8 37.7 20.6 48.5 65.9 123 165.3 202.8 2.5 2 5.5 3 8.5 3s6-1 8.5-3c99.3-79.8 144.7-154.3 165.3-202.8 5.6-12.1 9.9-24.7 12.8-37.7.8-3.6 1.2-5.7 1.3-6.4 2.2-11.8 3.4-23.9 3.4-35.9C429.6 85.8 343.8 0 238.4 0zm161.2 222.4c0 .2-.1.4-.1.6-.1.5-.4 2-.9 4.3v.2c-2.5 11.2-6.2 22.1-11.1 32.6-.1.1-.1.3-.2.4-18.7 44.3-59.7 111.9-148.9 185.6-89.2-73.7-130.2-141.3-148.9-185.6-.1-.1-.1-.3-.2-.4-4.8-10.4-8.5-21.4-11.1-32.6v-.2c-.6-2.3-.8-3.8-.9-4.3 0-.2-.1-.4-.1-.7-2-10.3-3-20.7-3-31.2 0-90.5 73.7-164.2 164.2-164.2s164.2 73.7 164.2 164.2c0 10.6-1 21.1-3 31.3z" data-original="#000000" class="active-path" data-old_color="#FDFBFB" fill="#FFF"/><path d="M238.4 71.9c-66.9 0-121.4 54.5-121.4 121.4s54.5 121.4 121.4 121.4 121.4-54.5 121.4-121.4S305.3 71.9 238.4 71.9zm0 215.8c-52.1 0-94.4-42.4-94.4-94.4s42.4-94.4 94.4-94.4 94.4 42.4 94.4 94.4-42.3 94.4-94.4 94.4z" data-original="#000000" class="active-path" data-old_color="#FDFBFB" fill="#FFF"/></svg>
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
              <svg xmlns="http://www.w3.org/2000/svg" class="Accordion__Icon" width="512" height="512" viewBox="0 0 512 512"><path d="M256 0C114.609 0 0 114.609 0 256c0 141.391 114.609 256 256 256 141.391 0 256-114.609 256-256C512 114.609 397.391 0 256 0zm0 472c-119.297 0-216-96.703-216-216S136.703 40 256 40s216 96.703 216 216-96.703 216-216 216z" data-original="#000000" class="active-path" data-old_color="#ffffff" fill="#fff"/><path d="M340.812 384H171.188v-25.969c22.844-10.812 43.359-34.062 43.359-61.906 0-7 0-13.188-1.547-20.562h-38.344v-32.905h32.938c-1.562-10.469-3.5-23.25-3.5-36.031 0-47.641 33.688-78.625 81.75-78.625 20.5 0 35.642 4.656 43.75 9.281l-8.531 36.031c-7.375-3.875-18.188-7.359-33.297-7.359-29.047 0-39.108 19.375-39.108 42.219 0 12.797 1.531 23.641 4.25 34.484h54.188v32.905h-49.938c.375 11.625.375 23.25-2.688 34.484-3.891 13.172-11.625 24.375-22.5 34.062v.766h108.844V384h-.002z" data-original="#000000" class="active-path" data-old_color="#ffffff" fill="#fff"/></svg>
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
              <svg class="Accordion__Icon" height="512" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M512.53 312.621c-27.16 0-49.182 22.022-49.182 49.182s22.022 49.181 49.182 49.181c27.161 0 49.183-22.02 49.183-49.18S539.69 312.62 512.53 312.62zm0 229.506c-18.13 0-32.804 14.696-32.804 32.804v98.35c0 18.107 14.673 32.804 32.804 32.804 18.13 0 32.78-14.696 32.78-32.804v-98.35c0-18.108-14.65-32.804-32.78-32.804zm412.831-62.942c-36.165 0-65.583-29.754-65.583-66.353v-96.49c0-69.857-56.145-126.675-125.163-126.675H702.82c-16.45 0-29.802 13.495-29.802 30.162 0 16.642 13.352 30.162 29.802 30.162h31.794c36.14 0 65.559 29.753 65.559 66.352v96.49c0 38.615 17.17 73.267 44.186 96.514-27.015 23.245-44.186 57.875-44.186 96.513v96.477c0 36.598-29.418 66.376-65.56 66.376h-31.793c-16.45 0-29.802 13.495-29.802 30.162 0 16.665 13.352 30.163 29.802 30.163h31.794c69.017 0 125.163-56.818 125.163-126.7v-96.477c0-36.599 29.418-66.352 65.583-66.352 16.45 0 29.802-13.496 29.802-30.162 0-16.642-13.352-30.162-29.802-30.162zm-700.474-66.353v-96.49c0-36.598 29.394-66.351 65.56-66.351h31.795c16.45 0 29.801-13.52 29.801-30.162 0-16.667-13.35-30.162-29.801-30.162h-31.795c-69.017 0-125.163 56.818-125.163 126.676v96.49c0 36.598-29.442 66.352-65.583 66.352-16.45 0-29.803 13.519-29.803 30.162 0 16.665 13.353 30.162 29.803 30.162 36.141 0 65.583 29.753 65.583 66.352v96.477c0 69.882 56.146 126.7 125.163 126.7h31.795c16.45 0 29.801-13.497 29.801-30.163 0-16.667-13.35-30.162-29.801-30.162h-31.795c-36.166 0-65.56-29.78-65.56-66.376V605.86c0-38.64-17.17-73.269-44.186-96.513 27.015-23.246 44.186-57.9 44.186-96.515z"/></svg>
            </div>
            <p class="Accordion__Title">
              <a href="${shopUrl}" target="_blank">View JSON</a>
            </p>
          </header>
        </div>`
        $('[data-panel="active"]').append(shopAccordion).append(locationAccordion).append(currencyAccordion).append(jsonAccordion)

      },
      error: function () {
        console.log('Ah tits!')
      },
    })
  })
}

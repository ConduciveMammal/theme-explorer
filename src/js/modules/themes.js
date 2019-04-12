import $ from 'jquery'
import format from 'date-fns/format'

export default function () {
  chrome.tabs.getSelected(null, function (tab) {
    const tabUrl = tab.url
    const adminUrl = tabUrl.split('/admin')
    const adminPath = `${adminUrl[0]}/admin`
    const shopUrl = `${adminPath}/shop.json`
    const themeUrl = `${adminPath}/themes.json`
    let shop
    let shopArr
    $.ajax({
      type: 'GET',
      url: shopUrl,
      data: 'json',
      async: false,
      success: function (shops) {
        shopArr = shops.shop
        shop = {
          domain: shopArr.myshopify_domain,
        }
      },
    })

    $.ajax({
      type: 'GET',
      url: themeUrl,
      data: 'json',
      async: false,
      beforeSend: function () {
        console.log('Loading!')
      },
      success: function (themes) {
        const themeArr = themes.themes
        for (let i = 0; i < themeArr.length; i++) {
          let themePreviewUrl = `http://${shop.domain}/?preview_theme_id=${themeArr[i].id}`

          let theme = {
            name: themeArr[i].name,
            id: themeArr[i].id,
            previewUrl: `${themePreviewUrl}`,
            role: themeArr[i].role,
            createdAt: format(themeArr[i].created_at, 'DD-MM-YYYY'),
            lastUpdated: format(themeArr[i].updated_at, 'DD-MM-YYYY'),
          }
          let themeAccordion = `
          <div class="Accordion__Container">
          <header class="Accordion__Header" data-accordion-toggle>
            <div class="Accordion__Icon-container">
            <svg class="Accordion__Icon">
              <use xlink:href="#ThemeIcon" xmlns:xlink="http://www.w3.org/1999/xlink"></use>
           </svg>
            </div>
            <p class="Accordion__Title">${theme.name}</p>
            <p class="Accordion__Link">
              <a href="${themePreviewUrl}" target="_blank">Preview</a>
            </p>
          </header>
          <div class="Accordion__Body" data-accordion-body>
            <p class="Accordion__Detail">
              <span class="Accordion__Label">Theme ID:</span>
              <span class="Accordion__Value">${theme.id}</span>
            </p>
            <p class="Accordion__Detail">
              <span class="Accordion__Label">Role:</span>
              <span class="Accordion__Value">${theme.role}</span>
            </p>
            <p class="Accordion__Detail">
              <span class="Accordion__Label">Updated at:</span>
              <span class="Accordion__Value">${theme.createdAt}</span>
            </p>
            <p class="Accordion__Detail">
              <span class="Accordion__Label">Created at:</span>
              <span class="Accordion__Value">${theme.lastUpdated}</span>
            </p>
          </div>
        </div>`
          $('[data-panel="active"]').append(themeAccordion)
        }

        let jsonAccordion = `
          <div class="Accordion__Container">
          <header class="Accordion__Header" data-accordion-toggle>
            <div class="Accordion__Icon-container">
              <svg class="Accordion__Icon">
                <use xlink:href="#JsonIcon" xmlns:xlink="http://www.w3.org/1999/xlink"></use>
              </svg>
            </div>
            <p class="Accordion__Title">
              <a href="${themeUrl}" target="_blank">View JSON</a>
            </p>
          </header>
        </div>`

        $('[data-panel="active"]').append(jsonAccordion)
      },
      onError: function () {
        console.log('Ah tits!')
      },
    })
  })
}

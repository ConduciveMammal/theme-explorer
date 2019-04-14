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

    $.ajax({
      type: 'GET',
      url: themeUrl,
      data: 'json',
      async: true,
      beforeSend: function () {
        console.log('Loading!')
      },
      success: function (themes, response) {
        const themeArr = themes.themes
        for (let i = 0; i < themeArr.length; i++) {
          const themePreviewUrl = `https://${shop.domain}/?preview_theme_id=${themeArr[i].id}`
          const themeJsonUrl = `https://${shop.domain}/admin/themes/${themeArr[i].id}.json`
          const themeCustomiseUrl = `https://${shop.domain}/admin/themes/${themeArr[i].id}/editor`

          let theme = {
            name: themeArr[i].name,
            id: themeArr[i].id,
            previewUrl: `${themePreviewUrl}`,
            role: themeArr[i].role,
            createdAt: format(themeArr[i].created_at, 'DD-MM-YYYY'),
            lastUpdated: format(themeArr[i].updated_at, 'DD-MM-YYYY'),
            themeJson: `${themeJsonUrl}`,
            customiseUrl: `${themeCustomiseUrl}`,
          }

          if (theme.role === 'main') {
            let main
            main = {
              title: theme.name,
              id: theme.id,
              updated_at: theme.lastUpdated,
              created_at: theme.createdAt,
            }

            $('.Header__Title').empty().text(main.title)
            $('.Subtitle--Aside').empty().append(`<small>Theme ID: ${main.id}</small>`)
            $('.Subtitle--Primary').empty().text(`Updated: ${main.updated_at}`)
            $('.Subtitle--Secondary').empty().text(`Created: ${main.created_at}`)
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
            <footer class="Accordion__Footer">
              <p class="Footer__Link">
                <a href="${theme.themeJson}" target="_blank">View JSON</a>
              </p>
              <p class="Footer__Link">
                <a href="${theme.customiseUrl}" target="_blank">Customise</a>
              </p>
            </footer>
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
            errorText = xhr.status
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
        $('[data-panel="active"]').append(errorMessage)
      },
    })
  })
}

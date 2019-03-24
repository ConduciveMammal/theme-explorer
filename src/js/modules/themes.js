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
              <svg class="Icon Accordion__Icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M475.691.021c-14.656 0-27.776 8.725-33.451 22.251l-32.64 77.973c-9.728-9.152-22.421-14.933-36.267-14.933h-320C23.936 85.312 0 109.248 0 138.645v320c0 29.397 23.936 53.333 53.333 53.333h320c29.397 0 53.333-23.936 53.333-53.333V225.152l81.92-172.821c2.24-4.757 3.413-10.048 3.413-16.043C512 16.299 495.701.021 475.691.021zm-70.358 458.624c0 17.643-14.357 32-32 32h-320c-17.643 0-32-14.357-32-32v-320c0-17.643 14.357-32 32-32h320c11.243 0 21.312 6.101 27.072 15.573l-37.739 90.197v-52.437c0-5.888-4.779-10.667-10.667-10.667H74.667c-5.888 0-10.667 4.779-10.667 10.667v85.333c0 5.888 4.779 10.667 10.667 10.667h269.76l-8.939 21.333h-90.155c-5.888 0-10.667 4.779-10.667 10.667v128c0 .277.128.512.149.789-8.768 7.787-14.144 10.389-14.528 10.539a10.68 10.68 0 0 0-6.699 7.616 10.706 10.706 0 0 0 2.859 9.941c15.445 15.445 36.757 21.333 57.6 21.333 26.645 0 52.48-9.643 64.128-21.333 16.768-16.768 29.056-50.005 19.776-74.773l47.381-99.925v188.48zm-134.698-61.12c2.944-9.685 5.739-18.859 14.229-27.349 15.083-15.083 33.835-15.083 48.917 0 13.504 13.504 3.2 45.717-10.667 59.584-11.563 11.541-52.672 22.677-80.256 8.256 3.669-2.859 7.893-6.549 12.672-11.328 8.918-8.939 12.075-19.221 15.105-29.163zM256 375.339v-76.672h70.571l-16.363 39.083c-14.251-.256-28.565 5.483-40.448 17.387-6.635 6.634-10.752 13.524-13.76 20.202zm75.264-32.598l28.715-68.629 16.128 7.915-32.555 68.651c-3.947-3.201-8.021-5.931-12.288-7.937zm10.069-172.096v64h-256v-64h256zM489.28 43.243l-104.064 219.52-17.003-8.341 54.08-129.237 39.616-94.677c2.325-5.568 7.744-9.152 13.803-9.152 8.235 0 14.933 6.699 14.933 15.659 0 2.132-.469 4.329-1.365 6.228z"/><path d="M181.333 277.312H74.667c-5.888 0-10.667 4.779-10.667 10.667v149.333c0 5.888 4.779 10.667 10.667 10.667h106.667c5.888 0 10.667-4.779 10.667-10.667V287.979c-.001-5.888-4.78-10.667-10.668-10.667zm-10.666 149.333H85.333v-128h85.333v128z"/></svg>
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
              <svg class="Accordion__Icon" height="512" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M512.53 312.621c-27.16 0-49.182 22.022-49.182 49.182s22.022 49.181 49.182 49.181c27.161 0 49.183-22.02 49.183-49.18S539.69 312.62 512.53 312.62zm0 229.506c-18.13 0-32.804 14.696-32.804 32.804v98.35c0 18.107 14.673 32.804 32.804 32.804 18.13 0 32.78-14.696 32.78-32.804v-98.35c0-18.108-14.65-32.804-32.78-32.804zm412.831-62.942c-36.165 0-65.583-29.754-65.583-66.353v-96.49c0-69.857-56.145-126.675-125.163-126.675H702.82c-16.45 0-29.802 13.495-29.802 30.162 0 16.642 13.352 30.162 29.802 30.162h31.794c36.14 0 65.559 29.753 65.559 66.352v96.49c0 38.615 17.17 73.267 44.186 96.514-27.015 23.245-44.186 57.875-44.186 96.513v96.477c0 36.598-29.418 66.376-65.56 66.376h-31.793c-16.45 0-29.802 13.495-29.802 30.162 0 16.665 13.352 30.163 29.802 30.163h31.794c69.017 0 125.163-56.818 125.163-126.7v-96.477c0-36.599 29.418-66.352 65.583-66.352 16.45 0 29.802-13.496 29.802-30.162 0-16.642-13.352-30.162-29.802-30.162zm-700.474-66.353v-96.49c0-36.598 29.394-66.351 65.56-66.351h31.795c16.45 0 29.801-13.52 29.801-30.162 0-16.667-13.35-30.162-29.801-30.162h-31.795c-69.017 0-125.163 56.818-125.163 126.676v96.49c0 36.598-29.442 66.352-65.583 66.352-16.45 0-29.803 13.519-29.803 30.162 0 16.665 13.353 30.162 29.803 30.162 36.141 0 65.583 29.753 65.583 66.352v96.477c0 69.882 56.146 126.7 125.163 126.7h31.795c16.45 0 29.801-13.497 29.801-30.163 0-16.667-13.35-30.162-29.801-30.162h-31.795c-36.166 0-65.56-29.78-65.56-66.376V605.86c0-38.64-17.17-73.269-44.186-96.513 27.015-23.246 44.186-57.9 44.186-96.515z"/></svg>
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

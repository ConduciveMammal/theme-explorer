import $ from 'jquery'



export default function () {
  chrome.tabs.getSelected(null, function (tab) {
    const tabUrl = tab.url
    const adminUrl = tabUrl.split('/admin')
    const adminPath = `${adminUrl[0]}/admin`
    const permUrl = '.myshopify.com/admin'
    const jsonUrl = {
      shop: `${adminPath}/shop.json`,
      theme: `${adminPath}/themes.json`,
      products: `${adminPath}/products.json`,
      collections: `${adminPath}/collections.json`
    }
    const themeUrl = `${adminPath}/themes.json`
    let shop
    let shopArr
    $.ajax({
      type: 'GET',
      url: jsonUrl.shop,
      data: 'json',
      async: false,
      success: function (shops) {
        shopArr = shops.shop
        shop = {
          domain: shopArr.myshopify_domain,
        }
      }
    })

    $.ajax({
      type: 'GET',
      url: themeUrl,
      data: 'json',
      async: false,
      beforeSend: function () {
        let showLoading = true
        console.log('Loading!')
      },
      success: function (themes) {
        const themeArr = themes.themes
        for (let i = 0; i < themeArr.length; i++) {
          let themePreviewUrl = `http://${shop.domain}/?fts=0&preview_theme_id=${themeArr[i].id}`
          console.log(themeArr[0]);

          let theme = {
            name: themeArr[i].name,
            id: themeArr[i].id,
            previewUrl: `${themePreviewUrl}`,
            status: themeArr[i].role,
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
              <span class="Accordion__Value">26/10/2017</span>
            </p>
            <p class="Accordion__Detail">
              <span class="Accordion__Label">Created at:</span>
              <span class="Accordion__Value">16/11/2016</span>
            </p>
          </div>
        </div>`
          $('[data-popup-body]').append(themeAccordion)
        }

      },
      error: function () {
        console.log('Ah tits!');

      }
    })
  })
}

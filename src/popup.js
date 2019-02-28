import browser from 'webextension-polyfill'
import $ from 'jquery'
import Polaris from './polaris'

// const polaris = new Polaris()


chrome.tabs.getSelected(null, function (tab) {
  const tabUrl = tab.url
  const adminUrl = tabUrl.split('/admin');
  const adminPath = `${adminUrl[0]}/admin`
  const permUrl = '.myshopify.com/admin'
  const themeUrl = `${adminPath}/themes.json`
  if (tabUrl.includes(permUrl)) {
    let shop
    let shopArr
    $.ajax({
      type: 'GET',
      url: `${adminPath}/shop.json`,
      data: 'json',
      async: false,
      success: function (shops) {
        shopArr = shops.shop
        shop = {
          domain: shopArr.myshopify_domain,
        }
      },
      error: function () {
        console.log('fail')
      },
    })
    const themePreviewUrl = `http://${shop.domain}/?fts=0&preview_theme_id=`

    $.getJSON(themeUrl, function (themes) {
      const themeArr = themes.themes
      for (let i = 0; i < themeArr.length; i++) {
        let theme = {
          name: themeArr[i].name,
          id: themeArr[i].id,
          previewUrl: `${themePreviewUrl}${themeArr[0].id}`,
          status: themeArr[i].role,
        }
        const cardHeaderActions = `<div style="--top-bar-background:#00848e; --top-bar-color:#f9fafb; --top-bar-background-darker:#006d74; --top-bar-background-lighter:#1d9ba4;">
          <div class="Polaris-Card">
            <div class="Polaris-Card__Header">
              <div class="Polaris-Stack Polaris-Stack--alignmentBaseline">
                <div class="Polaris-Stack__Item Polaris-Stack__Item--fill">
                  <h2 class="Polaris-Heading">${theme.name}</h2>
                </div>
                <div class="Polaris-Stack__Item">
                  <div class="Polaris-Stack__Item"><span class="Polaris-Badge">${theme.status}</span></div>
                </div>
              </div>
            </div>
            <div class="Polaris-Card__Section">
              <p>Theme ID: <strong>${theme.id}</strong></p>
            </div>
            <div class="Polaris-Card__Footer">
              <div style="--top-bar-background:#00848e; --top-bar-color:#f9fafb; --top-bar-background-darker:#006d74; --top-bar-background-lighter:#1d9ba4;"><a href="${theme.previewUrl}" target="_blank" class="Polaris-Button Polaris-Button--plain"><span class="Polaris-Button__Content"><span class="Polaris-Button__Text">Preview</span></span></a></div>
          </div>
          </div>
          </div>`

        $('#products').append(cardHeaderActions)
      }
    })
  } else {
    const skeletonCard = `<div style="--top-bar-background:#00848e; --top-bar-color:#f9fafb; --top-bar-background-darker:#006d74; --top-bar-background-lighter:#1d9ba4;">
    <div class="Polaris-Card">
    <div style="--top-bar-background:#00848e; --top-bar-color:#f9fafb; --top-bar-background-darker:#006d74; --top-bar-background-lighter:#1d9ba4;">
    <div class="Polaris-Banner Polaris-Banner--statusCritical Polaris-Banner--withinPage" tabindex="0" role="alert" aria-live="polite" aria-labelledby="Banner3Heading" aria-describedby="Banner3Content">
      <div class="Polaris-Banner__Ribbon"><span class="Polaris-Icon Polaris-Icon--colorRedDark Polaris-Icon--isColored Polaris-Icon--hasBackdrop"><svg class="Polaris-Icon__Svg" viewBox="0 0 20 20" focusable="false" aria-hidden="true">
            <g fill-rule="evenodd">
              <circle fill="currentColor" cx="10" cy="10" r="9"></circle>
              <path d="M2 10c0-1.846.635-3.543 1.688-4.897l11.209 11.209A7.954 7.954 0 0 1 10 18c-4.411 0-8-3.589-8-8m14.312 4.897L5.103 3.688A7.954 7.954 0 0 1 10 2c4.411 0 8 3.589 8 8a7.952 7.952 0 0 1-1.688 4.897M0 10c0 5.514 4.486 10 10 10s10-4.486 10-10S15.514 0 10 0 0 4.486 0 10"></path>
            </g>
          </svg></span></div>
      <div>
        <div class="Polaris-Banner__Heading" id="Banner3Heading">
          <p class="Polaris-Heading">Shopify Admin not found.</p>
        </div>
        <div class="Polaris-Banner__Content" id="Banner3Content">
          <p>Please make sure you are logged in and currently viewing any Shopify Admin screen.</p>
        </div>
      </div>
    </div>
  </div>
    </div>
  </div>`

    $('#products').append(skeletonCard)
  }
})

$('body').on('click', 'a[target="_blank"]', function (e) {
  e.preventDefault();
  chrome.tabs.create({
    url: $(this).prop('href'),
    active: false,
  })
  return false
})

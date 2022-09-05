function getThemeDataAndSendItToExt() {
  if (window.location.href.indexOf("myshopify.com/admin") > -1) return;

  if ((typeof Shopify !== 'undefined' && typeof Shopify.theme !== 'undefined') || (typeof Shopify !== 'undefined' && typeof Shopify.shop !== 'undefined')) {
    window.postMessage(
      {
        type: 'theme',
        data: {
          theme: {
            handle: Shopify.theme.handle,
            id: Shopify.theme.id,
            name: Shopify.theme.name,
            role: Shopify.theme.role,
          },
          shop: Shopify.shop,
          location: window.location.href
        },
      },
      '*'
    );
  }
}

getThemeDataAndSendItToExt();
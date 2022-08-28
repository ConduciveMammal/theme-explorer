function getThemeDataAndSendItToExt() {
  if (window.location.href.indexOf("myshopify.com/admin") > -1) return;

  if ((typeof window.Shopify === 'undefined' && typeof window.Shopify.theme === 'undefined') || (typeof window.Shopify === 'undefined' && typeof window.Shopify.shop === 'undefined')) {
    getThemeDataAndSendItToExt();
  } else {
    window.postMessage(
      {
        type: 'theme',
        data: {
          theme: {
            handle: window.Shopify.theme.handle,
            id: window.Shopify.theme.id,
            name: window.Shopify.theme.name,
            role: window.Shopify.theme.role,
          },
          shop: window.Shopify.shop,
          location: window.location.href
        },
      },
      '*'
    );
  }
}

getThemeDataAndSendItToExt();
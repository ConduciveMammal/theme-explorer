function getThemeDataAndSendItToExt() {
  console.log('thing');
  if (window.location.href.indexOf("admin.shopify.com/store") > -1) return;

  console.log('Shopify', window.Shopify);
  if ((typeof Shopify !== 'undefined' && typeof Shopify.theme !== 'undefined') || (typeof Shopify !== 'undefined' && typeof Shopify.shop !== 'undefined')) {
    console.log('Shopify', Shopify);
    window.postMessage(
      {
        type: 'theme',
        data: {
          shopify: 'Shopify',
          theme: {
            handle: Shopify.theme.handle,
            id: Shopify.theme.id,
            name: Shopify.theme.name,
            role: Shopify.theme.role,
          },
          shop: Shopify.shop,
          shopHandle: Shopify.shop,
          location: window.location.href
        },
      },
      '*'
    );
  }
}

getThemeDataAndSendItToExt();
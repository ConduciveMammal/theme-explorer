function getThemeDataAndSendItToExt() {
  console.log('thing');
  if (window.location.href.includes('admin.shopify.com/store')) return;

  console.log('Shopify', window.Shopify);
  if (window.Shopify && (Shopify.theme || Shopify.shop)) {
    console.log('Shopify', Shopify);
    const themeData = {
      type: 'theme',
      data: {
        theme: Shopify.theme
          ? {
              handle: Shopify.theme.handle,
              id: Shopify.theme.id,
              name: Shopify.theme.name,
              role: Shopify.theme.role,
            }
          : undefined,
        shop: Shopify.shop,
        location: window.location.href,
      },
    };

    window.postMessage(themeData, window.location.origin);
  }
}

getThemeDataAndSendItToExt();

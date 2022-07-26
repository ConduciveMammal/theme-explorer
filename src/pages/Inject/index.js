window.postMessage(
  {
    type: 'theme',
    data: {
      theme: window.Shopify.theme,
      shop: window.Shopify.shop,
      location: window.location.href
    },
  },
  '*'
);

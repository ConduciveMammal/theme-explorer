const updateUrlBase = 'https://theme-explorer.merlyndesignworks.co.uk/releases';
const extensionApi =
  (typeof browser !== 'undefined' && browser) ||
  (typeof chrome !== 'undefined' && chrome) ||
  null;

if (extensionApi?.runtime?.onInstalled?.addListener) {
  extensionApi.runtime.onInstalled.addListener((details) => {
    const currentVersion = extensionApi.runtime.getManifest().version;
    const previousVersion = details.previousVersion;
    const reason = details.reason;

    switch (reason) {
      case 'install':
        console.log('New User installed the extension.');
        break;
      case 'update':
        if (extensionApi?.tabs?.create) {
          extensionApi.tabs.create({
            url: `${updateUrlBase}/${currentVersion.replaceAll(
              '.',
              '_'
            )}?updateFrom=${previousVersion}`,
            active: true,
          });
        }
        break;
      default:
        break;
    }
  });
}

const updateUrlBase = 'https://theme-explorer.merlyndesignworks.co.uk/releases';

chrome.runtime.onInstalled.addListener((details) => {
  const currentVersion = chrome.runtime.getManifest().version;
  const previousVersion = details.previousVersion;
  const reason = details.reason;

  switch (reason) {
    case 'install':
      console.log('New User installed the extension.');
      break;
    case 'update':
      chrome.tabs.create({
        url: `${updateUrlBase}/${currentVersion.replaceAll(
          '.',
          '_'
        )}?updateFrom=${previousVersion}`,
        active: true,
      });
      break;
    default:
      break;
  }
});

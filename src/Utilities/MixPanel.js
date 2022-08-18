import mixpanel from 'mixpanel-browser';

const MixPanel = (event, properties = null) => {
  const mixToken = '6b530b69968bedf0d37ea146bd759cda';
  console.log('MixPanel', event, properties);
  mixpanel.init(mixToken, {debug: true});
  mixpanel.track(event, properties);
}

export default MixPanel;

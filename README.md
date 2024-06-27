# react-native-idx-dmp-sdk

IDX DMP react-native SDK

## Installation

```sh
yarn add react-native-idx-dmp-sdk
```

## App configuration

Add new key and value to `Info.plist` file

```xml
<key>NSUserTrackingUsageDescription</key>
<string>It makes our adwords more compatibility with your interests</string>
```

## Usage

```js
import {
  initSdk,
  sendEvent,
  getCustomAdTargeting,
  resetUserState,
} from 'react-native-idx-dmp-sdk';

// ...

const PROVIDER_ID = '00000000-0000-0000-0000-000000000000';

// Init sdk before any other events
initSdk(PROVIDER_ID, 'My app name', '1.0.0').then(() => {
  // setIsReady
});


// Prepare event data
const pageState = {
  url: '',
  title: '',
  domain: '',
  author: '',
  category: '',
  description: '',
  tags: 'tag1,tag2,tag3',
}

sendEvent(pageState).then(async () => {
  // event is completed
  const adRequstData = {
    customData: await getCustomAdTargeting(),
  }
  // Send Ad request with adRequstData
})
```

## Web View connector

```js
import { WebView } from 'react-native-webview';
import { DMPWebViewConnector } from 'react-native-idx-dmp-sdk';

// ...

const webViewConnector = new DMPWebViewConnector('My app name', '1.0.0');

// ...

<WebView
  injectedJavaScriptBeforeContentLoaded={webViewConnector.getSdkMetaData()}
  onMessage={webViewConnector.handleMessage}
/>

// ...

const showAd = () => {
  const adRequstData = {
    customData: webViewConnector.getCustomAdTargeting(),
  }
  // Send Ad request with adRequstData
}
```

## License

MIT

# IDX Data Manager Provider React native SDK

This guide provides detailed instructions for integrating and using the IDX Data Manager Provider SDK in your React native applications.

This SDK is designed to automatically add user audiences (targeting parameters) to ad requests. There are two approaches for audience calculation - native and via WebView connector.

1. The native approach is suitable when you display your content directly in the mobile application and know the required targeting parameters such as title, description, author, and others.

2. The WebView connector helps when you display your content inside a `WebView` and your content resides on a web page. In this case, the content data will be automatically processed by the Web SDK (which must be installed on the page you want to display in the WebView) and passed to the `DMPWebViewConnector`. This way, you can use this data on the native side of your application.

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [App configuration](#app-configuration)
- [Integration with DataManagerProvider](#integration-with-datamanager-provider)
- [Integration with DMPWebViewConnector](#integration-with-dmpwebviewconnector)
- [Author](#author)
- [Support](#support)
- [License](#license)

## Requirements

To integrate this SDK into your project, you need:

- Android 7.0 (API level 24) or above
- Swift 5.7+
- iOS 12.0+
- Valid ProviderId from IDX

## Installation

IdxDmpSdk is available through [Yarn][https://yarnpkg.com/package?name=react-native-idx-dmp-sdk]
```sh
yarn add react-native-idx-dmp-sdk
```

## App configuration

### iOS

Add these keys to your Info.plist file:

```xml
<key>NSUserTrackingUsageDescription</key>
<string>It makes our adwords more compatibility with your interests</string>

<key>NSLocationWhenInUseUsageDescription</key>
<string>It makes our adwords more compatibility with your location</string>
```

Run ```sh pod install``` in your ios directory

### Android

No any special actions are required

## Integration with DataManagerProvider

To use the SDK in your app, call `initSdk` function with your `ProviderId` (obtained from `IDX`). You must also specify your app name and version.

The SDK initializes asynchronously. While you can wait for the completion callback, you can immediately use other SDK methods. In this case, audience calculations will be based on previous data.

Audiences are calculated based on Page View events, which you can send when needed (e.g., when a user opens a new article). You control what data to include in each event.

The SDK returns a string containing the generated userId and collected audiences. To get targeted ads based on this data, set this parameter string in your Google ad request.

For integration testing:

- Handle errors in SDK initialization and event callbacks
- The object returned by `getCustomAdTargeting` should always contain data
- The dxseg key may be empty if no audiences matched, but `userId` will always be populated

```js
import {
  initSdk,
  sendEvent,
  getCustomAdTargeting,
} from 'react-native-idx-dmp-sdk';

// ...

export default function App() {
  const [customData, setCustomData] = useState<string>('')

  useEffect() {
    initSdk('Your Provider ID goes here', 'My react-native example app', 'v1.1.1').then(
      // Handle complete
    )
    .catch((err) => {
      // Handle error
    });
  }

  const handleSendEvent = React.useCallback(() => {
    sendEvent({
      url: "/examplePage", // Replace with the specific page URL or identifier
      title: "Example Page Title", // Replace with the specific page title
      domain: "your-domain.com", // Replace with your domain
      author: "author", // Replace with the author of the page
      category: "category", // Replace with the category of the page
      description: "This is an example page.", // Replace with the description of the page
      tags: "tag1, tag2, tag3", // Replace with the tags related to the page
    })
      .then(async () => {
        // Handle complete
        const result = await getCustomAdTargeting()
        setCustomData(result)
      })
      .catch((err) => {
        // handle error
      });
  }, []);

  return (
    <GAMBannerAd
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
        serverSideVerificationOptions: {
          customData,
        },
      }}
    />
  )
}
```

## Integration with DMPWebViewConnector

If your app uses `WebView` to display content but you want to request ads natively, use `DMPWebViewConnector`. Initialize it with your app name and version.

The connector automatically listens to events from the web page and provides access to audiences calculated by the web SDK. Use this data in your Google ad request.

```js
import { WebView } from 'react-native-webview';
import { DMPWebViewConnector } from 'react-native-idx-dmp-sdk';

// ...

const webViewConnector = new DMPWebViewConnector(
  'My react-native example app',
  'v1.1.1'
);

export default function App() {
  const handleGetAd = React.useCallback(() => {
    const customData: string = webViewConnector.getCustomAdTargeting()

    // Make request to Google Ad server with customData
  }, [])

  return (
    <WebView
      injectedJavaScriptBeforeContentLoaded={webViewConnector.getSdkMetaData()}
      onMessage={webViewConnector.handleMessage}
    />
  )
}
```
<WebView
  injectedJavaScriptBeforeContentLoaded={webViewConnector.getSdkMetaData()}
  onMessage={webViewConnector.handleMessage}
/>
```

## Author

IDX LTD, https://www.id-x.co.il/

## Support

For support, report issues in the issue tracker or reach out through our designated support channels

## License

IdxDmpSdk is available under the MIT license. See the LICENSE file for more info.

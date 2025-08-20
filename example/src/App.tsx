import * as React from 'react';

import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  type NativeSyntheticEvent,
  type TextInputChangeEventData,
  ScrollView,
  SafeAreaView,
  View,
} from 'react-native';
import {
  initSdk,
  sendEvent,
  getCustomAdTargeting,
  resetUserState,
  DMPWebViewConnector,
} from 'react-native-idx-dmp-sdk';
import mobileAds, {
  InterstitialAd,
  MaxAdContentRating,
  TestIds,
  AdEventType,
} from 'react-native-google-mobile-ads';
import { WebView } from 'react-native-webview';

const webViewConnector = new DMPWebViewConnector(
  'My react-native example app',
  'v1.1.1'
);

export default function App() {
  const webviewRef = React.useRef<WebView>();
  const [webviewUrl, setWebviewUrl] = React.useState<string>(
    'https://trmnlsnk.blogspot.com/2022/10/thrid-dmp.html?enableDmpPublisherDebug=true'
  );
  const [webviewCurrentUrl, setWebviewCurrentUrl] =
    React.useState<string>(webviewUrl);
  const [isReady, setIsReady] = React.useState<boolean>(false);
  const [adRequestData, setAdRequestData] = React.useState<string>('');
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [formState, setFormState] = React.useState({
    provider: '13b1d22f-da5e-462c-9759-6c16a9c1a5dc',
    url: 'https://www.ynet.co.il/xtest/0,7340,L-8,00.html',
    title: 'IDX News Site - IDX',
    domain: 'https://www.ynet.co.il',
    author: 'IDX',
    category: 'finance',
    description: 'Description text',
    tags: 'tag1,tag2,tag3',
  });

  const handleChangeInput = React.useCallback(
    (name: string) =>
      (value: NativeSyntheticEvent<TextInputChangeEventData>) => {
        const text = value.nativeEvent.text ?? '';
        setFormState((prevValue) => {
          return { ...prevValue, [name]: text };
        });
      },
    []
  );

  const handleInitSdk = React.useCallback(() => {
    initSdk(formState.provider, 'My react-native example app', 'v1.1.1').then(
      setIsReady
    );
  }, [formState.provider]);

  const handleSendEvent = React.useCallback(() => {
    if (!isReady) {
      return;
    }

    setIsSubmitting(true);
    sendEvent(formState)
      .then(getCustomAdTargeting)
      .then(setAdRequestData)
      .then(() => {
        setIsSubmitting(false);
        mobileAds()
          .setRequestConfiguration({
            // Update all future requests suitable for parental guidance
            maxAdContentRating: MaxAdContentRating.PG,
            // Indicates that you want your content treated as child-directed for purposes of COPPA.
            tagForChildDirectedTreatment: true,
            // Indicates that you want the ad request to be handled in a
            // manner suitable for users under the age of consent.
            tagForUnderAgeOfConsent: true,
            // An array of test device IDs to allow.
            testDeviceIdentifiers: ['EMULATOR'],
          })
          .then(() => {
            const interstitial = InterstitialAd.createForAdRequest(
              TestIds.INTERSTITIAL,
              {
                requestNonPersonalizedAdsOnly: true,
                serverSideVerificationOptions: {
                  customData: adRequestData,
                },
              }
            );
            interstitial.addAdEventListener(AdEventType.LOADED, () => {
              interstitial.show();
            });

            interstitial.load();
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [isReady, formState, adRequestData]);

  const handleResetState = React.useCallback(() => {
    try {
      setIsReady(false);
      resetUserState();
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handleOpenUrl = React.useCallback(() => {
    try {
      setWebviewCurrentUrl(webviewUrl);
      webviewRef.current?.reload();
    } catch (err) {
      console.log(err);
    }
  }, [webviewRef, webviewUrl]);

  const handleChangeWebviewUrl = React.useCallback(
    (value: NativeSyntheticEvent<TextInputChangeEventData>) => {
      try {
        setWebviewUrl(value.nativeEvent.text ?? '');
      } catch (err) {
        console.log(err);
      }
    },
    []
  );

  const handleShowWebviewDebug = React.useCallback(() => {
    try {
      Alert.alert(
        'Debug Info',
        `Ad Request Data: ${webViewConnector.getCustomAdTargeting()}`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
      >
        <Text style={[styles.text, !isReady ? styles.textDanger : {}]}>
          {isReady ? 'SDK IS READY!' : 'SDK IS NOT INIT'}
        </Text>
        <Text style={styles.text}>
          Ad Request Data: {adRequestData || 'NULL'}
        </Text>
        <TextInput
          style={styles.textInput}
          editable={!isSubmitting}
          value={formState.provider}
          onChange={handleChangeInput('provider')}
        />
        <TextInput
          style={styles.textInput}
          editable={!isSubmitting}
          value={formState.url}
          onChange={handleChangeInput('url')}
        />
        <TextInput
          style={styles.textInput}
          editable={!isSubmitting}
          value={formState.title}
          onChange={handleChangeInput('title')}
        />
        <TextInput
          style={styles.textInput}
          editable={!isSubmitting}
          value={formState.domain}
          onChange={handleChangeInput('domain')}
        />
        <TextInput
          style={styles.textInput}
          editable={!isSubmitting}
          value={formState.author}
          onChange={handleChangeInput('author')}
        />
        <TextInput
          style={styles.textInput}
          editable={!isSubmitting}
          value={formState.category}
          onChange={handleChangeInput('category')}
        />
        <TextInput
          style={styles.textInput}
          editable={!isSubmitting}
          value={formState.description}
          onChange={handleChangeInput('description')}
        />
        <TextInput
          style={styles.textInput}
          editable={!isSubmitting}
          value={formState.tags}
          onChange={handleChangeInput('tags')}
        />
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.button}
            disabled={isSubmitting}
            onPress={handleInitSdk}
          >
            <Text style={styles.buttonText}>Init sdk</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            disabled={isSubmitting}
            onPress={handleSendEvent}
          >
            <Text style={styles.buttonText}>Send event</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonError]}
            disabled={isSubmitting}
            onPress={handleResetState}
          >
            <Text style={styles.buttonText}>Reset state</Text>
          </TouchableOpacity>
        </View>
        <WebView
          // @ts-ignore-next-line
          ref={webviewRef}
          source={{
            uri: webviewCurrentUrl,
          }}
          style={styles.webView}
          injectedJavaScriptBeforeContentLoaded={webViewConnector.getSdkMetaData()}
          onMessage={webViewConnector.handleMessage}
        />
        <TextInput
          style={styles.textInput}
          editable={!isSubmitting}
          value={webviewUrl}
          onChange={handleChangeWebviewUrl}
        />
        <TouchableOpacity
          style={styles.button}
          disabled={isSubmitting}
          onPress={handleOpenUrl}
        >
          <Text style={styles.buttonText}>Open URL</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          disabled={isSubmitting}
          onPress={handleShowWebviewDebug}
        >
          <Text style={styles.buttonText}>Show debug</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    minHeight: '100%',
    padding: 16,
    backgroundColor: 'white',
  },
  text: {
    color: 'gray',
    textAlign: 'center',
    marginBottom: 8,
  },
  textDanger: {
    color: '#dc3545',
  },
  textInput: {
    color: 'black',
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 4,
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor: 'white',
  },
  footer: {
    marginTop: 'auto',
  },
  button: {
    justifyContent: 'center',
    minHeight: 40,
    marginTop: 16,
    backgroundColor: '#0073cf',
    borderRadius: 4,
  },
  buttonError: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  webView: {
    height: 512,
    marginTop: 24,
    marginBottom: 24,
  },
});

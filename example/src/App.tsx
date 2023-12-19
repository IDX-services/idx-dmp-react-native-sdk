import * as React from 'react';

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  type NativeSyntheticEvent,
  type TextInputChangeEventData,
  ScrollView,
  View,
} from 'react-native';
import {
  initSdk,
  sendEvent,
  getDefinitionIds,
  resetUserState,
} from 'react-native-idx-dmp-sdk';
// import mobileAds, {
//   GAMBannerAd,
//   MaxAdContentRating,
//   BannerAdSize,
//   TestIds,
// } from 'react-native-google-mobile-ads';

const PROVIDER_ID = 'a5beb245-2949-4a76-95f5-bddfc2ec171c';

export default function App() {
  const [isReady, setIsReady] = React.useState<boolean>(false);
  const [definitionIds, setDefinitionIds] = React.useState<string>('');
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [formState, setFormState] = React.useState({
    url: 'https://www.ynet.co.il/home/0,7340,L-8,00.html',
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
        setFormState((prevValue) => {
          return { ...prevValue, [name]: value.nativeEvent.text ?? '' };
        });
      },
    []
  );

  const handleInitSdk = React.useCallback(() => {
    initSdk(PROVIDER_ID, 'My react-native example app').then(setIsReady);
  }, []);

  const handleSendEvent = React.useCallback(() => {
    if (!isReady) {
      return;
    }

    setIsSubmitting(true);
    sendEvent(formState)
      .then(async () => {
        const data = await new Promise((resolve) => {
          setTimeout(async () => resolve(await getDefinitionIds()), 500);
        });
        return data as string;
      })
      .then(setDefinitionIds)
      .then(() => {
        setIsSubmitting(false);
        // mobileAds()
        //   .setRequestConfiguration({
        //     // Update all future requests suitable for parental guidance
        //     maxAdContentRating: MaxAdContentRating.PG,
        //     // Indicates that you want your content treated as child-directed for purposes of COPPA.
        //     tagForChildDirectedTreatment: true,
        //     // Indicates that you want the ad request to be handled in a
        //     // manner suitable for users under the age of consent.
        //     tagForUnderAgeOfConsent: true,
        //     // An array of test device IDs to allow.
        //     testDeviceIdentifiers: ['EMULATOR'],
        //   })
        //   .then(() => {
        //     // Request config successfully set!
        //   });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [isReady, formState]);

  const handleResetState = React.useCallback(() => {
    try {
      setIsReady(false);
      resetUserState();
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContainer}
    >
      <Text style={[styles.text, !isReady ? styles.textDanger : {}]}>
        {isReady ? 'SDK IS READY!' : 'SDK IS NOT INIT'}
      </Text>
      <Text style={styles.text}>Audiences: {definitionIds || 'NULL'}</Text>
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
      {/* <GAMBannerAd
        unitId={TestIds.BANNER}
        sizes={[BannerAdSize.ANCHORED_ADAPTIVE_BANNER]}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
          serverSideVerificationOptions: {
            customData: 'dxseg=xaxwaxwax',
          },
        }}
      /> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    minHeight: '100%',
    padding: 16,
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
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 4,
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
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
});

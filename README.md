# react-native-idx-dmp-sdk

IDX DMP react-native SDK

## Installation

```sh
yarn add react-native-idx-dmp-sdk
```

## Usage

```js
import {
  initSdk,
  sendEvent,
  getDefinitionIds,
  resetUserState,
} from 'react-native-idx-dmp-sdk';

// ...

const PROVIDER_ID = '00000000-0000-0000-0000-000000000000';

// Init sdk before any other events
initSdk(PROVIDER_ID).then(() => {
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

sendEvent(pageState).then(() => {
  // event is completed
  const audiences = getDefinitionIds() // return calculated audiences
  const adRequstData = {
    customData: `dxseg=${audiences}`,
  }
  
})
```

## License

MIT

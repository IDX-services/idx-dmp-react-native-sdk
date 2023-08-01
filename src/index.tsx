import { NativeModules, Platform } from 'react-native';

interface IEventParams {
  url: string;
  title: string;
  domain: string;
  author: string;
  category: string;
  description: string;
  tags: string;
}

const LINKING_ERROR =
  `The package 'react-native-idx-dmp-sdk' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const IdxDmpSdk = NativeModules.IdxDmpSdk
  ? NativeModules.IdxDmpSdk
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function initSdk(providerId: string): Promise<boolean> {
  return IdxDmpSdk.initSdk(providerId);
}

export function sendEvent(
  partialParams: Partial<IEventParams>
): Promise<boolean> {
  const {
    url = '',
    title = '',
    domain = '',
    author = '',
    category = '',
    description = '',
    tags = '',
  } = partialParams;

  const params: IEventParams = {
    url,
    title,
    domain,
    author,
    category,
    description,
    tags,
  };

  return IdxDmpSdk.sendEvent(params);
}

export function getDefinitionIds(): Promise<string> {
  return IdxDmpSdk.getDefinitionIds();
}

export function resetUserState(): Promise<void> {
  return IdxDmpSdk.resetUserState();
}

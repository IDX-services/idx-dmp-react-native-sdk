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

interface WebViewSdkMessageData {
  userId: string;
  definitionIdsAsString: string;
}

interface WebViewSdkNativeEvent {
  nativeEvent: { data: string };
}

interface IAdRequestParams {
  userId: string;
  definitionIds: string;
}

interface IIdxDmpSdk {
  initSdk: (providerId: string, monitoringLabel?: string) => Promise<boolean>;
  sendEvent: (data: IEventParams) => Promise<boolean>;
  getDefinitionIds: () => Promise<string>;
  getUserId: () => Promise<string>;
  resetUserState: () => Promise<void>;
}

const LINKING_ERROR =
  `The package 'react-native-idx-dmp-sdk' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

function getAdRequestData(params: IAdRequestParams): string {
  const { userId = '', definitionIds = '' } = params;
  return `dxseg=${definitionIds}&dxu=${userId}&permutive=${userId}`;
}

const IdxDmpSdk: IIdxDmpSdk = NativeModules.IdxDmpSdk
  ? NativeModules.IdxDmpSdk
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function initSdk(
  providerId: string,
  monitoringLabel?: string
): Promise<boolean> {
  return IdxDmpSdk.initSdk(providerId, monitoringLabel);
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

export function getUserId(): Promise<string> {
  return IdxDmpSdk.getUserId() ?? '';
}

export function resetUserState(): Promise<void> {
  return IdxDmpSdk.resetUserState();
}

export async function getCustomAdTargeting(): Promise<string> {
  try {
    const userId = await getUserId();
    const definitionIds = await getDefinitionIds();

    return getAdRequestData({ userId, definitionIds });
  } catch {
    return '';
  }
}

export class DMPWebViewConnector {
  private userId = '';
  private definitionIds = '';

  handleMessage = (value: WebViewSdkNativeEvent): void => {
    try {
      const parsedData: WebViewSdkMessageData = JSON.parse(
        value?.nativeEvent?.data
      );
      this.userId = parsedData?.userId ?? '';
      this.definitionIds = parsedData?.definitionIdsAsString ?? '';
    } catch {}
  };

  getUserId = (): string => {
    return this.userId ?? '';
  };

  getDefinitionIds = (): string => {
    return this.definitionIds ?? '';
  };

  getCustomAdTargeting = (): string => {
    const { userId = '', definitionIds = '' } = this;
    return getAdRequestData({ userId, definitionIds });
  };
}

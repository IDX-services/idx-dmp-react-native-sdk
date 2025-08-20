package com.idxdmpsdk;

import android.app.Activity;
import androidx.annotation.NonNull;
import java.io.IOException;
import java.util.Arrays;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

import com.dxmdp.android.DataManagerProvider;
import com.dxmdp.android.requests.event.EventRequestProperties;

@ReactModule(name = IdxDmpSdkModule.NAME)
public class IdxDmpSdkModule extends ReactContextBaseJavaModule {
  public static final String NAME = "IdxDmpSdk";

  private DataManagerProvider dataManagerProvider;

  public IdxDmpSdkModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }


  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  @ReactMethod
  public void initSdk(String providerId, String appName, String appVersion, Promise promise) {
    Activity activity = getCurrentActivity();

    if (activity == null) {
      System.out.println("NO ACITIVITY");
      promise.resolve(false);
    }

    dataManagerProvider = new DataManagerProvider(
      activity,
      providerId,
      appName,
      appVersion
    );
    promise.resolve(true);
  }

  @ReactMethod
  public void sendEvent(ReadableMap params, Promise promise) {
    try {
      EventRequestProperties eventRequestProperties = new EventRequestProperties();

      eventRequestProperties.setUrl(params.getString("url"));
      eventRequestProperties.setTitle(params.getString("title"));
      eventRequestProperties.setDomain(params.getString("domain"));
      eventRequestProperties.setAuthor(params.getString("author"));
      eventRequestProperties.setCategory(params.getString("category"));
      eventRequestProperties.setDescription(params.getString("description"));
      eventRequestProperties.setTags(Arrays.asList(params.getString("tags").split(",")));

      dataManagerProvider.sendEventRequest(eventRequestProperties);

      promise.resolve(true);
    } catch (IOException | InterruptedException e) {
      promise.resolve(false);
    }
  }

  @ReactMethod
  public void getDefinitionIds(Promise promise) {
    promise.resolve(String.join(",", dataManagerProvider.getDefinitionIds()));
  }

  @ReactMethod
  public void getUserId(Promise promise) {
    promise.resolve(dataManagerProvider.getUserId());
  }

  @ReactMethod
  public void resetUserState(Promise promise) {
    dataManagerProvider.resetUserState();
    promise.resolve(true);
  }
}

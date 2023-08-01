import class IdxDmpSdk.DataManagerProvider
import struct IdxDmpSdk.EventRequestPropertiesStruct

@objc(IdxDmpSdk)
class IdxDmpSdk: NSObject {
  var dmp: DataManagerProvider?

  @objc(initSdk:withResolver:withRejecter:)
  func initSdk(providerId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
    self.dmp = DataManagerProvider(providerId: providerId) { error in
      if (error != nil) {
        reject(nil, nil, nil)
      }

      resolve(true)
    }
  }

  @objc(sendEvent:withResolver:withRejecter:)
  func sendEvent(params: Dictionary<String, String>?, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
    guard let dmp = self.dmp else {
      return reject(nil, nil, nil)
    }

    let requestProps = EventRequestPropertiesStruct(
      url: params?["url"] ?? "",
      title: params?["title"] ?? "IDX News Site - IDX",
      domain: params?["domain"] ?? "",
      author: params?["author"] ?? "",
      category: params?["category"] ?? "",
      description: params?["description"] ?? "",
      tags: params?["tags"]?.components(separatedBy: ",") ?? []
    )

    dmp.sendEvent(properties: requestProps) { error in
      if (error != nil) {
        reject(nil, nil, nil)
      }

      resolve(true)
    }
  }

  @objc(getDefinitionIds:withRejecter:)
  func getDefinitionIds(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
    guard let dmp = self.dmp else {
      return reject(nil, nil, nil)
    }

    resolve(dmp.getDefinitionIds())
  }

  @objc(resetUserState:withRejecter:)
  func resetUserState(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
    guard let dmp = self.dmp else {
      return reject(nil, nil, nil)
    }

    resolve(dmp.resetState())
  }
}

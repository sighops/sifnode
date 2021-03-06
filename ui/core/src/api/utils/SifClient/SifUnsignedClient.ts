import {
  AuthExtension,
  BroadcastMode,
  CosmosClient,
  LcdClient,
  setupAuthExtension,
} from "@cosmjs/launchpad";

import {
  createTendermintSocketSubscriber,
  TendermintSocketSubscriber,
} from "./TendermintSocketSubscriber";

import { ClpExtension, setupClpExtension } from "./x/clp";
import { EthbridgeExtension, setupEthbridgeExtension } from "./x/ethbridge";

type CustomLcdClient = LcdClient &
  AuthExtension &
  ClpExtension &
  EthbridgeExtension;

function createLcdClient(
  apiUrl: string,
  broadcastMode: BroadcastMode | undefined
): CustomLcdClient {
  return LcdClient.withExtensions(
    { apiUrl: apiUrl, broadcastMode: broadcastMode },
    setupAuthExtension,
    setupClpExtension,
    setupEthbridgeExtension
  );
}

type IClpApi = ClpExtension["clp"];
type IEthbridgeApi = EthbridgeExtension["ethbridge"];

type HandlerFn<T> = (a: T) => void;
export class SifUnSignedClient extends CosmosClient
  implements IClpApi, IEthbridgeApi {
  protected readonly lcdClient: CustomLcdClient;
  private subscriber: TendermintSocketSubscriber | undefined;
  constructor(
    apiUrl: string,
    wsUrl: string = "ws://localhost:26657/websocket",
    broadcastMode?: BroadcastMode
  ) {
    super(apiUrl, broadcastMode);
    this.lcdClient = createLcdClient(apiUrl, broadcastMode);
    this.swap = this.lcdClient.clp.swap;
    this.getPools = this.lcdClient.clp.getPools;
    this.getAssets = this.lcdClient.clp.getAssets;
    this.addLiquidity = this.lcdClient.clp.addLiquidity;
    this.createPool = this.lcdClient.clp.createPool;
    this.getLiquidityProvider = this.lcdClient.clp.getLiquidityProvider;
    this.removeLiquidity = this.lcdClient.clp.removeLiquidity;
    this.getPool = this.lcdClient.clp.getPool;
    this.burn = this.lcdClient.ethbridge.burn;
    this.lock = this.lcdClient.ethbridge.lock;
    if (wsUrl) this.subscriber = createTendermintSocketSubscriber(wsUrl);
  }

  // Clp Extension
  swap: IClpApi["swap"];
  getPools: IClpApi["getPools"];
  getAssets: IClpApi["getAssets"];
  addLiquidity: IClpApi["addLiquidity"];
  createPool: IClpApi["createPool"];
  getLiquidityProvider: IClpApi["getLiquidityProvider"];
  removeLiquidity: IClpApi["removeLiquidity"];
  getPool: IClpApi["getPool"];

  // Ethbridge Extension
  burn: IEthbridgeApi["burn"];
  lock: IEthbridgeApi["lock"];

  onNewBlock<T>(handler: HandlerFn<T>) {
    console.log("received onNewBlock handler");
    if (!this.subscriber) console.error("Subscriber not setup");
    this.subscriber?.on("NewBlock", handler);
    return () => {
      this.subscriber?.off("NewBlock", handler);
    };
  }

  onTx<T>(handler: HandlerFn<T>) {
    console.log("received onTx handler");
    if (!this.subscriber) console.error("Subscriber not setup");
    this.subscriber?.on("Tx", handler);
    return () => {
      this.subscriber?.off("Tx", handler);
    };
  }

  onSocketError<T>(handler: HandlerFn<T>) {
    console.log("received onSocketError handler");
    if (!this.subscriber) console.error("Subscriber not setup");
    this.subscriber?.on("error", handler);
    return () => {
      this.subscriber?.off("error", handler);
    };
  }
}

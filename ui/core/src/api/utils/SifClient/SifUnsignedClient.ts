import {
  AuthExtension,
  BroadcastMode,
  CosmosClient,
  LcdClient,
  setupAuthExtension,
} from "@cosmjs/launchpad";

import { ClpExtension, setupClpExtension } from "./x/clp";

type CustomLcdClient = LcdClient & AuthExtension & ClpExtension;

function createLcdClient(
  apiUrl: string,
  broadcastMode: BroadcastMode | undefined
): CustomLcdClient {
  return LcdClient.withExtensions(
    { apiUrl: apiUrl, broadcastMode: broadcastMode },
    setupAuthExtension,
    setupClpExtension
  );
}

type IClpApi = ClpExtension["clp"];

export class SifUnSignedClient extends CosmosClient implements IClpApi {
  protected readonly lcdClient: CustomLcdClient;

  constructor(apiUrl: string, broadcastMode?: BroadcastMode) {
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
  }

  swap: IClpApi["swap"];
  getPools: IClpApi["getPools"];
  getAssets: IClpApi["getAssets"];
  addLiquidity: IClpApi["addLiquidity"];
  createPool: IClpApi["createPool"];
  getLiquidityProvider: IClpApi["getLiquidityProvider"];
  removeLiquidity: IClpApi["removeLiquidity"];
  getPool: IClpApi["getPool"];
}

import type * as types from './types';
import type { ConfigOptions, FetchResponse } from 'api/dist/core'
import Oas from 'oas';
import APICore from 'api/dist/core';
import definition from './openapi.json';

class SDK {
  spec: Oas;
  core: APICore;

  constructor() {
    this.spec = Oas.init(definition);
    this.core = new APICore(this.spec, 'blockberry/1.0.0 (api/6.1.3)');
  }

  /**
   * Optionally configure various options that the SDK allows.
   *
   * @param config Object of supported SDK options and toggles.
   * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
   * should be represented in milliseconds.
   */
  config(config: ConfigOptions) {
    this.core.setConfig(config);
  }

  /**
   * If the API you're using requires authentication you can supply the required credentials
   * through this method and the library will magically determine how they should be used
   * within your API request.
   *
   * With the exception of OpenID and MutualTLS, it supports all forms of authentication
   * supported by the OpenAPI specification.
   *
   * @example <caption>HTTP Basic auth</caption>
   * sdk.auth('username', 'password');
   *
   * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
   * sdk.auth('myBearerToken');
   *
   * @example <caption>API Keys</caption>
   * sdk.auth('myApiKey');
   *
   * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
   * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
   * @param values Your auth credentials for the API; can specify up to two strings or numbers.
   */
  auth(...values: string[] | number[]) {
    this.core.setAuth(...values);
    return this;
  }

  /**
   * If the API you're using offers alternate server URLs, and server variables, you can tell
   * the SDK which one to use with this method. To use it you can supply either one of the
   * server URLs that are contained within the OpenAPI definition (along with any server
   * variables), or you can pass it a fully qualified URL to use (that may or may not exist
   * within the OpenAPI definition).
   *
   * @example <caption>Server URL with server variables</caption>
   * sdk.server('https://{region}.api.example.com/{basePath}', {
   *   name: 'eu',
   *   basePath: 'v14',
   * });
   *
   * @example <caption>Fully qualified server URL</caption>
   * sdk.server('https://eu.api.example.com/v14');
   *
   * @param url Server URL
   * @param variables An object of variables to replace into the server URL.
   */
  server(url: string, variables = {}) {
    this.core.setServer(url, variables);
  }

  /**
   * Get a list of all accounts on the Network.
   *
   * @summary getAccounts
   */
  getAccounts_1(metadata: types.GetAccounts1MetadataParam): Promise<FetchResponse<200, types.GetAccounts1Response200>> {
    return this.core.fetch('/v1/accounts', 'get', metadata);
  }

  /**
   * Get account details by address.
   *
   * @summary getAccountByHash
   */
  getAccountByHash(metadata: types.GetAccountByHashMetadataParam): Promise<FetchResponse<200, types.GetAccountByHashResponse200>> {
    return this.core.fetch('/v1/accounts/{address}', 'get', metadata);
  }

  /**
   * Get a list of all blobs on the Network.
   *
   * @summary getBlobs
   */
  getBlobs(metadata: types.GetBlobsMetadataParam): Promise<FetchResponse<200, types.GetBlobsResponse200>> {
    return this.core.fetch('/v1/blobs', 'get', metadata);
  }

  /**
   * Get a list of all blobs to the queried account address.
   *
   * @summary getAccountBlobs
   */
  getAccountBlobs(metadata: types.GetAccountBlobsMetadataParam): Promise<FetchResponse<200, types.GetAccountBlobsResponse200>> {
    return this.core.fetch('/v1/blobs/accounts/{address}', 'get', metadata);
  }

  /**
   * Get blob details by id.
   *
   * @summary getBlobById
   */
  getBlobById(metadata: types.GetBlobByIdMetadataParam): Promise<FetchResponse<200, types.GetBlobByIdResponse200>> {
    return this.core.fetch('/v1/blobs/{id}', 'get', metadata);
  }

  /**
   * Get a list of all validators on the Network.
   *
   * @summary getValidators
   */
  getValidators(metadata: types.GetValidatorsMetadataParam): Promise<FetchResponse<200, types.GetValidatorsResponse200>> {
    return this.core.fetch('/v1/validators', 'get', metadata);
  }

  /**
   * Get validator details by address.
   *
   * @summary getValidatorByAddress
   */
  getValidatorByAddress(metadata: types.GetValidatorByAddressMetadataParam): Promise<FetchResponse<200, types.GetValidatorByAddressResponse200>> {
    return this.core.fetch('/v1/validators/{address}', 'get', metadata);
  }

  /**
   * Get a list of all accounts that delegated funds to the queried validator.
   *
   * @summary getDelegatorsByValidator
   */
  getDelegatorsByValidator(metadata: types.GetDelegatorsByValidatorMetadataParam): Promise<FetchResponse<200, types.GetDelegatorsByValidatorResponse200>> {
    return this.core.fetch('/v1/validators/{address}/delegators', 'get', metadata);
  }

  /**
   * Get a staking history of delegated funds to the queried validator.
   *
   * @summary getDelegationsByValidator
   */
  getDelegationsByValidator(metadata: types.GetDelegationsByValidatorMetadataParam): Promise<FetchResponse<200, types.GetDelegationsByValidatorResponse200>> {
    return this.core.fetch('/v1/validators/{address}/staking-history', 'get', metadata);
  }

  /**
   * Get a chart showing the average blob size throughout the Network for the selected
   * period.
   *
   * @summary getAvgBlobSizeChart
   */
  getAvgBlobSizeChart(metadata: types.GetAvgBlobSizeChartMetadataParam): Promise<FetchResponse<200, types.GetAvgBlobSizeChartResponse200>> {
    return this.core.fetch('/v1/widgets/avg-blob-size', 'get', metadata);
  }

  /**
   * Get a chart showing the total number of accounts on the Network for the selected period.
   *
   * @summary getAccountsCountChart
   */
  getAccountsCountChart(metadata: types.GetAccountsCountChartMetadataParam): Promise<FetchResponse<200, types.GetAccountsCountChartResponse200>> {
    return this.core.fetch('/v1/widgets/total-accounts', 'get', metadata);
  }

  /**
   * Get a chart showing the total number of blobs on the Network for the selected period.
   *
   * @summary getBlobsCountChart
   */
  getBlobsCountChart(metadata: types.GetBlobsCountChartMetadataParam): Promise<FetchResponse<200, types.GetBlobsCountChartResponse200>> {
    return this.core.fetch('/v1/widgets/total-blobs', 'get', metadata);
  }
}

const createSDK = (() => { return new SDK(); })()
;

export default createSDK;

export type { GetAccountBlobsMetadataParam, GetAccountBlobsResponse200, GetAccountByHashMetadataParam, GetAccountByHashResponse200, GetAccounts1MetadataParam, GetAccounts1Response200, GetAccountsCountChartMetadataParam, GetAccountsCountChartResponse200, GetAvgBlobSizeChartMetadataParam, GetAvgBlobSizeChartResponse200, GetBlobByIdMetadataParam, GetBlobByIdResponse200, GetBlobsCountChartMetadataParam, GetBlobsCountChartResponse200, GetBlobsMetadataParam, GetBlobsResponse200, GetDelegationsByValidatorMetadataParam, GetDelegationsByValidatorResponse200, GetDelegatorsByValidatorMetadataParam, GetDelegatorsByValidatorResponse200, GetValidatorByAddressMetadataParam, GetValidatorByAddressResponse200, GetValidatorsMetadataParam, GetValidatorsResponse200 } from './types';

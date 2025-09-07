declare const GetAccountBlobs: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly address: {
                    readonly type: "string";
                    readonly description: "Queried address digest (hash).";
                    readonly default: "0xe2964015d71c8c054af6a5b3601762bc901d94e822b3f8c24a156f1f3f5ee060";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly ["address"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly page: {
                    readonly minimum: 0;
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly default: 0;
                    readonly maximum: 2147483647;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Queried API page.";
                };
                readonly size: {
                    readonly maximum: 100;
                    readonly minimum: 1;
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly default: 20;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Number of queried entries.";
                };
                readonly orderBy: {
                    readonly type: "string";
                    readonly default: "DESC";
                    readonly enum: readonly ["ASC", "DESC"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Sorting method: from the lowest element to the highest (ASC) or from the highest element to the lowest (DESC).";
                };
                readonly sortBy: {
                    readonly type: "string";
                    readonly description: "Select sorting parameter.";
                    readonly default: "TIMESTAMP";
                    readonly enum: readonly ["START_EPOCH", "END_EPOCH", "SIZE", "TIMESTAMP"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly ["page", "size", "orderBy", "sortBy"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly totalElements: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
                readonly totalPages: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly pageable: {
                    readonly type: "object";
                    readonly properties: {
                        readonly pageNumber: {
                            readonly type: "integer";
                            readonly format: "int32";
                            readonly minimum: -2147483648;
                            readonly maximum: 2147483647;
                        };
                        readonly pageSize: {
                            readonly type: "integer";
                            readonly format: "int32";
                            readonly minimum: -2147483648;
                            readonly maximum: 2147483647;
                        };
                        readonly offset: {
                            readonly type: "integer";
                            readonly format: "int64";
                            readonly minimum: -9223372036854776000;
                            readonly maximum: 9223372036854776000;
                        };
                        readonly sort: {
                            readonly type: "object";
                            readonly properties: {
                                readonly sorted: {
                                    readonly type: "boolean";
                                };
                                readonly empty: {
                                    readonly type: "boolean";
                                };
                                readonly unsorted: {
                                    readonly type: "boolean";
                                };
                            };
                        };
                        readonly paged: {
                            readonly type: "boolean";
                        };
                        readonly unpaged: {
                            readonly type: "boolean";
                        };
                    };
                };
                readonly size: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly content: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly blobId: {
                                readonly type: "string";
                            };
                            readonly blobIdBase64: {
                                readonly type: "string";
                            };
                            readonly objectId: {
                                readonly type: "string";
                            };
                            readonly status: {
                                readonly type: "string";
                            };
                            readonly startEpoch: {
                                readonly type: "integer";
                                readonly format: "int32";
                                readonly minimum: -2147483648;
                                readonly maximum: 2147483647;
                            };
                            readonly endEpoch: {
                                readonly type: "integer";
                                readonly format: "int32";
                                readonly minimum: -2147483648;
                                readonly maximum: 2147483647;
                            };
                            readonly size: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly timestamp: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                        };
                    };
                };
                readonly number: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly sort: {
                    readonly type: "object";
                    readonly properties: {
                        readonly sorted: {
                            readonly type: "boolean";
                        };
                        readonly empty: {
                            readonly type: "boolean";
                        };
                        readonly unsorted: {
                            readonly type: "boolean";
                        };
                    };
                };
                readonly numberOfElements: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly first: {
                    readonly type: "boolean";
                };
                readonly last: {
                    readonly type: "boolean";
                };
                readonly empty: {
                    readonly type: "boolean";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetAccountByHash: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly address: {
                    readonly type: "string";
                    readonly description: "Queried address digest (hash).";
                    readonly default: "0x4e4d9cfd64ebb1f78dc960300bf4da1d33470050364b4e5f242255709f683ce1";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly ["address"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly address: {
                    readonly type: "string";
                };
                readonly firstSeen: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
                readonly lastSeen: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
                readonly events: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
                readonly blobs: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
                readonly balance: {
                    readonly type: "number";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetAccounts1: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly page: {
                    readonly minimum: 0;
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly default: 0;
                    readonly maximum: 2147483647;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Queried API page.";
                };
                readonly size: {
                    readonly maximum: 100;
                    readonly minimum: 1;
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly default: 20;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Number of queried entries.";
                };
                readonly orderBy: {
                    readonly type: "string";
                    readonly default: "DESC";
                    readonly enum: readonly ["ASC", "DESC"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Sorting method: from the lowest element to the highest (ASC) or from the highest element to the lowest (DESC).";
                };
                readonly sortBy: {
                    readonly type: "string";
                    readonly description: "Select sorting parameter.";
                    readonly default: "BALANCE";
                    readonly enum: readonly ["EVENTS", "BLOBS", "BALANCE", "FIRST_SEEN", "LAST_SEEN"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly searchStr: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Enter part or full validator name or address to get the queried validator.";
                };
            };
            readonly required: readonly ["page", "size", "orderBy", "sortBy"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly totalElements: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
                readonly totalPages: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly pageable: {
                    readonly type: "object";
                    readonly properties: {
                        readonly pageNumber: {
                            readonly type: "integer";
                            readonly format: "int32";
                            readonly minimum: -2147483648;
                            readonly maximum: 2147483647;
                        };
                        readonly pageSize: {
                            readonly type: "integer";
                            readonly format: "int32";
                            readonly minimum: -2147483648;
                            readonly maximum: 2147483647;
                        };
                        readonly offset: {
                            readonly type: "integer";
                            readonly format: "int64";
                            readonly minimum: -9223372036854776000;
                            readonly maximum: 9223372036854776000;
                        };
                        readonly sort: {
                            readonly type: "object";
                            readonly properties: {
                                readonly sorted: {
                                    readonly type: "boolean";
                                };
                                readonly empty: {
                                    readonly type: "boolean";
                                };
                                readonly unsorted: {
                                    readonly type: "boolean";
                                };
                            };
                        };
                        readonly paged: {
                            readonly type: "boolean";
                        };
                        readonly unpaged: {
                            readonly type: "boolean";
                        };
                    };
                };
                readonly size: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly content: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly address: {
                                readonly type: "string";
                            };
                            readonly firstSeen: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly lastSeen: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly events: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly blobs: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly balance: {
                                readonly type: "number";
                            };
                        };
                    };
                };
                readonly number: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly sort: {
                    readonly type: "object";
                    readonly properties: {
                        readonly sorted: {
                            readonly type: "boolean";
                        };
                        readonly empty: {
                            readonly type: "boolean";
                        };
                        readonly unsorted: {
                            readonly type: "boolean";
                        };
                    };
                };
                readonly numberOfElements: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly first: {
                    readonly type: "boolean";
                };
                readonly last: {
                    readonly type: "boolean";
                };
                readonly empty: {
                    readonly type: "boolean";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetAccountsCountChart: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly period: {
                    readonly type: "string";
                    readonly description: "Chart period.";
                    readonly default: "24H";
                    readonly enum: readonly ["24H"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly size: {
                    readonly type: "string";
                    readonly description: "Number of queried entries.";
                    readonly default: "SMALL";
                    readonly enum: readonly ["SMALL", "LARGE"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly widgetPage: {
                    readonly type: "string";
                    readonly description: "The page on which the chart is shown.";
                    readonly default: "HOME";
                    readonly enum: readonly ["HOME", "ANALYTICS"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly ["period", "size", "widgetPage"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly value: {
                    readonly type: "number";
                    readonly format: "double";
                    readonly minimum: -1.7976931348623157e+308;
                    readonly maximum: 1.7976931348623157e+308;
                };
                readonly changeValue: {
                    readonly type: "number";
                    readonly format: "double";
                    readonly minimum: -1.7976931348623157e+308;
                    readonly maximum: 1.7976931348623157e+308;
                };
                readonly changePercent: {
                    readonly type: "number";
                    readonly format: "double";
                    readonly minimum: -1.7976931348623157e+308;
                    readonly maximum: 1.7976931348623157e+308;
                };
                readonly additionalValue: {
                    readonly type: "number";
                    readonly format: "double";
                    readonly minimum: -1.7976931348623157e+308;
                    readonly maximum: 1.7976931348623157e+308;
                };
                readonly maxRate: {
                    readonly type: "number";
                    readonly format: "double";
                    readonly minimum: -1.7976931348623157e+308;
                    readonly maximum: 1.7976931348623157e+308;
                };
                readonly changeRate: {
                    readonly type: "number";
                    readonly format: "double";
                    readonly minimum: -1.7976931348623157e+308;
                    readonly maximum: 1.7976931348623157e+308;
                };
                readonly changePeriod: {
                    readonly type: "string";
                };
                readonly noChanges: {
                    readonly type: "boolean";
                };
                readonly chart: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly value: {
                                readonly type: "number";
                                readonly format: "double";
                                readonly minimum: -1.7976931348623157e+308;
                                readonly maximum: 1.7976931348623157e+308;
                            };
                            readonly timestamp: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetAvgBlobSizeChart: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly period: {
                    readonly type: "string";
                    readonly description: "Chart period.";
                    readonly default: "24H";
                    readonly enum: readonly ["24H"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly size: {
                    readonly type: "string";
                    readonly description: "Number of queried entries.";
                    readonly default: "SMALL";
                    readonly enum: readonly ["SMALL", "LARGE"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly widgetPage: {
                    readonly type: "string";
                    readonly description: "The page on which the chart is shown.";
                    readonly default: "HOME";
                    readonly enum: readonly ["HOME", "ANALYTICS"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly ["period", "size", "widgetPage"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly value: {
                    readonly type: "number";
                    readonly format: "double";
                    readonly minimum: -1.7976931348623157e+308;
                    readonly maximum: 1.7976931348623157e+308;
                };
                readonly changeValue: {
                    readonly type: "number";
                    readonly format: "double";
                    readonly minimum: -1.7976931348623157e+308;
                    readonly maximum: 1.7976931348623157e+308;
                };
                readonly changePercent: {
                    readonly type: "number";
                    readonly format: "double";
                    readonly minimum: -1.7976931348623157e+308;
                    readonly maximum: 1.7976931348623157e+308;
                };
                readonly additionalValue: {
                    readonly type: "number";
                    readonly format: "double";
                    readonly minimum: -1.7976931348623157e+308;
                    readonly maximum: 1.7976931348623157e+308;
                };
                readonly maxRate: {
                    readonly type: "number";
                    readonly format: "double";
                    readonly minimum: -1.7976931348623157e+308;
                    readonly maximum: 1.7976931348623157e+308;
                };
                readonly changeRate: {
                    readonly type: "number";
                    readonly format: "double";
                    readonly minimum: -1.7976931348623157e+308;
                    readonly maximum: 1.7976931348623157e+308;
                };
                readonly changePeriod: {
                    readonly type: "string";
                };
                readonly noChanges: {
                    readonly type: "boolean";
                };
                readonly chart: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly value: {
                                readonly type: "number";
                                readonly format: "double";
                                readonly minimum: -1.7976931348623157e+308;
                                readonly maximum: 1.7976931348623157e+308;
                            };
                            readonly timestamp: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetBlobById: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly description: "Queried blob id.";
                    readonly default: "xC9Ic2CAzLmVQq78BV5gww_cbZv00aCyVCXhEab1ijE";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly blobId: {
                    readonly type: "string";
                };
                readonly blobIdBase64: {
                    readonly type: "string";
                };
                readonly senderAddress: {
                    readonly type: "string";
                };
                readonly senderName: {
                    readonly type: "string";
                };
                readonly senderImg: {
                    readonly type: "string";
                };
                readonly suiObjectId: {
                    readonly type: "string";
                };
                readonly startEpoch: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly endEpoch: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly size: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
                readonly suiPackageId: {
                    readonly type: "string";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetBlobs: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly page: {
                    readonly minimum: 0;
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly default: 0;
                    readonly maximum: 2147483647;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Queried API page.";
                };
                readonly size: {
                    readonly maximum: 100;
                    readonly minimum: 1;
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly default: 20;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Number of queried entries.";
                };
                readonly orderBy: {
                    readonly type: "string";
                    readonly default: "DESC";
                    readonly enum: readonly ["ASC", "DESC"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Sorting method: from the lowest element to the highest (ASC) or from the highest element to the lowest (DESC).";
                };
                readonly sortBy: {
                    readonly type: "string";
                    readonly description: "Select sorting parameter.";
                    readonly default: "TIMESTAMP";
                    readonly enum: readonly ["START_EPOCH", "END_EPOCH", "SIZE", "TIMESTAMP"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly ["page", "size", "orderBy", "sortBy"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly totalElements: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
                readonly totalPages: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly pageable: {
                    readonly type: "object";
                    readonly properties: {
                        readonly pageNumber: {
                            readonly type: "integer";
                            readonly format: "int32";
                            readonly minimum: -2147483648;
                            readonly maximum: 2147483647;
                        };
                        readonly pageSize: {
                            readonly type: "integer";
                            readonly format: "int32";
                            readonly minimum: -2147483648;
                            readonly maximum: 2147483647;
                        };
                        readonly offset: {
                            readonly type: "integer";
                            readonly format: "int64";
                            readonly minimum: -9223372036854776000;
                            readonly maximum: 9223372036854776000;
                        };
                        readonly sort: {
                            readonly type: "object";
                            readonly properties: {
                                readonly sorted: {
                                    readonly type: "boolean";
                                };
                                readonly empty: {
                                    readonly type: "boolean";
                                };
                                readonly unsorted: {
                                    readonly type: "boolean";
                                };
                            };
                        };
                        readonly paged: {
                            readonly type: "boolean";
                        };
                        readonly unpaged: {
                            readonly type: "boolean";
                        };
                    };
                };
                readonly size: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly content: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly blobId: {
                                readonly type: "string";
                            };
                            readonly blobIdBase64: {
                                readonly type: "string";
                            };
                            readonly objectId: {
                                readonly type: "string";
                            };
                            readonly status: {
                                readonly type: "string";
                            };
                            readonly startEpoch: {
                                readonly type: "integer";
                                readonly format: "int32";
                                readonly minimum: -2147483648;
                                readonly maximum: 2147483647;
                            };
                            readonly endEpoch: {
                                readonly type: "integer";
                                readonly format: "int32";
                                readonly minimum: -2147483648;
                                readonly maximum: 2147483647;
                            };
                            readonly size: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly timestamp: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                        };
                    };
                };
                readonly number: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly sort: {
                    readonly type: "object";
                    readonly properties: {
                        readonly sorted: {
                            readonly type: "boolean";
                        };
                        readonly empty: {
                            readonly type: "boolean";
                        };
                        readonly unsorted: {
                            readonly type: "boolean";
                        };
                    };
                };
                readonly numberOfElements: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly first: {
                    readonly type: "boolean";
                };
                readonly last: {
                    readonly type: "boolean";
                };
                readonly empty: {
                    readonly type: "boolean";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetBlobsCountChart: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly period: {
                    readonly type: "string";
                    readonly description: "Chart period.";
                    readonly default: "24H";
                    readonly enum: readonly ["24H"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly size: {
                    readonly type: "string";
                    readonly description: "Number of queried entries.";
                    readonly default: "SMALL";
                    readonly enum: readonly ["SMALL", "LARGE"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly widgetPage: {
                    readonly type: "string";
                    readonly description: "The page on which the chart is shown.";
                    readonly default: "HOME";
                    readonly enum: readonly ["HOME", "ANALYTICS"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly ["period", "size", "widgetPage"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly value: {
                    readonly type: "number";
                    readonly format: "double";
                    readonly minimum: -1.7976931348623157e+308;
                    readonly maximum: 1.7976931348623157e+308;
                };
                readonly changeValue: {
                    readonly type: "number";
                    readonly format: "double";
                    readonly minimum: -1.7976931348623157e+308;
                    readonly maximum: 1.7976931348623157e+308;
                };
                readonly changePercent: {
                    readonly type: "number";
                    readonly format: "double";
                    readonly minimum: -1.7976931348623157e+308;
                    readonly maximum: 1.7976931348623157e+308;
                };
                readonly additionalValue: {
                    readonly type: "number";
                    readonly format: "double";
                    readonly minimum: -1.7976931348623157e+308;
                    readonly maximum: 1.7976931348623157e+308;
                };
                readonly maxRate: {
                    readonly type: "number";
                    readonly format: "double";
                    readonly minimum: -1.7976931348623157e+308;
                    readonly maximum: 1.7976931348623157e+308;
                };
                readonly changeRate: {
                    readonly type: "number";
                    readonly format: "double";
                    readonly minimum: -1.7976931348623157e+308;
                    readonly maximum: 1.7976931348623157e+308;
                };
                readonly changePeriod: {
                    readonly type: "string";
                };
                readonly noChanges: {
                    readonly type: "boolean";
                };
                readonly chart: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly value: {
                                readonly type: "number";
                                readonly format: "double";
                                readonly minimum: -1.7976931348623157e+308;
                                readonly maximum: 1.7976931348623157e+308;
                            };
                            readonly timestamp: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetDelegationsByValidator: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly address: {
                    readonly type: "string";
                    readonly description: "Queried validator address digest (hash).";
                    readonly default: "0x248a6e1a20a83623179856ea69a38efcfd16cb7fdb5d5dba494adb98ac7f66bb";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly ["address"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly page: {
                    readonly minimum: 0;
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly default: 0;
                    readonly maximum: 2147483647;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Queried API page.";
                };
                readonly size: {
                    readonly maximum: 100;
                    readonly minimum: 1;
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly default: 20;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Number of queried entries.";
                };
                readonly orderBy: {
                    readonly type: "string";
                    readonly default: "DESC";
                    readonly enum: readonly ["ASC", "DESC"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Sorting method: from the lowest element to the highest (ASC) or from the highest element to the lowest (DESC).";
                };
                readonly sortBy: {
                    readonly type: "string";
                    readonly description: "Select sorting parameter.";
                    readonly default: "TIMESTAMP";
                    readonly enum: readonly ["AMOUNT", "TIMESTAMP", "ACTIVATION_EPOCH"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly ["page", "size", "orderBy", "sortBy"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly totalElements: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
                readonly totalPages: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly pageable: {
                    readonly type: "object";
                    readonly properties: {
                        readonly pageNumber: {
                            readonly type: "integer";
                            readonly format: "int32";
                            readonly minimum: -2147483648;
                            readonly maximum: 2147483647;
                        };
                        readonly pageSize: {
                            readonly type: "integer";
                            readonly format: "int32";
                            readonly minimum: -2147483648;
                            readonly maximum: 2147483647;
                        };
                        readonly offset: {
                            readonly type: "integer";
                            readonly format: "int64";
                            readonly minimum: -9223372036854776000;
                            readonly maximum: 9223372036854776000;
                        };
                        readonly sort: {
                            readonly type: "object";
                            readonly properties: {
                                readonly sorted: {
                                    readonly type: "boolean";
                                };
                                readonly empty: {
                                    readonly type: "boolean";
                                };
                                readonly unsorted: {
                                    readonly type: "boolean";
                                };
                            };
                        };
                        readonly paged: {
                            readonly type: "boolean";
                        };
                        readonly unpaged: {
                            readonly type: "boolean";
                        };
                    };
                };
                readonly size: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly content: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly owner: {
                                readonly type: "string";
                            };
                            readonly amount: {
                                readonly type: "number";
                            };
                            readonly activationEpoch: {
                                readonly type: "integer";
                                readonly format: "int32";
                                readonly minimum: -2147483648;
                                readonly maximum: 2147483647;
                            };
                            readonly timestamp: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly objectId: {
                                readonly type: "string";
                            };
                            readonly state: {
                                readonly type: "string";
                            };
                            readonly txDigest: {
                                readonly type: "string";
                            };
                        };
                    };
                };
                readonly number: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly sort: {
                    readonly type: "object";
                    readonly properties: {
                        readonly sorted: {
                            readonly type: "boolean";
                        };
                        readonly empty: {
                            readonly type: "boolean";
                        };
                        readonly unsorted: {
                            readonly type: "boolean";
                        };
                    };
                };
                readonly numberOfElements: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly first: {
                    readonly type: "boolean";
                };
                readonly last: {
                    readonly type: "boolean";
                };
                readonly empty: {
                    readonly type: "boolean";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetDelegatorsByValidator: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly address: {
                    readonly type: "string";
                    readonly description: "Queried validator address digest (hash).";
                    readonly default: "0x248a6e1a20a83623179856ea69a38efcfd16cb7fdb5d5dba494adb98ac7f66bb";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly ["address"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly page: {
                    readonly minimum: 0;
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly default: 0;
                    readonly maximum: 2147483647;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Queried API page.";
                };
                readonly size: {
                    readonly maximum: 100;
                    readonly minimum: 1;
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly default: 20;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Number of queried entries.";
                };
                readonly orderBy: {
                    readonly type: "string";
                    readonly default: "DESC";
                    readonly enum: readonly ["ASC", "DESC"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Sorting method: from the lowest element to the highest (ASC) or from the highest element to the lowest (DESC).";
                };
                readonly sortBy: {
                    readonly type: "string";
                    readonly description: "Select sorting parameter.";
                    readonly default: "AMOUNT";
                    readonly enum: readonly ["AMOUNT", "ACTIVATION_EPOCH"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly ["page", "size", "orderBy", "sortBy"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly totalElements: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
                readonly totalPages: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly pageable: {
                    readonly type: "object";
                    readonly properties: {
                        readonly pageNumber: {
                            readonly type: "integer";
                            readonly format: "int32";
                            readonly minimum: -2147483648;
                            readonly maximum: 2147483647;
                        };
                        readonly pageSize: {
                            readonly type: "integer";
                            readonly format: "int32";
                            readonly minimum: -2147483648;
                            readonly maximum: 2147483647;
                        };
                        readonly offset: {
                            readonly type: "integer";
                            readonly format: "int64";
                            readonly minimum: -9223372036854776000;
                            readonly maximum: 9223372036854776000;
                        };
                        readonly sort: {
                            readonly type: "object";
                            readonly properties: {
                                readonly sorted: {
                                    readonly type: "boolean";
                                };
                                readonly empty: {
                                    readonly type: "boolean";
                                };
                                readonly unsorted: {
                                    readonly type: "boolean";
                                };
                            };
                        };
                        readonly paged: {
                            readonly type: "boolean";
                        };
                        readonly unpaged: {
                            readonly type: "boolean";
                        };
                    };
                };
                readonly size: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly content: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly owner: {
                                readonly type: "string";
                            };
                            readonly amount: {
                                readonly type: "number";
                            };
                            readonly activationEpoch: {
                                readonly type: "integer";
                                readonly format: "int32";
                                readonly minimum: -2147483648;
                                readonly maximum: 2147483647;
                            };
                            readonly timestamp: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                        };
                    };
                };
                readonly number: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly sort: {
                    readonly type: "object";
                    readonly properties: {
                        readonly sorted: {
                            readonly type: "boolean";
                        };
                        readonly empty: {
                            readonly type: "boolean";
                        };
                        readonly unsorted: {
                            readonly type: "boolean";
                        };
                    };
                };
                readonly numberOfElements: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly first: {
                    readonly type: "boolean";
                };
                readonly last: {
                    readonly type: "boolean";
                };
                readonly empty: {
                    readonly type: "boolean";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetValidatorByAddress: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly address: {
                    readonly type: "string";
                    readonly description: "Queried validator address digest (hash).";
                    readonly default: "0x248a6e1a20a83623179856ea69a38efcfd16cb7fdb5d5dba494adb98ac7f66bb";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly ["address"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly validatorHash: {
                    readonly type: "string";
                };
                readonly validatorName: {
                    readonly type: "string";
                };
                readonly commissionRate: {
                    readonly type: "number";
                };
                readonly nextCommissionRate: {
                    readonly type: "number";
                };
                readonly stake: {
                    readonly type: "number";
                };
                readonly state: {
                    readonly type: "string";
                };
                readonly activationEpoch: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly latestEpoch: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly poolTokenBalance: {
                    readonly type: "number";
                };
                readonly rewardsPool: {
                    readonly type: "number";
                };
                readonly walBalance: {
                    readonly type: "number";
                };
                readonly nodeCapacity: {
                    readonly type: "number";
                };
                readonly storagePrice: {
                    readonly type: "number";
                };
                readonly writePrice: {
                    readonly type: "number";
                };
                readonly poolShare: {
                    readonly type: "number";
                };
                readonly weight: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly description: {
                    readonly type: "string";
                };
                readonly imageUrl: {
                    readonly type: "string";
                };
                readonly projectUrl: {
                    readonly type: "string";
                };
                readonly commissionReceiver: {
                    readonly type: "string";
                };
                readonly governanceAuthorized: {
                    readonly type: "string";
                };
                readonly pendingStake: {
                    readonly type: "number";
                };
                readonly preActiveWithdrawals: {
                    readonly type: "number";
                };
                readonly pendingShareWithdrawals: {
                    readonly type: "number";
                };
                readonly operatorRewards: {
                    readonly type: "number";
                };
                readonly operator: {
                    readonly type: "boolean";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetValidators: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly page: {
                    readonly minimum: 0;
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly default: 0;
                    readonly maximum: 2147483647;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Queried API page.";
                };
                readonly size: {
                    readonly maximum: 200;
                    readonly minimum: 1;
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly default: 20;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Number of queried entries.";
                };
                readonly orderBy: {
                    readonly type: "string";
                    readonly default: "DESC";
                    readonly enum: readonly ["ASC", "DESC"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Sorting method: from the lowest element to the highest (ASC) or from the highest element to the lowest (DESC).";
                };
                readonly sortBy: {
                    readonly type: "string";
                    readonly description: "Select sorting parameter.";
                    readonly default: "STAKE";
                    readonly enum: readonly ["VALIDATOR_NAME", "COMMISSION_RATE", "STATUS", "STAKE"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly validatorTypes: {
                    readonly maxItems: 2;
                    readonly uniqueItems: true;
                    readonly type: "array";
                    readonly items: {
                        readonly type: "string";
                        readonly description: "The types of queried objects.";
                        readonly enum: readonly ["Commitee", "nonCommitee"];
                    };
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly validatorStatuses: {
                    readonly maxItems: 2;
                    readonly uniqueItems: true;
                    readonly type: "array";
                    readonly items: {
                        readonly type: "string";
                        readonly description: "The statuses of validators.";
                        readonly enum: readonly ["New", "Active"];
                    };
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly ["page", "size", "orderBy", "sortBy"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly totalElements: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
                readonly totalPages: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly pageable: {
                    readonly type: "object";
                    readonly properties: {
                        readonly pageNumber: {
                            readonly type: "integer";
                            readonly format: "int32";
                            readonly minimum: -2147483648;
                            readonly maximum: 2147483647;
                        };
                        readonly pageSize: {
                            readonly type: "integer";
                            readonly format: "int32";
                            readonly minimum: -2147483648;
                            readonly maximum: 2147483647;
                        };
                        readonly offset: {
                            readonly type: "integer";
                            readonly format: "int64";
                            readonly minimum: -9223372036854776000;
                            readonly maximum: 9223372036854776000;
                        };
                        readonly sort: {
                            readonly type: "object";
                            readonly properties: {
                                readonly sorted: {
                                    readonly type: "boolean";
                                };
                                readonly empty: {
                                    readonly type: "boolean";
                                };
                                readonly unsorted: {
                                    readonly type: "boolean";
                                };
                            };
                        };
                        readonly paged: {
                            readonly type: "boolean";
                        };
                        readonly unpaged: {
                            readonly type: "boolean";
                        };
                    };
                };
                readonly size: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly content: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly validatorHash: {
                                readonly type: "string";
                            };
                            readonly validatorName: {
                                readonly type: "string";
                            };
                            readonly commissionRate: {
                                readonly type: "number";
                            };
                            readonly nextCommissionRate: {
                                readonly type: "number";
                            };
                            readonly stake: {
                                readonly type: "number";
                            };
                            readonly state: {
                                readonly type: "string";
                            };
                            readonly activationEpoch: {
                                readonly type: "integer";
                                readonly format: "int32";
                                readonly minimum: -2147483648;
                                readonly maximum: 2147483647;
                            };
                            readonly latestEpoch: {
                                readonly type: "integer";
                                readonly format: "int32";
                                readonly minimum: -2147483648;
                                readonly maximum: 2147483647;
                            };
                            readonly poolTokenBalance: {
                                readonly type: "number";
                            };
                            readonly rewardsPool: {
                                readonly type: "number";
                            };
                            readonly walBalance: {
                                readonly type: "number";
                            };
                            readonly nodeCapacity: {
                                readonly type: "number";
                            };
                            readonly storagePrice: {
                                readonly type: "number";
                            };
                            readonly writePrice: {
                                readonly type: "number";
                            };
                            readonly poolShare: {
                                readonly type: "number";
                            };
                            readonly weight: {
                                readonly type: "integer";
                                readonly format: "int32";
                                readonly minimum: -2147483648;
                                readonly maximum: 2147483647;
                            };
                            readonly description: {
                                readonly type: "string";
                            };
                            readonly imageUrl: {
                                readonly type: "string";
                            };
                            readonly projectUrl: {
                                readonly type: "string";
                            };
                            readonly commissionReceiver: {
                                readonly type: "string";
                            };
                            readonly governanceAuthorized: {
                                readonly type: "string";
                            };
                            readonly pendingStake: {
                                readonly type: "number";
                            };
                            readonly preActiveWithdrawals: {
                                readonly type: "number";
                            };
                            readonly pendingShareWithdrawals: {
                                readonly type: "number";
                            };
                            readonly operatorRewards: {
                                readonly type: "number";
                            };
                            readonly operator: {
                                readonly type: "boolean";
                            };
                        };
                    };
                };
                readonly number: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly sort: {
                    readonly type: "object";
                    readonly properties: {
                        readonly sorted: {
                            readonly type: "boolean";
                        };
                        readonly empty: {
                            readonly type: "boolean";
                        };
                        readonly unsorted: {
                            readonly type: "boolean";
                        };
                    };
                };
                readonly numberOfElements: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly first: {
                    readonly type: "boolean";
                };
                readonly last: {
                    readonly type: "boolean";
                };
                readonly empty: {
                    readonly type: "boolean";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
export { GetAccountBlobs, GetAccountByHash, GetAccounts1, GetAccountsCountChart, GetAvgBlobSizeChart, GetBlobById, GetBlobs, GetBlobsCountChart, GetDelegationsByValidator, GetDelegatorsByValidator, GetValidatorByAddress, GetValidators };

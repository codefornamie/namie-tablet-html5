/*! dc1-client - v1.3.14 - 2014-09-08 */

/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */

///**
//* @namespace PCSクライアントライブラリクラス群を内包する名前空間。
//*/
/**
 * @namespace Namespace enclosing the PCS client library classes.
 */
var dcc = {};

/** Code group that operates HTTP.*/
dcc.http = {};

/** Code group to which browser is required as execution environment. */
dcc.browser = {};

/** Code group to which engine is required as execution environment. */
dcc.engine = {};

/** Code group used for Cell control objects except Box and the operations. */
dcc.cellctl = {};

/** Code group for unit control objects. */
dcc.unitctl = {};

/** Code group for processing in Box. */
dcc.box = {};

/** Code group for user OData processing. */
dcc.box.odata = {};

/** Code group for schema control processing of user OData. */
dcc.box.odata.schema = {};

///**
//* @class JS-DAOの動作設定情報を保持するオブジェクト.
//* @constructor
//*/
/**
 * It creates a new object dcc.ClientConfig.
 * @class This class is used for holding the operation setting information of JS-DAO.
 * @constructor
 */
dcc.ClientConfig = function() {
  this.initializeProperties();
};

///**
//* プロパティを初期化する.
//*/
/**
 * This method initializes the properties of this class.
 */
dcc.ClientConfig.prototype.initializeProperties = function() {
///** HTTPタイムアウト値 (number). */
  /** HTTP time-out value (number). */
  this.connectionTimeout = 0;

///** PUT/POST時にChunked指定をするかどうか (boolean). */
  /** Whether Chunked is specified at PUT / POST (boolean).*/
  this.chunked = true;

///** 通信を非同期で行うかどうか (boolean). */
  /** Whether is asynchronous communication (boolean). */
  // 現時点ではLogの書き込みのみ対応
  this.async = undefined;

///** HttpClientクラス. */
  /** HttpClient class. */
  this.httpClient = null;

///** テスト時に実通信を抑止するためのモッククラス. */
//this.mockRestAdapter = null;
};


///**
//* HTTPタイムアウト値を取得する.
//* @return {Number} タイムアウト値(ms)
//*/
/**
 * This method is used to get the HTTP time-out value.
 * @return {Number} Time-out value (ms)
 */
dcc.ClientConfig.prototype.getConnectionTimeout = function() {
  return this.connectionTimeout;
};

///**
//* HTTPタイムアウト値を設定する.
//* number型以外を指定した場合は例外をスローする.
//* @param {Number} value タイムアウト値(ms)
//*/
/**
 * This method is used to set the HTTP time-out value.
 * It throws an exception if a non-type is specified.
 * @param {Number} value Time-out value (ms)
 */
dcc.ClientConfig.prototype.setConnectionTimeout = function(value) {
  if (typeof value !== "number") {
    throw new dcc.ClientException("InvalidParameter");
  }
  this.connectionTimeout = value;
};

///**
//* Chunked指定の有無を取得する.
//* @return {boolean} Chunked値
//*/
/**
 * This method gets the Chunked attribute as specified.
 * @return {boolean} Chunked value
 */
dcc.ClientConfig.prototype.getChunked = function() {
  return this.chunked;
};

///**
//* Chunked指定の有無を設定する.
//* boolean型以外を指定した場合は例外をスローする.
//* @param {boolean} value Chunked値
//*/
/**
 * This method sets the Chunked attribute.
 * It throws an exception if a non-boolean type is specified.
 * @param {boolean} value Chunked value
 */
dcc.ClientConfig.prototype.setChunked = function(value) {
  if (typeof value !== "boolean") {
    throw new dcc.ClientException("InvalidParameter");
  }
  this.chunked = value;
};

///**
//* 非同期通信を行うかどうかを取得する.
//* @return {?} 非同期フラグ
//*/
/**
 * This method gets the asynchronous attribute as specified.
 * You will be prompted to asynchronous communication.
 * @return {Boolean} Asynchronous flag
 */
dcc.ClientConfig.prototype.getAsync = function() {
  return this.async;
};

///**
//* 非同期通信を行うか否かを設定する.
//* boolean型以外を指定した場合は例外をスローする.
//* @param {?} value 非同期フラグ
//*/
/**
 * This method sets the asynchronous attribute.
 * It throws an exception if a non-boolean type is specified.
 * @param {Boolean} value Asynchronous flag
 */
dcc.ClientConfig.prototype.setAsync = function(value) {
  if (typeof value !== "boolean") {
    throw new dcc.ClientException("InvalidParameter");
  }
  this.async = value;
};

///**
//* HttpClientオブジェクト取得.
//* @return {?} HttpClientオブジェクト
//*/
/**
 * This method acquires HttpClient object.
 * @return {dcc.http.DcHttpClient} HttpClient object
 */
dcc.ClientConfig.prototype.getHttpClient = function() {
  return this.httpClient;
};

///**
//* HttpClientオブジェクト設定.
//* @param {?} value HttpClientオブジェクト
//*/
/**
 * This method sets HttpClient object.
 * @param {dcc.http.DcHttpClient} value HttpClient object
 */
dcc.ClientConfig.prototype.setHttpClient = function(value) {
  this.httpClient = value;
};

///**
//* RestAdapterのモッククラスを取得.
//* @return RestAdapterモッククラス
//*/
////public final RestAdapter getMockRestAdapter() {
//dcc.ClientConfig.prototype.getMockRestAdapter = function() {
//return mockRestAdapter;
//};

///**
//* RestAdapterのモッククラスを設定.
//* @param value RestAdapterモッククラス
//*/
////public final void setMockRestAdapter(final RestAdapter value) {
//dcc.ClientConfig.prototype.setMockRestAdapter = function() {
//this.mockRestAdapter = value;
//};


/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class データクラウドコンテキスト.
//* @constructor
//* @param url 基底URL (string)
//* @param name Cell Name (string)
//* @param boxSchema Box DataSchemaURI (string)
//* @param bName Box Name (string)
//*/
/**
 * It creates a new object dcc.DcContext.
 * @class This class is the Data cloud context used as the package for all the files.
 * @constructor
 * @param {String} Base URL
 * @param {String} Cell Name
 * @param {String} Box DataSchemaURI
 * @param {String} Box Name
 */
dcc.DcContext = function(url, name, boxSchema, bName) {
  this.initializeProperties(this, url, name, boxSchema, bName);
};

(function () {
  if (typeof exports !== "undefined") {
    exports.DcContext = dcc.DcContext;
  }
})();

///**
//* バージョン情報を指定するヘッダ.
//*/
/** Header that specifies the version information. */
var DC_VERSION = "X-Dc-Version";

///**
//* プロパティを初期化する.
//* @param {dcc.DcContext} self
//* @param {?} url
//* @param {?} name
//* @param {?} boxSchema
//* @param {?} bName
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.DcContext} self
 * @param {String} url
 * @param {String} name
 * @param {String} boxSchema
 * @param {String} bName
 */
dcc.DcContext.prototype.initializeProperties = function(self, url, name, boxSchema, bName) {
///** 基底URL. */
  /** {String} Base URL. */
  self.baseUrl = url;
  if (self.baseUrl === undefined || self.baseUrl === null) {
    self.baseUrl = "";
  }
  if (self.baseUrl !== "" && !self.baseUrl.endsWith("/")) {
    self.baseUrl += "/";
  }

///** 現在のCellName. */
  /** {String} Current cell name. */
  self.cellName = name;
  if (self.cellName === undefined || self.cellName === null) {
    self.cellName = "";
  }

///** 現在のBoxのDataSchemaURI. */
  /** {String} DataSchemaURI of current Box. */
  self.schema = boxSchema;
  if (self.schema === undefined || self.schema === null) {
    self.schema = "";
  }

///** 現在のBoxName. */
  /** {String} Current box name. */
  self.boxName = bName;
  if (self.boxName === undefined || self.boxName === null) {
    self.boxName = "";
  }

///** クライアントトークン. */
  /** {String} Client token. */
  self.clientToken = "";

///** デフォルトリクエストヘッダ. */
  /** {Object} Default request header. */
//HashMap<String, String> defaultHeaders = new HashMap<String, String>();
  self.defaultHeaders = {};

///** 動作対象プラットフォーム. */
  /** {String} Operating platforms. */
  self.platform = "insecure";

///** カスタマイズ可能な情報を管理するオブジェクト. */
  /** {dcc.ClientConfig} Object that manages a customizable information. */
  self.config = new dcc.ClientConfig();

///** キャッシュ用クラス. */
//this.cacheMap = new CacheMap();
};

///**
//* 基底URLの取得.
//* @return {String} URL文字列 (string)
//*/
/**
 * This method gets the base URL.
 * @return {String} Base URL (string)
 */
dcc.DcContext.prototype.getBaseUrl = function() {
  return this.baseUrl;
};

///**
//* 基底URLを設定する.
//* @param {String} URL文字列 (string)
//*/
/**
 * This method sets the base URL.
 * @param {String} Base URL (string)
 */
dcc.DcContext.prototype.setBaseUrl = function(value) {
  if (typeof value !== "string") {
    throw new dcc.ClientException("InvalidParameter");
  }
  this.baseUrl = value;
};

///**
//* CellのIDを取得.
//* @return {String} CellのID値 (string)
//*/
/**
 * This method gets the ID/name of the Cell.
 * @return {String} Cell name(string)
 */
dcc.DcContext.prototype.getCellName = function() {
  return this.cellName;
};

///**
//* CellのIDを設定.
//* @param {String} value CellのID値 (string)
//*/
/**
 * This method sets the ID/name of the Cell.
 * @param {String} value Cell name (string)
 */
dcc.DcContext.prototype.setCellName = function(value) {
  if (typeof value !== "string") {
    throw new dcc.ClientException("InvalidParameter");
  }
  this.cellName = value;
};

///**
//* BoxのDataSchemaURIの取得.
//* @return {String} BoxのDataSchemaURI値 (string)
//*/
/**
 * This method gets the Box DataSchemaURI.
 * @return {String} Box DataSchemaURI (string)
 */
dcc.DcContext.prototype.getBoxSchema = function() {
  return this.schema;
};

///**
//* BoxのDataSchemaURIの設定.
//* @param {String} value BoxのDataSchemaURI値 (string)
//*/
/**
 * This method sets the Box DataSchemaURI.
 * @param {String} value Box DataSchemaURI (string)
 */
dcc.DcContext.prototype.setBoxSchema = function(value) {
  if (typeof value !== "string") {
    throw new dcc.ClientException("InvalidParameter");
  }
  this.schema = value;
};

///**
//* Box Nameの取得.
//* @return {String} Box Nmae (string)
//*/
/**
 * This method gets the Box Name.
 * @return {String} Box Nmae (string)
 */
dcc.DcContext.prototype.getBoxName = function() {
  return this.boxName;
};

///**
//* Box Nameの設定.
//* @param {String} value Box Name (string)
//*/
/**
 * This method sets the Box Name.
 * @param {String} value Box Name (string)
 */
dcc.DcContext.prototype.setBoxName = function(value) {
  if (typeof value !== "string") {
    throw new dcc.ClientException("InvalidParameter");
  }
  this.boxName = value;
};

///**
//* CellのURLを取得.
//* @return {String} CellのURL
//*/
/**
 * This method gets the Cell URL.
 * @return {String} Cell URL
 */
dcc.DcContext.prototype.getCellUrl = function() {
  return this.baseUrl + this.cellName + "/";
};

///**
//* クライアントトークンを取得する.
//* @return {String} クライアントトークン (string)
//*/
/**
 * This method acquires the client access token.
 * @return {String} access token (string)
 */
dcc.DcContext.prototype.getClientToken = function() {
  return this.clientToken;
};

///**
//* クライアントトークンを設定する.
//* @param {String} value クライアントトークン (string)
//*/
/**
 * This method sets the client access token.
 * @param {String} value access token (string)
 */
dcc.DcContext.prototype.setClientToken = function(value) {
  if (typeof value !== "string") {
    throw new dcc.ClientException("InvalidParameter");
  }
  this.clientToken = value;
  if (this.clientToken === null) {
    this.clientToken = "";
  }
};

///**
//* リクエストを行う際に付加するリクエストヘッダのデフォルト値をセット.
//* @param {String} key ヘッダ名
//* @param {String} value 値
//*/
/**
 * This method sets the default value of the request header to
 *  be added when making the request.
 * @param {String} key Header name
 * @param {String} value value
 */
//public final void setDefaultHeader(String key, String value) {
dcc.DcContext.prototype.setDefaultHeader = function(key, value) {
  this.defaultHeaders[key] = value;
};

///**
//* リクエストを行う際に付加するリクエストヘッダのデフォルト値を削除.
//* @param {String} key ヘッダ名
//*/
/**
 * This method removes the default value of the request
 *  header to be added when making the request.
 * @param {String} key Header name
 */
//public final void removeDefaultHeader(String key) {
dcc.DcContext.prototype.removeDefaultHeader = function(key) {
  delete this.defaultHeaders[key];
};

///**
//* DCの利用バージョンを設定.
//* @param {?} value バージョン
//*/
/**
 * This method sets the Dc Version.
 * @param {String} value Version
 */
//public final void setDcVersion(final String value) {
dcc.DcContext.prototype.setDcVersion = function(value) {
  this.setDefaultHeader(DC_VERSION,value);
};

///**
//* DCの利用バージョンを取得.
//* @return {?} データクラウドバージョン
//*/
/**
 * This method gets the Dc Version.
 * @return {String} value Version
 */
//public final String getDcVersion() {
dcc.DcContext.prototype.getDcVersion = function() {
  return this.defaultHeaders[DC_VERSION];
};

///**
//* 動作対象プラットフォームを取得.
//* @return {String} プラットフォーム名 (string)
//*/
/**
 * This method gets the operating platforms.
 * @return {String} Platform name (string)
 */
dcc.DcContext.prototype.getPlatform = function() {
  return this.platform;
};

///**
//* 動作対象プラットフォームをセット.
//* @param {String} value プラットフォーム名 (string)
//*/
/**
 * This method sets the operating platforms.
 * @param {String} value Platform name (string)
 */
dcc.DcContext.prototype.setPlatform = function(value) {
  if (typeof value !== "string") {
    throw new dcc.ClientException("InvalidParameter");
  }
  this.platform = value;
};

///**
//* キャッシュ用オブジェクト(CacheMap)の設定.
//* @param value CacheMapオブジェクト
//*/
////public final void setCacheMap(final CacheMap value) {
//dcc.DcContext.prototype.setCacheMap = function() {
//this.cacheMap = value;
//};

///**
//* キャッシュ用オブジェクト(CacheMap)の取得.
//* @return CacheMapオブジェクト
//*/
////public final CacheMap getCacheMap() {
//dcc.DcContext.prototype.getCacheMap = function() {
//return this.cacheMap;
//};

///**
//* ClientConfigオブジェクトの取得.
//* @return {dcc.ClientConfig} ClientConfigオブジェクト
//*/
/**
 * This method acquires the ClientConfig object.
 * @return {dcc.ClientConfig} ClientConfig object
 */
//public final ClientConfig getClientConfig() {
dcc.DcContext.prototype.getClientConfig = function() {
  return this.config;
};

///**
//* HTTPのタイムアウト値を設定.
//* @param {Number} value タイムアウト値
//*/
/**
 * This method sets the timeout value for HTTP.
 * @param {Number} value Time-out value
 */
//public final void setConnectionTimeout(final int value) {
dcc.DcContext.prototype.setConnectionTimeout = function(value) {
  this.config.setConnectionTimeout(value);
};

///**
//* Chunked値を設定.
//* @param {boolean} value Chunked値
//*/
/**
 * This method sets the Chunked value.
 * @param {boolean} value Chunked value
 */
//public final void setChunked(final Boolean value) {
dcc.DcContext.prototype.setChunked = function(value) {
  this.config.setChunked(value);
};

///**
//* 非同期通信フラグを設定.
//* @param {?} value 非同期フラグ
//*/
/**
 * This method sets the asynchronous communication flag.
 * @param {Boolean} value Asynchronous flag
 */
//public final void setThreadable(final Boolean value) {
dcc.DcContext.prototype.setAsync = function(value) {
  this.config.setAsync(value);
};

///**
//* 非同期通信フラグを取得.
//* @return {?} 非同期通信フラグ
//*/
/**
 * This method gets the asynchronous communication flag.
 * @return {Boolean} value Asynchronous flag
 */
//public final Boolean getThreadable() {
dcc.DcContext.prototype.getAsync = function() {
  return this.config.getAsync();
};

///**
//* HttpClientオブジェクトを設定.
//* @param value HttpClientオブジェクト
//*/
////public final void setHttpClient(final HttpClient value) {
//dcc.DcContext.prototype.setHttpClient = function() {
//this.config.setHttpClient(value);
//};

///**
//* アクセッサを生成します. リクエストヘッダのトークンを利用し、アクセッサを生成します。
//* @param {String} cellUrl 認証先Cell (string)
//* @param {String} userId ユーザID (string)
//* @param {String} password ユーザパスワード (string)
//* @return {dcc.Accessor} 生成したAccessorインスタンス
//* @throws {ClientException} DAO例外
//*/
/**
 * This method generates accessor and utilizes token of the request header.
 * @param {String} cellUrl Cell URL (string)
 * @param {String} userId UserID (string)
 * @param {String} password Password (string)
 * @param {Object} options json object having schemaUrl, schemaId, schemaPwd
 * @return {dcc.Accessor} Accessor object
 * @throws {dcc.ClientException} DAO exception
 */
dcc.DcContext.prototype.asAccount = function(cellUrl, userId, password, options) {
  return this.getAccessorWithAccount(cellUrl, userId, password, options);
};

///**
//* アクセッサを生成します. リクエストヘッダのトークンを利用し、アクセッサを生成します。
//* @param {String} cellUrl 認証先Cell (string)
//* @param {String} userId ユーザID (string)
//* @param {String} password ユーザパスワード (string)
//* @return {dcc.Accessor} 生成したAccessorインスタンス
//* @throws {ClientException} DAO例外
//*/
/**
 * This method generates accessor and utilizes token of the request header.
 * @param {String} cellUrl Cell URL (string)
 * @param {String} userId UserID (string)
 * @param {String} password Password (string)
 * @param {Object} options json object having schemaUrl, schemaId, schemaPwd
 * @return {dcc.Accessor} Accessor object
 * @throws {dcc.ClientException} DAO exception
 */
dcc.DcContext.prototype.getAccessorWithAccount = function(cellUrl, userId, password, options) {
  var as = new dcc.Accessor(this);
  if(options !== undefined){
    if(options.schemaUrl !== undefined){
      as.setSchema(options.schemaUrl);
    }
    if(options.schemaId !== undefined){
      as.setSchemaUserId(options.schemaId);
    }
    if(options.schemaPwd !== undefined){
      as.setSchemaPassword(options.schemaPwd);
    }
  }
  as.setCellName(cellUrl);
  as.setUserId(userId);
  as.setPassword(password);
  as.setDefaultHeaders(this.defaultHeaders);
  return as;
};

///**
//* アクセッサを生成します. リクエストヘッダのトークンを利用し、アクセッサを生成します。
//* @param {String} cellUrl 認証先Cell
//* @param {String} token トランスセルアクセストークン
//* @return {dcc.Accessor} 生成したAccessorインスタンス
//* @throws {ClientException} DAO例外
//*/
/**
 * This method generates accessor and utilizes transformer
 * cell token of the request header.
 * @param {String} cellUrl Cell URL
 * @param {String} token Transformer cell access token
 * @return {dcc.Accessor} Accessor object
 * @throws {dcc.ClientException} DAO exception
 */
dcc.DcContext.prototype.getAccessorWithTransCellToken = function(cellUrl, token) {
  var as = new dcc.Accessor(this);
  as.setCellName(cellUrl);
  as.setTransCellToken(token);
  as.setDefaultHeaders(this.defaultHeaders);
  return as;
};

///**
//* アクセッサを生成します. リクエストヘッダのトークンを利用し、アクセッサを生成します。
//* @param {String} token トークン
//* @return {dcc.Accessor} 生成したAccessorインスタンス
//* @throws {ClientException} DAO例外
//*/
/**
 * This method generates accessor and utilizes token of the request header.
 * @param {String} token Token value
 * @return {dcc.Accessor} Accessor object
 * @throws {dcc.ClientException} DAO exception
 */
dcc.DcContext.prototype.withToken = function(token) {
  var as = new dcc.Accessor(this);
  as.setAccessType(dcc.Accessor.ACCESSOR_KEY_TOKEN);
  as.setAccessToken(token);
  as.setDefaultHeaders(this.defaultHeaders);
  return as;
};

///**
//* アクセッサを生成します. リクエストヘッダのトークンを利用し、アクセッサを生成します。
//* @param {String} cellUrl 認証先Cell
//* @param {String} token リフレッシュトークン
//* @return {dcc.Accessor} 生成したAccessorインスタンス
//* @throws {ClientException} DAO例外
//*/
/**
 * This method generates accessor and utilizes refresh token of the request header.
 * @param {String} cellUrl Cell URL
 * @param {String} token Refresh token
 * @return {dcc.Accessor} Accessor object
 * @throws {dcc.ClientException} DAO exception
 */
dcc.DcContext.prototype.getAccessorWithRefreshToken = function(cellUrl, token) {
  var as = new dcc.Accessor(this);
  as.setCellName(cellUrl);
  as.setTransCellRefreshToken(token);
  as.setDefaultHeaders(this.defaultHeaders);
  return as;
};

/**
 * This method generates accessor and utilizes refresh token of the request header along with schema authentication.
 * @param {String} cellUrl Cell URL
 * @param {String} refreshToken Refresh token
 * @param {String} schemaUrl Schema url
 * @param {String} schemaUserId Schema UserID
 * @param {String} schemaPassword Schema password
 * @return {dcc.Accessor} Accessor object
 * @throws {dcc.ClientException} DAO exception
 */
dcc.DcContext.prototype.getAccessorWithRefreshTokenAndSchemaAuthn = function(cellUrl , refreshToken , schemaUrl , schemaUserId , schemaPassword) {
    var as = new dcc.Accessor(this);
    as.setCellName(cellUrl);
    as.setTransCellRefreshToken(refreshToken);
    as.setSchema(schemaUrl);
    as.setSchemaUserId(schemaUserId);
    as.setSchemaPassword(schemaPassword);
    as.setDefaultHeaders(this.defaultHeaders);
    return as;
};

///**
//* アクセッサを生成します. リクエストヘッダのトークンを利用し、アクセッサを生成します。
//* @param {String} cellUrl 認証先Cell
//* @param {String} userId ユーザID
//* @param {String} password ユーザパスワード
//* @param {String} schemaUrl スキーマセルurl
//* @param {String} schemaUserId スキーマセルユーザID
//* @param {String} schemaPassword スキーマセルユーザパスワード
//* @return {dcc.Accessor} 生成したAccessorインスタンス
//* @throws {ClientException} DAO例外
//*/
/**
 * This method generates accessor with schema authentication.
 * @param {String} cellUrl Cell URL
 * @param {String} userId UserID
 * @param {String} password Password
 * @param {String} schemaUrl Schema url
 * @param {String} schemaUserId Schema UserID
 * @param {String} schemaPassword Schema password
 * @return {dcc.Accessor} Accessor object
 * @throws {dcc.ClientException} DAO exception
 */
dcc.DcContext.prototype.asAccountWithSchemaAuthn = function(cellUrl, userId, password, schemaUrl, schemaUserId, schemaPassword) {
  return this.getAccessorWithAccountAndSchemaAuthn(cellUrl, userId, password, schemaUrl, schemaUserId,
      schemaPassword);
};

///**
//* アクセッサを生成します. リクエストヘッダのトークンを利用し、アクセッサを生成します。
//* @param {String} cellUrl 認証先Cell
//* @param {String} userId ユーザID
//* @param {String} password ユーザパスワード
//* @param {String} schemaUrl スキーマセルurl
//* @param {String} schemaUserId スキーマセルユーザID
//* @param {String} schemaPassword スキーマセルユーザパスワード
//* @return {dcc.Accessor} 生成したAccessorインスタンス
//* @throws {ClientException} DAO例外
//*/
/**
 * This method generates accessor with account and schema authentication.
 * @param {String} cellUrl Cell URL
 * @param {String} userId userid
 * @param {String} password Password
 * @param {String} schemaUrl Schema url
 * @param {String} schemaUserId Schema User ID
 * @param {String} schemaPassword Schema Password
 * @return {dcc.Accessor} Accessor object
 * @throws {dcc.ClientException} DAO exception
 */
dcc.DcContext.prototype.getAccessorWithAccountAndSchemaAuthn = function(cellUrl, userId, password, schemaUrl, schemaUserId, schemaPassword) {
  var as = new dcc.Accessor(this);
  as.setCellName(cellUrl);
  as.setUserId(userId);
  as.setPassword(password);
  as.setSchema(schemaUrl);
  as.setSchemaUserId(schemaUserId);
  as.setSchemaPassword(schemaPassword);
  as.setDefaultHeaders(this.defaultHeaders);
  return as;
};

///**
//* アクセッサを生成します. リクエストヘッダのトークンを利用し、アクセッサを生成します。
//* @param {String} cellUrl 認証先Cell
//* @param {String} token トランスセルトークン
//* @param {String} schemaUrl スキーマセルurl
//* @param {String} schemaUserId スキーマセルユーザID
//* @param {String} schemaPassword スキーマセルユーザパスワード
//* @return {dcc.Accessor} 生成したAccessorインスタンス
//* @throws {ClientException} DAO例外
//*/
/**
 * This method generates accessor with transformer cell access token
 * and schema authentication.
 * @param {String} cellUrl Cell URL
 * @param {String} token Transformer cell token
 * @param {String} schemaUrl Schema url
 * @param {String} schemaUserId Schema userid
 * @param {String} schemaPassword Schema Password
 * @return {dcc.Accessor} Accessor object
 * @throws {dcc.ClientException} DAO exception
 */
dcc.DcContext.prototype.getAccessorWithTransCellTokenAndSchemaAuthn = function(cellUrl, token, schemaUrl, schemaUserId, schemaPassword) {
  var as = new dcc.Accessor(this);
  as.setCellName(cellUrl);
  as.setTransCellToken(token);
  as.setSchema(schemaUrl);
  as.setSchemaUserId(schemaUserId);
  as.setSchemaPassword(schemaPassword);
  as.setDefaultHeaders(this.defaultHeaders);
  return as;
};

///**
//* JSONObjectオブジェクトを生成.
//* @return {?} 生成したJSONObjectオブジェクト
//*/
/**
 * This method generates JSONObject object.
 * @return {Object} JSONObject object
 */
//public final JSONObject newJson() {
dcc.DcContext.prototype.newJson = function() {
  return {};
};

///**
//* JSON文字列から、JSONObjectオブジェクトを生成.
//* @param {String} jsonStr JSON文字列
//* @return {?} 変換後のJSONObject
//* @throws org.json.simple.parser.ParseException JSONパース例外
//*/
/**
 * This method generates JSONObject object from JSON string.
 * @param {String} jsonStr JSON string
 * @return {Object} JSONObject
 * @throws org.json.simple.parser.ParseException JSON object
 */
//public final JSONObject newJson(final String jsonStr) throws org.json.simple.parser.ParseException {
dcc.DcContext.prototype.newJson = function(jsonStr) {
  return JSON.parse(jsonStr);
};

///**
//* TODO Java DAO の本来の機能ではないため、別のクラスに移動する必要がある.
//* @param str デコード対象の文字列
//* @param charset 文字コード
//* @return デコード後の文字列
//* @throws UnsupportedEncodingException 例外
//* @throws DecoderException 例外
//*/
////public final String decodeURI(final String str, final String charset) throws UnsupportedEncodingException,
////DecoderException {
//dcc.DcContext.prototype.decodeURI = function() {
//URLCodec codec = new URLCodec();
//return codec.decode(str, charset);
//};

///**
//* TODO Java DAO の本来の機能ではないため、別のクラスに移動する必要がある.
//* @param str デコード対象の文字列
//* @return デコード後の文字列
//* @throws UnsupportedEncodingException 例外
//* @throws DecoderException 例外
//*/
////public final String decodeURI(final String str) throws UnsupportedEncodingException, DecoderException {
//dcc.DcContext.prototype.decodeURI = function() {
//URLCodec codec = new URLCodec();
//return codec.decode(str, "utf-8");
//};


//private String serviceSubject;

///**
//* サービスサブジェクトのsetter.
//* @param serviceSubject サービスサブジェクト
//*/
//public void setServiceSubject(String serviceSubject) {
//this.serviceSubject = serviceSubject;
//}

//private String schemaUrl;

///**
//* ボックスのスキーマURLのsetter.
//* @param schemaUrl ボックススキーマURL
//*/
//public void setSchemaUrl(String schemaUrl) {
//this.schemaUrl = schemaUrl;
//}

///**
//* コンストラクタ.
//* @param url 基底URL
//* @param name Cell Name
//* @param boxSchema Box DataSchemaURI
//* @param bName Box-Name
//*/
//public DcEngineDao(final String url, final String name, final String boxSchema, final String bName) {
//super(url, name, boxSchema, bName);
//}

///**
//* アクセッサを生成します. マスタトークンを利用し、アクセッサを生成します。（正式実装は セルフトークンを利用する）
//* @return 生成したAccessorインスタンス
//* @throws ClientException DAO例外
//*/
//public final Accessor asServiceSubject() throws ClientException {
////サービスサブジェクト設定が未設定
//if ("".equals(this.serviceSubject)) {
//throw ClientException.create("ServiceSubject undefined.", 0);
//}

////設定されたアカウントが、存在することをチェックする。

////トークン生成
//long issuedAt = new Date().getTime();
//AccountAccessToken localToken = new AccountAccessToken(
//issuedAt,
//AccountAccessToken.ACCESS_TOKEN_EXPIRES_HOUR * AccountAccessToken.MILLISECS_IN_AN_HOUR,
//this.getCellUrl(),
//this.serviceSubject,
//this.schemaUrl);

//Accessor as = this.withToken(localToken.toTokenString());
//as.setAccessType(Accessor.KEY_SELF);
//return as;
//}

///**
//* アクセッサを生成します. リクエストヘッダのトークンを利用し、アクセッサを生成します。
//* @return {dcc.Accessor} 生成したAccessorインスタンス
//* @throws {ClientException} DAO例外
//*/
/**
 * This method generates accessor using client access token of request header.
 * @return {dcc.Accessor} Accessor object
 * @throws {dcc.ClientException} DAO exception
 */
//public final Accessor withClientToken() throws ClientException {
dcc.DcContext.prototype.withClientToken = function() {
  return this.withToken(this.getClientToken());
};

/**
 * This method generates accessor and utilizes refresh token of the request header along with schema authentication.
 * @param {String} cellUrl Cell URL
 * @param {String} refreshToken Refresh token
 * @param {String} schemaUrl Schema url
 * @param {String} schemaUserId Schema UserID
 * @param {String} schemaPassword Schema password
 * @return {dcc.Accessor} Accessor object
 * @throws {dcc.ClientException} DAO exception
 */
dcc.DcContext.prototype.getAccessorWithRefreshTokenAndSchemaAuthn = function(cellUrl , refreshToken , schemaUrl , schemaUserId , schemaPassword) {
  var as = new dcc.Accessor(this);
  as.setCellName(cellUrl);
  as.setTransCellRefreshToken(refreshToken);
  as.setSchema(schemaUrl);
  as.setSchemaUserId(schemaUserId);
  as.setSchemaPassword(schemaPassword);
  as.setDefaultHeaders(this.defaultHeaders);
  return as;
};


/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false
 */

/*function dcc(){}*/
/**
 * It initializes dcc.DcClass.
 * @class This class represents namespace for all other classes.
 * @constructor
 */
dcc.DcClass = function() {
};

/**
 * This method is used for inheriting one class in another.
 * @param {Object} Child
 * @param {Object} Parent
 */
dcc.DcClass.extend = function(Child, Parent) {
  var F = function(){};
  F.prototype = Parent.prototype;
  Child.prototype = new F();
  Child.prototype.constructor = Child;
};


/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */

/**
 * This method replaces regular expressions.
 */
String.prototype.escapeRegExp = function() {
  return this.replace(/([\.\?\*\+\[\]\(\)\{\}\^\$])/g, "\\" + RegExp.$1);
};

/**
 * This method starts the string.
 * @param str
 * @returns {Boolean}
 */
String.prototype.startsWith = function(str) {
  return str !== undefined && !!this.match(new RegExp("^" + str.escapeRegExp()));
};

/**
 * This methods ends the string.
 * @param str
 * @returns {Boolean}
 */
String.prototype.endsWith = function(str) {
  return str !== undefined && !!this.match(new RegExp(str.escapeRegExp() + "$"));
};


/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false
 */

///**
//* URL文字列を操作するクラス.
//* @constructor
//*/
/**
 * Class to manipulate the URL string.
 * @constructor
 */
dcc.UrlUtils = function() {
};

///**
//* URLにパスを追加する.
//* @static
//* @param baseUrl URL文字列
//* @param path 追加するパス
//* @return 生成したURL文字列
//*/
/**
 * This method appends the path to BaseURL.
 * @static
 * @param {String} baseUrl BaseURL
 * @param {String} path Path
 * @return {String} Complete URL
 */
dcc.UrlUtils.append = function(baseUrl, path) {
  var url = baseUrl;
  if (!baseUrl.endsWith("/")) {
    url += "/";
  }
  url += path;
  return url;
};

///**
//* 対象urlが有効かチェックを行う.
//* @static
//* @param url チェック対象url文字列
//* @return true： 有効/false：無効
//*/
/**
 * This method checks whether the target URL is valid or not.
 * @static
 * @param {String} url Target URL
 * @return {Boolean} true： Enable/false: Disable
 */
dcc.UrlUtils.isUrl = function(url) {
  if (url.match(/^(http|https):\/\//i)) {
    return true;
  }
  return false;
};

/**
 * This method adds trailing slash character if not present.
 * @static
 * @param {String} url URL
 * @return {String} url URL with trailing slash character.
 */
dcc.UrlUtils.addTrailingSlash = function(url) {
  if (url.endsWith("/")) {
    return url;
  }
  return url + "/";
};

/**
 * This method extracts the first path from a URL.
 * @static
 * @param {String} url URL
 * @return {String} path string
 */
dcc.UrlUtils.extractFirstPath = function(url) {
  if (dcc.UrlUtils.isUrl(url)) {
    return url.replace(/https?\:\/\/[^\/]+\/([^\/]+).*/,"$1");
  }
  return url;
};

/**
 * This method returns the character string of x-www-form-urlencoded format of json request.
 * @static
 * @param {Object} json optional parameters to be extracted from response
 * @return {String} character string in key = value format.
 */
dcc.UrlUtils.jsonToW3Form = function(json) {
  var requestBody = "";
  for(var key in json){
    if(json[key]){
      requestBody += key + "=" + json[key] + "&";
    }
  }
  //console.log(typeof requestBody);
  if(dcc.UrlUtils.endsWith(requestBody, "&")){
    requestBody = requestBody.substr(0, requestBody.lastIndexOf("&"));
  }
  return requestBody;
};

/**
 * This method checks if a string ends with a specified symbol.
 * If it ends with a specified symbol it returns true otherwise false.
 * @static
 * @return {Boolean} true or false.
 */
dcc.UrlUtils.endsWith = function(string,symbol){
  var lastIndex = string.lastIndexOf(symbol);
  return (lastIndex !== -1) && (lastIndex + symbol.length === string.length);
};
/**
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false, XMLHttpRequest:false*/

/**
 * It creates a new object dcc.http.DcHttpClient.
 * @class This class is the abstraction Layer of HTTP Client.
 * @param {Boolean} async true value represents asynchronous mode
 */
dcc.http.DcHttpClient = function(async) {
  this.requestHeaders = [];
  this.httpClient = new XMLHttpRequest();
  /** Global level synchronous/asynchronous mode for library. */
  this.defaultAsync = false;
  this.overrideMimeType = "";
  /** async refers to current execution mode, default to synchronous mode. */
  this.async = false;
  if(async){
    /** set the mode to asynchronous. */
    this.async = async;
  }
};

dcc.http.DcHttpClient.prototype.setResponseType = function(type) {
    this.httpClient.responseType = type;
};

/**
 * This method sets the HTTP Request Header.
 * @param {String} header key
 * @param {String} header value
 */
dcc.http.DcHttpClient.prototype.setRequestHeader = function(key, value) {
  var header = {};
  header[key] = value;
  this.requestHeaders.push(header);
};

/**
 * This method sets overrideMimeType.
 * @param {String} MimeType value
 */
dcc.http.DcHttpClient.prototype.setOverrideMimeType = function(value) {
  this.overrideMimeType = value;
};

/**
 * This method is the getter for HTTP Status Code.
 * @returns {String} HTTP Status Code
 */
dcc.http.DcHttpClient.prototype.getStatusCode = function() {
  return this.httpClient.status;
};

/**
 * Thi smethod gets the specified response header value.
 * @param {String} header name
 * @returns {String} header value
 */
dcc.http.DcHttpClient.prototype.getResponseHeader = function(key) {
  var header = this.httpClient.getResponseHeader(key);
  if (header === null) {
    header = "";
  }
  return header;
};

/**
 * This method gets all the response headers.
 * @returns {Object} response header
 */
dcc.http.DcHttpClient.prototype.getAllResponseHeaders = function() {
  var headersStr = this.httpClient.getAllResponseHeaders();
  var headers = {};
  var headersArray = headersStr.split("\n");
  for (var i = 0; i < headersArray.length; i++) {
    var arr = headersArray[i].split(":");
    var headerName = arr.shift();
    if (headerName === "") {
      continue;
    }
    var headerValue = arr.join(":");
    headerValue = headerValue.replace(/(^\s+)|(\s+$)/g, "");
    headers[headerName] = headerValue;
  }
  return headers;
};

/**
 * This method retrieves the response body in the form of string.
 * @returns {String} responseText
 */
dcc.http.DcHttpClient.prototype.bodyAsString = function() {
  return this.httpClient.responseText;
};

/**
 * This method retrieves the response body in the form of binary.
 * @returns {Object} response object
 */
dcc.http.DcHttpClient.prototype.bodyAsBinary = function() {
  return this.httpClient.response;
};

/**
 * This method retrieves the response body in the form of JSON object.
 * @returns {Object} responseText JSON format
 */
dcc.http.DcHttpClient.prototype.bodyAsJson = function() {
  try {
    if (this.httpClient.responseText === "") {
      return {};
    }
    return JSON.parse(this.httpClient.responseText);
  } catch (e) {
    throw new Error("json parse exception: " + e.message);
  }
};

/**
 * This method retrieves the response body in the form of XML.
 * @return {String} XML DOM Object
 */
dcc.http.DcHttpClient.prototype.bodyAsXml = function() {
  return this.httpClient.responseXML;
};

/**
 * Execute method is used to send an HTTP Request.
 * @private
 * @param {String} method
 * @param {String} requestUrl
 * @param {Object} requestBody
 * @param {Object} callback
 * @returns {dcc.Promise} Promise object
 */
dcc.http.DcHttpClient.prototype._execute = function(method, requestUrl, requestBody, callback) {
  console.log("[PCS] ReqURL : " + requestUrl);
  console.log("[PCS] Method : " + method);
  console.log("[PCS] ReqBod : " + requestBody);
  var self = this;
  var xhr = this.httpClient;
  var promise = new dcc.Promise();

  if (callback !== undefined) {
    xhr.open(method, requestUrl, true);
    xhr.requestUrl = method + ":" + requestUrl;
  } else {
    xhr.open(method, requestUrl, false);
  }

  if (this.overrideMimeType !== "") {
    xhr.overrideMimeType(this.overrideMimeType);
  }
  for (var index in this.requestHeaders) {
    var header = this.requestHeaders[index];
    for (var key in header) {
      xhr.setRequestHeader(key, header[key]);
    }
  }
  xhr.onload = function () {
    //if(xhr.responseText !== ""){
    //var results = xhr.responseText;//JSON.parse(xhr.responseText);
    if (200 <= xhr.status && xhr.status < 300) {
      promise.resolve(xhr);
    }else{
      promise.reject(xhr);
    }
    if (callback !== undefined) {
      callback(self);
    }
    //}
  };
  xhr.onerror = function (e) {
    promise.reject(e.target.status);
  };
  xhr.send(requestBody);
  return promise;
};

/**
 * Execute method is used to send an HTTP Request,
 * decides request mode based on this.async.
 * @private
 * @param {String} method GET, POST, PUT,DELETE
 * @param {String} requestUrl
 * @param {Object} options contains body and callback success, error and complete
 * @param {accessor} to set response header
 * @returns {dcc.Promise} Promise object
 */
dcc.http.DcHttpClient.prototype._execute2 = function(method, requestUrl, options, accessor) {
  var self = this;
  var xhr = this.httpClient;
  var promise = new dcc.Promise();
  var requestBody = "";

  xhr.open(method, requestUrl, this.async);
  if(options.body !== undefined && options.body !== null){
    requestBody = options.body;
  }
  if(this.async){
    xhr.requestUrl = method + ":" + requestUrl;
  }
  if (this.overrideMimeType !== "") {
    xhr.overrideMimeType(this.overrideMimeType);
  }
  for (var index in this.requestHeaders) {
    var header = this.requestHeaders[index];
    for (var key in header) {
      xhr.setRequestHeader(key, header[key]);
    }
  }
  xhr.onload = function () {
    /** handle the promise based on status code. */
    if (200 <= xhr.status && xhr.status <= 400) {
      promise.resolve(xhr);
    }else{
      promise.reject(xhr);
    }
    //set the response headers
    if(accessor){
      accessor.setResHeaders(xhr.getAllResponseHeaders());
    }
    /** handle the callback based on status code. */
    if(options!== null && options !== undefined){
      /** if status code is between 200 to 300, execute success callback. */
      if(200 <= xhr.status && xhr.status <= 300){
        if(options.success){
          options.success(self);
        }
      }
      else if(300 <= xhr.status && xhr.status < 400){
        //no response body may exist in this scenario, has to be handled by calling code
        if(options.success){
          options.success(self);
        }
      }
      else{
        /** execute error callback. */
        if(options.error){
          options.error(self);
        }
      }
      /** execute complete callback. */
      if(options.complete){
        options.complete(self);
      }
    }
  };
  xhr.onerror = function (e) {
    promise.reject(e.target.status);
  };
  xhr.send(requestBody);
  return promise;
};

/**
 * This method sets Asynchronous mode.
 * @param {Boolean} async true to set mode as asynchronous
 */
dcc.http.DcHttpClient.prototype.setAsync = function(async){
  this.async = async;
};


/**
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false
 */

///**
//* リクエストオブジェクトを生成するBuilderクラス.
//* @class Represents DcRequestHeaderBuilder.
//*/
/**
 * It creates a new object dcc.http.DcHttpClient.
 * @class This is a builder class that generates a request header object.
 * @constructor
 */
dcc.http.DcRequestHeaderBuilder = function() {
  this.initializeProperties();
};

///**
//* プロパティを初期化する.
//*/
/**
 * This method initializes the properties of this class.
 */
dcc.http.DcRequestHeaderBuilder.prototype.initializeProperties = function() {
///** ContentType値. */
  /** ContentType value. */
  this.contentTypeHeaderValue = null;
///** Accept値. */
  /** Accept value. */
  this.acceptHeaderValue = null;
///** IF-MATCHヘッダ値. */
  /** IF-MATCH header value. */
  this.ifMatchValue = null;
///** IF-NONE-MATCH値. */
  /** IF-NONE-MATCH header value. */
  this.ifNoneMatchValue = null;
///** ETag値. */
  /** ETag value. */
  this.etagHeaderValue = null;
///** Token値. */
  /** Token value. */
  this.tokenValue = null;
///** Depth値. */
  /** Depth value. */
  this.depthValue = null;
///** AcceptEncoding値. */
  /** AcceptEncoding value. */
  this.encodingValue = null;
///** デフォルトヘッダ. */
  /** Default header. */
  this.defaultHeadersValue = null;
  /** X-Dc-Recursive */
  this.xdcRecursiveValue = null;
};

///**
//* Acceptをセットする.
//* @param value Acceptヘッダ値
//* @return 自分自身のオブジェクト
//*/
/**
 * This method sets AcceptHeader value.
 * @param {String} AcceptHeader value
 * @return {Object} Its own object
 */
dcc.http.DcRequestHeaderBuilder.prototype.accept = function(value) {
  this.acceptHeaderValue = value;
  return this;
};

///**
//* ContentTypeをセットする.
//* @param value ContentType値.
//* @return 自分自身のオブジェクト
//*/
/**
 * This method sets ContentType value.
 * @param {String} ContentType value
 * @return {Object} Its own object
 */
dcc.http.DcRequestHeaderBuilder.prototype.contentType = function(value) {
  this.contentTypeHeaderValue = value;
  return this;
};

///**
//* ETagをセットする.
//* @param value ETag値
//* @return 自分自身のオブジェクト
//*/
/**
 * This method sets ETag value.
 * @param {String} ETag value
 * @return {Object} Its own object
 */
dcc.http.DcRequestHeaderBuilder.prototype.etag = function(value) {
  this.etagHeaderValue = value;
  return this;
};

///**
//* Tokenをセットする.
//* @param value Token値
//* @return 自分自身のオブジェクト
//*/
/**
 * This method sets Token value.
 * @param {String} Token value
 * @return {Object} Its own object
 */
dcc.http.DcRequestHeaderBuilder.prototype.token = function(value) {
  this.tokenValue = value;
  return this;
};

///**
//* AcceptEncodingをセットする.
//* @param value AcceptEncoding値
//* @return 自分自身のオブジェクト
//*/
/**
 * This method sets AcceptEncoding value.
 * @param {String} AcceptEncoding value
 * @return {Object} Its own object
 */
dcc.http.DcRequestHeaderBuilder.prototype.acceptEncoding = function(value) {
  this.encodingValue = value;
  return this;
};

///**
//* IF-MATCHをセットする.
//* @param value IF-MATCH値
//* @return 自分自身のオブジェクト
//*/
/**
 * This method sets IF-MATCH value.
 * @param {Boolean} IF-MATCH value
 * @return {Object} Its own object
 */
dcc.http.DcRequestHeaderBuilder.prototype.ifMatch = function(value) {
  this.ifMatchValue = value;
  return this;
};

///**
//* IF-NONE-MATCHをセットする.
//* @param value IF-NONE-MATCH値
//* @return 自分自身のオブジェクト
//*/
/**
 * This method sets IF-NONE-MATCH value.
 * @param {Boolean} IF-NONE-MATCH value
 * @return {Object} Its own object
 */
dcc.http.DcRequestHeaderBuilder.prototype.ifNoneMatch = function(value) {
  this.ifNoneMatchValue = value;
  return this;
};

///**
//* Depthをセットする.
//* @param value Depth値
//* @return 自分自身のオブジェクト
//*/
/**
 * This method sets Depth value.
 * @param {String} Depth value
 * @return {Object} Its own object
 */
dcc.http.DcRequestHeaderBuilder.prototype.depth = function(value) {
  this.depthValue = value;
  return this;
};

///**
//* デフォルトヘッダをセットする.
//* @param value デフォルトヘッダ
//* @return 自分自身のオブジェクト
//*/
/**
 * This method sets Default Headers.
 * @param {String} DefaultHeader value
 * @return {Object} Its own object
 */
dcc.http.DcRequestHeaderBuilder.prototype.defaultHeaders = function(value) {
  this.defaultHeadersValue = value;
  return this;
};

/**
 * This method sets X-Dc-Recursive.
 * @param {Boolean} X-Dc-Recursive value
 * @return {Object} Its own object
 */
dcc.http.DcRequestHeaderBuilder.prototype.xdcRecursive = function(value) {
  this.xdcRecursiveValue = value;
  return this;
};

///**
//* ContentTypeの取得.
//* @return ContentType値
//*/
/**
 * This method returns ContentType value.
 * @return {String} ContentType value
 */
dcc.http.DcRequestHeaderBuilder.prototype.getContentType = function() {
  return this.contentTypeHeaderValue;
};

///**
//* Acceptの取得.
//* @return Accept値
//*/
/**
 * This method returns AcceptHeader value.
 * @return {String} AcceptHeader value
 */
dcc.http.DcRequestHeaderBuilder.prototype.getAccept = function() {
  return this.acceptHeaderValue;
};

///**
//* ETagの取得.
//* @return ETaq値
//*/
/**
 * This method returns ETag value.
 * @return {String} ETaq value
 */
dcc.http.DcRequestHeaderBuilder.prototype.getETag = function() {
  return this.etagHeaderValue;
};

///**
//* Tokenの取得.
//* @return Token値
//*/
/**
 * This method returns Token value.
 * @return {String} Token value
 */
dcc.http.DcRequestHeaderBuilder.prototype.getToken = function() {
  return this.tokenValue;
};

///**
//* AcceptEncodingを取得.
//* @return AcceptEncoding値
//*/
/**
 * This method returns AcceptEncoding value.
 * @return {String} AcceptEncoding value
 */
dcc.http.DcRequestHeaderBuilder.prototype.getAcceptEncoding = function() {
  return this.encodingValue;
};

///**
//* Depth値を取得.
//* @return Depth値
//*/
/**
 * This method returns Depth value.
 * @return {String} Depth value
 */
dcc.http.DcRequestHeaderBuilder.prototype.getDepth = function() {
  return this.depthValue;
};

///**
//* IF-MATCH値を取得.
//* @return IF-MATCH値
//*/
/**
 * This method returns IF-MATCH value.
 * @return {Boolean} IF-MATCH value
 */
dcc.http.DcRequestHeaderBuilder.prototype.getIfMatch = function() {
  return this.ifMatchValue;
};

///**
//* IF-NONE-MATCH値を取得.
//* @return IF-NONE-MATCH値
//*/
/**
 * This method returns IF-NONE-MATCH value.
 * @return {Boolean} IF-NONE-MATCH value
 */
dcc.http.DcRequestHeaderBuilder.prototype.getIfNoneMatch = function() {
  return this.ifNoneMatchValue;
};

/**
 * This method returns X-Dc-Recursive value.
 * @return {Boolean} X-Dc-Recursive value
 */
dcc.http.DcRequestHeaderBuilder.prototype.getXdcRecursive = function() {
  return this.xdcRecursiveValue;
};

///**
//* ヘッダを設定する.
//* @param req リクエストオブジェクト
//* @param headers header parameters
//* @return リクエストオブジェクト
//*/
/**
 * This method sets the parameters in the request header.
 * @param {dcc.http.DcHttpClient} Request object
 * @param {Object} header parameters
 * @return {dcc.http.DcHttpClient} Request object
 */
dcc.http.DcRequestHeaderBuilder.prototype.build = function(req, headers) {
  if (this.tokenValue !== null) {
    req.setRequestHeader("Authorization", "Bearer " + this.tokenValue);
  }
  if (this.acceptHeaderValue !== null) {
    req.setRequestHeader("Accept", this.acceptHeaderValue);
  }
  if (this.contentTypeHeaderValue !== null) {
    req.setRequestHeader("Content-Type", this.contentTypeHeaderValue);
  }
  if (this.etagHeaderValue !== null) {
    req.setRequestHeader("If-Match", this.etagHeaderValue);
  }
  if (this.encodingValue !== null) {
    req.setRequestHeader("Accept-Encoding", this.encodingValue);
  }
  if (this.ifMatchValue !== null) {
    req.setRequestHeader("If-Match", this.ifMatchValue);
  }
  if (this.ifNoneMatchValue !== null) {
    req.setRequestHeader("If-None-Match", this.ifNoneMatchValue);
  }
  if (this.depthValue !== null) {
    req.setRequestHeader("Depth", this.depthValue);
  }
  if (this.xdcRecursiveValue !== null) {
    req.setRequestHeader("X-Dc-Recursive", this.xdcRecursiveValue);
  }

  // デフォルトヘッダがセットされていれば、それらを設定。
  /** If default header is set, then configure it. */
  // 最初にセットしない理由は、リクエストヘッダは、同名ヘッダが複数登録されてしまうため
  /** The reason you do not want to set for the first time, since the request header,
	    would have been more than one registration is the same name header. */
  if (this.defaultHeadersValue !== null) {
    for (var defaultHeaderKey in this.defaultHeadersValue) {
      req.setRequestHeader(defaultHeaderKey, this.defaultHeadersValue[defaultHeaderKey]);
    }
  }

  if (typeof headers === "object") {
    for (var key in headers) {
      req.setRequestHeader(key, headers[key]);
    }
  }
  return req;
};

/**
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class RESTアクセスのためのクラス.
//* @param as ACCESSOR object
//* @constructor
//*/
/**
 * It creates a new object dcc.http.RestAdapter.
 * @class This class is used for REST access.
 * @param {dcc.Accessor} as ACCESSOR object
 * @constructor
 * @param {dcc.Accessor} Accessor
 */
dcc.http.RestAdapter = function(as) {
  this.initializeProperties(as);
};

if (typeof exports === "undefined") {
  exports = {};
}
exports.RestAdapter = dcc.http.RestAdapter;

///**
//* プロパティを初期化する.
//* @param as ACCESSOR object
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.Accessor} as ACCESSOR object
 */
dcc.http.RestAdapter.prototype.initializeProperties = function(as) {
///** アクセス主体. */
  /** Accessor object. */
  this.accessor = as;

  /** HTTPClient. */
  var config = as.getClientConfig();
  this.httpConnectionTimeout = config.getConnectionTimeout();

  this.httpClient = this.createHttpClient();
};

///**
//* HTTPクライアントのインスタンスを返す.
//* @return {object} HTTPクライアントオブジェクト
//*/
/**
 * This method returns an instance of the HTTP client.
 * @return {dcc.http.DcHttpClient} HTTP Client object
 */
dcc.http.RestAdapter.prototype.createHttpClient = function() {
  // TODO ファクトリクラス化する
  return new dcc.http.DcHttpClient();
};

///**
//* レスポンスボディを受け取るGETメソッド(If-None-Macth指定).
//* @param requestUrl リクエスト対象URL
//* @param accept Acceptヘッダ値
//* @param etag 取得するEtag
//* @param callback object
//* @return DcHttpClient
//* @throws ClientException DAO例外
//*/
/**
 * GET method to receive the response body (If-None-Macth specified).
 * @param {String} requestUrl
 * @param {String} accept
 * @param {String} etag
 * @param {Object} options  object contains success, error, complete callback, headers and body
 * @return {dcc.http.DcHttpClient} DcHttpClient
 * @throws {dcc.ClientException} DAO exception
 */
dcc.http.RestAdapter.prototype.get = function(requestUrl, accept, etag, options) {
  var builder = new dcc.http.DcRequestHeaderBuilder();
  builder.accept(accept);
  builder.token(this.accessor.accessToken);
  builder.ifNoneMatch(etag);
  builder.defaultHeaders(this.accessor.getDefaultHeaders());

  var xhr = this.httpClient;

  //Validate and prepare the option considering backward compatibility also
  var opts = {};
  if(!options){
    //if no valid options present, instantiate empty opts
    opts  = {};
    opts.headers = {};
  }else{
    opts = options;
    if(!options.headers){
      opts.headers = {};
    }
  }

  /** backward compatibility - if header parameters are not passed on options. */
  if(typeof accept === "string"){
    /**  If a string comes, it will be sent as Accept header. */
    opts.headers.Accept = accept;
  }
  if(typeof etag === "string"){
    /**  If a string comes, it will be sent as If-Match header. */
    opts.headers["If-Match"] = etag;
  }
  //End prepare option object

  //this.request(xhr, "GET", requestUrl, "", builder, {}, callback);
  this._request(xhr, "GET", requestUrl, opts);
  //if (!this.accessor.getContext().getAsync()) {
  if (!this.accessor.getContext().getAsync()) {
    return this.httpClient;
  }
};

///**
//* レスポンスボディをバイナリ型式で受け取るGETメソッド(If-None-Macth指定).
//* @param requestUrl リクエスト対象URL
//* @param etag 取得するEtag
//* @param callback object
//* @return DcHttpClient
//* @throws ClientException DAO例外
//*/
/**
 * GET method that takes a binary model in the request body (If-None-Macth specified).
 * @param {String} requestUrl
 * @param {String} etag
 * @param {Object} callback object
 * @return {dcc.http.DcHttpClient} DcHttpClient
 * @throws {dcc.ClientException} DAO exception
 */
dcc.http.RestAdapter.prototype.getBinary = function(requestUrl, etag, callback) {
  var builder = new dcc.http.DcRequestHeaderBuilder();
  builder.token(this.accessor.accessToken);
  builder.ifNoneMatch(etag);
  builder.defaultHeaders(this.accessor.getDefaultHeaders());

  var xhr = this.httpClient;
  // xhr.setOverrideMimeType("text/plain; charset=x-user-defined");
  // FSTが修正
  //xhr.httpClient.responseType = 'arraybuffer';
  xhr.setResponseType('arraybuffer');
  this.request(xhr, "GET", requestUrl, "", builder, {}, callback);

  if (callback === undefined) {
    return this.httpClient;
  }
};

///**
//* HEADメソッド.
//* @param requestUrl リクエスト対象URL
//* @param {string} etag Used for if-none-match condition
//* @return DcHttpClient
//* @throws ClientException DAO例外
//*/
/**
 * This method uses default headers to fetch the data.
 * @param {String} requestUrl
 * @param {string} etag Used for if-none-match condition
 * @return {dcc.http.DcHttpClient} DcHttpClient
 * @throws {dcc.ClientException} DAO exception
 */
dcc.http.RestAdapter.prototype.head = function(requestUrl, etag) {
  return this.get(requestUrl, "application/json", etag);
};

///**
//* レスポンスボディを受ける PUTメソッド.
//* @param requestUrl リクエスト対象URL
//* @param requestBody data 書き込むデータ
//* @param etag ETag
//* @param contentType CONTENT-TYPE値
//* @param headers header object
//* @param callback object
//* @return DcHttpClient
//* @throws ClientException DAO例外
//*/
/**
 * PUT method to receive the response body.
 * @param {String} requestUrl
 * @param {Object} requestBody data
 * @param {String} ETag value
 * @param {String} CONTENT-TYPE value
 * @param {Object} header object
 * @param {Object} options object
 * @return {dcc.http.DcHttpClient} DcHttpClient
 * @throws {dcc.ClientException} DAO exception
 */
dcc.http.RestAdapter.prototype.put = function(requestUrl, requestBody, etag, contentType, headers, options) {
  var builder = new dcc.http.DcRequestHeaderBuilder();
  builder.contentType(contentType);
  builder.ifMatch(etag);
  builder.token(this.accessor.accessToken);
  builder.defaultHeaders(this.accessor.getDefaultHeaders());

  if(!options){
    options = {};
    options.body = requestBody;
    if(headers){
      options.headers = headers;
    }else{
      options.headers = {};
    }
    if(contentType && contentType !== null){
      options.headers["Content-Type"] = contentType;
    }
    if(etag && etag !== null){
      options.headers["If-Match"] = etag;
    }
  }else{
    if(!options.body){
      options.body = requestBody;
    }
    if(!options.headers){
      if(!headers){
        options.headers = {};
      } else{
        options.headers = headers;
      }
      if(contentType){
        options.headers["Content-Type"] = contentType;
      }
      if(etag){
        options.headers["If-Match"] = etag;
      }
    }
  }
  var xhr = this.httpClient;
  //this.request(xhr, "PUT", requestUrl, requestBody, builder, headers, options);
  this._request(xhr, "PUT", requestUrl, options);
  /*valid option is present with at least one callback*/
  return this.httpClient;
};

///**
//* リクエストボディを受け取る POSTメソッド.
//* @param requestUrl リクエスト対象URL
//* @param requestBody data 書き込むデータ
//* @param contentType CONTENT-TYPE値
//* @param headers header object
//* @param callback object
//* @return DcHttpClient
//* @throws ClientException DAO例外
//*/
/**
 * POST method that receives the request body.
 * @param {String} requestUrl
 * @param {Object} requestBody data
 * @param {String} CONTENT-TYPE value
 * @param {Object} header object
 * @param {Object} options object
 * @return {dcc.http.DcHttpClient} DcHttpClient
 * @throws {dcc.ClientException} DAO exceptionn
 */
dcc.http.RestAdapter.prototype.post = function(requestUrl, requestBody, contentType, headers, options) {
  var builder = new dcc.http.DcRequestHeaderBuilder();
  builder.contentType(contentType);
  builder.token(this.accessor.accessToken);
  builder.defaultHeaders(this.accessor.getDefaultHeaders());
  var xhr = this.httpClient;
  //this.request(xhr, "POST", requestUrl, requestBody, builder, headers, callback);
  if(!options){
    options = {};
    options.body = requestBody;
    if(headers){
      options.headers = headers;
    }else{
      options.headers = {};
    }
    options.headers["Content-Type"] = contentType;
  }else{
    if(!options.body){
      options.body = requestBody;
    }
    if(!options.headers){
      if(!headers){
        options.headers = {};
      } else{
        options.headers = headers;
      }
      options.headers["Content-Type"] = contentType;
    }
  }
  this._request(xhr, "POST", requestUrl, options);
  if (options.success === undefined && options.error === undefined && options.complete === undefined) {
    return this.httpClient;
  }
};

///**
//* レスポンスボディを受けるMERGEメソッド.
//* @param requestUrl リクエスト対象URL
//* @param requestBody data 書き込むデータ
//* @param etag ETag
//* @param contentType CONTENT-TYPE値
//* @param callback object
//* @return DcHttpClient
//* @throws ClientException DAO例外
//*/
/**
 * MERGE method to receive the response body.
 * @param {String} requestUrl
 * @param {Object} requestBody data
 * @param {String} ETag
 * @param {String} CONTENT-TYPE value
 * @param {Object} callback object
 * @return {dcc.http.DcHttpClient} DcHttpClient
 * @throws {dcc.ClientException} DAO exception
 */
dcc.http.RestAdapter.prototype.merge = function(requestUrl, requestBody, etag, contentType, callback) {
  var builder = new dcc.http.DcRequestHeaderBuilder();
  builder.contentType(contentType);
  builder.ifMatch(etag);
  builder.token(this.accessor.accessToken);
  builder.defaultHeaders(this.accessor.getDefaultHeaders());

  var xhr = this.httpClient;
  this.request(xhr, "MERGE", requestUrl, requestBody, builder, {}, callback);

  if (callback === undefined) {
    return this.httpClient;
  }
};

/**
 * This method issues DELETE HTTP request.
 * @param {String} requestUrl target URL to issue DELETE method.
 * @param {String/Object} optionsOrEtag non-mandatory options. If a string is sent it will be sent as If-Match header value for backward compatibility.
 * @param {Object} options.headers Any Extra HTTP request headers to send.
 * @param {Function} options.success Callback function for successful result.
 * @param {Function} options.error Callback function for error response.
 * @param {Function} options.complete Callback function for any response, either successful or error.
 * @param {Object} callback (deprecated) for backward compatibility.
 * @return {dcc.Promise} Promise
 * @throws {dcc.ClientException} DAO exception
 */
dcc.http.RestAdapter.prototype.del = function(requestUrl, optionsOrEtag, callback) {
  var options = {};
  if(!optionsOrEtag){
    optionsOrEtag = {};
  }
  if(!optionsOrEtag.headers){
    optionsOrEtag.headers = {};
  }
  /** backward compatibility. */
  if(typeof optionsOrEtag === "string"){
    /**  If a string comes, it will be sent as If-Match header. */
    options.headers = {};
    options.headers["If-Match"] = optionsOrEtag;
  }else{
    options = optionsOrEtag;
  }
  /** backward compatibility. */
  if (callback){
    options.success = callback.success;
    options.error = callback.error;
    options.complete = callback.complete;
  }
  /** use the new version of internal request method. */
  return this._request(this.httpClient, "DELETE", requestUrl, options);
};

///**
//* ACLメソッド.
//* @param requestUrl リクエスト対象URL
//* @param requestBody リクエストボディ
//* @param callback (deprecated) for backward compatibility.
//* @return DcHttpClient
//* @throws ClientException DAO例外
//*/
/**
 * ACL method to retrieve ACL settings.
 * @param {String} requestUrl
 * @param {Object} requestBody
 * @param {Object} options contains callback and headers.
 * @return {dcc.http.DcHttpClient} httpClient
 * @throws {dcc.ClientException} exception
 */
dcc.http.RestAdapter.prototype.acl = function(requestUrl, requestBody, options) {
  //var builder = new dcc.http.DcRequestHeaderBuilder();
  //builder.contentType("application/xml");
  //builder.accept("application/xml");
  //builder.token(this.accessor.accessToken);
  //builder.defaultHeaders(this.accessor.getDefaultHeaders());
  //Validate and prepare the option
  var opts = {};
  if(!options){
    //if no valid options present, instantiate empty opts
    opts  = {};
    opts.headers = {};
  }else{
    opts = options;
    if(!options.headers){
      opts.headers = {};
    }
  }
  /** if header parameters are not passed on options, set default value. */
  if(!opts.headers.Accept){
    opts.headers.Accept = "application/xml";
  }
  if(!opts.headers["Content-Type"]){
    opts.headers["Content-Type"] = "application/xml";
  }
  //End prepare option object
  opts.body = requestBody;
  var xhr = this.httpClient;
  this._request(xhr, "ACL", requestUrl, opts);
  //this.request(xhr, "ACL", requestUrl, requestBody, builder, {}, objects);
  var callbackExist = options !== undefined &&
  (options.success !== undefined ||
      options.error !== undefined ||
      options.complete !== undefined);
  if (!callbackExist) {
    return this.httpClient;
  }
};

///**
//* MKCOLメソッド.
//* @param requestUrl リクエスト対象URL
//* @param callback (deprecated) for backward compatibility.
//* @return DcHttpClient
//* @throws ClientException DAO例外
//*/
/**
 * MKCOL method for creating collections.
 * @param {String} requestUrl
 * @param {Object} callback (deprecated) for backward compatibility.
 * @return {dcc.http.DcHttpClient} DcHttpClient
 * @throws {dcc.ClientException} DAO exception
 */
dcc.http.RestAdapter.prototype.mkcol = function(requestUrl, callback) {
  /** MKCol用リクエストボディ. */
  var REQUEST_BODY_MKCOL_XML = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
  "<D:mkcol xmlns:D=\"DAV:\" xmlns:dc=\"urn:x-dc1:xmlns\"><D:set><D:prop><D:resourcetype><D:collection/>" +
  "</D:resourcetype></D:prop></D:set></D:mkcol>";

  var builder = new dcc.http.DcRequestHeaderBuilder();
  builder.contentType("application/xml");
  builder.accept("application/xml");
  builder.token(this.accessor.accessToken);
  builder.defaultHeaders(this.accessor.getDefaultHeaders());

  var xhr = this.httpClient;
  this.request(xhr, "MKCOL", requestUrl, REQUEST_BODY_MKCOL_XML, builder, {}, callback);

  if (callback === undefined || callback === "") {
    return this.httpClient;
  }
};

///**
//* MKCOL拡張メソッド(ODataコレクション作成).
//* @param requestUrl リクエスト対象URL
//* @param callback (deprecated) for backward compatibility.
//* @return DcHttpClient
//* @throws ClientException DAO例外
//*/
/**
 * MKCOL method for creating odata collections.
 * @param {String} requestUrl
 * @param {Object} callback (deprecated) for backward compatibility.
 * @return {dcc.http.DcHttpClient} DcHttpClient
 * @throws {dcc.ClientException} DAO exception
 */
dcc.http.RestAdapter.prototype.mkOData = function(requestUrl, callback) {
  /** MKOData用リクエストボディ. */
  var REQUEST_BODYMKODATA_XML = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
  "<D:mkcol xmlns:D=\"DAV:\" xmlns:dc=\"urn:x-dc1:xmlns\"><D:set><D:prop><D:resourcetype><D:collection/>" +
  "<dc:odata/></D:resourcetype></D:prop></D:set></D:mkcol>";

  var builder = new dcc.http.DcRequestHeaderBuilder();
  builder.contentType("application/xml");
  builder.accept("application/xml");
  builder.token(this.accessor.accessToken);
  builder.defaultHeaders(this.accessor.getDefaultHeaders());

  var xhr = this.httpClient;
  this.request(xhr, "MKCOL", requestUrl, REQUEST_BODYMKODATA_XML, builder, {}, callback);

  if (callback === undefined) {
    return this.httpClient;
  }
};

///**
//* MKCOL拡張メソッド(Serviceコレクション作成).
//* @param requestUrl リクエスト対象URL
//* @param callback (deprecated) for backward compatibility.
//* @return DcHttpClient
//* @throws ClientException DAO例外
//*/
/**
 * MKCOL method for creating service collections.
 * @param {String} requestUrl
 * @param {Object} callback (deprecated) for backward compatibility.
 * @return {dcc.http.DcHttpClient} DcHttpClient
 * @throws {dcc.ClientException} DAO exception
 */
dcc.http.RestAdapter.prototype.mkService = function(requestUrl, callback) {
  /** サービスコレクション用リクエストボディ. */
  var REQUEST_BODY_SERVICE_XML = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
  "<D:mkcol xmlns:D=\"DAV:\" xmlns:dc=\"urn:x-dc1:xmlns\"><D:set><D:prop><D:resourcetype>" +
  "<D:collection/><dc:service/></D:resourcetype></D:prop></D:set></D:mkcol>";

  var builder = new dcc.http.DcRequestHeaderBuilder();
  builder.contentType("application/xml");
  builder.accept("application/xml");
  builder.token(this.accessor.accessToken);
  builder.defaultHeaders(this.accessor.getDefaultHeaders());

  var xhr = this.httpClient;
  this.request(xhr, "MKCOL", requestUrl, REQUEST_BODY_SERVICE_XML, builder, {}, callback);

  if (callback === undefined) {
    return this.httpClient;
  }
};

///**
//* サービス登録専用PROPPATCHメソッド.
//* @param requestUrl リクエスト対象URL
//* @param key プロパティ名
//* @param value プロパティの値
//* @param subject サービスサブジェクトの値
//* @param callback (deprecated) for backward compatibility.
//* @return DcHttpClient
//* @throws ClientException DAO例外
//*/
/**
 * Service registration only PROPPATCH method.
 * @param {String} requestUrl
 * @param {String} key
 * @param {String} value
 * @param {String} subject
 * @param {Object} callback (deprecated) for backward compatibility.
 * @return {dcc.http.DcHttpClient} DcHttpClient
 * @throws {dcc.ClientException} DAO exception
 */
/*dcc.http.RestAdapter.prototype.setService = function(requestUrl, key, value, subject, callback) {
  var sb = "";
  sb += "<?xml version=\"1.0\" encoding=\"utf-8\" ?>";
  sb += "<D:propertyupdate xmlns:D=\"DAV:\" xmlns:dc=\"urn:x-dc1:xmlns\" xmlns:Z=\"http://www.w3.com/standards/z39.50/\"><D:set><D:prop>";
  sb += "<dc:service language=\"JavaScript\" subject=\"" + subject + "\">";
  sb += "<dc:path name=\"" + key + "\" src=\"" + value + "\"/>";
  sb += "</dc:service></D:prop></D:set></D:propertyupdate>";

  var builder = new dcc.http.DcRequestHeaderBuilder();
  builder.contentType("application/xml");
  builder.accept("application/xml");
  builder.token(this.accessor.accessToken);
  builder.defaultHeaders(this.accessor.getDefaultHeaders());

  var xhr = this.httpClient;
  this.request(xhr, "PROPPATCH", requestUrl, sb, builder, {}, callback);

  if (callback === undefined) {
    return this.httpClient;
  }
};*/

/**
 * The purpose of this method is to set service(s) single/multiple in one API call
 * through PROPATCH.
 * @param {String} requestUrl target URL
 * @param {String[]} arrServiceNameAndSrcFile service list in combination of service name and source file
 * example {"serviceName":"name","sourceFileName" : "filename.js"}.
 * @param {String} subject Service
 * @param {Object} options refers to optional parameters - callback, headers.
 * @return {dcc.http.DcHttpClient} response
 * @throws {dcc.ClientException} Exception
 */
dcc.http.RestAdapter.prototype.setService = function(requestUrl, arrServiceNameAndSrcFile, subject, options) {
  var key = null;
  var value = null;
  var xhr = this.httpClient;
  var sb = "";
  sb += "<?xml version=\"1.0\" encoding=\"utf-8\" ?>";
  sb += "<D:propertyupdate xmlns:D=\"DAV:\" xmlns:dc=\"urn:x-dc1:xmlns\" xmlns:Z=\"http://www.w3.com/standards/z39.50/\"><D:set><D:prop>";
  sb += "<dc:service language=\"JavaScript\" subject=\"" + subject + "\">";
  var len = arrServiceNameAndSrcFile.length;
  if(!options){
    options = {};
  }
  //instantiate headers if not present
  if(!options.headers){
    options.headers = {};
  }
  for (var i = 0; i < len; i++) {
    key = arrServiceNameAndSrcFile[i].serviceName;
    value = arrServiceNameAndSrcFile[i].sourceFileName;
    sb += "<dc:path name=\"" + key + "\" src=\"" + value + "\"/>";
  }
  sb += "</dc:service></D:prop></D:set></D:propertyupdate>";

  //set options.body
  options.body = sb;

  //set default headers, if not present
  if(!options.headers["Content-Type"]){
    options.headers["Content-Type"] = "application/xml";
  }
  if(!options.headers.Accept){
    options.headers.Accept = "application/xml";
  }
  this._request(xhr, "PROPPATCH", requestUrl, options);

  //this.request(xhr, "PROPPATCH", requestUrl, sb, builder, {}, options);
  if (options.success === undefined &&
      options.error === undefined &&
      options.complete === undefined) {
    //none of the callback is present
    return this.httpClient;
  }
};

///**
//* PROPPATCHメソッド.
//* @param requestUrl リクエスト対象URL
//* @param key プロパティ名
//* @param value プロパティの値
//* @param callback (deprecated) for backward compatibility.
//* @return DcHttpClient
//* @throws ClientException DAO例外
//*/
/**
 * PROPPATCH method.
 * @param {String} requestUrl
 * @param {String} key
 * @param {String} value
 * @param {Object} callback (deprecated) for backward compatibility.
 * @return {dcc.http.DcHttpClient} DcHttpClient
 * @throws {dcc.ClientException} DAO exception
 */
dcc.http.RestAdapter.prototype.proppatch = function(requestUrl, key, value, callback) {
  var sb = "";
  sb += "<D:propertyupdate xmlns:D=\"DAV:\" xmlns:dc=\"urn:x-dc1:xmlns\"><D:set><D:prop>";
  sb += "<" + key + ">";
  sb += value;
  sb += "</" + key + ">";
  sb += "</D:prop></D:set></D:propertyupdate>";

  var builder = new dcc.http.DcRequestHeaderBuilder();
  builder.contentType("application/xml");
  builder.accept("application/xml");
  builder.token(this.accessor.accessToken);
  builder.defaultHeaders(this.accessor.getDefaultHeaders());

  var xhr = this.httpClient;
  this.request(xhr, "PROPPATCH", requestUrl, sb, builder, {}, callback);

  if (callback === undefined) {
    return this.httpClient;
  }
};

/**
 * The purpose of this method is to perform multiple set and remove property operation
 * through PROPPATCH, set or remove property list is an array of key value JSON.
 * @param {String} requestUrl
 * @param {Object} options contains - callback, headers, set(proplist) and remove(proplist)
 * @return {dcc.DcHttpClient} response
 * @throws {dcc.ClientException} Exception
 */
dcc.http.RestAdapter.prototype.multiProppatch = function(requestUrl, options) {
  var key = null;
  var value = null;

  //if options not present or it has no set or remove prop list, do nothing
  if(!options || (!options.set && !options.remove)){
    return;
  }

  var propertyToSet = options.set;
  var propertiesToRemove = options.remove;
  var sb = "<D:propertyupdate xmlns:D=\"DAV:\" xmlns:dc=\"urn:x-dc1:xmlns\" xmlns:Z=\"http://www.w3.com/standards/z39.50/\"><D:set><D:prop>";
  //instantiate headers if not present
  if(!options.headers){
    options.headers = {};
  }

  for ( var i = 0; i < propertyToSet.length; i++) {
    key = propertyToSet[i].propName;
    value = propertyToSet[i].propValue;
    sb += "<" + key + ">";
    sb += value;
    sb += "</" + key + ">";
  }
  sb += "</D:prop></D:set><D:remove><D:prop>";
  for ( var j = 0; j < propertiesToRemove.length; j++) {
    key = propertiesToRemove[j].propName;
    value = propertiesToRemove[j].propValue;
    sb += "<" + key + ">";
    sb += value;
    sb += "</" + key + ">";
  }
  sb += "</D:prop></D:remove></D:propertyupdate>";
  /* var builder = new dcc.http.DcRequestHeaderBuilder();
  builder.contentType("application/xml");
  builder.accept("application/xml");
  builder.token(this.accessor.accessToken);
  builder.defaultHeaders(this.accessor.getDefaultHeaders());*/

  var xhr = this.httpClient;
  //set options.body
  options.body = sb;
  this._request(xhr, "PROPPATCH", requestUrl, options);
  //this.request(xhr, "PROPPATCH", requestUrl, sb, builder, {}, callback);

  if (options.success === undefined &&
      options.error === undefined &&
      options.complete === undefined) {
    //none of the callback is present
    return this.httpClient;
  }
};

///**
//* PROPFINDメソッド.
//* @param requestUrl リクエスト対象URL
//* @param callback (deprecated) for backward compatibility.
//* @return DcHttpClient
//* @throws ClientException DAO例外
//*/
/**
 * PROPFind method.
 * @param {String} requestUrl
 * @param {Object} options optional parameters.
 * @return {dcc.http.DcHttpClient} DcHttpClient
 * @throws {dcc.ClientException} DAO exception
 */
dcc.http.RestAdapter.prototype.propfind = function(requestUrl, options) {
 /* var builder = new dcc.http.DcRequestHeaderBuilder();
  builder.contentType("application/xml");
  builder.accept("application/xml");
  builder.token(this.accessor.accessToken);
  builder.depth("1");
  builder.defaultHeaders(this.accessor.getDefaultHeaders());*/

  if(!options){
      options ={};
  }
  if(!options.headers){
    options.headers = {};
    options.headers.depth="1";
  }
  var xhr = this.httpClient;
  //this.request(xhr, "PROPFIND", requestUrl, "", builder, {}, callback);
  this._request(xhr, "PROPFIND", requestUrl, options);
  if (options.success === undefined && options.error === undefined && options.complete === undefined) {
    return this.httpClient;
  }
};

///**
//* Responseボディを受ける場合のHTTPリクエストを行う.
//* @param xhr
//* @param method Http request method
//* @param requestUrl リクエスト対象URL
//* @param requestBody data request body
//* @param builder DcRequestHeaderBuilder
//* @param headers headers parameters for request
//* @param callback (deprecated) for backward compatibility.
//* @throws ClientException DAO例外
//*/
/**
 * This method is used to make HTTP requests may be subject to Response body.
 * @param {dcc.http.DcHttpClient} xhr
 * @param {String} Http request method
 * @param {String} requestUrl
 * @param {Object} data request body
 * @param {dcc.DcRequestHeadreBuilder} builder DcRequestHeaderBuilder
 * @param {Object} headers parameters for request
 * @param {Object} callback (deprecated) for backward compatibility.
 * @throws {dcc.ClientException} DAO exception
 */
dcc.http.RestAdapter.prototype.request = function(xhr, method, requestUrl, requestBody, builder, headers, callback) {
  var self = this;
  builder.build(xhr, headers);

  // check added for empty callback

  if (callback !== undefined && callback !== "") {
    xhr._execute(method, requestUrl, requestBody, function() {
      self.accessor.setResHeaders(xhr.getAllResponseHeaders());
      callback(self);
    });
  } else {
    xhr._execute(method, requestUrl, requestBody);
    this.accessor.setResHeaders(xhr.getAllResponseHeaders());
    if (xhr.getStatusCode() >= 300 && xhr.getStatusCode() <= 400) {
      var response = JSON.parse(xhr.bodyAsString());
      if(xhr.getStatusCode() === 401){
        //authentication error case,when response does not contain response.message instead contains response.error
        throw new dcc.ClientException(response.error, response.error_description);
      }else{
        throw new dcc.ClientException(response.message.value, response.code);
      }
    }
  }
};

/**
 * This is the new version of internal request method to send HTTP request.
 * @private
 * @param {dcc.http.DcHttpClient} http client.
 * @param {String} HTTP request method.
 * @param {String} HTTP request url.
 * @param {Object} options
 * @param {Object} options.headers Request headers
 * @param {Object} options.body Request body
 * @param {Function} options.success Callback function for successful result.
 * @param {Function} options.error Callback function for error response.
 * @param {Function} options.complete Callback function for any response, either successful or error.
 * @return {dcc.Promise} response or promise
 * @throws {dcc.ClientException} ClientException
 */
dcc.http.RestAdapter.prototype._request = function(client, method, requestUrl, options) {
  var self = this;
  var builder = new dcc.http.DcRequestHeaderBuilder();
  builder.token(this.accessor.accessToken);
  builder.defaultHeaders(this.accessor.getDefaultHeaders());
  var promise = null;
  /** put all req headers to client. */
  builder.build(client, options.headers);
  /** check if valid option is present with any/all callback present. */

  if (this._isAsynchronous(client, options)) {
    //Asynchronous mode of execution, set async to true
    client.setAsync(true);
    promise = client._execute2(method, requestUrl, options, self.accessor);
  } else {
    //synchronous mode of execution, set async to false
    client.setAsync(false);
    promise = client._execute2(method, requestUrl, options, self.accessor);
    if(options === undefined ||
        (options.success === undefined &&
            options.error === undefined &&
            options.complete === undefined) ){
      //start:Exception Handling, if callback are not present then throw the exception
      if(client.getStatusCode() >= 300 && client.getStatusCode() <400){
        //no exception to the thrown
      }
      else if(client.getStatusCode() >= 400){
        var response = JSON.parse(client.bodyAsString());
        //For unauthorized access token.
        if (client.getStatusCode() === 401){
          // throw the exception with exception code
          throw new dcc.ClientException(response.error, response.code);
        }
        // throw the exception with exception code
        throw new dcc.ClientException(response.message.value, response.code);
      }
    }
    //end:Exception Handling
  }
  return promise;
};


///**
//* HTTPステータスコードを返却する.
//* return status code
//*/
/**
 * This method returns HHTP status code.
 * @returns {String} status code
 */
dcc.http.RestAdapter.prototype.getStatusCode = function() {
  return this.httpClient.getStatusCode();
};

///**
//* 指定したレスポンスヘッダの値を返却する.
//* return responseHeader against the key
//*/
/**
 * This method returns response headers.
 * @param {String} key
 * @returns {String} responseHeader against the key
 */
dcc.http.RestAdapter.prototype.getResponseHeader = function(key) {
  return this.httpClient.getResponseHeader(key);
};

///**
//* レスポンスボディを文字列で返却する.
//* @return bodyAsString
//*/
/**
 * This method returns the response body in string format.
 * @return {String} bodyAsString
 */
dcc.http.RestAdapter.prototype.bodyAsString = function() {
  return this.httpClient.bodyAsString();
};

///**
//* レスポンスボディをJSONオブジェクトで返却する.
//* @return bodyAsJson
//*/
/**
 * This method returns the response body in JSON format.
 * @return {Object} bodyAsJson
 */
dcc.http.RestAdapter.prototype.bodyAsJson = function() {
  return this.httpClient.bodyAsJson();
};

///**
//* レスポンスボディをXMLで取得.
//* @return XML DOMオブジェクト
//*/
/**
 * This method returns the response body in XML format.
 * @returns {String} XML response
 */
dcc.http.RestAdapter.prototype.bodyAsXml = function() {
  return this.httpClient.bodyAsXml();
};

/**
 * This method determine whether the requested execution mode is synchronous or asynchronous.
 * Preference to mode specification is evaluated in order of precedence as options, accessor, library default.
 * @param {dcc.http.DcHttpClient} client
 * @param {JSON} options
 * @returns {Boolean} response true if call is asynchronous else false
 */
dcc.http.RestAdapter.prototype._isAsynchronous = function(client, options) {
  //if options.async is present then use async as specified mode
  if(options !== undefined && options !== null && options.async !== undefined){
    //true or false
    return options.async;
  }else if(this.accessor.getContext().getAsync() !== undefined){
    //if no specification is found at option level, use accessor level settings
    return this.accessor.getContext().getAsync();
  }else{
    //if mode is not specified in any of case - options and accessor level, then use library level settings
    return client.defaultAsync;
  }
};


/**
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* RestAdapterを生成するクラス.
//* @class Represents RestAdapterFactory.
//*/
/**
 * It creates a new object dcc.http.RestAdapterFactory.
 * @class This class generates RestAdapter.
 * @constructor
 */
dcc.http.RestAdapterFactory = function() {
};

///**
//* ResrAdapterかBatchAdapterを生成する.
//* @param accessor アクセス主体
//* @return RestAdapter
//*/
/**
 * It generate a BatchAdapter or ResrAdapter.
 * @param {dcc.Accessor} accessor object
 * @return {dcc.http.RestAdapter/dcc.box.odata.BatchAdapter} object
 */
dcc.http.RestAdapterFactory.create = function(accessor) {
  if (accessor.isBatchMode()) {
    return accessor.getBatchAdapter();
  } else {
    return new dcc.http.RestAdapter(accessor);
  }
};


/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

/**
 * It creates a new object dcc.Promise.
 * @class Promise class to implement the concept of Promise for Async requests
 * @constructor
 */
dcc.Promise = function() {
  this.resolvedValue = null;
  this.errorMessage = null;
};

/**
 * Resolve method called when a promise transitions from unfulfilled to fulfilled state.
 * @param {String} value
 * @returns {object} value
 */
dcc.Promise.prototype.resolve = function (value) {
  this.resolvedValue = value;
  return value;// This might not be required when 'then' method will be called
};

/**
 * Reject method called when a promise transitions from unfulfilled to failed state.
 * @param {String} response object
 */
dcc.Promise.prototype.reject = function (response) {
  if(typeof response === "string"){
    this.errorMessage = response;
  }else{
    this.errorMessage = response;
  }
  //  throw new dcc.ClientException("Error occured", this.errorMessage);// This might not be required when 'then' method will be called
};

/**
 * Then method to access its current or eventual value or reason.
 * @param {Function} onResolved callback
 * @param {Function} onRejected callback
 */
dcc.Promise.prototype.then = function (onResolved, onRejected) {
  if(this.resolvedValue){
    onResolved(this.resolvedValue);
  }else if(this.errorMessage){
    onRejected(this.errorMessage);
  }
};

/**
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* ＄Batchアクセスのためのリクエストを作成するクラス..
//* @class Represents BatchAdapter.
//*/
/**
 * It creates a new object dcc.box.odata.BatchAdapter.
 * @class This class is used to create a request for $ Batch access .
 * @constructor
 * @param {dcc.Accessor} Accessor
 */
dcc.box.odata.BatchAdapter = function(as) {
  this.initializeProperties(this, as);
};

///**
//* プロパティを初期化する.
//*/
/**
 * This method initializes the properties of this class.
 * @param {Object} self
 * @param {dcc.Accessor} as Accessor
 */
dcc.box.odata.BatchAdapter.prototype.initializeProperties = function(self, as) {
  this.accessor = as;
  this.batchBoundary = "batch_" + this.getUUID();
  this.changeSet = null;
  this.batch = new dcc.box.odata.Batch(this.batchBoundary);
};

/**
 * This method returns the reference to the accessor.
 * @return {dcc.Accessor} the accessor
 */
dcc.box.odata.BatchAdapter.prototype.getAccessor = function() {
  return this.accessor;
};

/**
 * This method returns the batch boundary.
 * @return {String} the batchBoundary
 */
dcc.box.odata.BatchAdapter.prototype.getBatchBoundary = function() {
  return this.batchBoundary;
};

/**
 * This method appends the value to existing or new ChangeSet.
 * @param {String} value
 * @returns {String} value
 */
dcc.box.odata.BatchAdapter.prototype.appendChangeSet = function(value) {
  if (null === this.changeSet) {
    this.changeSet = new dcc.box.odata.ChangeSet("changeset_" + this.getUUID(), this.batchBoundary);
  }
  this.changeSet.append(value);
};

/**
 * This method appends value of ChangeSet to Batch and overwrites ChangeSet.
 */
dcc.box.odata.BatchAdapter.prototype.writeChangeSet = function() {
  if ( (null !== this.changeSet) && (undefined !== this.changeSet)) {
    this.batch.append(this.changeSet.get());
    this.changeSet = null;
  }
};

///**
//* BatchBoundaryを挿入する.
//* @throws ClientException Dao例外
//*/
/**
 * This method inserts the BatchBoundary.
 * @throws {dcc.ClientException} Dao exception
 */
dcc.box.odata.BatchAdapter.prototype.insertBoundary = function() {
  this.writeChangeSet();
};

/**
 * This method appends the ChangeSet and returns DCBatchResponse.
 * @param {String} url
 * @param {String} accept
 * @param {String} etag
 * @returns {dcc.box.odata.DcBatchResponse} Response
 */
dcc.box.odata.BatchAdapter.prototype.get = function(url, accept, etag) {
  // 溜めたChangeSetを吐き出す
  /** Update ChangeSet. */
  this.writeChangeSet();
  var cmd = new dcc.box.odata.Command(this.batchBoundary);
  cmd.method = "GET";
  cmd.url = url;
//cmd.addHeader("Accept-Encoding", "gzip");
  cmd.addHeader("Accept", accept);
  cmd.etag = etag;
  this.batch.append(cmd.get());
  return new dcc.box.odata.DcBatchResponse();
};

/**
 * This method retrieves the ChangeSet.
 * @param {String} url
 * @returns {dcc.box.odata.DcBatchResponse} Response
 */
dcc.box.odata.BatchAdapter.prototype.head = function(url) {
  // 溜めたChangeSetを吐き出す
  this.writeChangeSet();
  return this.get(url, "application/json", null);
};

/**
 * This method updates the ChangeSet.
 * @param {String} url
 * @param {String} data
 * @param {String} etag
 * @param {String} contentType
 * @param {Array} map
 * @returns {dcc.box.odata.DcBatchResponse} response
 */
dcc.box.odata.BatchAdapter.prototype.put = function(url, data, etag, contentType, map) {
  var cmd = new dcc.box.odata.Command();
  cmd.method = "PUT";
  cmd.url = url;
  cmd.addHeader("Content-Type", contentType);
  cmd.etag = etag;
  cmd.setBody(data);
  if( (map !== undefined) && (map !== null)){
    for (var entry in map) {
      cmd.addHeader(entry, map[entry]);
    }
  }
  this.appendChangeSet(cmd.get());
  return new dcc.box.odata.DcBatchResponse();
};

/**
 * This method creates a ChangeSet.
 * @param {String} url
 * @param {String} data
 * @param {String} contentType
 * @param {Array} map
 * @returns {dcc.box.odata.DcBatchResponse} response
 */
dcc.box.odata.BatchAdapter.prototype.post = function(url, data, contentType, map) {
  var cmd = new dcc.box.odata.Command();
  cmd.method = "POST";
  cmd.url = url;
  cmd.addHeader("Content-Type", contentType);
  cmd.setBody(data);
  if( (map !== undefined) && (map !== null)){
    for (var entry in map) {
      cmd.addHeader(entry, map[entry]);
    }
  }
  this.appendChangeSet(cmd.get());
  return new dcc.box.odata.DcBatchResponse();
};

/**
 * This method deletes the ChangeSet.
 * @param {String} url
 * @param {String} etag
 */
dcc.box.odata.BatchAdapter.prototype.del = function(url, etag) {
  var cmd = new dcc.box.odata.Command();
  cmd.method = "DELETE";
  cmd.url = url;
  cmd.etag = etag;
  this.appendChangeSet(cmd.get());
};

///**
//* $Batchのボディ情報を取得する.
//* @return Batch登録するボディ.
//* @throws ClientException DAO例外
//*/
/**
 * This method gets the body of information $ Batch.
 * @return {dcc.box.odata.DcBatchResponse} Body to Batch registration.
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.odata.BatchAdapter.prototype.getBody = function() {
  // 溜めたChangeSetを吐き出す
  /** Update ChangeSet. */
  this.writeChangeSet();
  return this.batch.get();
};

///**
//* レスポンスボディを受けるMERGEメソッド.
//* @param url リクエスト対象URL
//* @param data 書き込むデータ
//* @param etag ETag
//* @param contentType CONTENT-TYPE値
//* @return DcResponseオブジェクト
//* @throws ClientException DAO例外
//*/
//dcc.box.odata.BatchAdapter.prototype.merge = function(url, data, etag, contentType) {
////TODO バッチ経由のMERGEメソッドの処理を実装する
//var res = null;
//return res;
//};

///**
//* UUIDを返却する
//* @returns {String}
//*/
/**
 * This method returns the UUID.
 * @returns {String} UUID
 */
dcc.box.odata.BatchAdapter.prototype.getUUID = function() {
  var S4 = function() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4() +S4());
};

///**
//* レスポンスボディをJSONで取得.
//* @return JSONオブジェクト
//* @throws ClientException DAO例外
//*/
/**
 * This method returns response body in JSON format.
 * @return {Object} JSON object
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.odata.BatchAdapter.prototype.bodyAsJson = function() {
  return {"d":{"results":[]}};
};
/**
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false
 */

///**
//* コマンドを$Batchフォーマットに生成する.
//*/
/**
 * It creates a new object dcc.box.odata.Batch.
 * @class This class generates the $ Batch format command.
 * @constructor
 * @param {String} batchBoundary
 */
dcc.box.odata.Batch = function(batchBoundary) {
  this.initializeProperties(this, batchBoundary);
};

///**
//* オブジェクトを初期化.
//* @param {dcc.box.odata.schema.EntityType} self
//* @param {dcc.Accessor} as アクセス主体
//* @param {Object} json サーバーから返却されたJSONオブジェクト
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.box.odata.schema.EntityType} self
 * @param {String} as BatchBoundary
 */
dcc.box.odata.Batch.prototype.initializeProperties = function(self, batchBoundary) {
  self.batch = "";
  self.batchBoundary = batchBoundary;
};

/**
 * This method appends the value to the Batch body.
 * @param {String} body to set.
 */
dcc.box.odata.Batch.prototype.append = function(value) {
  if (this.batch.length > 0) {
    this.batch += "\r\n";
  }
  this.batch += value;
};

/**
 * This method gets the Batch in specified format.
 * @returns {String} Batch
 */
dcc.box.odata.Batch.prototype.get = function() {
  this.batch += "\r\n";
  this.batch += ("--" + this.batchBoundary + "--");
  return this.batch;
};

/**
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* $Batchの複数ChangeSetをまとめる.
//* @class Represents ChangeSet.
//*/
/**
 * It creates a new object dcc.box.odata.ChangeSet.
 * @class This class puts together a multiple ChangeSet of $ Batch.
 * @constructor
 * @param {String} value
 * @param {String} batchBoundary
 */
dcc.box.odata.ChangeSet = function(value, batchBoundary) {
  this.initializeProperties(this, value, batchBoundary);
};

///**
//* オブジェクトを初期化.
//* @param {dcc.box.odata.schema.EntityType} self
//* @param {dcc.Accessor} as アクセス主体
//* @param {Object} json サーバーから返却されたJSONオブジェクト
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.box.odata.schema.EntityType} self
 * @param {String} as ChangeSetBoundary
 * @param {String} BatchBoundary
 */
dcc.box.odata.ChangeSet.prototype.initializeProperties = function(self, value, batchBoundary) {
  self.changesetBoundary = value;
  self.body = null;
  self.batchBoundary = batchBoundary;
};

/**
 * This method appends the value to ChangeSetBoundary.
 * @param {String} value
 */
dcc.box.odata.ChangeSet.prototype.append = function(value) {
  if (this.body === null) {
    this.body = "";
  } else {
    this.body += "\r\n";
  }
  /** ChangeSetHeader. */
  this.body += ("--" + this.changesetBoundary + "\r\n");
  this.body += ("Content-Type: application/http" + "\r\n");
  this.body += ("Content-Transfer-Encoding: binary" + "\r\n");
  this.body += "\r\n";

  this.body += value;
};

/**
 * This method retuns the ChangeSet data.
 * @returns {String} sb.
 */
dcc.box.odata.ChangeSet.prototype.get = function(){
  this.body += "\r\n";
  var sb = "";
  var changeSetFooter = "--" + this.changesetBoundary + "--";
  sb += ("--" + this.batchBoundary + "\r\n");
  sb += ("Content-Type: multipart/mixed; boundary=" + this.changesetBoundary + "\r\n");
  // Content-Length
  try {
    sb += ("Content-Length: " + this.body.length + changeSetFooter.length + "\r\n");
  } catch (e) {
    throw dcc.ClientException(e.getMessage());
  }
  sb += "\r\n";
  // ChangeSetBody
  sb += this.body;
  sb += (changeSetFooter + "\r\n");
  return sb;
};

/**
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* ＄Batchアクセスのためのリクエストを作成するクラス..
//* @class Represents a command.
//*/
/**
 * It creates a new object dcc.box.odata.Command.
 * @class This class is used to create a request for $ Batch access.
 * @constructor
 * @param {String} batchBoundary
 */
dcc.box.odata.Command = function(batchBoundary) {
  this.initializeProperties(this, batchBoundary);
};

///**
//* オブジェクトを初期化.
//* @param {dcc.box.odata.schema.EntityType} self
//* @param {dcc.Accessor} as アクセス主体
//* @param {Object} json サーバーから返却されたJSONオブジェクト
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.box.odata.schema.EntityType} self
 * @param {String} as BatchBoundary
 */
dcc.box.odata.Command.prototype.initializeProperties = function(self, batchBoundary) {
  self.url = null;
  self.method = null;
  self.etag = null;
  self.body = null;
  self.contentLength = 0;
  self.headers = [];
  self.batchBoundary = batchBoundary;
};

/**
 * This method sets the Body.
 * @param {String} body to set.
 */
dcc.box.odata.Command.prototype.setBody = function(value) {
  this.body = value;
//this.body = value.replace(/\"/g,"\\\"");
  try {
    this.contentLength = this.body  .length;
  } catch (e) {
    throw e;
  }
};

/**
 * This method adds key value pair in array to create headers.
 * @param {String} key
 * @param {String} value
 */
dcc.box.odata.Command.prototype.addHeader = function(key, value) {
  this.headers[key] = value;
};

/**
 * This method gets the Batch string data.
 * @returns {String} sb
 */
dcc.box.odata.Command.prototype.get = function() {
  var sb = "";
  // GET
  if (this.method === "GET") {
    sb += ("--" + this.batchBoundary + "\r\n");
    sb += ("Content-Type: application/http" + "\r\n");
    sb += ("Content-Transfer-Encoding:binary" + "\r\n");
    sb += "\r\n";
  }

  // method url http-ver
  sb += (this.method + " " + this.url + " HTTP/1.1" + "\r\n");
  // host
  sb += ("Host: " + "\r\n");
  // header
  for (var header in this.headers) {
    sb += header + ":" + (this.headers[header] + "\r\n");
  }
  // Content-Length
  sb += ("Content-Length: " + this.contentLength + "\r\n");
  // If-Match
  if (null !== this.etag) {
    sb += ("If-Match: " + this.etag + "\r\n");
  }
  if (("POST" === this.method) || ("PUT" === this.method)) {
    sb += ("\r\n");
    sb += (this.body + "\r\n");
  }
  return sb;
};

/**
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* Batchのレスポンス型.
//* @class Represents BatchResponse.
//*/
/**
 * It creates a new object dcc.box.odata.DcBatchResponse.
 * @class This class represents the response class for Batch.
 * @constructor
 */
dcc.box.odata.DcBatchResponse = function() {
};

///**
//* レスポンスボディをJSONで取得.
//* @return JSONオブジェクト
//* @throws ClientException DAO例外
//*/
/**
 * This method returns the response body in JSON format.
 * @return {Object} JSON object
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.odata.DcBatchResponse.prototype.bodyAsJson = function() {
  return {"d":{"results":[]}};
};

/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class DAOで発生するException.
//* @constructor
//*/
/**
 * It creates a new object dcc.ClientException.
 * @class This class represents the exceptions that occur in DAO.
 * @constructor
 * @param {String} msg
 * @param {String} code
 */
dcc.ClientException = function(msg, code) {
  this.uber = Error.prototype;
  this.initializeProperties(this, msg, code);
};
dcc.DcClass.extend(dcc.ClientException, Error);

if (typeof exports === "undefined") {
  exports = {};
}
exports.ClientException = dcc.ClientException;

///**
//* プロパティを初期化する.
//* @param {dcc.ClientException} self
//* @param {String} msg エラーメッセージ
//* @param {String} code エラーコード
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.ClientException} self
 * @param {String} msg Error message
 * @param {String} code Status code
 */
dcc.ClientException.prototype.initializeProperties = function(self, msg, code) {
  self.name = "DcClientException";
  self.message = msg;
  /** Status Code. */
  self.code = code;
};

///**
//* 例外発生時のステータスコードを取得.
//* @return {String} ステータスコード
//*/
/**
 * This method is used to get the status code at the time of the exception.
 * @return {String} Status code
 */
dcc.ClientException.prototype.getCode = function() {
  return this.code;
};


/**
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class ODataの検索条件を指定し、検索を実行するクラス.
//* @constructor
//*/
/**
 * It creates a new object dcc.box.odata.DcQuery.
 * @class This class specifies the search criteria for OData, to perform the search.
 * @constructor
 * @param {Object} obj
 */
dcc.box.odata.DcQuery = function(obj) {
  this.initializeProperties(obj);
};

///**
//* プロパティを初期化する.
//* @param {dcc.box.odata.DcQuery} obj
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.box.odata.DcQuery} obj
 */
dcc.box.odata.DcQuery.prototype.initializeProperties = function(obj) {
  this.target = obj;
};

///**
//* 検索を実行します.
//* @return {Object} 検索結果のJSONオブジェクト
//* @throws {ClientException} DAO例外
//*/
/**
 * This method is used to execute the search.
 * @return {Object} JSON object of the search results
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.odata.DcQuery.prototype.run = function(options) {
  if (options !== undefined) {
  //  this.target.doSearch(this, options);
    this.target.doSearch(this, {
        success: function(resp){
            if (options.success !== undefined) {
                var responseBody = resp.bodyAsJson();
                var json = responseBody.d.results;
                options.success(json);
            }
        },
        error: function(resp){
            if (options.error !== undefined) {
                options.error(resp);
            }
        },
        complete: function(resp) {
            if (options.complete !== undefined) {
                options.complete(resp);
            }
        }
    });
  } else {
    return this.target.doSearch(this);
  }
};


///**
//* 検索を実行します.
//* @return {dcc.box.odata.ODataResponse} 検索結果のJSONオブジェクト
//* @throws {ClientException} DAO例外
//*/
/**
 * This method executes the search and returns result as response.
 * @return {dcc.box.odata.ODataResponse} JSON object of the search results
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.odata.DcQuery.prototype.runAsResponse = function(callback) {
  if (callback !== undefined) {
    this.target.doSearchAsResponse(this, function(resp) {
      if (resp.getStatusCode() >= 300) {
        if (callback.error !== undefined) {
          callback.error(resp);
        }
      } else {
        if (callback.success !== undefined) {
          var responseBody = resp.bodyAsJson();
          var json = responseBody;
          callback.success(new dcc.box.odata.ODataResponse(this.accessor, "", json));
        }
      }
      if (callback.complete !== undefined) {
        callback.complete(resp);
      }
    });
  } else {
    return this.target.doSearchAsResponse(this);
  }
};

///**
//* 各クエリを連携し、クエリ文字列を生成します.
//* @return {String} 生成したクエリ文字列
//*/
/**
 * This method generates the query string for query execution.
 * @return {String} Query string that is generated
 */
dcc.box.odata.DcQuery.prototype.makeQueryString = function() {
  var al = this.makeQueryList();

  if (al.length === 0) {
    return "";
  } else {
    return al.join("&");
  }
};

///**
//* 各クエリ値を一旦配列に格納します.
//* @return {?} 各クエリ値を格納した配列
//*/
/**
 * This method is used to create an array for making a query for each value.
 * @return {String[]} An array that contains the value of each query
 */
dcc.box.odata.DcQuery.prototype.makeQueryList = function() {
  var al = [];
  if (this.topVal > 0)  {
    al.push("$top=" + this.topVal);
  }
  if (this.skipVal > 0) {
    al.push("$skip=" + this.skipVal);
  }
  if ((this.filterVal !== null) && (this.filterVal !== undefined)){
    // escape()でシングルクォートをエスケープする
    var filterEnc = encodeURI(this.filterVal);
    al.push("$filter=" + filterEnc.replace(/'/g, "%27"));
  }
  if ((this.selectVal !== null) && (this.selectVal !== undefined)) {
    al.push("$select=" + this.selectVal);
  }
  if ((this.expandVal !== null) && (this.expandVal !== undefined)) {
    al.push("$expand=" + encodeURI(this.expandVal));
  }
  if ((this.inlinecountVal !== null) && (this.inlinecountVal !== undefined)) {
    al.push("$inlinecount=" + encodeURI(this.inlinecountVal));
  }
  if ((this.orderbyVal !== null) && (this.orderbyVal !== undefined)) {
    al.push("$orderby=" + encodeURI(this.orderbyVal));
  }
  if ((this.qVal !== null) && (this.qVal !== undefined)) {
    al.push("q=" + encodeURI(this.qVal));
  }
  return al;
};


///**
//* $filterをセット.
//* @param {String} value $filter値
//* @return {dcc.box.odata.DcQuery} Queryオブジェクト自身
//*/
/**
 * This method is used to set the $ filter.
 * @param {String} value $filter value
 * @return {dcc.box.odata.DcQuery} Query object
 */
dcc.box.odata.DcQuery.prototype.filter = function(value) {
  this.filterVal = value;
  return this;
};

///**
//* $topをセット.
//* @param {Number} value $top値
//* @return {dcc.box.odata.DcQuery} Queryオブジェクト自身
//*/
/**
 * This method is used to set the $ top.
 * @param {Number} value $top value
 * @return {dcc.box.odata.DcQuery} Query object
 */
dcc.box.odata.DcQuery.prototype.top = function(value) {
  this.topVal = value;
  return this;
};

///**
//* $skipをセット.
//* @param {Number} value $skip値
//* @return {dcc.box.odata.DcQuery} Queryオブジェクト自身
//*/
/**
 * This method is used to set the $ skip.
 * @param {Number} value $skip value
 * @return {dcc.box.odata.DcQuery} Query object
 */
dcc.box.odata.DcQuery.prototype.skip = function(value) {
  this.skipVal = value;
  return this;
};

///**
//* $selectをセット.
//* @param {String} value $select値
//* @return {dcc.box.odata.DcQuery} Queryオブジェクト自身
//*/
/**
 * This method is used to set the $ select.
 * @param {String} value $select value
 * @return {dcc.box.odata.DcQuery} Query object
 */
dcc.box.odata.DcQuery.prototype.select = function(value) {
  var values = value.split(",");
  var ar = [];
  for (var i = 0;i < values.length; i++) {
    ar[i] = encodeURI(values[i]);
  }
  this.selectVal = ar.join(",");
  return this;
};

///**
//* $expandをセット.
//* @param {String} value $expand値
//* @return {dcc.box.odata.DcQuery} Queryオブジェクト自身
//*/
/**
 * This method is used to set the $ expand.
 * @param {String} value $expand value
 * @return {dcc.box.odata.DcQuery} Query object
 */
dcc.box.odata.DcQuery.prototype.expand = function(value) {
  this.expandVal = value;
  return this;
};

///**
//* $oderbyをセット.
//* @param {String} value $orderby値
//* @return {dcc.box.odata.DcQuery} Queryオブジェクト自身
//*/
/**
 * This method is used to set the $ orderby.
 * @param {String} value $orderby value
 * @return {dcc.box.odata.DcQuery} Query object
 */
dcc.box.odata.DcQuery.prototype.orderby = function(value) {
  this.orderbyVal = value;
  return this;
};

///**
//* $inlinecountをセット.
//* @param {String} value $inlinecount値
//* @return {dcc.box.odata.DcQuery} Queryオブジェクト自身
//*/
/**
 * This method is used to set the $ inlinecount.
 * @param {String} value $inlinecount value
 * @return {dcc.box.odata.DcQuery} Query object
 */
dcc.box.odata.DcQuery.prototype.inlinecount = function(value) {
  this.inlinecountVal = value;
  return this;
};

///**
//* 検索キーワードをセット.
//* @param {String} value 検索キーワード
//* @return {dcc.box.odata.DcQuery} Queryオブジェクト自身
//*/
/**
 * This method sets the search keyword.
 * @param {String} value Search keyword
 * @return {dcc.box.odata.DcQuery} Query object
 */
dcc.box.odata.DcQuery.prototype.q = function(value) {
  this.qVal = value;
  return this;
};

///**
//* 親EntitySetをセット.
//* @param {String} value 親EntitySet名
//* @return {dcc.box.odata.DcQuery} Queryオブジェクト自身
//*/
/**
 * This method sets the parent EntitySet.
 * @param {String} value EntitySet value
 * @return {dcc.box.odata.DcQuery} Query object
 */
dcc.box.odata.DcQuery.prototype.parentType = function(value) {
  this.parentTypeVal = value;
  return this;
};

///**
//* 親EntitySetのID値をセット.
//* @param {String} value 親EntitySetのID値
//* @return {dcc.box.odata.DcQuery} Queryオブジェクト自身
//*/
/**
 * This method sets the ID value of the parent EntitySet.
 * @param {String} value EntitySet ID value
 * @return {dcc.box.odata.DcQuery} Query object
 */
dcc.box.odata.DcQuery.prototype.parentId = function(value) {
  this.parentIdVal = value;
  return this;
};

/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class デタクラの各機能を現したクラスの抽象クラス.
//* @constructor
//* @param as アクセス主体
//*/
/**
 * It creates a new object dcc.AbstractODataContext.
 * @class This is the super class inherited by other cell control classes
 * showing function of each entity.
 * @constructor
 * @param {dcc.Accessor} as Accessor
 */
dcc.AbstractODataContext = function(as) {
  this.initializeProperties(this, as);
};

///**
//* プロパティを初期化する.
//* @param {dcc.AbstractODataContext} self
//* @param {dcc.Accessor} as アクセス主体
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.AbstractODataContext} self
 * @param {dcc.Accessor} as Accessor
 */
dcc.AbstractODataContext.prototype.initializeProperties = function(self, as) {
///** アクセス主体. */
  /** {dcc.Accessor} Accessor */
  if (as !== undefined) {
    self.accessor = as.clone();
  }

///** 登録した時のJSONデータ . */
  /** {Object} JSON data at the time of the registration */
  self.rawData = null;
};

///**
//* アクセス主体を設定する.
//* @param {dcc.Accessor}　as アクセス主体
//*/
/**
 * THis method sets the Accessor object.
 * @param {dcc.Accessor}　as Accessor
 */
dcc.AbstractODataContext.prototype.setAccessor = function(as) {
  this.accessor = as;
};

///**
//* アクセス主体を取得する.
//* @return {dcc.Accessor} アクセス主体
//*/
/**
 * This method fetches the Accessor object.
 * @return {dcc.Accessor} Accessor
 */
dcc.AbstractODataContext.prototype.getAccessor = function() {
  return this.accessor;
};

///**
//* 登録した時のJSONデータ を取得する.
//* @return {Object} 登録した時のJSONデータ
//*/
/**
 * This method gets the JSON data while registration.
 * @return {Object} JSON data at the time of the registration
 */
dcc.AbstractODataContext.prototype.getRawData = function() {
  return this.rawData;
};

///**
//* 登録した時のJSONデータを設定する.
//* @param {Object} json 登録した時のJSONデータ
//*/
/**
 * This method sets the JSON data while registration.
 * @param {Object} JSON data at the time of the registration
 */
dcc.AbstractODataContext.prototype.setRawData = function(json) {
  this.rawData = json;
};

///**
//* JSON文字列を返却.
//* @return {String} JSON文字列
//*/
/**
 * This method converts JSON to string.
 * @return {String} JSON String
 */
dcc.AbstractODataContext.prototype.toJSONString = function() {
  return this.rawData.toJSONString();
};

///**
//* ODataへのリンクを取得する.
//* @return {String} ODataへのリンク
//*/
/**
 * This method returns the Odata link URI.
 * @return {String} OData Link URI
 */
dcc.AbstractODataContext.prototype.getODataLink = function() {
  return this.rawData.__metadata.uri;
};

///**
//* ODataのキーを取得する.
//* @return ODataのキー情報
//*/
//public abstract String getKey();

///**
//* クラス名をキャメル型で取得する.
//* @return ODataのキー情報
//*/
//public abstract String getClassName();

///**
//* 引数で指定されたヘッダの値を取得.
//* @param headerKey 取得するヘッダのキー
//* @return ヘッダの値
//*/
/**
 * This method gets the value of the header which is specified in the argument.
 * @param {String} headerKey HeaderKey
 * @return {String} headerValue
 */
dcc.AbstractODataContext.prototype.getHeaderValue = function(headerKey) {
  var headerValue = this.accessor.getResHeaders()[headerKey];
  if (headerKey === "ETag" && this.body !== null && this.body !== "") {
    headerValue = this.body.__metadata.etag;
  }
  return headerValue;
};

/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class コレクションの抽象クラス.
//* @constructor
//* @augments dcc.AbstractODataContext
//*/
/**
 * It creates a new object dcc.DcCollection.
 * @class This is an abstract class for a collection.
 * @constructor
 * @augments dcc.AbstractODataContext
 * @param {dcc.Accessor} Accessor
 * @param {String} path
 */
dcc.DcCollection = function(as, path) {
  this.initializeProperties(this, as, path);
};
dcc.DcClass.extend(dcc.DcCollection, dcc.AbstractODataContext);

///**
//* プロパティを初期化する.
//* @param {dcc.DcCollection} self
//* @param {dcc.Accessor} as アクセス主体
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.DcCollection} self
 * @param {dcc.Accessor} as Accessor
 */
dcc.DcCollection.prototype.initializeProperties = function(self, as, path) {
  this.uber = dcc.AbstractODataContext.prototype;
  this.uber.initializeProperties(self, as);

  if (as !== undefined) {
    self.accessor = as.clone();
  }

///** キャメル方で表現したクラス名. */
  /** Class name in camel case. */
  self.CLASSNAME = "";
///** コレクションのパス. */
  /**  path of the collection. */
  self.url = path;

};

///**
//* URLを取得.
//* @return {String} URL文字列
//*/
/**
 * This method returns the URL.
 * @return {String} URL Stirng
 */
dcc.DcCollection.prototype.getPath = function() {
  return this.url;
};

///**
//* ODataのキーを取得する.
//* @return {String} ODataのキー情報
//*/
/**
 * This method gets the key for Odata.
 * @return {String} OData Key information
 */
dcc.DcCollection.prototype.getKey = function() {
  return "";
};

///**
//* クラス名をキャメル型で取得する.
//* @return {?} ODataのキー情報
//*/
/**
 * This method returns the class name.
 * @return {String} OData class name
 */
dcc.DcCollection.prototype.getClassName = function() {
  return this.CLASSNAME;
};

/**
 * The purpose of this method is to perform service configure operation for both single or multiple service
 * in one API call.
 * @param {array} arrServiceNameAndSrcFile service list in combination of service name and source file
 * example {"serviceName":"name","sourceFileName" : "filename.js"}.
 * @param {String} subject Service
 * @param {Object} options refers to optional parameters - callback, headers.
 * @return {dcc.http.DcHttpClient} response
 * @throws {dcc.ClientException} Exception
 */
dcc.DcCollection.prototype.proppatch = function(arrServiceNameAndSrcFile, subject, options) {
  var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
  var response = restAdapter.setService(this.getPath(), arrServiceNameAndSrcFile, subject, options);
  return response;
};

/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class DAVコレクションへアクセスするクラス.
//* @constructor
//* @augments dcc.DcCollection
//*/
/**
 * It creates a new object dcc.box.DavCollection.
 * @class This class is used to access the DAV collection for Odata operations.
 * @constructor
 * @augments dcc.DcCollection
 * @param {dcc.Accessor} Accessor
 * @param {String} path
 */
dcc.box.DavCollection = function(as, path) {
  this.initializeProperties(this, as, path);
};
dcc.DcClass.extend(dcc.box.DavCollection, dcc.DcCollection);

///**
//* プロパティを初期化する.
//* @param {dcc.box.DavCollection} self
//* @param {dcc.Accessor} as アクセス主体
//* @param {?} pathValue
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.box.DavCollection} self
 * @param {dcc.Accessor} as Accessor
 * @param {String} pathValue
 */
dcc.box.DavCollection.prototype.initializeProperties = function(self, as, pathValue) {
  this.uber = dcc.DcCollection.prototype;
  this.uber.initializeProperties(self, as, pathValue);

  if (as !== undefined) {
//  /** boxレベルACLへアクセスするためのクラス. */
    /** class to access the box level ACL. */
    self.acl = new dcc.cellctl.AclManager(as, this);
  }
};

///**
//* コレクションの生成.
//* @param {?} name 生成するCollection名
//* @throws {ClientException} DAO例外
//*/
/**
 * This method is used to create a collection.
 * @param {String} name Collection name
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.DavCollection.prototype.mkCol = function(name) {
  var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
  var response = restAdapter.mkcol(dcc.UrlUtils.append(this.getPath(), name));
  if (response.getStatusCode() >= 400) {
    var responseJSON = response.bodyAsJson();
    throw new dcc.ClientException(responseJSON.message.value,
        responseJSON.code);
  }
  return response;
};

///**
//* ODataコレクションの生成.
//* @param name 生成するODataCollection名
//* @throws ClientException DAO例外
//*/
/**
 * This method is used to create a odata collection.
 * @param {String} name ODataCollection name
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.DavCollection.prototype.mkOData = function(name) {
  var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
  var response = restAdapter.mkOData(dcc.UrlUtils
      .append(this.getPath(), name));
  if (response.getStatusCode() >= 400) {
    var responseJSON = response.bodyAsJson();
    throw new dcc.ClientException(responseJSON.message.value,
        responseJSON.code);
  }
  return response;
};

///**
//* Serviceコレクションの生成.
//* @param name 生成するServiceCollection名
//* @throws ClientException DAO例外
//*/
/**
 * This method is used to create a service collection.
 * @param {String} name ServiceCollection name
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.DavCollection.prototype.mkService = function(name) {
  var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
  var response = restAdapter.mkService(dcc.UrlUtils.append(this.getPath(), name));
  if (response.getStatusCode() >= 400) {
    var responseJSON = response.bodyAsJson();
    throw new dcc.ClientException(responseJSON.message.value,
        responseJSON.code);
  }
  return response;
};

///**
//* Calendarコレクションの生成.
//* @param name 生成するCalendarCollectoin名
//* @throws ClientException DAO例外
//*/
/**
 * This method is used to create a Calendar.
 * @param {String[]} name CalendarCollection name
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.DavCollection.prototype.mkCalendar = function(name) {
  var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
  restAdapter.mkCalendar(dcc.UrlUtils.append(this.getPath(), name), "");
};

///**
//* コレクション内のリソースの一覧を取得する.
//* @return リソースの一覧
//* @throws ClientException DAO例外
//*/
/**
 * This method gets the list of resources in the collection.
 * @return {String[]} List of resources
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.DavCollection.prototype.getFileList = function() {
  return this.getResourceList();
};

///**
//* コレクション内のサブコレクションの一覧を取得する.
//* @return サブコレクションの一覧
//* @throws ClientException DAO例外
//*/
/**
 * This method gets a list of sub-collection in the collection.
 * @return {String} List of resources
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.DavCollection.prototype.getColList = function() {
  return this.getResourceList();
};

///**
//* コレクション内のリソースまたはサブコレクションの一覧を取得する.
//* @return {?} リソースまたはサブコレクションの一覧
//* @throws {ClientException} DAO例外
//*/
/**
 * This method calls propfind API to fetch the list of resources.
 * @return {String[]} List of sub-collection or resource
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.DavCollection.prototype.getResourceList = function() {
  var folderList = [];
  var type = "";
  var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
  var response = restAdapter.propfind(this.url);
  var doc = response.bodyAsXml();
  var nl = doc.getElementsByTagName("response");
  var name = "";
  for ( var i = 1; i < nl.length; i++) {
    var elm = nl[i];
    var href = elm.getElementsByTagName("href")[0];
    var lastModifiedDate = elm.getElementsByTagName("getlastmodified")[0].textContent;
    var resourceType = elm.getElementsByTagName("resourcetype")[0];
    if (resourceType.textContent !== "") {
      var collectionType = elm.getElementsByTagName("resourcetype")[0].firstElementChild.tagName;
      var temp = elm.getElementsByTagName("resourcetype")[0].firstElementChild;
      if (collectionType === "collection") {
        if (elm.getElementsByTagName("resourcetype")[0].firstElementChild.nextElementSibling !== null) {
          type = temp.nextElementSibling.nodeName;
        } else {
          type = "folder";
        }
      }
    } else {
      type = "file";
    }
    var epochDateTime = new Date(lastModifiedDate).getTime();
    epochDateTime = "/Date(" + epochDateTime + ")/";
    name = {
        "Name" : href.firstChild.nodeValue,
        "Date" : epochDateTime,
        "Type" : type
    };
    if (name === this.url) {
      continue;
    }
    var col = elm.getElementsByTagName("collection");
    if (col.length > 0 || type === "file") {
      folderList.push(name);
    }
  }
  return folderList;
};

///**
//* コレクションにプロパティをセットする.
//* @param key プロパティ名
//* @param value プロパティの値
//*/
//dcc.box.DavCollection.prototype.setProp = function(key, value) {
//};
///**
//* コレクションからプロパティを取得する.
//* @param key プロパティ名
//* @return 取得したプロパティ値
//*/
//dcc.box.DavCollection.prototype.getProp = function(key) {
//return "";
//};
///**
//* サブコレクションを指定.
//* @param name コレクション名
//* @return {dcc.box.DavCollection} 指定したコレクション名のDavCollectionオブジェクト
//*/
/**
 * This method specifies and retrieves the collection.
 * @param {String} name Collection name
 * @return {dcc.box.DavCollection} DavCollection object
 */
dcc.box.DavCollection.prototype.col = function(name) {
  return new dcc.box.DavCollection(this.accessor, dcc.UrlUtils.append(this
      .getPath(), name));
};

///**
//* ODataコレクションを指定.
//* @param name ODataコレクション名
//* @return {dcc.box.ODataCollection} 取得したODataCollectionオブジェクト
//*/
/**
 * This method specifies and retrieves the odata collection.
 * @param {String} name Odata Collection name
 * @return {dcc.box.ODataCollection} ODataCollection object
 */
dcc.box.DavCollection.prototype.odata = function(name) {
  return new dcc.box.ODataCollection(this.accessor, dcc.UrlUtils.append(this
      .getPath(), name));
};

///**
//* Serviceコレクションを指定.
//* @param name Serviceコレクション名
//* @return {dcc.box.ServiceCollection} 取得したSerivceコレクションオブジェクト
//*/
/**
 * This method specifies and retrieves the service collection.
 * @param {String} name Service Collection name
 * @return {dcc.box.ServiceCollection} SerivceCollection object
 */
dcc.box.DavCollection.prototype.service = function(name) {
  return new dcc.box.ServiceCollection(this.accessor, dcc.UrlUtils.append(this
      .getPath(), name));
};

///**
//* DAVに対するGETメソッドをリクエストする.
//* @param {String} pathValue 取得するパス
//* @param {String} charset 文字コード
//* @param {string} etag Used for if-none-match condition
//* @return {String} GETした文字列
//* @throws {ClientException} DAO例外
//*/
/**
 * This method returns the DAV collection details in string format.
 * @param {String} pathValue Path
 * @param {String} charset Character code
 * @param {String} etag Used for if-none-match condition
 * @return {String} GET String
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.DavCollection.prototype.getString = function(pathValue, charset, callback,
    etag) {
  if (charset === undefined) {
    charset = "utf-8";
  }
  var url = dcc.UrlUtils.append(this.getPath(), pathValue);
  var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
  if (callback !== undefined) {
    /* restAdapter.get(url, "text/plain", etag, function(resp) {
      if (resp.getStatusCode() >= 300) {
        if (callback.error !== undefined) {
          callback.error(resp);
        }
      } else {
        if (callback.success !== undefined) {
          var body = resp.bodyAsString(charset);
          callback.success(body);
        }
      }
      if (callback.complete !== undefined) {
        callback.complete(resp);
      }
    });*/
    restAdapter.get(url, "text/plain", etag,callback);
  } else {
    restAdapter.get(url, "text/plain", etag);
    var body = restAdapter.bodyAsString(charset);
    return body;
  }
};

///**
//* バイナリデータのGETメソッドをリクエストする.
//* @param {String} pathValue 取得するパス
//* @param {String} callback コールバックメソッド
//* @param {string} etag Used for if-none-match condition
//* @return {String} GETしたバイナリデータ
//* @throws {ClientException} DAO例外
//*/
/**
 * This method returns the DAV collection details in binary format.
 * @param {String} pathValue Path
 * @param {String} callback Character code
 * @param {String} etag Used for if-none-match condition
 * @return {String} GET Binary data
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.DavCollection.prototype.getBinary = function(pathValue, callback, etag) {
  var url = dcc.UrlUtils.append(this.getPath(), pathValue);
  var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
  if (callback !== undefined) {
    restAdapter.getBinary(url, etag, function(resp) {
      if (resp.getStatusCode() >= 300) {
        if (callback.error !== undefined) {
          callback.error(resp);
        }
      } else {
        if (callback.success !== undefined) {
            // FSTが修正
          var body = resp.httpClient.bodyAsBinary();
          callback.success(body);
        }
      }
      if (callback.complete !== undefined) {
        callback.complete(resp);
      }
    });
  } else {
    var httpclient = restAdapter.getBinary(url, etag);
    return httpclient.bodyAsBinary();
  }
};

///**
//* バイナリデータのGETメソッドを実行しレスポンスボディをBase64エンコードして返却する.
//* @param {String} pathValue 取得するパス
//* @param {String} contentType 取得するバイナリデータのContent-Type
//* @param {String} callback コールバックメソッド
//* @param {string} etag Used for if-none-match condition
//* @return {String} GETしたバイナリデータ
//* @throws {ClientException} DAO例外
//*/
/**
 * This method return the DAV collection details in binary format encoded with Base64.
 * @param {String} pathValue Path
 * @param {String} contentType Content-Type value
 * @param {String} callback Callback method
 * @param {String} etag Used for if-none-match condition
 * @return {String} GET Binary data
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.DavCollection.prototype.getBinaryAsBase64 = function(pathValue,
    contentType, callback, etag) {
  var body = this.getBinary(pathValue, callback, etag);
  return "data:" + contentType + ";base64," + this.base64encoder(body);
};

dcc.box.DavCollection.prototype.base64encoder = function(s) {
  var base64list = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var t = "", p = -6, a = 0, i = 0, v = 0, c;

  while ((i < s.length) || (p > -6)) {
    if (p < 0) {
      if (i < s.length) {
        c = s.charCodeAt(i++);
        v += 8;
      } else {
        c = 0;
      }
      a = ((a & 255) << 8) | (c & 255);
      p += 8;
    }
    t += base64list.charAt((v > 0) ? (a >> p) & 63 : 64);
    p -= 6;
    v -= 6;
  }
  return t;
};

///**
//* DAVに対するGETメソッドをリクエストする.
//* @param {String} pathValue 取得するパス
//* @param {String} charset 文字コード
//* @param {string} etag Used for if-none-match condition
//* @return {dcc.box.DavResponse} GETした文字列を保持するレスポンス
//* @throws {ClientException} DAO例外
//*/
/**
 * This method returns the DAV collection data in response format.
 * @param {String} pathValue Path
 * @param {String} charset Character code
 * @param {String} etag Used for if-none-match condition
 * @return {dcc.box.DavResponse} GET Response holding string
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.DavCollection.prototype.getAsResponse = function(pathValue, charset,
    callback, etag) {
  if (charset === undefined) {
    charset = "utf-8";
  }
  var url = dcc.UrlUtils.append(this.getPath(), pathValue);
  var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
  if (callback !== undefined) {
    /*    restAdapter.get(url, "text/plain", etag, function(resp) {
      if (resp.getStatusCode() >= 300) {
        if (callback.error !== undefined) {
          callback.error(resp);
        }
      } else {
        if (callback.success !== undefined) {
          var body = resp.bodyAsString(charset);
          callback.success(new dcc.box.DavResponse(resp.accessor, body));
        }
      }
      if (callback.complete !== undefined) {
        callback.complete(resp);
      }
    });*/
    restAdapter.get(url, "text/plain", etag,callback);
  } else {
    restAdapter.get(url, "text/plain", etag);
    var body = restAdapter.bodyAsString(charset);
    return new dcc.box.DavResponse(this.accessor, body);
  }
};

///**
//* DAVに対するGETメソッドをリクエストする.
//* @param pathValue 取得するパス
//* @return GETしたストリーム
//* @throws ClientException DAO例外
//*/
//dcc.box.DavCollection.prototype.getStream = function(pathValue) {
//String url = dcc.UrlUtils.append(this.getPath(), pathValue);
////リクエスト
//DcResponse res = RestAdapterFactory.create(this.accessor).get(url,
//"application/octet-stream");
////レスポンスボディをストリームとして返却
//return res.bodyAsStream();
//};

///**
//* 指定pathに任意のInputStreamの内容をPUTします.
//指定IDのオブジェクトが既に存在すればそれを書き換え、存在しない場合はあらたに作成する.
//* @param pathValue DAVのパス
//* @param contentType メディアタイプ
//* @param enc 文字コード(使用しない)
//* @param is InputStream
//* @param etag ETag値
//* @throws ClientException DAO例外
//*/
////public void put(String pathValue, String contentType, String enc,
//InputStream is, String etag) throws ClientException {
//dcc.box.DavCollection.prototype.initializeProperties = function() {
////ストリームの場合はエンコーディング指定は使用しない
//put(pathValue, contentType, is, etag);
//};

///**
//* 指定pathに任意のInputStreamの内容をPUTします.
//指定IDのオブジェクトが既に存在すればそれを書き換え、存在しない場合はあらたに作成する.
//* @param pathValue DAVのパス
//* @param contentType メディアタイプ
//* @param is InputStream
//* @param etagValue ETag値
//* @throws ClientException DAO例外
//*/
////public void put(String pathValue, String contentType, InputStream is,
//String etagValue) throws ClientException {
//dcc.box.DavCollection.prototype.put = function() {
//String url = dcc.UrlUtils.append(this.getPath(), pathValue);
//((RestAdapter) RestAdapterFactory.create(this.accessor)).putStream(url,
//contentType, is, etagValue);
//};

///**
//* 指定Pathに任意の文字列データをPUTします.
//* @param {String} pathValue DAVのパス
//* @param contentType メディアタイプ
//* @param data PUTするデータ
//* @param etagValue PUT対象のETag。新規または強制更新の場合は "*" を指定する
//* @throws {ClientException} DAO例外
//*/
/**
 * This method is used to update the DAV collection.
 * @param {String} pathValue DAV Path
 * @param {String} contentType Character code
 * @param {String} data PUT data
 * @param {String} etagValue ETag of PUT target. Specify "*" for forcing new or updated
 * @param {Object} options object optional contains callback, body, headers
 * @returns {dcc.DavResponse/dcc.DcHttpClient} response
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.DavCollection.prototype.put = function(pathValue, options) {
  var url = dcc.UrlUtils.append(this.getPath(), pathValue);
  var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
  var response = "";
  /*valid option is present with atleast one callback*/
  var callbackExist = options !== undefined &&
  (options.success !== undefined ||
      options.error !== undefined ||
      options.complete !== undefined);

  if (!options) {
    options = {};
  }
  if(!options.headers){
    options.headers = {};
  }
  //TODO: Remove extra parameters from restAdapter put,as options itself contains all optional params
  response = restAdapter.put(url, null, null,
      null, null, options);
  if(!callbackExist){
    return new dcc.box.DavResponse(this.accessor, response);
  }

  /*  if (callback !== undefined) {
    response = restAdapter.put(url, data, etag, contentType, {}, function(
        resp) {
      if (resp.getStatusCode() >= 300) {
        if (callback.error !== undefined) {
          callback.error(resp);
        }
      } else {
        if (callback.success !== undefined) {
          callback.success(new dcc.box.DavResponse(resp.accessor, ""));
        }
      }
      if (callback.complete !== undefined) {
        callback.complete(resp);
      }
    });
  } else {
    response = restAdapter.put(url, data, etag, contentType);
    return new dcc.box.DavResponse(this.accessor, response);
  }*/
  return response;
};

///**
//* 指定Pathに任意の文字列データをPUTします.
//* @param pathValue DAVのパス
//* @param contentType メディアタイプ
//* @param enc 文字コード
//* @param data PUTするデータ
//* @param etag PUT対象のETag。新規または強制更新の場合は "*" を指定する
//* @throws ClientException DAO例外
//*/
//dcc.box.DavCollection.prototype.put = function(pathValue, contentType, enc, data,
//etag) {
//byte[] bs;
//try {
//if (!enc.isEmpty()) {
//bs = data.getBytes(enc);
//} else {
//bs = data.getBytes("UTF-8");
//}
//} catch (UnsupportedEncodingException e) {
//throw new ClientException("UnsupportedEncodingException", e);
//}
//InputStream is = new ByteArrayInputStream(bs);
//String url = dcc.UrlUtils.append(this.getPath(), pathValue);
//((RestAdapter) RestAdapterFactory.create(this.accessor)).putStream(url,
//contentType, is, etag);
//};
///**
//* 指定PathのデータをDeleteします(ETag指定).
//* @param {String} pathValue DAVのパス
//* @param {String} etagValue PUT対象のETag。新規または強制更新の場合は "*" を指定する
//* @throws {ClientException} DAO例外
//*/
/**
 * This method is used to delete the data in the specified Path (ETag specified).
 * @param {String} pathValue DAV Path
 * @param {String} etagValue ETag of PUT target. Specify "*" for forcing new or updated
 * @param callback
 * @returns {dcc.DavResponse/dcc.DcHttpClient} response
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.DavCollection.prototype.del = function(pathValue, etagValue, callback) {
  if (typeof etagValue === "undefined") {
    etagValue = "*";
  }
  var url = dcc.UrlUtils.append(this.getPath(), pathValue);
  var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
  //var response = "";
  if(this.accessor.getContext().getAsync()){
    //asynchronous
    restAdapter.del(url, etagValue,callback);
  }else{
    var response = restAdapter.del(url, etagValue);
    return new dcc.box.DavResponse(this.accessor, response);
  }

  /* if (callback !== undefined) {
        restAdapter.del(url, etagValue, function(resp) {
            if (resp.getStatusCode() >= 300) {
                if (callback.error !== undefined) {
                    callback.error(resp);
                }
            } else {
                if (callback.success !== undefined) {
                    callback.success(new dcc.box.DavResponse(resp.accessor, ""));
                }
            }
            if (callback.complete !== undefined) {
                callback.complete(resp);
            }
        });
    } else {
        restAdapter.del(url, etagValue);
        return new dcc.box.DavResponse(this.accessor, "");
    }*/

  //Commented out response since both conditions either call callback or return DavResponse
  //return response;
};

///**
//* 引数で指定されたヘッダの値を取得.
//* @param headerKey 取得するヘッダのキー
//* @return ヘッダの値
//*/
/**
 * This method is used to get the value of the header that is specified in the argument.
 * @param {String} headerKey Key of the header
 * @return {String} value of the header
 */
dcc.box.DavCollection.prototype.getHeaderValue = function(headerKey) {
  return this.accessor.getResHeaders()[headerKey];
};

/**
 * The purpose of this function is to get JSON of cell profile information.
 * @param {String} pathValue
 * @param {string} etag Used for if-none-match condition
 * @returns
 */
dcc.box.DavCollection.prototype.getJSON = function(pathValue, etag) {
  var url = dcc.UrlUtils.append(this.getPath(), pathValue);
  var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
  var response = restAdapter.get(url, "application/json", etag);
  return response;
};

/**
 * This method calls PROPFIND API for specified path to get
 * registered service file detail.
 * @param {String} name filename
 * @param {Object} options optional parameters
 * @returns {dcc.DcHttpClient} response.
 * @throws {dcc.ClientException} Exception thrown
 */
dcc.box.DavCollection.prototype.propfind = function (name,options) {
  var url = dcc.UrlUtils.append(this.getPath(), name);
  var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
  var response = restAdapter.propfind(url,options);
  return response;
};
/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class ODataへアクセスするためのクラス.
//* @constructor
//* @augments dcc.DcCollection
//*/
/**
 * It creates a new object dcc.box.ODataCollection.
 * @class This class represents the OData collections for performing OData related operations.
 * @constructor
 * @augments dcc.DcCollection
 * @param {dcc.Accessor} Accessor
 * @param {String} name
 */
dcc.box.ODataCollection = function(as, name) {
  this.initializeProperties(this, as, name);
};
dcc.DcClass.extend(dcc.box.ODataCollection, dcc.DcCollection);

///**
//* プロパティを初期化する.
//* @param {dcc.box.ODataCollection} self
//* @param {dcc.Accessor} as アクセス主体
//* @param {String} name コレクション名
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.box.ODataCollection} self
 * @param {dcc.Accessor} as Accessor
 * @param {String} name URL for path
 */
dcc.box.ODataCollection.prototype.initializeProperties = function(self, as, name) {
  this.uber = dcc.DcCollection.prototype;
  this.uber.initializeProperties(self, as, name);

  if (as !== undefined) {
//  /** EntitySetアクセスするためのクラス. */
    /** Manager to access EntityType. */
    self.entityType = new dcc.box.odata.schema.EntityTypeManager(as, this);
//  /** assosiationendアクセスのためのクラス. */
    /** Manager to access AssociationEnd. */
    self.associationEnd = new dcc.box.odata.schema.AssociationEndManager(as, this);
  }
};

///**
//* EntitySetの指定.
//* @param {String} name EntitySet名
//* @return {dcc.EntitySet} 生成したEntitySetオブジェクト
//*/
/**
 * This method returns an EntitySet.
 * @param {String} name EntitySet Name
 * @return {dcc.EntitySet} EntitySet object
 */
dcc.box.ODataCollection.prototype.entitySet = function(name) {
  return new dcc.EntitySet(this.accessor, this, name);
};

///**
//* Batch生成.
//* @return {dcc.box.odata.ODataBatch} 生成したODataBatchオブジェクト
//*/
/**
 * This method generates the ODataBatch.
 * @return {dcc.box.odata.ODataBatch} ODataBatch object
 */
dcc.box.ODataCollection.prototype.makeODataBatch = function() {
  return new dcc.box.odata.ODataBatch(this.accessor, this.getPath());
};


/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

/**
 * It creates a new object dcc.box.odata.ODataManager.
 * @class This is the abstract class for generating / deleting the OData related functions and serves
 * as middle layer in API calls for CRUD operations.
 * @constructor
 * @param {dcc.Accessor} Accessor
 * @param {Object} col
 * @param {String} name
 */
dcc.box.odata.ODataManager = function(as, col, name) {
  this.initializeProperties(this, as, col, name);
};

///**
//* プロパティを初期化する.
//* @param {dcc.AbstractODataContext} self
//* @param {dcc.Accessor} as アクセス主体
//* @param {dcc.DcCollection} col
//* @param name entitySetName
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.AbstractODataContext} self
 * @param {dcc.Accessor} as Accessor
 * @param {dcc.DcCollection} col
 * @param name entitySetName
 */
dcc.box.odata.ODataManager.prototype.initializeProperties = function(self, as, col, name) {
  if (typeof as !== "undefined") {
//  /** アクセス主体. */
    /** Accessor. */
    self.accessor = as.clone();
  }

///** DAVコレクション. */
  /** DAV Collection. */
  self.collection = null;
  if (typeof col !== "undefined") {
    self.collection = col;
  }

///** EntitySet名. */
  /** EntitySetName. */
  self.entitySetName = null;
  if (typeof name !== "undefined") {
    self.entitySetName = name;
  }

  /** EntityID. */
  self.keyPredicate = null;

  /** NavigationProperty. */
  self.naviProperty = null;
};

///**
//* IDをEntitySet指定する.
//* @param {String} key keyPredicate
//* @return {dcc.box.odata.ODataManager} EntitySetオブジェクト
//*/
/**
 * This method sets key for EntityID.
 * @param {String} key keyPredicate
 * @return {dcc.box.odata.ODataManager} EntitySet object
 */
dcc.box.odata.ODataManager.prototype.key = function(key) {
  if (typeof key !== "string") {
    throw new dcc.ClientException("InvalidParameter");
  }
  this.keyPredicate = key;
  return this;
};

///**
//* navigationPropertyをEntitySet指定する.
//* @param {String} navProp NavigationProperty
//* @return {dcc.box.odata.ODataManager} EntitySetオブジェクト
//*/
/**
 * This method specifies the EntitySet navigationProperty.
 * @param {String} navProp NavigationProperty
 * @return {dcc.box.odata.ODataManager} EntitySet object
 */
dcc.box.odata.ODataManager.prototype.nav = function(navProp) {
  if (typeof navProp !== "string") {
    throw new dcc.ClientException("InvalidParameter");
  }
  this.naviProperty = navProp;
  return this;
};

///**
//* ベースURL取得.
//* @return {String} ベースURL
//*/
/**
 * This method returns the Base URL for making a connection.
 * @return {String} Base URL
 */
dcc.box.odata.ODataManager.prototype.getBaseUrl = function() {
  return this.accessor.getContext().getBaseUrl();
};

///**
//* ODataデータを作成.
//* @private
//* @param {Object} body POSTするリクエストボディ
//* @param {String} headers POSTするリクエストヘッダー
//* @param callback object optional
//* @return {Ob} 対象となるODataContextを抽象クラスとして返却
//* @throws {ClientException} DAO例外
//*/
/**
 * This method performs create operation.
 * @private
 * @param {Object} body POST Request Body
 * @param {String} headers POST Request Header
 * @param {Object} callback object optional
 * @return {Object} Response
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.odata.ODataManager.prototype._internalCreate = function(body, headers, callback) {
  var url = this.getUrl();
  var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);

  if (callback !== undefined) {
//  restAdapter.post(url, body, "application/json", headers, function(resp) {
//  var json = {};
//  var responseBody = resp.bodyAsJson();
//  if (responseBody.d !== undefined && responseBody.d.results !== undefined) {
//  json = responseBody.d.results;
//  }
//  callback(json);
//  });
    restAdapter.post(url, body, "application/json", headers, callback);
  } else {
    var response = restAdapter.post(url, body, "application/json", headers);
    /* if (response.getStatusCode() === 409 || response.getStatusCode() === 400) {
            return response;
            }
        var json = response.bodyAsJson().d.results;
        return json;*/
    return response;
  }
};

///**
//* ODataデータを取得.
//* @private
//* @param {String} id 対象となるID値
//* @param callback object optional
//* @return {?} １件取得した結果のオブジェクト
//* @throws {ClientException} DAO例外
//*/
/**
 * This method performs retrieve operation. It internally calls _internalRetrieveMultikey.
 * @private
 * @param {String} id ID value
 * @param {Object} callback object optional
 * @return {Object} Object of the result
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.odata.ODataManager.prototype._internalRetrieve = function(id, callback) {
  return this._internalRetrieveMultikey("'" + encodeURIComponent(id) + "'", callback);
};

///**
//* ODataデータを取得(複合キー).
//* @private
//* @param {String} id 対象となる複合キー urlエンコードが必要
//* @param callback object optional
//* @return １件取得した結果のオブジェクト response as json
//* @throws {ClientException} DAO例外
//*/
/**
 * This method performs retrieve operation.
 * @private
 * @param {String} id composite key URL encoding the target
 * @param {Object} options object optional, required in case of ASYNC call
 * @return {Object} response as JSON
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.odata.ODataManager.prototype._internalRetrieveMultikey = function(id, options) {
  var url=null;
  if(id === undefined || id === "''"){
    url = this.getUrl();
  }
  else{
    url = this.getUrl() + "(" + id + ")";
  }

  var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
  if (this.accessor.getContext().getAsync() || options!== undefined) {
    //asynchronous execution mode, invoke callback method
    restAdapter.get(url, "application/json", "*", options);
  } else {
    //synchronous execution mode, return response or throw client exception
    var response = restAdapter.get(url, "application/json", "*" );
    if(this.accessor.batch !== true && response.getStatusCode() >= 300){
      //error case
      throw new dcc.ClientException(response.bodyAsJson().message.value, response.getStatusCode());
    }else{
      //return the response
      return response.bodyAsJson().d.results;
    }
  }
};

///**
//* ODataデータを更新.
//* @private
//* @param {String} id 対象となるID値
//* @param {Object} body PUTするリクエストボディ
//* @param {String} etag ETag値
//* @param headers
//* @param callback object optional
//* @return response DcHttpClient
//* @throws {ClientException} DAO例外
//*/
/**
 * This method performs update operation. It internally calls _internalUpdateMultiKey.
 * @private
 * @param {String} id ID value
 * @param {Object} body PUT Request Body
 * @param {String} etag ETag value
 * @param {Object} headers
 * @param {Object} callback object optional
 * @return {Object} response DcHttpClient
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.odata.ODataManager.prototype._internalUpdate = function(id, body, etag, headers, callback) {
  var response = this._internalUpdateMultiKey("'" + encodeURIComponent(id) + "'", body, etag, headers, callback);
  return response;
};

///**
//* ODataデータを更新.
//* @param id 対象となるID値
//* @param body PUTするリクエストボディ
//* @param etag ETag値
//* @param headers PUTするリクエストヘッダー
//* @throws ClientException DAO例外
//*/
////void _internalUpdate(String id, JSONObject body, String etag, HashMap<String, String> headers) throws ClientException {
//dcc.box.odata.ODataManager.prototype._internalUpdate = function() {
//var url = this.getUrl() + "('" + id + "')";
//var factory = new dcc.http.RestAdapterFactory();
//var restAdapter = factory.create(this.accessor);
//restAdapter.put(url, body.toJSONString(), etag, headers, RestAdapter.CONTENT_TYPE_JSON);
//};

///**
//* ODataデータを更新(複合キー).
//* @private
//* @param {String} multiKey 対象となる複合キー<br> urlエンコードが必要
//* @param {Object} body PUTするリクエストボディ
//* @param {String} etag ETag値
//* @param callback object optional
//* @throws {ClientException} DAO例外
//*/
/**
 * This method performs update operation.
 * @private
 * @param {String} multiKey composite key url encoding the target
 * @param {Object} body PUT Request Body
 * @param {String} etag ETag value
 * @param {Object} callback object optional
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.odata.ODataManager.prototype._internalUpdateMultiKey = function(multiKey, body, etag, headers, callback) {
  var url = this.getUrl() + "(" + multiKey + ")";
  var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
  var response = "";
  //if (callback !== undefined) {
  response = restAdapter.put(url, JSON.stringify(body), etag, "application/json", headers, callback);
  //} else {
  //response = restAdapter.put(url, JSON.stringify(body), etag, "application/json", headers);
  //}
  return response;
};

///**
//* ODataデータを削除.
//* @private
//* @param {String} id 削除するODataデータのID値
//* @param {String} etag ETag値
//* @param callback object optional
//* @return promise
//* @throws {ClientException} DAO例外
//*/
/**
 * This method performs delete operation. It internally calls _internalDelMultiKey.
 * @private
 * @param {String} id ID value
 * @param {String} etagOrOptions ETag value or options object having callback and headers
 * @param {Object} callback object optional for backward compatibility
 * @return {dcc.Promise} promise
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.odata.ODataManager.prototype._internalDel = function(id, etagOrOptions, callback) {
  var response = this._internalDelMultiKey("'" + encodeURIComponent(id) + "'", etagOrOptions, callback);
  return response;
};

///**
//* ODataデータを削除(複合キー).
//* @private
//* @param {String} id 削除するODataデータの複合キー<br> urlエンコードが必要
//* @param {String} etag ETag値
//* @param callback object optional
//* @return promise
//* @throws {ClientException} DAO例外
//*/
/**
 * This method performs delete operation.
 * @private
 * @param {String} id composite key url encoding the target
 * @param {String} etagOrOptions ETag value or options having callback and headers
 * @param {Object} callback object optional for backward compatibility
 * @return {dcc.Promise} promise
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.odata.ODataManager.prototype._internalDelMultiKey = function(id, etagOrOptions, callback) {
  var url = this.getUrl() + "(" + id + ")";
  var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
  var response = restAdapter.del(url, etagOrOptions, callback);
  return response;
};

///**
//* ODataデータを登録.
//* @param {Object} body 登録するJSONオブジェクト
//* @param callback object optional
//* @return {?} 登録結果のレスポンス
//* @throws {ClientException} DAO例外
//*/
/**
 * This method registers the OData data and returns in JSON form.
 * @param {Object} body JSON object
 * @param {Object} callback object optional
 * @return {Object} Response of the registration result
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.odata.ODataManager.prototype.createAsJson = function(body, callback) {
  if (typeof body !== "object") {
    throw new dcc.ClientException("InvalidParameter");
  }
  /*if (callback !== undefined) {
    this._internalCreate(JSON.stringify(body), {}, function(resp) {
      if (resp.getStatusCode() >= 300) {
        if (callback.error !== undefined) {
          callback.error(resp);
        }
      } else {
        if (callback.success !== undefined) {
          var responseBody = resp.bodyAsJson();
          var json = responseBody.d.results;
          callback.success(json);
        }
      }
      if (callback.complete !== undefined) {
        callback.complete(resp);
      }
    });
  }*/
  if(this.accessor.getContext().getAsync() && callback !== undefined){
    this._internalCreate(JSON.stringify(body), {}, callback);
  }
  else {
    var responseJson ={};
    var response = this._internalCreate(JSON.stringify(body));
    var responseBody = response.bodyAsJson();
    if (responseBody.d !== undefined && responseBody.d.results !== undefined) {
      responseJson = responseBody.d.results;
    }
    return responseJson;
    // return this._internalCreate(JSON.stringify(body));
  }
};

///**
//* ODataデータを登録 createAsResponse.
//* @param {Object} json 登録するJSONオブジェクト
//* @param callback object optional
//* @return {?} 登録結果のレスポンス dcc.box.odata.ODataResponse
//* @throws {ClientException} DAO例外
//*/
/**
 * This method registers the OData data and returns in ODataResponse form.
 * @param {Object} json JSON object
 * @param {Object} callback object optional
 * @return {dcc.box.odata.ODataResponse} Response of the registration result
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.odata.ODataManager.prototype.createAsResponse = function(body, callback) {
  if (typeof body !== "object") {
    throw new dcc.ClientException("InvalidParameter");
  }
  if (callback !== undefined) {
      // FST修正
    this._internalCreate(JSON.stringify(body), {}, {complete: function(resp) {
      if (resp.getStatusCode() >= 300) {
        if (callback.error !== undefined) {
          callback.error(resp);
        }
      } else {
        if (callback.success !== undefined) {
          var responseBody = resp.bodyAsJson();
          var json = responseBody.d.results;
          var odataResponse = new dcc.box.odata.ODataResponse(this.accessor, json);
          callback.success(odataResponse);
        }
      }
      if (callback.complete !== undefined) {
        callback.complete(resp);
      }
    }});
  } else {
    //var resJson = this._internalCreate(JSON.stringify(body));
    var responseJson ={};
    var response = this._internalCreate(JSON.stringify(body));
    var responseBody = response.bodyAsJson();
    if (responseBody.d !== undefined && responseBody.d.results !== undefined) {
      responseJson = responseBody.d.results;
    }
    return new dcc.box.odata.ODataResponse(this.accessor, responseJson);
  }
};

///**
//* ODataデータを取得.
//* @param {String} id 取得するID値
//* @param callback object optional
//* @return {Object} 取得したJSONオブジェクト
//* @throws {ClientException} DAO例外
//*/
/**
 * This method retrieves data in JSON form.
 * @param {String} id ID value
 * @param {Object} callback object optional
 * @return {Object} JSON object
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.odata.ODataManager.prototype.retrieveAsJson = function(id, callback) {
  if (typeof id !== "string") {
    throw new dcc.ClientException("InvalidParameter");
  }
  if (callback !== undefined) {
    this._internalRetrieve(id, function(resp) {
      if (resp.getStatusCode() >= 300) {
        if (callback.error !== undefined) {
          callback.error(resp);
        }
      } else {
        if (callback.success !== undefined) {
          var responseBody = resp.bodyAsJson();
          var json = responseBody.d.results;
          callback.success(json);
        }
      }
      if (callback.complete !== undefined) {
        callback.complete(resp);
      }
    });
  } else {
    return this._internalRetrieve(id, callback);
  }
};

///**
//* ODataデータを更新.
//* @param {String} id 対象となるID値
//* @param {Object} body PUTするリクエストボディ
//* @param {String} etag ETag値
//* @param callback object optional
//* @return dcc.box.odata.ODataResponse
//* @throws {ClientException} DAO例外
//*/
/**
 * This method performs update operation.
 * @param {String} id ID value
 * @param {Object} body PUT Request Body
 * @param {String} etag ETag value
 * @param {Object} options object optional
 * @return {dcc.box.odata.ODataResponse} Response
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.odata.ODataManager.prototype.update = function(id, body, etag, options) {
  if (typeof id !== "string" || typeof etag !== "string") {
    throw new dcc.ClientException("InvalidParameter");
  }

  /*valid option is present with atleast one callback*/
  var callbackExist = options !== undefined &&
  (options.success !== undefined ||
      options.error !== undefined ||
      options.complete !== undefined);
  /*
  if (callback !== undefined) {
    this._internalUpdate(id, body, etag, {}, function(resp) {
      if (resp.getStatusCode() >= 300) {
        if (callback.error !== undefined) {
          callback.error(resp);
        }
      } else {
        if (callback.success !== undefined) {
          var odataResponse = new dcc.box.odata.ODataResponse(resp.accessor, "");
          callback.success(odataResponse);
        }
      }
      if (callback.complete !== undefined) {
        callback.complete(resp);
      }
    });
  }
   */

  if (callbackExist) {
    //no return type expected, callback will be executed
    this._internalUpdate(id, body, etag, {},options);
  }
  else {
    //no callback exists
    this._internalUpdate(id, body, etag);
    return new dcc.box.odata.ODataResponse(this.accessor, "");
  }
};

///**
//* ODataデータを削除.
//* @param {String} id 削除するODataデータのID値
//* @param {String} etag ETag値
//* @param callback object optional
//* @return promise
//* @throws {ClientException} DAO例外
//*/
/**
 * This method performs delete operation.
 * @param {String} id ID value
 * @param {String} etag ETag value
 * @param {Object} options object optional
 * @return {dcc.Promise} promise
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.odata.ODataManager.prototype.del = function(id, etag, options) {
  if (typeof id !== "string") {
    throw new dcc.ClientException("InvalidParameter");
  }
  if (typeof etag === "undefined") {
    etag = "*";
  }
  /*valid option is present with atleast one callback*/
  var callbackExist = options !== undefined &&
  (options.success !== undefined ||
      options.error !== undefined ||
      options.complete !== undefined);
  /*  if (callback !== undefined) {
    this._internalDel(id, etag, function(resp) {
      if (resp.getStatusCode() >= 300) {
        if (callback.error !== undefined) {
          callback.error(resp);
        }
      } else {
        if (callback.success !== undefined) {
          var odataResponse = new dcc.box.odata.ODataResponse(resp.accessor, "");
          callback.success(odataResponse);
        }
      }
      if (callback.complete !== undefined) {
        callback.complete(resp);
      }
    });
  }*/
  if (callbackExist) {
    this._internalDel(id, etag, options);
  } else {
    this._internalDel(id, etag);
  }
};

/**
 * This method appends query string to execute Query for Search.
 * @param {dcc.box.odata.DcQuery} query
 * @param {Object} options object optional
 * @return {Object} JSON response
 */
dcc.box.odata.ODataManager.prototype.doSearch = function(query, options) {
  var url = this.getUrl();
  var qry = query.makeQueryString();
  if ((qry !== null) && (qry !== "")) {
    url += "?" + qry;
  }
  var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
  if (options !== undefined) {
    restAdapter.get(url, "application/json", "*", options);
  } else {
    restAdapter.get(url, "application/json", "*" );
    if(restAdapter.getStatusCode() > 300){
      throw new dcc.ClientException(restAdapter.bodyAsJson().message.value, restAdapter.getStatusCode());
    }
    var json = restAdapter.bodyAsJson().d.results;
    return json;
  }
};


/**
 * This method appends query string to execute Query for Search.
 * @param {dcc.box.odata.DcQuery} query
 * @param {Object} callback object optional
 * @return {dcc.box.odata.ODataResponse} response
 */
dcc.box.odata.ODataManager.prototype.doSearchAsResponse = function(query, callback) {
  var url = this.getUrl();
  var qry = query.makeQueryString();
  if ((qry !== null) && (qry !== "")) {
    url += "?" + qry;
  }
  var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
  if (callback !== undefined) {
    restAdapter.get(url, "application/json", "*", callback);
  } else {
    restAdapter.get(url, "application/json", "*" );
    return new dcc.box.odata.ODataResponse(this.accessor, "", restAdapter.bodyAsJson());
  }
};

///**
//* クエリを生成.
//* @return {dcc.box.odata.DcQuery} 生成したQueryオブジェクト
//*/
/**
 * This method executes Query.
 * @return {dcc.box.odata.DcQuery} Query object generated
 */
dcc.box.odata.ODataManager.prototype.query = function() {
  return new dcc.box.odata.DcQuery(this);
};

///**
//* ODataデータの生存確認.
//* @param {String} id 対象となるODataデータのID
//* @return {boolean} true:生存、false:不在
//*/
/**
 * This method checks whether the specified Odata exists.
 * @param {String} id ID value
 * @return {DcHttpClient} response object
 * @throws {dcc.ClientException} exception
 */
dcc.box.odata.ODataManager.prototype.exists = function(id) {
  //var status = true;
  if (typeof id !== "string") {
    throw new dcc.ClientException("InvalidParameter");
  }

  var url = this.getUrl() + "('" + id + "')";
  var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
  var response = restAdapter.head(url);
  return response;
 /* try {
    var response = restAdapter.head(url);
    if(response.getStatusCode() === 404){
      status = false;
    }
  } catch (e) {
    status = false;
  }
  return status;*/
};

///**
//* URLを取得する.
//* @returns {String}　URL
//*/
/**
 * This method generates the URL for executing API calls.
 * @returns {String}　URL
 */
dcc.box.odata.ODataManager.prototype.getUrl = function() {
  var sb = "";
  // $Batchモードの場合は、相対パス
  /** In the case of $ Batch mode, the relative path . */
  if (!this.accessor.isBatchMode()) {
    sb += this.collection.getPath() + "/";
  }
  sb += this.entitySetName;
  // key()によりKeyPredicateとnav()によりnaviPropertyが指定されていたら
  /** naviProperty if it has been specified by the nav and KeyPredicate. */
  if ((this.keyPredicate !== null && this.keyPredicate !== "") &&
      (this.naviProperty !== null && this.naviProperty !== "")) {
    sb += "('" + this.keyPredicate + "')/_" + this.naviProperty;
  }
  return sb;
};

/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class OData関連の各機能を生成/削除するためのクラスの抽象クラス.
//* @constructor
//*/
/**
 * It creates a new object dcc.EntitySet.
 * @class This is the abstract class for performing the merge functions.
 * @param {dcc.Accessor} Accessor
 * @param {dcc.DcCollection} collection
 * @param {String} name
 */
dcc.EntitySet = function(as, col, name) {
  this.initializeProperties(this, as, col, name);
};
dcc.DcClass.extend(dcc.EntitySet, dcc.box.odata.ODataManager);

///**
//* プロパティを初期化する.
//* @param {dcc.AbstractODataContext} self
//* @param {dcc.Accessor} as アクセス主体
//* @param {?} col
//* @param {?} name
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.AbstractODataContext} self
 * @param {dcc.Accessor} as Accessor
 * @param {dcc.DcCollection} col
 * @param {String} name
 */
dcc.EntitySet.prototype.initializeProperties = function(self, as, col, name) {
  this.uber = dcc.box.odata.ODataManager.prototype;
  this.uber.initializeProperties(self, as, col, name);
};

///**
//* Odataデータを部分更新.
//* @param {String} id 部分更新するOdataデータのID値
//* @param {Object} body 部分更新するリクエストボディ
//* @param {String} etag Etag値
//* @throws {ClientException} DAO例外
//*/
/**
 * This method performs the partial update of the Odata data.
 * @param {String} id ID value of the data
 * @param {Object} body Request body
 * @param {String} etag Etag value
 * @param {Object} callback parameter
 * @throws {dcc.ClientException} DAO exception
 */
dcc.EntitySet.prototype.internalMerge = function(id, body, etag, callback) {
  var url = this.getUrl() + "('" + id + "')";
  var rest = dcc.http.RestAdapterFactory.create(this.accessor);
  if (callback !== undefined) {
    rest.merge(url, JSON.stringify(body), etag, "application/json", function(resp) {
      callback(resp);
    });
  } else {
    return rest.merge(url, JSON.stringify(body), etag, "application/json");
  }
};

///**
//* Odataデータを部分更新.
//* @param {String} id 対象となるID値
//* @param {Object} body PUTするリクエストボディ
//* @param {String} etag ETag値
//* @throws {ClientException} DAO例外
//*/
/**
 * This method is exposed to perform the partial update of the Odata data.
 * @param {String} id ID value of the data
 * @param {Object} body Request body
 * @param {String} etag ETag value
 * @param {Object} callback parameter
 * @throws {dcc.ClientException} DAO exception
 */
dcc.EntitySet.prototype.merge = function(id, body, etag, callback) {
  if (callback !== undefined) {
    this.internalMerge(id, body, etag, function(resp) {
      if (resp.getStatusCode() >= 300) {
        if (callback.error !== undefined) {
          callback.error(resp);
        }
      } else {
        var odataResponse = new dcc.box.odata.ODataResponse(resp.accessor, "");
        if (callback.success !== undefined) {
          callback.success(odataResponse);
        }
      }
      if (callback.complete !== undefined) {
        callback.complete(resp);
      }
    });
  } else {
    this.internalMerge(id, body, etag);
    return new dcc.box.odata.ODataResponse(this.accessor, "");
  }
};

///**
//* Odataデータを取得.
//* @param {String} id 対象となるID値
//* @throws {ClientException} DAO例外
//*/
/**
 * This method gets Odata as response.
 * @param {String} id ID value
 * @param {Object} callback parameter
 * @throws {dcc.ClientException} DAO exception
 */
dcc.EntitySet.prototype.retrieveAsResponse = function(id, callback) {
/*  if (callback !== undefined) {
    this._internalRetrieve(id, function(resp) {
      if (resp.getStatusCode() >= 300) {
        if (callback.error !== undefined) {
          callback.error(resp);
        }
      } else {
        var responseBody = resp.bodyAsJson();
        var json = responseBody.d.results;
        var odataResponse = new dcc.box.odata.ODataResponse(resp.accessor, json);
        if (callback.success !== undefined) {
          callback.success(odataResponse);
        }
      }
      if (callback.complete !== undefined) {
        callback.complete(resp);
      }
    });
  } */
  if(this.accessor.getContext().getAsync()){
    this._internalRetrieve(id,callback);
  }
  else {
    var body = this._internalRetrieve(id);
    return new dcc.box.odata.ODataResponse(this.accessor, body);
  }
};

/**
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* コマンドを$Batchフォーマットに生成する.
//* @class Represents ODataBatch.
//*/
/**
 * This class is used to generate the $ Batch format command.
 * @class Represents ODataBatch.
 * @param {dcc.Accessor} Accessor
 * @param {String} name
 */
dcc.box.odata.ODataBatch = function(as, name) {
  this.initializeProperties(this, as, name);
};
dcc.DcClass.extend(dcc.box.odata.ODataBatch, dcc.box.ODataCollection);

///**
//* オブジェクトを初期化.
//* @param {dcc.box.odata.schema.EntityType} self
//* @param {dcc.Accessor} as アクセス主体
//* @param {Object} json サーバーから返却されたJSONオブジェクト
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.box.odata.schema.EntityType} self
 * @param {dcc.Accessor} as Accessor
 * @param {String} name Path to URL
 */
dcc.box.odata.ODataBatch.prototype.initializeProperties = function(self, as, name) {
  this.uber = dcc.box.ODataCollection.prototype;
  this.uber.initializeProperties(self, as, name);
  this.accessor.setBatch(true);

  self.odataResponses = [];
};

///**
//* Batchコマンドの実行.
//* @throws ClientException DAO例外
//*/
/**
 * This method is responsible for Batch execution of commands.
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.odata.ODataBatch.prototype.send = function() {
  var url = dcc.UrlUtils.append(this.getPath(), "$batch");
  var boundary = this.accessor.getBatchAdapter().getBatchBoundary();
  var contentType = "multipart/mixed; boundary=" + boundary;

  var rest = new dcc.http.RestAdapter(this.accessor);
  var res = rest.post(url, this.accessor.getBatchAdapter().getBody(), contentType);

  var parser = new dcc.box.odata.ODataBatchResponseParser();

  this.odataResponses = parser.parse(res.bodyAsString(), boundary);
};

///**
//* BatchBoundaryを挿入する.
//* @throws ClientException Dao例外
//*/
/**
 * This method is responsible for inserting the BatchBoundary.
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.odata.ODataBatch.prototype.insertBoundary = function() {
  this.accessor.getBatchAdapter().insertBoundary();
};

///**
//* batch実行結果の取得.
//* @return batch実行結果オブジェクト
//*/
/**
 * This method acquires batch execution result.
 * @return {Object} batch execution result object
 */
dcc.box.odata.ODataBatch.prototype.getBatchResponses = function() {
  return this.odataResponses;
};

/**
 * Batch $links Generate link.
 * @param {String} name EntitySet Name
 * @param {String} id Of User data __id
 * @returns {dcc.box.odata.BatchLinksEntity} BatchLinksEntity
 */
dcc.box.odata.ODataBatch.prototype.batchLinksEntity = function(name, id) {
  return new dcc.box.odata.BatchLinksEntity(name, id, this.accessor, this.getPath());
};

///**
//* Batchの$links登録用リンクターゲットオブジェクトを生成する.
//* @param name EntitySet名
//* @param id ユーザデータの __id
//* @return 生成したリンクターゲットオブジェクト
//*/
/**
 * This method generates a Batch of $ links registration link target object.
 * @param {String} name EntitySet name
 * @param {String} id __id Of user data
 * @return {Object} Generated Link target object
 */
dcc.box.odata.ODataBatch.prototype.batchLinksTarget = function(name, id) {
  return new dcc.box.odata.BatchLinksEntity(name, id);
};
/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class アクセサクラス. データクラウドへアクセスするＡＰＩを呼び出す際のアクセス主体となります。
//* @constructor
//* @property {number} expiresIn トークンの有効期限.
//*/
/**
 * It creates a new object dcc.Accessor.
 * @class This is the base class for setting the access parameters to access Cloud data.
 * @constructor
 * @property {number} expiresIn Expiration date of the token.
 * @param {dcc.DcContext} dcContext
 */
dcc.Accessor = function(dcContext) {
    this.initializeProperties(this, dcContext);
};

///** asメソッドに利用する type. */
/** as accessor key type. *
//var ACCESSOR_KEY_SELF = "self";
///** asメソッドに利用する type. */
/** as accessor key client type. */
//var ACCESSOR_KEY_CLIENT = "client";
///** asメソッドに利用する type. */
/** @param {String} accessor token */
dcc.Accessor.ACCESSOR_KEY_TOKEN = "token";

///**
//* プロパティを初期化する.
//* @param {dcc.Accessor} self
//* @param　{?} dcContext DCコンテキスト
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.Accessor} self
 * @param　{dcc.DcContext} dcContext
 */
dcc.Accessor.prototype.initializeProperties = function(self, dcContext) {

//  /** トークンの有効期限. */
    /** Expiration date of the token. */
    self.expiresIn = 0;
//  /** アクセストークン. */
    /** access token. */
    self.accessToken = null;
//  /** リフレッシュトークンの有効期限. */
    /** Expiration date of the refresh token. */
    self.refreshExpiresIn = 0;
//  /** リフレッシュトークン. */
    /** refresh token. */
    self.refreshToken = null;
//  /** トークンタイプ. */
    /** token type. */
    self.tokenType = null;

    self.schemaAuth = {};

//  /** アクセス種別. */
    /** access type. */
    self.accessType = "";

//  /** Cellの名前. */
    /** cell name. */
    self.cellName = "";

//  /** 認証ID. */
    /** user id. */
    self.userId = "";
//  /** 認証パスワード. */
    /** @param {String} password. */
    self.password = "";

//  /** スキーマ. */
    /** schema. */
    self.schema = "";
//  /** スキーマ認証ID. */
    /** schema user id. */
    self.schemaUserId = "";
//  /** スキーマ認証パスワード. */
    /** schema password. */
    self.schemaPassword = "";

//  /** 対象Cellの名前. */
    /** target cell name. */
    self.targetCellName = "";

//  /** トランスセルトークン. */
    /** Transformer cell token. */
    self.transCellToken = "";
//  /** トランスセルリフレッシュトークン. */
    /** Transformer cell refresh token.. */
    self.transCellRefreshToken = "";

//  /** オーナー. */
    /** owner. */
    self.owner = false;

//  /** 基底URL. */
    /** base url. */
    self.baseUrl = "";
//  /** 現在のBox Schema. */
    /** Current box schema. */
    self.boxSchema = "";
//  /** 現在のBox Name. */
    /** current box name. */
    self.boxName = "";

//  /** DCコンテキスト. */
    /** DcContext. */
    self.context = null;
    /** Cell. */
    self.currentCell = "";

//  /** バッチモード. */
    /** batch moode. */
    self.batch = false;

    /** BatchAdapter. */
    self.batchAdapter = null;

//  /** デフォルトヘッダ. */
    /** default header. */
    self.defaultHeaders = "";

//  /** サーバーのレスポンスから取得したレスポンスヘッダ. */
    /** Response headers that are retrieved from the server response. */
    self.resHeaders = {};

    /** Variable to hold dc_cookie_peer key */
    self.cookiePeer = "";

    if (dcContext !== undefined) {
        self.context = dcContext;
        self.baseUrl = dcContext.getBaseUrl();
        self.cellName = dcContext.getCellName();
        self.boxSchema = dcContext.getBoxSchema();
        self.boxName = dcContext.getBoxName();
    }
};

///**
//* Accessorのクローンを生成する.
//* @return {?} コピーしたAccessorオブジェクト
//*/
/**
 * This method generates the clone of Accessor.
 * @return {Object} Copied accessor object
 */
dcc.Accessor.prototype.clone = function() {
    var dest = {};
    for (var prop in this) {
        dest[prop] = this[prop];
    }
    return dest;
};

///**
//* 他のCellを指定します.
//* @param {dcc.unitctl.Cell} 接続先Cell URL
//* @param {Object} opts object with useCookie
//* @return {dcc.unitctl.Cell} CellへアクセスするためのCellインスタンス
//* @throws ClientException DAO例外
//*/
/**
 * This method specifies the cell through accessor.
 * @param {dcc.unitctl.Cell} cellUrl Destination Cell URL
 * @param {Object} opts object with useCookie
 * @return {dcc.unitctl.Cell} Cell Instance
 * @throws {dcc.ClientException} DAO exception
 */
dcc.Accessor.prototype.cell = function(cellUrl, opts) {
    if (opts === undefined){
        opts = {};
    }
    var useCookie = opts.useCookie === undefined ? false : opts.useCookie;
    // create a clone so that the original accessor (this object)
    // should be kept untouched.
    // In the rest of this method, only cloned accessor is to be handled.
    var clone = this.clone();

    var targetCellUrl = cellUrl;
    var myCellUrl = clone.getCellUrl();

    //If target cell URL exist but is not a valid URL then make it a valid URL
    if (targetCellUrl && !dcc.UrlUtils.isUrl(targetCellUrl)) {
        targetCellUrl = dcc.UrlUtils.append(this.baseUrl, targetCellUrl) + "/";
    }

    if (this.accessType !== "token") {
        // Compare the given cellUrl parameter and home cell URL () if provided, if they are same or parameter is not provided
        // Returns the home Cell client object.
        if (!targetCellUrl || myCellUrl === targetCellUrl) {
            if (!this.schema){
                //Pattern 1
                clone._obtainAccessTokenFromMyCell(myCellUrl , useCookie);
            }else{
                //Pattern 3
                clone._obtainAccessTokenFromMyCellWithSchema(myCellUrl , useCookie);
            }
            //return myCell instance
            var myCell = new dcc.unitctl.Cell(clone);
            //console.log(myCell);
            return myCell;
        }
        clone.targetCellName = dcc.UrlUtils.extractFirstPath(cellUrl);
        //Fetch tokens unless this accessor is elevated to Unit User.
        //create target URL
        if (dcc.UrlUtils.isUrl(clone.targetCellName)) {
            targetCellUrl = clone.targetCellName + "/";
        } else {
            targetCellUrl = dcc.UrlUtils.append(this.baseUrl, clone.targetCellName) + "/";
        }
        if (!clone.owner) {
            if(!this.schema){
                //Pattern 2
                //clone.authenticate(useCookie);
                clone._obtainAccessTokenFromExtCell(myCellUrl , targetCellUrl , useCookie);
            }else{
                //Pattern 4
                clone._obtainAccessTokenFromExtCellWithSchema(myCellUrl , targetCellUrl , useCookie);
                //clone.authenticate(useCookie);
            }
        }
    }
    //Tentative implementation since cross-unit access is not supported.
    //TODO need to support cross-unit access. Probably it is better to
    //get rid of cellName and baseUrl from Accessor members and introduce cell URL.
    clone.cellName = dcc.UrlUtils.extractFirstPath(cellUrl);
    //return extCell instance
    var extCell =  new dcc.unitctl.Cell(clone, dcc.UrlUtils.extractFirstPath(cellUrl));
    return extCell;
};

///**
//* パスワード変更.
//* @param newPassword 変更するパスワード
//* @throws ClientException DAO例外
//*/
/**
 * This method changes the current password.
 * @param {String} newPassword New Password
 * @throws {dcc.ClientException} DAO exception
 */
dcc.Accessor.prototype.changePassword = function(newPassword) {
    if (this.accessToken === null) {
        // accessTokenが無かったら自分で認証する
        /** if access token is not present then authenticate. */
        this.authenticate();
    }

    // パスワード変更
    /** Password change. */
    var headers = {};
    headers["X-Dc-Credential"] = newPassword;

    // パスワード変更のURLを作成
    /** Create the URL for password change. */
    var url = dcc.UrlUtils.append(this.getBaseUrl(), this.getCellName() + "/__mypassword");

    var rest = dcc.http.RestAdapterFactory.create(this);
    rest.put(url, "", "*", "application/json", headers);
    // password変更でエラーの場合は例外がthrowされるので例外で無い場合は、
    // Accessorのpasswordを新しいのに変えておく
    /** Password is set to new password. */
    this.password = newPassword;
};

///**
//* $Batchモードの取得.
//* @return {?} batchモード
//*/
/**
 * This method is used for Acquisition of $ Batch mode.
 * @return {Boolean} batch mode
 */
dcc.Accessor.prototype.isBatchMode = function() {
    return this.batch;
};

///**
//* $Batchモードの設定.
//* @param {?} batch $Batchモード
//*/
/**
 * THis method is used to set $ Batch mode.
 * @param {Boolean} batch $Batch mode
 */
dcc.Accessor.prototype.setBatch = function(batch) {
    if (typeof batch !== "boolean") {
        throw new dcc.ClientException("InvalidParameter");
    }
    this.batchAdapter = new dcc.box.odata.BatchAdapter(this);
    this.batch = batch;
};

///**
//* BatchAdaptrの取得. インスタンスが生成されていない場合生成する
//* @return {dcc.box.odata.BatchAdapter} BatchAdapterオブジェクト
//*/
/**
 * This method creates an instance to batch adapter if it does not exists.
 * @return {dcc.box.odata.BatchAdapter} BatchAdapter object
 */
dcc.Accessor.prototype.getBatchAdapter = function() {
    if (this.batchAdapter === null) {
        this.batchAdapter = new dcc.box.odata.BatchAdapter(this);
    }
    return this.batchAdapter;
};

///**
//* Unit昇格.
//* @return {?} 昇格後のAccessor(OwnerAccessor)
//* @throws {ClientException} DAO例外
//*/
/**
 * This method returns instance of OwnerAccessor with default headers.
 * @return {dcc.OwnerAccesssor} Accessor after promotions(OwnerAccessor)
 * @throws {dcc.ClientException} DAO exception
 */
dcc.Accessor.prototype.asCellOwner = function() {
    var ownerAccessor = new dcc.OwnerAccessor(this.context, this);
    ownerAccessor.defaultHeaders = this.defaultHeaders;
    return ownerAccessor;
};

///**
//* グローバルトークンの取得.
//* @return {dcc.ClientException} グローバルトークン
//*/
/**
 * It returns the access token.
 * @return {dcc.ClientException} access token
 * @deprecated replaced by {Cell#getAccessToken}
 */
dcc.Accessor.prototype.getAccessToken = function() {
    return this.accessToken;
};

///**
//* デフォルトヘッダを設定.
//* @param {Object} value デフォルトヘッダ
//*/
/**
 * This method sets the default headers.
 * @param {Object} default header value
 */
dcc.Accessor.prototype.setDefaultHeaders = function(value) {
    if (typeof value !== "object") {
        throw new dcc.ClientException("InvalidParameter");
    }
    this.defaultHeaders = value;
};

///**
//* デフォルトヘッダを取得.
//* @return {Object} デフォルトヘッダ
//*/
/**
 * This method returns the default headers.
 * @return {Object} default header value
 */
dcc.Accessor.prototype.getDefaultHeaders = function() {
    return this.defaultHeaders;
};

///**
//* グローバルトークンの設定.
//* @param {String} token グローバルトークン
//*/
/**
 * This method sets the access token value.
 * @param {String} token access token
 * @deprecated deprecated method
 */
dcc.Accessor.prototype.setAccessToken = function(token) {
    if (typeof token !== "string") {
        throw new dcc.ClientException("InvalidParameter");
    }
    this.accessToken = token;
};

///**
//* ClientConfigオブジェクトを取得.
//* @return {dcc.ClientConfig} ClientConfigオブジェクト
//*/
/**
 * This method gets the ClientConfig object.
 * @return {dcc.ClientConfig} ClientConfig object
 */
dcc.Accessor.prototype.getClientConfig = function() {
    return this.context.getClientConfig();
};

///**
//* DCコンテキストの取得.
//* @return {?} DCコンテキスト
//*/
/**
 * This method acquires the DcContext.
 * @return {dcc.DcContext} DCContext
 */
dcc.Accessor.prototype.getContext = function() {
    return this.context;
};

///**
//* DCコンテキストの設定.
//* @param {Object} dcContext DCコンテキスト
//*/
/**
 * This method sets the DcContext.
 * @param {Object} dcContext DCContext
 */
dcc.Accessor.prototype.setContext = function(dcContext) {
    if (typeof dcContext !== "object") {
        throw new dcc.ClientException("InvalidParameter");
    }
    this.context = dcContext;
};

///**
//* 現在アクセス中のCell取得.
//* @return {?} Cellクラスインスタンス
//*/
/**
 * This method returns the cell currently being accessed.
 * @return {dcc.unitctl.Cell} Cell instance
 */
dcc.Accessor.prototype.getCurrentCell = function() {
    return this.currentCell;
};

///**
//* 現在アクセス中のCell設定.
//* @param {?} cell Cellクラスインスタンス
//*/
/**
 * This method sets the current cell.
 * @param {dcc.unitctl.Cell} Cell instance
 */
dcc.Accessor.prototype.setCurrentCell = function(cell) {
    this.currentCell = cell;
};

///**
//* トークンの有効期限の取得.
//* @return {?} トークンの有効期限
//*/
/**
 * This method returns the expiration value of token.
 * @return {String} token expiration value
 */
dcc.Accessor.prototype.getExpiresIn = function() {
    return this.expiresIn;
};

///**
//* リフレッシュトークンの設定.
//* @return {?} リフレッシュトークン
//*/
/**
 * This method returns the refresh token.
 * @return {String} refresh token
 * @deprecated deprecated method
 */
dcc.Accessor.prototype.getRefreshToken = function() {
    return this.refreshToken;
};

///**
//* リフレッシュトークンの設定.
//* @return {?} リフレッシュトークン
//*/
/**
 * This method returns the token type.
 * @return {String} token type
 */
dcc.Accessor.prototype.getTokenType = function() {
    return this.tokenType;
};

///**
//* リフレッシュトークンの有効期限の取得.
//* @return {?} リフレッシュトークンの有効期限
//*/
/**
 * This method gets the refresh token expiration value.
 * @return {String} refresh token expiration value
 */
dcc.Accessor.prototype.getRefreshExpiresIn = function() {
    return this.refreshExpiresIn;
};

///**
//* CellName値の取得.
//* @return {String} CellName値
//*/
/**
 * This method gets the cell name.
 * @return {String} CellName value
 */
dcc.Accessor.prototype.getCellName = function() {
    return this.cellName;
};

///**
//* CellName値の設定.
//* @param {String} name CellName値
//*/
/**
 * This method sets the cell name.
 * @param {String} name CellName value
 */
dcc.Accessor.prototype.setCellName = function(name) {
    if (typeof name !== "string") {
        throw new dcc.ClientException("InvalidParameter");
    }
    this.cellName = name;
};

/**
 * This method sets the clientSecret.
 * @param {String} clientSecret client secret value
 */
dcc.Accessor.prototype.setClientSecret = function(clientSecret) {
    this.clientSecret = clientSecret;
};

///**
//* Box Schemaの取得.
//* @return {String} Schema名
//*/
/**
 * This method gets the box schema value.
 * @return {String} Box Schema value
 */
dcc.Accessor.prototype.getBoxSchema = function() {
    return this.boxSchema;
};

///**
//* Box Schemaの設定.
//* @param {String} uri Box Schema名
//*/
/**
 * This method sets the box schema value.
 * @param {String} uri Box Schema value
 */
dcc.Accessor.prototype.setBoxSchema = function(uri) {
    if (typeof uri !== "string") {
        throw new dcc.ClientException("InvalidParameter");
    }
    this.boxSchema = uri;
};

///**
//* Box Nameを取得.
//* @return {String} Box Name
//*/
/**
 * This method returns the box name.
 * @return {String} Box Name
 */
dcc.Accessor.prototype.getBoxName = function() {
    return this.boxName;
};

///**
//* Box Nameの設定.
//* @param {String} value Box Name
//*/
/**
 * This method sets the box name.
 * @param {String} value Box Name
 */
dcc.Accessor.prototype.setBoxName = function(value) {
    if (typeof value !== "string") {
        throw new dcc.ClientException("InvalidParameter");
    }
    this.boxName = value;
};

///**
//* 基底URLを設定.
//* @return {String} URL文字列
//*/
/**
 * This method returns the base url value.
 * @return {String} Base URL value
 */
dcc.Accessor.prototype.getBaseUrl = function() {
    return this.baseUrl;
};

///**
//* 基底URLを取得.
//* @param {String} value URL文字列
//*/
/**
 * This method sets the base url value.
 * @param {String} value base URL value
 */
dcc.Accessor.prototype.setBaseUrl = function(value) {
    if (typeof value !== "string") {
        throw new dcc.ClientException("InvalidParameter");
    }
    this.baseUrl = value;
};

///**
//* ユーザIDを取得する.
//* @return {String} the userId
//*/
/**
 * This method returns the user id.
 * @return {String} the userId
 */
dcc.Accessor.prototype.getUserId = function() {
    return this.userId;
};

///**
//* ユーザIDを設定する.
//* @param {String} userId the userId to set
//*/
/**
 * This method sets the user id.
 * @param {String} userId the userId to set
 */
dcc.Accessor.prototype.setUserId = function(userId) {
    if (typeof userId !== "string") {
        throw new dcc.ClientException("InvalidParameter");
    }
    this.userId = userId;
};

///**
//* パスワードを取得する.
//* @return {String} the password
//*/
/**
 * This method gets the password.
 * @return {String} the password
 */
dcc.Accessor.prototype.getPassword = function() {
    return this.password;
};

///**
//* パスワードを設定する.
//* @param {String} password the password to set
//*/
/**
 * This method sets the password.
 * @param {String} password the password to set
 */
dcc.Accessor.prototype.setPassword = function(password) {
    if (typeof password !== "string") {
        throw new dcc.ClientException("InvalidParameter");
    }
    this.password = password;
};

///**
//* Schemaを取得する.
//* @return {String} the schema
//*/
/**
 * This method gets the schema.
 * @return {String} the schema
 */
dcc.Accessor.prototype.getSchema = function() {
    return this.schema;
};

///**
//* Schemaを設定する.
//* @param {String} schema the schema to set
//*/
/**
 * This method sets the schema.
 * @param {String} schema the schema to set
 */
dcc.Accessor.prototype.setSchema = function(schema) {
    if (typeof schema !== "string") {
        throw new dcc.ClientException("InvalidParameter");
    }
    this.schema = schema;
};

///**
//* 外部Cellを取得する.
//* @return {String} the targetCellName
//*/
/**
 * This method returns the target cell name.
 * @return {String} the targetCellName
 */
dcc.Accessor.prototype.getTargetCellName = function() {
    return this.targetCellName;
};

///**
//* 外部Cellを設定する.
//* @param {String} targetCellName the targetCellName to set
//*/
/**
 * This method returns the target cell name.
 * @param {String} targetCellName the targetCellName to set
 */
dcc.Accessor.prototype.setTargetCellName = function(targetCellName) {
    if (typeof targetCellName !== "string") {
        throw new dcc.ClientException("InvalidParameter");
    }
    this.targetCellName = targetCellName;
};

///**
//* "self","client"等のタイプを設定する.
//* @param {String} accessType the accessType to set
//*/
/**
 * This method sets the type of client.
 * @param {String} accessType the accessType to set
 */
dcc.Accessor.prototype.setAccessType = function(accessType) {
    if (typeof accessType !== "string") {
        throw new dcc.ClientException("InvalidParameter");
    }
    this.accessType = accessType;
};

///**
//* "self","client"等のタイプを返却.
//* @return {String} タイプ
//*/
/**
 * This method gets the type of client.
 * @return {String} タイプ
 */
dcc.Accessor.prototype.getAccessType = function() {
    return this.accessType;
};

///**
//* トランスセルを設定する.
//* @param {String} transCellToken the trancCellToken to set
//*/
/**
 * This method sets the transformer cell token value.
 * @param {String} transCellToken the trancCellToken to set
 * @deprecated deprecated method
 */
dcc.Accessor.prototype.setTransCellToken = function(trancCellToken) {
    if (typeof trancCellToken !== "string") {
        throw new dcc.ClientException("InvalidParameter");
    }
    this.transCellToken = trancCellToken;
};

///**
//* トランスセルを取得する.
//* @returns {String} the transCellToken
//*/
/**
 * This method gets the transformer cell token value.
 * @returns {String} the transCellToken
 * @deprecated deprecated method
 */
dcc.Accessor.prototype.getTransCellToken = function() {
    return this.transCellToken;
};

///**
//* トランスセルリフレッシュトークンを設定する.
//* @param {String} trancCellRefreshToken the trancCellRefreshToken to set
//*/
/**
 * This method sets the transformer cell refresh token value.
 * @param {String} trancCellRefreshToken the trancCellRefreshToken to set
 * @deprecated deprecated method
 */
dcc.Accessor.prototype.setTransCellRefreshToken = function(trancCellRefreshToken) {
    if (typeof trancCellRefreshToken !== "string") {
        throw new dcc.ClientException("InvalidParameter");
    }
    this.transCellRefreshToken = trancCellRefreshToken;
};

///**
//* トランスセルリフレッシュトークンを取得する.
//* @returns {String} the trancCellRefreshToken
//*/
/**
 * This method gets the transformer cell refresh token value.
 * @returns {String} the trancCellRefreshToken
 * @deprecated deprecated method
 */
dcc.Accessor.prototype.getTransCellRefreshToken = function() {
    return this.transCellRefreshToken;
};

///**
//* スキーマユーザIDを設定する.
//* @param {String} schemaUserId the schemaUserId to set
//*/
/**
 * This method sets the schema user ID.
 * @param {String} schemaUserId the schemaUserId to set
 */
dcc.Accessor.prototype.setSchemaUserId = function(schemaUserId) {
    if (typeof schemaUserId !== "string") {
        throw new dcc.ClientException("InvalidParameter");
    }
    this.schemaUserId = schemaUserId;
};

///**
//* スキーマユーザIDを取得する.
//* @returns {String} the schemaUserId
//*/
/**
 * This method gets the schema user ID.
 * @returns {String} the schemaUserId
 */
dcc.Accessor.prototype.getSchemaUserId = function() {
    return this.schemaUserId;
};

///**
//* スキーマユーザパスワードを設定する.
//* @param {String} schemaPassword the schemaPassword to set
//*/
/**
 * This method sets the schema password.
 * @param {String} schemaPassword the schemaPassword to set
 */
dcc.Accessor.prototype.setSchemaPassword = function(schemaPassword) {
    if (typeof schemaPassword !== "string") {
        throw new dcc.ClientException("InvalidParameter");
    }
    this.schemaPassword = schemaPassword;
};

///**
//* スキーマユーザパスワードを取得する.
//* @returns {String} the schemaPassword
//*/
/**
 * This method gets the schema password.
 * @returns {String} the schemaPassword
 */
dcc.Accessor.prototype.getSchemaPassword = function() {
    return this.schemaPassword;
};

///**
//* サーバーのレスポンスから取得したレスポンスヘッダを設定.
//* @param headers 設定するヘッダ
//*/
/**
 * This method sets the response header acquired from the server response.
 * @param {Object} headers response headers
 * @deprecated deprecated method
 */
dcc.Accessor.prototype.setResHeaders = function(headers) {
    this.resHeaders = headers;
};

///**
//* レスポンスヘッダの取得.
//* @return レスポンスヘッダの一覧
//*/
/**
 * This method gets the response header acquired from the server response.
 * @return {Object} response headers
 * @deprecated replaced by {DcHttpClient#getAllResponseHeaders}
 */
dcc.Accessor.prototype.getResHeaders = function() {
    return this.resHeaders;
};

/**
 * Get the cookie peer key.
 * @return {String} Cookie Peer Key
 */
dcc.Accessor.prototype.getCookiePeer = function() {
    return this.cookiePeer;
};

///**
//* 認証を行う.
//* @param {Boolean} useCookie to check dc_cookie
//* @throws {ClientException} DAO例外
//*/
/**
 * This method performs authentication of current user based on token etc.
 * @param {Boolean} useCookie to check dc_cookie
 * @throws {dcc.ClientException} DAO exception
 */
dcc.Accessor.prototype.authenticate = function(useCookie) {

    if (this.accessType === "token") {
        return;
    }
    var httpClient = new dcc.http.DcHttpClient(false);

    // 認証するurlを作成する
    /** Create URL for authentication */
    var authUrl = this.getCellUrl();

    // 認証するためのリクエストボディを作る
    /** Create request body for authentication */
    var requestBody = "";
    if (this.transCellToken !== null  && this.transCellToken !== "") {
        // トランスセルトークン認証
        /** Trans-cell token authentication */
        requestBody += "grant_type=urn:ietf:params:oauth:grant-type:saml2-bearer&assertion=";
        requestBody += this.transCellToken;
    } else if (this.transCellRefreshToken !== null && this.transCellRefreshToken !== "") {
        // リフレッシュトークン認証
        /** Refresh token authentication */
        requestBody += "grant_type=refresh_token&refresh_token=";
        requestBody += this.transCellRefreshToken;
    } else if (this.userId !== null && this.userId !== "") {
        // パスワード認証
        /** Password authentication */
        requestBody = "grant_type=password";
        requestBody += "&username=" + this.userId;
        requestBody += "&password=" + this.password;
    }

    // targetのURLを作る
    /** Create target URL */
    if (this.targetCellName !== null && this.targetCellName !== "") {
        requestBody += "&dc_target=";
        if (dcc.UrlUtils.isUrl(this.targetCellName)) {
            requestBody += this.targetCellName + "/";
        } else {
            requestBody += dcc.UrlUtils.append(this.baseUrl, this.targetCellName) + "/";
        }
    }

    // スキーマ付き認証のためにスキーマ情報を付加する
    /** Add schema information */
    if ((this.schemaUserId !== null && this.schemaUserId !== "") &&
            (this.schemaPassword !== null && this.schemaPassword !== "")) {
        // スキーマ認証
        /** Schema Authentication  */
        var schemaRequestBody = "";
        schemaRequestBody += "grant_type=password&username=";
        schemaRequestBody += this.schemaUserId;
        schemaRequestBody += "&password=";
        schemaRequestBody += this.schemaPassword;
        schemaRequestBody += "&dc_target=";
        schemaRequestBody += authUrl;
        // Urlでない場合は、BaseURLにスキーマ名を足す
        /** If this is not the Url, and add the schema name to BaseURL */
        if (!dcc.UrlUtils.isUrl(this.schema)) {
            this.schema = dcc.UrlUtils.append(this.baseUrl, this.schema);
        }
        this.schema = dcc.UrlUtils.addTrailingSlash(this.schema);

        // Perform Schema Authentication
        httpClient._execute2("POST", dcc.UrlUtils.append(this.schema, "__auth"), {
            body : schemaRequestBody,
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        });
        this.schemaAuth =httpClient.bodyAsJson();
        requestBody += "&client_id=";
        requestBody += this.schema;
        requestBody += "&client_secret=";
        requestBody += this.schemaAuth.access_token;
    }

    //if cookie is set and dc_target is not specified
    if(useCookie !== undefined){
        if(useCookie && (this.targetCellName === null || this.targetCellName === "")){
            requestBody += "&dc_cookie=true";
        }
    }

    if (this.owner) {
        requestBody += "&dc_owner=true";
    }

    // 認証してトークンを保持する
    /** authenticate and hold the token  */
    var requestUrl = dcc.UrlUtils.append(authUrl, "__auth");
    httpClient._execute2("POST", requestUrl, {
        body : requestBody,
        headers: {"Content-Type": "application/x-www-form-urlencoded"}
    });
    var responseJson = httpClient.bodyAsJson();

    if (httpClient.getStatusCode() >= 400){
        //invalid grant - authentication failed
        throw new dcc.ClientException(responseJson.error, httpClient.getStatusCode());
    }
    this.accessToken = responseJson.access_token;
    this.expiresIn = responseJson.expires_in;
    this.refreshToken = responseJson.refresh_token;
    this.refreshExpiresIn = responseJson.refresh_token_expires_in;
    this.tokenType = responseJson.token_type;

    //if dc_cookie_peer value is received in response
    if(responseJson.dc_cookie_peer !== undefined && responseJson.dc_cookie_peer !== "" && responseJson.dc_cookie_peer !== null){
        this.cookiePeer = responseJson.dc_cookie_peer;
    }
};

///**
//* 認証先Cellのburlを作成する.
//* @return {String} 認証先Cellのurl
//* @throws {ClientException} DAO例外
//*/
/**
 * This method creates certification URL.
 * @return {String} Url of authentication destination Cell
 * @throws {dcc.ClientException} DAOexception
 */
dcc.Accessor.prototype.createCertificatUrl = function() {
    var authUrl = "";
    if (dcc.UrlUtils.isUrl(this.cellName)) {
        authUrl = this.cellName;
    } else {
        authUrl = dcc.UrlUtils.append(this.baseUrl, this.cellName);
    }
    return authUrl;
};

///**
//* Cellへのグローバルトークンを取得する.
//* @return トークン
//*/
/**
 * This method returns the global token of the cell.
 * @return {String} global token
 * @deprecated
 */
dcc.Accessor.prototype.loadGlobalToken = function() {
    return "";
};

///**
//* Boxへのローカルトークンを取得する.
//* @return トークン
//*/
/**
 * This method returns the local token of Box.
 * @return {String} local token
 * @deprecated
 */
dcc.Accessor.prototype.loadClientToken = function() {
    return "";
};

/**
 * This method is used for Acquisition of CellUrl.
 * @return {String} cellUrl
 */
dcc.Accessor.prototype.getCellUrl = function() {
    if (dcc.UrlUtils.isUrl(this.cellName)) {
        return this.cellName;
    } else {
        return this.getBaseUrl() + this.cellName + "/";
    }
};

/**
 * @private
 * This method performs no-schema authentication of current user based on token.
 * This is a scenario when authentication is done on same cell & without schema authentication.
 * @param {String} myCellUrl cell URL to be authenticated
 * @param {Boolean} useCookie to check dc_cookie
 * @throws {dcc.ClientException} DAO exception
 */
dcc.Accessor.prototype._obtainAccessTokenFromMyCell = function (myCellUrl , useCookie) {
    //create request options for authentication
    var opts = {};

    if (this.transCellToken !== null  && this.transCellToken !== "") {
        // トランスセルトークン認証
        /** Trans-cell token authentication */
        opts.grant_type = "urn:ietf:params:oauth:grant-type:saml2-bearer";
        opts.assertion = this.transCellToken;
    }else if (this.transCellRefreshToken !== null && this.transCellRefreshToken !== "") {
        // リフレッシュトークン認証
        /** Refresh token authentication */
        opts.grant_type = "refresh_token";
        opts.refresh_token = this.transCellRefreshToken;
    }  else if (this.userId !== null && this.userId !== "") {
        //Password authentication
        opts.grant_type = "password";
        opts.username = this.userId;
        opts.password = this.password;
    }

    //if cookie is set and dc_target is not specified
    if(useCookie === true){
        opts.dc_cookie = "true";
    } else if(useCookie === false){
        opts.dc_cookie = "false";
    }

    if (this.owner) {
        opts.dc_owner = "true";
    }

    //prepare request URL for authentication
    var requestUrl = dcc.UrlUtils.append(myCellUrl, "__auth");

    //execute the request
    var responseJson = this._makeAccessTokenRequest(requestUrl, opts);
    this.accessToken = responseJson.access_token;
    this.expiresIn = responseJson.expires_in;
    this.refreshToken = responseJson.refresh_token;
    this.refreshExpiresIn = responseJson.refresh_token_expires_in;
    this.tokenType = responseJson.token_type;
    //if dc_cookie_peer value is received in response
    if(responseJson.dc_cookie_peer !== undefined && responseJson.dc_cookie_peer !== "" && responseJson.dc_cookie_peer !== null){
        this.cookiePeer = responseJson.dc_cookie_peer;
    }
};

/**
 * @private
 * This method performs schema authentication of current user based on token.
 * This is a scenario when authentication is done on same cell with schema authentication.
 * @param {String} myCellUrl cell URL to be authenticated
 * @param {Boolean} useCookie to check dc_cookie
 * @throws {dcc.ClientException} DAO exception
 */
dcc.Accessor.prototype._obtainAccessTokenFromMyCellWithSchema = function (myCellUrl , useCookie) {
    //create request options for authentication
    var opts = {};
    if (this.transCellToken !== null  && this.transCellToken !== "") {
        // トランスセルトークン認証
        /** Trans-cell token authentication */
        opts.grant_type = "urn:ietf:params:oauth:grant-type:saml2-bearer";
        opts.assertion = this.transCellToken;
    }else if (this.transCellRefreshToken !== null && this.transCellRefreshToken !== "") {
        // リフレッシュトークン認証
        /** Refresh token authentication */
        opts.grant_type = "refresh_token";
        opts.refresh_token = this.transCellRefreshToken;
    }  else if (this.userId !== null && this.userId !== "") {
        //Password authentication
        opts.grant_type = "password";
        opts.username = this.userId;
        opts.password = this.password;
    }

//  スキーマ付き認証のためにスキーマ情報を付加する
    /** Add schema information */
    if ((this.schemaUserId !== null && this.schemaUserId !== "") &&
            (this.schemaPassword !== null && this.schemaPassword !== "")) {
        var schemaOpts = {};
        // スキーマ認証
        /** Schema Authentication  */
        schemaOpts.grant_type = "password";
        schemaOpts.username = this.schemaUserId;
        schemaOpts.password = this.schemaPassword;
        schemaOpts.dc_target = myCellUrl;

        // Urlでない場合は、BaseURLにスキーマ名を足す
        /** If this is not the URL, and add the schema name to BaseURL */
        if (!dcc.UrlUtils.isUrl(this.schema)) {
            this.schema = dcc.UrlUtils.append(this.baseUrl, this.schema);
        }
        this.schema = dcc.UrlUtils.addTrailingSlash(this.schema);

        // Perform Schema Authentication
        this.schemaAuth =this._makeAccessTokenRequest(dcc.UrlUtils.append(this.schema, "__auth"), schemaOpts);
        opts.client_id = this.schema;
        opts.client_secret = this.schemaAuth.access_token;
    }
    //if cookie is set and dc_target is not specified
    if(useCookie === true){
        opts.dc_cookie = "true";
    } else if(useCookie === false){
        opts.dc_cookie = "false";
    }

    if (this.owner) {
        opts.dc_owner = "true";
    }
    //prepare request URL for authentication
    var requestUrl = dcc.UrlUtils.append(myCellUrl, "__auth");
    //execute the request
    var responseJson = this._makeAccessTokenRequest(requestUrl, opts);
    this.accessToken = responseJson.access_token;
    this.expiresIn = responseJson.expires_in;
    this.refreshToken = responseJson.refresh_token;
    this.refreshExpiresIn = responseJson.refresh_token_expires_in;
    this.tokenType = responseJson.token_type;
    //if dc_cookie_peer value is received in response
    if(responseJson.dc_cookie_peer !== undefined && responseJson.dc_cookie_peer !== "" && responseJson.dc_cookie_peer !== null){
        this.cookiePeer = responseJson.dc_cookie_peer;
    }
};

/**
 * @private
 * This method performs no-schema authentication of current user based on token.
 * This is a scenario when authentication is done on external cell & without schema authentication.
 * @param {String} myCellUrl
 * @param {String} targetCellUrl
 * @param {Boolean} useCookie to check dc_cookie
 * @throws {dcc.ClientException} DAO exception
 */
dcc.Accessor.prototype._obtainAccessTokenFromExtCell = function (myCellUrl, targetCellUrl, useCookie) {
    if (this.accessType === "token") {
        return;
    }
    //create request options for authentication
    var opts = {};
    if (this.transCellToken !== null  && this.transCellToken !== "") {
        // トランスセルトークン認証
        /** Trans-cell token authentication */
        opts.grant_type = "urn:ietf:params:oauth:grant-type:saml2-bearer";
        opts.assertion = this.transCellToken;
    }else if (this.transCellRefreshToken !== null && this.transCellRefreshToken !== "") {
        // リフレッシュトークン認証
        /** Refresh token authentication */
        opts.grant_type = "refresh_token";
        opts.refresh_token = this.transCellRefreshToken;
    }
    if (this.userId !== null && this.userId !== "") {
        //Password authentication
        opts.grant_type = "password";
        opts.username = this.userId;
        opts.password = this.password;
    }

    if (this.targetCellName !== null && this.targetCellName !== "") {
        opts.dc_target = targetCellUrl;
    }

    //prepare request url
    var requestUrl = dcc.UrlUtils.append(myCellUrl, "__auth");

    //execute the request
    var responseJson = this._makeAccessTokenRequest(requestUrl, opts);
    this.accessToken = responseJson.access_token;
    this.refreshToken = responseJson.refresh_token;
    this.refreshExpiresIn = responseJson.refresh_token_expires_in;
    this.tokenType = responseJson.token_type;
    //if dc_cookie_peer value is received in response
    if(responseJson.dc_cookie_peer !== undefined && responseJson.dc_cookie_peer !== "" && responseJson.dc_cookie_peer !== null){
        this.cookiePeer = responseJson.dc_cookie_peer;
    }

    //TCAT should be thrown for the request to change the AT, re-instantiate opts for second request
    opts = {};
    opts.grant_type = "urn:ietf:params:oauth:grant-type:saml2-bearer";
    //access token from last request
    opts.assertion = this.accessToken;
    //request URL refers to targetCell
    requestUrl = dcc.UrlUtils.append(targetCellUrl, "__auth");
    if(useCookie === true){
        opts.dc_cookie = "true";
    } else if(useCookie === false){
        opts.dc_cookie = "false";
    }
    //if cookie is set and dc_target is not specified
    if (this.owner) {
        opts.dc_owner = "true";
    }
    //execute the request
    responseJson = this._makeAccessTokenRequest(requestUrl, opts);
    this.accessToken = responseJson.access_token;
    this.refreshToken = responseJson.refresh_token;
    this.expiresIn = responseJson.expires_in;
    this.refreshExpiresIn = responseJson.refresh_token_expires_in;
    this.tokenType = responseJson.token_type;
    //if dc_cookie_peer value is received in response
    if(responseJson.dc_cookie_peer !== undefined && responseJson.dc_cookie_peer !== "" && responseJson.dc_cookie_peer !== null){
        this.cookiePeer = responseJson.dc_cookie_peer;
    }
};

/**
 * @private
 * This method performs schema authentication of current user based on token.
 * This is a scenario when authentication is done with schema authentication on same cell.
 * @param {String} myCellUrl
 * @param {String} targetCellUrl
 * @param {Boolean} useCookie to check dc_cookie
 * @throws {dcc.ClientException} DAO exception
 */
dcc.Accessor.prototype._obtainAccessTokenFromExtCellWithSchema = function (myCellUrl ,targetCellUrl, useCookie) { if (this.accessType === "token") {
    return;
}
//create request options for authentication
var opts = {};

/** Create request body for authentication */
if (this.transCellToken !== null  && this.transCellToken !== "") {
    // トランスセルトークン認証
    /** Trans-cell token authentication */
    opts.grant_type = "urn:ietf:params:oauth:grant-type:saml2-bearer";
    opts.assertion = this.transCellToken;
}else if (this.transCellRefreshToken !== null && this.transCellRefreshToken !== "") {
    // リフレッシュトークン認証 ,  Refresh token authentication
    opts.grant_type = "refresh_token";
    opts.refresh_token = this.transCellRefreshToken;
}
if (this.userId !== null && this.userId !== "") {
    //Password authentication
    opts.grant_type = "password";
    opts.username = this.userId;
    opts.password = this.password;
}

//targetのURLを作る , create target URL
if (this.targetCellName !== null && this.targetCellName !== "") {
    opts.dc_target = targetCellUrl;
}
//スキーマ付き認証のためにスキーマ情報を付加する
/** Add schema information */
if ((this.schemaUserId !== null && this.schemaUserId !== "") &&
        (this.schemaPassword !== null && this.schemaPassword !== "")) {
    // スキーマ認証
    /** Schema Authentication  */
    var schemaOpts = {};
    schemaOpts.grant_type = "password";
    schemaOpts.username = this.schemaUserId;
    schemaOpts.password = this.schemaPassword;
    schemaOpts.dc_target = targetCellUrl;
    // Urlでない場合は、BaseURLにスキーマ名を足す
    /** If this is not the Url, and add the schema name to BaseURL */
    if (!dcc.UrlUtils.isUrl(this.schema)) {
        this.schema = dcc.UrlUtils.append(this.baseUrl, this.schema);
    }
    this.schema = dcc.UrlUtils.addTrailingSlash(this.schema);

    // Perform Schema Authentication
    this.schemaAuth =this._makeAccessTokenRequest(dcc.UrlUtils.append(this.schema, "__auth"), schemaOpts);
}

//prepare request url
var requestUrl = dcc.UrlUtils.append(myCellUrl, "__auth");
//execute the request
var responseJson = this._makeAccessTokenRequest(requestUrl, opts);
this.accessToken = responseJson.access_token;


requestUrl = dcc.UrlUtils.append(targetCellUrl, "__auth");
opts = {};
opts.grant_type = "urn:ietf:params:oauth:grant-type:saml2-bearer";
opts.assertion = this.accessToken;
opts.client_id = this.schema;
opts.client_secret = this.schemaAuth.access_token;
//if cookie is set
if(useCookie === true){
    opts.dc_cookie = "true";
} else if(useCookie === false){
    opts.dc_cookie = "false";
}
if (this.owner) {
    opts.dc_owner = "true";
}
responseJson = this._makeAccessTokenRequest(requestUrl, opts);
this.accessToken = responseJson.access_token;
this.expiresIn = responseJson.expires_in;
this.refreshToken = responseJson.refresh_token;
this.refreshExpiresIn = responseJson.refresh_token_expires_in;
this.tokenType = responseJson.token_type;
//if dc_cookie_peer value is received in response
if(responseJson.dc_cookie_peer !== undefined && responseJson.dc_cookie_peer !== "" && responseJson.dc_cookie_peer !== null){
    this.cookiePeer = responseJson.dc_cookie_peer;
}
};

/**
 * @private
 * This is a common method responsible for executing authentication request from _obtainAccessTokenFromMyCell, _obtainAccessTokenFromExtCell
 * _obtainAccessTokenFromMyCellWithSchema,_obtainAccessTokenFromExtCellWithSchema.
 * @param {String} cellUrl
 * @param {Object} opts optional parameters
 * @return {Object} responseJSON json response of auth call.
 * @throws {dcc.ClientException} DAO exception
 */
dcc.Accessor.prototype._makeAccessTokenRequest = function (cellUrl , opts) {
    var formatedRequestBody  = dcc.UrlUtils.jsonToW3Form(opts);
    var httpClient = new dcc.http.DcHttpClient(false);

    //Creation of request headers
    //Setting requestheader's value to builder instance.
    var builder = new dcc.http.DcRequestHeaderBuilder();
    builder.contentTypeHeaderValue = "application/x-www-form-urlencoded";
    builder.defaultHeaders(this.getDefaultHeaders());

    //incorporate request header in builder
    builder.build(httpClient);
    httpClient._execute2("POST", cellUrl, {
        body : formatedRequestBody
    });
    var responseJson = httpClient.bodyAsJson();
    if (httpClient.getStatusCode() >= 400){
        //invalid grant - authentication failed
        throw new dcc.ClientException(responseJson.error, httpClient.getStatusCode());
    }
    return responseJson;
};

/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class Accountのアクセスクラス.
//* @constructor
//* @augments dcc.AbstractODataContext
//*/
/**
 * It creates a new object dcc.cellctl.Account.
 * @class This class creates an Account as cell control object.
 * @constructor
 * @augments dcc.AbstractODataContext
 * @param {dcc.Accessor} Accessor
 * @param {Object} body
 */
dcc.cellctl.Account = function(as, body) {
  this.initializeProperties(this, as, body);
};
dcc.DcClass.extend(dcc.cellctl.Account, dcc.AbstractODataContext);

///**
//* プロパティを初期化する.
//* @param {dcc.cellctl.Account} self
//* @param {dcc.Accessor} as アクセス主体
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.cellctl.Account} self
 * @param {dcc.Accessor} as accessor
 * @param {Object} json object
 */
dcc.cellctl.Account.prototype.initializeProperties = function(self, as, json) {
  this.uber = dcc.AbstractODataContext.prototype;
  this.uber.initializeProperties(self, as);

///** クラス名. */
  /** Class name. */
  self.CLASSNAME = "Account";

  if (json !== undefined && json !== null) {
    self.rawData = json;
//  /** Account名. */
    /** account name. */
    self.name = json.Name;
  }
  if (typeof self.name === "undefined") {
    self.name = "";
  }
///** パスワード.オブジェクト渡しでAccountを作成する時にだけ利用できる.その後は削除する. */
  /** It is available only when you create the Account. */
  self.setPassword("");
};

///**
//* Account名の設定.
//* @param {String} value
//*/
/**
 * This method sets the account name.
 * @param {String} value
 */
dcc.cellctl.Account.prototype.setName = function(value) {
  this.name = value;
};

///**
//* Account名の取得.
//* @return {String} Account名
//*/
/**
 * This method gets the account name.
 * @return {String} Account name
 */
dcc.cellctl.Account.prototype.getName = function() {
  return this.name;
};

///**
//* パスワードの設定.
//* @param {String} value パスワード文字列
//*/
/**
 * This method sets the password.
 * @param {String} value password
 */
dcc.cellctl.Account.prototype.setPassword = function(value) {
  this.password = value;
};

///**
//* パスワードの取得.
//* @return {String} パスワード文字列
//*/
/**
 * This method gets the password.
 * @return {String} password value
 */
dcc.cellctl.Account.prototype.getPassword = function() {
  return this.password;
};

///**
//* ODataのキーを取得する.
//* @return {String} ODataのキー情報
//*/
/**
 * This method gets the Odata key.
 * @return {String} OData key information
 */
dcc.cellctl.Account.prototype.getKey = function() {
  return "('" + this.name + "')";
};

///**
//* クラス名をキャメル型で取得する.
//* @return {?} ODataのキー情報
//*/
/**
 * This method gets the class name.
 * @return {String} OData class name
 */
dcc.cellctl.Account.prototype.getClassName = function() {
  return this.CLASSNAME;
};


/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class AccountのCRUDを行うためのクラス.
//* @constructor
//* @augments dcc.box.odata.ODataManager
//* @property {Object} uber スーパークラスのプロトタイプへの参照.
//*/
/**
 * It creates a new object dcc.cellctl.AccountManager.
 * @class This class is used for performing CRUD operations of Account.
 * @constructor
 * @augments dcc.box.odata.ODataManager
 * @property {Object} uber A reference to the prototype of the superclass.
 * @param {dcc.Accessor} Accessor
 */
dcc.cellctl.AccountManager = function(as) {
  this.initializeProperties(this, as);
};
dcc.DcClass.extend(dcc.cellctl.AccountManager, dcc.box.odata.ODataManager);

///**
//* プロパティを初期化する.
//* @param {dcc.cellctl.AccountManager} self
//* @param {dcc.Accessor} as アクセス主体
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.cellctl.AccountManager} self
 * @param {dcc.Accessor} as accessor
 */
dcc.cellctl.AccountManager.prototype.initializeProperties = function(self, as) {
  this.uber = dcc.box.odata.ODataManager.prototype;
  this.uber.initializeProperties(self, as);

///**
//* パスワード用ヘッダーキー.
//*/
  /** Password for header key. */
  self.HEADER_KEY_CREDENTIAL = "X-Dc-Credential";
};

/**
 * This method returns the URL.
 * @returns {String} URL
 */
dcc.cellctl.AccountManager.prototype.getUrl = function() {
  var sb = "";
  sb += this.getBaseUrl();
  sb += this.accessor.cellName;
  // sb += this.accessor.getCurrentCell().getName();
  sb += "/__ctl/Account";
  return sb;
};

///**
//* Accountを作成.
//* @param {dcc.cellctl.Account} obj Accountオブジェクト
//* @param {?} password パスワード
//* @return {dcc.cellctl.Account} Accountオブジェクト
//* @throws {ClientException} DAO例外
//*/
/**
 * This method creates an account.
 * @param {dcc.cellctl.Account} obj Account object
 * @param {String} password password
 * @param {Object} options object
 * @return {dcc.cellctl.Account} Account object
 * @throws {dcc.ClientException} DAO exception
 */
dcc.cellctl.AccountManager.prototype.create = function(obj, password, options) {
  var json = null;
  var headers = {};
  var responseJson = null;
  var requestBody = JSON.stringify(obj);
  if (obj.getClassName !== undefined && obj.getClassName() === "Account") {
    var body = {};
    body.Name = obj.getName();
    headers[this.HEADER_KEY_CREDENTIAL] = password;// obj.getPassword();
    json = this._internalCreate(JSON.stringify(body), headers,options);
    responseJson = json.bodyAsJson().d.results;
    obj.initializeProperties(obj, this.accessor, responseJson);
    return obj;
  } else {
    if (password !== null) {
      headers[this.HEADER_KEY_CREDENTIAL] = password;
    }
    var callbackExist = options !== undefined &&
    (options.success !== undefined ||
        options.error !== undefined ||
        options.complete !== undefined);
    if (callbackExist) {
      this._internalCreate(requestBody,headers,options);
    }
    else {
      json = this._internalCreate(requestBody, headers);
      /*      if(json.getStatusCode() >= 400){
        var response = json.bodyAsJson();//throw exception with code
        throw new dcc.ClientException(response.message.value, response.code);
      }*/
      responseJson = json.bodyAsJson().d.results;
      return new dcc.cellctl.Account(this.accessor, responseJson);
    }
  }
};

/*function accountRefresh() {
	var contextRoot = sessionStorage.contextRoot;
	$("#mainContent").html('');
	$("#mainContent").load(contextRoot+'/htmls/accountListView.html', function() {
		if (navigator.userAgent.indexOf("Firefox") != -1) {
			loadAccountPage();
		}
	});
}
 */
///**
//* Accountを取得.
//* @param {String} name 取得対象のAccount名
//* @return {dcc.cellctl.Account} 取得したしたAccountオブジェクト
//* @throws ClientException DAO例外
//*/
/**
 * This method fetches the account information.
 * @param {String} name account name
 * @param {Object} options object has callback and headers
 * @return {dcc.cellctl.Account} Account objecct
 * @throws {dcc.ClientException} DAO exception
 */
dcc.cellctl.AccountManager.prototype.retrieve = function(name, options) {
  /*valid option is present with atleast one callback*/
  var callbackExist = options !== undefined &&
  (options.success !== undefined ||
      options.error !== undefined ||
      options.complete !== undefined);

  if (callbackExist) {
    this._internalRetrieve(name, options);
    return;
  }
  var json = this._internalRetrieve(name);
  //if (json === true) {
  //return true;
  //}
  //else {
  // returns response in JSON format.
  return new dcc.cellctl.Account(this.accessor, json);
  //}
};

///**
//* Passwordを変更.
//* @param {String} name Accountの名前
//* @param {String} password Accountパスワード
//* @throws ClientException DAO例外
//*/
/**
 * This method changes the account password.
 * @param {String} name Account
 * @param {String} password Account
 * @param {Object} options object optional containing callback, headers
 * @throws {dcc.ClientException} DAO exception
 */
dcc.cellctl.AccountManager.prototype.changePassword = function(name, password, options) {
  var headers = {};
  headers[this.HEADER_KEY_CREDENTIAL] = password;
  var body = {};
  body.Name = name;
  this._internalUpdate(name, body, "*", headers, options);
};

///**
//* Delete the account.
//* @param {String} accountName account name
//* @return promise
//* @throws ClientException DAO例外
//*/
/**
 * Delete the account.
 * @param {String} accountName account name
 * @param {String} etagOrOptions ETag value or options object having callback and headers
 * @return {Object} response
 * @throws {dcc.ClientException} DAO exception
 */
dcc.cellctl.AccountManager.prototype.del = function(accountName, etagOrOptions) {
  var key = "Name='" + accountName + "'";
  var response = this._internalDelMultiKey(key, etagOrOptions);
  return response;
};

/**
 * The purpose of this method is to retrieve get etag on the basis of account name.
 * @param {String} name
 * @returns {String} etag
 */
dcc.cellctl.AccountManager.prototype.getEtag = function(name) {
  var json = this._internalRetrieve(name);
  return json.__metadata.etag;
};


/**
 * The purpose of this method is to perform update operation or an account.
 * @param {String} accountName
 * @param {Object} body
 * @param {String} etag
 * @param {String} password
 * @param {Object} options object optional containing callback, headers
 * @return {dcc.box.odata.ODataResponse} response
 */
dcc.cellctl.AccountManager.prototype.update = function(accountName, body, etag, password, options) {
  var response = "";
  var headers = {};
  if (password !== "" && password !== undefined && password !== null) {
    headers[this.HEADER_KEY_CREDENTIAL] = password;
    response = this._internalUpdate(accountName, body, etag, headers, options);
  }
  else {
    response = this._internalUpdate(accountName, body, etag, headers, options);
  }
  return response;
};


/**
 * Copyright 2012 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

/**
 * Principal Interface http://tools.ietf.org/html/rfc3744#section-5.5.1.
 * @class Represents Principal.
 */
dcc.cellctl.Principal = function() {
};

/**
 * constant expressing DAV:all pseudo-principal.
 * @const
 * @type {String}
 */
dcc.cellctl.Principal.ALL = "all";


/*
 * Copyright 2012 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

/**
 * It creates a new object dcc.Ace.
 * @class class representing Ace (Access Control Element) in WebDAV ACL implemented in PCS.
 * @constructor
 */
dcc.Ace = function() {
  this.initializeProperties(this);
};

///**
//* プロパティを初期化する.
//* @param {dcc.Ace} self
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.Ace} self
 */
dcc.Ace.prototype.initializeProperties = function(self) {
  /** Granted Privileges List for this Ace. */
  self.privilegeList = [];
  /** Role Name. @deprecated */
  self.roleName = null;
  /** Target Principal . */
  self.principal = null;
};

/**
 * Get Principal of this Ace in the form of Role.
 * @return {dcc.cellctl.Principal} Principal
 * @deprecated Use getPrincipal()
 */
dcc.Ace.prototype.getRole = function() {
  return this.principal;
};

/**
 * Set the Principal (typically a role) of this Ace in the form of Role.
 * @param {dcc.cellctl.Role} obj Role object
 * @deprecated Use setPrincipal(principal)
 */
dcc.Ace.prototype.setRole = function(obj) {
  this.setPrincipal(obj);
};

/**
 * Get the Role Name.
 * @return {String} Role Name
 * @deprecated
 */
dcc.Ace.prototype.getRoleName = function() {
  if (this.principal !== null) {
    return this.principal.getName();
  } else {
    return this.roleName;
  }
};

/**
 * Get the _Box.Name value of the Role for this Ace.
 * @return {String} the _Box.Name value of the Role
 * @deprecated
 */
dcc.Ace.prototype.getBoxName = function() {
  if (this.principal !== null) {
    return this.principal.getBoxName();
  } else {
    return "";
  }
};

/**
 * Set Role Name.
 * @param {String} value Role Name
 * @deprecated
 */
dcc.Ace.prototype.setRoleName = function(value) {
  this.roleName = value;
};

/**
 * Add a privilege.
 * @param {String} value privilege name
 */
dcc.Ace.prototype.addPrivilege = function(value) {
  this.privilegeList.push(value);
};

/**
 * Gives the privilege list.
 * @return {Array.<String>} list of privileges
 */
dcc.Ace.prototype.getPrivilegeList = function() {
  return this.privilegeList;
};

/**
 * Set the Principal (typically a role or string value ALL) for this Ace.
 * @param {dcc.cellctl.Principal} principal
 */
dcc.Ace.prototype.setPrincipal = function(principal){
  this.principal = principal;
};

/**
 * Get the Principal (typically a role or string value ALL) of this Ace.
 * @returns {dcc.cellctl.Principal.principalType}
 */
dcc.Ace.prototype.getPrincipal = function(){
  return this.principal;
};
/*
 * Copyright 2012 Fujitsu Limited all rights reserved.
 */
/*global dcc:false,window:false,DOMParser:false */

///**
//* @class Aceのアクセスクラス.
//* @constructor
//*/
/**
 * It creates a new object dcc.Acl.
 * @class Acl class for setting access control information.
 * @constructor
 */
dcc.Acl = function() {
    this.initializeProperties(this);
};

///**
//* プロパティを初期化する.
//* @param {dcc.Acl} self
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.Acl} self
 */
dcc.Acl.prototype.initializeProperties = function(self) {
    /** ACE. */
    self.aceList = [];
//  /** base属性値. */
    /** Base URL. */
    self.roleBaseUrl = null;
//  /** requireSchemaAuthz属性値. */
    /** requireSchemaAuthz attribute value. */
    self.requireSchemaAuthz = null;
};

///**
//* base属性値を設定.
//* @param {String} value base属性値
//*/
/**
 * This method sets the base attribute value.
 * @param {String} value base URL
 */
dcc.Acl.prototype.setBase = function(value) {
    this.roleBaseUrl = value;
};

///**
//* base属性値を取得.
//* @return {String} base属性値
//*/
/**
 * This method gets the base attribute value.
 * @return {String} base URL
 */
dcc.Acl.prototype.getBase = function() {
    return this.roleBaseUrl;
};

///**
//* requireSchemaAuthz属性値を設定.
//* @param {String} value requireSchemaAuthz属性値
//*/
/**
 * This method sets the requireSchemaAuthz attribute value.
 * @param {String} value requireSchemaAuthz attribute value
 */
dcc.Acl.prototype.setRequireSchemaAuthz = function(value) {
    this.requireSchemaAuthz = value;
};

///**
//* requireSchemaAuthz属性値を取得.
//* @return {String} requireSchemaAuthz属性値
//*/
/**
 * This method gets the requireSchemaAuthz attribute value.
 * @return {String} requireSchemaAuthz attribute value
 */
dcc.Acl.prototype.getRequireSchemaAuthz = function() {
    return this.requireSchemaAuthz;
};

///**
//* ACEを追加.
//* @param {String} value ACEオブジェクト
//*/
/**
 * This method adds the Ace object in the list.
 * @param {String} value ACE object
 */
dcc.Acl.prototype.addAce = function(value) {
    this.aceList.push(value);
};

///**
//* Aceオブジェクトの一覧を返却.
//* @return {dcc.Ace} Aceオブジェクト一覧
//*/
/**
 * This method fetches the Ace object from the list.
 * @return {dcc.Ace} Ace object
 */
dcc.Acl.prototype.getAceList = function() {
    return this.aceList;
};

///**
//* XML形式の文字列としてACL情報を取得する.
//* @return {String} XML文字列
//* @throws {ClientException} DAO例外
//*/
/**
 * This methods gets the ACL information as a string of XML format.
 * @return {String} XML string
 * @throws {dcc.ClientException} DAO exception
 */
//public String toXmlString() throws ClientException {
dcc.Acl.prototype.toXmlString = function() {
    var arr = [];

    var roleBaseUrlStr = this.roleBaseUrl;
    var baseRoleBoxName = "";
    var schemaAuth = this.getRequireSchemaAuthz();
    // if roleBaseUrl is not specified, then infer it
    // from the Ace Roles.Also infer baseRoleBoxName.
    if (roleBaseUrlStr === null) {
        if ((this.aceList.length > 0) && (this.aceList[0] !== null)) {
            var baseRole = this.aceList[0].getRole();
            if (baseRole === null) {
                roleBaseUrlStr = "";
                baseRoleBoxName = "";
            } else {
                roleBaseUrlStr = baseRole.getResourceBaseUrl();
                baseRoleBoxName = baseRole.getBoxName();
            }
        } else {
            roleBaseUrlStr = "";
            baseRoleBoxName = "";
        }
    }

    // root element created
    arr.push("<?xml version=\"1.0\" encoding=\"utf-8\" ?>");
    if(!schemaAuth){
        schemaAuth = "none";
    }
    arr.push("<D:acl xmlns:D=\"DAV:\" xmlns:dc=\"urn:x-dc1:xmlns\"  dc:requireSchemaAuthz=\""+ schemaAuth +"\" xml:base=\"");
    arr.push(roleBaseUrlStr);
    arr.push("\">");

    // ace element
    for ( var i = 0; i < this.aceList.length; i++) {
        var ace = this.aceList[i];
        arr.push("<D:ace>");

        // acl/ace/principal
        arr.push("<D:principal>");
        // if (dcc.cellctl.Principal !== undefined) {
        if (dcc.cellctl.Principal !== undefined && ace.getPrincipal() === dcc.cellctl.Principal.ALL) {
            // acl/ace/principal/all
            arr.push("<D:all>");
            arr.push("</D:all>");
        }
        // }
        else {
            // acl/ace/principal/href
            arr.push("<D:href>");
            var hrefStr = "";
            var aceRoleName = ace.getRoleName();
            var aceRoleBoxName = ace.getBoxName();

            if (aceRoleBoxName === null) {
                if (baseRoleBoxName !== null) {
                    hrefStr = "../__/" + aceRoleName;
                } else {
                    hrefStr = aceRoleName;
                }
            } else {
                if (aceRoleBoxName === baseRoleBoxName) {
                    hrefStr = aceRoleName;
                } else {
                    hrefStr = "../" + aceRoleBoxName + "/" + aceRoleName;
                }
            }
            arr.push(hrefStr);
            arr.push("</D:href>");
        }
        arr.push("</D:principal>");

        // acl/ace/grant
        arr.push("<D:grant>");

        var privilegeList = ace.getPrivilegeList();
        for ( var j = 0; j < privilegeList.length; j++) {
            var privilege = privilegeList[j];

            // acl/ace/grant/privilege
            arr.push("<D:privilege>");
            arr.push("<D:" + privilege + "/>");
            arr.push("</D:privilege>");
        }
        arr.push("</D:grant>");
        arr.push("</D:ace>");
    }
    arr.push("</D:acl>");
    var xml = arr.join("");
    return xml;

    //    // XML DOM 初期設定
    //    String nsD = "DAV:";
    //    String roleBaseUrlStr = this.roleBaseUrl;
    //    String nsDefault = "http://www.w3.org/XML/1998/namespace";
    //
    //    String baseRoleBoxName = "";
    //    if (roleBaseUrlStr == null) {
    //        Role baseRole = aceList.get(0).getRole();
    //        if (baseRole == null) {
    //            return "";
    //        }
    //
    //        roleBaseUrlStr = baseRole.getResourceBaseUrl();
    //        baseRoleBoxName = baseRole.getBoxName();
    //    }
    //
    //    DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
    //    factory.setNamespaceAware(true);
    //    DocumentBuilder builder;
    //    try {
    //        builder = factory.newDocumentBuilder();
    //    } catch (ParserConfigurationException e1) {
    //        throw new ClientException(e1.getMessage(), e1);
    //    }
    //    DOMImplementation domImpl = builder.getDOMImplementation();
    //    Document document = domImpl.createDocument(nsD, "D:acl", null);
    //
    //    // root 要素作成
    //    Element acl = document.getDocumentElement();
    //    Attr attrBase = document.createAttributeNS(nsDefault, "xml:base");
    //    attrBase.setValue(roleBaseUrlStr);
    //    acl.setAttributeNodeNS(attrBase);
    //    Attr attrRequireSchemaAuthz = document.createAttributeNS("urn:x-dc1:xmlns", "dc:requireSchemaAuthz");
    //    attrRequireSchemaAuthz.setValue(requireSchemaAuthz);
    //    acl.setAttributeNodeNS(attrRequireSchemaAuthz);
    //
    //    // ace要素
    //    for (Ace ace : aceList) {
    //        Element elmAce = document.createElementNS(nsD, "D:ace");
    //        acl.appendChild(elmAce);
    //
    //        // acl/ace/principal
    //        Element elmPrincipal = document.createElementNS(nsD, "D:principal");
    //        elmAce.appendChild(elmPrincipal);
    //
    //        // acl/ace/principal/href
    //        Element elmHref = document.createElementNS(nsD, "D:href");
    //        elmPrincipal.appendChild(elmHref);
    //
    //        String hrefStr = "";
    //
    //        // Role aceRole = ace.getRole();
    //        String aceRoleName = ace.getRoleName();
    //        String aceRoleBoxName = ace.getBoxName();
    //
    //        if (aceRoleBoxName == null) {
    //            if (baseRoleBoxName != null) {
    //                hrefStr = "../__/" + aceRoleName;
    //            } else {
    //                hrefStr = aceRoleName;
    //            }
    //        } else {
    //            if (aceRoleBoxName.equals(baseRoleBoxName)) {
    //                hrefStr = aceRoleName;
    //            } else {
    //                hrefStr = "../" + aceRoleBoxName + "/" + aceRoleName;
    //            }
    //        }
    //        Text text = document.createTextNode(hrefStr);
    //        elmHref.appendChild(text);
    //
    //        // acl/ace/grant
    //        Element elmGrant = document.createElementNS(nsD, "D:grant");
    //        elmAce.appendChild(elmGrant);
    //
    //        for (String privilege : ace.getPrivilegeList()) {
    //
    //            // acl/ace/grant/privilege
    //            Element elmPrivilege = document.createElementNS(nsD, "D:privilege");
    //            elmGrant.appendChild(elmPrivilege);
    //
    //            // 各権限
    //            Element elm = document.createElementNS(nsD, "D:" + privilege);
    //            elmPrivilege.appendChild(elm);
    //        }
    //    }
    //
    //    // XML を 文字列化する
    //    StringWriter sw = new StringWriter();
    //    TransformerFactory tfactory = TransformerFactory.newInstance();
    //    Transformer transformer = null;
    //    try {
    //        transformer = tfactory.newTransformer();
    //    } catch (TransformerConfigurationException e) {
    //        throw new RuntimeException(e);
    //    }
    //    try {
    //        if (transformer != null) {
    //            transformer.transform(new DOMSource(acl), new StreamResult(sw));
    //        }
    //    } catch (TransformerException e) {
    //        throw new RuntimeException(e);
    //    }
    //    return sw.toString();
};

/**
 * Parse the WebDAV ACL XML String and generate Acl object.
 * @param {String} xmlStr representation of WebDAV ACL XML
 * @returns {dcc.Acl} Acl class instance
 * @throws {dcc.ClientException} ClientException
 */
dcc.Acl.prototype.parse = function(xmlStr) {
    var grant = "";
    var privilegeNodeList = "";
    var roleName = null;
    var privilege = null;
    var xmlDoc = null;

    // Converting the XML String to XML document through DOMParser
    if (window.DOMParser) {
        var parser = new DOMParser();
        xmlDoc = parser.parseFromString(xmlStr, "text/xml");
    }
    var objAcl = new dcc.Acl();
    if (xmlDoc === null || xmlDoc === undefined) {
        throw new dcc.ClientException("DOM Parser is unavailable");
    }
    var nl = xmlDoc.getElementsByTagName("response");
    var elm = nl[0];
    /** base and requireSchemaAuthz are not fetched since they were not set while creating the xml and are therefore unavailable*/
    // var acl = elm.getElementsByTagName("acl");
    // Get Ace list
    var ace = elm.getElementsByTagName("ace");
    var objAce = "";
    for ( var aceCount = 0; aceCount < ace.length; aceCount++) {

        // Ace object creation
        objAce = new dcc.Ace();
        objAcl.addAce(objAce);
        if (ace[aceCount].firstElementChild !== null) {
            if (ace[aceCount].firstElementChild.childNodes[1] === "all") {
                objAce.setPrincipal(dcc.cellctl.Principal.ALL);
            } else {

                // Get Role name (href attribute value), and sets the object Ace
                // The principal is a Role.
                roleName = ace[aceCount].firstElementChild.childNodes[1].firstChild.data;
                var objRole = new dcc.cellctl.Role();
                objRole.setName(roleName);
                objAce.setPrincipal(objRole);
            }

            // Privilege element
            grant = ace[aceCount].lastElementChild;
            privilegeNodeList = grant.childNodes;
            for ( var prvNodeCount = 0; prvNodeCount < privilegeNodeList.length - 1; prvNodeCount = prvNodeCount + 2) {

                // set to Ace object privilege value as the element name of the child element of the privilege element
                privilege = privilegeNodeList[prvNodeCount + 1].firstElementChild.nodeName;
                objAce.addPrivilege(privilege);
            }
        }
    }
    return objAcl;
};

///**
//* XML文字列からAcl/Aceオブジェクトを生成する.
//* @param {String} xmlStr XML文字列
//* @return {jACL} Aclオブジェクト
//*/
//public static Acl parse(String xmlStr) {
//dcc.Acl.prototype.parse = function(xmlStr) {
//String nsD = "DAV:";
//String roleBaseUrl = "";
//String requireSchemaAuthz = "";
//String nsDefault = "http://www.w3.org/XML/1998/namespace";
//DocumentBuilder builder = null;
//DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
//factory.setNamespaceAware(true);
//try {
//builder = factory.newDocumentBuilder();
//} catch (ParserConfigurationException e) {
//throw new RuntimeException(e);
//}
//Document document = null;
//InputStream is = new ByteArrayInputStream(xmlStr.getBytes());
//try {
//if (builder != null) {
//document = builder.parse(is);
//}
//} catch (SAXException e) {
//throw new RuntimeException(e);
//} catch (IOException e) {
//throw new RuntimeException(e);
//}

//Acl acl = new Acl();
//if (document != null) {
////Root要素取得
//Element elmAcl = (Element) document.getElementsByTagNameNS(nsD, "acl").item(0);
////Base属性値を取得し、Aclオブジェクトにセット
//roleBaseUrl = elmAcl.getAttributeNS(nsDefault, "base");
//acl.setBase(roleBaseUrl);

////requireSchemaAuthz属性値を取得し、Aclオブジェクトにセット
//requireSchemaAuthz = elmAcl.getAttributeNS("urn:x-dc1:xmlns", "requireSchemaAuthz");
//acl.setRequireSchemaAuthz(requireSchemaAuthz);

////子Aceのリストを取得
//NodeList nl = document.getElementsByTagNameNS(nsD, "ace");
//Ace ace = null;
//Element elmAce = null;
//for (int i = 0; i < nl.getLength(); i++) {
////Aceオブジェクト生成
//ace = new Ace();
//acl.addAce(ace);

////Role名(href属性値)を取得し、Aceオブジェクトにセット
//elmAce = (Element) nl.item(i);
//NodeList nodeList = elmAce.getElementsByTagNameNS(nsD, "href");
//String roleUrl = nodeList.item(0).getFirstChild().getNodeValue();
//ace.setRoleName(roleUrl);

////privilege要素
//NodeList privilegeList = elmAce.getElementsByTagNameNS(nsD, "privilege");
//for (int n = 0; n < privilegeList.getLength(); n++) {
//Node elmPrivilege = privilegeList.item(n);
////privilege要素の子要素の要素名をprivilege値としてAceオブジェクトにセットする
//ace.addPrivilege(getChildElementName(elmPrivilege));
//}
//}
//}
//return acl;
//};
//static String getChildElementName(Node elm) {
//dcc.Acl.prototype.getChildElementName = function(elm) {
//NodeList nl = elm.getChildNodes();
//String name = "";
//for (int i = 0; i < nl.getLength(); i++) {
//Node node = nl.item(i);
//if (node.getNodeType() == Node.ELEMENT_NODE) {
//name = node.getLocalName();
//break;
//}
//}
//return name;
//};

/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class ACLのCRUDを行うためのクラス.
//* @constructor
//*/
/**
 * It creates a new object dcc.cellctl.AclManager.
 * @class This class performs the CRUD operations for ACL.
 * @constructor
 * @param {dcc.Accessor} as accessor
 * @param {dcc.box.DavCollection} dav
 */
dcc.cellctl.AclManager = function(as, dav) {
  this.initializeProperties(this, as, dav);
};

///**
//* プロパティを初期化する.
//* @param {dcc.cellctl.AclManager} self
//* @param {dcc.Accessor} as アクセス主体
//* @param {?} dav
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.cellctl.AclManager} self
 * @param {dcc.Accessor} as Accessor
 * @param {dcc.DcCollection} dav
 */
dcc.cellctl.AclManager.prototype.initializeProperties = function(self, as, dav) {
  self.accessor = as;
///** DAVコレクション. */
  /** DAV Collection */
  self.collection = dav;
};


///**
//* ACLを登録する.
//* @param {Object} body リクエストボディ(XML形式)
//* @throws {ClientException} DAO例外
//*/
/**
 * This method registers the ACL.
 * @param {Object} body Request body (XML format)
 * @throws {dcc.ClientException} DAO exception
 */
dcc.cellctl.AclManager.prototype.set = function(body) {
  var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
  restAdapter.acl(this.getUrl(), body);
};

///**
//* ACLオブジェクトとしてACLをセットする.
//* @param {dcc.Acl} obj Aclオブジェクト
//* @throws {ClientException} DAO例外
//*/
/**
 * This method sets the ACL object.
 * @param {dcc.Acl} aclObject ACL object
 * @param {Object} options contains callback and headers
 * @returns {dcc.DcHttpClient} response
 * @throws {dcc.ClientException} exception
 */
dcc.cellctl.AclManager.prototype.setAsAcl = function(aclObject, options) {
  var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
  var response = restAdapter.acl(this.getUrl(), aclObject.toXmlString(), options);
  return response;
};


///**
//* ACL情報をAclオブジェクトとして取得.
//* @return {dcc.Acl} Aclオブジェクト
//* @throws {ClientException} DAO例外
//*/
/**
 * This method gets ACL information.
 * @return {dcc.Acl} Acl object
 * @throws {dcc.ClientException} DAO exception
 */
dcc.cellctl.AclManager.prototype.get = function() {
  var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
  restAdapter.propfind(this.getUrl());
  return dcc.Acl.parse(restAdapter.bodyAsString());
};

///**
//* URLを生成.
//* @return {?} 現在のコレクションへのURL
//*/
/**
 * This method returns the URL.
 * @return {String} URL of current collection
 */
dcc.cellctl.AclManager.prototype.getUrl = function() {
  return this.collection.getPath();
};


/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class AssociationEndのアクセスクラス.
//* @constructor
//* @augments dcc.AbstractODataContext
//*/
/**
 * It creates a new object dcc.box.odata.schema.AssociationEnd.
 * @class This is the access class of Association End.
 * @constructor
 * @augments dcc.AbstractODataContext
 * @param {dcc.Accessor} as accessor
 * @param {Object} json
 * @param {String} path
 */
dcc.box.odata.schema.AssociationEnd = function(as, json, path) {
  this.initializeProperties(this, as, json, path);
};
dcc.DcClass.extend(dcc.box.odata.schema.AssociationEnd, dcc.AbstractODataContext);

///**
//* プロパティを初期化する.
//* @param {dcc.AbstractODataContext} self
//* @param {dcc.Accessor} as アクセス主体
//* @param {Object} json JSONオブジェクト
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.AbstractODataContext} self
 * @param {dcc.Accessor} as accessor
 * @param {Object} json JSON object
 * @param {String} path
 */
dcc.box.odata.schema.AssociationEnd.prototype.initializeProperties = function(self, as, json, path) {
  this.uber = dcc.AbstractODataContext.prototype;
  this.uber.initializeProperties(self, as);

///** キャメル型で表現したクラス名. */
  /** Class name */
  this.CLASSNAME = "AssociationEnd";
///** EntityType名. */
  /** EntityType name */
  self.entityTypeName = null;
///** AssociationEnd名. */
  /** AssociationEnd name */
  self.name = null;
///** 多重度. */
  /** Multiplicity */
  self.multiplicity = null;
///** コレクションのパス. */
  /** URL */
  self.url = path;

  /** Link manager of the Account. */
  self.associationEnd = null;
  self.associationEnd = new dcc.cellctl.MetadataLinkManager(as, this);

  if (json !== undefined && json !== null) {
    self.rawData = json;
    self.name = json.Name;
    self.entityTypeName = json["_EntityType.Name"];
    self.multiplicity = json.Multiplicity;
  }
};

///**
//* AssociationEnd名の設定.
//* @param {String} value AssociationEnd名
//*/
/**
 * This method sets the name for AssociationEnd.
 * @param {String} value AssociationEnd name
 */
dcc.box.odata.schema.AssociationEnd.prototype.setName = function(value) {
  this.name = value;
};

///**
//* AssociationEnd名の取得.
//* @return {String} AssociationEnd名
//*/
/**
 * This method gets the name of AssociationEnd.
 * @return {String} AssociationEnd name
 */
dcc.box.odata.schema.AssociationEnd.prototype.getName = function() {
  return this.name;
};

///**
//* EntityType名の設定.
//* @param {String} value EntityType名
//*/
/**
 * This method sets the EntityType name.
 * @param {String} value EntityType name
 */
dcc.box.odata.schema.AssociationEnd.prototype.setEntityTypeName = function(value) {
  this.entityTypeName = value;
};

///**
//* EntityType名の取得.
//* @return {String} EntityType名
//*/
/**
 * This method gets the EntityType name.
 * @return {String} EntityType name
 */
dcc.box.odata.schema.AssociationEnd.prototype.getEntityTypeName = function() {
  return this.entityTypeName;
};

///**
//* multiplicityの設定.
//* @param {String} value 多重度
//*/
/**
 * This method sets the multiplicity.
 * @param {String} value multiplicity
 */
dcc.box.odata.schema.AssociationEnd.prototype.setMultiplicity = function(value) {
  this.multiplicity = value;
};

///**
//* multiplicityの取得.
//* @return {String} 多重度
//*/
/**
 * This method gets the multiplicity.
 * @return {String} multiplicity
 */
dcc.box.odata.schema.AssociationEnd.prototype.getMultiplicity = function() {
  return this.multiplicity;
};

///**
//* ODataのキーを取得する.
//* @return {String} ODataのキー情報
//*/
/**
 * This method gets the Odata key.
 * @return {String} OData key
 */
//public String getKey() {
dcc.box.odata.schema.AssociationEnd.prototype.getKey = function() {
  return "(Name='" + this.name + "',_EntityType.Name='" + this.entityTypeName + "')";
};

///**
//* クラス名をキャメル型で取得する.
//* @return {?} ODataのキー情報
//*/
/**
 * This method gets the class name.
 * @return {String} OData class name
 */
dcc.box.odata.schema.AssociationEnd.prototype.getClassName = function() {
  return this.CLASSNAME;
};

///**
//* URLを取得.
//* @return URL文字列
//*/
/**
 * This method gets the URL.
 * @return {String} URL value.
 */
dcc.box.odata.schema.AssociationEnd.prototype.getPath = function() {
  return this.url;
};

/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class AssociationEndのCRUDのためのクラス.
//* @constructor
//* @augments dcc.box.odata.ODataManager
//*/
/**
 * It creates a new object dcc.box.odata.schema.AssociationEndManager.
 * @class This class performs the CRUD operations for Association End.
 * @constructor
 * @augments dcc.box.odata.ODataManager
 * @param {dcc.Accessor} as Accessor
 * @param {dcc.DcCollection} col
 */
dcc.box.odata.schema.AssociationEndManager = function(as, col) {
  this.initializeProperties(this, as, col);
};
dcc.DcClass.extend(dcc.box.odata.schema.AssociationEndManager, dcc.box.odata.ODataManager);

///**
//* プロパティを初期化する.
//* @param {dcc.box.odata.schema.AssociationEndManager} self
//* @param {dcc.Accessor} as アクセス主体
//* @param {?} col ?
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.box.odata.schema.AssociationEndManager} self
 * @param {dcc.Accessor} as accessor
 * @param {dcc.box.DavCollection} col
 */
dcc.box.odata.schema.AssociationEndManager.prototype.initializeProperties = function(self, as, col) {
  this.uber = dcc.box.odata.ODataManager.prototype;
  this.uber.initializeProperties(self, as, col);
};

///**
//* AssociationEndのURLを取得する.
//* @returns {String} URL
//*/
/**
 * This method returns the URL.
 * @returns {String} URL
 */
dcc.box.odata.schema.AssociationEndManager.prototype.getUrl = function() {
  var sb = "";
  sb += this.collection.getPath();
  sb += "/$metadata/AssociationEnd";
  return sb;
};

///**
//* AssociationEndを作成.
//* @param {dcc.box.odata.schema.AssociationEnd} obj AssociationEndオブジェクト
//* @return {dcc.box.odata.schema.AssociationEnd} AssociationEndオブジェクト
//* @throws {ClientException} DAO例外
//*/
/**
 * This method creates an AssociationEnd.
 * @param {dcc.box.odata.schema.AssociationEnd} obj AssociationEnd object
 * @param {Object} options optional parameters and callback
 * @return {dcc.box.odata.schema.AssociationEnd} AssociationEnd object
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.odata.schema.AssociationEndManager.prototype.create = function(obj,options) {
  var json = null;
  var headers = {};
  var responseJson = null;
  if (obj.getClassName !== undefined && obj.getClassName() === "AssociationEnd") {
    var body = {};
    body.Name = obj.getName();
    body["_EntityType.Name"] = obj.getEntityTypeName();
    body.Multiplicity = obj.getMultiplicity();
    json = this._internalCreate(JSON.stringify(body),headers,options);
    obj.initializeProperties(obj, this.accessor, json);
    return obj;
  } else {
    var requestBody = JSON.stringify(obj);
    var callbackExist = options !== undefined &&
    (options.success !== undefined ||
        options.error !== undefined ||
        options.complete !== undefined);
    if (callbackExist) {
      if (!("Name" in obj)) {
        throw new dcc.ClientException("Name is required.", "PR400-OD-0009");
      }
      if (!("Multiplicity" in obj)) {
        throw new dcc.ClientException("Multiplicity is required.",
        "PR400-OD-0009");
      }
      if (!("_EntityType.Name" in obj)) {
        throw new dcc.ClientException("_EntityType.Name is required.",
        "PR400-OD-0009");
      }
      this._internalCreate(requestBody,headers,options);

    } else {
      if (!("Name" in obj)) {
        throw new dcc.ClientException("Name is required.", "PR400-OD-0009");
      }
      if (!("Multiplicity" in obj)) {
        throw new dcc.ClientException("Multiplicity is required.",
        "PR400-OD-0009");
      }
      if (!("_EntityType.Name" in obj)) {
        throw new dcc.ClientException("_EntityType.Name is required.",
        "PR400-OD-0009");
      }

      json = this._internalCreate(requestBody);
      if (json.getStatusCode() >= 400) {
        var response = json.bodyAsJson();
        throw new dcc.ClientException(response.message.value, response.code);
      }
      responseJson = json.bodyAsJson().d.results;
      return new dcc.box.odata.schema.AssociationEnd(this.accessor, responseJson);
    }
  }
};
///**
//* AssociationEndを取得.
//* @param {String} name 取得対象のAssociation名
//* @param {String} entityTypeName EntityType名
//* @return {dcc.box.odata.schema.AssociationEnd} 取得したしたAssociationEndオブジェクト
//* @throws {ClientException} DAO例外
//*/
/**
 * This method fetches the AssociationEnd.
 * @param {String} name AssociationEnd
 * @param {String} entityTypeName EntityType name
 * @param {Object} options object has callback and headers
 * @return {dcc.box.odata.schema.AssociationEnd} AssociationEnd object
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.odata.schema.AssociationEndManager.prototype.retrieve = function(name, entityTypeName, options) {
  /*valid option is present with atleast one callback*/
  var callbackExist = options !== undefined &&
  (options.success !== undefined ||
      options.error !== undefined ||
      options.complete !== undefined);
  var key = "Name='" + name + "',_EntityType.Name='" + entityTypeName + "'";
  if (callbackExist) {
    this._internalRetrieveMultikey(key, options);
    return;
  }
  var json = this._internalRetrieveMultikey(key);
  return new dcc.box.odata.schema.AssociationEnd(this.accessor, json);
};

/**
 * To create url for assocend_navpro_list
 * @param {String} ascName
 * @param {String} entityTypeName
 * @param {String} associationEndView
 * @returns {String} URL
 */
dcc.box.odata.schema.AssociationEndManager.prototype.getNavProListUrl = function(ascName,
    entityTypeName, associationEndView) {
  var sb = "";
  sb += this.collection.getPath();
  sb += "/$metadata/AssociationEnd";
  sb += "(Name='" + ascName + "',_EntityType.Name='" + entityTypeName + "')/";
  if (associationEndView === true) {
    sb += "$links/";
    associationEndView = false;
  }
  sb += "_AssociationEnd";
  return sb;
};

///**
//* AssociationEndを削除.
//* @param {String} name 取得対象のAssociation名
//* @param {String} entityTypeName EntityType名
//* @return {dcc.Promise} promise
//* @throws {ClientException} DAO例外
//*/
/**
 * This method deletes the AssociationEnd.
 * @param {String} name AssociationEnd
 * @param {String} entityTypeName EntityType name
 * @param {Object} options having callback and headers
 * @return {dcc.Promise} promise
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.odata.schema.AssociationEndManager.prototype.del = function(name, entityTypeName, options) {
  var key = "Name='" + name + "',_EntityType.Name='" + entityTypeName + "'";
  var response = this._internalDelMultiKey(key, options);
  return response;
};

/**
 * To create assocend_navpro_list
 * @param {dcc.box.odata.schema.AssociationEnd} obj
 * @param {String} fromEntityTypeName
 * @param {String} fromAssEnd
 * @param {Object} options
 * @return {dcc.http.DcHttpClient} response
 */
dcc.box.odata.schema.AssociationEndManager.prototype.createNavProList = function(obj, fromEntityTypeName, fromAssEnd, options) {
  if (obj.getClassName !== undefined && obj.getClassName() === "AssociationEnd") {
    var body = {};
    body.Name = obj.getName();
    body.Multiplicity = obj.getMultiplicity();
    body["_EntityType.Name"] = obj.getEntityTypeName();
    var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
    var url = this.getNavProListUrl(fromAssEnd, fromEntityTypeName);
    var callbackExist = options !== undefined &&
    (options.success !== undefined ||
        options.error !== undefined ||
        options.complete !== undefined);
    if (callbackExist) {
      restAdapter.post(url, JSON.stringify(body), "application/json", {}, options);
    } else {
      var response = restAdapter.post(url, JSON.stringify(body), "application/json");
      return response;
    }
  }
};

/**
 * The purpose of this function is to create association URI
 * for particular entityType.
 * @param {String} entityTypeName
 * @return {String} URL
 */
dcc.box.odata.schema.AssociationEndManager.prototype.getAssociationUri = function (entityTypeName) {
  var sb = "";
  sb += this.collection.getPath();
  sb += "/$metadata/EntityType(";
  sb += "'"+entityTypeName+"'";
  sb += ")/_AssociationEnd";
  return sb;
};

/**
 * The purpose of this function is to retrieve association
 * list against one entity type.
 * @param {String} entityTypeName
 * @param {String} associationEndName
 * @return {Object} JSON
 */
dcc.box.odata.schema.AssociationEndManager.prototype.retrieveAssociationList = function (entityTypeName, associationEndName) {
  var uri = null;
  if(entityTypeName !== null && entityTypeName !== undefined) {
    uri = this.getAssociationUri(entityTypeName);
    if (associationEndName !== undefined && associationEndName !== null){
      uri = this.getNavProListUrl(associationEndName, entityTypeName, true);
    }
  }
  var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
  var response = restAdapter.get(uri, "application/json");
  var json = response.bodyAsJson().d.results;
  return json;
};

/**
 * The purpose of this function is to delete association link
 * @param {String} fromAssociationName
 * @param {String} fromEntityTypeName
 * @param {String} toAssociationName
 * @param {String} toEntityTypeName
 * @param {Object} options having callback and headers
 * @return {dcc.Promise} promise
 */
dcc.box.odata.schema.AssociationEndManager.prototype.delAssociationLink = function(fromAssociationName, fromEntityTypeName, toAssociationName, toEntityTypeName, options) {
  var uri = this.getNavProListUrl(fromAssociationName, fromEntityTypeName, true);
  uri += "(Name='" + toAssociationName + "'";
  uri += ",_EntityType.Name='" + toEntityTypeName + "')";
  var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
  var response = restAdapter.del(uri, options,"");
  return response;
};
/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class Boxへアクセスするためのクラス.
//* @constructor
//* @augments dcc.box.DavCollection
//*/
/**
 * It creates a new object dcc.box.Box.
 * @class This class represents Box to access box related fields.
 * @constructor
 * @augments dcc.box.DavCollection
 * @param {dcc.Accessor} as Accessor
 * @param {Object} json
 * @param {String} path
 */
dcc.box.Box = function(as, json, path) {
  this.initializeProperties(this, as, json, path);
};
dcc.DcClass.extend(dcc.box.Box, dcc.box.DavCollection);

///**
//* プロパティを初期化する.
//* @param {dcc.box.Box} self
//* @param {dcc.Accessor} as アクセス主体
//* @param {Object} json JSONオブジェクト
//* @param {?} path
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.box.Box} self
 * @param {dcc.Accessor} as Accessor
 * @param {Object} json JSON object
 * @param {String} path
 */
dcc.box.Box.prototype.initializeProperties = function(self, as, json, path) {
  this.uber = dcc.box.DavCollection.prototype;
  this.uber.initializeProperties(self, as, path);

  self.name = "";
  self.schema = "";
  self.acl = null;
  self.event = null;

  if (json !== undefined) {
    self.name = json.Name;
    self.schema = json.Schema;
  }
  if (as !== undefined) {
    self.acl = new dcc.cellctl.AclManager(as, this);
    self.event = new dcc.cellctl.EventManager(as);
  }
};

///**
//* Box名を取得.
//* @return {String} Box名
//*/
/**
 * This method gets the box name.
 * @return {String} Box name
 */
dcc.box.Box.prototype.getName = function() {
  return this.name;
};

///**
//* Boxを設定.
//* @param {String} value Box名
//*/
/**
 * This method sets the box name.
 * @param {String} value Box name
 */
dcc.box.Box.prototype.setName = function(value) {
  this.name = value;
};

///**
//* スキーマを取得.
//* @return {?} スキーマ
//*/
/**
 * This method gets the box schema.
 * @return {String} value Box schema
 */
dcc.box.Box.prototype.getSchema = function() {
  return this.schema;
};

///**
//* スキーマを設定.
//* @param {String} value スキーマ
//*/
/**
 * This method sets the box schema.
 * @param {String} value Box schema
 */
dcc.box.Box.prototype.setSchema = function(value) {
  this.schema = value;
};

///**
//* JSONオブジェクトを生成する.
//* @return {?} 生成したJSONオブジェクト
//*/
/**
 * This method generates the json for Box.
 * @return {Object} JSON object
 */
dcc.box.Box.prototype.toJSON = function() {
  var json = {};
  json.Name = this.name;
  json.Schema = this.schema;
  return json;
};


/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class BoxのCRUDのためのクラス.
//* @constructor
//* @augments dcc.box.odata.ODataManager
//*/
/**
 * It creates a new object dcc.box.BoxManager.
 * @class This class performs CRUD operations for Box.
 * @constructor
 * @augments dcc.box.odata.ODataManager
 * @param {dcc.Accessor} as Accessor
 */
dcc.box.BoxManager = function(as) {
  this.initializeProperties(this, as);
};
dcc.DcClass.extend(dcc.box.BoxManager, dcc.box.odata.ODataManager);

///**
//* プロパティを初期化する.
//* @param {dcc.box.BoxManager} self
//* @param {dcc.Accessor} as アクセス主体
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.box.BoxManager} self
 * @param {dcc.Accessor} as Accessor
 */
dcc.box.BoxManager.prototype.initializeProperties = function(self, as) {
  this.uber = dcc.box.odata.ODataManager.prototype;
  this.uber.initializeProperties(self, as);
};

///**
//* BoxのURLを取得する.
//* @returns {String} URL
//*/
/**
 * This method generates the URL for performing operations on Box.
 * @returns {String} URL
 */
dcc.box.BoxManager.prototype.getUrl = function() {
  var sb = "";
  sb += this.getBaseUrl();
  sb += this.accessor.cellName;
  sb += "/__ctl/Box";
  return sb;
};

///**
//* Boxを作成.
//* @param {dcc.box.Box} obj Boxオブジェクト
//* @return responseJson
//* @throws {ClientException} DAO例外
//*/
/**
 * This method creates a new Box.
 * @param {dcc.box.Box} obj Box object
 * @param {Object} options object
 * @return {Object} responseJson
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.BoxManager.prototype.create = function(obj,options) {
  var body = {};
  body.Name = obj.accessor.boxName;
  //var boxName = body.Name;
  var schema = obj.accessor.boxSchema;
  var schemaLen = schema.length;
  if(schemaLen !== 0) {
    body.Schema = schema;
  }
  var requestBody = JSON.stringify(body);
  var callbackExist = options !== undefined &&
  (options.success !== undefined ||
      options.error !== undefined ||
      options.complete !== undefined);
  if (callbackExist) {
    var headers = {};
    this._internalCreate(requestBody,headers,options);
  } else {
    var response = this._internalCreate(requestBody);
    var responseJson = null;
    /*    if (response.getStatusCode() >= 400) {
      responseJson = response.bodyAsJson();
      throw new dcc.ClientException(responseJson.message.value,responseJson.code);
    }*/
    responseJson = response.bodyAsJson().d.results;
    return responseJson;
  }
  /*if(json !== undefined && json.response === undefined) {
		var objCommon = new common();
		addSuccessClass();
		inlineMessageBlock();
		boxTableRefresh();
		var shorterBoxName = objCommon.getShorterEntityName(boxName);
		document.getElementById("successmsg").innerHTML = "Box "+shorterBoxName+" created successfully!";
		document.getElementById("successmsg").title = boxName;
		$('#createBoxModal, .window').hide();
		autoHideMessage();
	}*/
  /*if(json.response !== undefined) {
		return json;
	}*/
  /*var path = dcc.UrlUtils.append(accessor.getCurrentCell().getUrl(), body.Name);
	obj.initialize(this.accessor, json, path);
	return obj;*/
//var body = {};
//body.Name = obj.getName();
//body.Schema = obj.getSchema();
//var json = this.internalCreate(body);
//var path = dcc.UrlUtils.append(accessor.getCurrentCell().getUrl(), body.Name);
//obj.initialize(this.accessor, json, path);
//return obj;
//var requestBody = JSON.stringify(obj);
//var json = this.internalCreate(requestBody);
//return new dcc.box.Box(this.accessor, json, dcc.UrlUtils.append(this.accessor.getCurrentCell().getUrl(), obj.Name));
};

///**
//* The purpose of this function is to refresh the boxList.
//*/
/*function boxTableRefresh() {
	var contextRoot = sessionStorage.contextRoot;
	$("#mainContent").html('');
	$("#mainContent").load(contextRoot+'/htmls/boxListView.html', function() {
		if(navigator.userAgent.indexOf("Firefox") != -1) {
			createBoxTable();
		}
	});
}*/

///**
//* Boxを作成.
//* @param {Object} body リクエストボディ
//* @return {dcc.box.Box} 作成したBoxオブジェクト
//* @throws {ClientException} DAO例外
//*/
//dcc.box.BoxManager.prototype.createAsMap = function(body) {
//var requestBody = JSON.stringify(body);
//var json = this.internalCreate(requestBody);
//return new dcc.box.Box(this.accessor, json, dcc.UrlUtils.append(this.accessor.getCurrentCell().getUrl(), body.Name));
//};

///**
//* Boxを取得.
//* @param {String} name 取得対象のbox名
//* @return {dcc.box.Box} 取得したしたBoxオブジェクト
//* @throws {ClientException} DAO例外
//*/
/**
 * This method fetches the box details.
 * @param {String} name Box name
 * @param {Object} options callback parameters
 * @return {dcc.box.Box} Box object
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.BoxManager.prototype.retrieve = function(name, options) {
  /*valid option is present with atleast one callback*/
  var callbackExist = options !== undefined &&
  (options.success !== undefined ||
      options.error !== undefined ||
      options.complete !== undefined);

  if (callbackExist) {
    this._internalRetrieve(name,options);
    return;
  }
  var json = this._internalRetrieve(name);
  //box doesn't exist and can be created.
  //return new dcc.box.Box(this.accessor, json);
  return new dcc.box.Box(this.accessor, json,dcc.UrlUtils.append(this.accessor.getCurrentCell().getUrl(), name));
  //var json = this._internalRetrieve(name);
  //return new dcc.box.Box(this.accessor, json, dcc.UrlUtils.append(this.accessor.getCurrentCell().getUrl(), name));
};
/**
 * The purpose of this function is to return array of boxes.
 * @param {String} name
 * @returns {Object] json
 */
dcc.box.BoxManager.prototype.getBoxes = function(name) {
  var json = this._internalRetrieve(name);
  return json;
};

/**
 * This method deletes a BOx against a cellName and etag.
 * @param {String} boxName
 * @param {String} etagOrOptions ETag value or options object having callback and headers
 * @returns {Object} json
 */
dcc.box.BoxManager.prototype.del = function(boxName, etagOrOptions) {
  var key = "Name='" + boxName + "'";
  var response = this._internalDelMultiKey(key, etagOrOptions);
  return response;
};

/**
 * This method gets Etag of the Box.
 * @param {String} name
 * @return {String} Etag
 */
dcc.box.BoxManager.prototype.getEtag = function(name) {
  var json = this._internalRetrieve(name);
  return json.__metadata.etag;
};

/**
 * This method update the box details.
 * @param {String} boxName name
 * @param {Object} body request
 * @param {String} etag value
 * @param {Object} options object optional containing callback, headers
 * @return {dcc.box.odata.ODataResponse} response
 */
dcc.box.BoxManager.prototype.update = function(boxName, body, etag, options) {
  //id, body, etag, headers, callback
  var response = this._internalUpdate(boxName, body, etag, null, options);
  return response;
};
/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class Cellへアクセスするためのクラス.
//* @constructor
//* @augments dcc.AbstractODataContext
//*/
/**
 * It creates a new object dcc.unitctl.Cell.
 * @class This class represents Cell object to perform cell related operations.
 * @constructor
 * @property {dcc.Acl} acl class instance to access ACL settings.
 * @property {dcc.cellctl.Account} account class instance to access Account.
 * @property {dcc.box.Box} box class instance to access Box.
 * @property {dcc.cellctl.Message} message Manager classes for sending and receiving messages.
 * @property {dcc.cellctl.Relation} relation class instance to access Relation.
 * @property {dcc.cellctl.Role} role class instance to access Role.
 * @property {dcc.cellctl.ExtRole} extRole class instance to access External Role.
 * @property {dcc.cellctl.ExtCell} extCell class instance to access External Cell.
 * @property {dcc.cellctl.Event} event class instance to access Event.
 * @augments dcc.AbstractODataContext
 * @param {dcc.Accessor} as Accessor
 * @param {String} key
 */
dcc.unitctl.Cell = function(as, key) {
  this.ctl = {};
  this.initializeProperties(this, as, key);
};
dcc.DcClass.extend(dcc.unitctl.Cell, dcc.AbstractODataContext);

///**
//* プロパティを初期化する.
//* @param {dcc.unitctl.Cell} self
//* @param {dcc.Accessor} as アクセス主体
//* @param {Object} body
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.unitctl.Cell} self
 * @param {dcc.Accessor} as Accessor
 * @param {Object} body
 */
dcc.unitctl.Cell.prototype.initializeProperties = function(self, as, body) {
  this.uber = dcc.AbstractODataContext.prototype;
  this.uber.initializeProperties(self, as);

///** キャメル方で表現したクラス名. */
  /** Class name for Cell. */
  self.CLASSNAME = "Cell";

///** Cell名 (string). */
  /** Cell name (string). */
  self.name = "";
  if (typeof body === "string") {
    self.name = body;
  }
  if (typeof body === "undefined" && self.accessor !== undefined) {
    self.name = self.accessor.getCellName();
  }

  /** location. */
  self.location = null;

///** CellレベルACLへアクセスするためのクラス. */
  /** To access cell level ACL. */

  self.ctl.acl = null;
///** メンバーへアクセスするためのクラスインスタンス。cell().accountでアクセス. */
  /** Class instance to access Account. */
  self.ctl.account = null;
///** BoxのCRUDを行うマネージャクラス. */
  /** Manager class to perform CRUD of Box. */
  self.ctl.box = null;
///** メッセージ送受信を行うマネージャクラス. */
  /** Manager classes for sending and receiving messages. */
  self.ctl.message = null;
///** Relation へアクセスするためのクラス. */
  /** Class to access the Relation. */
  self.ctl.relation = null;
///** Role へアクセスするためのクラス. */
  /** Class to access the Role. */
  self.ctl.role = null;
///** ExtRole へアクセスするためのクラス. */
  /** Class to access the External Role. */
  self.ctl.extRole = null;
///** ExtCell へアクセスするためのクラス. */
  /** Class to access the External Cell. */
  self.ctl.extCell = null;
///** Event へアクセスするためのクラス. */
  /** Class to access the Event. */
  self.ctl.event = null;

//if (this.json !== null) {
//this.rawData = this.json;
//this.name = this.json.Name;
//this.location = this.json.__metadata.uri;
//}

  if (self.accessor !== undefined) {
    self.accessor.setCurrentCell(this);
    self.ctl.relation = new dcc.cellctl.RelationManager(self.accessor);
    self.ctl.role = new dcc.cellctl.RoleManager(self.accessor);
    self.ctl.message = new dcc.cellctl.MessageManager(self.accessor);
//  this.acl = new AclManager(this.accessor);
    self.ctl.account = new dcc.cellctl.AccountManager(self.accessor);
    self.ctl.box = new dcc.box.BoxManager(self.accessor);
//  this.extRole = new ExtRoleManager(this.accessor);
    self.ctl.extCell = new dcc.cellctl.ExtCellManager(self.accessor);
    self.ctl.event = new dcc.cellctl.EventManager(self.accessor);
    self.ctl.extRole = new dcc.cellctl.ExtRoleManager(self.accessor);
  }
};

///**
//* Cell名を取得.
//* @return {String} Cell名
//*/
/**
 * This method gets the Cell name.
 * @return {String} Cell name
 */
dcc.unitctl.Cell.prototype.getName = function() {
  return this.name;
};

///**
//* Cell名を設定.
//* @param {String} value Cell名
//*/
/**
 * This method sets the Cell name.
 * @param {String} value Cell name
 */
dcc.unitctl.Cell.prototype.setName = function(value) {
  if (typeof value !== "string") {
    throw new dcc.ClientException("InvalidParameter");
  }
  this.name = value;
};


///**
//* CellのURLを取得する.
//* @return {String} 取得した CellのURL
//*/
/**
 * This method gets the URL for performing cell related operations.
 * @return {String} URL of the cell
 */
dcc.unitctl.Cell.prototype.getUrl = function() {
  return this.accessor.getBaseUrl() + encodeURI(this.name) + "/";
};

///**
//* アクセストークンを取得.
//* @return {?} アクセストークン
//* @throws {ClientException} DAO例外
//*/
/**
 * This method gets the access token.
 * @return {String} Access Token
 * @throws {dcc.ClientException} DAO exception
 */
dcc.unitctl.Cell.prototype.getAccessToken = function() {
  if (this.accessor.getAccessToken() !== null) {
    return this.accessor.getAccessToken();
  } else {
    throw new dcc.ClientException.create("Unauthorized");
  }
};

///**
//* アクセストークンの有効期限を取得.
//* @return {?} アクセストークンの有効期限
//*/
/**
 * This method gets the expiration date of the access token.
 * @return {String} expiration date of the access token
 */
dcc.unitctl.Cell.prototype.getExpiresIn = function() {
  return this.accessor.getExpiresIn();
};

///**
//* アクセストークンのタイプを取得.
//* @return {?} アクセストークンのタイプ
//*/
/**
 * This method gets the access token type.
 * @return {String} access token type
 */
dcc.unitctl.Cell.prototype.getTokenType = function() {
  return this.accessor.getTokenType();
};

///**
//* リフレッシュトークンを取得.
//* @return {?} リフレッシュトークン
//* @throws ClientException DAO例外
//*/
/**
 * This method gets the refresh token.
 * @return {String} Refreash token
 * @throws {dcc.ClientException} DAO exception
 */
dcc.unitctl.Cell.prototype.getRefreshToken = function() {
  if (this.accessor.getRefreshToken() !== null) {
    return this.accessor.getRefreshToken();
  } else {
    throw new dcc.ClientException("Unauthorized");
  }
};

///**
//* リフレッシュの有効期限を取得.
//* @return {?} リフレッシュトークンの有効期限
//*/
/**
 * This method gets the expiration date of the refresh token.
 * @return {String} expiration date of the refresh token
 */
dcc.unitctl.Cell.prototype.getRefreshExpiresIn = function() {
  return this.accessor.getRefreshExpiresIn();
};

/**
 * This method returns the location.
 * @return {String} location
 */
dcc.unitctl.Cell.prototype.getLocation = function() {
  return this.location;
};

///**
//* CellのownerRepresentativeAccountsを設定.
//* @param user アカウント名
//* @throws ClientException DAO例外
//*/
//dcc.unitctl.Cell.prototype.setOwnerRepresentativeAccounts = function(user) {
//var value = "<dc:account>" + user + "</dc:account>";
//RestAdapter rest = (RestAdapter) RestAdapterFactory.create(this.accessor);
//rest.proppatch(this.getUrl(), "dc:ownerRepresentativeAccounts", value);
//};

///**
//* CellのownerRepresentativeAccountsを設定(複数アカウント登録).
//* @param accountName アカウント名の配列
//* @throws ClientException DAO例外
//*/
//public void setOwnerRepresentativeAccounts(String[] accountName) throws ClientException {
//dcc.unitctl.Cell.prototype.setOwnerRepresentativeAccounts = function(accountName) {
//StringBuilder sb = new StringBuilder();
//for (Object an : accountName) {
//sb.append("<dc:account>");
//sb.append(an);
//sb.append("</dc:account>");
//}
//RestAdapter rest = (RestAdapter) RestAdapterFactory.create(this.accessor);
//rest.proppatch(this.getUrl(), "dc:ownerRepresentativeAccounts", sb.toString());
//};

///**
//* Boxへアクセスするためのクラスを生成.
//* @param {?} boxName Box Name
//* @param {?} schemaValue スキーマ名
//* @return {dcc.box.Box} 生成したBoxインスタンス
//* @throws {ClientException} DAO例外
//*/
/**
 * This method generates classes to access the Box.
 * @param {String} boxName Box Name
 * @param {String} schemaValue Schema value
 * @return {dcc.box.Box} Box object
 * @throws {dcc.ClientException} DAO exception
 */
dcc.unitctl.Cell.prototype.box = function(boxName, schemaValue) {
  this.accessor.setBoxName(boxName);
  var url = dcc.UrlUtils.append(this.accessor.getCurrentCell().getUrl(), this.accessor.getBoxName());
  return new dcc.box.Box(this.accessor, {"Name":boxName, "Schema":schemaValue}, url);
};

///**
//* BaseUrl を取得.
//* @return {String} baseUrl 基底URL文字列
//*/
/**
 * This method gets the Base URL.
 * @return {String} baseUrl Base URL
 */
dcc.unitctl.Cell.prototype.getBaseUrlString = function() {
  return this.accessor.getBaseUrl();
};

///**
//* ODataのキーを取得する.
//* @return {String} ODataのキー情報
//*/
/**
 * This method gets the key of OData.
 * @return {String} OData key
 */
dcc.unitctl.Cell.prototype.getKey = function() {
  return "('" + this.name + "')";
};

///**
//* クラス名をキャメル型で取得する.
//* @return {?} ODataのキー情報
//*/
/**
 * This method gets the class name.
 * @return {String} OData class name
 */
dcc.unitctl.Cell.prototype.getClassName = function() {
  return this.CLASSNAME;
};

/**
 * Get the cookie peer key.
 * @returns {String} Cookie Peer key
 */
dcc.unitctl.Cell.prototype.getCookiePeer = function(){
  return this.accessor.getCookiePeer();
};
/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class CellのCRUDを行うクラス.
//* @constructor
//* @augments dcc.box.odata.ODataManager
//*/
/**
 * It creates a new object dcc.unitctl.CellManager.
 * @class This class performs CRUD operations for Cell.
 * @constructor
 * @augments dcc.box.odata.ODataManager
 * @param {dcc.Accessor} as Accessor
 */
dcc.unitctl.CellManager = function(as) {
  this.initializeProperties(this, as);
};
dcc.DcClass.extend(dcc.unitctl.CellManager, dcc.box.odata.ODataManager);

///**
//* プロパティを初期化する.
//* @param {dcc.unitctl.CellManager} self
//* @param {dcc.Accessor} as アクセス主体
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.unitctl.CellManager} self
 * @param {dcc.Accessor} as Accessor
 */
dcc.unitctl.CellManager.prototype.initializeProperties = function(self, as) {
  this.uber = dcc.box.odata.ODataManager.prototype;
  this.uber.initializeProperties(self, as);
};

///**
//* URLを生成する.
//* @return {String} URL文字列
//*/
/**
 * This method gets the URL for performing cell related operations.
 * @return {String} URL for Cell
 */
dcc.unitctl.CellManager.prototype.getUrl = function() {
  return this.getBaseUrl() + "__ctl/Cell";
};

///**
//* Cellを作成.
//* @param {Object} body リクエストボディ
//* @param {dcc.unitctl.Cell} cell
//* @param callback object
//* @return {dcc.unitctl.Cell} 作成したCellオブジェクト
//* @throws {ClientException} DAO例外
//*/
/**
 * This method performs create operation for Cell.
 * @param {Object} body Request body
 * @param {dcc.unitctl.Cell} cell
 * @param {Object} options object
 * @return {dcc.unitctl.Cell} Cell object
 * @throws {dcc.ClientException} DAO exception
 */
dcc.unitctl.CellManager.prototype.create = function(body, cell, options) {
  var json = null;
  if (typeof cell !== "undefined") {
    var newBody = {};

    newBody.Name = cell.accessor.cellName;
    json = this.cellCreate(newBody);
    //cell.initialize(this.accessor, json);
    cell.initializeProperties(cell, this.accessor, json.Name);
    return cell;
  }
  var callbackExist = options !== undefined &&
  (options.success !== undefined ||
      options.error !== undefined ||
      options.complete !== undefined);
  if (callbackExist) {
    //if (callback !== undefined && this.accessor.getContext().getAsync()) {
    //asynchronous mode
    this.cellCreate(body, options);
    /* json = this.cellCreate(body, function(resp) {
      if (resp.getStatusCode() >= 300) {
        if (callback.error !== undefined) {
          callback.error(resp);
        }
      } else {
        var responseBody = resp.bodyAsJson();
        var json = responseBody.d.results;
        var newCell = new dcc.unitctl.Cell(this.accessor, json.Name);
        if (callback.success !== undefined) {
          callback.success(newCell);
        }
      }
      if (callback.complete !== undefined) {
        callback.complete(resp);
      }
      return;
    });*/
  } else {
    json = this.cellCreate(body);
    return new dcc.unitctl.Cell(this.accessor, json.Name);
  }
};

///**
//* Cellを作成.
//* @param {Object} body リクエストボディ
//* @param callback object
//* @return response JSON object
//* @throws {ClientException} DAO例外
//*/
/**
 * This method performs Create operation for cell.
 * @param {Object} body Request body
 * @param {Object} options object
 * @return {Object} response JSON object
 * @throws {dcc.ClientException} DAO exception
 */
dcc.unitctl.CellManager.prototype.cellCreate = function(body, options) {
  var url = this.getUrl();
  var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
  var headers = {};
  var requestBody = JSON.stringify(body);
  if(options !== undefined){
    // if(callback !== undefined && this.accessor.getContext().getAsync()){
    //asynchronous mode
    restAdapter.post(url, requestBody, "application/json", headers, options);
  }else{
    var response = restAdapter.post(url, requestBody, "application/json",headers);
    var responseBody = response.bodyAsJson();
    if(responseBody.d === undefined){
      throw new dcc.ClientException(responseBody.message.value,responseBody.code);
    }
    var json = responseBody.d.results;
    return json;
  }
};

///**
//* retrieve cell.
//* @param {String} id 取得対象のID
//* @return {dcc.unitctl.Cell} 取得したしたCellオブジェクト
//* @throws {ClientException} DAO例外
//*/
/**
 * This method performs the retrieve operation for cell.
 * @param {String} id ID of cell
 * @param {Object} options callback parameters
 * @return {dcc.unitctl.Cell} Cell object
 * @throws {dcc.ClientException} DAO exception
 */
dcc.unitctl.CellManager.prototype.retrieve = function(id,options) {
  if (typeof id !== "string") {
    throw new dcc.ClientException("InvalidParameter");
  }
  if(!this.accessor.getContext().getAsync()){
    //synchronous call execution
    var json = this._internalRetrieve(id,options);

    //returns response in JSON format, otherwise throws exception
    this.accessor.cellName = json.Name;
    return new dcc.unitctl.Cell(this.accessor, json.Name);
  } else {
    //asynchronous mode of execution
    this._internalRetrieve(id,options);
  }
};

/**
 * Delete Cell.
 * @param {String} cellName
 * @param {Object} etagOrOptions etag value or options having callback and headers
 * @return {dcc.Promise} response
 */
dcc.unitctl.CellManager.prototype.del = function(cellName, etagOrOptions) {
  var key = "Name='" + cellName + "'";
  var response =  this._internalDelMultiKey(key, etagOrOptions);
  return response;
};

/**
 * This method gets the unique Etag.
 * @param {String} name
 * @return {String} etag
 */
dcc.unitctl.CellManager.prototype.getEtag = function(name) {
  var json = this._internalRetrieve(name);
  return json.__metadata.etag;
};

/**
 * RECURSIVE DELETE FUNCTION FOR CELL.
 * @param {String} cellName Name of cell to delete.
 * @param {Object} options arbitrary options to call this method.
 * @param {Function} options.success Callback function for successful result.
 * @param {Function} options.error Callback function for error response.
 * @param {Function} options.complete Callback function for any response,  either successful or error.
 * @param {Object} options.headers any extra HTTP request headers to send.
 * @returns {Object} response(sync) or promise(async) (TODO not implemented) depending on the sync/async model.
 */
dcc.unitctl.CellManager.prototype.recursiveDelete = function(cellName, options) {
  var url = this.getBaseUrl() + cellName;
  var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
  if(!options){
    options = {};
  }
  if(!options.headers){
    options.headers = {};
  }
  options.headers["X-Dc-Recursive"] = "true";
  var response = restAdapter.del(url, options);
  return response;
};
/*
 * Copyright 2012 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class コレクションの抽象クラス.
//* @constructor
//* @augments jAbstractODataContext
//*/
/**
 * It creates a new object dcc.Entity.
 * @class This is the abstract class for a collection.
 * @constructor
 * @augments jAbstractODataContext
 * @param {dcc.Accessor} as Accessor
 * @param {String} path
 */
dcc.Entity = function(as, path) {
  this.initializeProperties(this, as, path);
};
dcc.DcClass.extend(dcc.Entity, dcc.AbstractODataContext);

///**
//* プロパティを初期化する.
//*/
/**
 * This method initializes the properties of this class.
 */
dcc.Entity.prototype.initializeProperties = function(self, as, path) {
  this.uber = dcc.AbstractODataContext.prototype;
  this.uber.initializeProperties(self, as);

  if (as !== undefined) {
    self.accessor = as.clone();
  }

///** キャメル方で表現したクラス名. */
  /** Class name in camel case. */
  self.CLASSNAME = "";
///** コレクションのパス. */
  /** Path of collection. */
  self.url = path;

};

///**
//* URLを取得.
//* @return URL文字列
//*/
/**
 * This method gets the path.
 * @return {String} URL Path
 */
dcc.Entity.prototype.getPath = function() {
  return this.url;
};

///**
//* ODataのキーを取得する.
//* @return ODataのキー情報
//*/
/**
 * This method gets the Odata key.
 * @return {String} OData key.
 */
dcc.Entity.prototype.getKey = function() {
  return "";
};

///**
//* クラス名をキャメル型で取得する.
//* @return ODataのキー情報
//*/
/**
 * This method gets the odata class name.
 * @return {String} OData class name
 */
dcc.Entity.prototype.getClassName = function() {
  return this.CLASSNAME;
};


/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class EntityTypeのアクセスクラス.
//* @constructor
//* @augments dcc.AbstractODataContext
//*/
/**
 * It creates a new object dcc.box.odata.schema.EntityType.
 * @class This class represents the EntityType object.
 * @constructor
 * @augments dcc.AbstractODataContext
 * @param {dcc.Accessor} Accessor
 * @param {Object} body
 */
dcc.box.odata.schema.EntityType = function(as, body) {
  this.initializeProperties(this, as, body);
};
dcc.DcClass.extend(dcc.box.odata.schema.EntityType, dcc.AbstractODataContext);

///**
//* オブジェクトを初期化.
//* @param {dcc.box.odata.schema.EntityType} self
//* @param {dcc.Accessor} as アクセス主体
//* @param {Object} json サーバーから返却されたJSONオブジェクト
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.box.odata.schema.EntityType} self
 * @param {dcc.Accessor} as Accessor
 * @param {Object} json JSON object returned from server
 */
dcc.box.odata.schema.EntityType.prototype.initializeProperties = function(self, as, json) {
  this.uber = dcc.AbstractODataContext.prototype;
  this.uber.initializeProperties(self, as);

///** キャメル方で表現したクラス名. */
  /** Class name in camel case. */
  this.CLASSNAME = "EntityType";

///** EntityType名. */
  /** EntityType name. */
  self.name = "";

  if (json !== undefined && json !== null) {
    self.rawData = json;
    self.name = json.Name;
  }
};

///**
//* EntityType名の設定.
//* @param {String} value EntityType名
//*/
/**
 * This method sets the EntityType name.
 * @param {String} value EntityType name
 */
dcc.box.odata.schema.EntityType.prototype.setName = function(value) {
  this.name = value;
};

///**
//* EntityType名の取得.
//* @return {String} EntityType名
//*/
/**
 * This method gets the EntityType name.
 * @return {String} EntityType name
 */
dcc.box.odata.schema.EntityType.prototype.getName = function() {
  return this.name;
};

///**
//* ODataのキーを取得する.
//* @return {String} ODataのキー情報
//*/
/**
 * This method gets the Odata key.
 * @return {String} OData key
 */
dcc.box.odata.schema.EntityType.prototype.getKey = function() {
  return "('" + this.name + "')";
};

///**
//* クラス名をキャメル型で取得する.
//* @return {?} ODataのキー情報
//*/
/**
 * This method gets the class name.
 * @return {String} OData class name
 */
dcc.box.odata.schema.EntityType.prototype.getClassName = function() {
  return this.CLASSNAME;
};


/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class EntityTypeのCRUDのためのクラス.
//* @constructor
//* @augments dcc.box.odata.ODataManager
//*/
/**
 * It creates a new object dcc.box.odata.schema.EntityTypeManager.
 * @class This class performs The CRUD operations for EntityType.
 * @constructor
 * @augments dcc.box.odata.ODataManager
 * @param {dcc.Accessor} as Accessor
 * @param {dcc.DcCollection} collection
 */
dcc.box.odata.schema.EntityTypeManager = function(as, collection) {
  this.initializeProperties(this, as, collection);
};
dcc.DcClass.extend(dcc.box.odata.schema.EntityTypeManager, dcc.box.odata.ODataManager);

///**
//* プロパティを初期化する.
//* @param {dcc.AbstractODataContext} self
//* @param {dcc.Accessor} as アクセス主体
//* @param {?} collection
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.AbstractODataContext} self
 * @param {dcc.Accessor} as Accessor
 * @param {dcc.DcCollection} collection
 */
dcc.box.odata.schema.EntityTypeManager.prototype.initializeProperties = function(self, as, collection) {
  this.uber = dcc.box.odata.ODataManager.prototype;
  this.uber.initializeProperties(self, as, collection);
};

///**
//* EntityTypeのURLを取得する.
//* @returns {String} URL
//*/
/**
 * This method generates the URL for performing EntityType operations.
 * @returns {String} URL
 */
dcc.box.odata.schema.EntityTypeManager.prototype.getUrl = function() {
  var sb = "";
  sb += this.collection.getPath();
  sb += "/$metadata/EntityType";
  return sb;
};

///**
//* EntityTypeを作成.
//* @param {dcc.box.odata.schema.EntityType} obj EntityTypeオブジェクト
//* @return {dcc.box.odata.schema.EntityType} EntityTypeオブジェクト
//* @throws {ClientException} DAO例外
//*/
/**
 * This method is used for performing create operation on EntityType.
 * @param {dcc.box.odata.schema.EntityType} obj EntityType object
 * @param {Object} options Callback object
 * @return {dcc.box.odata.schema.EntityType} EntityType object
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.odata.schema.EntityTypeManager.prototype.create = function(obj,options) {
  var json = null;
  var responseJson = null;
  var headers = {};
  if (obj.getClassName !== undefined && obj.getClassName() === "EntityType") {
    var body = {};
    body.Name = obj.getName();
    json = this._internalCreate(JSON.stringify(body),headers,options);
    obj.initializeProperties(obj, this.accessor, json);
    return obj;
  } else {
    var requestBody = JSON.stringify(obj);
    var callbackExist = options !== undefined &&
    (options.success !== undefined ||
        options.error !== undefined ||
        options.complete !== undefined);
    if (callbackExist) {
      this._internalCreate(requestBody,headers,options);
    } else {
      json = this._internalCreate(requestBody);
      if (json.getStatusCode() >= 400) {
        var response = json.bodyAsJson();
        throw new dcc.ClientException(response.message.value, response.code);
      }
      responseJson = json.bodyAsJson().d.results;
      return new dcc.box.odata.schema.EntityType(this.accessor, responseJson);
    }
  }
};

///**
//* EntityTypeを取得.
//* @param {String} name 取得対象のbox名
//* @return {dcc.box.odata.schema.EntityType} 取得したしたEntityTypeオブジェクト
//* @throws {ClientException} DAO例外
//*/
/**
 * This method is used for retrieve operation for EntityType.
 * @param {String} name EntityType name
 * @param {Object} options JSON object has callback and headers
 * @return {dcc.box.odata.schema.EntityType} EntityType object
 * @throws {dcc.ClientException} exception
 */
dcc.box.odata.schema.EntityTypeManager.prototype.retrieve = function(name, options) {
  /*valid option is present with at least one callback*/
  var callbackExist = options !== undefined &&
  (options.success !== undefined ||
      options.error !== undefined ||
      options.complete !== undefined);
  var json = this._internalRetrieve(name, options);
  if (!callbackExist) {
    return new dcc.box.odata.schema.EntityType(this.accessor, json);
  }
};

/**
 * The purpose of this method is to update entity type.
 * @param {String} entityName name of the entity
 * @param {String} body
 * @param {String} etag value
 * @param {Object} options optional parameters containing callback, headers
 * @return {Object} response
 */
dcc.box.odata.schema.EntityTypeManager.prototype.update = function(entityName, body, etag, options) {
  var response = null;
  var headers = {};
  response = this._internalUpdate(entityName, body, etag, headers, options);
  return response;
};

/**
 * The purpose of this method is to return etag for
 * particular entity type.
 * @param {String} entityName name
 * @return {String} etag
 */
dcc.box.odata.schema.EntityTypeManager.prototype.getEtag = function(entityName) {
  var json = this._internalRetrieve(entityName);
  return json.__metadata.etag;
};

/**
 * The purpose of this method is to delete entity type.
 * @param {String} entityTypeName name of the entity
 * @param {String} etagOrOptions ETag value or options object having callback and headers
 * @return {Object} response
 */
dcc.box.odata.schema.EntityTypeManager.prototype.del = function(entityTypeName, etagOrOptions) {
  var key = "Name='" + entityTypeName + "'";
  var response = this._internalDelMultiKey(key, etagOrOptions);
  return response;
};
/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class ExtCellのアクセスクラス.
//* @constructor
//*/
/**
 * It creates a new object dcc.cellctl.Event.
 * @class This class represents Event object.
 * @constructor
 */
dcc.cellctl.Event = function() {
  this.initializeProperties(this);
};

///**
//* プロパティを初期化する.
//* @param {dcc.cellctl.Event} self
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.cellctl.Event} self
 */
dcc.cellctl.Event.prototype.initializeProperties = function(self) {
  self.action = "";
  self.level = "";
  self.object = "";
  self.result = "";
};

///**
//* action値の取得.
//* @return {String} action値
//*/
/**
 * This method gets Action.
 * @return {String} action value
 */
dcc.cellctl.Event.prototype.getAction = function() {
  return this.action;
};

///**
//* action値の設定.
//* @param {String} value action値
//*/
/**
 * This method sets Action.
 * @param {String} value action value
 */
dcc.cellctl.Event.prototype.setAction = function(value) {
  this.action = value;
};

///**
//* level値の取得.
//* @return {String} level値
//*/
/**
 * This method gets Level.
 * @return {String} level value
 */
dcc.cellctl.Event.prototype.getLevel = function() {
  return this.level;
};

///**
//* level値の設定.
//* @param {String} value level値
//*/
/**
 * This method sets Level.
 * @param {String} value level value
 */
dcc.cellctl.Event.prototype.setLevel = function(value) {
  this.level = value;
};

///**
//* object値の取得.
//* @return {String} object値
//*/
/**
 * This method gets Object.
 * @return {String} object value
 */
dcc.cellctl.Event.prototype.getObject = function() {
  return this.object;
};

///**
//* object値の設定.
//* @param {String} value object値
//*/
/**
 * This method sets Object.
 * @param {String} value object value
 */
dcc.cellctl.Event.prototype.setObject = function(value) {
  this.object = value;
};

///**
//* result値の取得.
//* @return {String} result値
//*/
/**
 * This method gets Result.
 * @return {String} result value
 */
dcc.cellctl.Event.prototype.getResult = function() {
  return this.result;
};

///**
//* result値のセット.
//* @param {String} value result値
//*/
/**
 * This method sets Result.
 * @param {String} value result value
 */
dcc.cellctl.Event.prototype.setResult = function(value) {
  this.result = value;
};

///**
//* JSON文字列化.
//* @return {?} JSON文字列
//*/
/**
 * This method creates JSON of Event values.
 * @return {Object} JSON object
 */
dcc.cellctl.Event.prototype.toJSON = function() {
  var json = {};
  json.action = this.action;
  json.level = this.level;
  json.object = this.object;
  json.result = this.result;
  return json;
};

/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class EventのCRUDためのクラス.
//* @constructor
//*/
/**
 * It creates a new object dcc.cellctl.EventManager.
 * @class This class performs the CRUD operations for Event object.
 * @constructor
 * @param {dcc.Accessor} as Accessor
 */
dcc.cellctl.EventManager = function(as) {
  this.initializeProperties(this, as);
};

///**
//* プロパティを初期化する.
//* @param {dcc.cellctl.EventManager} self
//* @param {dcc.Accessor} as アクセス主体
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.cellctl.EventManager} self
 * @param {dcc.Accessor} as Accessor
 */
dcc.cellctl.EventManager.prototype.initializeProperties = function(self, as) {
  if (as !== undefined) {
//  /** アクセス主体. */
    /** Access subject. */
    self.accessor = as.clone();
  }
};

///**
//* イベントを登録します.
//* @param {Object} body 登録するJSONオブジェクト
//* @param {String} requestKey RequestKeyフィールド
//* @throws {ClientException} DAO例外
//*/
/**
 * This method is used to register the event.
 * @param {Object} body JSON object to be registered
 * @param {String} requestKey RequestKey object
 * @param {Object} options Callback object
 * @throws {dcc.ClientException} DAO exception
 */
dcc.cellctl.EventManager.prototype.post = function(body, requestKey,options) {
  var url = this.getUrl();
  var headers = {};
  var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
  if ((requestKey === undefined) || (requestKey === null)) {
    restAdapter.post(url, JSON.stringify(body), "application/json",headers,options);
  } else {
    restAdapter.post(url, JSON.stringify(body), "application/json", {"X-Dc-RequestKey": requestKey},options);
  }
};

///**
//* イベントのURLを取得する.
//* @return {String} URL
//*/
/**
 * This method generates the URL for performing Event related operations.
 * @return {String} URL
 */
dcc.cellctl.EventManager.prototype.getUrl = function() {
  var sb = this.accessor.getCurrentCell().getUrl();
  sb += "__event";
  return sb;
};


/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class ExtCellのアクセスクラス.
//* @constructor
//* @augments dcc.AbstractODataContext
//*/
/**
 * It creates a new object dcc.cellctl.ExtCell.
 * @class This class represents External Cell to access its related fields.
 * @constructor
 * @augments dcc.AbstractODataContext
 * @param {dcc.Accessor} as Accessor
 * @param {Object} body
 */
dcc.cellctl.ExtCell = function(as, body) {
  this.initializeProperties(this, as, body);
};
dcc.DcClass.extend(dcc.cellctl.ExtCell, dcc.AbstractODataContext);

///**
//* コンストラクタ.
//*/
//public ExtCell() {
//super();
//}

///**
//* コンストラクタ.
//* @param as アクセス主体
//*/
//public ExtCell(final Accessor as) {
//this.initialize(as, null);
//}

///**
//* コンストラクタ.
//* @param as アクセス主体
//* @param body 生成するExtCellのJson
//*/
//public ExtCell(final Accessor as, JSONObject body) {
//this.initialize(as, body);
//}

///**
//* オブジェクトを初期化.
//* @param as アクセス主体
//* @param json サーバーから返却されたJSONオブジェクト
//*/
//public void initialize(Accessor as, JSONObject json) {

///**
//* プロパティを初期化する.
//* @param {dcc.cellctl.ExtCell} self
//* @param {dcc.Accessor} as アクセス主体
//* @param {?} json
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.cellctl.ExtCell} self
 * @param {dcc.Accessor} as Accessor
 * @param {Object} json
 */
dcc.cellctl.ExtCell.prototype.initializeProperties = function(self, as, json) {
  this.uber = dcc.AbstractODataContext.prototype;
  this.uber.initializeProperties(self, as);

  /** クラス名. */
  self.CLASSNAME = "ExtCell";

  /** url. */
  self.url = null;

  /** Roleとのリンクマネージャ. */
  self.role = null;
  /** Relationとのリンクマネージャ. */
  self.relation = null;

  if (json !== null) {
    self.rawData = json;
    self.url = json.Url;
  }
  if (as !== undefined) {
    self.role = new dcc.cellctl.LinkManager(as, this, "Role");
    self.relation = new dcc.cellctl.LinkManager(as, this, "Relation");
  }
};

///**
//* urlの設定.
//* @param {String} value URL値
//*/
/**
 * This method sets the URL to perform operations on External Cell.
 * @param {String} value URL value
 */
dcc.cellctl.ExtCell.prototype.setUrl = function(value) {
  this.url = value;
};

///**
//* urlの取得.
//* @return {String} Role名
//*/
/**
 * This method gets the URL to perform operations on External Cell.
 * @return {String} URL value
 */
dcc.cellctl.ExtCell.prototype.getUrl = function() {
  return this.url;
};

///**
//* ODataのキーを取得する.
//* @return {String} ODataのキー情報
//*/
/**
 * This method returns the Odata key.
 * @return {String} Key information of OData
 */
dcc.cellctl.ExtCell.prototype.getKey = function() {
  return "('" + encodeURIComponent(this.url) +"')";
};

///**
//* クラス名をキャメル型で取得する.
//* @return ODataのキー情報
//*/
/**
 * This method returns the class name.
 * @return {String} OData class name
 */
dcc.cellctl.ExtCell.prototype.getClassName = function() {
  return this.CLASSNAME;
};


/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class ExtCellのCRUDのためのクラス.
//* @constructor
//* @augments dcc.box.odata.ODataManager
//*/
/**
 * It creates a new object dcc.cellctl.ExtCellManager.
 * @class This class performs CRUD operations for External Cell.
 * @constructor
 * @augments dcc.box.odata.ODataManager
 * @param {dcc.Accessor} as Accessor
 */
dcc.cellctl.ExtCellManager = function(as) {
  this.initializeProperties(this, as);
};
dcc.DcClass.extend(dcc.cellctl.ExtCellManager, dcc.box.odata.ODataManager);

///**
//* プロパティを初期化する.
//* @param {dcc.cellctl.ExtCellManager} self
//* @param {dcc.Accessor} as アクセス主体
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.cellctl.ExtCellManager} self
 * @param {dcc.Accessor} as Accessor object
 */
dcc.cellctl.ExtCellManager.prototype.initializeProperties = function(self, as) {
  this.uber = dcc.box.odata.ODataManager.prototype;
  this.uber.initializeProperties(self, as);
};

///**
//* URLを取得する.
//* @return {String} URL
//*/
/**
 * This method returns the URL for performing operations on External Cell.
 * @return {String} URL
 */
dcc.cellctl.ExtCellManager.prototype.getUrl = function() {
  var sb = "";
  sb += this.getBaseUrl();
  sb += this.accessor.cellName;
  sb += "/__ctl/ExtCell";
  return sb;
};

///**
//* ExtCellを作成.
//* @param body requestBody
//* @return {dcc.cellctl.ExtCell}ExtCellオブジェクト
//* @throws {ClientException} DAO例外
//*/

/**
 * This method creates an External Cell.
 * @param {Object} body requestBody
 * @param {Object} options object
 * @return {dcc.cellctl.ExtCell}ExtCell object
 * @throws {dcc.ClientException} DAO exception
 */
dcc.cellctl.ExtCellManager.prototype.create = function(body, options) {
  var requestBody = JSON.stringify(body);
  var callbackExist = options !== undefined &&
  (options.success !== undefined ||
      options.error !== undefined ||
      options.complete !== undefined);
  if (callbackExist) {
    var headers = {};
    this._internalCreate(requestBody, headers, options);
  } else {
    var json = this._internalCreate(requestBody);
    //if(json.response !== undefined){if(json.response.status === 409){return json.response.status;}}
    /*    if(json.getStatusCode() >= 400){
      var response = json.bodyAsJson();
      //throw exception with code PR409-OD-0003
      throw new dcc.ClientException(response.message.value, response.code);
    }
    else if(json !== undefined){
      //showMessage(idModalWindow,isExternalCellCreatedFromSameUser,cellName);
    } */
    var responseJson = json.bodyAsJson().d.results;
    return new dcc.cellctl.ExtCell(this.accessor, responseJson);
  }
};
///**
//* The purpose of this method is to display messages on successful registration of external cell.
//*/
/*function showMessage(idModalWindow,isExternalCellCreatedFromSameUser,entity) {
	addSuccessClass();
	inlineMessageBlock();
	var objCommon = new common();
	var shorterExternalCellName = objCommon.getShorterEntityName(entity);
	if (isExternalCellCreatedFromSameUser === true) {
		document.getElementById("successmsg").innerHTML = "External Cell "+ shorterExternalCellName + " successfully registered!";
		document.getElementById("successmsg").title = entity;
	}
	else if (isExternalCellCreatedFromSameUser === false) {
		document.getElementById("successmsg").innerHTML = "External Cell 'Library' successfully registered !";
	}
	$(idModalWindow + ", .window").hide();
	autoHideMessage();
}*/
///**
//* ExtCellを作成.
//* @param body リクエストボディ
//* @return 作成したExtCellオブジェクト
//* @throws {ClientException} DAO例外
//*/
//dcc.cellctl.ExtCellManager.prototype.createAsMap = function() {
//var json = internalCreate(body);
//return new dcc.cellctl.ExtCell(accessor, json);
//};
///**
//* ExtCellを取得.
//* @param {String} roleId 取得対象のRoleId
//* @return {dcc.cellctl.ExtCell} 取得したしたExtCellオブジェクト
//* @throws {ClientException} DAO例外
//*/
/**
 * This method performs retrieve operation on External Cell.
 * @param {String} roleId RoleId
 * @param {Object} options object has callback and headers
 * @return {dcc.cellctl.ExtCell} ExtCell object
 * @throws {dcc.ClientException} DAO exception
 */
dcc.cellctl.ExtCellManager.prototype.retrieve = function(roleId, options) {
  /*valid option is present with atleast one callback*/
  var callbackExist = options !== undefined &&
  (options.success !== undefined ||
      options.error !== undefined ||
      options.complete !== undefined);

  if (callbackExist) {
    this._internalRetrieve(roleId, options);
    return;
  }
  var json = this._internalRetrieve(roleId);
  return new dcc.cellctl.ExtCell(this.accessor, json);
};

/**
 * The purpose of this function is to get etag
 * @param {String} id
 * @return {String} etag
 */
dcc.cellctl.ExtCellManager.prototype.getEtag = function (id) {
  var json = this._internalRetrieve(id);
  return json.__metadata.etag;
};

/**
 * The purpose of this method is to perform delete operation for external cell.
 * @param {String} externalCellUrl
 * @param {String} etagOrOptions ETag value or options object having callback and headers
 * return {dcc.Promise} promise
 */
dcc.cellctl.ExtCellManager.prototype.del = function(externalCellUrl, etagOrOptions) {
  var key = externalCellUrl;
  var response = this._internalDel(key, etagOrOptions);
  return response;
};

/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

/**
 * It creates a new object dcc.cellctl.ExtRoleManager.
 * @class This class performs CRUD operations for External Role.
 * @constructor
 * @augments dcc.box.odata.ODataManager
 * @param {dcc.Accessor} as Accessor
 */
dcc.cellctl.ExtRoleManager = function(as) {
  this.initializeProperties(this, as);
};
dcc.DcClass.extend(dcc.cellctl.ExtRoleManager, dcc.box.odata.ODataManager);

/**
 * This method initializes the properties of this class.
 * @param {dcc.cellctl.ExtRoleManager} self
 * @param {dcc.Accessor} as
 */
dcc.cellctl.ExtRoleManager.prototype.initializeProperties = function(self, as) {
  this.uber = dcc.box.odata.ODataManager.prototype;
  this.uber.initializeProperties(self, as);
};


/**
 * The purpose of this function is to make request URL for
 * creating External Role.
 * @return {String} URL
 */
dcc.cellctl.ExtRoleManager.prototype.getUrl = function() {
  var sb = this.getBaseUrl();
  sb += this.accessor.cellName;
  sb += "/__ctl/ExtRole";
  return sb;
};

/**
 * The purpose of this function is to create External Role.
 * @param {Object} obj contains external role URLm relation name, relation box name
 * @param {Object} options
 * @return {dcc.http.DcHttpClient} response
 * @throws {dcc.ClientException} Exception thrown
 */
dcc.cellctl.ExtRoleManager.prototype.create = function(obj,options) {
  var body = {};
  body.ExtRole = obj.ExtRoleURL;
  body["_Relation.Name"] = obj.RelationName;
  body["_Relation._Box.Name"] = obj.RelationBoxName;
  var requestBody = JSON.stringify(body);
  var callbackExist = options !== undefined &&
  (options.success !== undefined ||
      options.error !== undefined ||
      options.complete !== undefined);
  if (callbackExist) {
    var headers = {};
    this._internalCreate(requestBody,headers,options);
  } else {
    var json = this._internalCreate(requestBody);
    /*    if (json.getStatusCode() >= 400) {
      var response = json.bodyAsJson();// throw exception with code
      throw new dcc.ClientException(response.message.value, response.code);
    }*/
    return json;
  }
};


/**
 * The purpose of this function is to retrieve External Role.
 * @param {String} id
 * @param {Object} options object has callback and headers
 * @return {Object} JSON response
 */
dcc.cellctl.ExtRoleManager.prototype.retrieve = function(id, options) {
  /*valid option is present with atleast one callback*/
  var callbackExist = options !== undefined &&
  (options.success !== undefined ||
      options.error !== undefined ||
      options.complete !== undefined);

  if(callbackExist) {
    this._internalRetrieve(id, options);
    return;
  }
  var json = this._internalRetrieve(id);
  return json;
};

/**
 * The purpose of this function is to delete external role on the basis of key.
 * @param {String} key
 * @param {String} etag
 * @returns {dcc.Promise} response
 */
dcc.cellctl.ExtRoleManager.prototype.del = function(key,etag) {
  var response = this._internalDelMultiKey(key, etag);
  return response;
};

/**
 * The purpose of this function is to return etag value of
 * particular external role
 * @param {String} key
 * @returns {String} etag
 */
dcc.cellctl.ExtRoleManager.prototype.getEtag = function(key) {
  var json = this._internalRetrieveMultikey(key);
  return json.__metadata.etag;
};

/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

/**
 * It creates a new object dcc.cellctl.LinkManager.
 * @class This class performs CRUD operations on link between two cell control objects.
 * @constructor
 * @param {dcc.Accessor} as Accessor
 * @param {dcc.AbstractODataContext} cx context reference
 * @param {String} className name of the class
 */
dcc.cellctl.LinkManager = function(as, cx, className) {
  this.initializeProperties(this, as, cx, className);
};

///**
//* プロパティを初期化する.
//* @param {dcc.cellctl.LinkManager} self
//* @param {dcc.Accessor} as アクセス主体
//* @param {dcc.DcContext} cx ターゲットオブジェクト
//* @param className
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.cellctl.LinkManager} self
 * @param {dcc.Accessor} as Accessor
 * @param {dcc.DcContext} cx Target object
 * @param {String} className
 */
dcc.cellctl.LinkManager.prototype.initializeProperties = function(self, as, cx, className) {
///** アクセス主体. */
  /** Accessor object. */
  self.accessor = as;

///** リンク主体. */
  /** Link subject. */
  self.context = cx;

///** リンク先名. */
  /** Class name in camel case. */
  self.className = className;
};

///**
//* リンクを作成.
//* @param {?} cx リンクさせるターゲットオブジェクト
//* @throws {ClientException} DAO例外
//*/
/**
 * This method creates a link between two cell control objects.
 * @param {Object} cx Target object to be linked
 * @param {Object} options Callback options
 * @throws {dcc.ClientException} DAO exception
 */
dcc.cellctl.LinkManager.prototype.link = function(cx,options) {
  var uri = this.getLinkUrl(cx);
  var body = {};
  body.uri = cx.getODataLink();
  var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
  var callbackExist = options !== undefined &&
  (options.success !== undefined ||
      options.error !== undefined ||
      options.complete !== undefined);
  if (callbackExist) {
    restAdapter.post(uri, JSON.stringify(body), "application/json",{},options);
  } else {
    restAdapter.post(uri, JSON.stringify(body), "application/json");
  }
};


///**
//* リンクを削除unlink.
//* @param {?} cx リンク削除するターゲットオブジェクト
//* @param callback parameter
//* @throws {ClientException} DAO例外
//*/
/**
 * This method deletes the link between two cell control objects.
 * @param {Object} cx Target object for which link is to be deleted
 * @param {Object} callback parameter
 * @throws {dcc.ClientException} DAO exception
 */
dcc.cellctl.LinkManager.prototype.unlink = function(cx,callback) {
  var uri = this.getLinkUrl(cx);
  var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
  var optionsOrEtag = null;
  restAdapter.del(uri + cx.getKey(),optionsOrEtag,callback);
};

/**
 * This method performs Query search by appending query string to URL and
 * returns object.
 * @param {dcc.box.odata.DcQuery} query
 * @param {Object} callback object
 * @return {Object} JSON object
 */
dcc.cellctl.LinkManager.prototype.doSearch = function(query, callback) {
  var url = this.getLinkUrl();
  var qry = query.makeQueryString();
  if ((qry !== null) && (qry !== "")) {
    url += "?" + qry;
  }
  var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
  if (callback !== undefined) {
    restAdapter.get(url, "application/json", "*", function(resp) {
      var responseBody = resp.bodyAsJson();
      var json = responseBody.d.results;
      callback(json);
    });
  } else {
    restAdapter.get(url, "application/json", "*" );
    var json = restAdapter.bodyAsJson().d.results;
    return json;
  }
};

/**
 * This method performs Query search by appending query string to URL and
 * returns ODataResponse.
 * @param {dcc.box.odata.DcQuery} query
 * @param {Object} callback success, error or complete callback
 * @return {dcc.box.odata.ODataResponse} Response
 */
dcc.cellctl.LinkManager.prototype.doSearchAsResponse = function(query, callback) {
  var url = this.getLinkUrl();
  var qry = query.makeQueryString();
  if ((qry !== null) && (qry !== "")) {
    url += "?" + qry;
  }
  var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
  if (callback !== undefined) {
    restAdapter.get(url, "application/json", "*", function(resp) {
      var responseBody = resp.bodyAsJson();
      callback(new dcc.box.odata.ODataResponse(this.accessor, "", responseBody));
    });
  } else {
    restAdapter.get(url, "application/json", "*" );
    return new dcc.box.odata.ODataResponse(this.accessor, "", restAdapter.bodyAsJson());
  }
};

/**
 * This method generates a query.
 * @return {dcc.box.odata.DcQuery} Query object
 */
dcc.cellctl.LinkManager.prototype.query = function() {
  return new dcc.box.odata.DcQuery(this);
};

/**
 * The purpose of this method is to create URL for calling link API's.
 * @param {Object} cx
 * @return {String} URL
 */dcc.cellctl.LinkManager.prototype.getLinkUrl = function(cx) {
   var sb = this.accessor.getBaseUrl();
   var classNameForURL = null;
   sb += this.accessor.getCurrentCell().getName();
   sb += "/__ctl/";
   sb += this.context.getClassName();
   sb += this.context.getKey();
   sb += "/$links/";

   if (cx !== undefined) {
     classNameForURL = cx.getClassName();//check style fix
   } /*else {
		sb += "_" + this.className;
	}*/
   classNameForURL = this.className;
   sb += "_" + classNameForURL;
   return sb;
 };

 /**
  * The purpose of this method is to retrieve link between two entities
  * for box profile page.
  * @param {Object} cx
  * @param {String} source
  * @param {String} destination
  * @param {String} key
  * @return {Object} response
  */
 dcc.cellctl.LinkManager.prototype.retrieveBoxProfileLinks = function(cx, source,destination,key) {
   var uri = this.getLinkUrlWithKey(cx, source, destination, key);
   var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
   var response = restAdapter.get(uri, "", "application/json");
   return response;
 };

 /**
  * The purpose of this method is to create link url between two entities..
  * @param {String} cx
  * @param {String} source
  * @param {String} destination
  * @param {String} key
  * @return {String} URL
  */
 dcc.cellctl.LinkManager.prototype.getLinkUrlWithKey = function(cx, source, destination, key) {
   var sb = this.accessor.getBaseUrl();
   sb += this.accessor.cellName;
   sb += "/__ctl/";
   sb += source;
   sb += "('" + key + "')"; // account name
   sb += "/$links/";
   sb += "_" + destination;
   return sb;
 };

 /**
  * The purpose of the following method is to create Role URI.
  * @param {Object} cx
  * @param {String} source
  * @param {String} destination
  * @param {String} boxName
  * @param {String} rolename
  * @return {String} role URI
  */
 dcc.cellctl.LinkManager.prototype.getRoleUri = function(cx, source, destination,
     boxName, rolename) {
   var cBoxName = boxName;
   if (cBoxName !== null) {
     cBoxName = "'" + cBoxName + "'";
   }
   rolename = "'" + rolename + "'";
   var key = "(Name=" + rolename + ",_Box.Name=" + cBoxName + ")";
   key = key.split(" ").join("");
   var sb = this.accessor.getBaseUrl();
   sb += this.accessor.cellName;
   sb += "/__ctl/";
   sb += destination;
   if(destination === "ExtCell"){
     key = "("+rolename+ ")";
   }
   if(destination === "ExtRole"){
     var relation_box_pair = boxName.split(",");
     key = "(ExtRole=" + rolename + ",_Relation.Name='" + relation_box_pair[0].split(" ").join("") + "',_Relation._Box.Name='"+ relation_box_pair[1].split(" ").join("")+"')";
   }
   sb += key;
   //var roleuri = "{\"uri\":" + "'" + sb;
   var roleuri = "{\"uri\":" + "'" + sb;
   //var roleuri = '{\"uri\":' + '"' + sb;
   roleuri += "'}";
   // roleuri += "'}";
   return roleuri;
 };

 /**
  * The purpose of the following method is to establish link between role and account.
  * @param {Object} cx
  * @param {String} source
  * @param {String} destination
  * @param {String} key
  * @param {String} boxName
  * @param {String} rolename
  * @param {Boolean} isMultiKey
  * @param {Object} options
  * @return {Object} response
  */
 dcc.cellctl.LinkManager.prototype.establishLink = function(cx, source,
     destination, key, boxName, rolename, isMultiKey,options) {
   var uri = this.getLinkUrlWithKey(cx, source, destination, key);
   if (isMultiKey === true) {
     uri = this.getLinkUrlWithMultiKey(cx, source, destination, key);
     isMultiKey = false;
   }
   var roleuri = this.getRoleUri(cx, source, destination, boxName,
       rolename);
   var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
   var callbackExist = options !== undefined &&
   (options.success !== undefined ||
       options.error !== undefined ||
       options.complete !== undefined);
   if (callbackExist) {
     restAdapter.post(uri, roleuri, "application/json",{},options);
   } else {
     var response = restAdapter.post(uri, roleuri, "application/json");
     return response;
   }
 };

 /**
  * The purpose of the following method is to fetch the linkages between an account and roles.
  * @param {Object} cx
  * @param {String} source
  * @param {String} destination
  * @param {String} key
  * @param {String} boxName
  * @param {String} rolename
  * @return {Object} response
  */
 dcc.cellctl.LinkManager.prototype.retrieveAccountRoleLinks = function(cx, source,
     destination, key, boxName, rolename) {
   var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
   var response = "";
   var uri = "";
   if (boxName === "" || rolename === "") {
     uri = this.getLinkUrlWithKey(cx, source, destination,key);
     response = restAdapter.get(uri, "application/json");
   } else {
     uri = this.getLinkUrlWithKey(cx, source, destination,key);
     var roleuri = this.getRoleUri(cx, source, destination,boxName, rolename);
     response = restAdapter.get(uri, "application/json", roleuri);
   }
   return response;
 };

 /**
  * The purpose of the following method is to fetch the linkages between an role and account.
  * @param {Object} cx
  * @param {String} source
  * @param {String} destination
  * @param {String} key
  * @return {Object} response
  */
 dcc.cellctl.LinkManager.prototype.retrieveRoleAccountLinks = function(cx, source,destination, key) {
   var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
   var response;
   var uri = this.getLinkUrlWithMultiKey(cx, source, destination,key);
   response = restAdapter.get(uri, "", "application/json");
   return response;
 };

 /**
  * The purpose of the following method is to make the uri for retrieve account linkage.
  * @param {Object} cx
  * @param {String} source
  * @param {String} destination
  * @param {String} key
  * @return {String} link URL
  */
 dcc.cellctl.LinkManager.prototype.getLinkUrlWithMultiKey = function(cx, source, destination, key) {
   var sb = this.accessor.getBaseUrl();
   sb += this.accessor.cellName;
   sb += "/__ctl/";
   sb += source;
   sb += key ; // Combination of role and box name
   sb += "/$links/";
   sb += "_" + destination;
   return sb;
 };


 /**
  * The purpose of the following method is to unlink two cell control objects.
  * @param {Object} cx
  * @param {String} source end of the mapping - Relation, ExtRole,Role
  * @param {String} destination end of the mapping - ExtCell, Relation
  * @param {String} key is component of final URL
  * @param {String} boxName is associated box name
  * @param {String} roleName optional
  * @param {Object} options optional
  * @return {Object} response
  */
 dcc.cellctl.LinkManager.prototype.delLink = function(cx, source,
     destination, key, boxName, roleName, options) {
   var uri = null;
   var response = "";
   var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
   //source is Relation or ExtRole and destination is ExtCell
   if(source === "Relation" || source === "ExtRole"){
     uri = this.getLinkUrlWithMultiKey(cx, source, destination, key);
     if (destination === "ExtCell"){
       uri += "(Url='" + boxName  + "')";
       response = restAdapter.del(uri, options, "");
       return response;
     }//unlink Role to Relation or ExtCell Mapping
   } else if (source === "Role") {
     uri = this.getLinkUrlWithMultiKey(cx, source, destination, key, boxName);
     //Role-Relation delete scenario
     if(destination === "Relation"){
       uri += boxName  ;
       response = restAdapter.del(uri, options, "");
       return response;
     }
     if(destination === "ExtCell"){
       uri += "(Url='" + boxName  + "')";
       response = restAdapter.del(uri, options, "");
       return response;
     }
     uri += "(Name='" + boxName  + "')";
     response = restAdapter.del(uri, options, "");
     return response;
   } else{
     uri = this.getLinkUrlWithKey(cx, source, destination,key);
     uri += "(Name='" + roleName + "'";
     if (boxName == "null") {
       uri += ",_Box.Name=" + boxName + ")";
     }
     else {
       uri += ",_Box.Name='" + boxName + "')";
     }
     response = restAdapter.del(uri, options, "");
     return response;
   }
 };

 /**
  * The purpose of this method is to generate url for creating a link between external cell and relation.
  * @param {Object} cx
  * @param {String} source
  * @param {String} destination
  * @param {String} extCellURL
  * @return {String} URL
  */
 dcc.cellctl.LinkManager.prototype.getLinkUrlForExtCell = function(cx, source, destination, extCellURL) {
   var sb = this.accessor.getBaseUrl();
   sb += this.accessor.cellName;
   sb += "/__ctl/";
   sb += source;
   var key = "'"+ extCellURL +"'";
   sb +=  "(" + encodeURIComponent( key) + ")";
   sb += "/$links/";
   sb += "_" + destination;
   return sb;
 };

 /**
  * The purpose of the following method is to establish link between role and account.
  * @param {Object} cx
  * @param {String} source
  * @param {String} destination
  * @param {String} extCellURL
  * @param {String} boxName
  * @param {String} relName
  * @param {Object} options
  * @return {dcc.http.DcHttpClient} response
  */
 dcc.cellctl.LinkManager.prototype.externalCellRelationlink = function(cx, source,
     destination, extCellURL, boxName, relName,options) {
   var uri = this
   .getLinkUrlForExtCell(cx, source, destination, extCellURL, relName, boxName);
   var externalCellURI = this.getRoleUri(cx, source, destination, boxName, relName);
   var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
   if (options !== undefined) {
     restAdapter.post(uri, externalCellURI, "application/json",{},options);
   } else {
     var response = restAdapter.post(uri, externalCellURI, "application/json");
     return response;
   }
 };

 /**
  * The purpose of the following method is to fetch the linkages between an external cell and relation.
  * @param {Object} cx
  * @param {String} source
  * @param {String} destination
  * @param {String} extCellURL
  * @param {String} boxName
  * @param {String] relName
  * @return {dcc.http.DcHttpClient} response
  */
 dcc.cellctl.LinkManager.prototype.retrieveExtCellRelLinks = function(cx, source,
     destination, extCellURL, boxName, relName) {
   var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
   var response;
   var uri = this.getLinkUrlForExtCell(cx, source, destination, extCellURL, relName, boxName);
   response = restAdapter.get(uri, "", "application/json");
   return response;
 };
/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class OData関連の各機能を生成/削除するためのクラスの抽象クラス.
//* @constructor
//*/
/**
 * It creates a new object dcc.box.odata.ODataLinkManager.
 * @class This is the abstract class for generating / deleting the OData related functions.
 * @constructor
 * @param {dcc.Accessor} as Accessor
 * @param {dcc.AbstractODataContext} cx abstractODataContext
 * @param {String} className
 */
dcc.box.odata.ODataLinkManager = function(as, cx, className) {
  this.initializeProperties(this, as, cx, className);
};
dcc.DcClass.extend(dcc.box.odata.ODataLinkManager, dcc.cellctl.LinkManager);

///**
//* プロパティを初期化する.
//* @param {dcc.box.odata.ODataLinkManager} self
//* @param {dcc.Accessor} as アクセス主体
//* @param {?} cx ターゲットオブジェクト
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.box.odata.ODataLinkManager} self
 * @param {dcc.Accessor} as Accessor
 * @param {Object} cx Target object
 * @param {String} className name of the class
 */
dcc.box.odata.ODataLinkManager.prototype.initializeProperties = function(self, as, cx, className) {
  this.uber = dcc.cellctl.LinkManager.prototype;
  this.uber.initializeProperties(self, as, cx, className);
};

///**
//* リンクを削除.
//* @param {?} cx リンク削除するターゲットオブジェクト
//* @throws {ClientException} DAO例外
//*/
/**
 * This method is used to remove a link.
 * @param {Object} cx Target object for removing the link
 * @param {Object} options optional object having callback and headers
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.odata.ODataLinkManager.prototype.unlink = function(cx, options) {
  var uri = this.getLinkUrl(cx);

  var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
  restAdapter.del(uri + cx.getKey(),options);
};

/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class ODataのBatchLinksEntityクラス.
//* @constructor
//*/
/**
 * It creates a new object dcc.box.odata.BatchLinksEntity.
 * @class BatchLinksEntity class of OData.
 * @constructor
 * @param {String} entitySetName
 * @param {String} id
 * @param {dcc.Accessor} as Accessor
 * @param {String} collectionUrl
 */
dcc.box.odata.BatchLinksEntity = function(entitySetName, id, as, collectionUrl) {
  this.initializeProperties(this, entitySetName, id, as, collectionUrl);
};

///**
//* プロパティを初期化する.
//* @param {dcc.AbstractODataContext} self
//* @param {String} entitySetName EntitySet名
//* @param {String} id Entityの__id
//* @param {dcc.Accessor} as アクセス主体
//* @param {String} collectionUrl ODataコレクションのURL
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.AbstractODataContext} self
 * @param {String} entitySetName EntitySet Name
 * @param {String} id __id Of Entity
 * @param {dcc.Accessor} as Accessor
 * @param {String} collectionUrl URL of OData collection
 */
dcc.box.odata.BatchLinksEntity.prototype.initializeProperties = function(self,
    entitySetName, id, as, collectionUrl) {
  if (typeof entitySetName !== "string" || typeof id !== "string") {
    throw new dcc.ClientException("InvalidParameter");
  }
  this.entitySetName = entitySetName;
  this.id = id;
  if (typeof as !== "undefined") {
    if (typeof collectionUrl !== "string") {
      throw new dcc.ClientException("InvalidParameter");
    }
    this.collectionUrl = collectionUrl;
    this.entity = new dcc.cellctl.LinkManager(as, this);
  }
};

///**
//* ODataコレクションのURLを取得.
//* @return ODataコレクションのURL
//*/
/**
 * This method gets the URL of the OData collection.
 * @return {String} collectionUrl URL of OData collection
 */
dcc.box.odata.BatchLinksEntity.prototype.getCollectionUrl = function() {
  return this.collectionUrl;
};
/**
 * This method gets the key of the OData collection.
 * @return {String} key of OData collection
 */
dcc.box.odata.BatchLinksEntity.prototype.getKey = function() {
  return "('" + this.id + "')";
};
/**
 * This method gets the class name of the OData collection.
 * @return {String} entitySetName of OData collection
 */
dcc.box.odata.BatchLinksEntity.prototype.getClassName = function() {
  return this.entitySetName;
};
/**
 * This method gets the odata link of the OData collection.
 * @return {String} odata link of OData collection
 */
dcc.box.odata.BatchLinksEntity.prototype.getODataLink = function() {
  if (this.collectionUrl == null) {
    // $links先用
    /** $ links-destination */
    return "/" + this.entitySetName + this.getKey();
  } else {
    // $links元用
    /** $ links for sources */
    return this.entitySetName + this.getKey();
  }
};
/**
 * This method creates url for odata collection.
 * @returns {String} URL
 */
dcc.box.odata.BatchLinksEntity.prototype.makeUrlForLink = function() {
  var url = this.getODataLink();
  url += "/$links/";
  return url;
};

/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class Boxへアクセスするためのクラス.
//* @constructor
//* @augments dcc.AbstractODataContext
//*/
/**
 * It creates a new object dcc.cellctl.Message.
 * @class This class represents Message object for Sent and Received Messages functionality.
 * @constructor
 * @augments dcc.AbstractODataContext
 * @param {dcc.Accessor} as Accessor
 * @param {Object} json
 */
dcc.cellctl.Message = function(as, json) {
  this.initializeProperties(this, as, json);
};
dcc.DcClass.extend(dcc.cellctl.Message, dcc.AbstractODataContext);

///**
//* プロパティを初期化する.
//* @param {dcc.cellctl.Message} self
//* @param {dcc.Accessor} as アクセス主体
//* @param {Object} json JSONオブジェクト
//* @param {?} path
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.cellctl.Message} self
 * @param {dcc.Accessor} as Accessor
 * @param {Object} json JSON object
 */
dcc.cellctl.Message.prototype.initializeProperties = function(self, as, json) {
  this.uber = dcc.AbstractODataContext.prototype;
  this.uber.initializeProperties(self, as);

///** 送信メッセージのマネージャクラス. */
  /** Manager class of outgoing messages. */
  self.sent = null;
///** 受信メッセージのマネージャクラス. */
  /** Manager class of the incoming messages. */
  self.received = null;

  if (json !== undefined && json !== null) {
    self.body = json;
    if (json.__id !== undefined) {
      self.messageId = json.__id;
    }
  }

  if (as !== undefined) {
    self.sent = new dcc.cellctl.SentMessageManager(as, this);
    self.received = new dcc.cellctl.ReceivedMessageManager(as, this);
  }
};

///**
//* ボディを取得.
//* @return {?} ボディ
//*/
/**
 * This method returns the json as body.
 * @return {Object} Body
 */
dcc.cellctl.Message.prototype.getBody = function() {
  return this.body;
};

/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class メッセージの送受信のためのクラス.
//* @constructor
//* @augments dcc.box.odata.ODataManager
//*/
/**
 * It creates a new object dcc.cellctl.MessageManager.
 * @class This class is used for sending and receiving messages.
 * @constructor
 * @augments dcc.box.odata.ODataManager
 * @param {dcc.Accessor} as Accessor
 */
dcc.cellctl.MessageManager = function(as) {
  this.initializeProperties(this, as);
};
dcc.DcClass.extend(dcc.cellctl.MessageManager, dcc.box.odata.ODataManager);

///**
//* プロパティを初期化する.
//* @param {dcc.cellctl.MessageManager} self
//* @param {dcc.Accessor} as アクセス主体
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.cellctl.MessageManager} self
 * @param {dcc.Accessor} as Accessor
 */
dcc.cellctl.MessageManager.prototype.initializeProperties = function(self, as) {
  this.uber = dcc.box.odata.ODataManager.prototype;
  this.uber.initializeProperties(self, as);

///** 送信メッセージのマネージャクラス. */
  /** Manager class of outgoing messages. */
  self.sent = null;
///** 受信メッセージのマネージャクラス. */
  /** Manager class of incoming messages. */
  self.received = null;

  if (as !== undefined) {
    self.sent = new dcc.cellctl.SentMessageManager(as, this);
    self.received = new dcc.cellctl.ReceivedMessageManager(as);
  }
};

///**
//* URLを取得する.
//* @returns {String} URL
//*/
/**
 * This method returns the URL for sending messages.
 * @returns {String} URL
 */
dcc.cellctl.MessageManager.prototype.getUrl = function() {
  var sb = "";
  sb += this.getBaseUrl();
  sb += this.accessor.getCurrentCell().getName();
  sb += "/__message/send";
  return sb;
};

///**
//* 送信メッセージオブジェクトを作成.
//* @param {object} json Jsonオブジェクト
//* @return {dcc.cellctl.Message} メッセージオブジェクト
//* @throws {ClientException} DAO例外
//*/
//dcc.cellctl.MessageManager.prototype.sendMail = function(json) {

////String boxBound
////,String inReplyTo
////,String to
////,String toRelation
////,String title
////,String body
////,int priority

//return new dcc.cellctl.Message(this.accessor, json);
//};

///**
//* メッセージを送信する.
//* @param {dcc.cellctl.Message} message 送信するメッセージオブジェクト
//* @return {dcc.cellctl.Message} 取得したメッセージオブジェクト
//* @throws {ClientException} DAO例外
//*/
/**
 * This method is used to send a message.
 * @param {dcc.cellctl.Message} message Message object to be sent
 * @param {Object} options Callback object.
 * @return {dcc.cellctl.Message} Message object received
 * @throws {dcc.ClientException} DAO exception
 */
dcc.cellctl.MessageManager.prototype.send = function(message,options) {
  var responseJson = {};
  var requestBody = JSON.stringify(message);
  var callbackExist = options !== undefined &&
  (options.success !== undefined ||
      options.error !== undefined ||
      options.complete !== undefined);
  if (callbackExist) {
    this._internalCreate(requestBody,{},options);
  } else {
    var json = this._internalCreate(requestBody);
    var responseBody = json.bodyAsJson();
    if (responseBody.d !== undefined && responseBody.d.results !== undefined) {
      responseJson = responseBody.d.results;
    }
    return new dcc.cellctl.Message(this.accessor, responseJson);
  }
};

///**
//* メッセージを既読にする.
//* @param {String} messageId メッセージID
//* @return {dcc.cellctl.Message} 取得したメッセージオブジェクト
//* @throws {ClientException} DAO例外
//*/
/**
 * This method is used to read a message.
 * @param {String} messageId messageID
 * @param {Object} options Callback object.
 * @return {dcc.cellctl.Message} Message object obtained
 * @throws {dcc.ClientException} DAO exception
 */
dcc.cellctl.MessageManager.prototype.changeMailStatusForRead = function(messageId,options) {
  var statusManager = new dcc.cellctl.MessageStatusManager(this.accessor, messageId);
  return statusManager.changeMailStatusForRead(options);
};

///**
//* メッセージを未読にする.
//* @param {String} messageId メッセージID
//* @return {dcc.cellctl.Message} 取得したメッセージオブジェクト
//* @throws {ClientException} DAO例外
//*/
/**
 * This method is used to unread a message.
 * @param {String} messageId messageID
 * @param {Object} options Callback object.
 * @return {dcc.cellctl.Message} Message object obtained
 * @throws {dcc.ClientException} DAO exception
 */
dcc.cellctl.MessageManager.prototype.changeMailStatusForUnRead = function(messageId,options) {
  var statusManager = new dcc.cellctl.MessageStatusManager(this.accessor, messageId);
  return statusManager.changeMailStatusForUnRead(options);
};

///**
//* メッセージを承認する.
//* @param {String} messageId メッセージID
//* @return {dcc.cellctl.Message} 取得したメッセージオブジェクト
//* @throws {ClientException} DAO例外
//*/
/**
 * This method is used to approve a message.
 * @param {String} messageId messageID
 * @param {Object} options Callback object.
 * @return {dcc.cellctl.Message} Message object obtained
 * @throws {dcc.ClientException} DAO exception
 */
dcc.cellctl.MessageManager.prototype.approveConnect = function(messageId,options) {
  var statusManager = new dcc.cellctl.MessageStatusManager(this.accessor, messageId);
  return statusManager.approveConnect(options);
};

///**
//* メッセージを拒否する.
//* @param {String} messageId メッセージID
//* @return {dcc.cellctl.Message} 取得したメッセージオブジェクト
//* @throws {ClientException} DAO例外
//*/
/**
 * This method is used to reject a message.
 * @param {String} messageId messageID
 * @param {Object} options Callback object.
 * @return {dcc.cellctl.Message} Message object obtained
 * @throws {dcc.ClientException} DAO exception
 */
dcc.cellctl.MessageManager.prototype.rejectConnect = function(messageId,options) {
  var statusManager = new dcc.cellctl.MessageStatusManager(this.accessor, messageId);
  return statusManager.rejectConnect(options);
};

/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class メッセージの送受信のためのクラス.
//* @constructor
//* @augments dcc.box.odata.ODataManager
//*/
/**
 * It creates a new object dcc.cellctl.MessageStatusManager.
 * @class This class is used for sending and receiving messages.
 * @constructor
 * @augments dcc.box.odata.ODataManager
 * @param {dcc.Accessor} as Accessor
 * @param {String} messageId
 */
dcc.cellctl.MessageStatusManager = function(as, messageId) {
  this.initializeProperties(this, as, messageId);
};
dcc.DcClass.extend(dcc.cellctl.MessageStatusManager, dcc.box.odata.ODataManager);

///**
//* プロパティを初期化する.
//* @param {dcc.cellctl.MessageStatusManager} self
//* @param {dcc.Accessor} as アクセス主体
//* @param {string} messageId メッセージID
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.cellctl.MessageStatusManager} self
 * @param {dcc.Accessor} as Accessor
 * @param {string} messageId messageID
 */
dcc.cellctl.MessageStatusManager.prototype.initializeProperties = function(self, as, messageId) {
  this.uber = dcc.box.odata.ODataManager.prototype;
  this.uber.initializeProperties(self, as);

  self.messageId = messageId;
};

///**
//* URLを取得する.
//* @returns {String} URL
//*/
/**
 * This method returns the URL for receiving messages.
 * @returns {String} URL
 */
dcc.cellctl.MessageStatusManager.prototype.getUrl = function() {
  var sb = "";
  sb += this.getBaseUrl();
  sb += this.accessor.getCurrentCell().getName();
  sb += "/__message/received/";
  sb += this.messageId;
  return sb;
};

///**
//* メッセージを既読にする.
//* @return {dcc.cellctl.Message} 取得したメッセージオブジェクト
//* @throws {ClientException} DAO例外
//*/
/**
 * This method is used to read a message.
 * @param {Object} options Callback object.
 * @return {dcc.cellctl.Message} Message object obtained
 * @throws {dcc.ClientException} DAO exception
 */
dcc.cellctl.MessageStatusManager.prototype.changeMailStatusForRead = function(options) {
  var requestBody = {"Command" : "read"};
  if (options!== undefined) {
    this._internalCreate(JSON.stringify(requestBody),{},options);
  } else {
    var json = this._internalCreate(JSON.stringify(requestBody));
    return new dcc.cellctl.Message(this.accessor, json);
  }
};

///**
//* メッセージを未読にする.
//* @return {dcc.cellctl.Message} 取得したメッセージオブジェクト
//* @throws {ClientException} DAO例外
//*/
/**
 * This method is used to unread a message.
 * @param {Object} options Callback object.
 * @return {dcc.cellctl.Message} Message object obtained
 * @throws {dcc.ClientException} DAO exception
 */
dcc.cellctl.MessageStatusManager.prototype.changeMailStatusForUnRead = function(options) {
  var requestBody = {"Command" : "unread"};
  if (options!== undefined) {
    this._internalCreate(JSON.stringify(requestBody),{},options);
  } else {
    var json = this._internalCreate(JSON.stringify(requestBody));
    return new dcc.cellctl.Message(this.accessor, json);
  }
};

///**
//* メッセージを承認する.
//* @return {dcc.cellctl.Message} 取得したメッセージオブジェクト
//* @throws {ClientException} DAO例外
//*/
/**
 * This method is used to approve a message.
 * @param {Object} options Callback object.
 * @return {dcc.cellctl.Message} Message object obtained
 * @throws {dcc.ClientException} DAO exception
 */
dcc.cellctl.MessageStatusManager.prototype.approveConnect = function(options) {
  var requestBody = {"Command" : "approved"};
  if (options!== undefined) {
    this._internalCreate(JSON.stringify(requestBody),{},options);
  } else {
    var json = this._internalCreate(JSON.stringify(requestBody));
    return new dcc.cellctl.Message(this.accessor, json);
  }
};

///**
//* メッセージを拒否する.
//* @return {dcc.cellctl.Message} 取得したメッセージオブジェクト
//* @throws {ClientException} DAO例外
//*/
/**
 * This method is used to reject a message.
 * @param {Object} options Callback object.
 * @return {dcc.cellctl.Message} Message object obtained
 * @throws {dcc.ClientException} DAO exception
 */
dcc.cellctl.MessageStatusManager.prototype.rejectConnect = function(options) {
  var requestBody = {"Command" : "rejected"};
  if (options!== undefined) {
    this._internalCreate(JSON.stringify(requestBody),{},options);
  } else {
    var json = this._internalCreate(JSON.stringify(requestBody));
    return new dcc.cellctl.Message(this.accessor, json);
  }
};

/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class メッセージの送受信のためのクラス.
//* @constructor
//* @augments dcc.box.odata.ODataManager
//*/
/**
 * It creates a new object dcc.cellctl.ReceivedMessageManager.
 * @class This class is used for sending and receiving messages.
 * @constructor
 * @augments dcc.box.odata.ODataManager
 * @param {dcc.Accessor} as Accessor
 * @param {String} message
 */
dcc.cellctl.ReceivedMessageManager = function(as, message) {
  this.initializeProperties(this, as, message);
};
dcc.DcClass.extend(dcc.cellctl.ReceivedMessageManager, dcc.box.odata.ODataManager);

///**
//* クラス名をキャメル型で取得する.
//* @return {?} ODataのキー情報
//*/
/**
 * This method gets the class name.
 * @return {String} OData Class name
 */
dcc.cellctl.ReceivedMessageManager.prototype.getClassName = function() {
  return this.CLASSNAME;
};

///**
//* ReceivedMessageManagerオブジェクトのキーを取得する.
//* @return {String} ODataのキー情報
//*/
/**
 * This method returns the key.
 * @return {String} OData Key
 */
dcc.cellctl.ReceivedMessageManager.prototype.getKey = function() {
  return "('" + this.message.messageId + "')";
};


///**
//* プロパティを初期化する.
//* @param {dcc.cellctl.ReceivedMessageManager} self
//* @param {dcc.Accessor} as アクセス主体
//* @param {dcc.cellctl.Message} メッセージオブジェクト
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.cellctl.ReceivedMessageManager} self
 * @param {dcc.Accessor} as Accessor
 * @param {dcc.cellctl.Message} message Message object
 */
dcc.cellctl.ReceivedMessageManager.prototype.initializeProperties = function(self, as, message) {

///** クラス名. */
  /** Class name in camel case. */
  self.CLASSNAME = "ReceivedMessage";


  this.uber = dcc.box.odata.ODataManager.prototype;
  this.uber.initializeProperties(self, as);
  this.message = message;
};

///**
//* URLを取得する.
//* @returns {String} URL
//*/
/**
 * This method returns the URL.
 * @returns {String} URL
 */
dcc.cellctl.ReceivedMessageManager.prototype.getUrl = function() {
  var sb = "";
  sb += this.getBaseUrl();
  sb += this.accessor.getCurrentCell().getName();
  sb += "/__ctl/ReceivedMessage";
  return sb;
};

///**
//* 受信メッセージを取得.
//* @param {String} messageId メッセージID
//* @return {dcc.cellctl.Message} 取得したメッセージオブジェクト
//* @throws {ClientException} DAO例外
//*/
/**
 * This method gets the received message.
 * @param {String} messageId MessageID
 * @param {Object} options object has callback and headers
 * @return {dcc.cellctl.Message} Message object
 * @throws {dcc.ClientException} DAO exception
 */
dcc.cellctl.ReceivedMessageManager.prototype.retrieve = function(messageId, options) {
  /*valid option is present with atleast one callback*/
  var callbackExist = options !== undefined &&
  (options.success !== undefined ||
      options.error !== undefined ||
      options.complete !== undefined);

  if(callbackExist) {
    this._internalRetrieve(messageId, options);
    return;
  }
  var json = this._internalRetrieve(messageId);
  return new dcc.cellctl.Message(this.accessor, json);
};

///**
//* ReceivedMessageManager Accountに紐づく受信メッセージ一覧または受信メッセージに紐付くAccount一覧.
//* @param {dcc.cellctl.Account} account メッセージを取得するAccount
//* accountがundefinedの場合は受信メッセージに紐付くAccount一覧を取得
//* @return {dcc.box.odata.ODataResponse} 一覧取得のレスポンス
//* @throws {ClientException} DAO例外
//*/
/**
 * Account list associated with their incoming messages or incoming message
 * list brute string to ReceivedMessageManager Account.
 * @param {dcc.cellctl.Account} account Message Account
 * Get the Account list tied with the received message if account is undefined
 * @return {dcc.box.odata.ODataResponse} Response List
 * @throws {dcc.ClientException} DAO exception
 */
dcc.cellctl.ReceivedMessageManager.prototype.listOfReadStatus = function(account) {
  var linkManager;
  if(account === undefined){
    linkManager = new dcc.cellctl.LinkManager(this.accessor, this, "AccountRead");
  }else{
    linkManager = new dcc.cellctl.LinkManager(account.accessor, account, "ReceivedMessageRead");
  }

  // $linksのinlinecountは取得できない(coreで対応していないため)
  var res = linkManager.query().inlinecount("allpages").runAsResponse();
  return res;
};

///**
//* changeMailStatusForRead Account毎の既読.
//* @param {dcc.cellctl.Account} account 既読にするAccount
//* @throws {ClientException} DAO例外
//*/
/**
 * This method reads each of changeMailStatusForRead Account.
 * @param {dcc.cellctl.Account} account Account object
 * @param {Object} options object callback object
 * @throws {dcc.ClientException} DAO exception
 */
dcc.cellctl.ReceivedMessageManager.prototype.changeMailStatusForRead = function(account,options) {
  var linkManager = new dcc.cellctl.LinkManager(this.accessor, this, "AccountRead");
  linkManager.link(account,options);
/*  if (options !== undefined) {
    linkManager.link(account,options);
    return;
  }
  linkManager.link(account);*/
};

///**
//* changeMailStatusForUnRead Account毎の未読.
//* @param {dcc.cellctl.Account} account 既読にするAccount
//* @throws {ClientException} DAO例外
//*/
/**
 * This method unreads each of changeMailStatusForRead Account.
 * @param {dcc.cellctl.Account} account Account object
 * @throws {dcc.ClientException} DAO exception
 */
dcc.cellctl.ReceivedMessageManager.prototype.changeMailStatusForUnRead = function(account) {
  var linkManager = new dcc.cellctl.LinkManager(this.accessor, this, "AccountRead");
  linkManager.unlink(account);
};

/**
 * This method delete message on the basis of messageID.
 * @param {String} messageId
 * @param {String} options
 * @returns {dcc.Promise} response
 */
dcc.cellctl.ReceivedMessageManager.prototype.del = function(messageId, options) {
  var key = "'" + messageId + "'";
  var response = this._internalDelMultiKey(key, options);
  return response;
};
/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class メッセージの送受信のためのクラス.
//* @constructor
//* @augments dcc.box.odata.ODataManager
//*/
/**
 * It creates a new object dcc.cellctl.SentMessageManager.
 * @class This class performs CRUD for SEnt Messages.
 * @constructor
 * @augments dcc.box.odata.ODataManager
 * @param {dcc.Accessor} as Accessor
 */
dcc.cellctl.SentMessageManager = function(as) {
  this.initializeProperties(this, as);
};
dcc.DcClass.extend(dcc.cellctl.SentMessageManager, dcc.box.odata.ODataManager);

///**
//* プロパティを初期化する.
//* @param {dcc.cellctl.SentMessageManager} self
//* @param {dcc.Accessor} as アクセス主体
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.cellctl.SentMessageManager} self
 * @param {dcc.Accessor} as Accessor
 */
dcc.cellctl.SentMessageManager.prototype.initializeProperties = function(self, as) {
  this.uber = dcc.box.odata.ODataManager.prototype;
  this.uber.initializeProperties(self, as);
};

///**
//* URLを取得する.
//* @returns {String} URL
//*/
/**
 * This method returns the URL.
 * @returns {String} URL
 */
dcc.cellctl.SentMessageManager.prototype.getUrl = function() {
  var sb = "";
  sb += this.getBaseUrl();
  sb += this.accessor.getCurrentCell().getName();
  sb += "/__ctl/SentMessage";
  return sb;
};

///**
//* 送信メッセージを取得.
//* @param {String} messageId メッセージID
//* @return {dcc.cellctl.Message} 取得したメッセージオブジェクト
//* @throws {ClientException} DAO例外
//*/
/**
 * This method gets the outgoing messages.
 * @param {String} messageId MessageID
 * @param {Object} options object has callback and headers
 * @return {dcc.cellctl.Message} Message object
 * @throws {dcc.ClientException} DAO exception
 */
dcc.cellctl.SentMessageManager.prototype.retrieve = function(messageId, options) {
  /*valid option is present with atleast one callback*/
  var callbackExist = options !== undefined &&
  (options.success !== undefined ||
      options.error !== undefined ||
      options.complete !== undefined);

  if(callbackExist) {
    this._internalRetrieve(messageId, options);
    return;
  }
  var json = this._internalRetrieve(messageId);
  return new dcc.cellctl.Message(this.accessor, json);
};

/**
 * This method delete message on the basis of messageID
 * @param {String} messageId
 * @param {String} options
 * @returns {dcc.Promise} response
 */
dcc.cellctl.SentMessageManager.prototype.del = function(messageId, options) {
  var key = "'" + messageId + "'";
  var response = this._internalDelMultiKey(key, options);
  return response;
};

/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class OData関連の各機能を生成/削除するためのクラスの抽象クラス.
//* @constructor
//*/
/**
 * It creates a new object dcc.cellctl.MetadataLinkManager.
 * @class This class performs link/unlink operations on metadata.
 * @constructor
 * @param {dcc.Accessor} as Accessor
 * @param {dcc.AbstractODataContext} cx
 */
dcc.cellctl.MetadataLinkManager = function(as, cx) {
  this.initializeProperties(this, as, cx);
};

///**
//* プロパティを初期化する.
//* @param {dcc.cellctl.MetadataLinkManager} self
//* @param {dcc.Accessor} as アクセス主体
//* @param {?} cx ターゲットオブジェクト
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.cellctl.MetadataLinkManager} self
 * @param {dcc.Accessor} as Accessor
 * @param {Object} cx Target object
 */
dcc.cellctl.MetadataLinkManager.prototype.initializeProperties = function(self, as, cx) {
///** アクセス主体. */
  /** Accessor. */
  self.accessor = as;

///** リンク主体. */
  /** Link subject. */
  self.context = cx;
};

///**
//* リンクを削除.
//* @param cx リンク削除するターゲットオブジェクト
//* @throws {ClientException} DAO例外
//*/
/**
 * This method is used to remove a link.
 * @param {Object} cx Target object for removing the link.
 * @throws {dcc.ClientException} DAO exception
 */
dcc.cellctl.MetadataLinkManager.prototype.unlink = function(cx) {
  var uri = this.getLinkUrl(cx);
  var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
  restAdapter.del(uri + cx.getKey());
};

///**
//* リンクを作成.
//* @param cx リンクさせるターゲットオブジェクト
//* @throws {ClientException} DAO例外
//*/
/**
 * This method is used to create a link.
 * @param {Object} cx Target object for creating the link.
 * @param {Object} options Callback object.
 * @throws {dcc.ClientException} DAO exception
 */
dcc.cellctl.MetadataLinkManager.prototype.link = function(cx,options) {
  var uri = this.getLinkUrl(cx);
  var headers ={};
  var body = {};
  body.uri = cx.getODataLink();

  var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
  //restAdapter.post(uri, JSON.stringify(body), "application/json");
  restAdapter.post(uri, JSON.stringify(body), "application/json", headers, options);
};

///**
//* $linkへのリクエストurlを生成する.
//* @param cx ターゲットのODataオブジェクト
//* @return {String} 生成したurl
//*/
/**
 * This method generates a request to the URL $ link.
 * @param {Object} cx Target object
 * @return {String} Generated URL
 */
dcc.cellctl.MetadataLinkManager.prototype.getLinkUrl = function(cx) {
  var sb = "";
  sb += this.context.getODataLink();
  sb += "/$links/";
  sb += "_" + cx.getClassName();
  return sb;
};


/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class ユニット昇格後のAccessor.
//* @constructor
//* @augments dcc.Accessor
//*/
/**
 * It creates a new object dcc.OwnerAccessor.
 * @class This class represents Accessor of the unit after promotion.
 * @constructor
 * @augments dcc.Accessor
 * @param {dcc.DcContext} dcContext
 * @param {dcc.Accessor} as Accessor
 */
dcc.OwnerAccessor = function(dcContext, as) {
  this.initializeProperties(this, dcContext, as);
};
dcc.DcClass.extend(dcc.OwnerAccessor, dcc.Accessor);

///**
//* プロパティを初期化する.
//* @param {dcc.OwnerAccessor} self
//* @param {?} dcContext コンテキスト
//* @param {dcc.Accessor} as アクセス主体
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.OwnerAccessor} self
 * @param {dcc.DcContext} dcContext Context
 * @param {dcc.Accessor} as Accessor
 */
dcc.OwnerAccessor.prototype.initializeProperties = function(self, dcContext, as) {
  this.uber = dcc.Accessor.prototype;
  this.uber.initializeProperties(self, dcContext);

  if (as !== undefined) {
    self.setAccessToken(as.getAccessToken());
    self.setAccessType(as.getAccessType());
    self.setCellName(as.getCellName());
    self.setUserId(as.getUserId());
    self.setPassword(as.getPassword());
    self.setSchema(as.getSchema());
    self.setSchemaUserId(as.getSchemaUserId());
    self.setSchemaPassword(as.getSchemaPassword());
    self.setTargetCellName(as.getTargetCellName());
    self.setTransCellToken(as.getTransCellToken());
    self.setTransCellRefreshToken(as.getTransCellRefreshToken());
    self.setBoxSchema(as.getBoxSchema());
    self.setBoxName(as.getBoxName());
    self.setBaseUrl(as.getBaseUrl());
    self.setContext(as.getContext());
    self.setCurrentCell(as.getCurrentCell());
    self.setDefaultHeaders(as.getDefaultHeaders());
  }

  // Unit昇格
  /** Unit promotion. */
  self.owner = true;

  if (dcContext !== undefined && as !== undefined) {
    self.authenticate();
    self.unit = new dcc.UnitManager(this);
  }
};


/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class Relationのアクセスクラス.
//* @constructor
//* @augments dcc.AbstractODataContext
//*/
/**
 * It creates a new object dcc.cellctl.Relation.
 * @class This class represents Relation object.
 * @constructor
 * @augments dcc.AbstractODataContext
 * @param {dcc.Accessor} as Accessor
 * @param {Object} json
 */
dcc.cellctl.Relation = function(as, json) {
  this.initializeProperties(this, as, json);
};
dcc.DcClass.extend(dcc.cellctl.Relation, dcc.AbstractODataContext);

///**
//* プロパティを初期化する.
//* @param {dcc.cellctl.Relation} self
//* @param {dcc.Accessor} as アクセス主体
//* @param {Object} json JSONオブジェクト
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.cellctl.Relation} self
 * @param {dcc.Accessor} as Accessor
 * @param {Object} json JSON object
 */
dcc.cellctl.Relation.prototype.initializeProperties = function(self, as, json) {
  this.uber = dcc.AbstractODataContext.prototype;
  this.uber.initializeProperties(self, as);

///** クラス名. */
  /** Class name in camel case. */
  self.CLASSNAME = "Relation";

///** Relation名. */
  /** Relation Name. */
  self.name = null;
  /** _box.name. */
  self.boxname = null;

///** Roleとのリンクマネージャ. */
  /** Link manager with Role. */
  self.role = null;
///** ExtCellとのリンクマネージャ. */
  /** Link manager with ExtCell. */
  self.extCell = null;

  if (json !== null) {
    self.rawData = json;
    self.name = json.Name;
    self.boxname = json["_Box.Name"];
  }
  if (as !== undefined) {
    self.role = new dcc.cellctl.LinkManager(as, this, "Role");
    self.extCell = new dcc.cellctl.LinkManager(as, this, "ExtCell");
  }
};

///**
//* Relation名の設定.
//* @param {String} value Relation名
//*/
/**
 * This method sets the Relation name.
 * @param {String} value Relation name
 */
dcc.cellctl.Relation.prototype.setName = function(value) {
  this.name = value;
};

///**
//* Relation名の取得.
//* @return {String} Relation名
//*/
/**
 * This method gets the Relation name.
 * @return {String} Relation name
 */
dcc.cellctl.Relation.prototype.getName = function() {
  return this.name;
};

///**
//* _box.name値の設定.
//* @param {String} value _box.name値
//*/
/**
 * This method sets the box name.
 * @param {String} value _box.name value
 */
dcc.cellctl.Relation.prototype.setBoxName = function(value) {
  this.boxname = value;
};

///**
//* _box.name値の取得.
//* @return {String} _box.name値
//*/
/**
 * This method gets the box name.
 * @return {String} _box.name value
 */
dcc.cellctl.Relation.prototype.getBoxName = function() {
  return this.boxname;
};

///**
//* Relationオブジェクトのキーを取得する.
//* @return {String} ODataのキー情報
//*/
/**
 * This method gets the key for Relation.
 * @return {String} Key information
 */
dcc.cellctl.Relation.prototype.getKey = function() {
  if (this.boxname !== null) {
    return "(_Box.Name='" + this.boxname + "',Name='" + this.name + "')";
  } else {
    return "(_Box.Name=null,Name='" + this.name + "')";
  }
};

///**
//* クラス名をキャメル型で取得する.
//* @return {?} ODataのキー情報
//*/
/**
 * This method returns the class name.
 * @return {String} Class name
 */
dcc.cellctl.Relation.prototype.getClassName = function() {
  return this.CLASSNAME;
};


/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class RelationのCRUDのためのクラス.
//* @constructor
//* @augments dcc.box.odata.ODataManager
//*/
/**
 * It creates a new object dcc.cellctl.RelationManager.
 * @class This class performs CRUD operations for Relation object.
 * @constructor
 * @augments dcc.box.odata.ODataManager
 * @param {dcc.Accessor} as Accessor
 */
dcc.cellctl.RelationManager = function(as) {
  this.initializeProperties(this, as);
};
dcc.DcClass.extend(dcc.cellctl.RelationManager, dcc.box.odata.ODataManager);

///**
//* プロパティを初期化する.
//* @param {dcc.AbstractODataContext} self
//* @param {dcc.Accessor} as アクセス主体
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.AbstractODataContext} self
 * @param {dcc.Accessor} as Accessor
 */
dcc.cellctl.RelationManager.prototype.initializeProperties = function(self, as) {
  this.uber = dcc.box.odata.ODataManager.prototype;
  this.uber.initializeProperties(self, as);
};

///**
//* RelationのURLを取得する.
//* @returns {String} URL
//*/
/**
 * This method generates the URL for relation operations.
 * @returns {String} URL
 */
dcc.cellctl.RelationManager.prototype.getUrl = function() {
  var sb = this.getBaseUrl();
  // HCL:-Changes done to get the cellName
  sb += this.accessor.cellName;
  sb += "/__ctl/Relation";
  return sb;
};

///**
//* Relationを作成.
//* @param {dcc.cellctl.Relation} obj Relationオブジェクト
//* @return {dcc.cellctl.Relation} Relationオブジェクト
//* @throws {ClientException} DAO例外
//*/
/**
 * This method performs create operation.
 * @param {dcc.cellctl.Relation} obj Relation object
 * @param {Object} options object
 * @return {dcc.cellctl.Relation} Relation object
 * @throws {dcc.ClientException} DAO exception
 */
dcc.cellctl.RelationManager.prototype.create = function(obj,options) {
  var json = null;
  var requestBody = JSON.stringify(obj);
  var headers = {};
  if (obj.getClassName !== undefined && obj.getClassName() === "Relation") {
    var body = {};
    body.Name = obj.getName();
    body["_Box.Name"] = obj.getBoxName();
    json = this._internalCreate(JSON.stringify(body),headers,options);
    obj.initializeProperties(obj, this.accessor, json);
    return obj;
  } //else {
  var callbackExist = options !== undefined &&
  (options.success !== undefined ||
      options.error !== undefined ||
      options.complete !== undefined);
  if (callbackExist) {
    this._internalCreate(requestBody,headers,options);
    //return new dcc.cellctl.Relation(this.accessor, json.bodyAsJson().d.results);
  } else {
    json = this._internalCreate(requestBody);
    /*    if (json.getStatusCode() >= 400) {
      var response = json.bodyAsJson();// throw exception with code
      throw new dcc.ClientException(response.message.value, response.code);
    }*/
    return new dcc.cellctl.Relation(this.accessor, json.bodyAsJson().d.results);
  }
};

///**
//* Relationを作成.
//* @param {Object} body リクエストボディ
//* @return {dcc.cellctl.Relation} 作成したRelationオブジェクト
//* @throws {ClientException} DAO例外
//*/
//dcc.cellctl.RelationManager.prototype.createAsMap = function(body) {
//var json = _internalCreate(body);
//return new dcc.cellctl.Relation(accessor, json);
//};

///**
//* Relationを取得(複合キー).
//* @param {String} relationName 取得対象のRelation名
//* @param {String}boxName 取得対象のBox名
//* @return {dcc.cellctl.Relation} 取得したRelationオブジェクト
//* @throws {ClientException} DAO例外
//*/
/**
 * This method performs retrieve operation.
 * @param {String} relationName Relation name
 * @param {String} boxName Box name
 * @param {Object} options object has callback and headers
 * @return {dcc.cellctl.Relation} Relation object
 * @throws {dcc.ClientException} DAO exception
 */
dcc.cellctl.RelationManager.prototype.retrieve = function(relationName, boxName, options) {
  /*valid option is present with atleast one callback*/
  var callbackExist = options !== undefined &&
  (options.success !== undefined ||
      options.error !== undefined ||
      options.complete !== undefined);
  var json = null;
  var key = "Name='" + relationName + "',_Box.Name='" + boxName + "'";
  if (callbackExist) {
    if (typeof boxName === "undefined") {
      this._internalRetrieve(relationName, options);
      return;
    }
    json = this._internalRetrieveMultikey(key, options);
    return;
  }
  if (typeof boxName === "undefined") {
    json = this._internalRetrieve(relationName);
    //relation doesn't exist and can be created.
    //if (json === true) {
    //  return json;
    //} else {
    return new dcc.cellctl.Relation(this.accessor, json);
    //}
  }
  json = this._internalRetrieveMultikey(key);
  //relation doesn't exist and can be created.
  //if (json === true) {
  //  return json;
  //} else {
  return new dcc.cellctl.Relation(this.accessor, json);
  //}
};

///**
//* Relation update.
//* @param {String} relationName 削除対象のRelation名
//* @param {String} boxName 削除対象のBox名
//* @param body
//* @param etag
//* @return promise
//* @throws {ClientException} DAO例外
//*/
/**
 * This method performs update operation.
 * @param {String} relationName Relation name
 * @param {String} boxName Box name
 * @param {Object} body
 * @param {String} etag
 * @param {Object} options object optional containing callback, headers
 * @return {dcc.Promise} promise
 * @throws {dcc.ClientException} DAO exception
 */
dcc.cellctl.RelationManager.prototype.update = function(relationName, boxName, body, etag, options) {
  var headers = {};
  if (typeof boxName === "object") {
    etag = body;
    body = boxName;
    boxName = null;
  }
  if (boxName !== undefined && boxName !== null) {
    var key = "Name='" + relationName + "',_Box.Name='" + boxName + "'";
    this._internalUpdateMultiKey(key, body, etag, headers, options);
  } else {
    this._internalUpdate(relationName, body, etag, headers, options);
  }
};

///**
//* Relationを削除(複合キー).
//* @param {String} relationName 削除対象のRelation名
//* @param {String} boxName 削除対象のBox名
//* @return promise
//* @throws {ClientException} DAO例外
//*/
/**
 * This method performs delete operation.
 * @param {String} relationName Relation name
 * @param {String} boxName Box name
 * @param {String} etagOrOptions ETag value or options object having callback and headers
 * @return {dcc.Promise} promise
 * @throws {dcc.ClientException} DAO exception
 */
dcc.cellctl.RelationManager.prototype.del = function(relationName, boxName, etagOrOptions) {
  var key = "Name='"+relationName+"'";
  if (boxName !== undefined && boxName !== null && boxName !== "__") {
    key += ",_Box.Name='"+boxName+"'";
  }
  var response = this._internalDelMultiKey(key, etagOrOptions);
  return response;
};


/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class Roleのアクセスクラス.
//* @constructor
//* @augments dcc.AbstractODataContext
//*/
/**
 * It creates a new object dcc.cellctl.Role.
 * @class This class represents Role object.
 * @constructor
 * @augments dcc.AbstractODataContext
 * @param {dcc.Accessor} as Accessor
 * @param {Object} json
 */
dcc.cellctl.Role = function(as, json) {
  this.initializeProperties(this, as, json);
};
dcc.DcClass.extend(dcc.cellctl.Role, dcc.AbstractODataContext);

///**
//* プロパティを初期化する.
//* @param {dcc.cellctl.Role} self
//* @param {dcc.Accessor} as アクセス主体
//* @param {Object} json JSONオブジェクト
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.cellctl.Role} self
 * @param {dcc.Accessor} as Accessor
 * @param {Object} json JSON object
 */
dcc.cellctl.Role.prototype.initializeProperties = function(self, as, json) {
  this.uber = dcc.AbstractODataContext.prototype;
  this.uber.initializeProperties(self, as);

///** クラス名. */
  /** Class name in camel case. */
  self.CLASSNAME = "Role";


///** Role名. */
  /** Role name. */
  self.name = null;
  /** _box.name. */
  self.boxname = null;

///** Accountとのリンクマネージャ. */
  /** Link with an Account Manager. */
  self.account = null;
///** Relationとのリンクマネージャ. */
  /** Link with an Relation Manager. */
  self.relation = null;
///** ExtCellとのリンクマネージャ. */
  /** Link with an External Cell Manager. */
  self.extCell = null;

  if (json !== undefined && json !== null) {
    self.rawData = json;
    self.name = json.Name;
    self.boxname = json["_Box.Name"];
  }
  if (as !== undefined) {
    self.account = new dcc.cellctl.LinkManager(as, this, "Account");
    self.relation = new dcc.cellctl.LinkManager(as, this, "Relation");
    self.extCell = new dcc.cellctl.LinkManager(as, this, "ExtCell");
  }
};

///**
//* クラス名をキャメル型で取得する.
//* @return {?} ODataのキー情報
//*/
/**
 * This method gets the class name.
 * @return {String} Class name
 */
dcc.cellctl.Role.prototype.getClassName = function() {
  return this.CLASSNAME;
};

///**
//* Role名の設定.
//* @param {String} value Role名
//*/
/**
 * This method sets Role name.
 * @param {String} value Role name
 */
dcc.cellctl.Role.prototype.setName = function(value) {
  this.name = value;
};

///**
//* Role名の取得.
//* @return {String} Role名
//*/
/**
 * This method gets Role Name.
 * @return {String} Role name
 */
dcc.cellctl.Role.prototype.getName = function() {
  return this.name;
};

///**
//* _box.name値の設定.
//* @param {String} value _box.name値
//*/
/**
 * This method sets Box Name.
 * @param {String} value _box.name value
 */
dcc.cellctl.Role.prototype.setBoxName = function(value) {
  this.boxname = value;
};

///**
//* _box.name値の取得.
//* @return {String} _box.name値
//*/
/**
 * This method gets Box Name.
 * @return {String} _box.name value
 */
dcc.cellctl.Role.prototype.getBoxName = function() {
  return this.boxname;
};

///**
//* Roleオブジェクトのキーを取得する.
//* @return {String} ODataのキー情報
//*/
/**
 * This method generates key for Role operations.
 * @return {String} Key
 */
dcc.cellctl.Role.prototype.getKey = function() {
  if (this.boxname !== null) {
    return "(_Box.Name='" + this.boxname + "',Name='" + this.name + "')";
  } else {
    return "(_Box.Name=null,Name='" + this.name + "')";
  }
};

///**
//* RoleResourceのURLを取得.
//* @return {String} RoleResouceURL
//*/
/**
 * This method gets the URL of the RoleResource.
 * @return {String} RoleResouceURL
 */
dcc.cellctl.Role.prototype.getResourceBaseUrl = function() {
  var sb = "";
  sb += this.accessor.getCurrentCell().getUrl();
  sb += "__role/";
  if (this.boxname !== null) {
    sb += this.boxname;
  } else {
    sb += "__";
  }
  sb += "/";
  return sb;
};

/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class RoleのCRUDのためのクラス.
//* @constructor
//* @augments dcc.box.odata.ODataManager
//*/
/**
 * It creates a new object dcc.cellctl.RoleManager.
 * @class This class performs CRUD operations for Role object.
 * @constructor
 * @augments dcc.box.odata.ODataManager
 * @param {dcc.Accessor} as Accessor
 */
dcc.cellctl.RoleManager = function(as) {
  this.initializeProperties(this, as);
};
dcc.DcClass.extend(dcc.cellctl.RoleManager, dcc.box.odata.ODataManager);

///**
//* プロパティを初期化する.
//* @param {dcc.Accessor} self
//* @param {dcc.Accessor} as アクセス主体
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.Accessor} self
 * @param {dcc.Accessor} as Accessor
 */
dcc.cellctl.RoleManager.prototype.initializeProperties = function(self, as) {
  this.uber = dcc.box.odata.ODataManager.prototype;
  this.uber.initializeProperties(self, as);
};

///**
//* RoleのリクエストURLを取得する.
//* @returns {String} URL
//*/
/**
 * This method gets the URL for Role operations.
 * @returns {String} URL
 */
dcc.cellctl.RoleManager.prototype.getUrl = function() {
  var sb = "";
  sb += this.getBaseUrl();
  // HCL:-Changes done to get the cellName

  sb += this.accessor.cellName;
  sb += "/__ctl/Role";
  return sb;
};

///**
//* Roleを作成.
//* @param {dcc.cellctl.Role} obj Roleオブジェクト
//* @return {dcc.cellctl.Role} Roleオブジェクト
//* @throws {ClientException} DAO例外
//*/
/**
 * This method creates a Role.
 * @param {dcc.cellctl.Role} obj Role object
 * @param {Object} options object
 * @return {dcc.cellctl.Role} Role object
 * @throws {dcc.ClientException} DAO exception
 */
dcc.cellctl.RoleManager.prototype.create = function(obj, options) {
  var json = null;
  var responseJson = null;
  var requestBody = JSON.stringify(obj);
  var headers = {};
  if (obj.getClassName !== undefined && obj.getClassName() === "Role") {
    var body = {};
    body.Name = obj.getName();
    body["_Box.Name"] = obj.getBoxName();
    json = this._internalCreate(JSON.stringify(body),headers,options);
    responseJson = json.bodyAsJson().d.results;
    obj.initializeProperties(obj, this.accessor, responseJson);
    return obj;
  }
  var callbackExist = options !== undefined &&
  (options.success !== undefined ||
      options.error !== undefined ||
      options.complete !== undefined);
  if (callbackExist) {
    this._internalCreate(requestBody,headers,options);
  } else {
    json = this._internalCreate(requestBody);
    /*    if(json.getStatusCode() >= 400){
      var response = json.bodyAsJson();
      throw new dcc.ClientException(response.message.value, response.code);
    }*/
    return new dcc.cellctl.Role(this.accessor, json.bodyAsJson().d.results);
  }
};

///**
//* Roleを取得(複合キー).
//* @param {String} roleName 取得対象のRole名
//* @param {String}boxName 取得対象のBox名
//* @return {dcc.cellctl.Role} 取得したしたRoleオブジェクト
//* @throws {ClientException} DAO例外
//*/
/**
 * This method retrieves a Role object.
 * @param {String} roleName Role Name
 * @param {String}boxName Box name
 * @param {Object} options object has callback and headers
 * @return {dcc.cellctl.Role} Role object
 * @throws {dcc.ClientException} DAO exception
 */
dcc.cellctl.RoleManager.prototype.retrieve = function(roleName, boxName, options) {
  /*valid option is present with atleast one callback*/
  var callbackExist = options !== undefined &&
  (options.success !== undefined ||
      options.error !== undefined ||
      options.complete !== undefined);
  var json = null;
  var key = "Name='" + roleName + "',_Box.Name='" + boxName + "'";
  if (callbackExist) {
    if (typeof boxName === "undefined") {
      this._internalRetrieve(roleName, options);
      return;
    }
    this._internalRetrieveMultikey(key, options);
    return;
  }

  if (typeof boxName === "undefined") {
    json = this._internalRetrieve(roleName);

    //role doesn't exist and can be created.
    //if (json === true) {
    //  return json;
    //} else {
    return new dcc.cellctl.Role(this.accessor, json);
    //}
  }
  json = this._internalRetrieveMultikey(key);
  //role doesn't exist and can be created.
  return new dcc.cellctl.Role(this.accessor, json);
};

/**
 * The purpose of this function is to update role details.
 * @param {String} roleName
 * @param {String} boxName
 * @param {Object} body
 * @param {String} etag ETag value
 * @param {Object} options object optional containing callback, headers
 * @return {Object} response DcHttpClient
 */
dcc.cellctl.RoleManager.prototype.update = function(roleName, boxName, body, etag, options) {
  var response = null;
  var headers = {};
  if (boxName !== undefined && boxName !== null) {
    var key = "Name='" + roleName + "',_Box.Name='" + boxName + "'";
    response = this._internalUpdateMultiKey(key, body, etag, headers, options);
  } else {
    response = this._internalUpdate(roleName, body , etag, headers, options);
  }
  return response;
};


///**
//* Roleを削除.
//* @param {String} roleName 削除対象のRole名
//* @param {String} boxName 削除対象のBox名
//* @return response promise
//* @throws {ClientException} DAO例外
//*/
/**
 * This method deletes a Role.
 * @param {String} roleName Role Name
 * @param {String} boxName Box Name
 * @param {String} etagOrOptions ETag value or options object having callback and headers
 * @return {Object} response
 * @throws {dcc.ClientException} DAO exception
 */
dcc.cellctl.RoleManager.prototype.del = function(roleName, boxName, etagOrOptions) {
  var key = "Name='" + roleName + "'";
  if (boxName !== undefined && boxName !== null && boxName !=="undefined") {
    key += ",_Box.Name='" + boxName + "'";
  }
  var response = this._internalDelMultiKey(key, etagOrOptions);
  return response;
};

/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class ServiceのCURDのためのクラス.
//* @constructor
//* @augments dcc.DcCollection
//*/
/**
 * It creates a new object dcc.box.ServiceCollection.
 * @class This class performs CRUD operations for ServiceCollection.
 * @constructor
 * @augments dcc.DcCollection
 * @param {dcc.Accessor} as Accessor
 * @param {String} path
 */
dcc.box.ServiceCollection = function(as, path) {
  this.initializeProperties(this, as, path);
};
dcc.DcClass.extend(dcc.box.ServiceCollection, dcc.DcCollection);

///**
//* プロパティを初期化する.
//* @param {dcc.box.ServiceCollection} self
//* @param {dcc.Accessor} as アクセス主体
//* @param {?} path
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.box.ServiceCollection} self
 * @param {dcc.Accessor} as Accessor
 * @param {String} path
 */
dcc.box.ServiceCollection.prototype.initializeProperties = function(self, as, path) {
  this.uber = dcc.DcCollection.prototype;
  this.uber.initializeProperties(self, as, path);
};

///**
//* サービスの設定.
//* @param {String} key プロパティ名
//* @param {String} value プロパティの値
//* @param {String} subject サービスサブジェクトの値
//* @throws {ClientException} DAO例外
//*/
/**
 * This method configures a set of services.
 * @param {String} key Property Name
 * @param {String} value Property values
 * @param {String} subject Value of the service subject
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.ServiceCollection.prototype.configure = function(key, value, subject) {
  var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
  var response = restAdapter.setService(this.getPath(), key, value, subject);
  return response;
};

/**
 * This method contains common call back logic.
 * @param {Object} resp response received
 * @param {Object} callback callback parameter
 * @private
 */
dcc.box.ServiceCollection.prototype.processCallback = function(resp, callback) {
  if (resp.getStatusCode() >= 300) {
    if (callback.error !== undefined) {
      callback.error(resp);
    }
  } else {
    if (callback.success !== undefined) {
      callback.success(resp);
    }
  }
  if (callback.complete !== undefined) {
    callback.complete(resp);
  }
};

///**
//* Method is responsible for deciding which implementation of call is to be used.
//* decision will be taken based on the type of bodyOrHeader parameter
//* @param method メソッド
//* @param name 実行するサービス名
//* @param bodyOrOptions can contain either options or body
//* @param callback contains call back, not required if options is specified
//* @return DcResponseオブジェクト
//* @throws {ClientException} DAO例外
//*/
/**
 * This method is responsible for deciding which implementation of call is to be used.
 * Decision will be taken based on the type of bodyOrHeader parameter
 * @param {String} method Method
 * @param {String} name Service name to be executed
 * @param {Object} bodyOrOptions can contain either options or body
 * @param {Object} callback contains call back, not required if options is specified
 * @return {dcc.http.DcResponse} DcResponse object
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.ServiceCollection.prototype.call = function(method, name, bodyOrOptions,
    callback) {
  var response = null;
  if (bodyOrOptions !== null && typeof bodyOrOptions === "object") {
    //callback, header and body all specified in options parameter
    response = this._callWithOptions(method, name, bodyOrOptions);
  } else {
    response = this._callWithNoOptions(method, name, bodyOrOptions,
        callback);
  }
  return response;
};

///**
//* サービスの実行.
//* @param method メソッド
//* @param name 実行するサービス名
//* @param body リクエストボディ
//* @return DcResponseオブジェクト
//* @throws {ClientException} DAO例外
//* @private
//*/
/**
 * Method _callWithNOOptions - an overloaded version with option containing only body.
 * @param {String} method Method
 * @param {String} name Service name to be executed
 * @param {Object} body Request Body
 * @param {Object} options optional parameters and callbacks
 * @return {dcc.http.DcResponse} DcResponse object
 * @throws {dcc.ClientException} DAO exception
 * @private
 */
dcc.box.ServiceCollection.prototype._callWithNoOptions = function(method, name,
    body, options) {
  var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
  var url = dcc.UrlUtils.append(this.getPath(), name);
  var defaultContentType = "text/plain";
  var response = null;
  var callbackExist = options !== undefined &&
  (options.success !== undefined ||
      options.error !== undefined ||
      options.complete !== undefined);
  //var self = this;
  if (method === "GET") {
    //if (callback !== undefined) {/*
    if (this.accessor.getContext().getAsync()) {
      //process asynchronous mode
      /*
      restAdapter.get(url, defaultContentType, null, function(resp) {
        self.processCallback(resp, callback);
      });
       */

      //pass the callback,callback execution will be invoked at DcHttpClient layer
      restAdapter.get(url, defaultContentType, null, options);
    }
    else {
      //requested mode is synchronous
      response = restAdapter.get(url, defaultContentType);
      return response;
    }
  }
  if (method === "POST") {
    /*    if (callback !== undefined) {
      restAdapter.post(url, body, defaultContentType, {}, function(resp) {
        self.processCallback(resp, callback);
      });
    } */
    //if(this.accessor.getContext().getAsync()){
    if (callbackExist) {
      restAdapter.post(url, body, defaultContentType, {},options);
    }
    else {
      response = restAdapter.post(url, body, defaultContentType, {});
      return response;
    }
  }
  if (method === "PUT") {
    if (callbackExist) {
      /*restAdapter.put(url, body, "*", defaultContentType, {}, function(
          resp) {
        self.processCallback(resp, callback);
      });*/
      restAdapter.put(url, body, "*", defaultContentType, {},options);
    } else {
      response = restAdapter.put(url, body, "*", defaultContentType, {});
      return response;
    }
  }
  if (method === "DELETE") {
    if (options !== undefined) {
      /*      restAdapter.del(url, "*", function(resp) {
        self.processCallback(resp, callback);
      });*/
      restAdapter.del(url, "*", options);
    } else {
      response = restAdapter.del(url, "*");
      return response;
    }
  }
};

///**
//* Method _callWithOptions - an overloaded version with option containing header,body and callback.
//* @param method メソッド
//* @param name 実行するサービス名
//* @param options containing header,body and success, error, complete callback
//* @return DcResponseオブジェクト
//* @throws {ClientException} DAO例外
//* @private
//*/
/**
 * Method _callWithOptions - an overloaded version with option containing header,body and callback.
 * @param {String} method method
 * @param {String} name Service to be executed
 * @param {Object} options containing header,body and success, error, complete callback
 * @return {dcc.http.DcResponse} DcResponse object
 * @throws {dcc.ClientException} DAO exception
 * @private
 */
dcc.box.ServiceCollection.prototype._callWithOptions = function(method, name,
    options) {
  var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
  var url = dcc.UrlUtils.append(this.getPath(), name);
  var response = null;
  var acceptHeader = "text/plain";
  var contentTypeHeader = "text/plain";
  var self = this;

  /*valid option is present with atleast one callback*/
  var callbackExist = options !== undefined &&
  (options.success !== undefined ||
      options.error !== undefined ||
      options.complete !== undefined);

  if ((options.headers !== undefined)	&& (options.headers.Accept !== undefined)) {
    acceptHeader = options.headers.Accept;
  }
  if ((options.headers !== undefined)	&& (options.headers.ContentType !== undefined)) {
    contentTypeHeader = options.headers.ContentType;
  }
  if (method === "GET") {
    //if (options.success !== undefined || options.error !== undefined || options.complete !== undefined) {
    if (callbackExist) {
      /*restAdapter.get(url, acceptHeader, null, function(resp) {
        self.processCallback(resp, options);
      });*/
      restAdapter.get(url, acceptHeader, null,options);
    } else {
      //no callback is specified, simply return the response
      response = restAdapter.get(url, acceptHeader);
      return response;
    }
  }
  if (method === "POST") {
    if (callbackExist) {
      restAdapter.post(url, options.body, contentTypeHeader, {},
          function(resp) {
        self.processCallback(resp, options);
      });
    } else {
      //no callback is specified, simply return the response
      if (options.headers !== undefined) {
        response = restAdapter.post(url, options.body,
            contentTypeHeader, options.headers);
      } else {
        response = restAdapter.post(url, options.body,
            contentTypeHeader, {});
      }
      return response;
    }
  }
  if (method === "PUT") {
    if (callbackExist) {
      restAdapter.put(url, options.body, "*", contentTypeHeader, {},
          function(resp) {
        self.processCallback(resp, options);
      });
    } else {
      //no callback is specified, simply return the response
      if (options.headers !== undefined) {
        response = restAdapter.put(url, options.body, "*",
            contentTypeHeader, options.headers);
      } else {
        response = restAdapter.put(url, options.body, "*",
            contentTypeHeader, {});
      }
      return response;
    }
  }
  if (method === "DELETE") {
    if (callbackExist) {
      restAdapter.del(url, "*", function(resp) {
        self.processCallback(resp, options);
      });
    } else {
      //no callback is specified, simply return the response
      response = restAdapter.del(url, "*");
      return response;
    }
  }
};

///**
//* 指定Pathに任意の文字列データをPUTします.
//* @param pathValue DAVのパス
//* @param contentType メディアタイプ
//* @param data PUTするデータ
//* @param etagValue PUT対象のETag。新規または強制更新の場合は "*" を指定する
//* @throws {ClientException} DAO例外
//*/
/**
 * This method is used to upload a file or update a string of data.
 * @param {String} pathValue Path of DAV
 * @param {Object} options contains callback, headers and body
 * @returns {dcc.Promise} promise
 * @throws {dcc.ClientException} exception
 */
//public void put(String pathValue, String contentType, String data, String etagValue) throws ClientException {
/*dcc.box.ServiceCollection.prototype.put = function(pathValue, contentType, data,
    etag) {*/
dcc.box.ServiceCollection.prototype.put = function(pathValue, options) {
  if(!options){
    options = {};
  }
  //byte[] bs;
  //try {
  //bs = data.getBytes("UTF-8");
  //} catch (UnsupportedEncodingException e) {
  //throw new ClientException("UnsupportedEncodingException", e);
  //}
  //InputStream is = new ByteArrayInputStream(bs);
  //this.put(pathValue, contentType, is, etagValue);
  var url = dcc.UrlUtils.append(this.getPath(), "__src/" + pathValue);
  //TODO: Change put to except only 2 parameters- URL and options
  var promise = dcc.http.RestAdapterFactory.create(this.accessor).put(url, null, null,
      null, null, options);
  return promise;
};

///**
//* 指定pathに任意のInputStreamの内容をPUTします. 指定IDのオブジェクトが既に存在すればそれを書き換え、存在しない場合はあらたに作成する.
//* @throws {ClientException} DAO例外
//*/
//public void put(String pathValue, String contentType, InputStream is, String etagValue) throws ClientException {
//dcc.box.ServiceCollection.prototype.put = function() {
//var url = dcc.UrlUtils.append(this.getPath(), "__src/" + pathValue);
//var restAdapter = new dcc.http.RestAdapterFactory().create(this.accessor);
//restAdapter.putStream(url, contentType, is, etagValue);
//};
///**
//* 指定PathのデータをDeleteします.
//* @param {String} pathValue DAVのパス
//* @throws {ClientException} DAO例外
//*/
/**
 * This method deletes the data in the path specified.
 * @param {String} pathValue DAV Path
 * @param {String} etagOrOptions ETag value or options object having callback and headers
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.ServiceCollection.prototype.del = function(pathValue, etagOrOptions) {
  var url = dcc.UrlUtils.append(this.getPath(), "__src/" + pathValue);
  var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
  restAdapter.del(url, etagOrOptions);
};

/**
 * This method calls PROPFIND API for specified path to get
 * registered service file detail.
 * @returns {dcc.DcHttpClient} response.
 * @throws {dcc.ClientException} Exception thrown
 */
dcc.box.ServiceCollection.prototype.propfind = function () {
  var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
  var response = restAdapter.propfind(this.url);
  return response;
};

/**
 * The purpose of this method is to perform service configure operation for multiple service
 * in one API call.
 * @param {String[]} arrServiceNameAndSrcFile service list in combination of service name and source file
 * @param {String} subject Service
 * @param {Object} options refers to optional parameters - callback, headers.
 * @throws {dcc.ClientException} Exception
 */
dcc.box.ServiceCollection.prototype.multipleServiceConfigure = function(arrServiceNameAndSrcFile, subject, options) {
  var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
  var response = restAdapter.setMultipleService(this.getPath(), arrServiceNameAndSrcFile, subject, options);
  return response;
};
/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class UNITレベルAPI/SAMレベルAPI.
//* @constructor
//*/
/**
 * It creates a new object dcc.UnitManager.
 * @class UNIT level API / SAM level API.
 * @constructor
 * @param {dcc.Accessor} as Accessor
 */
dcc.UnitManager = function(as) {
  this.initializeProperties(this, as);
};

///**
//* プロパティを初期化する.
//* @param {dcc.UnitManager} self
//* @param {dcc.Accessor} as アクセス主体
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.UnitManager} self
 * @param {dcc.Accessor} as Accessor
 */
dcc.UnitManager.prototype.initializeProperties = function(self, as) {
  if (as !== undefined) {
//  /** アクセス主体. */
    /** Accessor. */
    self.accessor = as.clone();
//  /** CellのCRUDを行う. */
    /** CellManager object to perform Cell related CRUD. */
    self.cell = new dcc.unitctl.CellManager(as);
  }
};

///**
//* 指定した名称のCellオブジェクトを生成して返す.
//* @param {string} cellName セル名
//* @return {dcc.unitctl.Cell} 生成したCellオブジェクトのインスタンス
//* @throws {ClientException} DAO例外
//*/
/**
 * This method creates and returns a Cell object with the specified name.
 * @param {string} cellName Cellname
 * @return {dcc.unitctl.Cell} Cell object
 * @throws {dcc.ClientException} DAO exception
 */
dcc.UnitManager.prototype.cellCtl = function(cellName) {
  this.accessor.setCellName(cellName);
  return new dcc.unitctl.Cell(this.accessor, cellName);
};

/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class DAVリソースへアクセスするためのクラス.
//* @constructor
//* @augments dcc.box.DavCollection
//*/
/**
 * It creates a new object dcc.box.DavResponse.
 * @class This class is used to access the DAV resource.
 * @constructor
 * @augments dcc.box.DavCollection
 * @param {dcc.Accessor} as Accessor
 * @param {Object} json
 */
dcc.box.DavResponse = function(as, json) {
  this.initializeProperties(this, as, json);
};
dcc.DcClass.extend(dcc.box.DavResponse, dcc.box.DavCollection);

///**
//* プロパティを初期化する.
//* @param {dcc.box.DavResponse} self
//* @param {dcc.Accessor} as アクセス主体
//* @param {Object} json JSONオブジェクト
//* @param {?} path
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.box.DavResponse} self
 * @param {dcc.Accessor} as Accessor
 * @param {String} body
 */
dcc.box.DavResponse.prototype.initializeProperties = function(self, as, body) {
  this.uber = dcc.box.DavCollection.prototype;
  this.uber.initializeProperties(self, as);

  if (body !== undefined) {
    self.body = body;
  }
};

///**
//* ボディを取得.
//* @return {?} ボディ
//*/
/**
 * This method is used to return the body.
 * @return {Object} Body
 */
dcc.box.DavResponse.prototype.getBody = function() {
  return this.body;
};

/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class Entityへアクセスするためのクラス.
//* @constructor
//* @augments dcc.box.DavCollection
//*/
/**
 * It creates a new object dcc.box.odata.ODataResponse.
 * @class This class represents Response object.
 * @constructor
 * @augments dcc.box.DavCollection
 * @param {dcc.Accessor} as Accessor
 * @param {Object} json
 * @param {Object} odataJson
 */
dcc.box.odata.ODataResponse = function(as, json, odataJson) {
  this.initializeProperties(this, as, json, odataJson);
};
dcc.DcClass.extend(dcc.box.odata.ODataResponse, dcc.AbstractODataContext);

///**
//* プロパティを初期化する.
//* @param {dcc.box.odata.ODataResponse} self
//* @param {dcc.Accessor} as アクセス主体
//* @param {Object} json JSONオブジェクト
//* @param {?} path
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.box.odata.ODataResponse} self
 * @param {dcc.Accessor} as Accessor
 * @param {Object} json JSON object
 * @param {Object} odataJson
 */
dcc.box.odata.ODataResponse.prototype.initializeProperties = function(self, as, json, odataJson) {
  this.uber = dcc.AbstractODataContext.prototype;
  this.uber.initializeProperties(self, as);

  if ((odataJson !== undefined) && (odataJson !== null)) {
    self.odataJson = odataJson;
    self.body =  null;
  } else {
    if (json !== undefined) {
      self.body = json;
      self.odataJson = null;
    }
  }
};

///**
//* ボディを取得.
//* @return {?} ボディ
//*/
/**
 * This method gets the response body.
 * @return {Object} Body
 */
dcc.box.odata.ODataResponse.prototype.getBody = function() {
  if (this.body !== null) {
    return this.body;
  }
  return this.odataJson.d.results;
};

///**
//* レスポンスボディ全体を取得.
//* @return {?} ボディ
//*/
/**
 * This method gets the whole body response.
 * @return {Object} Body
 */
dcc.box.odata.ODataResponse.prototype.getOData = function() {
  return this.odataJson;
};


/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class Entityへアクセスするためのクラス.
//* @constructor
//* @augments dcc.box.DavCollection
//*/
/**
 * It creates a new object dcc.box.odata.ODataBatchResponse.
 * @class This class is the Response class for ODataBatch.
 * @constructor
 * @augments dcc.box.DavCollection
 * @param {Object} header
 * @param {Object} body
 */
dcc.box.odata.ODataBatchResponse = function(header, body) {
  this.initializeProperties(this, header, body);
};
dcc.DcClass.extend(dcc.box.odata.ODataBatchResponse, dcc.AbstractODataContext);

///**
//* プロパティを初期化する.
//* @param {dcc.box.odata.ODataBatchResponse} self
//* @param {String} header ヘッダー情報
//* @param {String} body ボディ情報
//* @param {?} path
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.box.odata.ODataBatchResponse} self
 * @param {String} header Header information
 * @param {String} body Body information
 */
dcc.box.odata.ODataBatchResponse.prototype.initializeProperties = function(self, header, body) {
  self.rawHeader = header;
  self.body = body;
  self.headers = this.parseHeaders(header);
};

///**
//* ステータスコードの取得.
//* @return ステータスコード
//*/
/**
 * This method gets the statuc code of response.
 * @return {String} Status code
 */
dcc.box.odata.ODataBatchResponse.prototype.getStatusCode = function() {
  return this.statusCode;
};

///**
//* 解析前のヘッダー文字列を取得.
//* @return ヘッダー文字列
//*/
/**
 * This method gets the header string before analysis is performed.
 * @return {String} Header string
 */
dcc.box.odata.ODataBatchResponse.prototype.getRawHeaders = function() {
  return this.rawHeaders;
};

///**
//* レスポンスヘッダのハッシュマップを取得.
//* @return ヘッダのハッシュマップ
//*/
/**
 * This method gets a hash map of the response header.
 * @return {Array} Hash map of header
 */
dcc.box.odata.ODataBatchResponse.prototype.getHeaders = function() {
  return this.headers;
};

///**
//* 指定したレスポンスヘッダの値を取得する.
//* @param key ヘッダのキー
//* @return 指定したキーの値
//*/
/**
 * This method gets the value of the specified response header.
 * @param {String} key Key in header
 * @return {Array} Value of the specified key
 */
dcc.box.odata.ODataBatchResponse.prototype.getHeader = function(key) {
  return this.headers[key];
};

///**
//* レスポンスボディを文字列で取得.
//* @return ボディテキスト
//*/
/**
 * This method returns response body as String.
 * @return {String} Body text
 */
dcc.box.odata.ODataBatchResponse.prototype.bodyAsString = function() {
  return this.body;
};

///**
//* レスポンスボディをJSONで取得.
//* @return JSONオブジェクト
//* @throws ClientException DAO例外
//*/
/**
 * This method returns response body as Object.
 * @return {Object} JSON object
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.odata.ODataBatchResponse.prototype.bodyAsJson = function() {
  return JSON.parse(this.body);
};
/**
 * This method parses the headers to return values in Array format.
 * @param {String} value Headers
 * @returns {Array} map
 */
dcc.box.odata.ODataBatchResponse.prototype.parseHeaders = function(value) {
  var lines = value.split("\n");
  // １行目がから ステータスコードを取得
  if (lines[0].startsWith("HTTP")) {
    this.statusCode = parseInt(lines[0].split(" ")[1], 10);
  }
  // ２行目以降のレスポンスヘッダをハッシュマップにセット
  var map = [];
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var key = line.split(":");
    if (key.length > 1) {
      // 前後に空白が含まれている可能性があるため、トリムしてからセットする
      map[key[0].trim()] = key[1].trim();
    }
  }
  return map;
};

/**
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* $Batchのレスポンスを解析するクラス.
//* @class Represents ODataBatchResponseParser.
//*/
/**
 * This class is used to analyze the response of $ Batch.
 * @class Represents ODataBatchResponseParser.
 */
dcc.box.odata.ODataBatchResponseParser = function() {
  this.initializeProperties(this);
};

/** Variable BOUNDARY_KEY. */
dcc.box.odata.ODataBatchResponseParser.BOUNDARY_KEY = "--batch_";
/** Variable CHARSET_KEY. */
dcc.box.odata.ODataBatchResponseParser.CHARSET_KEY = "--changeset_";
/** Variable HTTP. */
dcc.box.odata.ODataBatchResponseParser.HTTP = "HTTP/1.1";
/** Variable CRLF. */
dcc.box.odata.ODataBatchResponseParser.CRLF = "\n";
/** Variable BLANK_LINE. */
dcc.box.odata.ODataBatchResponseParser.BLANK_LINE = "\n\n";
/** Variable CONTENTTYPE_HTTP. */
dcc.box.odata.ODataBatchResponseParser.CONTENTTYPE_HTTP = "application/http";
/** Variable CONTENTTYPE_MULTIPART. */
dcc.box.odata.ODataBatchResponseParser.CONTENTTYPE_MULTIPART = "application/http";

///**
//* オブジェクトを初期化.
//* @param {dcc.box.odata.ODataBatchResponseParser} self
//*/
/**
 * This method initializes the properties of this class.
 * @param {dcc.box.odata.ODataBatchResponseParser} self
 */
dcc.box.odata.ODataBatchResponseParser.prototype.initializeProperties = function(self) {
//  /** レスポンス情報の一覧. */
    /** List of response information. */
  self.resList = [];
};

///**
//* レスポンス解析.
//* @param reader レスポンスボディReader
//* @return ODataResponseの配列
//*/
/**
 * This method performs analysis on response.
 * @param {String} reader Reader response body
 * @return {Array} Array of ODataResponse
 */
dcc.box.odata.ODataBatchResponseParser.prototype.parse = function(reader) {
  this.parseBoundary(reader, dcc.box.odata.ODataBatchResponseParser.BOUNDARY_KEY);
  return this.resList;
};

/**
 * This method parses the boundary.
 * @param {String} reader
 * @param {String} boudaryKey
 */
dcc.box.odata.ODataBatchResponseParser.prototype.parseBoundary = function(reader, boudaryKey) {
  var br = reader.split(dcc.box.odata.ODataBatchResponseParser.CRLF);
  var lineCnt = 0;
  var sb = "";
  try {
    var str = br[lineCnt++];
    while ((str !== null) && (typeof str !== "undefined")) {
      if (str.startsWith(boudaryKey)) {
        if (sb.length > 0) {
          this.parseBodyBlock(sb);
          sb = "";
        }
        str = br[lineCnt++];
        continue;
      }
      sb += str;
      sb += dcc.box.odata.ODataBatchResponseParser.CRLF;
      str = br[lineCnt++];
    }
  } catch (e) {
    throw e;
  }
};

/**
 * This method parses the body.
 * @param {String} body
 */
dcc.box.odata.ODataBatchResponseParser.prototype.parseBodyBlock = function(body) {
  // 空行で分割する
  /** Splitting it by a blank line. */
  var blocks = body.split(dcc.box.odata.ODataBatchResponseParser.BLANK_LINE);

  // ブロックが2個以上存在しなければHttpレスポンス型ではない
  /** It is not a Http response type block unless there are two or more. */
  if (blocks.length < 2) {
    return;
  }

  // ブロックのヘッダ部を取得
  /** Get the header portion of the block. */
  var boundaryHeaders = this.parseHeaders(blocks[0]);

  // ブロックヘッダのContent-Typeを取得
  /** Get the Content-Type header of the block. */
  var contentType = boundaryHeaders["Content-Type"];

  if ((contentType !== null) && (typeof contentType !== "undefined")) {
    if (contentType.startsWith(dcc.box.odata.ODataBatchResponseParser.CONTENTTYPE_HTTP)) {
      // application/http ならば １つのリクエスト
      /** one request if application / http. */
      var responseBody = "";
      // ボディ内に空行がふくまれている場合、２個目以降を連結する
      /** If there is a blank line in the body, then connect second and subsequent lines. */
      for (var i = 2; i < blocks.length; i++) {
        responseBody += blocks[i];
      }
      this.resList.push(new dcc.box.odata.ODataBatchResponse(blocks[1], responseBody));
    } else {
      // multipart/mixed ばらばマルチパート(複数のブロックで構成)
      /** (consist of blocks) multipart / mixed multipart Barabbas. */
      this.parseBoundary(body, dcc.box.odata.ODataBatchResponseParser.CHARSET_KEY);
    }
  }
};

///**
//* 複数行の塊となっているレスポンスヘッダーを分解してハッシュマップにセットする.
//* @param value レスポンスヘッダ文字列
//* @return １つ１つに分解されたハッシュマップ
//*/
/**
 * This method parses the headers to return values in Array format.
 * @param {String} value Response header string
 * @return {Array} map
 */
dcc.box.odata.ODataBatchResponseParser.prototype.parseHeaders = function(value) {
  // 改行コードで分解する
  /** Decompose with a new line code. */
  var lines = value.split(dcc.box.odata.ODataBatchResponseParser.CRLF);
  var map = [];
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var key = line.split(":");
    if (key.length > 1) {
      // 前後に空白が含まれている可能性があるため、トリムしてからセットする
      /** Because there is a possibility of spaces in front and rear, so sets it after trim. */
      map[key[0].trim()] = key[1].trim();
    }
  }
  return map;
};

/*
 * Copyright 2012 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

/**
 * It creates a new object dcc.box.odata.schema.EntityLink.
 * @class This class represents the EntityLink object.
 * @constructor
 * @augments dcc.AbstractODataContext
 * @param {dcc.Accessor} as Accessor
 * @param {String} path
 */
dcc.box.odata.schema.EntityLink = function(as, path) {
    this.initializeProperties(this, as, path);
};
dcc.DcClass.extend(dcc.box.odata.schema.EntityLink, dcc.AbstractODataContext);

/**
 * This method initializes the properties of this class.
 * @param {dcc.box.odata.schema.EntityLink} self
 * @param {dcc.Accessor} as Accessor
 * @param {String} path URL
 */
dcc.box.odata.schema.EntityLink.prototype.initializeProperties = function(self, as, path) {
    this.uber = dcc.AbstractODataContext.prototype;
    this.uber.initializeProperties(self, as);

    if (as !== undefined) {
        self.accessor = as.clone();
    }

    /** Class name in camel case. */
    self.CLASSNAME = "";
    /** The path of the collection. */
    self.url = path;

};

/**
 * This method gets the URL for the collection.
 * @return {String} URL string
 */
dcc.box.odata.schema.EntityLink.prototype.getPath = function() {
    return this.url;
};

/**
 * This method gets the Odata key.
 * @return {String} OData key
 */
dcc.box.odata.schema.EntityLink.prototype.getKey = function() {
    return "";
};

/**
 * This method gets the class name.
 * @return {String} OData class name
 */
dcc.box.odata.schema.EntityLink.prototype.getClassName = function() {
    return this.CLASSNAME;
};


/*
 * Copyright 2012 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

/**
 * It creates a new object dcc.box.odata.EntityLinkManager.
 * @class This class is used for performing CRUD operations on Entity links.
 * @constructor
 * @augments dcc.box.odata.ODataManager
 * @param {dcc.Accessor} as Accessor
 * @param {dcc.DcCollection} Collection
 */
dcc.box.odata.EntityLinkManager = function(as, collection) {
    this.initializeProperties(this, as, collection);
};
dcc.DcClass.extend(dcc.box.odata.EntityLinkManager, dcc.box.odata.ODataManager);

/**
 * The purpose of this function is to initialize properties.
 * @param {Object} self
 * @param {dcc.Accessor} as
 * @param {dcc.DcCollection} collection
 */
dcc.box.odata.EntityLinkManager.prototype.initializeProperties = function(self, as, collection) {
    this.uber = dcc.EntitySet.prototype;
    this.uber.initializeProperties(self, as, collection);
};

/**
 * The purpose of this method is to create link between entities.
 * @param {String} uri URL value
 * @param {Object} options callback
 * @param {String} targetURI Request Body
 */
dcc.box.odata.EntityLinkManager.prototype.create = function(uri,targetURI,options) {
  var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
  var headers = {};
  //var response = restAdapter.post(uri, JSON.stringify(targetURI), "application/json");
  var response = restAdapter.post(uri, JSON.stringify(targetURI), "application/json", headers, options);
  return response;
};

/**
 * The purpose of this method is to retrieve link between entities.
 * @param {String} uri URL value
 * @returns {dcc.DcHttpClient} response
 * */
dcc.box.odata.EntityLinkManager.prototype.get = function(uri) {
    var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
    var response = restAdapter.get(uri, "", "application/json");
    return response;
};

/**
 * The purpose of this method is to create url for entity link operations.
 * @param {String} entityLinkID
 * @returns {String} Created URL
 */
dcc.box.odata.EntityLinkManager.prototype.getUrl = function(entityLinkID) {
    var sb = "";
    sb += this.collection.getPath() + "('" + entityLinkID + "')";
    return sb;
};

/**
 * The purpose of the following method is to delete an entity link.
 * @param {String} entityLinkID
 * @param {String} etag
 * @returns {dcc.Promise} response
 */
dcc.box.odata.EntityLinkManager.prototype.del = function(entityLinkID, etag) {
    if (typeof etag === undefined) {
        etag = "*";
    }
    var url = this.getUrl(entityLinkID);
    var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
    var response = restAdapter.del(url, etag,"");
    return response;
};

/*

 * Copyright 2012 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class EntityTypeのCRUDのためのクラス.
//* @constructor
//* @augments jEntitySet
//*/
/**
 * It creates a new object dcc.box.odata.EntityManager.
 * @class This class is used for performing CRUD operations for Entity.
 * @constructor
 * @augments jEntitySet
 * @param {dcc.Accessor} as Accessor
 * @param {dcc.DcCollection} collection
 */
dcc.box.odata.EntityManager = function(as, collection) {
  this.initializeProperties(this, as, collection);
};
dcc.DcClass.extend(dcc.box.odata.EntityManager, dcc.box.odata.ODataManager);

///**
//* プロパティを初期化する.
//*/
/**
 * This method initializes the properties of this class.
 * @param {Object} self
 * @param {dcc.Accessor} as Accessor
 * @param {dcc.DcCollection} collection object
 */
dcc.box.odata.EntityManager.prototype.initializeProperties = function(self, as, collection) {
  this.uber = dcc.box.odata.ODataManager.prototype;
  this.uber.initializeProperties(self, as, collection);
};

/**
 * This method creates and returns the URL for performing Entity related operations.
 * @return {String} URL
 */
dcc.box.odata.EntityManager.prototype.getUrl = function() {
  var sb = "";
  sb += this.collection.getPath();
  return sb;
};

///**
//* Entityを作成.
//* @param jsonData Entityオブジェクト
//* @return {dcc.http.DcHttpClient} response
//*/
/**
 * This method creates an Entity for the data.
 * @param {Object} jsonData Entity object
 * @param {Object} options Callback object
 * @return {dcc.http.DcHttpClient} response
 */
dcc.box.odata.EntityManager.prototype.create = function(jsonData,options) {
  var headers ={};
  //var response = this.internalCreate(JSON.stringify(jsonData));
  var response = this._internalCreate(JSON.stringify(jsonData),headers,options);
  return response;
};

/**
 * This method retrieves the entity list.
 * @param {String} id Key to URL
 * return {Object} JSON response
 */
dcc.box.odata.EntityManager.prototype.retrieve = function(id) {
  var json = this._internalRetrieve(id);
  return json;
};

/**
 * The purpose of this method is to update entity.
 * @param {String} entityName entity Name
 * @param {Object} body data
 * @param {String} etag for backward compatibility,recommended replacement options.headers
 * @param {Object} options object optional containing callback, headers
 * @return {dcc.http.DcHttpClient} response
 */
dcc.box.odata.EntityManager.prototype.update = function(entityName, body, etag, options) {
  var response = null;
  var headers = {};
  response = this._internalUpdate(entityName, body, etag, headers, options);
  return response;
};

/**
 * The purpose of the following method is to delete an entity.
 * @param {String} entityTypeName
 * @param {String} etagOrOptions ETag value or options object having callback and headers
 * @return {dcc.Promise} promise
 */
dcc.box.odata.EntityManager.prototype.del = function(entityTypeName, etagOrOptions) {
  var key = encodeURIComponent("'" + entityTypeName + "'");
  var response = this._internalDelMultiKey(key, etagOrOptions);
  return response;
};

/*
 * Copyright 2012 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class ComplexTypeのCRUDのためのクラス.
//* @constructor
//* @augments jEntitySet
//*/
/**
 * It creates a new object dcc.box.odata.schema.ComplexTypeManager.
 * @class This class performs CRUD operations for CmplexType.
 * @constructor
 * @augments jEntitySet
 * @param {dcc.Accessor} as Accessor
 * @param {dcc.DcCollection} collection
 */
dcc.box.odata.schema.ComplexTypeManager = function(as, collection) {
  this.initializeProperties(this, as, collection);
};
dcc.DcClass.extend(dcc.box.odata.schema.ComplexTypeManager, dcc.box.odata.ODataManager);

///**
//* プロパティを初期化する.
//*/
/**
 * This method initializes the properties of this class.
 * @param {Object} self
 * @param {dcc.Accessor} as Accessor
 * @param {dcc.DcCollection} collection object
 */
dcc.box.odata.schema.ComplexTypeManager.prototype.initializeProperties = function(self, as, collection) {
  this.uber = dcc.box.odata.ODataManager.prototype;
  this.uber.initializeProperties(self, as, collection);
};

/**
 * This method gets the URL.
 * @return {String} URL
 */
dcc.box.odata.schema.ComplexTypeManager.prototype.getUrl = function() {
  var sb = "";
  sb += this.collection.getPath();
  sb += "/$metadata/ComplexType";
  return sb;
};

///**
//* EntityTypeを作成.
//* @param obj EntityTypeオブジェクト
//* @return EntityTypeオブジェクト
//* @throws ClientException DAO例外
//*/
/**
 * This method performs create operation for ComplexType.
 * @param {Object} obj ComplexType object
 * @param {Object} options Callback
 * @return {Object} ComplexType object
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.odata.schema.ComplexTypeManager.prototype.create = function(obj,options) {
  var json = null;
  var callbackExist = options !== undefined &&
  (options.success !== undefined ||
      options.error !== undefined ||
      options.complete !== undefined);
  if (callbackExist) {
    var headers = {};
    this._internalCreate(JSON.stringify(obj),headers,options);
  } else {
    json = this._internalCreate(JSON.stringify(obj));
    return json;
  }
};

///**
//* Boxを取得.
//* @param name 取得対象のbox名
//* @return {dcc.box.odata.schema.EntityType} object
//* @throws ClientException DAO例外
//*/
/**
 * This method performs retrieve operation for ComplexType.
 * @param {String} name ComplexType name
 * @return {dcc.box.odata.schema.EntityType} object
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.odata.schema.ComplexTypeManager.prototype.retrieve = function(name) {
  var json = this._internalRetrieve(name);
  return new dcc.box.odata.schema.EntityType(this.accessor, json);
};

/**
 * The purpose of this method is to create URL for delete operation.
 * @param {String} path
 * @param {String} complexType
 * @returns {String} URL
 */
dcc.box.odata.schema.ComplexTypeManager.prototype.getPath = function(path, complexType){
  var url = path + "/$metadata/ComplexType('" + complexType + "')";
  return url;
};

///**
//* 指定PathのデータをDeleteします(ETag指定).
//* @param pathValue DAVのパス
//* @param etagValue PUT対象のETag。新規または強制更新の場合は "*" を指定する
//* @return {dcc.Promise} promise
//* @throws ClientException DAO例外
//*/
/**
 * This method performs delete operation for ComplexType.
 * @param {String} path DAV path
 * @param {String} complexType
 * @param {Object} options optional parameters having callback and headers
 * @return {dcc.Promise} promise
 * @throws {dcc.ClientException} DAO exception
 */
dcc.box.odata.schema.ComplexTypeManager.prototype.del = function(path, complexType, options) {
  /*if (typeof etagValue === undefined) {
    etagValue = "*";
  }*/
  var url = this.getPath(path, complexType);
  var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
  var response = restAdapter.del(url, options);
  return response;
};
/*
 * Copyright 2012 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

/**
 * It creates a new object dcc.box.odata.schema.ComplexTypePropertyManager.
 * @class This class is used for performing CRUD operations on ComplexTypeProperty.
 * @constructor
 * @augments jEntitySet
 * @param {dcc.Accessor} as Accessor
 * @param {dcc.DcCollection} Collection
 */
dcc.box.odata.schema.ComplexTypePropertyManager = function(as, collection) {
  this.initializeProperties(this, as, collection);
};
dcc.DcClass.extend(dcc.box.odata.schema.ComplexTypePropertyManager, dcc.box.odata.ODataManager);

/** The purpose of this function is to initialize properties.
 * @param {Object} self
 * @param {dcc.Accessor} as
 * @param {dcc.DcCollection} collection
 */
dcc.box.odata.schema.ComplexTypePropertyManager.prototype.initializeProperties = function(self, as,
    collection) {
  this.uber = dcc.box.odata.ODataManager.prototype;
  this.uber.initializeProperties(self, as, collection);
};

/**
 * The purpose of this function is to create URL.
 * @return {String} URL
 */
dcc.box.odata.schema.ComplexTypePropertyManager.prototype.getUrl = function() {
  var sb = "";
  sb = this.getBaseUrl();
  sb += this.accessor.cellName;
  sb +="/";
  sb += this.accessor.boxName;
  sb +="/";
  sb += this.collection;
  sb += "/$metadata/ComplexTypeProperty";
  return sb;
};

/**
 * The purpose of this function is to get complex type URI.
 * @param {String} complexTypeName
 * @return {String} URL
 */
dcc.box.odata.schema.ComplexTypePropertyManager.prototype.getComplexTypeUri = function (complexTypeName) {
  var sb = "";
  sb = this.getBaseUrl();
  sb += this.accessor.cellName;
  sb +="/";
  sb += this.accessor.boxName;
  sb +="/";
  sb += this.collection;
  sb += "/$metadata/ComplexType(";
  sb += "'"+complexTypeName+"'";
  //sb += escape("'"+complextypeName+"'");
  sb += ")/_ComplexTypeProperty";
  return sb;
};

/**
 * The purpose of this function is to create ComplexTypeProperty.
 * @param {Object} obj
 * @param {Object} options callback
 * @return {Object} JSON
 */
dcc.box.odata.schema.ComplexTypePropertyManager.prototype.create = function (obj,options) {
  var callbackExist = options !== undefined &&
  (options.success !== undefined ||
      options.error !== undefined ||
      options.complete !== undefined);
  if (callbackExist) {
    var headers = {};
    this._internalCreate(obj,headers,options);
  } else {
    var json = null;
    json = this._internalCreate(obj);
    return json;
  }
};

/**
 * The purpose of this function is to retrieve ComplexTypeProperty.
 * @param {String} complextypeName
 * @param {String} complexTypePropertyName
 * @return {Object} JSON
 */
dcc.box.odata.schema.ComplexTypePropertyManager.prototype.retrieve = function (complextypeName, complexTypePropertyName) {
  var json = null;
  var key = null;
  key = "Name='"+complexTypePropertyName+"',_ComplexType.Name='"+complextypeName+"'";
  if (complexTypePropertyName !== undefined && complextypeName !== undefined) {
    json = this._internalRetrieveMultikey(key);
  }
  return json;
};

/**
 * The purpose of this function is to retrieve ComplexTypePropertyList.
 * @param {String} complextypeName
 * @return {Object} JSON
 */
dcc.box.odata.schema.ComplexTypePropertyManager.prototype.retrieveComplexTypePropertyList = function (complextypeName) {
  if(complextypeName !== null || complextypeName !== undefined) {
    var uri = this.getComplexTypeUri(complextypeName);
    var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
    var response = restAdapter.get(uri, "application/json");
    var json = response.bodyAsJson().d.results;
    return json;
  }
};

/**
 * The purpose of this function is to delete ComplexTypeProperty
 * @param {String} key
 * @param {Object} options optional parameters having callback and headers
 * @returns {dcc.Promise} response
 */
dcc.box.odata.schema.ComplexTypePropertyManager.prototype.del = function(key, options) {
  /*if (typeof etag === "undefined") {
    etag = "*";
  }*/
  var response = this._internalDelMultiKey(key, options);
  return response;
};
/*
 * Copyright 2012 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

///**
//* @class Class for CRUD of Property.
//* @constructor
//* @augments jEntitySet
//*/
/**
 * It creates a new object dcc.box.odata.schema.PropertyManager.
 * @class This Class is used for performing CRUD operations of Property.
 * @constructor
 * @augments jEntitySet
 * @param {dcc.Accessor} as Accessor
 * @param {dcc.DcCollection} collection
 */
dcc.box.odata.schema.PropertyManager = function(as, collection) {
  this.initializeProperties(this, as, collection);
};
dcc.DcClass.extend(dcc.box.odata.schema.PropertyManager, dcc.box.odata.ODataManager);

/** The purpose of this function is to initialize properties.
 * @param {Object} self
 * @param {dcc.Accessor} as
 * @param {dcc.DcCollection} collection
 */
dcc.box.odata.schema.PropertyManager.prototype.initializeProperties = function(self, as, collection) {
  this.uber = dcc.box.odata.ODataManager.prototype;
  this.uber.initializeProperties(self, as, collection);
};

/**
 * The purpose of this function is to create URL.
 * @returns {String} URL
 */
dcc.box.odata.schema.PropertyManager.prototype.getUrl = function() {
  var sb = "";
  sb = this.getBaseUrl();
  sb += this.accessor.cellName;
  sb +="/";
  sb += this.accessor.boxName;
  sb +="/";
  sb += this.collection;
  sb += "/$metadata/Property";
  return sb;
};

/**
 * The purpose of this function is to create Property URI.
 * @param {String} entityTypeName
 * @returns {String} URL
 */
dcc.box.odata.schema.PropertyManager.prototype.getPropertyUri = function (entityTypeName) {
  var sb = "";
  sb = this.getBaseUrl();
  sb += this.accessor.cellName;
  sb +="/";
  sb += this.accessor.boxName;
  sb +="/";
  sb += this.collection;
  sb += "/$metadata/EntityType(";
  sb += "'"+entityTypeName+"'";
//sb += escape("'"+entityTypeName+"'");
  sb += ")/_Property";
  return sb;
};

/**
 * The purpose of this function is to create Property.
 * @param {Object} obj
 * @param {Object} options callback object.
 * @return {Object} json DcHttpClient
 */
dcc.box.odata.schema.PropertyManager.prototype.create = function (obj,options) {
  var json = null;
  var callbackExist = options !== undefined &&
  (options.success !== undefined ||
      options.error !== undefined ||
      options.complete !== undefined);
  if (callbackExist) {
    var headers ={};
    this._internalCreate(obj,headers,options);
  }
  else {
    json = this._internalCreate(obj);
    /*    if (json.response !== undefined) {
      if (json.response.status === 409 || json.response.status === 400) {
        return json.response.status;
      }
    }*/
    return json;
  }
};

/**
 * The purpose of this function is to retrieve Property.
 * @param {String} propertyName
 * @param {String} entityTypeName
 * @return {Object} JSON response
 */
dcc.box.odata.schema.PropertyManager.prototype.retrieve = function (propertyName, entityTypeName) {
  var json = null;
  var key = null;
  key = "Name='"+propertyName+"',_EntityType.Name='"+entityTypeName+"'";
  if (propertyName !== undefined && entityTypeName !== undefined) {
    json = this._internalRetrieveMultikey(key);
  }
  return json;
};

/**
 * The purpose of this function is to retrieve Property List.
 * @param {String} entityTypeName
 * @return {Object} JSON response
 */
dcc.box.odata.schema.PropertyManager.prototype.retrievePropertyList = function (entityTypeName) {
  if(entityTypeName !== null || entityTypeName !== undefined) {
    var uri = this.getPropertyUri(entityTypeName);
    var restAdapter = dcc.http.RestAdapterFactory.create(this.accessor);
    var response = restAdapter.get(uri, "application/json");
    var json = response.bodyAsJson().d.results;
    return json;
  }
};

/**
 * The purpose of this function is to delete Property.
 * @param {String} key
 * * @param {Object} options optional parameters having callback and headers
 * @returns {Object} response
 */
dcc.box.odata.schema.PropertyManager.prototype.del = function(key, options) {
  /*if (typeof etag === "undefined") {
    etag = "*";
  }*/
  var response = this._internalDelMultiKey(key, options);
  return response;
};

/**
 * Copyright 2012 Fujitsu Limited all rights reserved.
 */
/*global dcc:false */

/**
 * It creates a new object dcc.http.DcResponse.
 * @class This class is used to handle DAV Response.
 * @constructor
 * @param {Object} resObj response object
 */
dcc.http.DcResponse = function(resObj) {
  this.initializeProperties(resObj);
};

///**
//* プロパティを初期化する.
//* @param resObj response object
//*/
/**
 * This method initializes the properties of this class.
 * @param {Object} resObj response object
 */
dcc.http.DcResponse.prototype.initializeProperties = function(resObj) {
  this.response = resObj;
  this.debugHttpResponse(resObj);
};

/**
 * This method returns the HTTP Status Code.
 * @return {String} HTTP Status Code
 */
dcc.http.DcResponse.prototype.getStatusCode = function() {
  return this.response.status;
};

/**
 * The purpose of this method is to generate header
 * @param {String} key
 * @returns {String} header
 */
dcc.http.DcResponse.prototype.getHeader = function(key) {
  var header = this.response.getResponseHeader(key);
  if (header === null) {
    header = "";
  }
  return header;
};

//jDcResponse.prototype.bodyAsStream = function() {
//InputStream is = null;
//try {
//is = this.getResponseBodyInputStream(response);
//} catch (IOException e) {
//throw new RuntimeException(e);
//}
//return is;
//};

/**
 * The purpose of this method is to return the body in string form.
 * @returns {String} responseText
 */
dcc.http.DcResponse.prototype.bodyAsString = function() {
  return this.response.responseText;
//if (typeof enc == "undefined") {
//enc = "utf-8";
//}
//InputStream is = null;
//InputStreamReader isr = null;
//BufferedReader reader = null;
//try {
//is = this.getResponseBodyInputStream(response);
//if (is == null) {
//return "";
//}
//isr = new InputStreamReader(is, enc);
//reader = new BufferedReader(isr);
//StringBuffer sb = new StringBuffer();
//int chr;
//while ((chr = reader.read()) != -1) {
//sb.append((char) chr);
//}
//return sb.toString();
//} catch (IOException e) {
//throw ClientException.create("io exception", 0);
//} finally {
//try {
//if (is != null) {
//is.close();
//}
//if (isr != null) {
//isr.close();
//}
//if (reader != null) {
//reader.close();
//}
//} catch (Exception e) {
//throw ClientException.create("io exception", 0);
//} finally {
//try {
//if (isr != null) {
//isr.close();
//}
//if (reader != null) {
//reader.close();
//}
//} catch (Exception e2) {
//throw ClientException.create("io exception", 0);
//} finally {
//try {
//if (reader != null) {
//reader.close();
//}
//} catch (Exception e3) {
//throw ClientException.create("io exception", 0);
//}
//}
//}
//}
};

/**
 * This method retrieves and parses the response body with a JSON format.
 * @return {Object} parsed response JSON object.
 * @throws {dcc.ClientException} Client Exception
 */
dcc.http.DcResponse.prototype.bodyAsJson = function() {
  try {
    //this.response.bodyAsString
    return JSON.parse(this.response.responseText);

  } catch (e) {
    throw new dcc.ClientException("parse exception: " + e.message, 0);
  }
};

/**
 * This method retrieves and parses the response body with an XML format.
 * @return {String} XML parsed response body as XML DOM.
 */
dcc.http.DcResponse.prototype.bodyAsXml = function() {
  return this.response.responseXML;
};



//jDcResponse.prototype.getResponseBodyInputStream = function(res) {
//Header[] contentEncodingHeaders = res.getHeaders("Content-Encoding");
//if (contentEncodingHeaders.length > 0 && "gzip".equalsIgnoreCase(contentEncodingHeaders[0].getValue())) {
//return new GZIPInputStream(res.getEntity().getContent());
//} else {
//HttpEntity he = res.getEntity();
//if (he != null) {
//return he.getContent();
//} else {
//return null;
//}
//}
//};

/**
 * The purpose of this method is to perform logging operations while debugging
 * @param {dcc.http.DcHttpClient} res httpResponse
 */
dcc.http.DcResponse.prototype.debugHttpResponse = function(res) {
  if (res !== null) {
    //console.log("(Response) ResponseCode: " + res.statusText + "(" + res.status + ")");
    var headers = res.getAllResponseHeaders();
    var array = headers.split("\n");
    for (var i = 0; i < array.length; i++) {
      var keyValue = array[i].split(": ");
      //console.log("ResponseHeader[" + keyValue[0] + "] : " + keyValue[1]);
    }
  }
};


/*
 * Copyright 2012 Fujitsu Limited all rights reserved.
 */

/*function copyObject(src) {
    var dest;

    if (typeof src === "object") {
        if (src instanceof Array) {
            dest = [];
            for (var i=0;i<src.length;i++) {
                dest[i] = src[i];
//                dest[i] = copyObject(src[i]);
            }
        } else {
            dest = {};
            for (var prop in src) {
                dest[prop] = src[prop];
//                dest[prop] = copyObject(src[prop]);
            }
        }
    } else {
        dest = src;
    }
    return dest;
}*/

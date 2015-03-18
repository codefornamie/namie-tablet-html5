/*
 * Copyright 2015 NamieTown
 *             http://www.town.namie.fukushima.jp/
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function StatusCode() {

}
StatusCode.HTTP_OK = 200;
StatusCode.HTTP_CREATED = 201;
StatusCode.HTTP_UNAUTHORIZED = 401;
StatusCode.HTTP_FORBIDDEN = 403;
StatusCode.HTTP_NOT_FOUND = 404;
StatusCode.HTTP_METHOD_NOT_ALLOWD = 405;
StatusCode.HTTP_CONFLICT = 409;
StatusCode.HTTP_BAD_REQUEST = 400;
StatusCode.HTTP_REQUEST_TIME_OUT = 408;
StatusCode.HTTP_PRECONDITION_FAILED = 412;
StatusCode.HTTP_INTERNAL_SERVER_ERROR = 500;

exports.StatusCode = StatusCode;
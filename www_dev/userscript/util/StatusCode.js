function StatusCode() {

}
StatusCode.HTTP_OK = 200;
StatusCode.HTTP_CREATED = 201;
StatusCode.HTTP_UNAUTHORIZED = 401;
StatusCode.HTTP_NOT_FOUND = 404;
StatusCode.HTTP_METHOD_NOT_ALLOWD = 405;
StatusCode.HTTP_CONFLICT = 409;
StatusCode.HTTP_BAD_REQUEST = 400;
StatusCode.HTTP_REQUEST_TIME_OUT = 408;
StatusCode.HTTP_PRECONDITION_FAILED = 412;
StatusCode.HTTP_INTERNAL_SERVER_ERROR = 500;

exports.StatusCode = StatusCode;
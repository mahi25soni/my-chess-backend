class CustomError extends Error {
  public statusCode: any;
  public errorCode: any;
  public sirname: any;

  constructor(statusCode: any, message: any, errorCode: any) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

class BadRequestException extends CustomError {
  constructor(message: any, errorCode = "bad_request") {
    super(404, message, errorCode);
  }
}

export { BadRequestException };

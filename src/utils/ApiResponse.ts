class ApiReponse {
  private res: any;

  constructor(res: any) {
    this.res = res;
  }

  public sendSuccessResponse(data: any, message: string) {
    return this.res.status(200).json({
      statusCode: 200,
      success: true,
      message,
      data
    });
  }
}

export default ApiReponse;

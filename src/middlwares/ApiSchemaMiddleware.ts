import { Request, Response, NextFunction } from "express";
import path from "path";
import * as fs from "fs";
import cacheSchema from "../../cache.json";
import Ajv from "ajv";
import { BadRequestException } from "../utils/CustomExceptions";

const ajv = new Ajv({
  removeAdditional: false,
  allErrors: true,
  strict: false
});

class ApiSchemaMiddlware {
  private cacheData: any = null;

  public checkSchema(req: Request, res: Response, next: NextFunction) {
    try {
      const urlParts: string[] = req.originalUrl.split("/").filter(Boolean);
      const cacheKey: string = "/" + urlParts.slice(0, -1).join("/");

      console.log(typeof req.body);

      if (
        cacheSchema[cacheKey] &&
        cacheSchema[cacheKey].schemas[req.originalUrl]
      ) {
        const expectedReqSchema: any =
          cacheSchema[cacheKey].schemas[req.originalUrl];
        console.log("expedtedschema ", expectedReqSchema);
        const validate = ajv.compile(expectedReqSchema);
        const valid = validate(req.body);

        if (!valid && validate.errors) {
          console.log(validate.errors);
          const errorMessage =
            validate.errors[0].message || "Error in request body";
          throw new BadRequestException(errorMessage);
        }

        console.log("the valid is ", valid);
      }

      next();
    } catch (error) {
      next(error);
    }
  }
}

export default new ApiSchemaMiddlware();

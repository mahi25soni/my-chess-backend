import * as TJS from "typescript-json-schema";
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import crypto from "crypto";

const catchedFilePath: any = path.join(__dirname, "../../cache.json");

const generateCacheSchema: any = (): any => {
  const settings: any = {
    required: true
  };

  const filePath: any = path.join(__dirname, "../schemas/schemas.json");
  const schemaJsonFile: any = readFileSync(filePath, {
    encoding: "utf8",
    flag: "r"
  });
  const cacheJsonFile: any = readFileSync(catchedFilePath, {
    encoding: "utf8",
    flag: "r"
  });

  console.log("schemaJsonFile", typeof schemaJsonFile);

  const parsedSchemaFile: any = JSON.parse(schemaJsonFile);
  const parsedCacheFile: any = JSON.parse(cacheJsonFile);

  Object.keys(parsedSchemaFile).forEach((route: any) => {
    Object.keys(parsedSchemaFile[route]).forEach((method: any) => {
      const finalObject: any = parsedSchemaFile[route][method];
      const fileTypePath: any = path.resolve(
        __dirname,
        `../${finalObject.file}`
      );
      const program: any = TJS.getProgramFromFiles([fileTypePath], {
        strictNullChecks: true
      });

      const hashOfFile: any = crypto
        .createHash("sha256")
        .update(readFileSync(fileTypePath))
        .digest("hex");
      if (!parsedCacheFile[route]) {
        parsedCacheFile[route] = {
          hash: hashOfFile
        };
      }

      const schema: any = TJS.generateSchema(
        program,
        finalObject.type,
        settings
      );

      parsedCacheFile[route][method] = schema;
      const something: any = JSON.stringify(parsedCacheFile, null, 2);
      writeFileSync(catchedFilePath, something, {
        encoding: "utf8",
        flag: "w"
      });
    });
  });
};

export default generateCacheSchema;

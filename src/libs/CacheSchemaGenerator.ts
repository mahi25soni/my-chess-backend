import path from "path";
import * as fs from "fs";
import crypto from "crypto";
import * as TJS from "typescript-json-schema";

const schemaFilePath: string = path.join(__dirname, "../schemas/schemas.json");

// Cache.json filepath and checking
const cacheFilePath: string = path.join(__dirname, "../../cache.json");
fs.existsSync(cacheFilePath) ||
  fs.mkdirSync(cacheFilePath, {
    recursive: true
  });

// Bsic tjs setting
const settings: TJS.PartialArgs = {
  required: true,
  noExtraProps: true
};
const compilerOptions: TJS.CompilerOptions = {
  strictNullChecks: true
};

const generateCacheSchema: any = (): any => {
  const schemaData: any = JSON.parse(
    fs.readFileSync(schemaFilePath, {
      encoding: "utf-8"
    })
  );

  console.log("the shcme data is ", schemaData);

  const stats = fs.statSync(cacheFilePath);
  stats.size === 0 ? fs.writeFileSync(cacheFilePath, "{}") : "";

  const cachedData: any = JSON.parse(
    fs.readFileSync(cacheFilePath, {
      encoding: "utf-8"
    })
  );

  schemaData?.map((element: any) => {
    const sourceFile: string = path.join(__dirname, `../${element?.source}`);
    const sourceFileData: any = fs.readFileSync(sourceFile, "utf-8");
    const hashSourceFile: string = crypto
      .createHash("sha256")
      .update(sourceFileData)
      .digest("hex");

    if (!cachedData[element?.baseUrl]) {
      cachedData[element.baseUrl] = {};
    }

    if (cachedData[element?.baseUrl]?.hash !== hashSourceFile) {
      console.log("hash toh change huva hai daai, kuchh bhi kaho");
      cachedData[element?.baseUrl].hash = hashSourceFile;
      cachedData[element?.baseUrl].schemas = {};
      const program = TJS.getProgramFromFiles([sourceFile], compilerOptions);
      element?.schema.map((singleSchema: any) => {
        const tjsGeneratedSchema = TJS.generateSchema(
          program,
          singleSchema.schema,
          settings
        );
        cachedData[element?.baseUrl].schemas = {
          ...cachedData[element?.baseUrl.schhemas],
          [singleSchema.api]: tjsGeneratedSchema
        };
        const dataForCache = JSON.stringify(cachedData, null, 2);

        fs.writeFileSync(cacheFilePath, dataForCache, "utf-8");
      });
    }
  });
};

export default generateCacheSchema;

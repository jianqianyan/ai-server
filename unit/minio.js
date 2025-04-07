import * as Minio from "minio";
import {
  MINIO_ACCESS_KEY,
  MiNIO_BUCKET_NAME,
  MINIO_HOST,
  MINIO_PORT,
  MiNIO_SECRET_KEY,
} from "../config/minio.js";
import { v4 } from "uuid";

export class MinioServer {
  minioClient;
  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: MINIO_HOST,
      port: MINIO_PORT,
      useSSL: false,
      accessKey: MINIO_ACCESS_KEY,
      secretKey: MiNIO_SECRET_KEY,
    });
  }

  async savePpt(arrayBuffer, type = "pptx") {
    const buffer = Buffer.from(arrayBuffer)
    const objectName = `${v4()}.${type}`;
    const bucketName = MiNIO_BUCKET_NAME;
    const bucketExists = await this.minioClient.bucketExists(bucketName);
    if (!bucketExists) {
      await this.minioClient.makeBucket(bucketName);
    }
    await this.minioClient.putObject(bucketName, objectName, buffer);
    return `http://${MINIO_HOST}:${MINIO_PORT}/${MiNIO_BUCKET_NAME}/${objectName}`;
  }
}

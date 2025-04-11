import * as Minio from 'minio'

import { MinioConfig } from '../config/minio';
import { v4 } from 'uuid';

export class MinioService {
  private minioClient: Minio.Client;
  private config: MinioConfig;
  constructor() {
    this.config = new MinioConfig()
    this.minioClient = new Minio.Client({
      endPoint: this.config.endPoint,
      port: this.config.port,
      accessKey: this.config.accessKey,
      secretKey: this.config.secretKey,
      useSSL: this.config.useSSL
    })
  }

  async save(arrayBuffer: ArrayBuffer, type = 'image/jpeg') {
    const buffer = Buffer.from(arrayBuffer)
    const objectName = `${v4()}.${type}`
    const bucketExists = await this.minioClient.bucketExists(this.config.bucket)
    if (!bucketExists) {
      await this.minioClient.makeBucket(this.config.bucket)
    }
    await this.minioClient.putObject(this.config.bucket, objectName, buffer)
    return `${this.config.endPoint}:${this.config.port}/${this.config.bucket}/${objectName}`
  }
}
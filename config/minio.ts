import { getRequireEnv } from "./config";

export class MinioConfig {
  readonly endPoint: string;
  readonly port: number;
  readonly accessKey: string;
  readonly secretKey: string;
  readonly bucket: string;
  readonly useSSL: boolean = false;

  constructor() {
    this.endPoint = getRequireEnv('MINIO_HOST');
    this.port = Number(getRequireEnv('MINIO_PORT')) || 9000;
    this.accessKey = getRequireEnv('MINIO_ACCESS_KEY');
    this.secretKey = getRequireEnv('MINIO_SECRET_KEY');
    this.bucket = getRequireEnv('MINIO_BUCKET');
    this.useSSL = getRequireEnv('MINIO_USE_SSL') === 'true';
  }
}
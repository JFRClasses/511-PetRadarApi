import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { envs } from 'src/config/envs';
import { randomUUID } from 'crypto';
import { extname } from 'path';
@Injectable()
export class StorageService {
    private readonly s3Bucket = new S3Client({
        region: envs.AWS_REGION
    });

    async uploadFile(file:any,folder:string){
        const key = `${folder}/${randomUUID()}-${extname(file.originalname)}`
        await this.s3Bucket.send(
            new PutObjectCommand({
                Bucket: envs.AWS_BUCKET,
                Key: key,
                ContentType: file.mimeType,
                Body: file.buffer
            })
        );
        const url = `https://${envs.AWS_BUCKET}.s3.${envs.AWS_REGION}.amazonaws.com/${key}`;
        return url;
    }
}
// image/jpeg image/png application/pdf

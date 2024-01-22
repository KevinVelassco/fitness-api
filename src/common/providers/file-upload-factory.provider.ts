import * as fs from 'fs';

import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { UploadApiOptions, v2 as cloudinary } from 'cloudinary';

import appConfig from '../../config/app.config';
import {
  DestroyFileDto,
  DestroyFileOutPutDto,
  ImageUploadOptionsDto,
  UploadFileOutPutDto,
} from './dto';
import { checkFileExceedingMaximumSize } from '../helpers';

@Injectable()
export class FileUploadFactory {
  private readonly logger = new Logger(FileUploadFactory.name);

  constructor(
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,
  ) {
    cloudinary.config({
      cloud_name: this.appConfiguration.cloudinary.cloudName,
      api_key: this.appConfiguration.cloudinary.apiKey,
      api_secret: this.appConfiguration.cloudinary.apiSecret,
    });
  }

  async uploadImages(
    files: Array<Express.Multer.File>,
    imageUploadOptionsDto: ImageUploadOptionsDto<UploadApiOptions>,
  ): Promise<UploadFileOutPutDto[]> {
    if (!files.length) throw new BadRequestException('file is required.');

    const { revertAllIfAnyImageFails, uploadApiOptions, maxSize } =
      imageUploadOptionsDto;

    const isImageFile = files.every(({ mimetype }) =>
      mimetype.startsWith('image'),
    );

    if (!isImageFile) {
      this.deleteTemporaryFiles(files);
      throw new BadRequestException('mimetype not allowed.');
    }

    if (checkFileExceedingMaximumSize(files, maxSize)) {
      this.deleteTemporaryFiles(files);
      throw new BadRequestException(
        `file size too large, the maximum size allowed is ${maxSize}MB.`,
      );
    }

    const folderName =
      this.appConfiguration.environment === 'production'
        ? 'images'
        : `${this.appConfiguration.environment}_images`;

    const uploadImages = files.map(({ filename, path }) =>
      cloudinary.uploader.upload(path, {
        folder: folderName,
        public_id: filename.split('.')[0],
        use_filename: true,
        quality: 'auto:best',
        ...uploadApiOptions,
      }),
    );

    let resultOfUploadedImages = [];

    try {
      resultOfUploadedImages = await Promise.allSettled(uploadImages);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error.message);
    } finally {
      this.deleteTemporaryFiles(files);
    }

    const hasRejectedImages = resultOfUploadedImages.some(
      ({ status }) => status === 'rejected',
    );

    if (hasRejectedImages) {
      if (revertAllIfAnyImageFails) {
        resultOfUploadedImages.forEach(
          ({ status, value }) =>
            status === 'fulfilled' &&
            this.destroy({ cloudId: value.public_id }),
        );
      }

      resultOfUploadedImages
        .filter(({ status }) => status === 'rejected')
        .forEach(({ reason }) => this.logger.error(reason.error || reason));

      if (revertAllIfAnyImageFails) {
        throw new ConflictException(
          'Something is wrong with the images upload!',
        );
      }
    }

    const images = resultOfUploadedImages.map(({ value, status }) => {
      if (!revertAllIfAnyImageFails)
        return {
          cloudId: value?.public_id,
          url: value?.secure_url,
          status,
        };

      return {
        cloudId: value.public_id,
        url: value.secure_url,
      };
    });

    return images;
  }

  async destroy(destroyFileDto: DestroyFileDto): Promise<DestroyFileOutPutDto> {
    try {
      const { cloudId } = destroyFileDto;

      const response = await cloudinary.uploader.destroy(cloudId);

      if (response.result !== 'ok')
        this.logger.error(`destroy ${JSON.stringify(response)}`);

      return response;
    } catch (error) {
      this.logger.error(error);

      throw new ConflictException(
        'something is wrong with deleting the image!',
      );
    }
  }

  private deleteTemporaryFiles(files: Array<Express.Multer.File>): void {
    files.forEach(({ path }) => {
      if (path && fs.existsSync(path)) fs.unlinkSync(path);
    });
  }
}

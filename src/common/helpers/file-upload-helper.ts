import { BadRequestException } from '@nestjs/common';
import { generateUid } from './generate-uid-helper';

export const renameFile = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: any,
) => {
  if (!file) return callback(new Error('file is required.'), false);

  const fileExtension = file.mimetype.split('/')[1];

  const uid = generateUid();

  const fileName = `${uid}.${fileExtension}`;

  callback(null, fileName);
};

export const checkFileExceedingMaximumSize = (
  files: Array<Express.Multer.File>,
  sizeInMB: number,
): boolean => {
  if (!files.length) throw new BadRequestException('file is required.');

  const mbInbytes = 1024 * 1024;

  const maximumSize = sizeInMB * mbInbytes;

  return files.some(({ size }) => size > maximumSize);
};

export class ImageUploadOptionsDto<UploadApiOptions> {
  readonly revertAllIfAnyImageFails: boolean;

  /** Max field value size in MB */
  readonly maxSize: number;

  readonly uploadApiOptions?: UploadApiOptions;
}

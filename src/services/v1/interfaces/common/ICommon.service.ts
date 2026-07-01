export interface ICommonService {
  streamImageByKey(key: string): Promise<string | undefined>;
  getSecureDocumentUrl(publicId: string): Promise<string | undefined>;
}

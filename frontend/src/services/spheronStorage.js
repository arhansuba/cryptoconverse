import { SpheronClient, ProtocolEnum } from "@spheron/storage";

class SpheronStorageService {
  constructor() {
    this.client = null;
    this.token = process.env.REACT_APP_SPHERON_TOKEN;
  }

  async initialize() {
    if (!this.client) {
      this.client = new SpheronClient({ token: this.token });
    }
  }

  async uploadFile(file) {
    await this.initialize();

    try {
      const { uploadToken } = await this.client.createSingleUploadToken({
        name: file.name,
        protocol: ProtocolEnum.IPFS,
      });

      const response = await this.client.upload(file, {
        token: uploadToken,
        protocol: ProtocolEnum.IPFS,
      });

      return response.uri;  // This is the IPFS hash (CID) of the uploaded file
    } catch (error) {
      console.error("Error uploading file to Spheron:", error);
      throw error;
    }
  }

  async downloadFile(cid) {
    await this.initialize();

    try {
      const response = await this.client.getFileFromCid(cid);
      return response;
    } catch (error) {
      console.error("Error downloading file from Spheron:", error);
      throw error;
    }
  }

  async listFiles() {
    await this.initialize();

    try {
      const files = await this.client.listUploads();
      return files;
    } catch (error) {
      console.error("Error listing files from Spheron:", error);
      throw error;
    }
  }

  // Add more methods as needed for your specific use cases
}

export const spheronStorageService = new SpheronStorageService();
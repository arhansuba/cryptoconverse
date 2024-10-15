const { SpheronClient, ProtocolEnum } = require("@spheron/storage");

const client = new SpheronClient({ token: process.env.SPHERON_TOKEN });

exports.uploadFile = async (filePath) => {
  try {
    const { uploadId } = await client.upload(filePath, {
      protocol: ProtocolEnum.IPFS,
      name: `CryptoConverse_${Date.now()}`,
      onUploadInitiated: (uploadId) => {
        console.log(`Upload initiated with ID: ${uploadId}`);
      },
      onChunkUploaded: (uploadedSize, totalSize) => {
        console.log(`Uploaded ${uploadedSize} of ${totalSize} Bytes.`);
      },
    });
    
    console.log(`Upload completed. Upload ID: ${uploadId}`);
    return uploadId;
  } catch (error) {
    console.error('Error uploading file to Spheron:', error);
    throw error;
  }
};

exports.getUploadStatus = async (uploadId) => {
  try {
    const status = await client.getUploadStatus(uploadId);
    return status;
  } catch (error) {
    console.error('Error fetching upload status from Spheron:', error);
    throw error;
  }
};

exports.downloadFile = async (uploadId, destinationPath) => {
  try {
    await client.download(uploadId, destinationPath);
    console.log(`File downloaded successfully to ${destinationPath}`);
  } catch (error) {
    console.error('Error downloading file from Spheron:', error);
    throw error;
  }
};
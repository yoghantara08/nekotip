import { ChangeEvent, useEffect, useState } from 'react';

import { PinResponse } from 'pinata-web3';

import { pinata } from '@/lib/utils/config';

interface UseUploadMultipleImagesReturn {
  previews: string[];
  selectedFiles: File[];
  uploadErrors: string[];
  uploading: boolean;
  uploadedUrls: string[];
  // eslint-disable-next-line no-unused-vars
  handleFilesChange: (event: ChangeEvent<HTMLInputElement>) => void;
  uploadImages: () => Promise<string[]>;
  resetUpload: () => void;
  // eslint-disable-next-line no-unused-vars
  removeContentImage: (val: number) => void;
}

const useUploadMultipleImages = (
  maxSizeInMB: number = 5,
  acceptedTypes: string[] = ['image/'],
  maxFiles: number = 5,
): UseUploadMultipleImagesReturn => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  useEffect(() => {
    // Clear previous previews and create new ones
    const objectUrls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviews(objectUrls);

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);

  const validateFiles = (files: File[]): boolean => {
    const errors: string[] = [];

    if (files.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed`);
    }

    const validFiles = files.filter((file) => {
      const isValidType = acceptedTypes.some((type) =>
        file.type.startsWith(type),
      );

      const maxBytes = maxSizeInMB * 1024 * 1024;
      const isValidSize = file.size <= maxBytes;

      if (!isValidType) {
        errors.push(`Invalid file type: ${file.name}`);
      }
      if (!isValidSize) {
        errors.push(`File ${file.name} exceeds ${maxSizeInMB}MB limit`);
      }

      return isValidType && isValidSize;
    });

    if (errors.length > 0) {
      setUploadErrors(errors);
      return false;
    }

    const uniqueNewFiles = validFiles.filter(
      (newFile) =>
        !selectedFiles.some(
          (existingFile) =>
            existingFile.name === newFile.name &&
            existingFile.size === newFile.size &&
            existingFile.type === newFile.type,
        ),
    );

    const totalFiles = [...selectedFiles, ...uniqueNewFiles];

    if (totalFiles.length > maxFiles) {
      setUploadErrors([`Maximum ${maxFiles} files allowed`]);
      return false;
    }

    setSelectedFiles(totalFiles);
    return true;
  };

  const handleFilesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    setUploadErrors([]);
    validateFiles(files);

    if (event.target.value) {
      event.target.value = '';
    }
  };

  const uploadImages = async (): Promise<string[]> => {
    if (selectedFiles.length === 0) {
      setUploadErrors(['Please select at least one image']);
      return [];
    }

    setUploading(true);
    setUploadErrors([]);

    try {
      const uploadPromises = selectedFiles.map(async (file) => {
        const response: PinResponse = await pinata.upload.file(file);
        return `${pinata.config?.pinataGateway}/ipfs/${response.IpfsHash}`;
      });

      const urls = await Promise.all(uploadPromises);

      setUploadedUrls(urls);
      setSelectedFiles([]);
      return urls;
    } catch (error) {
      console.error('Upload error:', error);
      setUploadErrors(['Error uploading to Pinata']);
      return [];
    } finally {
      setUploading(false);
    }
  };

  const removeContentImage = (indexToRemove: number) => {
    setSelectedFiles(
      selectedFiles.filter((_, index) => index !== indexToRemove),
    );
    setPreviews(previews.filter((_, index) => index !== indexToRemove));
  };

  const resetUpload = () => {
    setSelectedFiles([]);
    setPreviews([]);
    setUploadErrors([]);
    setUploadedUrls([]);
  };

  return {
    previews,
    selectedFiles,
    uploadErrors,
    uploading,
    uploadedUrls,
    handleFilesChange,
    uploadImages,
    resetUpload,
    removeContentImage,
  };
};

export default useUploadMultipleImages;

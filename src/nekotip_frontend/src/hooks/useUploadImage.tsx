import { ChangeEvent, useEffect, useState } from 'react';

import { PinResponse } from 'pinata-web3';

import { pinata } from '@/lib/utils/config';

interface UseUploadImageReturn {
  preview: string;
  selectedFile: File | null;
  uploadError: string;
  uploading: boolean;
  uploadedUrl: string;
  // eslint-disable-next-line no-unused-vars
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  uploadImage: () => Promise<string | null>;
  resetUpload: () => void;
}

const useUploadImage = (
  maxSizeInMB: number = 5,
  acceptedTypes: string[] = ['image/'],
): UseUploadImageReturn => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');

  // Image preview effect
  useEffect(() => {
    if (!selectedFile) {
      setPreview('');
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  // File validation method
  const validateFile = (file: File): boolean => {
    // Check file type
    const isValidType = acceptedTypes.some((type) =>
      file.type.startsWith(type),
    );
    if (!isValidType) {
      setUploadError(
        `Please select a valid file type: ${acceptedTypes.join(', ')}`,
      );
      return false;
    }

    // Check file size
    const maxBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setUploadError(`File size must be less than ${maxSizeInMB}MB`);
      return false;
    }

    return true;
  };

  // Handle file selection
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      // Reset previous errors
      setUploadError('');

      // Validate file
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }

    // Clear input to allow selecting the same file again
    if (event.target.value) {
      event.target.value = '';
    }
  };

  // Upload image to Pinata
  const uploadImage = async (): Promise<string | null> => {
    if (!selectedFile) {
      setUploadError('Please select an image');
      return null;
    }

    setUploading(true);
    setUploadError('');

    try {
      const response: PinResponse = await pinata.upload.file(selectedFile);
      const ipfsUrl = `${pinata.config?.pinataGateway}/ipfs/${response.IpfsHash}`;

      setUploadedUrl(ipfsUrl);
      setSelectedFile(null);

      return ipfsUrl;
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Error uploading to Pinata');
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Reset upload state
  const resetUpload = () => {
    setSelectedFile(null);
    setPreview('');
    setUploadError('');
    setUploadedUrl('');
  };

  return {
    preview,
    selectedFile,
    uploadError,
    uploading,
    uploadedUrl,
    handleFileChange,
    uploadImage,
    resetUpload,
  };
};

export default useUploadImage;

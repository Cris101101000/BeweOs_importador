import { useCallback, useState } from "react";

export const useFileSource = (initialFiles: File[]) => {
	const [uploadedFiles, setUploadedFiles] = useState<File[]>(initialFiles);

	const handleUploadFiles = useCallback((files: File[]) => {
		setUploadedFiles((prev) => [...prev, ...files].slice(0, 5));
	}, []);

	const handleRemoveFile = useCallback((index: number) => {
		setUploadedFiles((prev) =>
			prev.filter((_, fileIndex) => fileIndex !== index)
		);
	}, []);

	return {
		uploadedFiles,
		handleUploadFiles,
		handleRemoveFile,
	};
};

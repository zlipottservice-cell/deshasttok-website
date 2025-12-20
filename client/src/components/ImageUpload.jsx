import React, { useState, useRef, useEffect } from 'react';
import { uploadImage } from '../services/api';
import { Upload, X, Crop } from 'lucide-react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const ImageUpload = ({ label, value, onChange, name }) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(value || '');
    const [showCrop, setShowCrop] = useState(false);
    const [imageToCrop, setImageToCrop] = useState(null);
    const [crop, setCrop] = useState({ unit: '%', width: 50, height: 50, x: 25, y: 25 });
    const [completedCrop, setCompletedCrop] = useState(null);
    const imgRef = useRef(null);

    // Sync preview with value prop when it changes (for edit mode)
    useEffect(() => {
        if (value && value !== preview) {
            setPreview(value);
        }
    }, [value]);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setImageToCrop(reader.result);
            setShowCrop(true);
        };
        reader.readAsDataURL(file);
    };

    const getCroppedImg = (image, crop) => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/jpeg', 0.9);
        });
    };

    const handleCropComplete = async () => {
        if (!completedCrop || !imgRef.current) return;

        setShowCrop(false);
        setUploading(true);

        try {
            const croppedBlob = await getCroppedImg(imgRef.current, completedCrop);
            const file = new File([croppedBlob], 'cropped-image.jpg', { type: 'image/jpeg' });

            // Upload to server
            const url = await uploadImage(file);

            // Update preview with server URL
            setPreview(url);
            onChange(name, url);
        } catch (error) {
            alert('Image upload failed');
            setPreview('');
        } finally {
            setUploading(false);
            setImageToCrop(null);
        }
    };

    const handleSkipCrop = async () => {
        setShowCrop(false);
        setUploading(true);

        try {
            // Convert data URL to blob
            const res = await fetch(imageToCrop);
            const blob = await res.blob();
            const file = new File([blob], 'image.jpg', { type: blob.type });

            // Upload to server
            const url = await uploadImage(file);

            // Update preview with server URL
            setPreview(url);
            onChange(name, url);
        } catch (error) {
            alert('Image upload failed');
            setPreview('');
        } finally {
            setUploading(false);
            setImageToCrop(null);
        }
    };

    const handleRemove = () => {
        setPreview('');
        onChange(name, '');
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{label}</label>

            {showCrop ? (
                <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
                    <p className="text-sm text-gray-700 mb-3 font-medium">Crop Image (Optional)</p>
                    <ReactCrop
                        crop={crop}
                        onChange={(c) => setCrop(c)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={undefined}
                    >
                        <img
                            ref={imgRef}
                            src={imageToCrop}
                            alt="Crop preview"
                            className="max-w-full max-h-96"
                        />
                    </ReactCrop>
                    <div className="flex gap-3 mt-4">
                        <button
                            type="button"
                            onClick={handleCropComplete}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            <Crop className="h-4 w-4" />
                            Apply Crop
                        </button>
                        <button
                            type="button"
                            onClick={handleSkipCrop}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        >
                            Skip Crop
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowCrop(false);
                                setImageToCrop(null);
                            }}
                            className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : preview ? (
                <div className="relative inline-block">
                    <img
                        src={preview}
                        alt="Preview"
                        className="max-w-xs max-h-40 rounded-lg border-2 border-gray-200"
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-100 border-2 border-gray-300 rounded-lg hover:bg-gray-200 transition-colors">
                        <Upload className="h-4 w-4" />
                        <span className="text-sm">{uploading ? 'Uploading...' : 'Choose Image'}</span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                            disabled={uploading}
                        />
                    </label>
                    <span className="text-xs text-gray-500">JPG, PNG, GIF (max 5MB)</span>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;

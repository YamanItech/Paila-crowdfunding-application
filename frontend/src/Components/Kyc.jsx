import { useState, useEffect } from 'react';
import { Upload, Shield, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export default function Kyc() {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [documents, setDocuments] = useState({
    nationalId: null
  });
  const [uploadStatus, setUploadStatus] = useState({
    nationalId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    const userId = localStorage.getItem('id');
    if (userId) {
      setId(userId);
    }
  }, []);

  const handleFileChange = (docType, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setFeedback({
        type: 'error',
        message: 'Invalid file type. Please upload JPG or PNG images only.'
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFeedback({
        type: 'error',
        message: 'File is too large. Maximum size is 5MB.'
      });
      return;
    }

    setUploadStatus(prev => ({
      ...prev,
      [docType]: 'uploading'
    }));

    setFeedback({ type: '', message: '' });

    const previewUrl = URL.createObjectURL(file);

    setTimeout(() => {
      setDocuments(prev => ({
        ...prev,
        [docType]: {
          file: file,
          preview: previewUrl
        }
      }));

      setUploadStatus(prev => ({
        ...prev,
        [docType]: 'success'
      }));
    }, 500);
  };

  const removeFile = (docType) => {
    if (documents[docType]?.preview) {
      URL.revokeObjectURL(documents[docType].preview);
    }

    setDocuments(prev => ({
      ...prev,
      [docType]: null
    }));

    setUploadStatus(prev => ({
      ...prev,
      [docType]: ''
    }));

    setFeedback({ type: '', message: '' });
  };

  const renderUploadStatus = (docType) => {
    switch (uploadStatus[docType]) {
      case 'uploading':
        return <div className="flex items-center text-blue-500"><AlertCircle size={16} className="mr-1" /> Processing...</div>;
      case 'success':
        return <div className="flex items-center text-green-600"><CheckCircle size={16} className="mr-1" /> Ready to submit</div>;
      default:
        return null;
    }
  };

  const renderDocumentUploader = (docType, label, description) => {
    return (
      <div className="mb-6 p-4 border rounded-lg border-gray-200 bg-white">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg text-gray-800">{label}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
          </div>

          {documents[docType] && (
            <button
              onClick={() => removeFile(docType)}
              className="text-gray-500 hover:text-red-500"
              aria-label="Remove file"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {documents[docType] ? (
          <div className="mt-3">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200">
              <div className="flex items-center">
                <div className="text-sm text-gray-800 truncate max-w-xs">
                  {documents[docType].file.name}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {renderUploadStatus(docType)}
              </div>
            </div>
            <div className="mt-3">
              <img
                src={documents[docType].preview}
                alt="Uploaded Document"
                className="w-full max-h-96 object-contain border border-gray-300 rounded"
              />
            </div>
          </div>
        ) : (
          <div className="mt-3">
            <label
              htmlFor={`upload-${docType}`}
              className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload size={24} className="text-gray-500 mb-2" />
                <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-400">JPG or PNG images only (max 5MB)</p>
              </div>
              <input
                id={`upload-${docType}`}
                type="file"
                className="hidden"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(docType, e)}
              />
            </label>
          </div>
        )}
      </div>
    );
  };

  const handleSubmit = async () => {
    if (!documents.nationalId) {
      setFeedback({
        type: 'error',
        message: 'Please upload a document before submitting.'
      });
      return;
    }

    if (!id) {
      setFeedback({
        type: 'error',
        message: 'User authentication error. Please log in again.'
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback({ type: 'info', message: 'Submitting your document...' });

    const formData = new FormData();
    formData.append('kycImage', documents.nationalId.file);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND}/api/v1/users/${id}/updatekyc`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Upload failed');
      }

      const data = await response.json();
      localStorage.setItem('verified', "verified");
      navigate('/company/profile', { replace: true });
      setFeedback({
        type: 'success',
        message: 'Document submitted successfully! Your identity is gone for verification.'
      });

      console.log(data);
    } catch (error) {
      console.error(error);
      setFeedback({
        type: 'error',
        message: error.message || 'There was an error submitting the document.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFeedback = () => {
    if (!feedback.message) return null;

    const bgColor =
      feedback.type === 'error' ? 'bg-red-50 border-red-100 text-red-700' :
        feedback.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' :
          feedback.type === 'info' ? 'bg-blue-50 border-blue-100 text-blue-700' :
            'bg-gray-50 border-gray-100 text-gray-700';

    return (
      <div className={`p-3 rounded-lg border mb-4 ${bgColor}`}>
        <div className="flex items-center">
          {feedback.type === 'error' && <AlertCircle size={16} className="mr-2" />}
          {feedback.type === 'success' && <CheckCircle size={16} className="mr-2" />}
          {feedback.type === 'info' && <AlertCircle size={16} className="mr-2" />}
          <span>{feedback.message}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <Shield className="text-blue-500 mr-3 mt-1" size={20} />
          <div>
            <h2 className="font-medium text-blue-800">Document Verification</h2>
            <p className="text-blue-600 text-sm">Please upload any one document for verification such as National ID, Driving License, Passport or Utility Bill.</p>
          </div>
        </div>
      </div>

      {renderFeedback()}

      <div>
        {renderDocumentUploader(
          'nationalId',
          'Upload Verification Document',
          'Choose any one: National ID, Driving License, Passport, or Utility Bill'
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !documents.nationalId}
            className={`${isSubmitting || !documents.nationalId ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Document'}
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useCallback, useEffect, useState } from 'react'
import { FcUpload } from 'react-icons/fc';
import { useDropzone } from 'react-dropzone';

const Attachments = () => {

  const [uploadedFiles, setUploadedFiles] = useState([]);

useEffect(()=>{
  return()=>{}
},[])

const onDrop = useCallback((acceptedFiles) => {
  // Handle the uploaded files here
  setUploadedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
}, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    // accept: {
    //   "text/csv": ['.csv'],
    //   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ['.xlsx']
    // },
    maxSize: 5242880, // 5MB max file size
    multiple: true
});

  return (
    <div id="attachments">
    <div className="card">
        <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <h4 className="fw-semibold mb-0">Attachment</h4>
        </div>
        <div className="card-body">
            <div className="uploadSectionContainer">
                <div
                    {...getRootProps()}
                    className={`uploadSectionInnerBox ${isDragActive ? "drag-active" : ""}`}
                >
                    <input {...getInputProps()} />
                    <div className="uploadSectionImageBox">
                        <FcUpload style={{ fontSize: 30 }} />
                    </div>
                    <div className="profile-upload d-block">
                        <div className="profile-upload-content">
                            <label className="profile-upload-btn">
                                <i className="ti ti-file-broken" /> Upload File
                            </label>
                            {isDragActive ? (
                                <p>Drop the files here ...</p>
                            ) : (
                                <p>Drag 'n' drop Excel or CSV files here, or click to select them</p>
                            )}
                        </div>
                    </div>
                    <p className="supportedFormat">
                        (Supported formats .csv, .xlsx; max file size 5 MB)
                    </p>

                </div>
            </div>
            {uploadedFiles.length > 0 && (
                <div className="uploaded-files">
                    <h4>Uploaded Files:</h4>
                    <ul>
                        {uploadedFiles.map((file, index) => (
                            <li key={index}>{file.name}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    </div>
</div>
  )
}

export default Attachments
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const UploadVideoPage = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState();
  const [file, setFile] = useState();
  const [thumbnailPreview, setThumbnailPreview] = useState();
  const [videoPreview, setVideoPreview] = useState();
  const [videoThumbnail, setVideoThumbnail] = useState("/path/to/default-thumbnail.png");

  const [features, setFeatures] = useState({
    objectDetection: false,
    fallDetection: false,
    faceDetection: false,
    faceRecognition: false,
  });

  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && user === null) {
      navigate("/");
    }
  }, [navigate, user]);
  
  const handleUpload = async (e) => {
    e.preventDefault();
  
    if (!title || !desc || !file) {
      toast.error("Please fill all the fields.");
      return;
    }
    const videoData = new FormData();
    videoData.append("title", title); 
    videoData.append("desc", desc);   
    videoData.append("file", file);   
    videoData.append("image", image);
    
    videoData.append("objectDetection", features.objectDetection);
    videoData.append("fallDetection", features.fallDetection);
    videoData.append("faceDetection", features.faceDetection);
    videoData.append("faceRecognition", features.faceRecognition);
  
    try {
      const response = await axios.post(
        "http://0.0.0.0:5500/api/video/",
        videoData, 
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        }
      );
  
      if (response.status === 200 && response.statusText) {
        toast.info("Video is being processed, will be uploaded shortly.");
        
        const processData = new FormData();
        processData.append("video", file);
        processData.append("image", image);
  
        processData.append("objectDetection", features.objectDetection);
        processData.append("fallDetection", features.fallDetection);
        processData.append("faceDetection", features.faceDetection);
        processData.append("faceRecognition", features.faceRecognition);
  
        const processResponse = await axios.post(
          "http://10.128.0.5:5000/upload-and-process",
          processData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
  
        if (processResponse.status === 200) {
          toast.success("Video processed successfully.");
        } else {
          toast.error("processing the video.");
        }

        setTimeout(() => {
          navigate("/");
        }, 6500);
      } else {
        toast.error("Something went wrong during the video upload.");
      }
    } catch (error) {
      toast.success("processing the video.");
      console.error(error);
    }
  };
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFeatures((prev) => ({ ...prev, [name]: checked }));
  };

  return (
    <>
      <UploadContainer>
        <UploadForm onSubmit={handleUpload}>
          <h3>Upload Video</h3>
          <div>
            <label>Video name:</label>
            <input
              type="text"
              name="title"
              placeholder="File Name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label>Video Description:</label>
            <input
              type="text"
              name="desc"
              placeholder="File Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
          <div>
            <label>Video Thumbnail:</label>
            {/* <input
              type="file"
              name="image"
              accept=".jpg, .jpeg, .png"
              onChange={(e) => {
                setImage(e.target.files[0]);
                setThumbnailPreview(URL.createObjectURL(e.target.files[0]));
              }}
            /> */}
             <input
              type="file"
              name="image"
              accept=".jpg, .jpeg, .png"
              placeholder="Thumbnail"
              onChange={(e) => {
                const file = e.target.files[0];
                console.log(file);  // Log file to ensure it's a PNG
                setImage(file);
                setThumbnailPreview(URL.createObjectURL(file));
              }}
            />
          </div>
          <div>
            <label>Video File:</label>
            <input
              type="file"
              name="file"
              accept=".mp4"
              onChange={(e) => {
                setFile(e.target.files[0]);
                setVideoPreview(URL.createObjectURL(e.target.files[0]));
                setVideoThumbnail("/path/to/your/video-thumbnail.png");
              }}
            />
          </div>
          <div>
            <label>Enable Features:</label>
            <CheckboxContainer>
              <div>
                <input
                  type="checkbox"
                  name="objectDetection"
                  checked={features.objectDetection}
                  onChange={handleCheckboxChange}
                />
                <label>Object Detection</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  name="fallDetection"
                  checked={features.fallDetection}
                  onChange={handleCheckboxChange}
                />
                <label>Fall Detection</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  name="faceDetection"
                  checked={features.faceDetection}
                  onChange={handleCheckboxChange}
                />
                <label>Face Detection</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  name="faceRecognition"
                  checked={features.faceRecognition}
                  onChange={handleCheckboxChange}
                />
                <label>Face Recognition</label>
              </div>
            </CheckboxContainer>
          </div>

          <ButtonContainer>
            <button type="submit">Upload</button>
          </ButtonContainer>
        </UploadForm>

        <UploadedFile>
          <div>
            <p>Your Video Thumbnail:</p>
            <MediaContainer>
              <img
                src={
                  thumbnailPreview
                    ? thumbnailPreview
                    : "https://www.contentviewspro.com/wp-content/uploads/2017/07/default_image.png"
                }
                alt="video_thumbnail"
              />
            </MediaContainer>
          </div>
          <div>
            <p>Your Video:</p>
            <MediaContainer>
              {videoPreview ? (
                <video controls>
                  <source src={videoPreview} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img src={videoThumbnail} alt="video_thumbnail" />
              )}
            </MediaContainer>
          </div>
        </UploadedFile>
      </UploadContainer>
      <ToastContainer />
    </>
  );
};

const UploadContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
  padding: 20px;

  @media (min-width: 768px) {
    flex-direction: row;
    padding: 40px;
  }
`;

const UploadForm = styled.form`
  background-color: hsl(0, 0%, 7%);
  border: 1px solid hsl(0, 0%, 18.82%);
  border-radius: 10px;
  padding: 20px;
  width: 100%;
  max-width: 500px;

  h3 {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 10px;
    text-align: center;
    width: 100%;

    @media (min-width: 768px) {
      font-size: 25px;
    }
  }

  & > div {
    display: flex;
    align-items: flex-start;
    flex-direction: column;

    label {
      font-size: 14px;
      color: #f1f1f1;
      margin-bottom: 5px;
    }
    input {
      height: 40px;
      width: 100%;
      border-radius: 5px;
      padding: 0 4px 0 16px;
      background-color: hsla(0, 0%, 100%, 0.05);
      border: 1px solid hsl(0, 0%, 18.82%);
      font-size: 16px;
      font-weight: 400;
      outline: none;
      color: #fff;
      font-family: inherit;
      margin-bottom: 15px;
    }
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;

  div {
    display: flex;
    align-items: center;

    label {
      margin-left: 10px;
      font-size: 14px;
      color: #f1f1f1;
       white-space:nowrap;
       
    }
       input{width:30px;height:30px;
       }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 15px;

  button {
    height: 40px;
    padding: 0 20px;
    border-radius: 5px;
    background-color: #1e90ff;
    border: none;
    color: #fff;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #007acc;
    }
  }
`;

const UploadedFile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  max-width: 300px;

  @media (min-width: 768px) {
    align-items: flex-start;
  }

  & > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    p {
      margin-bottom: 10px;
      color: #f1f1f1;
    }
  }
`;

const MediaContainer = styled.div`
  width: 100%;
  height: 170px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid hsl(0, 0%, 18.82%);
  border-radius: 10px;
  overflow: hidden;

  img,
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export default UploadVideoPage;

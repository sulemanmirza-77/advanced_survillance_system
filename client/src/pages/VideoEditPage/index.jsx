import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { styled } from "styled-components";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { getVideoById, reset } from "../../redux/video/videoSlice";
import Loader from "../../Components/Loader";

const VideoEditPage = () => {
  const { id } = useParams();
  const { currentVideo, isLoading } = useSelector((state) => state.video);
  const [title, setTitle] = useState(currentVideo?.title);
  const [desc, setDesc] = useState(currentVideo?.desc);
  const [image, setImage] = useState();
  const [file, setFile] = useState();
  const [thumbnailPreview, setThumbnailPreview] = useState(
    currentVideo?.thumbnail_url
  );
  const [videoPreview, setVideoPreview] = useState(currentVideo?.video_url);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && user === null) {
      navigate("/");
    }
    dispatch(getVideoById(id));

    return () => dispatch(reset());
  }, [dispatch, id, navigate, user]);

  const handleEdit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", title);
    data.append("desc", desc);
    if (image) {
      data.append("image", image);
    }
    if (file) {
      data.append("file", file);
    }

    const response = await axios.put(
      `http://localhost:5500/api/video/edit/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      }
    );
    if (response.status === 200 && response.statusText) {
      toast.info("Video is being processed, will be updated shortly.");
      setTimeout(() => {
        navigate("/");
      }, 6500);
    } else if (response.status !== 200) {
      toast.error("Something went wrong.");
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <UploadContainer>
        <UploadForm onSubmit={handleEdit}>
          <h3>Edit Video</h3>
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
              placeholder="File"
              onChange={(e) => {
                setFile(e.target.files[0]);
                setVideoPreview(URL.createObjectURL(e.target.files[0]));
              }}
            />
          </div>
          <button type="submit">Edit</button>
        </UploadForm>
        <UploadedFile>
          <div>
            <p>Your Video Thumbnail:</p>
            <YourVideoThumbnail>
              <img
                src={
                  thumbnailPreview
                    ? thumbnailPreview
                    : "https://www.contentviewspro.com/wp-content/uploads/2017/07/default_image.png"
                }
                alt="video_thumbnail"
              />
            </YourVideoThumbnail>
          </div>
          <div>
            <p>Your Video:</p>
            <YourVideo>
              <iframe src={videoPreview} width={"250px"}></iframe>
            </YourVideo>
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
  align-items: center;
  justify-content: center;
  gap: 30px;
`;

const UploadForm = styled.form`
  background-color: hsl(0, 0%, 7%);
  border: 1px solid hsl(0, 0%, 18.82%);
  border-radius: 10px;
  padding: 20px 40px;

  h3 {
    font-size: 25px;
    font-weight: 500;
    margin-bottom: 10px;
    text-align: center;
    width: 100%;
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

      &::file-selector-button {
        margin-top: 7px;
      }
    }
  }

  button {
    height: 40px;
    width: 100%;
    border-radius: 5px;
    background-color: hsla(0, 0%, 100%, 0.2);
    border: 1px solid hsl(0, 0%, 18.82%);
    color: #fff;
    font-size: 16px;
    font-weight: 500;
    margin-top: 10px;
    cursor: pointer;

    &:hover {
      background-color: hsla(0, 0%, 100%, 0.09);
    }
  }
`;

const UploadedFile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  & > div {
    display: flex;
    align-items: flex-start;
    flex-direction: column;

    p {
      font-size: 14px;
      color: #f1f1f1;
      margin-bottom: 5px;
    }
  }
`;

const YourVideoThumbnail = styled.div`
  width: 300px;
  height: 150px;
`;

const YourVideo = styled.div``;

export default VideoEditPage;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { styled } from "styled-components";
import axios from "axios";

const UpdateProfilePage = () => {
  const { id } = useParams();
  const [file, setFile] = useState();
  const [about, setAbout] = useState("");
  const [profileImagePreview, setProfileImagePreview] = useState(
    "https://i.pinimg.com/736x/83/bc/8b/83bc8b88cf6bc4b4e04d153a418cde62.jpg"
  );

  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user && user === null) {
      navigate("/");
    }
  }, [navigate, user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", file);
    data.append("about", about);

    const response = await axios.put(
      `http://35.223.72.44:5500/api/user/update/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      }
    );

    if (response.status === 200 && response.statusText) {
      toast.info("Profile update is being processed, will be updated shortly.");
      setTimeout(() => {
        navigate(`/channel/${id}`);
      }, 6500);
    } else if (response.status !== 200) {
      toast.error("Something is wrong.");
    }
  };

  return (
    <>
      <UpdateProContainer>
        <UpdateForm onSubmit={handleUpdate}>
          <h3>Update Profile</h3>
          <FormWrapper>
            <label>Profile Image:</label>
            <FileInputWrapper>
              <ProfilePreview>
                <img src={profileImagePreview} alt="profile_image_preview" />
              </ProfilePreview>
              <FileInput
                type="file"
                name="file"
                accept=".jpg, .jpeg, .png"
                placeholder="Profile Image"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                  setProfileImagePreview(
                    URL.createObjectURL(e.target.files[0])
                  );
                }}
              />
            </FileInputWrapper>
          </FormWrapper>
          <div>
            <label>About:</label>
            <textarea
              placeholder="About Yourself"
              name="about"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />
          </div>
          <button type="submit">Update</button>
        </UpdateForm>
      </UpdateProContainer>
      <ToastContainer />
    </>
  );
};

const UpdateProContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #121212;
`;

const UpdateForm = styled.form`
  background-color: #1e1e1e;
  border: 1px solid #333;
  border-radius: 10px;
  padding: 30px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);

  h3 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 20px;
    text-align: center;
    color: #f0f0f0;
  }

  label {
    font-size: 14px;
    color: #b3b3b3;
    margin-bottom: 8px;
    display: block;
  }

  textarea {
    height: 120px;
    width: 100%;
    border-radius: 5px;
    padding: 10px;
    background-color: #2a2a2a;
    border: 1px solid #444;
    font-size: 16px;
    font-weight: 400;
    outline: none;
    color: #fff;
    font-family: inherit;
    margin-top: 8px;
  }

  button {
    height: 45px;
    width: 100%;
    border-radius: 5px;
    background-color: hsla(0, 0%, 100%, 0.2);
    border: 1px solid hsl(0, 0%, 18.82%);
    color: #fff;
    border: none;
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    margin-top: 20px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #e14a0f;
    }
  }
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 20px;
`;

const FileInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const ProfilePreview = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const FileInput = styled.input`
  flex-grow: 1;
  height: 40px;
  border-radius: 5px;
  padding: 0 10px;
  background-color: #2a2a2a;
  border: 1px solid #444;
  font-size: 14px;
  font-weight: 400;
  outline: none;
  color: #fff;
  font-family: inherit;

  &::file-selector-button {
    padding: 8px 16px;
    border-radius: 5px;
    background-color: #444;
    color: #fff;
    border: none;
    cursor: pointer;
    margin-right: 10px;
  }
`;

export default UpdateProfilePage;

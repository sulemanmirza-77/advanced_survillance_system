import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { styled } from "styled-components";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getUserDetail,
  getVideoByUser,
  reset,
} from "../../redux/user/userSlice";
import Tabs from "../../Components/Tabs";
import Loader from "../../Components/Loader";

const ChannelPage = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { userDetail, userVideos, isLoading, isError, message } = useSelector(
    (state) => state.user
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    dispatch(getUserDetail(id));
    dispatch(getVideoByUser(id));

    return () => dispatch(reset());
  }, [dispatch, id, isError, message]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <ChannelContainer>
        <ChannelUserDetail>
          <UserProfile>
            <UserProfileImage>
              <img
                src={userDetail && userDetail?.profile_image}
                alt="user_profile"
              />
            </UserProfileImage>
            <UserProfileInfo>
              <span>{userDetail && userDetail?.name}</span>
              <UserInfo>
                <h4>{userDetail && userDetail?.email}</h4>
                {/* <p>
                  {userDetail && userDetail?.subscribers?.length} subscriber
                </p> */}
                <p style={{marginTop:"10px"}}>{userVideos?.length} video</p>
              </UserInfo>
            </UserProfileInfo>
          </UserProfile>

          <UserActions>
            {user?.user._id === userDetail?._id && (
              <>
                <Link to={`/update_profile/${userDetail && userDetail?._id}`}>
                  <ActionButton>Update Profile</ActionButton>
                </Link>
                <Link to="/upload_video">
                  <ActionButton>Upload Video</ActionButton>
                </Link>
              </>
            )}
          </UserActions>
        </ChannelUserDetail>
        <Tabs />
      </ChannelContainer>
      <ToastContainer />
    </>
  );
};

const ChannelContainer = styled.div`
  width: 100%;
  max-width: 1070px;
  margin: 0 auto;
  padding: 8px 16px;

  @media (max-width: 768px) {
    padding: 8px 12px;
  }

  @media (max-width: 480px) {
    padding: 8px;
  }
`;

const ChannelUserDetail = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  text-align: center;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 100%;
  }
`;

const UserProfileImage = styled.div`
  width: 128px;
  height: 128px;
  overflow: hidden;
  border-radius: 50%;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (max-width: 480px) {
    align-items: center;
  }

  span {
    font-size: 24px;
    color: #f1f1f1;
    font-weight: 400;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;

  h4 {
    font-size: 14px;
    color: #aaaaaa;
    font-weight: 600;
  }

  p {
    font-size: 14px;
    color: #aaaaaa;
    font-weight: 400;
  }
`;

const UserActions = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  @media (max-width: 480px) {
    width: 100%;
    flex-direction: column;
    gap: 10px;
  }
`;

const ActionButton = styled.button`
  height: 36px;
  padding: 0 30px;
  background-color: #282828;
  border: none;
  outline: none;
  border-radius: 40px;
  font-size: 16px;
  color: #f1f1f1;
  font-weight: 400;
  cursor: pointer;

  &:hover {
    background-color: #383838;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 10px 20px;
  }
`;

export default ChannelPage;

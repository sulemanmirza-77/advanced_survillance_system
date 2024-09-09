import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { styled } from "styled-components";
import { BsDot } from "react-icons/bs";
import { format } from "timeago.js";
import { Link } from "react-router-dom";

const Tabs = () => {
  const [active, setActive] = useState(0);

  const { userVideos, userDetail } = useSelector((state) => state.user);

  useEffect(() => {
    setActive(1);
  }, []);

  return (
    <>
      <TabsContainer>
        <TabButton
          onClick={() => setActive(1)}
          className={active === 1 ? "active" : ""}
        >
          Videos
        </TabButton>
        <TabButton
          onClick={() => setActive(2)}
          className={active === 2 ? "active" : ""}
        >
          About
        </TabButton>
      </TabsContainer>
      {active === 1 && (
        <VideosContainer>
          {userVideos &&
            userVideos.map((videos, index) => (
              <VideoCard key={index}>
                <Link to={`/video/${videos?._id}`}>
                  <VideoThumbnail className="channel-thumbnail">
                    <img  src={videos?.thumbnail_url} alt="thumbnail" />
                  </VideoThumbnail>
                </Link>
                <VideoInfo>
                  <h3>{videos?.title}</h3>
                  <p>
                    {videos?.views} views <BsDot size={20} color="#b5b5b5" />{" "}
                    {format(videos?.createdAt, "en_US")}
                  </p>
                </VideoInfo>
              </VideoCard>
            ))}
        </VideosContainer>
      )}
      {active === 2 && (
        <AboutContainer>
          <DescriptionSection>
            <h4>Description</h4>
            <p>{userDetail?.about}</p>
          </DescriptionSection>
          <StatsSection>
            <span>Stats</span>
            <span>{format(userDetail?.createdAt, "en_US")}</span>
          </StatsSection>
        </AboutContainer>
      )}
    </>
  );
};

const TabsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 40px;
  border-bottom: 1px solid #aaaaaa;

  @media (max-width: 768px) {
    margin-top: 20px;
    border-bottom: none;
    flex-direction: column;
    align-items: center;
  }
`;

const TabButton = styled.button`
  width: 150px;
  text-align: center;
  background: transparent;
  border: none;
  padding-bottom: 10px;
  font-size: 16px;
  color: #f1f1f1;
  height: 40px;
  text-transform: uppercase;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &.active {
    color: #ffffff;
    font-weight: 600;
  }

  &:hover {
    color: #ffffff;
  }

  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #f1f1f1;
    transform: scaleX(0);
    transform-origin: bottom right;
    transition: transform 0.3s ease;
  }

  &.active:after,
  &:hover:after {
    transform: scaleX(1);
    transform-origin: bottom left;
  }

  @media (max-width: 768px) {
    width: 100%;
    border-bottom: 1px solid #aaaaaa;
    padding-bottom: 5px;

    &.active {
      border-bottom: none;
    }

    &:after {
      display: none;
    }
  }
`;

const VideosContainer = styled.div`
  width: 100%;
  display: grid;
  margin-top: 8px;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 60px;
  margin-top: 24px;
  padding: 0 20px;

  @media (max-width: 768px) {
    padding: 0 10px;
    grid-template-columns: 1fr;
  }
`;

const VideoCard = styled.div`
  background-color: #222222;
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
  }
`;

const VideoThumbnail = styled.div`
  width: 100%;
  overflow: hidden;
  border-radius: 10px 10px 0 0;

  img {
    width: 100%;
    height: auto;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }
  }
`;

const VideoInfo = styled.div`
  padding: 16px;

  h3 {
    font-size: 16px;
    color: #f1f1f1;
    font-weight: 500;
    margin: 10px 0;
  }

  p {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #aaaaaa;
    font-weight: 500;
  }
`;

const AboutContainer = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 40px;
  padding: 16px;
  background-color: #222222;
  border-radius: 10px;
  padding: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const DescriptionSection = styled.div`
  display: flex;
  flex-direction: column;

  h4 {
    font-size: 18px;
    font-weight: 600;
    color: #f1f1f1;
  }

  p {
    font-size: 14px;
    font-weight: 400;
    color: #aaaaaa;
    margin-top: 10px;
  }
`;

const StatsSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  span {
    font-size: 16px;
    font-weight: 400;
    color: #f1f1f1;
    padding-bottom: 10px;
    border-bottom: 2px solid #aaaaaa;
    width: 100%;
    margin-bottom: 5px;

    &:last-child {
      border-bottom: none;
    }
  }
`;

export default Tabs;

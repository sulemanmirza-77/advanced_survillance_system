

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { styled } from "styled-components";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getSomeVideo,
  getVideoById,
  reset,
} from "../../redux/video/videoSlice";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BiLike, BiDislike, BiSolidLike, BiSolidDislike } from "react-icons/bi";
import axios from "axios";
import { format } from "timeago.js";
import Loader from "../../Components/Loader";

const CurrentVideoPage = () => {
  const { id } = useParams();
  const { currentVideo, someVideos, isLoading, isError, message } = useSelector(
    (state) => state.video
  );

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    dispatch(getVideoById(id));
    dispatch(getSomeVideo());

    return () => dispatch(reset());
  }, [dispatch, id, isError, message]);

  const handleSubscribe = async () => {
    if (!user) {
      navigate("/sign_in");
    } else {
      try {
        const response = await axios.put(
          `http://0.0.0.0:5500/api/user/sub/${currentVideo?.userId?._id}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${user?.access_token}`,
            },
          }
        );

        if (response.status === 200 && response.statusText) {
          window.location.reload();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleUnsubscribe = async () => {
    if (!user) {
      navigate("/sign_in");
    } else {
      try {
        const response = await axios.put(
          `http://0.0.0.0:5500/api/user/unSub/${currentVideo?.userId?._id}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${user?.access_token}`,
            },
          }
        );

        if (response.status === 200 && response.statusText) {
          window.location.reload();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleLike = async () => {
    if (!user) {
      navigate("/sign_in");
    } else {
      try {
        await axios.put(
          `http://0.0.0.0:5500/api/video/like/${currentVideo?._id}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${user?.access_token}`,
            },
          }
        );
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleDislike = async () => {
    if (!user) {
      navigate("/sign_in");
    } else {
      try {
        await axios.put(
          `http://0.0.0.0:5500/api/video/dislike/${currentVideo?._id}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${user?.access_token}`,
            },
          }
        );

        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://0.0.0.0:5500/api/video/delete/${currentVideo?._id}`,
        {
          headers: {
            Authorization: `Bearer ${user?.access_token}`,
          },
        }
      );

      if (response.status === 200 && response.statusText) {
        toast.info("Video will be deleted shortly.");
        setTimeout(() => {
          navigate("/");
        }, 6500);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Container>
      {currentVideo && (
        <CurrentVidContainer>
          <MainVideo>
            <VideoWrapper>
              <VideoPlayer src={currentVideo?.video_url} />
            </VideoWrapper>
            <MainVideoInfo>
              <VideoTitle>{currentVideo?.title}</VideoTitle>
              <VideoDetails>
                <UploaderDetail>
                  <Link to={`/channel/${currentVideo?.userId?._id}`}>
                    <UploaderProfileImage>
                      <img
                        src={currentVideo?.userId?.profile_image}
                        alt="profile_image"
                      />
                    </UploaderProfileImage>
                  </Link>
                  <UploaderInfo>
                    <UploaderName>{currentVideo?.userId?.name}</UploaderName>
                    {/* <SubscribersCount>
                      {currentVideo?.userId?.subscribers?.length} Subscribers
                    </SubscribersCount> */}
                  </UploaderInfo>
                </UploaderDetail>
                {currentVideo?.userId?._id === user?.user?._id ? (
                  <VideoActions>
                    <Link to={`/video_edit/${currentVideo?._id}`}>
                      <EditBtn>Edit</EditBtn>
                    </Link>
                    <DeleteBtn onClick={handleDelete}>Delete</DeleteBtn>
                  </VideoActions>
                ) : (
                  // <SubscribeActions>
                  //   {currentVideo?.userId?.subscribers?.includes(
                  //     user?.user?._id
                  //   ) ? (
                  //     <UnsubscribeBtn onClick={handleUnsubscribe}>
                  //       Subscribed
                  //     </UnsubscribeBtn>
                  //   ) : (
                  //     <SubscribeBtn onClick={handleSubscribe}>
                  //       Subscribe
                  //     </SubscribeBtn>
                  //   )}
                  // </SubscribeActions>
                  ""
                )}
              </VideoDetails>
              {/* <LikeDislikeBtn>
                <button onClick={handleLike}>
                  {currentVideo?.likes?.includes(user?.user?._id) ? (
                    <BiSolidLike size={24} color="#f1f1f1" />
                  ) : (
                    <BiLike size={24} color="#f1f1f1" />
                  )}
                  {currentVideo?.likes?.length}
                </button>
                {" | "}
                <button onClick={handleDislike}>
                  {currentVideo?.dislikes?.includes(user?.user?._id) ? (
                    <BiSolidDislike size={24} color="#f1f1f1" />
                  ) : (
                    <BiDislike size={24} color="#f1f1f1" />
                  )}
                </button>
              </LikeDislikeBtn> */}
              <AboutVideo>
                {/* <VideoStats>
                  {currentVideo?.views} views {format(currentVideo?.createdAt)}
                </VideoStats> */}
                <VideoDescription>{currentVideo?.desc}</VideoDescription>
              </AboutVideo>
            </MainVideoInfo>
          </MainVideo>
          <SimilarVideo>
            {someVideos &&
              someVideos.map((videos, index) => (
                <SimilarVideoCard key={index}>
                  <Link to={`/video/${videos?._id}`}>
                    <SimilarVideoThumbnail>
                      <img src={videos?.thumbnail_url} alt="thumbnail_image" />
                    </SimilarVideoThumbnail>
                  </Link>
                  <SimilarVideoInfo>
                    <SimilarVideoTitle>{videos?.title}</SimilarVideoTitle>
                    {/* <SimilarVideoStats>
                      {videos?.views} views {format(videos?.createdAt)}
                    </SimilarVideoStats> */}
                    {/* <UploaderName>{videos?.userId?.name}</UploaderName> */}
                  </SimilarVideoInfo>
                </SimilarVideoCard>
              ))}
          </SimilarVideo>
        </CurrentVidContainer>
      )}
      <ToastContainer />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: calc(100vh - 74px);
  overflow: auto;
  padding: 0 16px;
  background-color: #181818;

  @media (max-width: 768px) {
    padding: 0 8px;
  }
`;

const CurrentVidContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 70% 30%;
  gap: 16px;
  margin-top: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MainVideo = styled.div`
  width: 100%;
`;

const VideoWrapper = styled.div`
  width: 100%;
`;

const VideoPlayer = styled.iframe`
  width: 100%;
  height: 500px;
  border: none;
  border-radius: 12px;

  @media (max-width: 768px) {
    height: 250px;
  }
`;

const MainVideoInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  margin-top: 16px;
`;

const VideoTitle = styled.h2`
  font-size: 1.8rem;
  color: #f1f1f1;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const VideoDetails = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const UploaderDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const UploaderProfileImage = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UploaderInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UploaderName = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #f1f1f1;
`;

const SubscribersCount = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: #aaaaaa;
`;

const VideoActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    justify-content: space-between;
    width: 100%;
  }
`;

const SubscribeActions = styled(VideoActions)``;

const EditBtn = styled.button`
  height: 36px;
  padding: 0 20px;
  border-radius: 20px;
  border: none;
  outline: none;
  font-size: 14px;
  font-weight: 600;
  color: #f1f1f1;
  background-color: blue;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const DeleteBtn = styled.button`
  height: 36px;
  padding: 0 20px;
  border-radius: 20px;
  border: none;
  outline: none;
  font-size: 14px;
  font-weight: 600;
  color: #f1f1f1;
  background-color: red;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const SubscribeBtn = styled.button`
  height: 36px;
  padding: 0 20px;
  border-radius: 20px;
  border: none;
  outline: none;
  font-size: 14px;
  font-weight: 600;
  color: #181818;
  background-color: #f1f1f1;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const UnsubscribeBtn = styled(SubscribeBtn)`
  background-color: #383838;
  color: #f1f1f1;
`;

const LikeDislikeBtn = styled.div`
  height: 36px;
  display: flex;
  align-items: center;
  gap: 16px;
  background-color: #383838;
  padding: 0 20px;
  border-radius: 20px;
  margin-top: 16px;

  button {
    background: transparent;
    border: none;
    outline: none;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #f1f1f1;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }
`;

const AboutVideo = styled.div`
  width: 100%;
  margin-top: 20px;
  background-color: #383838;
  border-radius: 12px;
  padding: 16px;
`;

const VideoStats = styled.span`
  font-size: 14px;
  color: #aaaaaa;
  font-weight: 600;
`;

const VideoDescription = styled.p`
  font-size: 16px;
  font-weight: 400;
  color: #f1f1f1;
  margin-top: 8px;
`;

const SimilarVideo = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-left: 16px;

  @media (max-width: 768px) {
    padding-left: 0;
  }
`;

const SimilarVideoCard = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 16px;
  padding: 8px;
  background-color: #222;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  margin-bottom:-3px; 
  &:hover {
    transform: scale(1.02);
  }
`;

const SimilarVideoThumbnail = styled.div`
  width: 160px;
  height: 90px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.2s;
  }

  &:hover img {
    transform: scale(1.05);
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%);
    border-radius: 8px;
  }
`;

const SimilarVideoInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const SimilarVideoTitle = styled.h3`
  font-size: 16px;
  color: #f1f1f1;
  font-weight: bold;
  margin: 0;
  line-height: 1.2;
`;

const SimilarVideoStats = styled.p`
  font-size: 12px;
  color: #aaaaaa;
  font-weight: 400;
  margin: 4px 0;
  display: flex;
  align-items: center;

  & > span {
    margin-left: 4px;
    margin-right: 8px;
    display: flex;
    align-items: center;
  }

  & > span::before {
    content: '•';
    margin-right: 4px;
  }
`;



export default CurrentVideoPage;


// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { styled } from "styled-components";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import {
//   getSomeVideo,
//   getVideoById,
//   reset,
// } from "../../redux/video/videoSlice";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { BiLike, BiDislike, BiSolidLike, BiSolidDislike } from "react-icons/bi";
// import axios from "axios";
// import { format } from "timeago.js";
// import Loader from "../../Components/Loader";

// const CurrentVideoPage = () => {
//   const { id } = useParams();
//   const { currentVideo, someVideos, isLoading, isError, message } = useSelector(
//     (state) => state.video
//   );

//   const { user } = useSelector((state) => state.auth);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (isError) {
//       toast.error(message);
//     }

//     dispatch(getVideoById(id));
//     dispatch(getSomeVideo());

//     return () => dispatch(reset());
//   }, [dispatch, id, isError, message]);

//   const handleSubscribe = async () => {
//     if (!user && user === null) {
//       navigate("/sign_in");
//     } else {
//       try {
//         const response = await axios.put(
//           `http://0.0.0.0:5500/api/user/sub/${currentVideo?.userId?._id}`,
//           null,
//           {
//             headers: {
//               Authorization: `Bearer ${user?.access_token}`,
//             },
//           }
//         );

//         if (response.status === 200 && response.statusText) {
//           window.location.reload();
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     }
//   };

//   const handleUnsubscribe = async () => {
//     if (!user && user === null) {
//       navigate("/sign_in");
//     } else {
//       try {
//         const response = await axios.put(
//           `http://0.0.0.0:5500/api/user/unSub/${currentVideo?.userId?._id}`,
//           null,
//           {
//             headers: {
//               Authorization: `Bearer ${user?.access_token}`,
//             },
//           }
//         );

//         if (response.status === 200 && response.statusText) {
//           window.location.reload();
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     }
//   };

//   const handleLike = async () => {
//     if (!user && user === null) {
//       navigate("/sign_in");
//     } else {
//       try {
//         await axios.put(
//           `http://0.0.0.0:5500/api/video/like/${currentVideo?._id}`,
//           null,
//           {
//             headers: {
//               Authorization: `Bearer ${user?.access_token}`,
//             },
//           }
//         );
//         window.location.reload();
//       } catch (error) {
//         console.log(error);
//       }
//     }
//   };

//   const handleDislike = async () => {
//     if (!user && user === null) {
//       navigate("/sign_in");
//     } else {
//       try {
//         await axios.put(
//           `http://0.0.0.0:5500/api/video/dislike/${currentVideo?._id}`,
//           null,
//           {
//             headers: {
//               Authorization: `Bearer ${user?.access_token}`,
//             },
//           }
//         );

//         window.location.reload();
//       } catch (error) {
//         console.log(error);
//       }
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       const response = await axios.delete(
//         `http://0.0.0.0:5500/api/video/delete/${currentVideo?._id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${user?.access_token}`,
//           },
//         }
//       );

//       if (response.status === 200 && response.statusText) {
//         toast.info("Video will be delete shortly.");
//         setTimeout(() => {
//           navigate("/");
//         }, 6500);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   if (isLoading) {
//     return <Loader />;
//   }

//   return (
//     <div
//       style={{
//         width: "100%",
//         height: "calc(100vh - 74px)",
//         overflow: "auto",
//       }}
//     >
//       {currentVideo && (
//         <CurrentVidContainer>
//           <MainVideo>
//             <div>
//               <VideoPlayer src={currentVideo?.video_url} />
//             </div>
//             <MainVideoInfo>
//               <h2>{currentVideo?.title}</h2>
//               <div
//                 style={{
//                   display: "flex",
//                   flexDirection: "row",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   width: "100%",
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "flex",
//                     flexDirection: "row",
//                     alignItems: "center",
//                     gap: "20px",
//                   }}
//                 >
//                   <UploaderDetail>
//                     <Link
//                       to={`/channel/${currentVideo?.userId?._id}`}
//                       style={{
//                         textDecoration: "none",
//                       }}
//                     >
//                       <UploaderProfileImage>
//                         <img
//                           src={currentVideo?.userId?.profile_image}
//                           alt="profile_image"
//                         />
//                       </UploaderProfileImage>
//                     </Link>
//                     <div>
//                       <span>{currentVideo?.userId?.name}</span>
//                       <p>
//                         {currentVideo?.userId?.subscribers?.length} Subscribers
//                       </p>
//                     </div>
//                   </UploaderDetail>
//                   {currentVideo?.userId?._id === user?.user?._id ? (
//                     <div
//                       style={{
//                         display: "flex",
//                         flexDirection: "row",
//                         alignItems: "center",
//                         gap: "10px",
//                       }}
//                     >
//                       <Link
//                         to={`/video_edit/${currentVideo?._id}`}
//                         style={{
//                           textDecoration: "none",
//                         }}
//                       >
//                         <EditBtn>Edit</EditBtn>
//                       </Link>
//                       <DeleteBtn onClick={handleDelete}>Delete</DeleteBtn>
//                     </div>
//                   ) : (
//                     <div>
//                       {currentVideo?.userId?.subscribers?.includes(
//                         user?.user?._id
//                       ) ? (
//                         <UnsubscribeBtn onClick={handleUnsubscribe}>
//                           Subscribed
//                         </UnsubscribeBtn>
//                       ) : (
//                         <SubscribeBtn onClick={handleSubscribe}>
//                           Subscribe
//                         </SubscribeBtn>
//                       )}
//                     </div>
//                   )}
//                 </div>
//                 <LikeDislikeBtn>
//                   <button onClick={handleLike}>
//                     {currentVideo?.likes?.includes(user?.user?._id) ? (
//                       <BiSolidLike size={24} color="#f1f1f1" />
//                     ) : (
//                       <BiLike size={24} color="#f1f1f1" />
//                     )}
//                     {currentVideo?.likes?.length}
//                   </button>
//                   {"|"}
//                   <button onClick={handleDislike}>
//                     {currentVideo?.dislikes?.includes(user?.user?._id) ? (
//                       <BiSolidDislike size={24} color="#f1f1f1" />
//                     ) : (
//                       <BiDislike size={24} color="#f1f1f1" />
//                     )}
//                   </button>
//                 </LikeDislikeBtn>
//               </div>
//             </MainVideoInfo>
//             <AboutVideo>
//               <span>{`${currentVideo?.views} views ${format(
//                 currentVideo?.createdAt,
//                 "en_US"
//               )}`}</span>
//               <p>{currentVideo?.desc}</p>
//             </AboutVideo>
//           </MainVideo>
//           <SimilarVideo>
//             {someVideos &&
//               someVideos?.map((videos, index) => (
//                 <div key={index}>
//                   <Link
//                     to={`/video/${videos?._id}`}
//                     style={{
//                       textDecoration: "none",
//                     }}
//                   >
//                     <SimilarVideoThumbnail className="similar-thumbnail">
//                       <img src={videos?.thumbnail_url} alt="thumbnail_image" />
//                     </SimilarVideoThumbnail>
//                   </Link>
//                   <SimilarVideoInfo>
//                     <h3>{videos?.title}</h3>
//                     <p>{`${videos?.views} views ${format(
//                       videos?.createdAt,
//                       "en_US"
//                     )}`}</p>
//                     <span>{videos?.userId?.name}</span>

//                   </SimilarVideoInfo>
//                 </div>
//               ))}
//           </SimilarVideo>
//         </CurrentVidContainer>
//       )}
//       <ToastContainer />
//     </div>
//   );
// };

// const CurrentVidContainer = styled.div`
//   width: 100%;
//   display: grid;
//   grid-template-columns: 70% 30%;
//   margin-top: 8px;
// `;

// const MainVideo = styled.div``;

// const SimilarVideo = styled.div`
//   width: 100%;
//   display: flex;
//   align-items: flex-start;
//   flex-direction: column;
//   padding-left: 20px;

//   & > div {
//     display: flex;
//     flex-direction: row;
//     align-items: center;
//     gap: 10px;
//     margin-bottom: 10px;
//   }
// `;

// const VideoPlayer = styled.iframe`
//   width: 100%;
//   height: 500px;
//   border: none;
//   border-radius: 20px;
// `;

// const MainVideoInfo = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: flex-start;
//   gap: 10px;
//   margin-top: 10px;

//   h2 {
//     font-size: 1.8rem;
//     color: #f1f1f1;
//     font-weight: 500;
//   }
// `;

// const UploaderDetail = styled.div`
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   gap: 10px;

//   span {
//     font-size: 16px;
//     font-weight: 500;
//     color: #f1f1f1;
//   }

//   p {
//     font-size: 14px;
//     font-weight: 400;
//     color: #aaaaaa;
//   }
// `;

// const UploaderProfileImage = styled.div`
//   width: 40px;
//   height: 40px;
//   border-radius: 50%;
//   overflow: hidden;
// `;

// const SubscribeBtn = styled.button`
//   height: 36px;
//   padding: 0 20px;
//   border-radius: 40px;
//   border: none;
//   outline: none;
//   font-size: 14px;
//   font-weight: 600;
//   color: #181818;
//   background-color: #f1f1f1;
//   cursor: pointer;

//   &:hover {
//     opacity: 0.8;
//   }
// `;

// const LikeDislikeBtn = styled.div`
//   height: 36px;
//   display: flex;
//   align-items: center;
//   flex-direction: row;
//   justify-content: center;
//   background-color: #383838;
//   padding: 0 20px;
//   border-radius: 40px;
//   gap: 10px;

//   button {
//     background: transparent;
//     border: none;
//     outline: none;
//     display: flex;
//     align-items: center;
//     flex-direction: row;
//     gap: 5px;
//     color: #f1f1f1;
//     font-size: 16px;
//     font-weight: 500;
//   }
// `;

// const EditBtn = styled.button`
//   height: 36px;
//   padding: 0 20px;
//   border-radius: 40px;
//   border: none;
//   outline: none;
//   font-size: 14px;
//   font-weight: 600;
//   color: #f1f1f1;
//   background-color: blue;
// `;

// const DeleteBtn = styled.button`
//   height: 36px;
//   padding: 0 20px;
//   border-radius: 40px;
//   border: none;
//   outline: none;
//   font-size: 14px;
//   font-weight: 600;
//   color: #f1f1f1;
//   background-color: red;
// `;

// const UnsubscribeBtn = styled.button`
//   height: 36px;
//   padding: 0 20px;
//   border-radius: 40px;
//   border: none;
//   outline: none;
//   font-size: 14px;
//   font-weight: 600;
//   color: #f1f1f1;
//   background-color: #383838;
//   cursor: pointer;

//   &:hover {
//     opacity: 0.8;
//   }
// `;

// const AboutVideo = styled.div`
//   width: 100%;
//   margin-top: 20px;
//   background-color: #383838;
//   border-radius: 10px;
//   padding: 10px;

//   span {
//     font-size: 14px;
//     color: #aaaaaa;
//     font-weight: 600;
//   }
//   p {
//     font-size: 16px;
//     font-weight: 400;
//     color: #f1f1f1;
//   }
// `;

// const SimilarVideoThumbnail = styled.div`
//   width: 100%;
//   height: 100px;
//   display: flex;
//   flex: 1;
//   border-radius: 10px;
//   overflow: hidden;
// `;

// const SimilarVideoInfo = styled.div`
//   display: flex;
//   flex: 1;
//   flex-direction: column;
//   align-items: flex-start;

//   h3 {
//     font-size: 16px;
//     color: #f1f1f1;
//     font-weight: 600;
//   }

//   span {
//     font-size: 14px;
//     color: #aaaaaa;
//     font-weight: 500;
//   }

//   p {
//     font-size: 14px;
//     color: #aaaaaa;
//     font-weight: 400;
//   }
// `;

// export default CurrentVideoPage;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { styled } from "styled-components";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getSearchVideos, reset } from "../../redux/video/videoSlice";
import VideoCard from "../../Components/VideoCard";
import Loader from "../../Components/Loader";

const SearchPage = () => {
  const { query } = useParams();
  const { searchedVideos, isError, isLoading, message } = useSelector(
    (state) => state.video
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    dispatch(getSearchVideos(query));
    console.log(query);

    return () => dispatch(reset());
  }, [dispatch, isError, message, query]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <SearchContainer>
        {searchedVideos?.map((videos, index) => (
          <VideoCard videos={videos} index={index} />
        ))}
      </SearchContainer>
      <ToastContainer />
    </>
  );
};

const SearchContainer = styled.div`
  width: 100%;
  display: grid;
  margin-top: 8px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
`;

export default SearchPage;

import React from "react";
import { useSelector } from "react-redux";
import { styled } from "styled-components";
import { GoHomeFill } from "react-icons/go";
import { MdOutlineSubscriptions, } from "react-icons/md";
import { Link } from "react-router-dom";

const SideBar = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <SideBarContainer>
      <SideBarContent>
        <UpperPart>
          <div className="side-menu">
          <Link to="/">
            <GoHomeFill size={24} color="#fff" />
            <span>Dashboard</span>
          </Link>
          <Link to={`/channel/${user?.user?._id}`}>
            <MdOutlineSubscriptions size={24} color="#fff" />
            <span>Channel</span>
          </Link>
          </div>
        </UpperPart>
      </SideBarContent>
    </SideBarContainer>
  );
};

const SideBarContainer = styled.div`
width: 100%;
height: 100%;
overflow: auto;
`;

const SideBarContent = styled.div`
width: 100%;
display: flex;
flex-direction: column;
align-items: flex-start;

button{
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0 12px;
    height: 40px;
    border-radius: 10px;
    background: transparent;
    border: none;
    outline: none;
    margin-bottom: 10px;
    cursor: pointer;

    span{
        color: #f1f1f1;
        font-size: 14px;
        margin-left: 13px;
        font-weight: 500;
    }

    &:hover{
        background-color: #282828;
    }
}
`;

const UpperPart = styled.div`
width: 100%;
display: flex;
flex-direction: column;
align-items: flex-start;
border-bottom: 1px solid #505050;
margin-bottom: 10px;
`;

const CenterPart = styled.div`
width: 100%;
display: flex;
flex-direction: column;
align-items: flex-start;
border-bottom: 1px solid #505050;
margin-bottom: 10px;
`;

const LowerPart = styled.div`
width: 100%;
display: flex;
flex-direction: column;
align-items: flex-start;

h3{
    font-size: 16px;
    font-weight: 400;
    margin: 6px 4px 1px;
}
`;

export default SideBar;

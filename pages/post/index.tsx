import { MainHeader } from 'components/Header';
import { NextPage } from 'next';
import React from 'react';
import FooterButton from './FooterButton';
import PostInfo from './PostInfo';

const postMain: NextPage = () => {
  return (
    <>
      <MainHeader />
      <PostInfo />
      {/* <FooterButton /> */}
    </>
  );
};

export default postMain;

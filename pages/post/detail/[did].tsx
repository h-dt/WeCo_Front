import React, { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/router';

import { IoArrowBack as Back } from 'react-icons/io5';
import { IoCloseCircleSharp as Remove } from 'react-icons/io5';

import { MainHeader } from 'components/Header';
import { ajaxDelete, ajaxGet, ajaxPost } from 'services/BaseService';
import { useQuery } from 'react-query';

interface commentType {
  content: string;
  nickname: string;
  profileImage: string;
  regDate: string;
  boardId: number;
  commentId: number;
}

interface recommendType {
  board_id: number;
  title: string;
}

const PostDetail = () => {
  const router = useRouter();
  const [comment, setComment] = useState('');
  const [resetValue, setResetValue] = useState(false);
  const getComment = async () => {
    const result = await ajaxGet(`/comment/${router.query.did}`);
    return result.data;
  };
  const getRecommend = async () => {
    const result = await ajaxGet('/board/recommend');
    return result.data;
  };
  const getBoard = async () => {
    const result = await ajaxGet(`/board/${router.query.did}`);
    return result;
  };
  const getUser = async () => {
    const result = await ajaxGet('/member');
    return result;
  };
  const { data: userData } = useQuery('userdata', getUser);
  const { isLoading: commentLoading, data: commentData } = useQuery(
    'commentdata',
    getComment
  );
  const { isLoading: recommendLoading, data: recommendData } = useQuery(
    'recommenddata',
    getRecommend
  );
  const { isLoading: boardLoading, data: boardData } = useQuery(
    'boarddata',
    getBoard
  );
  if (commentLoading && recommendLoading && boardLoading) {
    return <h1>로딩중입니다</h1>;
  }
  const handleBack = () => {
    router.back();
  };
  const handleDelete = () => {
    const result = async () => {
      await ajaxDelete(`/board/${router.query.did}`, { id: router.query.did });
    };
    result();
  };
  const handleDeleteComment = (id: number) => {
    const result = async () => {
      await ajaxDelete(`comment/${id}`);
    };
    if (window.confirm('삭제하시겠습니까?') === true) {
      result();
    }
    return;
  };
  const onComment = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };
  const onCommentSubmit = () => {
    const postComment = async () => {
      const response = await ajaxPost('/comment', {
        board_id: boardData?.data.id,
        content: comment,
      });
      console.log(response);
      return response;
    };
    setResetValue(true);
    postComment();
  };
  return (
    <>
      <MainHeader />

      <div className="relative max-w-4xl mx-auto px-4 pt-4 pb-12">
        {/* back */}
        <div className="mt-12 flex justify-between">
          <Back size="36" onClick={handleBack} className="text-gray-500" />
          <Remove size="36" onClick={handleDelete} className="text-gray-500" />
        </div>
        {/* title */}
        <div className="text-5xl sm:text-3xl xs:text-2xl font-bold mt-12">
          {boardData?.data.title}
        </div>
        {/* profile */}
        <div className="flex items-center py-8 text-lg gap-4 border-b-2">
          <div className="font-bold pr-4 border-r-2">
            {boardData?.data.writer}
          </div>
          <div className="text-gray-500">{boardData?.data.reg_date}</div>
        </div>
        {/* info */}
        <div className="grid grid-cols-2 sm:grid-cols-1 sm:grid-flow-row gap-6 sm:gap-4 py-12">
          <div className="text-xl sm:text-base font-bold">
            <span className="text-gray-500 pr-4">모집 구분</span>
            <span>{boardData?.data.recruit_type}</span>
          </div>
          <div className="text-xl sm:text-base font-bold">
            <span className="text-gray-500 pr-4">진행 방식</span>
            <span>{boardData?.data.progress_type}</span>
          </div>
          <div className="text-xl sm:text-base font-bold">
            <span className="text-gray-500 pr-4">모집 인원</span>
            <span>{boardData?.data.recruit_cnt}</span>
          </div>
          <div className="text-xl sm:text-base font-bold">
            <span className="text-gray-500 pr-4">시작 예정</span>
            <span>{boardData?.data.start_date}</span>
          </div>
          <div className="text-xl sm:text-base font-bold">
            <span className="text-gray-500 pr-4">연락 방법</span>
            <span>{boardData?.data.contact_type}</span>
          </div>
          <div className="text-xl sm:text-base font-bold">
            <span className="text-gray-500 pr-4">예상 기간</span>
            <span>{boardData?.data.duration}</span>
          </div>
          <div className="text-xl sm:text-base font-bold flex items-center">
            <span className="text-gray-500 pr-4">사용 언어</span>
            <span className="flex gap-1">{boardData?.data.skills}</span>
          </div>
        </div>
        {/* project introduce */}
        <div className="mt-12">
          <div className="pb-8 text-2xl font-bold border-b-2">
            프로젝트 소개
          </div>
          <div className="py-8">{boardData?.data.content}</div>
        </div>
        {/* comment write */}
        <div className="mt-12">
          <div className="font-bold text-xl pb-6">{`${commentData?.length}개의 댓글이 있습니다.`}</div>
          <textarea
            placeholder="댓글을 입력하세요."
            className="w-full border-2 rounded-2xl p-4 mb-2"
            onChange={onComment}
            value={resetValue ? '' : undefined}
          />
          <div className="w-full flex justify-end">
            <button
              className="bg-gray-900 text-white rounded-full py-2 px-8"
              onClick={onCommentSubmit}
            >
              댓글 등록
            </button>
          </div>
        </div>
        {/* comment list */}

        <div className="mt-4">
          {commentData &&
            commentData?.map((x: commentType) => (
              <div className="pb-4" key={Math.random()}>
                <div className="flex items-center justify-between">
                  <div className="flex">
                    <div className="bg-red-300 rounded-full p-1 mr-4">
                      <img src={x.profileImage} width="36" height="24" />
                    </div>
                    <div>
                      <div className="font-bold">{x.nickname}</div>
                      <div className="text-sm text-gray-500">{x.regDate}</div>
                    </div>
                  </div>
                  {x.nickname === userData?.data.nickname ? (
                    <div>
                      <div className="flex">
                        <div className="ml-2 cursor-pointer">수정</div>
                        <div
                          className="ml-2 cursor-pointer"
                          onClick={() => handleDeleteComment(x.commentId)}
                        >
                          삭제
                        </div>
                      </div>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
                <div className="text-lg py-4 border-b">{x.content}</div>
              </div>
            ))}
        </div>
        {/* recomment post */}
        <div className="absolute left-full top-96 2xl:hidden">
          <div className="flex items-center mb-4">
            <div className="w-0 h-10 border-2 border-blue-500 bg-blue-500 mr-2" />
            <div className="whitespace-pre-wrap">
              <span className="font-bold">{userData?.data.nickname}</span>
              {`님이\n좋아하실 글을 모아봤어요!`}
            </div>
          </div>
          <div className="w-60 border-2 rounded-lg px-2 py-4 text-sm">
            {recommendData &&
              recommendData?.map((x: recommendType) => (
                <div key={x.board_id} className="mb-2">
                  <span className="text-blue-300">
                    {`${recommendData.indexOf(x) + 1}. `}
                  </span>
                  {x.title.length > 15 ? `${x.title.slice(0, 15)}...` : x.title}
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(PostDetail);

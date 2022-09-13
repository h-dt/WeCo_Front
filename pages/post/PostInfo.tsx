import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React, { useEffect, useState, useRef, useId } from 'react';
import { postInfoData } from '../../data/postInfo.js';

import dayjs from 'dayjs';
import { addZero } from '../../utils/common';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import SelectForm from '../../components/select/SelectForm';
import DatePickerForm from '../../components/picker/DatePickerForm';
import PostHeader from 'components/Header/PostHeader';
import PostButton from 'components/Button/PostButton';
import { ajaxPost } from 'services/BaseService';
import Router from 'next/router.js';

const Editor = dynamic(() => import('../../components/editor/Editor'), {
  ssr: false,
});

interface Option {
  value: string;
  label: string;
  type: string;
  disabled?: boolean;
}
interface PostInfo {
  id: number;
  title: string | undefined;
  place_holder: string;
  isMulti: boolean;
  options: Array<Option[]>;
}

interface RequestDataType {
  [key: string]: string | Array<string>;
  title: string;
  content: string;
  recruit_type: string;
  recruit_cnt: string;
  progress_type: string;
  duration: string;
  contact_type: string;
  contact: string;
  start_date: string;
  skills: Array<string>;
}

const PostInfo: NextPage = () => {
  const [postData, setPostData] = useState(postInfoData);
  const [requestData, setRequestData] = useState<RequestDataType>({
    title: '',
    content: '',
    recruit_type: '',
    recruit_cnt: '',
    progress_type: '',
    duration: '',
    contact_type: '카카오톡 오픈채팅',
    contact: '',
    start_date: dayjs().format('YYYY-MM-DD'),
    skills: [],
  });

  useEffect(() => {
    // TODO: style접근 방법 찾기 현재 react18에선 select라이브러리 호환 안맞음
    selectComponentStyle();
    window.addEventListener('resize', selectComponentStyle);
    return () => {
      window.removeEventListener('resize', selectComponentStyle);
    };
  }, []);

  useEffect(() => {
    let updatePostData;
    if (requestData.skills.length > 4) {
      updatePostData = skillIsDisabledUpdate(true);
    } else {
      updatePostData = skillIsDisabledUpdate(false);
    }
    setPostData(updatePostData);
  }, [requestData.skills]);

  const selectHandler = (data: any) => {
    const [value, type] = searchSkillValue(data);
    setRequestData({ ...requestData, [type]: value });
  };

  const titleOnChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setRequestData({ ...requestData, title: title });
  };

  const contentOnChangeHandler = (value: string) => {
    setRequestData({ ...requestData, content: value });
  };

  // TODO : 시작예정일 예외처리
  const dateValueOnChangeHandler = (value: any) => {
    const year = value?.year() as string;
    const month = addZero(value?.month()) as string;
    const date = addZero(value?.date()) as string;
    setRequestData({ ...requestData, start_date: `${year}-${month}-${date}` });
  };

  const selectComponentStyle = () => {
    setTimeout(() => {
      const styleSet = (
        document.getElementsByClassName(
          'MuiFormControl-root'
        ) as HTMLCollectionOf<HTMLElement>
      )[0];
      if (styleSet) {
        styleSet.style.width = '100%';
      }
    }, 100);
  };

  const skillIsDisabledUpdate = (isDisabled: boolean) => {
    const copyPostData = [...postData];
    copyPostData.forEach((items) => {
      items.forEach((item) => {
        item.options.forEach((list: Option) => {
          if (list.type === 'skills') {
            list.disabled = isDisabled;
          }
        });
      });
    });
    return copyPostData;
  };

  const searchSkillValue = (data: any) => {
    let value;
    let type;

    if (Array.isArray(data)) {
      if (data.length > 0) {
        const skillValue = data.map((skill) => {
          return skill.value;
        });
        value = skillValue;
        type = data[0].type;
      } else {
        value = [];
        type = 'skills';
      }
    } else {
      value = data.value;
      type = data.type;
    }
    return [value, type];
  };

  const onSubmitHandler = () => {
    const errorKey = searchKey();
    const postBoard = async () => {
      const response = await ajaxPost('/board', requestData);
      console.log(response);
      return response;
    };
    postBoard();
    if (errorKey) {
      showErrorToast(errorKey);
    } else {
      Router.push('/');
      console.log('성공');
      // api
    }
  };

  const searchKey = (): string => {
    let resultKey = '';
    const keyArray: Array<string> = Object.keys(requestData);

    keyArray.some((key) => {
      if (key === 'start_date') {
        const isNan = startDateIsNanIsUndefinedCheck(requestData[key]);
        if (isNan) {
          resultKey = 'error_start_date';
          return true;
        }
      }
      if (requestData[key].length < 1) {
        resultKey = key;
        return true;
      }
    });
    return resultKey;
  };

  const showErrorToast = (key: string) => {
    let message = '';
    switch (key) {
      case 'title':
        message = '제목을 입력해주세요!';
        break;
      case 'content':
        message = '내용을 입력해주세요!';
        break;
      case 'recruit_type':
        message = '모집 구분을 선택해주세요!';
        break;
      case 'recruit_cnt':
        message = '모집 인원을 선택해주세요!';
        break;
      case 'progress_type':
        message = '진행 방식을 선택해주세요!';
        break;
      case 'duration':
        message = '진행 기간을 선택해주세요!';
        break;
      case 'skills':
        message = '기술 스택을 선택해주세요!';
        break;
      case 'start_date':
        message = '시작일을 입력해주세요!';
        break;
      case 'error_start_date':
        message = '시작일을 알맞은 형태에 맞게 작성해주세요!';
        break;
      case 'contact':
        message = '연락 주소를 입력해주세요!';
        break;
      default:
    }
    toast.error(message);
  };

  const startDateIsNanIsUndefinedCheck = (startDate: string): boolean => {
    if (NaNOrUndefinedIncludesString(startDate)) {
      return true;
    }
    return false;
  };

  const NaNOrUndefinedIncludesString = (data: string) => {
    const isCheck = data.includes('NaN') || data.includes('undefined');
    return isCheck;
  };
  // TODO: section 별로 컴포넌트 화
  return (
    <>
      <div className="custom_md:w-[100%] flex flex-col w-[1024px] w-max-[1040px] mx-auto my-0 gap-[3.0rem] py-[60px] px-[16px]">
        <section>
          <PostHeader num={'1'} title={'프로젝트 기본 정보를 입력해 주세요.'} />
          {postData.map((items, idx) => (
            <ul
              key={idx}
              className={`${
                idx === 4
                  ? 'flex gap-4 sm:flex-col sm:-mt-[25px]'
                  : 'flex gap-4 sm:flex-col mt-10 sm:mt-5'
              }`}
            >
              {items.map((item) =>
                item.uiType === 'default' ? (
                  <>
                    <li className="grow shrink basis-[0%]" key={item.id}>
                      <label className="inline-block font-medium mb-[5px]">
                        {item.title}
                      </label>
                      <SelectForm
                        useId={() => useId()}
                        options={item.options}
                        isMulti={item.isMulti}
                        placeHolder={item.place_holder}
                        onChange={(e) => selectHandler(e)}
                      />
                    </li>
                  </>
                ) : item.uiType === 'calendar' ? (
                  <li className="grow shrink basis-[0%]" key={item.id}>
                    <div className="flex">
                      <div className="gap-3 w-[100%]">
                        <div className="inline-block font-medium mb-[5px]">
                          {item.title}
                        </div>
                        <DatePickerForm
                          onChange={(newValue) =>
                            dateValueOnChangeHandler(newValue)
                          }
                          date={requestData.start_date}
                        />
                      </div>
                    </div>
                  </li>
                ) : item.uiType === 'custom' ? (
                  <li className="grow shrink basis-[0%]" key={item.id}>
                    <div className="mt-[12px]">
                      <input
                        className="w-[100%] h-[56px] min-h-[56px] leading-10 pl-[16px] pr-[52px] py-[10px] border-2 border-solid border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        type="text"
                        value={requestData.contact}
                        onChange={(e) =>
                          setRequestData({
                            ...requestData,
                            contact: e.target.value,
                          })
                        }
                        placeholder="오픈 카톡방 링크"
                      />
                    </div>
                  </li>
                ) : (
                  <li className="grow shrink basis-[0%]" key={item.id}>
                    <div>
                      <input
                        className="w-[100%] h-[56px] min-h-[56px] leading-10 pl-[16px] pr-[52px] py-[10px] border-2 border-solid border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        type="hidden"
                      />
                    </div>
                  </li>
                )
              )}
            </ul>
          ))}
        </section>
        <section>
          <PostHeader num={'2'} title={'프로젝트에 대해 소개해주세요.'} />
          <section>
            <label className="inline-block mb-[5px] font-bold" htmlFor="input">
              제목
            </label>
            <input
              className="w-[100%] h-[56px] min-h-[56px] leading-10 pl-[16px] pr-[52px] py-[10px] border-2 border-solid border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              id="input"
              placeholder="글 제목을 입력해주세요!"
              value={requestData.title}
              onChange={(e) => titleOnChangeHandler(e)}
            />
            <div className="mt-[16px]">
              <Editor
                value={requestData.content}
                onChange={(e) => contentOnChangeHandler(e)}
              />
            </div>
          </section>
        </section>
        <section className="flex justify-end items-center mt-[1rem]">
          <PostButton
            type="submit"
            buttonName="취소"
            backgroundColor="bg-slate-200"
          />
          <PostButton
            type="button"
            buttonName="글 등록"
            backgroundColor="bg-black"
            textColor="text-white"
            onClick={() => onSubmitHandler()}
          />
        </section>
      </div>
      <ToastContainer theme="colored" position="top-right" autoClose={2000} />
    </>
  );
};

export default PostInfo;

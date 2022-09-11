import { useState } from 'react';
import StarRatings from 'react-star-ratings';
import { ajaxPost } from 'services/BaseService';
export function Rating({ setModalOpen }: any) {
  const [feedback, setFeedback] = useState<string>('');
  const [star, setStar] = useState<number>(0);
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFeedback(value);
  };
  const onSubmit = () => {
    const postEval = async () => {
      const response = await ajaxPost('/mail', {
        evaluate_text: feedback,
        rating: star,
      });
      return response;
    };
    postEval();
    setModalOpen(false);
  };

  const changeRating = (num: number) => {
    setStar(num);
  };
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col justify-center items-center my-1"
    >
      <StarRatings rating={star} changeRating={changeRating} />
      <input
        onChange={onChange}
        type="text"
        placeholder="피드백을 남겨주세요"
        className="w-80 h-10 outline-none text-base py-0 px-6 border-solid mr-2 border-slate-500 border-2 rounded-lg my-4"
      />
      <button
        className="bg-black rounded-lg outline-none border-none cursor-pointer w-24 h-10 text-base flex items-center justify-center text-white"
        type="submit"
      >
        제출하기
      </button>
    </form>
  );
}

const TextBoxExercise = () => {
  return (
    <div className="border-primary flex rounded-[30px] border-2 p-8">
      <textarea
        name=""
        id=""
        className="thin-scrollbar h-[250px] w-full resize-none pr-10 text-justify outline-none placeholder:text-white"
        placeholder="Type text..."
      ></textarea>
    </div>
  );
};

export default TextBoxExercise;

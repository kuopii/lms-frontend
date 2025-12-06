import VocabDetails from "./components/vocab-details";

const VocabRemember = () => {
  const vocabList = [
    {
      vocab: "Beautiful",
      spelling: "byo͞odəfəl",
      type: "Adjective",
      explanation:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    },
    {
      vocab: "Quickly",
      spelling: "ˈkwiklē",
      type: "Adverb",
      explanation:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    },
    {
      vocab: "Happiness",
      spelling: "ˈhapēnəs",
      type: "Noun",
      explanation:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    },
    {
      vocab: "Run",
      spelling: "rən",
      type: "Verb",
      explanation:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    },
  ];

  return (
    <div className="flex flex-col rounded-[30px] bg-[#333333] px-[64px] py-8 pt-[70px] pb-[32px] text-white">
      <h1 className="text-center text-[28px] font-semibold">
        Vocabulary You Need to Remember
      </h1>
      <p className="px-0 text-center text-[22px] font-medium xl:px-64">
        Here’s a list of words that appeared during the test — perfect for
        reinforcing your understanding and boosting your skills.
      </p>

      <div className="flex flex-col divide-y divide-[#AAAAAA] border-b-1 border-[#AAAAAA]">
        {vocabList.map((item) => (
          <VocabDetails
            key={item.vocab}
            vocab={item.vocab}
            spelling={item.spelling}
            type={item.type}
            explanation={item.explanation}
          />
        ))}
      </div>
    </div>
  );
};

export default VocabRemember;

const group1 = {
  groupNumber: 1,
  questionRange: "Question 1 - 5",
  instruction:
    "Fill in the blanks in the summary with the appropriate phrases from the list.",
  type: "summary-completion",
  data: {
    summary: {
      title: "Tittle",
      sentences: [
        {
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad",
          blankNumber: 1,
          hasBlankAfter: true,
        },
        {
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore",
          blankNumber: 2,
          hasBlankAfter: true,
          textAfterBlank: "Lorem ipsum dolor sit amet",
        },
        {
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad",
          blankNumber: 3,
          hasBlankAfter: true,
        },
        {
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore",
          blankNumber: 4,
          hasBlankAfter: true,
          textAfterBlank: "Lorem ipsum dolor sit amet",
        },
        {
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad",
          blankNumber: 5,
          hasBlankAfter: true,
        },
      ],
    },
    wordBank: [
      "trade centers",
      "industrial revolution",
      "mass migration",
      "infrastructure challenges",
      "smart technology",
    ],
  },
};

export default group1;

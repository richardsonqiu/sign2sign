import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import Loading from "../components/Loading";

import { getVocab } from "api";

import { VocabPractice } from "components/VocabPractice";
import { VocabQuizMcq } from "components/VocabQuizMcq";
import { VocabQuizSigning } from "components/VocabQuizSigning";

const Vocab = () => {
  const { lessonId, vocabIndex } = useParams(); // to fetch which lesson and which vocab
  const history = useHistory();
  // const [mode, setMode] = useState("practice");
  const [mode, setMode] = useState("quizMcq");
  const [vocab, setVocab] = useState(null);

  useEffect(() => {
    const fetchVocab = async () => {
      const res = await getVocab(lessonId, vocabIndex);
      const vocab = res.data;

      setVocab(vocab);
    };

    fetchVocab();
  }, []);

  // Change mode to "practice" or "quizMcq" or "quizSigning"
  // useEffect(() => {
  //   setMode();
  // }, [])

  if (!vocab) {
    return <Loading />;
  }

  switch (mode) {
    case "practice":
      return <VocabPractice
        title={vocab.title}
        words={vocab.words}
        onPrevSection={history.goBack}
        onNextSection={() => setMode("quizMcq")}
      />
    case "quizMcq":
      return <VocabQuizMcq
        title={vocab.title}
        words={vocab.words}
        onPrevSection={() => setMode("practice")}
        onNextSection={() => setMode("quizMcq")}
      />
    case "quizSigning":
      return <VocabQuizSigning
        title={vocab.title} 
        words={vocab.words} 
        onPrevSection={() => setMode("quizMcq")} 
        onNextSection={() => setMode("finish")}
      />
    case "finish":
      return <>Yeah!</>
    default:
      return <>Oof</>
  }
};

export default Vocab;

import React, { useState } from 'react';

type Props = {};

const Qna = (props: Props) => {
  const [showAnswers, setShowAnswers] = useState<boolean[]>([]);

  const toggleAnswer = (index: number) => {
    const updatedShowAnswers = [...showAnswers];
    updatedShowAnswers[index] = !updatedShowAnswers[index];
    setShowAnswers(updatedShowAnswers);
  };

  return (
    <div>

      <h1>FAQ</h1>
      <h4 onClick={() => toggleAnswer(0)}>1: How does Cryptia ensure the privacy and confidentiality of financial transactions?</h4>
      {showAnswers[0] && <p>Cryptia employs secure secret addresses and a one-time public key mechanism, making it virtually impossible to trace or monitor transactions by anyone else. This ensures enhanced privacy and confidentiality.</p>}

      <h4 onClick={() => toggleAnswer(1)}>2: What is a "stealth address" in Cryptia, and how does it enhance privacy?</h4>
      {showAnswers[1] && <p>A "stealth address" is a unique and anonymous address exclusively linked to the intended recipient. It guarantees utmost privacy by making it difficult for anyone else to trace the recipient or monitor their transactions.</p>}

      <h4 onClick={() => toggleAnswer(2)}>3: How do I generate a unique Cr address?</h4>
      {showAnswers[2] && <p>Simply click the "generate" button on our app, and a unique Cr address will be generated for you. Make sure to save the accompanying secret key in a secure location for future use.</p>}

      <h4 onClick={() => toggleAnswer(3)}>4: Can I retrieve my private key after funds have been sent to my Cryptia address?</h4>
      {showAnswers[3] && <p>Yes, you can retrieve your private key by clicking on the "match" button or by pasting your secret key (optional) into our app. This will allow you to access the specific address where the funds have been sent.</p>}

      <h4 onClick={() => toggleAnswer(4)}>5: Is Cryptia suitable for users with varying levels of technical expertise?</h4>
      {showAnswers[4] && <p>Absolutely! Cryptia has been designed with a user-friendly interface, making it accessible and easy to use for individuals with different levels of technical knowledge. Our app provides a seamless and intuitive experience for all users.</p>}
    </div>
  );
};

export default Qna;

import React, { useState } from "react";
import { IoAddSharp } from "react-icons/io5";

type Props = {};

const Qna = (props: Props) => {
  const [showAnswers, setShowAnswers] = useState<boolean[]>([]);

  const toggleAnswer = (index: number) => {
    const updatedShowAnswers = [...showAnswers];
    updatedShowAnswers[index] = !updatedShowAnswers[index];
    setShowAnswers(updatedShowAnswers);
  };

  return (
    <div
      id="faq"
      className="p-5 py-10 flex flex-col items-center justify-center bg-[#e9e9f3] "
    >
      <h1 className="montserrat-subheading text-4xl mb-6 text-[#131619]  pb-2 ">
        FAQ
      </h1>
      <div
        className="xl:p-14 xl:px-20 bg-[#e9e9f3] transition-all ease-linear md:w-[790px] lg:w-[900px] p-5 rounded-md
       shadow-lg flex flex-col items-start justify-center"
      >
        <h4
          onClick={() => toggleAnswer(0)}
          className={`${showAnswers[0] ? "text-gray-700" : "text-gray-600"} text-left justify-between w-full hover:text-gray-700
        lg:text-lg cursor-pointer flex items-center
         montserrat-subheading py-4 gap-16`}
        >
          1: How to use Forus?
          <span>
            {showAnswers[0] ? (
              <IoAddSharp
                color="#131619"
                className="lg:text-4xl text-3xl rotate-45 transition-all duration-100"
              />
            ) : (
              <IoAddSharp
                color="#131619"
                className="lg:text-4xl text-3xl duration-100"
              />
            )}
          </span>
        </h4>
        {showAnswers[0] && (
          <p className="w-[90%] px-4 pb-5 montserrat-subheading text-[#58707e] text-left">
            Generate a link and store its corresponding secret key. Share only your Forus key (or you can also share its link) with the sender and ask them to send
            funds through the app. When they initiate the transaction using your Forus key, a new, unknown stealth address will be generated with the funds they
            sent. You will be able to access these funds using the secret key you saved.
          </p>
        )}
        <h4
          onClick={() => toggleAnswer(1)}
          className={`${showAnswers[1] ? "text-gray-700" : "text-gray-600"} text-left justify-between w-full hover:text-gray-700
        lg:text-lg cursor-pointer flex items-center
         montserrat-subheading py-4 gap-16`}
        >
          2: How does Forus ensure the privacy and confidentiality of financial
          transactions?
          <span>
            {showAnswers[1] ? (
              <IoAddSharp
                color="#131619"
                className="lg:text-4xl text-3xl rotate-45 transition-all duration-100"
              />
            ) : (
              <IoAddSharp
                color="#131619"
                className="lg:text-4xl text-3xl duration-100"
              />
            )}
          </span>
        </h4>
        {showAnswers[1] && (
          <p className="w-[90%] px-4 pb-5 montserrat-subheading text-[#58707e] text-left">
            Forus employs secure stealth addresses and a one-time public key
            mechanism, making it hard to trace or monitor transactions by anyone else. This ensures enhanced privacy and
            confidentiality.
          </p>
        )}
        <h4
          onClick={() => toggleAnswer(2)}
          className={`${showAnswers[2] ? "text-gray-700" : "text-gray-600"} text-left justify-between w-full dark:text-gray-300 dark:hover:text-[white] dark:hover:shadow-lg hover:text-gray-700
        lg:text-lg cursor-pointer flex items-center
         montserrat-subheading py-4 gap-16`}
        >
          3: What is the secret key in Forus?
          <span>
            {showAnswers[2] ? (
              <IoAddSharp
                color="#131619"
                className="lg:text-4xl text-3xl rotate-45 transition-all duration-100"
              />
            ) : (
              <IoAddSharp
                color="#131619"
                className="lg:text-4xl text-3xl duration-100"
              />
            )}
          </span>
        </h4>
        {showAnswers[2] && (
          <p className="dark:text-gray-300 w-[90%] px-4 pb-5 montserrat-subheading text-[#58707e] text-left">
            "Secret" is the 32 bytes random key that works as a private key for your Forus key. It is used to unlock funds on the stealth address generated from your Forus key. So, when you share your Forus key or link with the sender, always save its corresponding secret key in a secure place.
          </p>
        )}
        <h4
          onClick={() => toggleAnswer(3)}
          className={`${showAnswers[3] ? "text-gray-700" : "text-gray-600"} text-left justify-between w-full dark:text-gray-300 dark:hover:text-[white] dark:hover:shadow-lg hover:text-gray-700
        lg:text-lg cursor-pointer flex items-center
         montserrat-subheading py-4 gap-16`}
        >
          4: How do I generate a unique Forus key?
          <span>
            {showAnswers[3] ? (
              <IoAddSharp
                color="#131619"
                className="lg:text-4xl text-3xl rotate-45 transition-all duration-100"
              />
            ) : (
              <IoAddSharp
                color="#131619"
                className="lg:text-4xl text-3xl duration-100"
              />
            )}
          </span>
        </h4>
        {showAnswers[3] && (
          <p className="w-[90%] px-4 pb-5 montserrat-subheading text-[#58707e] text-left">
            Simply click the "generate" button, and a unique Forus key will be
            generated for you. Make sure to save the accompanying secret key
            in a secure location.
          </p>
        )}
        <h4
          onClick={() => toggleAnswer(4)}
          className={`${showAnswers[4] ? "text-gray-700" : "text-gray-600"} text-left justify-between w-full hover:text-gray-700
        lg:text-lg cursor-pointer flex items-center
         montserrat-subheading py-4 gap-16`}
        >
          5: How can I retrieve the private key of the stealth address where the funds have been sent with my Forus key?
          <span>
            {showAnswers[4] ? (
              <IoAddSharp
                color="#131619"
                className="lg:text-4xl text-3xl rotate-45 transition-all duration-100"
              />
            ) : (
              <IoAddSharp
                color="#131619"
                className="lg:text-4xl text-3xl duration-100"
              />
            )}
          </span>
        </h4>
        {showAnswers[4] && (
          <p className="w-[90%] px-4 pb-5 montserrat-subheading text-[#58707e] text-left">
            After the funds have been sent by the sender, you can retrieve the private key of the stealth address by clicking on the "scan"
            button and pasting your secret key into the designated input. This will allow
            you to access the specific stealth address where the funds have been sent.
          </p>
        )}
        <h4
          onClick={() => toggleAnswer(5)}
          className={`${showAnswers[5] ? "text-gray-700" : "text-gray-600"} text-left justify-between w-full dark:text-gray-300 dark:hover:text-[white] dark:hover:shadow-lg hover:text-gray-700
        lg:text-lg cursor-pointer flex items-center
         montserrat-subheading py-4 gap-16`}
        >
          6: Is Forus suitable for users with varying levels of technical
          expertise?
          <span>
            {showAnswers[5] ? (
              <IoAddSharp
                color="#131619"
                className="lg:text-4xl text-3xl rotate-45 transition-all duration-100"
              />
            ) : (
              <IoAddSharp
                color="#131619"
                className="lg:text-4xl text-3xl duration-100"
              />
            )}
          </span>
        </h4>
        {showAnswers[5] && (
          <p className="dark:text-gray-300 w-[90%] px-4 pb-5 montserrat-subheading text-[#58707e] text-left">
            Absolutely! Forus has been designed with a focus on quick and user-friendly interface,
            making it accessible and easy to use for individuals with different
            levels of technical knowledge. Our app provides a seamless and
            intuitive experience for all users.
          </p>
        )}
        <h4
          onClick={() => toggleAnswer(6)}
          className={`${showAnswers[6] ? "text-gray-700" : "text-gray-600"} text-left justify-between w-full hover:text-gray-700
        lg:text-lg cursor-pointer flex items-center
         montserrat-subheading py-4 gap-16`}
        >
          7: What if I lost my secret key?
          <span>
            {showAnswers[6] ? (
              <IoAddSharp
                color="#131619"
                className="lg:text-4xl text-3xl rotate-45 transition-all duration-100"
              />
            ) : (
              <IoAddSharp
                color="#131619"
                className="lg:text-4xl text-3xl duration-100"
              />
            )}
          </span>
        </h4>
        {showAnswers[6] && (
          <p className="w-[90%] px-4 pb-5 montserrat-subheading text-[#58707e] text-left">
            The secret key works like a private key for the Forus key (or Cryptographic link). If you lose it, you will never be able to retrieve the funds sent to you. It is crucial to always save the keys after generating them.
          </p>
        )}
      </div>
    </div>
  );
};

export default Qna;

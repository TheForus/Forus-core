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
      className="p-5 py-10 flex flex-col items-center justify-center bg-bgGray "
    >
      <h1 className="montserrat-subheading text-4xl mb-6 text-[#131619]  pb-2 ">
        FAQ
      </h1>
      <div
        className="xl:p-14 xl:px-20 bg-bgGray transition-all ease-linear md:w-[790px] lg:w-[900px] p-5 rounded-md
       shadow-lg flex flex-col items-start justify-center"
      >
        <h4
          onClick={() => toggleAnswer(0)}
          className={`${showAnswers[0]} text-left justify-between w-full  hover:text-gray-700
        lg:text-lg cursor-pointer flex items-center
         montserrat-subheading py-4 text-gray-600 gap-16`}
        >
          1: How does forus ensure the privacy and confidentiality of financial
          transactions?
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
          <p className=" w-[90%] px-4  pb-5  montserrat-subheading text-[#58707e] text-left">
            forus employs secure stealth addresses and a one-time public key
            mechanism, making it hard to trace or monitor
            transactions by anyone else. This ensures enhanced privacy and
            confidentiality.
          </p>
        )}
        <h4
          onClick={() => toggleAnswer(1)}
          className={`${showAnswers[1]} text-left justify-between w-full dark:text-gray-300 dark:hover:text-[white] dark:hover:shadow-lg hover:text-gray-700
        lg:text-lg cursor-pointer flex items-center
         montserrat-subheading py-4 text-gray-600 gap-16`}
        >
          2: What is signature in forus?
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
          <p className="dark:text-gray-300 w-[90%] px-4  pb-5  montserrat-subheading text-[#58707e] text-left">
            "Signature" is the 32 bytes random number works as a private key of your forus key
            Its a key to unlock funds on the stealth address generated from your forus key . So when you share your forus key
            with the sender always save its corresponding signature in a secure place
          </p>
        )}
        <h4
          onClick={() => toggleAnswer(2)}
          className={`${showAnswers[2] && "dark:text-[#09d8a1]"
            } text-left justify-between w-full dark:text-gray-300 dark:hover:text-[white] dark:hover:shadow-lg hover:text-gray-700
        lg:text-lg cursor-pointer flex items-center
         montserrat-subheading py-4 text-gray-600 gap-16`}
        >
          3: How do I generate a unique Forus key?
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
          <p className=" w-[90%] px-4  pb-5  montserrat-subheading text-[#58707e] text-left">
            Simply click the "generate" button , and a unique Forus key will be
            generated for you. Make sure to save the accompanying signature key
            in a secure location for future use.
          </p>
        )}
        <h4
          onClick={() => toggleAnswer(3)}
          className={`${showAnswers[3]} text-left justify-between w-full dark:text-gray-300 dark:hover:text-[white] dark:hover:shadow-lg hover:text-gray-700
        lg:text-lg cursor-pointer flex items-center
         montserrat-subheading py-4 text-gray-600 gap-16`}
        >
          4: Can I retrieve my private key after funds have been sent to my
          Forus key?
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
          <p className=" w-[90%] px-4  pb-5  montserrat-subheading text-[#58707e] text-left">
            Yes, you can retrieve your private key by clicking on the "scan"
            button or by pasting your signature key (optional) . This will allow
            you to access the specific address where the funds have been sent.
          </p>
        )}
        <h4
          onClick={() => toggleAnswer(4)}
          className={`${showAnswers[4] && "dark:text-[#09d8a1]"
            } text-left justify-between w-full dark:text-gray-300 dark:hover:text-[white] dark:hover:shadow-lg hover:text-gray-700
        lg:text-lg cursor-pointer flex items-center
         montserrat-subheading py-4 text-gray-600 gap-16`}
        >
          5: Is forus suitable for users with varying levels of technical
          expertise?
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
          <p className="dark:text-gray-300 w-[90%] px-4  pb-5  montserrat-subheading text-[#58707e] text-left">
            Absolutely! forus has been designed with a user-friendly interface,
            making it accessible and easy to use for individuals with different
            levels of technical knowledge. Our app provides a seamless and
            intuitive experience for all users.
          </p>
        )}
      </div>
    </div>
  );
};

export default Qna;

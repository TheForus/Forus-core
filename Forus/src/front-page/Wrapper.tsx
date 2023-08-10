import Nav from "./Nav";
import Header from "./Header";
import Tutorial from "./Tutorial";
import Features from "./Features";
import Qna from "./Qna";
import Footer from "./Footer";

type Props = {};

const Wrapper = (props: Props) => {
  // dark:bg-[#015235]
  return (
    <div className="bg-[#131619] ">
      <Nav />
      <div className=" mt-[1.2px] dark:mt-0 "></div>
      <Header />
      <Features />
      <Tutorial />
      <Qna />
      <Footer />
    </div>
  );
};

export default Wrapper;

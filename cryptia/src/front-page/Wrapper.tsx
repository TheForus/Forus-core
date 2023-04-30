import Nav from './Nav'
import Header from './Header'
import Tutorial from './Tutorial'
import Features from './Features'
import Qna from './Qna'
import Footer from './Footer'

type Props = {}

const Wrapper = (props: Props) => {
    return (
        <div className='bg-[#ECFFFA]'>
            <Nav />
            <div className=' mt-[1.2px]  '></div>
            <Header />
            <Features />
            <Tutorial /> 
            <Qna />
            <Footer /> 
        </div>
    )
}

export default Wrapper
import Nav from './Nav'
import Header from './Header'
import Tutorial from './Tutorial'
import Features from './Features'
import Qna from './Qna'
import Footer from './Footer'

type Props = {}

const Wrapper = (props: Props) => {
    return (
        <div>
            <Nav />
            <Header />
            <Features />
            <Tutorial /> 
            <Qna />
            <Footer /> 
        </div>
    )
}

export default Wrapper
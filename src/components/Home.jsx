import '../styles/home.css'
import theatreImg from '../assets/theatre.png'
export default function Home(){
    return(
        <div id="home-page">
            <img src={theatreImg} alt="movie theatre image"/>

            <div id='home-content'>
                <h1>
                    MovieHub
                </h1>
            </div>
        </div>
    )
};
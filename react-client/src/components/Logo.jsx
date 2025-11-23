import musicHub from '../assets/musichub.png'

export default function Logo(){
    return (
        <div id='title'>
            <h1>
                MovieHub
            </h1>
            <img src={musicHub} alt="logo" className='logo'/>
        </div>
    )
};
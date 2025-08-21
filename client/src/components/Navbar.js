import style from './Navbar.module.css';
const Navbar=(props)=>{
    return(
        <div className={style['navbar']}>
            <div onClick={props.onLoginButtonClick}>{props.userName}
            	{props.userName!=='Login' && <h5 onClick={props.onLogoutButtonClick}>Logout</h5>}
            </div>
            <span className={style['company-mark']}>Rentify</span>
            <button className={style['intention']} onClick={props.toggleIntention}>{props.buttonText}</button>
        </div>
    )
}

export default Navbar;

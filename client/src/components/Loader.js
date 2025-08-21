import style from './Loader.module.css';
const Loader = () => {
    return (
        <>
            <div className={style['loader-container']}></div>
            <span className={style['loader-text']}>wait...</span>
        </>
        
    );
};

export default Loader;
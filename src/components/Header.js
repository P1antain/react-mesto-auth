import headerLogo from '../image/logo.svg'

function Header(){
    return(
        <header className="header">
            <img src={headerLogo} alt="МЕСТО.РОССИЯ" className="header__logo"/>
        </header>
    );
}
export default Header
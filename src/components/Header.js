import logoPath from '../img/logo/logo_w.svg';
export default function Header() {
    return (
        <header className="header">
            <img className="header__logo"
                src={logoPath}
                alt="Логотип портала" />
        </header>
    )
}
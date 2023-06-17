import { useState } from "react"
import { useNavigate } from "react-router-dom";
import * as auth from "../utils/Auth";

export default function Login({ setLoggedIn, handleLogin, onInfoTooltipOpen }) {
    const [formValue, setFormValue] = useState({
        email: '',
        passowrd: ''
    })

    const navigate = useNavigate;

    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setFormValue({ ...formValue, [name]: value });
    }

    const handleSubmit = (evt) => {
        evt.preventDefault();
        const { email, password } = formValue;
        auth.authorize(password, email)
            .then(data => {
                if (data.token) {
                    localStorage.setItem('jwt', data.token);
                    setLoggedIn(true)
                    handleLogin(formValue.email)
                    navigate("/");
                }
            })
            .catch((err) => {
                onInfoTooltipOpen({ isOpen: true, status: false });
                console.log(err)
            })
    }

    return (
        <div className="login">
            <h2 className="login__title">Вход</h2>
            <form action="#" className="login__form" noValidate onSubmit={handleSubmit}>
                <input
                    className="login__input"
                    required
                    type="email"
                    name="email"
                    placeholder="E-mail"
                    onChange={handleChange} />

                <input
                    className="login__input"
                    required
                    type="password"
                    name="password"
                    placeholder="Пароль"
                    onChange={handleChange} />

                <button className="login__button" type="submit">Войти</button>
            </form>
        </div>
    )
}

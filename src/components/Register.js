import { useState } from "react"
import { useNavigate } from "react-router-dom";
import * as auth from "../utils/Auth";

export default function Register({ onInfoTooltipOpen }) {
    const [formValue, setFormValue] = useState({
        email: '',
        password: ''
    })

    const navigate = useNavigate;
    
    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setFormValue({ ...formValue, [name]: value });
    }

    const handleSubmit = (evt) => {
        evt.preventDefault();
        const { email, password } = formValue;
        auth.register(password, email)
            .then(data => {
                navigate("/signin", { replace: true })
            })
            .catch(() => onInfoTooltipOpen({ isOpen: true, status: false }))
    }

    return (
        <div>
            <h2 className="login__title">Регистрация</h2>
            <form action="#" className="login__form" onSubmit={handleSubmit}>
                <input
                    className="login__input"
                    required
                    type="email"
                    name="email"
                    placeholder="E-mail"
                    onChange={handleChange}
                    value={formValue.email} />

                <input
                    className="login__input"
                    required
                    type="password"
                    name="password"
                    placeholder="Пароль"
                    onChange={handleChange}
                    value={formValue.password} />
            <button className="login__button" type="submit">Зарегистрироваться</button>
            </form>
            <a href="/signin" className="login__link">Уже зарегистрированы? Войти</a>
        </div>
    )
}
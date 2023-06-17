import React from 'react';
import Good from '../img/style/good.svg';
import Nope from '../img/style/nope.svg';

export default function InfoTooltip({ onClose, isOpenConfig }) {
    return (
        <section
            className={`popup ${isOpenConfig.isOpen ? 'popup_opened' : ''}`}
            onClick={({ target }) => {
                if (target.classList.contains('popup_opened') || target.classList.contains('popup__button_type_close')) {
                    onClose();
                }
            }}>
            <div className="popup__container">
                <button
                    className="popup__button popup__button_type_close"
                    type="button"
                    onClick={onClose}>
                </button>
                <img
                    src={isOpenConfig.status ? Good : Nope}
                    className="info-tooltip__image"
                    alt=""></img>
                <p className="info-tooltip__text">
                    {isOpenConfig.status ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте ещё раз.'}
                </p>
            </div>

        </section>
    )
}
import React from "react";
import { useState, useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import ProtectedRoute from "./ProtectedRoute";

import Login from "./Login";
import Register from "./Register";

import Header from './Header';
import Main from "./Main";
import Footer from "./Footer";

import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";

import InfoTooltip from "./InfoTooltip";

import api from "../utils/Api";
import * as auth from "../utils/Auth";

function App() {
  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [userName, setUser] = useState('');
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);

  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState({});

  useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getUserData(), api.getInitialCards()])
        .then(([user, cards]) => {
          setCurrentUser(user);
          setCards(cards);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [loggedIn]);

  useEffect(() => {
    if (
      isEditProfilePopupOpen ||
      isAddPlacePopupOpen ||
      isEditAvatarPopupOpen ||
      setSelectedCard
    ) {
      document.addEventListener('keydown', handleEscClose);
    }
    return () => {
      document.removeEventListener('keydown', handleEscClose);
    };
  }, [
    isEditProfilePopupOpen,
    isAddPlacePopupOpen,
    isEditAvatarPopupOpen,
    setSelectedCard,
  ]);

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true)
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true)
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true)
  }

  function handleCardClick(card) {
    setSelectedCard(card)
  }
  // обновление профиля
  function handleUpdateUser(newUser) {
    api
      .setUserInfo(newUser)
      .then((res) => {
        setCurrentUser(res)
      })
      .catch((error) => { console.log(error); })
      .finally(() => closeAllPopups())
  }

  // обновление аватара
  function handleUpdateAvatar(avatar) {
    api
      .editAvatar(avatar)
      .then((res) => {
        setCurrentUser(res)
      })
      .catch((error) => { console.log(error); })
      .finally(() => closeAllPopups())
  }

  // добавление новой карточки
  function handleAddPlace(name, link) {
    api
      .addCard(name, link)
      .then((newCard) => {
        setCards([newCard, ...cards])
      })
      .catch((error) => { console.log(error); })
      .finally(() => closeAllPopups())
  }

  function handleLikeCard(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    api.toggleLike(card._id, isLiked).then((newCard) => {
      setCards((state) => state.map((c) => c._id === card._id ? newCard : c))
    })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((item) => item._id !== card._id))
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false)
    setIsEditProfilePopupOpen(false)
    setIsAddPlacePopupOpen(false)
    setSelectedCard({});
    setIsInfoTooltipOpen(false);
  }

  function handleEscClose(e) {
    if (e.key === 'Escape') {
      closeAllPopups();
    }
  }

  // всё что имеет отношение к регистрации и авторизации
  const handleLogin = (userName) => {
    setLoggedIn(true)
    setUser(userName)
  }

  const tokenCheck = () => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      auth.getContent(jwt)
        .then(({ data }) => {
          setLoggedIn(true);
          setUser(data.email);
          handleLogin(data.email)
          navigate('/', { replace: true })
        })
        .catch(err => console.log(err));
    }
  }

  useEffect(() => {
    tokenCheck();
  }, []);

  const handleLogout = () => {
    setLoggedIn(false);
    setUser("");
    localStorage.removeItem("jwt");
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header userName={userName} onLogout={handleLogout} />

        <Routes>
          <Route path='/'
            element={
            <ProtectedRoute
              element={Main}
              onEditAvatar={handleEditAvatarClick}
              onEditProfile={handleEditProfileClick}
              onAddCard={handleAddPlaceClick}
              onCardClick={handleCardClick}
              onCardLike={handleLikeCard}
              onCardDelete={handleCardDelete}
              cards={cards}
              loggedIn={loggedIn} />}
          />

          {/*тут рут для логина*/}
          <Route path='/signin' element={
            <div>
              <Login
                setLoggedIn={setLoggedIn}
                handleLogin={handleLogin}
                onInfoTooltipOpen={setIsInfoTooltipOpen}
                setUser={setUser} />
            </div>
          }></Route>

          {/*тут рут для регистрации*/}
          <Route path='/signup' element={
            <div>
              <Register
                onInfoTooltipOpen={setIsInfoTooltipOpen}
                setUser={setUser} />
            </div>
          }></Route>

          <Route path='*' element={<Navigate to='/' replace={true} />} />

        </Routes>

        {loggedIn && <Footer />}
        {/*обновление профиля*/}
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        {/*обновление аватарки*/}
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        {/*новая карточка*/}
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlace}
        />

        {/*просмотр карточки*/}
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />

        {/*удаление карточки*/}
        <PopupWithForm name="delete-card" title="Вы уверены?" btnText="Да" />

        <InfoTooltip
          isOpenConfig={isInfoTooltipOpen}
          onClose={closeAllPopups}
        />

      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;

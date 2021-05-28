import React from "react";
import '../index.css';
import Header from "./Header.js";
import Main from "./Main.js";
import Footer from "./Footer.js";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ImagePopup from "./ImagePopup.js";
import api from "../utils/api";
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import DeleteCardPopup from "./DeleteCardPopup";


function App() {
    const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false);
    const [isEditProfilePopupOpen, setEditProfilePopupOpen] = React.useState(false);
    const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false);
    const [isDeletePopup, setDeletePopup] = React.useState(false)
    const [currentUser, setCurrentUser] = React.useState({})
    const [selectedCard, setSelectedCard] = React.useState({});
    const [cards, setCards] = React.useState([]);
    const [cardToDelete, setCardToDelete] = React.useState({});

    React.useEffect(() => {
        Promise.all([api.getUserInfo(), api.getInitialCards()])
            .then(([userData, cards]) => {
                setCurrentUser(userData);
                setCards(cards);
            })
            .catch((err) => {
                console.log(err, true);
            });
    }, []);

    function handleUpdateUser(user){
        api.setUserInfo(user)
            .then((update) =>{
                setCurrentUser({
                    ...currentUser,
                    name: update.name,
                    about: update.about,
                })
            closeAllPopups()
            })
            .catch((err) =>{
                console.log(err, true)
            })
    }
    function handleUpdateAvatar({avatar}){
        api.updateAvatar(avatar)
            .then((update) =>{
                setCurrentUser({
                    ...currentUser,
                    avatar: update.avatar
                })
                closeAllPopups()
            })
            .catch((err) =>{
                console.log(err, true)
            })
    }
    function handleAddCard(card){
        api.addCard(card)
            .then((update)=>{
                setCards([update, ...cards])
                closeAllPopups()
            })
            .catch((err)=>{
                console.log(err)
            })
    }

    function handleEditAvatarClick() {
        setEditAvatarPopupOpen(true);
    }

    function handleEditProfileClick() {
        setEditProfilePopupOpen(true);
    }

    function handleAddPlaceClick() {
        setAddPlacePopupOpen(true);
    }

    function handleCardClick(card) {
        setSelectedCard(card);
    }
    function handleDeleteClick(card){
        setDeletePopup(true)
        setCardToDelete(card);
    }

    function closeAllPopups() {
        setEditAvatarPopupOpen(false);
        setEditProfilePopupOpen(false);
        setAddPlacePopupOpen(false);
        setDeletePopup(false)
        setSelectedCard({});
    }

    function closeOverlay(evt){
        if(evt.target === evt.currentTarget){
            closeAllPopups()
        }
    }

    function handleCardLike(card) {
        const isLiked = card.likes.some(i => i._id === currentUser._id);
        api.changeLikeCardStatus(card, !isLiked)
            .then((newCard) => {
                setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
            })
            .catch((err)=>{
                console.log(err, true)
            })

    }

    function handleCardDelete(card) {
        api.deleteCard(card)
            .then(() => {
                setCards(cards.filter((state) => state._id !== card._id)
                );
        closeAllPopups()
    })
            .catch((err)=>{
                console.log(err, true)
            })
    }
    React.useEffect(()=>{
        function handleEscClose(evt) {
            if(evt.key === 'Escape'){
                closeAllPopups()
            }
        }
        document.addEventListener('keyup', handleEscClose);
    }, [])

    // React.useEffect(()=>{
    //     function handleOverlayClose(evt) {
    //         if(evt.target.classList.contains('popup__overlay')){
    //             closeAllPopups()
    //         }
    //     }
    //     document.addEventListener('mousedown', handleOverlayClose);
    // }, [])


    return (
  <div className="page">
    <CurrentUserContext.Provider value={currentUser}>
        <Header/>
        <Main
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            cards={cards}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleDeleteClick}

        />
        <Footer/>
        <EditProfilePopup isOpen={isEditProfilePopupOpen}
                          onClose={closeAllPopups}
                          onUpdateUser={handleUpdateUser}
                          altClose={closeOverlay}
        />
        <EditAvatarPopup isOpen={isEditAvatarPopupOpen}
                         onClose={closeAllPopups}
                         onUpdateAvatar={handleUpdateAvatar}
                         altClose={closeOverlay}
        />
        <AddPlacePopup isOpen={isAddPlacePopupOpen}
                       onClose={closeAllPopups}
                       onAddPlace={handleAddCard}
                       altClose={closeOverlay}
        />

        <DeleteCardPopup isOpen={isDeletePopup}
                         onClose={closeAllPopups}
                         card={cardToDelete}
                         onSubmitDelete={handleCardDelete}
        />

        <ImagePopup card={selectedCard} onClose={closeAllPopups} altClose={closeOverlay}/>
    </CurrentUserContext.Provider>
  </div>
  );
}

export default App;

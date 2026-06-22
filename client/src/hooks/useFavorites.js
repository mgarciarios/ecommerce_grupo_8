import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setFavorites } from '../store/slices/favoriteSlice';
import { favoritosApi } from '../api/favoritosApi';

export function useFavorites() {
  const dispatch = useDispatch();

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = localUser?.id;
    if (!userId) return;

    favoritosApi.getAll(userId)
      .then(data => dispatch(setFavorites(data)))
      .catch(err => console.error("Error al cargar favoritos:", err));
  }, [dispatch]);
}

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFavorites } from '../store/slices/favoriteSlice';
import { favoritosApi } from '../api/favoritosApi';

export function useFavorites() {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.user?.user?.id);

  useEffect(() => {
    if (!userId) return;

    favoritosApi.getAll(userId)
      .then(data => dispatch(setFavorites(data)))
      .catch(err => console.error("Error al cargar favoritos:", err));
  }, [dispatch, userId]);
}

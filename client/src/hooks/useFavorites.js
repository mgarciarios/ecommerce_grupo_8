import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setFavorites } from '../store/slices/favoriteSlice';

export function useFavorites() {
  const dispatch = useDispatch();

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = localUser?.id;
    if (!userId) return;

    fetch(`http://localhost:8080/api/usuarios/${userId}/favoritos`, {
      credentials: "include",
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => dispatch(setFavorites(data)))
      .catch(err => console.error("Error al cargar favoritos:", err));
  }, [dispatch]);
}

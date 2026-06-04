import { useParams } from 'react-router-dom';
import Favorite from '../components/Favorite';

export default function FavoritesList() {
  const { categoria } = useParams();
  return <Favorite categoria={categoria} />;
}

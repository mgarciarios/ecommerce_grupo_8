// Estilos del componente ProductList
export const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh'
  },
  spinner: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #2D3277',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 1s linear infinite'
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1rem',
    padding: '1rem'
  },
  linkStyle: {
    textDecoration: 'none',
    color: 'inherit'
  },
  card: {
    border: '1px solid #ddd',
    backgroundColor: 'lightgray',
    borderRadius: '8px',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    position: 'relative'
  },
  cardImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '4px'
  },
  cardTitle: {
    margin: '0.5rem 0'
  },
  cardPrice: {
    color: '#2D3277',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    margin: '0'
  },
  cardDescription: {
    color: '#666',
    margin: '0'
  },
  favoriteButton: {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '0.25rem',
    transition: 'transform 0.2s ease-in-out'
  }
};

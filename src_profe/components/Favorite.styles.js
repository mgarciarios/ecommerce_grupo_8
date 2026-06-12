// Estilos del componente Favorite
export const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  emptyMessage: {
    textAlign: 'center',
    padding: '2rem',
    color: '#666'
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem'
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
  removeButton: {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    backgroundColor: '#ff4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  buttonsContainer: {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem'
  },
  linkButton: {
    backgroundColor: '#2D3277',
    color: 'white',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block'
  }
};

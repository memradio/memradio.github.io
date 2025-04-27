export function renderSearch(container, onSearch) {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search';
  
    searchContainer.innerHTML = `
      <input type="text" id="searchInput" placeholder="Пошук мєма...">
    `;
  
    const input = searchContainer.querySelector('#searchInput');
    input.addEventListener('input', (e) => {
      onSearch(e.target.value);
    });
  
    container.appendChild(searchContainer);
  }
  
export function renderTabs(container, onTabChange) {
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'tabs';
  
    tabsContainer.innerHTML = `
      <button id="showAll" class="tab-button active">Усі меми</button>
      <button id="showBookmarks" class="tab-button">Збережені меми</button>
    `;
  
    container.appendChild(tabsContainer);
  
    tabsContainer.querySelector('#showAll').addEventListener('click', (e) => {
      createRipple(e);
      onTabChange('all');
      setActiveTab('showAll');
    });
  
    tabsContainer.querySelector('#showBookmarks').addEventListener('click', (e) => {
      createRipple(e);
      onTabChange('bookmarks');
      setActiveTab('showBookmarks');
    });

    function createRipple(event) {
      const button = event.currentTarget;
    
      const circle = document.createElement('span');
      circle.classList.add('ripple');
    
      const diameter = Math.max(button.clientWidth, button.clientHeight);
      const radius = diameter / 2;
    
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${event.offsetX - radius}px`;
      circle.style.top = `${event.offsetY - radius}px`;
    
      // Прибираємо старий ripple, якщо є
      const ripple = button.querySelector('.ripple');
      if (ripple) {
        ripple.remove();
      }
    
      button.appendChild(circle);
    }
  
    function setActiveTab(tabId) {
      tabsContainer.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
      tabsContainer.querySelector(`#${tabId}`).classList.add('active');
    }
      
  }
  
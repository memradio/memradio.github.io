export function createMaterialToggle({
    id = 'toggle',
    label = 'Тумблер',
    emojiOn = '📃',
    emojiOff = '🎵',
    defaultState = false,
  }) {
    const wrapper = document.createElement('div');
    wrapper.className = 'material-toggle';
    wrapper.innerHTML = `
      <label class="material-switch">
        <input type="checkbox" id="${id}">
        <span class="material-slider"></span>
      </label>
      <span class="material-label">
        <span id="${id}-emoji">${defaultState ? emojiOn : emojiOff}</span>
        <span class="textModeToggle-label-text">${label}</span>
      </span>
    `;
  
    const input = wrapper.querySelector(`#${id}`);
    const emojiSpan = wrapper.querySelector(`#${id}-emoji`);
  
    // Init state from localStorage
    const stored = localStorage.getItem(id);
    const initial = stored === null ? defaultState : stored === 'true';
    input.checked = initial;
    emojiSpan.textContent = input.checked ? emojiOn : emojiOff;
  
    input.addEventListener('change', () => {
        const checked = input.checked;
        localStorage.setItem(id, checked);
        emojiSpan.textContent = checked ? emojiOn : emojiOff;
      
        const event = new CustomEvent('textModeToggled', {
          detail: { enabled: checked },
        });
        window.dispatchEvent(event);
      });
  
    return wrapper;
  }
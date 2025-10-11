// OOC Item Visualizer Extension for SillyTavern
// Hooks into chat events to add a button, send OOC messages, and visualize items.

(() => {
  const EXT_NAME = 'ooc-item-visualizer';

  $(document).ready(() => {
    if (!window.setup) return;

    console.log(`[${EXT_NAME}] Loading extension...`);

    const addOOCButton = () => {
      const inputArea = $('#send_form');
      if (!inputArea.length || inputArea.find('.ooc-button').length) return;
      
      const oocButton = $('<button type="button" class="ooc-button" title="Send OOC and Visualize Item">📄 OOC Item</button>');
      inputArea.append(oocButton);
      
      oocButton.click(() => {
        const oocCommand = prompt(
          'Enter OOC command (e.g., "Bot hands me a map and says here is a map of this place" or "/hand map"):',
          '(OOC: Bot hands me a map and says "here is a map of this place")'
        );
        if (!oocCommand) return;
        
        const inputBox = $('#send_textarea');
        inputBox.val(`/OOC ${oocCommand}`);
        $('#send_button').click();
      });
    };
    addOOCButton();

    $(document).on('DOMNodeInserted', '#chat', (event) => {
      const messageEl = $(event.target).closest('.message');
      if (!messageEl.hasClass('is_user')) return;
      
      const aiMessages = $('#chat .mes.is_ai:not(.processed)');
      aiMessages.each(function() {
        const msgEl = $(this);
        const content = msgEl.find('.mes_text').text();
        msgEl.addClass('processed');
        
        let visualization = null;
        
        if (content.includes('**Handed Item: Map**')) {
          const mapMatch = content.match(/\*\*Handed Item: Map\*\*\s*([\s\S]*?)(?=\*\*|$)/);
          if (mapMatch) visualization = createMapVisualization(mapMatch[1].trim());
        } else if (content.includes('**Handed Item: Note**')) {
          const noteMatch = content.match(/\*\*Handed Item: Note\*\*\s*([\s\S]*?)(?=\*\*|$)/);
          if (noteMatch) visualization = createNoteVisualization(noteMatch[1].trim());
        } else if (content.includes('**Handed Item: Info**')) {
          const infoMatch = content.match(/\*\*Handed Item: Info\*\*\s*([\s\S]*?)(?=\*\*|$)/);
          if (infoMatch) visualization = createInfoVisualization(infoMatch[1].trim());
        }
        
        if (visualization) msgEl.find('.mes_text').html(visualization);
      });
    });

    const createMapVisualization = (asciiMap) => {
      return `<div class="visualized-item map"><h4>Handed Map:</h4><pre>${asciiMap}</pre></div>`;
    };
    
    const createNoteVisualization = (noteText) => {
      return `<div class="visualized-item note"><h4>Handed Note:</h4><div class="note-content">${noteText.replace(/\n/g, '<br>')}</div></div>`;
    };
    
    const createInfoVisualization = (infoText) => {
      return `<div class="visualized-item info"><h4>Provided Info:</h4><p>${infoText.replace(/\n/g, '<br>')}</p></div>`;
    };

    console.log(`[${EXT_NAME}] Extension loaded successfully.`);
  });
})();

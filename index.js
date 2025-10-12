// OOC Item Visualizer Extension for SillyTavern
// Adds an option to the Extensions panel for OOC item visualization.

(() => {
  const EXT_NAME = 'ooc-item-visualizer';

  // Wait for SillyTavern to fully load
  $(document).ready(() => {
    if (!window.setup) return; // Ensure SillyTavern context

    console.log(`[${EXT_NAME}] Loading extension...`);

    // Function to add the option to the Extensions panel
    const addToExtensionsPanel = () => {
      const panel = $('#extensions-management'); // Target the Extensions panel container
      if (!panel.length || panel.find('.ooc-item-option').length) return;

      // Create a new list item for the option
      const oocOption = $('<li class="ooc-item-option" style="list-style: none; padding: 5px; cursor: pointer; background: #f0f0f0; border-radius: 5px; margin: 5px 0;"><a href="#" style="color: #333; text-decoration: none;">📄 OOC Item Visualizer</a></li>');

      // Append to the panel (assume it's an <ul> or similar)
      panel.append(oocOption);

      // Click handler for the option
      oocOption.find('a').click((e) => {
        e.preventDefault(); // Prevent default link behavior
        // Trigger the OOC prompt and send logic (same as before)
        const oocCommand = prompt(
          'Enter OOC command (e.g., "Bot hands me a map and says here is a map of this place" or "/hand map"):',
          '(OOC: Bot hands me a map and says "here is a map of this place")'
        );
        if (!oocCommand) return;

        // Send as /OOC message
        const inputBox = $('#send_textarea');
        inputBox.val(`/OOC ${oocCommand}`);
        $('#send_button').click(); // Simulate send
        alert('OOC command sent! Wait for AI response and visualization.');
      });

      console.log(`[${EXT_NAME}] Added OOC option to Extensions panel.`);
    };

    // Hook into the panel after it's ready (SillyTavern builds it on load)
    // Use a short delay or event listener to ensure the panel is rendered
    const waitForPanel = setInterval(() => {
      if ($('#extensions-management').length) {
        clearInterval(waitForPanel);
        addToExtensionsPanel();
      }
    }, 500); // Check every 500ms, up to 5s

    // Optional: If you want to re-add on UI changes, listen for more events...

    // Visualization logic remains the same (parsed from AI responses)
    $(document).on('DOMNodeInserted', '#chat', (event) => {
      const messageEl = $(event.target).closest('.message');
      if (!messageEl.hasClass('is_user')) return;

      const aiMessages = $('#chat .mes.is_ai:not(.processed)');
      aiMessages.each(function() {
        const msgEl = $(this);
        const content = msgEl.find('.mes_text').text();
        msgEl.addClass('processed');

        // Parse for item visualization (same as before)
        let visualization = null;

        if (content.includes('**Handed Item: Map**')) {
          const mapMatch = content.match(/\*\*Handed Item: Map\*\*\s*([\s\S]*?)(?=\*\*|$)/);
          if (mapMatch) {
            visualization = `<div class="visualized-item map"><h4>Handed Map:</h4><pre>${mapMatch[1].trim()}</pre></div>`;
          }
        } else if (content.includes('**Handed Item: Note**')) {
          const noteMatch = content.match(/\*\*Handed Item: Note\*\*\s*([\s\S]*?)(?=\*\*|$)/);
          if (noteMatch) {
            visualization = `<div class="visualized-item note"><h4>Handed Note:</h4><div class="note-content">${noteMatch[1].trim().replace(/\n/g, '<br>')}</div></div>`;
          }
        }

        if (visualization) {
          msgEl.find('.mes_text').html(visualization);
        }
      });
    });

    console.log(`[${EXT_NAME}] Extension loaded successfully.`);
  });
})();

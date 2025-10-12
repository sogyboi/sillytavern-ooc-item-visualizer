// OOC Item Visualizer Extension for SillyTavern
// Adds an option to the Extensions menu for OOC item visualization.

(() => {
  const EXT_NAME = 'ooc-item-visualizer';

  // Wait for SillyTavern to fully load
  $(document).ready(() => {
    if (!window.setup) return; // Ensure SillyTavern context

    console.log(`[${EXT_NAME}] Loading extension...`);

    // Function to add the option to the Extensions menu
    const addToExtensionsMenu = () => {
      const menu = $('#extensionsMenu'); // Target the main Extensions menu container
      if (!menu.length || menu.find('#ooc_wand_container').length) return;

      // Create the new extension container (matching structure like data_bank_wand_container)
      const oocContainer = $(`
        <div id="ooc_wand_container" class="extension_container interactable" tabindex="0">
          <div id="ooc_item_visualizer" class="list-group-item flex-container flexGap5 interactable" title="Send OOC command to visualize handed items like maps or notes." tabindex="0" role="listitem">
            <i class="fa-solid fa-scroll extensionsMenuExtensionButton"></i>
            <span>OOC Item Visualizer</span>
          </div>
        </div>
      `);

      // Append to the menu (last position in the list)
      menu.append(oocContainer);

      // Click handler for the option
      oocContainer.find('#ooc_item_visualizer').click(() => {
        // Trigger the OOC prompt and send logic
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

      console.log(`[${EXT_NAME}] Added OOC option to Extensions menu.`);
    };

    // Hook into the menu after it's ready (it loads dynamically)
    const waitForMenu = setInterval(() => {
      if ($('#extensionsMenu').length) {
        clearInterval(waitForMenu);
        addToExtensionsMenu();
      }
    }, 500); // Check every 500ms, up to 5s

    // Visualization logic remains the same (parsed from AI responses)
    $(document).on('DOMNodeInserted', '#chat', (event) => {
      const messageEl = $(event.target).closest('.message');
      if (!messageEl.hasClass('is_user')) return;

      const aiMessages = $('#chat .mes.is_ai:not(.processed)');
      aiMessages.each(function() {
        const msgEl = $(this);
        const content = msgEl.find('.mes_text').text();
        msgEl.addClass('processed');

        // Parse for item visualization
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

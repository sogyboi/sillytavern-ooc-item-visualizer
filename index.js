// OOC Item Visualizer Extension for SillyTavern (Debug Version)
// Adds an option to the Extensions menu for OOC item visualization.

(() => {
  const EXT_NAME = 'ooc-item-visualizer';

  console.log(`[${EXT_NAME}] Script loaded, checking window.setup:`, !!window.setup);

  // Wait for SillyTavern to fully load
  $(document).ready(() => {
    console.log(`[${EXT_NAME}] $(document).ready fired, window.setup:`, !!window.setup);
    if (!window.setup) return; // Ensure SillyTavern context

    console.log(`[${EXT_NAME}] Loading extension...`);

    // Function to add the option to the Extensions menu
    const addToExtensionsMenu = () => {
      const menu = $('#extensionsMenu');
      console.log(`[${EXT_NAME}] Checking menu: $#extensionsMenu exists:`, menu.length);

      if (!menu.length || menu.find('#ooc_wand_container').length) {
        console.log(`[${EXT_NAME}] Menu not found or ooc_wand_container already exists, skipping.`);
        return;
      }

      console.log(`[${EXT_NAME}] Appending OOC option to Extensions menu.`);
      // Create the new extension container (matching structure like data_bank_wand_container)
      const oocContainer = $(`
        <div id="ooc_wand_container" class="extension_container interactable" tabindex="0">
          <div id="ooc_item_visualizer" class="list-group-item flex-container flexGap5 interactable" title="Send OOC command to visualize handed items like maps or notes." tabindex="0" role="listitem">
            <i class="fa-solid fa-scroll extensionsMenuExtensionButton"></i>
            <span>OOC Item Visualizer</span>
          </div>
        </div>
      `);

      // Append to the menu
      menu.append(oocContainer);
      console.log(`[${EXT_NAME}] OOC container appended successfully.`);

      // Click handler for the option
      oocContainer.find('#ooc_item_visualizer').click(() => {
        console.log(`[${EXT_NAME}] OOC option clicked.`);
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

    // Hook into the menu after it's ready
    let attempts = 0;
    const waitForMenu = setInterval(() => {
      attempts++;
      console.log(`[${EXT_NAME}] Waiting for menu, attempt ${attempts}/10`);
      if ($('#extensionsMenu').length) {
        clearInterval(waitForMenu);
        console.log(`[${EXT_NAME}] extensionsMenu found, adding option.`);
        addToExtensionsMenu();
      } else if (attempts >= 10) {
        console.log(`[${EXT_NAME}] extensionsMenu not found after 10 attempts, giving up.`);
        clearInterval(waitForMenu);
      }
    }, 500); // Every 500ms

    // Visualization logic (unchanged)
    $(document).on('DOMNodeInserted', '#chat', (event) => {
      console.log(`[${EXT_NAME}] Chat message inserted for visualization check.`);
      // ... (rest of your visualization code remains the same)
    });

    console.log(`[${EXT_NAME}] Extension loaded successfully.`);
  });
})();

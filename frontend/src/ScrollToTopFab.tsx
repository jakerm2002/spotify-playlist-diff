import React, {useCallback} from 'react';
import { useScrollTrigger, Zoom, Box, Fab } from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';

// https://dilshankelsen.com/creating-scroll-to-top-button-with-react-mui/

function ScrollToTopFab() {
    // Use `window` instead of `body` as `document` will be `undefined` when the
    // hooks first runs. By default, useScrollTrigger will attach itself to `window`.
    const trigger = useScrollTrigger({
      // Number of pixels needed to scroll to toggle `trigger` to `true`.
      threshold: 350,
    })
  
    const scrollToTop = useCallback(() => {
    //   window.scrollTo({ top: 0, behavior: "instant" })
        // document.getElementById('cardsComponent').scrollIntoView({ behavior: 'instant', block: 'center' })
        const yOffset = -10;
        // const yOffset = 0;
        const element = document.getElementById('cardsComponent');
        const y = element ? element.getBoundingClientRect().top + window.pageYOffset + yOffset : 0;
        window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior });
    }, [])
  
    return (
      <Zoom in={trigger}>
        <Box
          role="presentation"
          // Place the button in the bottom right corner.
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            zIndex: 1,
          }}
        >
          <Fab
            onClick={scrollToTop}
            color="primary"
            size="medium"
            aria-label="Scroll back to top"
          >
            <KeyboardArrowUp fontSize="medium" />
          </Fab>
        </Box>
      </Zoom>
    )
  }
  
  export default ScrollToTopFab
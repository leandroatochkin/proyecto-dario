export const dropIn = {
    hidden: {
        y: '-100vh',
        opacity: 0
    },
    visible: {
        y: '0',
        opacity: 1,
        trasition: {
            duration: 0.1,
            type: 'spring',
            damping: 25,
            stifness: 500
        }
  
    },
    exit: {
        y: '100vh',
        opacity: 0
    }
  }
  
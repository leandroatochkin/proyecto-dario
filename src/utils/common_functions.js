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

export const capitalize = (str) => {
    str = str.replace(/n\*/gi, (match) => match === 'N*' ? 'Ñ' : 'ñ');
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
  
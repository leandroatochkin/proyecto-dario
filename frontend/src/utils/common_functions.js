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

export const convertTimeToMinutes = (time) => {
    const hours = parseInt(time.slice(0, -2), 10); // Get the hours
    const minutes = parseInt(time.slice(-2), 10); // Get the last two digits as minutes
    return hours * 60 + minutes;
};

export const getAddressLabel = (language, type) => {
    switch (type) {
      case '1':
        return language.select_home;
      case '2':
        return language.select_work;
      case '3':
        return language.select_other;
      default:
        return 'Dirección';
    }
  };
  
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>\/?]).{8,}$/

export const emailRegex = /^\S+@(gmail|outlook|hotmail|yahoo)\.[a-zA-Z]{2,3}$/

export  const phoneRegex = /^[0-9]+$/

export const returnDiscount = (total ,discount) => {

  return total - (total * discount / 100)

}


export const useLocalStorage = (key) => {
    
    const setItem = (value) => {
        try {
            const existingData = JSON.parse(window.localStorage.getItem(key)) || [];
            existingData.push(value); 
            window.localStorage.setItem(key, JSON.stringify(existingData));
        } catch (error) {
            console.error('Error saving data to localStorage', error);
        }
    }

    const getItem = () => {
        try {
            const item = window.localStorage.getItem(key)
            return item? JSON.parse(item) : null;

        }catch (error) {
            console.log(error)
        }
    }

    const removeItem = () => {
        try {
            window.localStorage.removeItem(key)
        } catch (error) {
            console.log(error)
        }
    }
    return {setItem, getItem, removeItem}
};

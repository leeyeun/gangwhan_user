import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, useEffect } from 'react';

const PrefContext = createContext({});

const PrefContextProvider = ({ children }) => {
	// my categories
    const [ myCategories, setMyCategories ] = useState([]);
	useEffect(() => {
		AsyncStorage.getItem('my_categories').then((categories) => {
			if (categories && categories.length > 0) {
				setMyCategories(JSON.parse(categories));
			}
			else setMyCategories([]);
		});
	}, []);

	const toggleMyCategory = category => {
		const index = myCategories.indexOf(category);
		if (index > -1) {
			setMyCategories(data => {
				const result = [ ...data ];
				result.splice(index, 1);
				
				AsyncStorage.setItem('my_categories',JSON.stringify(result));
				return result;
			});
		}
		else {
			setMyCategories(data => {
				const result = [ ...data ];
				result.push(category);
				
				AsyncStorage.setItem('my_categories',JSON.stringify(result));
				return result;
			});
		}
	}

	const toggleAllMyCategories = (enable, categories) => {
		console.log(enable);
		if (enable) {
			setMyCategories(categories);
			AsyncStorage.setItem('my_categories', JSON.stringify(categories));
		}
		else {
			setMyCategories([]);
			AsyncStorage.setItem('my_categories', JSON.stringify([]));
		}
	}
	// end: my categories
	
	

    

    // for developement
    const clearAllPref = function() {
        AsyncStorage.setItem('my_categories', null);
    }

	return (
		<PrefContext.Provider  
			value={{    
				myCategories,
                toggleMyCategory,
				toggleAllMyCategories,

                clearAllPref,
			}}
		>
			{children} 
		</PrefContext.Provider>
	);
};

export {
	PrefContext,
	PrefContextProvider
};
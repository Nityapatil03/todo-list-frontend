import { createSlice } from '@reduxjs/toolkit';

interface themeState {
    isDark: boolean;
}

const initialState: themeState = {
    isDark: localStorage.getItem('theme') === 'dark' 
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.isDark = !state.isDark;
            localStorage.setItem('theme', state.isDark ? 'dark' : 'light');
        },
    },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
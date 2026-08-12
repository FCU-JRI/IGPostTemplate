import React, { useReducer, useRef, useState, useCallback } from 'react';
import ControlPanel from './components/ControlPanel';
import PreviewCanvas from './components/PreviewCanvas';
import { exportImage } from './utils/exportImage';
import styles from './App.module.css';

const initialState = {
  theme: 'theme-crimson',
  layout: 'layout-text',
  fontFamily: 'font-sans',
  title: '重要政策公告',
  subtitle: '最新消息發布',
  body: '請留意最新的法規變動與行政措施。\n若有任何疑問，請洽詢相關負責人員。',
  image: null,
  zoom: 100,
  x: 50,
  y: 50,
  logoPosition: 'logo-bottom-right',
  isOverflowing: false,
  // T3: dynamic body font size (px). Starts at 42, shrinks to min 28.
  bodyFontSize: 42,
  bodyFontShrunk: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isExporting, setIsExporting] = useState(false);
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);

  const checkOverflow = useCallback(({ isOverflowing, bodyFontSize, bodyFontShrunk }) => {
    if (
      state.isOverflowing !== isOverflowing ||
      state.bodyFontSize !== bodyFontSize ||
      state.bodyFontShrunk !== bodyFontShrunk
    ) {
      dispatch({ type: 'UPDATE_FIELD', field: 'isOverflowing', value: isOverflowing });
      dispatch({ type: 'UPDATE_FIELD', field: 'bodyFontSize', value: bodyFontSize });
      dispatch({ type: 'UPDATE_FIELD', field: 'bodyFontShrunk', value: bodyFontShrunk });
    }
  }, [state.isOverflowing, state.bodyFontSize, state.bodyFontShrunk]);

  const handleExport = () => {
    if (canvasRef.current && wrapperRef.current) {
      exportImage(canvasRef.current, setIsExporting);
    }
  };

  return (
    <div className={styles.appContainer}>
      <ControlPanel 
        state={state} 
        dispatch={dispatch} 
        handleExport={handleExport}
        isExporting={isExporting}
      />
      <PreviewCanvas 
        state={state} 
        canvasRef={canvasRef} 
        wrapperRef={wrapperRef}
        checkOverflow={checkOverflow}
      />
    </div>
  );
}

export default App;

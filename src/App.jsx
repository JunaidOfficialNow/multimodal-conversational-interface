import { useEffect, useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import ChatInterface from './components/ChatInterface';
import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FingerPrintJS from '@fingerprintjs/fingerprintjs';
import ProfileCompletionPage from './components/Profile';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DeviceInfoContext from './contexts/DeviceInfoContext';
import axios from 'axios';
import UserContext from './contexts/UserContext';
import captureLocation from './utils/captureLocation';
import Dots from './components/Dots';

function App() {
  const [machineId, setMachineId] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    async function loadFingerPrint() {
      const fp = await FingerPrintJS.load();
      const result = await fp.get();
      setMachineId(result.visitorId);
      const response = await axios.get(
        import.meta.env.VITE_SERVICE_URL + '/machine-id/' + result.visitorId
      );
      setUser(response.data);
    }
    async function getLocationDetails() {
      const locDetails = await captureLocation();
      setLocationData(locDetails);
    }
    getLocationDetails();
    loadFingerPrint();
  }, []);

  return (
    <div className='App'>
      <Dots/>
      <DeviceInfoContext.Provider value={{ machineId, locationData }}>
        <UserContext.Provider value={{user, setUser, isLoggedIn, setIsLoggedIn}}>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<WelcomeScreen />} />
              <Route path='/onboarding' element={<ChatInterface />} />
              <Route path='/profile' element={<ProfileCompletionPage />} />
            </Routes>
          </BrowserRouter>
        </UserContext.Provider>
      </DeviceInfoContext.Provider>
      <ToastContainer />
    </div>
  );
}

export default App;

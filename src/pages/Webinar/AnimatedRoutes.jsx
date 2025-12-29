import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import FirstPage from './FirstPage';
import Webinars from './Webinars';
import WebinarDetail from './WebinarDetail';
import PageTransition from './PageTransition';

const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
<<<<<<< HEAD
                <Route index element={<PageTransition><FirstPage /></PageTransition>} />
                <Route path="webinars" element={<PageTransition><Webinars /></PageTransition>} />
                <Route path=":id" element={<PageTransition><WebinarDetail /></PageTransition>} />
=======
                <Route path="/" element={<PageTransition><FirstPage /></PageTransition>} />
                <Route path="/webinars" element={<PageTransition><Webinars /></PageTransition>} />
                <Route path="/webinar/:id" element={<PageTransition><WebinarDetail /></PageTransition>} />
>>>>>>> f57cca59b83f715f957a247c0ae7a4f9eaac2214
            </Routes>
        </AnimatePresence>
    );
};

export default AnimatedRoutes;

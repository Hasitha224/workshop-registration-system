import { Outlet } from 'react-router-dom';
import AppHeader from './common/AppHeader';
import Footer from './common/Footer';

const Layout = () => {
    return (
        <div className="flex flex-col h-screen w-full overflow-hidden">
            <AppHeader/>
            <main className="flex-1 overflow-auto">
                <div className="mx-auto w-full max-w-screen-[1920px] p-4 sm:p-6 lg:p-8">
                    <Outlet/>
                </div>
            </main>
            <Footer/>
        </div>
    );
}

export default Layout

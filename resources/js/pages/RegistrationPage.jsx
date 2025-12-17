import Navbar from "../fragments/Navbar";
import RegistrationForm from "../fragments/RegistrationForm";

const RegistrationPage = ({
    onShowLogin,
    onShowRegister,
    onShowLanding,
    onNavigate,
}) => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="flex justify-center px-4 py-14">
                <RegistrationForm />
            </main>
        </div>
    );
};

export default RegistrationPage;

import Header from "@/components/header"
import UserLoginForm from "@/components/users/UserLoginForm"
import Head from "next/head"

const Login: React.FC = () => {
    return (
        <>
            <Head>
                <title>Login</title>
            </Head>
            <Header />
            <main className="bg-background text-text min-h-screen flex items-center justify-center bg-gray-100 px-4">
                <section className="bg-comp w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                    <UserLoginForm />
                </section>
            </main>
        </>
    )
};

export default Login;
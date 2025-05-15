import Header from "@/components/header"
import Head from "next/head"
import RegisterForm from "@/components/users/RegisterForm"


const Register: React.FC = () => {
    return(
        <>
            <Head>
                <title>Register</title>
            </Head>
            <Header />
            <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
                <section className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                    <RegisterForm />
                </section>
            </main>
        </>
    )
}

export default Register;
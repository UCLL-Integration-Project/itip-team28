import styles from '@styles/home.module.css';
import Head from 'next/head';

const Home: React.FC = () => {

    return (
        <>
            <Head>
                <title>Home</title>
                <meta name="description" content="BowlBuddies Pokebowl app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="assets/logo.png" />
            </Head>

            <main className='homepage-main'>
                <section className='homepage-section'>
                    <h1>Hello world</h1>
                </section>
            </main>
        </>
    );
};


export default Home;
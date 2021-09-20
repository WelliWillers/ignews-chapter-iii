import { GetServerSideProps, GetStaticProps } from "next"
import { getSession, useSession } from "next-auth/client"
import Head from "next/head";
import { RichText } from "prismic-dom";
import { getPrismicioClient } from "../../../services/prismic";
import Link from 'next/link';

import styles from '../post.module.scss';
import { useEffect } from "react";
import { useRouter } from "next/router";

interface PostPreviewProps {
    post: {
        slug: string;
        title: string;
        content: string;
        updateAt: string;
    }
}

export default function PostPreview({post}: PostPreviewProps){

    const [ session ] = useSession();
    const router = useRouter();


        useEffect(() => {
            if(session?.activeSubscription){
                router.push(`/posts/${post.slug}`);
            }
        }, [session]);

    return (
        <>
            <Head>
                <title>{post.title} | ig.news</title> 
            </Head>

            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updateAt}</time>
                    <div className={`${styles.content} ${styles.preview}`} dangerouslySetInnerHTML={{__html: post.content}} />

                    <div className={styles.continueReading}>
                        Wanna continue reading?
                        <Link href="/">
                            <a>Subscribe now ☺️</a>
                        </Link>
                    </div>
                </article>
            </main>

        </>
    )
}

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async ({params}) => {
    const { slug } = params;

    const prismic = getPrismicioClient();

    const response = await prismic.getByUID('posts', String(slug), {});

    const post = {
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content.splice(0, 3)),
        updateAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }

    return {
        props: {
            post
        },
        revalidate: 60 * 30 // 30 minutes
    }
}
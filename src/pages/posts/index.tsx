import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';

import { getPrismicioClient } from '../../services/prismic';
import styles from './styles.module.scss';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/client';

interface Post {
    slug: string;
    title: string;
    excerpt: string;
    updateAt: string;
}

interface PostsProps {
    posts: Post[]; 
}

export default function Posts({posts}: PostsProps){

    const [session] = useSession();
    const [linkPrefix, setLinkPrefix] = useState('');

    useEffect(() => {
        if(session?.activeSubscription){
            setLinkPrefix('');
        } else {
            setLinkPrefix('preview');
        }
    }, [session]);

    console.log(linkPrefix);

    return (
        <>
            <Head>
                <title>Posts | ig.news</title>
            </Head>

            <main className={styles.container}>
                <div className={styles.posts}>

                    { posts.map(post => (
                        <Link key={post.slug} href={`/posts/${linkPrefix}/${post.slug}`}>
                            <a >
                                <time>
                                    {post.updateAt}
                                </time>
                                <strong>{post.title}</strong>
                                <p>{post.excerpt}</p>
                            </a>
                        </Link>
                    ))}
                </div>
            </main>
        </>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const prismic = getPrismicioClient();

    const response = await prismic.query([
        Prismic.predicates.at('document.type', 'posts')
    ], {
        fetch: ['posts.title', 'posts.content'],
        pageSize: 100,
    });

    const posts = response.results.map(post => {
        return {
            slug: post.uid,
            title: RichText.asText(post.data.title),
            excerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
            updateAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            })
        }
    })

    return {
        props: {
            posts
        }
    }
}
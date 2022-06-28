import { render, screen } from '@testing-library/react'
import { getSession, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import {mocked} from 'ts-jest/utils'
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]'
import {getPrismicioClient} from '../../services/prismic'

const post = {
    slug: 'post-slug',
    title: 'Post Title',
    content: '<p>Post description</p>',
    updateAt: '01 de abril de 2022'
}

jest.mock('next-auth/client')
jest.mock('next/router')
jest.mock('../../services/prismic')

describe('Post preview page', () => {
    it('renders correctly', () => {
        const useSessionMocked = mocked(useSession)
        useSessionMocked.mockReturnValueOnce([null, false])

        const { getByText } = render(
            <Post
                post={post}
            />
        )

        expect(getByText('Post Title')).toBeInTheDocument()
        expect(getByText('Post description')).toBeInTheDocument()
        expect(getByText('Wanna continue reading?')).toBeInTheDocument()
    })

    it('redirects user to full post when user is subscribed', async () => {
        const useSessionMocked = mocked(useSession)
        useSessionMocked.mockReturnValueOnce([{
            activeSubscription: 'fake-active-subscription'
        }, false] as any)

        const pushMock = jest.fn()
        const useRouterMocked = mocked(useRouter)
        useRouterMocked.mockReturnValueOnce({
            push: pushMock
        } as any)

        render(
            <Post
                post={post}
            />
        )

        expect(pushMock).toHaveBeenCalledWith('/posts/post-slug')

    })
    
    it('load initial datas', async () => {
        const getPrismicClientMocked = mocked(getPrismicioClient)
        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title: [
                        {type: 'heading', text:'Post Title'}
                    ],
                    content: [
                        {type: 'paragraph', text: 'Post description'},
                    ]
                },
                last_publication_date: '04-01-2022'
            })
        } as any)

        const response = await getStaticProps({params: {slug: 'post-slug'}} as any)

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post: {
                        slug: 'post-slug',
                        title: 'Post Title',
                        content: '<p>Post description</p>',
                        updateAt: '01 de abril de 2022'
                    }
                }
            }
        ))

    })

})
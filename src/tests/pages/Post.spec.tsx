import { render, screen } from '@testing-library/react'
import { getSession } from 'next-auth/client'
import {mocked} from 'ts-jest/utils'
import Post, { getServerSideProps } from '../../pages/posts/[slug]'
import {getPrismicioClient} from '../../services/prismic'

const post = {
    slug: 'post-slug',
    title: 'Post Title',
    content: '<p>Post description</p>',
    updateAt: '01 de abril de 2022'
}

jest.mock('next-auth/client')
jest.mock('../../services/prismic')

describe('Post page', () => {
    it('renders correctly', () => {

        const { getByText } = render(
            <Post
                post={post}
            />
        )

        expect(getByText('Post Title')).toBeInTheDocument()
        expect(getByText('Post description')).toBeInTheDocument()
    })

    it('redirects user if no subscriptions is found', async () => {
        const getSessionMocked = mocked(getSession)
        getSessionMocked.mockReturnValueOnce({
            activeSubscription: null
        } as any)

        const response = await getServerSideProps({params: {slug: 'post-slug'}} as any)

        expect(response).toEqual(
            expect.objectContaining({
                redirect: expect.objectContaining({
                    destination: '/',
                })
            }
        ))

    })
    
    it('load initial datas', async () => {
        const getSessionMocked = mocked(getSession)
        getSessionMocked.mockReturnValueOnce({
            activeSubscription: 'fake-active-subscription'
        } as any)


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

        const response = await getServerSideProps({params: {slug: 'post-slug'}} as any)

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
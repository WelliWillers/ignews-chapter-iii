import { render } from '@testing-library/react'
import { getSession, useSession } from 'next-auth/client'
import {mocked} from 'ts-jest/utils'
import Posts, { getStaticProps } from '../../pages/posts'
import {getPrismicioClient} from '../../services/prismic'

const posts = [
    {
        slug: 'post-slug',
        title: 'Post Title',
        excerpt: 'Post description',
        updateAt: '01 de abril de 2022'
    }
]

jest.mock('../../services/prismic')
// jest.mock('next-auth/client')

describe('Posts page',() => {
    it('renders correctly', () => {
        
        // const useSessionMocked = mocked(useSession)
        // useSessionMocked.mockReturnValueOnce([null, false])

        const { getByText } = render(
            <Posts 
                posts={posts}
            />
        )

        expect(getByText('Post Title')).toBeInTheDocument()
    })


    it('load getStaticProps', async () => {
        const getPrismicClientMocked = mocked(getPrismicioClient)
        getPrismicClientMocked.mockReturnValueOnce({
            query: jest.fn().mockResolvedValueOnce({
                results: [
                    {
                        uid: 'post-slug',
                        data: {
                            title: [
                                {type: 'heading', text:'Post Title'}
                            ],
                            content: [
                                {type: 'paragraph', text: 'Post description'},
                            ]
                        },
                        last_publication_date: '04-01-2022'
                    }
                ]
            })
        } as any)

        const response = await getStaticProps({})

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    posts: [{
                        slug: 'post-slug',
                        title: 'Post Title',
                        excerpt: 'Post description',
                        updateAt: '01 de abril de 2022'
                    }]
                }
            }
        ))

    })

})
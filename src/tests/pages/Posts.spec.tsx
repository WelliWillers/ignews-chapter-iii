import { render, screen } from '@testing-library/react'
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

describe('Posts page', () => {
    it('renders correctly', async () => {

        render(<Posts 
            posts={posts}
        />)

        expect(screen.getByText('Post Title')).toBeInTheDocument()
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
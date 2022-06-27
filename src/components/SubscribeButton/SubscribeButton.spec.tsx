import { render, fireEvent, screen } from "@testing-library/react"
import { SubscribeButton } from "."
import { signIn, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { mocked } from 'ts-jest/utils'

jest.mock('next-auth/client')
jest.mock('next/router')

describe('SubscribeButton component', () => {
    it('render correctly(not loged)', () => {

        const useSessionMocked = mocked(useSession)
        useSessionMocked.mockReturnValueOnce([null, false])


        const { getByText } = render(
            <SubscribeButton />
        )
    
        expect(getByText('Subscribe now')).toBeInTheDocument()
    })
    
    it('redirects user to signin when not signed in', () => {

        const signInMocked = mocked(signIn)

        const useSessionMocked = mocked(useSession)
        useSessionMocked.mockReturnValueOnce([null, false])
        
        const { getByText } = render(
            <SubscribeButton />
        )
        
        const subscriberButton = getByText('Subscribe now')

        fireEvent.click(subscriberButton)
    
        expect(signInMocked).toHaveBeenCalled()
    })
    
    it('redirects to posts when user already has a subscription', () => {

        const useSessionMocked = mocked(useSession)
        useSessionMocked.mockReturnValueOnce([
            { 
                user: { 
                    name: 'Jane Doe', 
                    email: 'jane@example.com'
                }, 
                activeSubscription: 'fake-activeSubscription',
                expires: 'fake-expires' 
            },
            false
        ])

        const pushMock = jest.fn() 
        const useRouterMocked = mocked(useRouter)
        useRouterMocked.mockReturnValueOnce({
            push: pushMock
        } as any)

        render(
            <SubscribeButton />
        )
        
        const subscriberButton = screen.getByText('Subscribe now')
        fireEvent.click(subscriberButton)
        
        expect(pushMock).toHaveBeenCalledWith('/posts')
    })
})

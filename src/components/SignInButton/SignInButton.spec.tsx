import { render } from "@testing-library/react"
import { SignInButton } from "."
import { useSession } from 'next-auth/client'
import { mocked } from 'ts-jest/utils'

jest.mock('next-auth/client')

describe('SignInButton component', () => {
    it('renders correctly when user is not authenticated', () => {

        const useSessionMocked = mocked(useSession)

        useSessionMocked.mockReturnValueOnce([null, false])
        
        const { getByText } = render(
            <SignInButton />
        )
    
        expect(getByText('Entrar com Github')).toBeInTheDocument()
    })
    
    it('renders correctly when user is authenticated', () => {

        const useSessionMocked = mocked(useSession)

        useSessionMocked.mockReturnValueOnce([
            { user: { name: 'Jane Doe', email: 'jane@example.com'}, expires: 'fake-expires' },
            false
        ])

        const { getByText } = render(
            <SignInButton />
        )
    
        expect(getByText('Jane Doe')).toBeInTheDocument()
    })
})

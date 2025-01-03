import { LogOutButton } from '@/components/logout-button'
import { authedOnly } from '../actions/auth'

const AuthenticatedPage = async (): Promise<JSX.Element> => {
  const parsedJWT = await authedOnly()

  return (
    <div>
      <h1>Authenticated Page</h1>
      <p>You are authenticated, {parsedJWT.sub}!</p>
      <hr />
      <LogOutButton />
    </div>
  )
}

export default AuthenticatedPage

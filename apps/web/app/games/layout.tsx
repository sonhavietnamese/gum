import { authedOnly } from '../actions/auth'

export default async function Layout({ children }: { children: React.ReactNode }): Promise<JSX.Element> {
  const parsedJWT = await authedOnly()

  return (
    <div>
      <h1>Authenticated Page</h1>
      <p>You are authenticated, {parsedJWT.sub}!</p>

      {children}
    </div>
  )
}

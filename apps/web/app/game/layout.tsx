import { ThirdwebProvider } from '@/providers/thirdweb-provider'
import { authedOnly } from '../actions/auth'

export default async function Layout({ children }: { children: React.ReactNode }): Promise<JSX.Element> {
  const parsedJWT = await authedOnly()

  return <ThirdwebProvider>{children}</ThirdwebProvider>
}

import { ThirdwebProvider } from '@/providers/thirdweb-provider'

export default async function Layout({ children }: { children: React.ReactNode }): Promise<JSX.Element> {
  return <ThirdwebProvider>{children}</ThirdwebProvider>
}
